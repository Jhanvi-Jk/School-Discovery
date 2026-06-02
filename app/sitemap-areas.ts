// sitemap-areas — neighbourhood/sub-locality landing pages.
// Covers high-intent searches like "schools in Whitefield Bengaluru".
// Only includes areas with at least one school listing.
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

const CITY_SLUG_MAP: Record<string, string> = {
  Bengaluru: "bengaluru",
  Delhi:     "delhi",
  Chennai:   "chennai",
  Mumbai:    "mumbai",
};

export default async function sitemapAreas(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Pull distinct city+area combos that have at least one school
  const { data } = await supabase
    .from("schools_with_details")
    .select("city, area")
    .not("area", "is", null)
    .not("total_fees_min", "is", null);

  if (!data) return [];

  // Deduplicate and build URLs
  const seen = new Set<string>();
  const urls: MetadataRoute.Sitemap = [];

  for (const row of data) {
    if (!row.city || !row.area) continue;
    const citySlug = CITY_SLUG_MAP[row.city];
    if (!citySlug) continue;

    const areaSlug = row.area.toLowerCase().replace(/\s+/g, "-");
    const key = `${citySlug}/${areaSlug}`;
    if (seen.has(key)) continue;
    seen.add(key);

    urls.push({
      url: `${APP_URL}/schools/${citySlug}/${areaSlug}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.72,
    });
  }

  return urls;
}
