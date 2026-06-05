// sitemap-hubs — city landing pages, board pages, comparison pages, and cluster pages.
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

// Intent-based cluster page slugs — gender + board (+ optional facility)
// These become /schools/{city}/{slug} and serve long-tail "top co-ed CBSE school" queries.
const CLUSTER_SLUGS = [
  "coed-cbse", "girls-cbse", "boys-cbse",
  "coed-ib",   "girls-ib",
  "coed-icse", "girls-icse",
  "coed-igcse",
  "coed-cbse-boarding", "girls-cbse-boarding",
  "coed-ib-boarding",
];

// Board comparison pairs for the cross-over pages
const COMPARISON_SLUGS = ["cbse-vs-icse", "cbse-vs-ib", "ib-vs-igcse"];

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

  // Intent-based cluster pages — city × (gender + board) combos
  const clusterUrls: MetadataRoute.Sitemap = CITIES.flatMap(({ slug }) =>
    CLUSTER_SLUGS.map((cluster) => ({
      url: `${APP_URL}/schools/${slug}/${cluster}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.70,
    }))
  );

  // Board comparison / cross-over pages (CBSE vs ICSE in each city)
  const comparisonUrls: MetadataRoute.Sitemap = CITIES.flatMap(({ slug }) =>
    COMPARISON_SLUGS.map((pair) => ({
      url: `${APP_URL}/schools/${slug}/${pair}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.72,
    }))
  );

  return [...cityUrls, ...boardUrls, ...cityBoardUrls, ...clusterUrls, ...comparisonUrls];
}
