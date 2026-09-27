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
