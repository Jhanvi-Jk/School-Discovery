// One sitemap for the whole site. (Next.js only serves sitemap.ts — the old sitemap-hubs /
// sitemap-areas / sitemap-schools files were never routes, so those URLs 404'd.)
// A few thousand URLs is far below the 50,000 limit, so no index file is needed.
import type { MetadataRoute } from "next";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchAllRows } from "@/lib/supabase/fetchAll";
import { getSiteStats } from "@/lib/siteStats";
import { BOARD_SLUGS, boardSlugFromDb } from "@/lib/cities";
import { POSTS } from "@/lib/blog/posts";
import { SITE_URL } from "@/lib/site";

export const revalidate = 3600;

const STATIC_PAGES: [string, number][] = [
  ["/schools", 1.0], ["/quiz", 0.7], ["/blog", 0.8], ["/admission-calendar", 0.7],
  ["/tools/age-calculator", 0.6], ["/tools/documents-checklist", 0.6],
  ["/how-we-verify", 0.5], ["/about", 0.4], ["/contact", 0.4], ["/schools/claim", 0.4],
  ["/privacy", 0.3], ["/terms", 0.3],
];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const urls: MetadataRoute.Sitemap = STATIC_PAGES.map(([path, priority]) => ({
    url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: "weekly", priority,
  }));

  POSTS.forEach((p) => urls.push({
    url: `${SITE_URL}/blog/${p.slug}`, lastModified: new Date(p.updated ?? p.published), changeFrequency: "monthly", priority: 0.7,
  }));

  try {
    const stats = await getSiteStats();
    const supabase = createPublicClient();

    // Only listed schools (the view excludes hidden ones) of cities that are actually live
    type Row = {
      slug: string; city: string; area: string | null; curricula?: string[] | null;
      last_data_updated_at: string | null; created_at?: string | null; review_count: number | null; avg_rating: number | null; total_fees_min: number | null;
    };
    const load = (cols: string) => fetchAllRows<Row>((from, to) =>
      supabase.from("schools_with_details").select(cols).order("slug").range(from, to) as any
    );
    // curricula / created_at come from newer view versions; older ones still get a valid sitemap
    const rows = await load("slug, city, area, curricula, last_data_updated_at, created_at, review_count, avg_rating, total_fees_min")
      .catch(() => load("slug, city, area, review_count, avg_rating, total_fees_min"));

    const liveByDb = new Map(stats.liveCities.map((c) => [c.dbName, c]));
    const hubSeen = new Set<string>();
    const add = (path: string, priority: number, freq: "weekly" | "monthly" = "monthly") => {
      if (hubSeen.has(path)) return;
      hubSeen.add(path);
      urls.push({ url: `${SITE_URL}${path}`, lastModified: now, changeFrequency: freq, priority });
    };

    stats.liveCities.forEach((c) => add(`/schools/${c.slug}`, 0.92, "weekly"));

    for (const r of rows) {
      const city = liveByDb.get(r.city);
      if (!city) continue;

      // Thin profiles (no fee data) stay out of the sitemap but remain reachable
      if (r.total_fees_min) {
        urls.push({
          url: `${SITE_URL}/schools/${r.slug}`,
          lastModified: new Date(r.last_data_updated_at ?? r.created_at ?? now),
          changeFrequency: (r.review_count ?? 0) > 0 ? "weekly" : "monthly",
          priority: r.avg_rating && r.avg_rating >= 4 ? 0.8 : 0.65,
        });
      }
      if (r.area) add(`/schools/${city.slug}/${r.area.toLowerCase().replace(/\s+/g, "-")}`, 0.72);
      // Board pages exist only for boards that have at least one school here
      (r.curricula ?? []).forEach((b) => {
        const slug = boardSlugFromDb(b);
        if (BOARD_SLUGS[slug]) add(`/schools/${city.slug}/${slug}`, 0.78);
      });
    }
  } catch (e) {
    // Static pages are still returned if the database is unreachable
    console.error("sitemap: school lookup failed", e);
  }

  return urls;
}
