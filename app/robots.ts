import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: [
          "/",
          "/schools",
          "/schools/",
          "/schools/bengaluru",
          "/schools/delhi",
          "/schools/chennai",
          "/schools/mumbai",
        ],
        disallow: [
          // Internal API and build routes — never crawl
          "/api/",
          "/_next/",
          "/dashboard/",
          "/login",
          "/register",

          // Low-value filter combos that create infinite duplicate content.
          // Canonical tags on clean URLs already cover the indexable versions.
          "/schools?*sort=",        // sorting variants (fees_asc, rating_desc, etc.)
          "/schools?*fees_min=",    // price range crawl — infinite permutations
          "/schools?*fees_max=",
          "/schools?*has_transport=",
          "/schools?*mid_year=",
          "/schools?*admissions_open=",

          // Shortlist / compare are client-side JS state — no bot value
          "/shortlist",
          "/compare",
        ],
      },
      // Block GPTBot and common AI scrapers separately to preserve crawl budget
      {
        userAgent: ["GPTBot", "Google-Extended", "anthropic-ai", "CCBot"],
        disallow: ["/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
