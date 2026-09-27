import type { SupabaseClient } from "@supabase/supabase-js";
import { unstable_cache } from "next/cache";
import { fetchAllRows } from "@/lib/supabase/fetchAll";
import { createPublicClient } from "@/lib/supabase/public";

// Loosely typed on purpose: callers pass server or route-handler clients whose
// generated `Database` types differ slightly, and this file only touches
// columns present on every variant.
type AnySupabaseClient = SupabaseClient<any, any, any>;

// Single source of truth for "are admissions open?". The `status` column on
// admission_windows is hand-entered and goes stale (every seeded window is
// 2025-26 but still says "open"), so the dates decide whenever they exist.
// The SQL view in migration 044 mirrors these rules.

export type AdmissionState = "open" | "upcoming" | "closed" | "waitlist";

export interface AdmissionWindowLike {
  status?: string | null;
  opens_at?: string | null;
  closes_at?: string | null;
  academic_year?: string | null;
  is_mid_year?: boolean | null;
}

export interface AdmissionSummary {
  state: AdmissionState | "unknown";
  academicYear: string | null;
  opensAt: string | null;
  closesAt: string | null;
}

/** Today as YYYY-MM-DD in India Standard Time (ISO date strings compare lexically). */
export function todayISO(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Asia/Kolkata" }).format(now);
}

// Indian academic years start in April
function currentAcademicStartYear(today: string): number {
  const [y, m] = today.split("-").map(Number);
  return m >= 4 ? y : y - 1;
}

/** "2026-27" — the academic year running on this date (Indian years start in April). */
export function currentAcademicYear(today = todayISO()): string {
  const start = currentAcademicStartYear(today);
  return `${start}-${String(start + 1).slice(2)}`;
}

export function resolveAdmissionState(w: AdmissionWindowLike, today = todayISO()): AdmissionState {
  if (w.closes_at && w.closes_at < today) return "closed";
  if (w.opens_at && w.opens_at > today) return "upcoming";

  // No closing date to go on: a window for a past academic year can't still be open
  if (!w.closes_at && w.academic_year) {
    const start = parseInt(w.academic_year, 10);
    if (!isNaN(start) && start < currentAcademicStartYear(today)) return "closed";
  }

  if (w.status === "closed") return "closed";
  if (w.status === "waitlist") return "waitlist";
  if (w.status === "open") return "open";
  // Stored as "upcoming" but the dates say the window is running right now
  return w.opens_at && w.closes_at ? "open" : "upcoming";
}

const STATE_PRIORITY: Record<AdmissionState, number> = { open: 0, waitlist: 1, upcoming: 2, closed: 3 };

export function summarizeAdmissions(
  windows: AdmissionWindowLike[] | null | undefined,
  today = todayISO()
): AdmissionSummary {
  if (!windows || windows.length === 0) {
    return { state: "unknown", academicYear: null, opensAt: null, closesAt: null };
  }
  const resolved = windows.map((w) => ({ w, state: resolveAdmissionState(w, today) }));
  resolved.sort((a, b) => {
    if (STATE_PRIORITY[a.state] !== STATE_PRIORITY[b.state]) return STATE_PRIORITY[a.state] - STATE_PRIORITY[b.state];
    // Same state: upcoming → soonest first; everything else → most recent first
    const ad = a.w.opens_at ?? "";
    const bd = b.w.opens_at ?? "";
    return a.state === "upcoming" ? ad.localeCompare(bd) : bd.localeCompare(ad);
  });
  const best = resolved[0];
  return {
    state: best.state,
    academicYear: best.w.academic_year ?? null,
    opensAt: best.w.opens_at ?? null,
    closesAt: best.w.closes_at ?? null,
  };
}

export function isAdmissionOpen(windows: AdmissionWindowLike[] | null | undefined, today = todayISO()): boolean {
  return (windows ?? []).some((w) => resolveAdmissionState(w, today) === "open");
}

/** "2025-26" → "2025–26" */
export function formatAcademicYear(y: string | null | undefined): string {
  return y ? y.replace("-", "–") : "";
}

/** "2026-03-01" → "1 Mar 2026". Date-only strings are formatted in UTC so they never shift a day. */
export function formatAdmissionDate(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(`${iso.slice(0, 10)}T00:00:00Z`);
  if (isNaN(d.getTime())) return "";
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
}

/** Short human label, identical on the listing card, compare table and profile. */
export function admissionLabel(s: AdmissionSummary): string {
  switch (s.state) {
    case "open":
      return s.academicYear ? `Admissions open ${formatAcademicYear(s.academicYear)}` : "Admissions open";
    case "waitlist":
      return "Waitlist only";
    case "upcoming":
      return s.opensAt ? `Opens ${formatAdmissionDate(s.opensAt)}` : "Opening soon";
    case "closed":
      return s.academicYear ? `Closed for ${formatAcademicYear(s.academicYear)}` : "Closed";
    default:
      return "Dates not published";
  }
}

// ── Server-side helpers ──────────────────────────────────────────────────────

export interface AdmissionIndex {
  bySchool: Map<string, AdmissionSummary>;
  openIds: Set<string>;
  midYearOpenIds: Set<string>;
}

type WindowRow = AdmissionWindowLike & { school_id: string };

// The whole table is a few hundred rows and changes rarely, so it is fetched once per
// few minutes and shared by every request instead of being re-read for each listing call.
const loadWindowRows = unstable_cache(
  async (): Promise<WindowRow[]> => {
    const supabase = createPublicClient();
    return fetchAllRows<WindowRow>((from, to) =>
      supabase
        .from("admission_windows")
        .select("school_id, status, opens_at, closes_at, academic_year, is_mid_year")
        .order("school_id")
        .range(from, to)
    );
  },
  ["admission-window-rows"],
  { revalidate: 300, tags: ["admission-windows"] }
);

/** Per-school admission summaries built from the (cached) admission_windows rows. */
export async function loadAdmissionIndex(): Promise<AdmissionIndex> {
  const rows = await loadWindowRows();

  const grouped = new Map<string, WindowRow[]>();
  rows.forEach((r) => {
    if (!grouped.has(r.school_id)) grouped.set(r.school_id, []);
    grouped.get(r.school_id)!.push(r);
  });

  const today = todayISO();
  const bySchool = new Map<string, AdmissionSummary>();
  const openIds = new Set<string>();
  const midYearOpenIds = new Set<string>();
  grouped.forEach((windows, id) => {
    bySchool.set(id, summarizeAdmissions(windows, today));
    if (isAdmissionOpen(windows, today)) openIds.add(id);
    if (isAdmissionOpen(windows.filter((w) => w.is_mid_year), today)) midYearOpenIds.add(id);
  });
  return { bySchool, openIds, midYearOpenIds };
}

/**
 * Overwrites the stale `admissions_open` / `mid_year_available` flags that the
 * database view computes from `status` alone, so every listing agrees with the profile page.
 */
export async function applyAdmissionState<T extends { id: string }>(
  _supabase: AnySupabaseClient | null,
  schools: T[]
): Promise<(T & { admissions_open?: boolean | null; mid_year_available?: boolean | null; admission_year?: string | null })[]> {
  const index = await loadAdmissionIndex().catch(() => null);
  // If the windows can't be read, leave the view's flags alone rather than blanking them
  if (!index) return schools;
  return schools.map((s) => {
    const open = index.openIds.has(s.id);
    return {
      ...s,
      admissions_open: open,
      mid_year_available: index.midYearOpenIds.has(s.id),
      admission_year: open ? index.bySchool.get(s.id)?.academicYear ?? null : null,
    };
  });
}
