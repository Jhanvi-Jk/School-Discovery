// Pure, dependency-free school catalogue logic shared by server pages, the API and the
// Explore client. Every list, count and facet on the site is computed by these functions
// from the same rows, so a city page, an area page and the Explore sidebar cannot disagree.

export type GeoPrecision = "rooftop" | "street" | "locality";
export type AdmissionBadge = "open" | "upcoming" | "waitlist" | "closed" | "unknown";

export interface CatalogSchool {
  id: string;
  slug: string;
  name: string;
  city: string;
  area: string | null;
  areaSlug: string | null;
  lat: number | null;
  lng: number | null;
  geoPrecision: GeoPrecision | null;
  address: string | null;
  type: string;
  gender: string;
  curricula: string[];
  feesMin: number | null;
  feesMax: number | null;
  rating: number | null;
  reviewCount: number;
  admission: { state: AdmissionBadge; label: string | null };
  midYearOpen: boolean;
  /** Inclusive grade index ranges, see gradeIndex() */
  grades: [number, number][];
  hasTransport: boolean | null;
  str: number | null;
  sports: string[];
  extracurriculars: string[];
  languages: string[];
  /** Usable description only (never filler / internal notes), trimmed for listings */
  about: string | null;
  coverImage: string | null;
  completeness: { score: number; missing: string[]; showVerified: boolean };
  createdAt: string | null;
}

// ── Slugs ────────────────────────────────────────────────────────────────────

/** "Jayanagar 4th Block" → "jayanagar-4th-block", "S.G. Palya" → "sg-palya". Mirrors SQL slugify_area(). */
export function slugifyArea(name: string | null | undefined): string | null {
  if (!name) return null;
  const s = name
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[.'’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return s || null;
}

// ── Grades ───────────────────────────────────────────────────────────────────

const PRE_PRIMARY: Record<string, number> = {
  playgroup: -4, "pre-nursery": -4, prenursery: -4, "pre-kg": -3, tk: -3, nursery: -3, "pre-primary": -3,
  prep: -2, kg: -2, kg1: -2, lkg: -2, ukg: -1, kg2: -1,
};

/** Nursery = -3, LKG = -2, UKG = -1, Class/Grade N = N. null when unrecognised. */
export function gradeIndex(label: string | null | undefined): number | null {
  if (!label) return null;
  const t = label.trim().toLowerCase();
  if (t in PRE_PRIMARY) return PRE_PRIMARY[t];
  const m = t.match(/^(?:class|grade|std\.?|standard)\s*(\d{1,2})$/);
  return m ? Number(m[1]) : null;
}

const PRE_PRIMARY_LABEL: Record<number, string> = { [-4]: "Playgroup", [-3]: "Nursery", [-2]: "LKG", [-1]: "UKG" };
const gradeName = (i: number) => PRE_PRIMARY_LABEL[i] ?? `Class ${i}`;

/**
 * Short grade-range badge for listing cards, so a pre-school or a Class 11–12-only
 * college is obvious next to K–12 schools: "Nursery–Class 12", "Pre-school only",
 * "Class 11–12 only". null when we hold no grade data.
 */
export function gradeRangeLabel(ranges: [number, number][]): string | null {
  if (ranges.length === 0) return null;
  const lo = Math.min(...ranges.map((r) => r[0]));
  const hi = Math.max(...ranges.map((r) => r[1]));
  if (hi <= -1) return "Pre-school only";
  if (lo >= 11) return `Class ${lo}–${hi} only`;
  return lo === hi ? gradeName(lo) : `${gradeName(lo)}–${gradeName(hi)}`;
}

export const GRADE_FILTER_OPTIONS: { label: string; index: number }[] = [
  { label: "Nursery", index: -3 }, { label: "LKG", index: -2 }, { label: "UKG", index: -1 },
  ...Array.from({ length: 12 }, (_, i) => ({ label: `Grade ${i + 1}`, index: i + 1 })),
];

// ── Filter state ↔ URL ───────────────────────────────────────────────────────

export type SortKey = "relevance" | "rating" | "fees_asc" | "fees_desc" | "distance" | "newest";
export const SORT_KEYS: SortKey[] = ["relevance", "rating", "fees_asc", "fees_desc", "distance", "newest"];

export interface ExploreState {
  city: string | null;      // city URL slug, e.g. "bengaluru"
  q: string;
  areas: string[];          // area slugs
  curricula: string[];      // db values: cbse, state_board…
  types: string[];
  gender: string[];
  grades: string[];         // GRADE_FILTER_OPTIONS labels
  feesMin: number | null;
  feesMax: number | null;
  admissionsOpen: boolean;
  midYear: boolean;
  transport: boolean;
  sports: string[];
  extracurriculars: string[];
  languages: string[];
  bbox: [number, number, number, number] | null; // west,south,east,north
  sort: SortKey;
  page: number;
  view: "grid" | "map";
}

export const EMPTY_STATE: ExploreState = {
  city: null, q: "", areas: [], curricula: [], types: [], gender: [], grades: [],
  feesMin: null, feesMax: null, admissionsOpen: false, midYear: false, transport: false,
  sports: [], extracurriculars: [], languages: [], bbox: null, sort: "relevance", page: 1, view: "grid",
};

/** URL uses hyphens (state-board); the database uses underscores (state_board). */
export const boardToUrl = (db: string) => db.replace(/_/g, "-");
export const boardFromUrl = (v: string) => v.trim().toLowerCase().replace(/-/g, "_");

const list = (sp: URLSearchParams, key: string) =>
  sp.getAll(key).flatMap((v) => v.split(",")).map((v) => v.trim()).filter(Boolean);
const posInt = (v: string | null) => {
  const n = v == null ? NaN : Number(v);
  return Number.isFinite(n) && n >= 0 ? Math.round(n) : null;
};

export function parseExploreState(sp: URLSearchParams): ExploreState {
  const sort = sp.get("sort") as SortKey;
  const bbox = (sp.get("bbox") || "").split(",").map(Number);
  return {
    city: sp.get("city")?.toLowerCase() || null,
    q: (sp.get("q") || "").slice(0, 100),
    areas: list(sp, "area").map((a) => slugifyArea(a)!).filter(Boolean),
    curricula: list(sp, "curriculum").map(boardFromUrl),
    types: list(sp, "type"),
    gender: list(sp, "gender"),
    grades: list(sp, "grade"),
    feesMin: posInt(sp.get("fees_min")),
    feesMax: posInt(sp.get("fees_max")),
    admissionsOpen: sp.get("admissions_open") === "true",
    midYear: sp.get("mid_year") === "true",
    transport: sp.get("transport") === "true" || sp.get("has_transport") === "true",
    sports: list(sp, "sport"),
    extracurriculars: list(sp, "extracurricular"),
    languages: list(sp, "language"),
    bbox: bbox.length === 4 && bbox.every(Number.isFinite) ? (bbox as [number, number, number, number]) : null,
    sort: SORT_KEYS.includes(sort) ? sort : "relevance",
    page: Math.max(1, posInt(sp.get("page")) || 1),
    view: sp.get("view") === "map" ? "map" : "grid",
  };
}

/** Canonical query string: stable key order, defaults omitted, so equal states give equal URLs. */
export function serializeExploreState(s: ExploreState): string {
  const p = new URLSearchParams();
  if (s.city) p.set("city", s.city);
  if (s.q.trim()) p.set("q", s.q.trim());
  if (s.areas.length) p.set("area", s.areas.join(","));
  if (s.curricula.length) p.set("curriculum", s.curricula.map(boardToUrl).join(","));
  if (s.types.length) p.set("type", s.types.join(","));
  if (s.gender.length) p.set("gender", s.gender.join(","));
  if (s.grades.length) p.set("grade", s.grades.join(","));
  if (s.feesMin) p.set("fees_min", String(s.feesMin));
  if (s.feesMax) p.set("fees_max", String(s.feesMax));
  if (s.admissionsOpen) p.set("admissions_open", "true");
  if (s.midYear) p.set("mid_year", "true");
  if (s.transport) p.set("transport", "true");
  if (s.sports.length) p.set("sport", s.sports.join(","));
  if (s.extracurriculars.length) p.set("extracurricular", s.extracurriculars.join(","));
  if (s.languages.length) p.set("language", s.languages.join(","));
  if (s.bbox) p.set("bbox", s.bbox.map((n) => n.toFixed(4)).join(","));
  if (s.sort !== "relevance") p.set("sort", s.sort);
  if (s.page > 1) p.set("page", String(s.page));
  if (s.view !== "grid") p.set("view", s.view);
  return p.toString();
}

/** Number of user-visible filters (not city/sort/page/view). */
export function activeFilterCount(s: ExploreState): number {
  return (s.q.trim() ? 1 : 0) + s.areas.length + s.curricula.length + s.types.length + s.gender.length +
    s.grades.length + (s.feesMin || s.feesMax ? 1 : 0) + (s.admissionsOpen ? 1 : 0) + (s.midYear ? 1 : 0) +
    (s.transport ? 1 : 0) + s.sports.length + s.extracurriculars.length + s.languages.length + (s.bbox ? 1 : 0);
}

// ── Search ───────────────────────────────────────────────────────────────────

const norm = (t: string) => t.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase().replace(/[.'’]/g, "");
const escapeRe = (t: string) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const tokens = (q: string) => norm(q).split(/[^a-z0-9]+/).filter(Boolean);

/**
 * Relevance of a school for a free-text query; 0 = no match. Every query word must
 * match at the START of a word somewhere (so "indus" no longer matches "Industrial").
 * Name matches outrank area matches, which outrank description matches.
 */
export function searchScore(s: Pick<CatalogSchool, "name" | "area" | "city" | "about" | "curricula">, q: string): number {
  const words = tokens(q);
  if (words.length === 0) return 1;
  const name = norm(s.name);
  const area = norm(`${s.area ?? ""} ${s.city}`);
  const boards = s.curricula.map((c) => c.replace(/_/g, " ")).join(" ");
  const about = norm(s.about ?? "");
  const whole = norm(q).trim();

  let score = 0;
  for (const w of words) {
    // whole-word match scores higher than a prefix match
    const exact = new RegExp(`(^|[^a-z0-9])${escapeRe(w)}($|[^a-z0-9])`);
    const prefix = new RegExp(`(^|[^a-z0-9])${escapeRe(w)}`);
    if (exact.test(name)) score += 100;
    else if (prefix.test(name)) score += 70;
    else if (exact.test(area)) score += 40;
    else if (prefix.test(area)) score += 30;
    else if (prefix.test(boards)) score += 25;
    else if (prefix.test(about)) score += 10;
    else return 0;
  }
  if (name === whole) score += 500;
  else if (name.startsWith(whole)) score += 200;
  return score;
}

// ── Filtering & facets ───────────────────────────────────────────────────────

type FacetKey = "areas" | "curricula" | "types" | "gender" | "grades" | "sports" | "extracurriculars" | "languages";

function matches(s: CatalogSchool, st: ExploreState, skip?: FacetKey): boolean {
  if (skip !== "areas" && st.areas.length && !(s.areaSlug && st.areas.includes(s.areaSlug))) return false;
  if (skip !== "curricula" && st.curricula.length && !st.curricula.some((c) => s.curricula.includes(c))) return false;
  if (skip !== "types" && st.types.length && !st.types.includes(s.type)) return false;
  if (skip !== "gender" && st.gender.length && !st.gender.includes(s.gender)) return false;
  if (skip !== "grades" && st.grades.length) {
    const wanted = st.grades.map((g) => GRADE_FILTER_OPTIONS.find((o) => o.label === g)?.index ?? gradeIndex(g)).filter((g): g is number => g != null);
    if (!wanted.some((g) => s.grades.some(([lo, hi]) => g >= lo && g <= hi))) return false;
  }
  if (skip !== "sports" && st.sports.length && !st.sports.every((x) => s.sports.includes(x))) return false;
  if (skip !== "extracurriculars" && st.extracurriculars.length && !st.extracurriculars.every((x) => s.extracurriculars.includes(x))) return false;
  if (skip !== "languages" && st.languages.length && !st.languages.some((x) => s.languages.includes(x))) return false;
  // Fee range: a school matches when its published range overlaps the chosen range
  if (st.feesMin && !(s.feesMax ?? s.feesMin) ) return false;
  if (st.feesMin && (s.feesMax ?? s.feesMin)! < st.feesMin) return false;
  if (st.feesMax && !(s.feesMin ?? s.feesMax)) return false;
  if (st.feesMax && (s.feesMin ?? s.feesMax)! > st.feesMax) return false;
  if (st.admissionsOpen && s.admission.state !== "open") return false;
  if (st.midYear && !s.midYearOpen) return false;
  if (st.transport && s.hasTransport !== true) return false;
  if (st.bbox) {
    if (s.lat == null || s.lng == null) return false;
    const [w, so, e, n] = st.bbox;
    if (s.lng < w || s.lng > e || s.lat < so || s.lat > n) return false;
  }
  return true;
}

export interface FilterResult {
  /** Matching schools, sorted */
  schools: CatalogSchool[];
  /** Facet counts: how many schools each option would give with every OTHER filter applied */
  facets: Record<FacetKey, Record<string, number>>;
}

function haversineKm(a: [number, number], b: [number, number]): number {
  const R = 6371, rad = Math.PI / 180;
  const dLat = (b[0] - a[0]) * rad, dLng = (b[1] - a[1]) * rad;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a[0] * rad) * Math.cos(b[0] * rad) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

export function distanceKm(s: CatalogSchool, home: [number, number] | null): number | null {
  if (!home || s.lat == null || s.lng == null) return null;
  return Math.round(haversineKm(home, [s.lat, s.lng]) * 10) / 10;
}

/** Search AND every filter, then sort. `home` is only used by the distance sort. */
export function filterSchools(all: CatalogSchool[], st: ExploreState, home: [number, number] | null = null): FilterResult {
  // Text search narrows first; facets are counted inside the searched set so search and filters combine (AND)
  const scored = new Map<string, number>();
  const searched = st.q.trim()
    ? all.filter((s) => { const sc = searchScore(s, st.q); if (sc > 0) scored.set(s.id, sc); return sc > 0; })
    : all;

  const facets = {} as FilterResult["facets"];
  const count = (key: FacetKey, values: (s: CatalogSchool) => (string | null)[]) => {
    const out: Record<string, number> = {};
    for (const s of searched) {
      if (!matches(s, st, key)) continue;
      for (const v of new Set(values(s))) if (v) out[v] = (out[v] || 0) + 1;
    }
    facets[key] = out;
  };
  count("areas", (s) => [s.areaSlug]);
  count("curricula", (s) => s.curricula);
  count("types", (s) => [s.type]);
  count("gender", (s) => [s.gender]);
  count("grades", (s) => GRADE_FILTER_OPTIONS.filter((o) => s.grades.some(([lo, hi]) => o.index >= lo && o.index <= hi)).map((o) => o.label));
  count("sports", (s) => s.sports);
  count("extracurriculars", (s) => s.extracurriculars);
  count("languages", (s) => s.languages);

  const schools = searched.filter((s) => matches(s, st));
  const byName = (a: CatalogSchool, b: CatalogSchool) => a.name.localeCompare(b.name) || a.id.localeCompare(b.id);
  const nullsLast = (a: number | null, b: number | null, dir: 1 | -1) =>
    a == null && b == null ? 0 : a == null ? 1 : b == null ? -1 : (a - b) * dir;

  const sorters: Record<SortKey, (a: CatalogSchool, b: CatalogSchool) => number> = {
    relevance: (a, b) =>
      (scored.get(b.id) ?? 0) - (scored.get(a.id) ?? 0) ||
      (b.reviewCount > 0 ? b.rating ?? 0 : 0) - (a.reviewCount > 0 ? a.rating ?? 0 : 0) ||
      b.completeness.score - a.completeness.score || byName(a, b),
    rating: (a, b) => nullsLast(a.reviewCount ? a.rating : null, b.reviewCount ? b.rating : null, -1) || b.reviewCount - a.reviewCount || byName(a, b),
    fees_asc: (a, b) => nullsLast(a.feesMin ?? a.feesMax, b.feesMin ?? b.feesMax, 1) || byName(a, b),
    fees_desc: (a, b) => nullsLast(a.feesMax ?? a.feesMin, b.feesMax ?? b.feesMin, -1) || byName(a, b),
    distance: (a, b) => nullsLast(distanceKm(a, home), distanceKm(b, home), 1) || byName(a, b),
    newest: (a, b) => (b.createdAt ?? "").localeCompare(a.createdAt ?? "") || byName(a, b),
  };
  schools.sort(sorters[st.sort === "distance" && !home ? "relevance" : st.sort]);
  return { schools, facets };
}

export const PAGE_SIZE = 24;
export function paginate<T>(rows: T[], page: number, size = PAGE_SIZE) {
  const pages = Math.max(1, Math.ceil(rows.length / size));
  const p = Math.min(Math.max(1, page), pages);
  return { rows: rows.slice((p - 1) * size, p * size), page: p, pages };
}

// ── Areas ────────────────────────────────────────────────────────────────────

export interface AreaStat { slug: string; name: string; count: number }

/** Every area in a set of schools with its count — the one list the city page, sidebar and area pages share. */
export function areaStats(schools: CatalogSchool[]): AreaStat[] {
  const by = new Map<string, { names: Map<string, number>; count: number }>();
  for (const s of schools) {
    if (!s.areaSlug || !s.area) continue;
    const e = by.get(s.areaSlug) ?? { names: new Map(), count: 0 };
    e.count++;
    e.names.set(s.area, (e.names.get(s.area) || 0) + 1);
    by.set(s.areaSlug, e);
  }
  return [...by.entries()]
    .map(([slug, e]) => ({ slug, count: e.count, name: [...e.names.entries()].sort((a, b) => b[1] - a[1])[0][0] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

/** Only offer a filter when enough schools actually have the data (audit 3.11). */
export const MIN_FACET_COVERAGE = 0.3;
export function facetCoverage(schools: CatalogSchool[], has: (s: CatalogSchool) => boolean): number {
  if (schools.length === 0) return 0;
  return schools.filter(has).length / schools.length;
}

// ── Display helpers ──────────────────────────────────────────────────────────

export const CURRICULUM_DISPLAY: Record<string, string> = {
  cbse: "CBSE", icse: "ICSE", ib: "IB", igcse: "IGCSE", state_board: "State Board", cambridge: "Cambridge",
};
export const curriculumLabel = (c: string) => CURRICULUM_DISPLAY[c.toLowerCase()] ?? c.replace(/_/g, " ").replace(/\b\w/g, (x) => x.toUpperCase());

/** Replace raw enum codes that leaked into prose ("Offers STATE_BOARD curriculum"). */
export function humaniseEnums(text: string): string {
  return text.replace(/\b(STATE_BOARD|CBSE|ICSE|IB|IGCSE|CAMBRIDGE)\b/g, (m) => curriculumLabel(m));
}
