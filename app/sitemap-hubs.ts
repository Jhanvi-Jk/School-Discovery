// sitemap-hubs — city landing pages and board/category pages.
// Google Search Console will show impressions for these separately,
// making it easy to diagnose hub-page indexing vs. profile-page indexing.
import type { MetadataRoute } from "next";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

const CITIES = [
  { key: "bangalore", slug: "bengaluru" },
  { key: "delhi",     slug: "delhi"     },
  { key: "chennai",   slug: "chennai"   },
  { key: "mumbai",    slug: "mumbai"    },
];

const BOARDS = ["cbse", "icse", "ib", "igcse", "state_board"];

export default function sitemapHubs(): MetadataRoute.Sitemap {
  const cityUrls: MetadataRoute.Sitemap = CITIES.map(({ slug }) => ({
    url: `${APP_URL}/schools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.92,
  }));

  const boardUrls: MetadataRoute.Sitemap = BOARDS.map((board) => ({
    url: `${APP_URL}/schools?curriculum=${board}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.80,
  }));

  // High-intent city × board combos (CBSE schools in Bengaluru, IB schools in Delhi…)
  const cityBoardUrls: MetadataRoute.Sitemap = CITIES.flatMap(({ slug }) =>
    BOARDS.map((board) => ({
      url: `${APP_URL}/schools/${slug}?curriculum=${board}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    }))
  );

  return [...cityUrls, ...boardUrls, ...cityBoardUrls];
}
