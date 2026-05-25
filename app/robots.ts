import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // Disallow raw API routes and deeply-stacked filter combinations
        // (canonical filter URLs are handled via self-referential canonicals on each page)
        disallow: ["/api/", "/_next/"],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  };
}
