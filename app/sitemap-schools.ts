// sitemap-schools — individual school profile pages.
// Separated so Search Console can track profile indexing independently
// from hub pages. Only includes non-thin profiles (fee data present).
import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export default async function sitemapSchools(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from("schools_with_details")
    .select("slug, updated_at, avg_rating, review_count")
    .not("total_fees_min", "is", null)
    .order("avg_rating", { ascending: false, nullsFirst: false });

  return (schools || []).map((s) => ({
    url: `${APP_URL}/schools/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    // Profiles with reviews get "weekly" (more likely to be updated);
    // others get "monthly" to conserve crawl budget.
    changeFrequency: (s.review_count ?? 0) > 0 ? "weekly" : "monthly",
    // Higher-rated schools get slightly more crawl priority
    priority: s.avg_rating && s.avg_rating >= 4 ? 0.8 : 0.65,
  }));
}
