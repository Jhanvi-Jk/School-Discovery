import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { CITIES, MIN_SCHOOLS_FOR_LIVE_CITY, type CityConfig } from "@/lib/cities";

// The single source of truth for "how many schools do we have". The meta descriptions,
// city cards, hub pages and hero copy all call this, so the numbers can't disagree.
// Counts come from schools_with_details, which already excludes unlisted entries.

export interface CityStat extends CityConfig {
  count: number;
  /** false → show "coming soon" instead of an empty listing */
  live: boolean;
}

export interface SiteStats {
  total: number;
  cities: CityStat[];
  liveCities: CityStat[];
}

const EMPTY: SiteStats = {
  total: 0,
  cities: CITIES.map((c) => ({ ...c, count: 0, live: false })),
  liveCities: [],
};

async function loadSiteStats(): Promise<SiteStats> {
  const supabase = createPublicClient();
  const results = await Promise.all(
    CITIES.map((c) =>
      supabase.from("schools_with_details").select("id", { count: "exact", head: true }).eq("city", c.dbName)
    )
  );
  // Throwing keeps a failed lookup out of the cache (unstable_cache never stores errors)
  const failed = results.find((r) => r.error);
  if (failed) throw failed.error;

  const cities: CityStat[] = CITIES.map((c, i) => {
    const count = results[i].count ?? 0;
    return { ...c, count, live: count >= MIN_SCHOOLS_FOR_LIVE_CITY };
  });
  return {
    // Only cities we present as live count towards the headline number
    total: cities.filter((c) => c.live).reduce((sum, c) => sum + c.count, 0),
    cities,
    liveCities: cities.filter((c) => c.live),
  };
}

const cachedSiteStats = unstable_cache(loadSiteStats, ["site-stats"], { revalidate: 3600, tags: ["site-stats"] });

export async function getSiteStats(): Promise<SiteStats> {
  try {
    return await cachedSiteStats();
  } catch (e) {
    console.error("site stats unavailable", e);
    return EMPTY;
  }
}

export { formatCount } from "@/lib/format";

/** "Bengaluru, Chennai and Delhi" — the cities that actually have listings */
export function liveCityNames(stats: SiteStats): string {
  const names = stats.liveCities.map((c) => c.label);
  if (names.length <= 1) return names.join("");
  return `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`;
}
