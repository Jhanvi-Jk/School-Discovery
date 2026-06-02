// Sitemap INDEX — tells Google Search Console where each sub-sitemap lives.
// Splitting by category makes it easy to monitor crawl coverage per segment.
import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export default function sitemap(): MetadataRoute.Sitemap {
  // Return the core static pages here; school profiles live in sitemap-schools.ts
  // and city/board hubs in sitemap-hubs.ts
  return [
    { url: APP_URL,                    lastModified: new Date(), changeFrequency: "weekly",  priority: 1.0 },
    { url: `${APP_URL}/schools`,       lastModified: new Date(), changeFrequency: "daily",   priority: 0.95 },
    { url: `${APP_URL}/compare`,       lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
