import type { Metadata } from "next";
import Link from "next/link";
import { unstable_cache } from "next/cache";
import { ContentPage } from "@/components/layout/ContentPage";
import { AdmissionAlertForm } from "@/components/forms/AdmissionAlertForm";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchAllRows, fetchByIds } from "@/lib/supabase/fetchAll";
import { formatAcademicYear, formatAdmissionDate, resolveAdmissionState, todayISO } from "@/lib/admissions";
import { CITIES } from "@/lib/cities";
import { SITE_URL } from "@/lib/site";

export const revalidate = 1800;

export const metadata: Metadata = {
  title: "School Admission Calendar — Open & Upcoming Admission Dates",
  description: "Admission windows that are open now or opening soon, sorted by deadline. Set an email or WhatsApp alert so you never miss a school's application dates.",
  alternates: { canonical: `${SITE_URL}/admission-calendar` },
};

interface Entry {
  key: string;
  state: "open" | "upcoming";
  slug: string; name: string; city: string; area: string | null;
  academic_year: string | null; grade_from: string | null; grade_to: string | null;
  opens_at: string | null; closes_at: string | null; is_mid_year: boolean; application_url: string | null;
}

async function loadEntries(): Promise<Entry[]> {
  const supabase = createPublicClient();
  const today = todayISO();
  const windows = await fetchAllRows<any>((from, to) =>
    supabase.from("admission_windows")
      .select("id, school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year, application_url")
      .order("id").range(from, to)
  );
  const live = windows
    .map((w) => ({ w, state: resolveAdmissionState(w, today) }))
    .filter((x): x is { w: any; state: "open" | "upcoming" } => x.state === "open" || x.state === "upcoming");
  const ids = [...new Set(live.map((x) => x.w.school_id))] as string[];
  // Going through the listing view drops schools we've hidden
  const schools = await fetchByIds<any>(ids, (batch) =>
    supabase.from("schools_with_details").select("id, slug, name, city, area").in("id", batch)
  );
  const byId = new Map(schools.map((s) => [s.id, s]));
  return live.flatMap(({ w, state }) => {
    const s = byId.get(w.school_id);
    if (!s) return [];
    return [{
      key: w.id, state, slug: s.slug, name: s.name, city: s.city, area: s.area,
      academic_year: w.academic_year, grade_from: w.grade_from, grade_to: w.grade_to,
      opens_at: w.opens_at, closes_at: w.closes_at, is_mid_year: !!w.is_mid_year, application_url: w.application_url,
    }];
  });
}

const getEntries = unstable_cache(loadEntries, ["admission-calendar"], { revalidate: 1800 });

function Row({ e }: { e: Entry }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", padding: "12px 0", borderTop: "1px solid var(--beige-400)" }}>
      <div style={{ minWidth: 0 }}>
        <Link href={`/schools/${e.slug}`} style={{ fontWeight: 700, color: "var(--dark)" }}>{e.name}</Link>
        <p style={{ fontSize: 12, color: "var(--muted)" }}>
          {[e.area, e.city].filter(Boolean).join(", ")}
          {e.academic_year && ` · ${formatAcademicYear(e.academic_year)}`}
          {e.grade_from && ` · ${e.grade_from}${e.grade_to && e.grade_to !== e.grade_from ? ` – ${e.grade_to}` : ""}`}
          {e.is_mid_year && " · Mid-year"}
        </p>
      </div>
      <div style={{ textAlign: "right", fontSize: 12, color: "var(--muted)" }}>
        {e.state === "open" ? (
          <span style={{ fontWeight: 700, color: e.closes_at ? "#166534" : "var(--dark)" }}>
            {e.closes_at ? `Closes ${formatAdmissionDate(e.closes_at)}` : "Closing date not published"}
          </span>
        ) : (
          <span style={{ fontWeight: 700, color: "var(--dark)" }}>Opens {formatAdmissionDate(e.opens_at)}</span>
        )}
        {e.application_url && (
          <div><a href={e.application_url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>Apply online ↗</a></div>
        )}
      </div>
    </div>
  );
}

export default async function AdmissionCalendarPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const { city } = await searchParams;
  const selected = CITIES.find((c) => c.slug === city);
  let entries: Entry[] = [];
  let failed = false;
  try { entries = await getEntries(); } catch (e) { failed = true; console.error("admission calendar failed", e); }
  if (selected) entries = entries.filter((e) => e.city === selected.dbName);

  const open = entries.filter((e) => e.state === "open")
    .sort((a, b) => (a.closes_at ?? "9999").localeCompare(b.closes_at ?? "9999") || a.name.localeCompare(b.name));
  const upcoming = entries.filter((e) => e.state === "upcoming")
    .sort((a, b) => (a.opens_at ?? "9999").localeCompare(b.opens_at ?? "9999") || a.name.localeCompare(b.name));

  return (
    <ContentPage
      wide
      eyebrow="Admission tools"
      title="Admission calendar"
      lead="Admission windows that are open now or opening soon — nearest deadline first. Dates come from each school's published windows."
    >
      <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 20, alignItems: "start" }}>
        <div className="lg:col-span-2">
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 14 }}>
            <Link href="/admission-calendar" className={selected ? "btn-secondary" : "btn-primary"} style={{ padding: "6px 14px", fontSize: 13 }}>All cities</Link>
            {CITIES.map((c) => (
              <Link key={c.slug} href={`/admission-calendar?city=${c.slug}`} className={selected?.slug === c.slug ? "btn-primary" : "btn-secondary"} style={{ padding: "6px 14px", fontSize: 13 }}>{c.label}</Link>
            ))}
          </div>

          {failed ? (
            <div className="content-card"><p style={{ fontSize: 14, color: "var(--muted)" }}>The calendar is temporarily unavailable. Please try again in a few minutes.</p></div>
          ) : (
            <>
              <section className="content-card">
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--dark)", marginBottom: 4 }}>Open now ({open.length})</h2>
                {open.length === 0 ? (
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>
                    No school in our data has an admission window open right now{selected ? ` in ${selected.label}` : ""}. Many schools open the next academic year&apos;s applications in the autumn — set an alert and we&apos;ll tell you.
                  </p>
                ) : open.map((e) => <Row key={e.key} e={e} />)}
              </section>
              <section className="content-card">
                <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--dark)", marginBottom: 4 }}>Opening soon ({upcoming.length})</h2>
                {upcoming.length === 0 ? (
                  <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.6 }}>No upcoming windows with published dates yet.</p>
                ) : upcoming.map((e) => <Row key={e.key} e={e} />)}
              </section>
            </>
          )}
          <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.6 }}>
            Schools can change dates at short notice — confirm with the school before you plan around a deadline. Not sure of the age rules? Use the <Link href="/tools/age-calculator" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>age calculator</Link> and keep the <Link href="/tools/documents-checklist" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>document checklist</Link> handy.
          </p>
        </div>

        <aside className="content-card" style={{ position: "sticky", top: 72 }}>
          <h2 style={{ fontSize: 16, fontWeight: 800, color: "var(--dark)", marginBottom: 4 }}>Get deadline alerts</h2>
          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 14, lineHeight: 1.5 }}>Choose a city and grade; we&apos;ll message you when windows open.</p>
          <AdmissionAlertForm />
        </aside>
      </div>
    </ContentPage>
  );
}
