// One place that knows which cities the site covers. Header, footer, sitemap,
// city hub pages and the city picker all read from here so they can't drift.

export interface CityConfig {
  /** URL segment: /schools/bengaluru */
  slug: string;
  /** Key used by the client city store */
  key: "bangalore" | "delhi" | "chennai" | "mumbai";
  /** Exact value in schools.city */
  dbName: string;
  label: string;
  state: string;
  tagline: string;
  /** Boards commonly offered — used for hub-page links and copy */
  boards: string[];
}

export const CITIES: CityConfig[] = [
  { slug: "bengaluru", key: "bangalore", dbName: "Bengaluru", label: "Bengaluru", state: "Karnataka",
    tagline: "India's tech capital", boards: ["cbse", "icse", "ib", "igcse", "cambridge", "state-board"] },
  { slug: "delhi", key: "delhi", dbName: "Delhi", label: "Delhi", state: "Delhi",
    tagline: "The national capital", boards: ["cbse", "icse", "ib", "igcse", "cambridge"] },
  { slug: "chennai", key: "chennai", dbName: "Chennai", label: "Chennai", state: "Tamil Nadu",
    tagline: "Gateway to the South", boards: ["cbse", "icse", "ib", "cambridge", "state-board"] },
  { slug: "mumbai", key: "mumbai", dbName: "Mumbai", label: "Mumbai", state: "Maharashtra",
    tagline: "India's financial hub", boards: ["cbse", "icse", "ib", "cambridge", "state-board"] },
];

const BY_SLUG: Record<string, CityConfig> = {
  ...Object.fromEntries(CITIES.map((c) => [c.slug, c])),
  bangalore: CITIES[0], // legacy spelling still resolves
};

export function cityFromSlug(slug: string): CityConfig | undefined {
  return BY_SLUG[slug.toLowerCase()];
}

export function cityFromDbName(name: string | null | undefined): CityConfig | undefined {
  if (!name) return undefined;
  return CITIES.find((c) => c.dbName.toLowerCase() === name.toLowerCase());
}

/** Cities announced in the picker but not launched: shown disabled with a "Coming soon" tag. */
export const COMING_SOON_CITIES: { slug: string; label: string }[] = [
  { slug: "pune", label: "Pune" },
  { slug: "kolkata", label: "Kolkata" },
];

export function comingSoonCity(slug: string) {
  return COMING_SOON_CITIES.find((c) => c.slug === slug.toLowerCase());
}

/** Query params that filter a listing. On a city hub URL they redirect to a page that honours them. */
export const LISTING_FILTER_PARAMS = [
  "curriculum", "gender", "type", "area", "grade", "fees_min", "fees_max", "q",
  "admissions_open", "mid_year", "transport", "has_transport", "sport", "extracurricular", "language", "sort",
];

/**
 * Where a city hub URL with filter params should go: a single board → its landing page
 * (/schools/bengaluru/ib), anything else → the Explore page with the same filters.
 * Returns null when there is nothing to redirect.
 */
export function hubRedirectTarget(citySlug: string, sp: URLSearchParams): string | null {
  const keys = [...new Set([...sp.keys()])].filter((k) => LISTING_FILTER_PARAMS.includes(k));
  if (keys.length === 0) return null;
  const city = cityFromSlug(citySlug);
  if (!city) return null;
  const boards = sp.getAll("curriculum").flatMap((v) => v.split(",")).map((b) => b.trim().toLowerCase().replace(/_/g, "-")).filter(Boolean);
  if (keys.length === 1 && keys[0] === "curriculum" && boards.length === 1 && BOARD_SLUGS[boards[0]]) {
    return `/schools/${city.slug}/${boards[0]}`;
  }
  const out = new URLSearchParams({ city: city.slug });
  sp.forEach((v, k) => {
    if (!LISTING_FILTER_PARAMS.includes(k)) return;
    out.append(k === "has_transport" ? "transport" : k, k === "curriculum" ? v.toLowerCase().replace(/_/g, "-") : v);
  });
  return `/schools?${out.toString()}`;
}

/** A city needs at least this many listed schools before we present it as live. */
export const MIN_SCHOOLS_FOR_LIVE_CITY = 10;

// ── Boards ───────────────────────────────────────────────────────────────────
// URL slug (hyphenated) ↔ DB enum value (underscored)
export const BOARD_SLUGS: Record<string, { db: string; label: string }> = {
  cbse:          { db: "cbse",        label: "CBSE" },
  icse:          { db: "icse",        label: "ICSE" },
  ib:            { db: "ib",          label: "IB" },
  igcse:         { db: "igcse",       label: "IGCSE" },
  cambridge:     { db: "cambridge",   label: "Cambridge" },
  "state-board": { db: "state_board", label: "State Board" },
};

export function boardFromSlug(slug: string) {
  return BOARD_SLUGS[slug.toLowerCase()];
}

export function boardSlugFromDb(db: string): string {
  return db.replace(/_/g, "-");
}

/** Canonical landing page for "<board> schools in <city>" — replaces ?curriculum= links. */
export function boardPageHref(citySlug: string, board: string): string {
  return `/schools/${citySlug}/${boardSlugFromDb(board)}`;
}
