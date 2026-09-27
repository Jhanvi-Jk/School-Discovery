import type { SupabaseClient } from "@supabase/supabase-js";
import { fetchAllRows, fetchByIds } from "@/lib/supabase/fetchAll";
import { applyAdmissionState, loadAdmissionIndex } from "@/lib/admissions";
import { haversineKm } from "@/lib/geo";
import type { SortOption } from "@/lib/types";

// Shared by the /api/v1/schools route and the server-rendered listing page, so the
// first paint and every later fetch come from exactly the same query.

type AnySupabaseClient = SupabaseClient<any, any, any>;
type Rows<T> = PromiseLike<{ data: T[] | null; error: unknown }>;

export interface SchoolSearchParams {
  city: string;
  query: string;
  areas: string[];
  curricula: string[];
  types: string[];
  gender: string[];
  grades: string[];
  sports: string[];
  extracurriculars: string[];
  languages: string[];
  fees_min: number;
  fees_max: number;
  str_max: number | null;
  has_transport: boolean;
  admissions_open: boolean;
  mid_year: boolean;
  sort: SortOption;
  page: number;
  limit: number;
  lean: boolean;
  lat: number | null;
  lng: number | null;
}

export const DEFAULT_LIMIT = 24;
export const MAX_LIMIT = 50;        // full cards
export const MAX_LEAN_LIMIT = 1000; // map pins: only a handful of columns per school
const LEAN_COLUMNS = "id, slug, name, area, city, latitude, longitude";

// Grade order for range-based filtering
const GRADE_ORDER = [
  "Nursery", "LKG", "UKG",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
];
// The database stores "Class 10"; the filter UI says "Grade 10"
const normaliseGrade = (g: string) => g.replace(/^class\s+/i, "Grade ");

export function gradeInRange(grade: string, from: string, to: string): boolean {
  const gi = GRADE_ORDER.indexOf(normaliseGrade(grade));
  const fi = GRADE_ORDER.indexOf(normaliseGrade(from));
  const ti = GRADE_ORDER.indexOf(normaliseGrade(to));
  if (gi === -1 || fi === -1 || ti === -1) return false;
  return gi >= fi && gi <= ti;
}

const num = (v: string | null, fallback: number) => {
  const n = v == null ? NaN : Number(v);
  return Number.isFinite(n) ? n : fallback;
};

export function parseSearchParams(sp: URLSearchParams): SchoolSearchParams {
  const lean = sp.get("lean") === "1";
  const lat = sp.get("lat") != null ? num(sp.get("lat"), NaN) : NaN;
  const lng = sp.get("lng") != null ? num(sp.get("lng"), NaN) : NaN;
  const hasHome = Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  return {
    city: sp.get("city") || "",
    // Characters with meaning inside a PostgREST .or() expression would let a search term rewrite the filter
    query: (sp.get("q") || "").replace(/[,()*%\\]/g, " ").trim(),
    areas: sp.getAll("area"),
    curricula: sp.getAll("curriculum"),
    types: sp.getAll("type"),
    gender: sp.getAll("gender"),
    grades: sp.getAll("grade"),
    sports: sp.getAll("sport"),
    extracurriculars: sp.getAll("extracurricular"),
    languages: sp.getAll("language"),
    fees_min: Math.max(0, Math.trunc(num(sp.get("fees_min"), 0))),
    fees_max: Math.trunc(num(sp.get("fees_max"), 1000000)),
    str_max: sp.get("str_max") ? num(sp.get("str_max"), NaN) || null : null,
    has_transport: sp.get("has_transport") === "true",
    admissions_open: sp.get("admissions_open") === "true",
    mid_year: sp.get("mid_year") === "true",
    sort: (sp.get("sort") || "relevance") as SortOption,
    page: Math.max(1, Math.trunc(num(sp.get("page"), 1))),
    limit: Math.min(Math.max(1, Math.trunc(num(sp.get("limit"), DEFAULT_LIMIT))), lean ? MAX_LEAN_LIMIT : MAX_LIMIT),
    lean,
    lat: hasHome ? lat : null,
    lng: hasHome ? lng : null,
  };
}

// Filters the view can evaluate itself
function applyViewFilters(qb: any, p: SchoolSearchParams) {
  if (p.city) qb = qb.eq("city", p.city);
  // Case-insensitive partial match on name, area, or description
  if (p.query) qb = qb.or(`name.ilike.%${p.query}%,area.ilike.%${p.query}%,description.ilike.%${p.query}%`);
  if (p.areas.length > 0) qb = qb.in("area", p.areas);
  if (p.types.length > 0) qb = qb.in("type", p.types);
  if (p.gender.length > 0) qb = qb.in("gender", p.gender);
  if (p.fees_min > 0) qb = qb.gte("total_fees_min", p.fees_min);
  if (p.fees_max < 1000000) qb = qb.lte("total_fees_max", p.fees_max);
  if (p.str_max !== null) qb = qb.lte("student_teacher_ratio", p.str_max);
  if (p.has_transport) qb = qb.eq("has_transport", true);
  return qb;
}

// `id` is the final tiebreaker so rows never repeat or vanish between pages
function applySort(qb: any, p: SchoolSearchParams) {
  switch (p.sort) {
    case "fees_asc":
      qb = qb.order("total_fees_min", { ascending: true, nullsFirst: false });
      break;
    case "fees_desc":
      qb = qb.order("total_fees_max", { ascending: false, nullsFirst: false });
      break;
    case "rating":
      qb = qb.order("avg_rating", { ascending: false, nullsFirst: false });
      break;
    case "newest":
      qb = qb.order("created_at", { ascending: false });
      break;
    default:
      // Real parent ratings first, then team-verified, then A–Z.
      // With no city chosen, keep each city's schools together instead of interleaving them.
      // (Only columns present on every version of the view are used, so this can't 500.)
      if (!p.city) qb = qb.order("city", { ascending: true });
      qb = qb
        .order("avg_rating", { ascending: false, nullsFirst: false })
        .order("verified", { ascending: false })
        .order("name", { ascending: true });
      break;
  }
  return qb.order("id", { ascending: true });
}

const idSet = async (build: (from: number, to: number) => Rows<{ school_id: string }>) =>
  new Set((await fetchAllRows(build)).map((r) => r.school_id));

/** Ids allowed by the filters that live in other tables (sports, grades, admissions…). null = no such filter. */
async function junctionIds(supabase: AnySupabaseClient, p: SchoolSearchParams): Promise<Set<string> | null> {
  const sets: Set<string>[] = [];

  // Boards come from the junction table (not the view's curricula array) so listings keep
  // working on databases where that view column doesn't exist yet
  if (p.curricula.length > 0) {
    sets.push(await idSet((from, to) =>
      supabase.from("school_curricula").select("school_id").in("curriculum", p.curricula)
        .order("school_id").order("curriculum").range(from, to)));
  }
  if (p.sports.length > 0) {
    sets.push(await idSet((from, to) =>
      supabase.from("school_sports").select("school_id, sports!inner(name)").in("sports.name", p.sports)
        .order("school_id").order("sport_id").range(from, to)));
  }
  if (p.extracurriculars.length > 0) {
    sets.push(await idSet((from, to) =>
      supabase.from("school_extracurriculars").select("school_id, extracurriculars!inner(name)")
        .in("extracurriculars.name", p.extracurriculars)
        .order("school_id").order("extracurricular_id").range(from, to)));
  }
  if (p.languages.length > 0) {
    sets.push(await idSet((from, to) =>
      supabase.from("school_languages").select("school_id").in("language", p.languages)
        .eq("type", "medium_of_instruction")
        .order("school_id").order("language").range(from, to)));
  }
  if (p.grades.length > 0) {
    const ranges = await fetchAllRows<{ school_id: string; grade_from: string; grade_to: string }>((from, to) =>
      supabase.from("school_grades").select("school_id, grade_from, grade_to")
        .order("school_id").order("grade_from").order("grade_to").range(from, to));
    sets.push(new Set(
      ranges.filter((r) => p.grades.some((g) => gradeInRange(g, r.grade_from, r.grade_to))).map((r) => r.school_id)
    ));
  }
  if (p.admissions_open || p.mid_year) {
    // Decided from the window dates, not the hand-entered status column
    const index = await loadAdmissionIndex();
    if (p.admissions_open) sets.push(index.openIds);
    if (p.mid_year) sets.push(index.midYearOpenIds);
  }

  if (sets.length === 0) return null;
  let allowed = sets[0];
  for (const s of sets.slice(1)) allowed = new Set([...allowed].filter((id) => s.has(id)));
  return allowed;
}

export interface SchoolSearchResult {
  schools: any[];
  total: number;
}

export async function searchSchools(supabase: AnySupabaseClient, p: SchoolSearchParams): Promise<SchoolSearchResult> {
  const offset = (p.page - 1) * p.limit;
  const columns = p.lean ? LEAN_COLUMNS : "*";
  const byDistance = p.sort === "distance" && p.lat !== null && p.lng !== null;
  const allowed = await junctionIds(supabase, p);

  let schools: any[] = [];
  let total = 0;

  if (byDistance) {
    // Distance can't be ordered in SQL here, so rank every match (id + coordinates only) in memory
    const rows = await fetchAllRows<{ id: string; latitude: number | null; longitude: number | null }>((from, to) =>
      applyViewFilters(supabase.from("schools_with_details").select("id, latitude, longitude"), p).order("id").range(from, to)
    );
    const ranked = rows
      .filter((r) => !allowed || allowed.has(r.id))
      .map((r) => ({
        id: r.id,
        km: r.latitude != null && r.longitude != null ? haversineKm(p.lat!, p.lng!, Number(r.latitude), Number(r.longitude)) : Infinity,
      }))
      .sort((a, b) => a.km - b.km);
    total = ranked.length;
    schools = await fetchByIds<any>(ranked.slice(offset, offset + p.limit).map((r) => r.id), (batch) =>
      supabase.from("schools_with_details").select(columns).in("id", batch)
    );
  } else if (!allowed) {
    const { data, error, count } = await applySort(
      applyViewFilters(supabase.from("schools_with_details").select(columns, { count: "exact" }), p), p
    ).range(offset, offset + p.limit - 1);
    if (error) throw error;
    schools = data || [];
    total = count || 0;
  } else {
    // Ordered ids that pass the view filters, then keep only those in every id set
    const ordered = await fetchAllRows<{ id: string }>((from, to) =>
      applySort(applyViewFilters(supabase.from("schools_with_details").select("id"), p), p).range(from, to)
    );
    const matching = ordered.map((r) => r.id).filter((id) => allowed.has(id));
    total = matching.length;
    schools = await fetchByIds<any>(matching.slice(offset, offset + p.limit), (batch) =>
      supabase.from("schools_with_details").select(columns).in("id", batch)
    );
  }

  if (p.lean) return { schools, total };

  // Cards need each school's boards; the view's admissions_open trusts a hand-entered status,
  // so recompute it from the window dates.
  const ids = schools.map((s) => s.id);
  const { data: curriculaRows } = ids.length
    ? await supabase.from("school_curricula").select("school_id, curriculum").in("school_id", ids)
    : { data: [] as { school_id: string; curriculum: string }[] };
  const boardsById: Record<string, string[]> = {};
  (curriculaRows || []).forEach((r: any) => { (boardsById[r.school_id] ||= []).push(r.curriculum); });
  let enriched = await applyAdmissionState(supabase, schools.map((s) => ({ ...s, curricula: boardsById[s.id] || s.curricula || [] })));

  if (p.lat !== null && p.lng !== null) {
    enriched = enriched.map((s: any) => ({
      ...s,
      distance_km:
        s.latitude != null && s.longitude != null
          ? Math.round(haversineKm(p.lat!, p.lng!, Number(s.latitude), Number(s.longitude)) * 10) / 10
          : null,
    }));
  }
  return { schools: enriched, total };
}
