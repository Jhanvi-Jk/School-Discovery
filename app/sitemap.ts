import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

const CITIES = [
  { key: "bangalore", slug: "bengaluru",  label: "Bengaluru" },
  { key: "delhi",     slug: "delhi",      label: "Delhi"     },
  { key: "chennai",   slug: "chennai",    label: "Chennai"   },
  { key: "mumbai",    slug: "mumbai",     label: "Mumbai"    },
];

const BOARDS = ["cbse", "icse", "ib", "igcse", "state_board"];

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Individual school profile pages (non-thin only)
  const { data: schools } = await supabase
    .from("schools_with_details")
    .select("slug, updated_at")
    .not("total_fees_min", "is", null)
    .order("updated_at", { ascending: false });

  const schoolUrls: MetadataRoute.Sitemap = (schools || []).map((s) => ({
    url: `${APP_URL}/schools/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // City landing pages — /schools/bengaluru etc. (server-rendered, high priority)
  const cityLandingUrls: MetadataRoute.Sitemap = CITIES.map(({ slug }) => ({
    url: `${APP_URL}/schools/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.92,
  }));

  // Board landing pages — /schools?curriculum=cbse (JS-filtered, medium priority)
  const boardUrls: MetadataRoute.Sitemap = BOARDS.map((board) => ({
    url: `${APP_URL}/schools?curriculum=${board}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // City × Board combinations — high-intent keyword pages
  // e.g. /schools/bengaluru?curriculum=cbse
  const cityBoardUrls: MetadataRoute.Sitemap = CITIES.flatMap(({ slug }) =>
    BOARDS.map((board) => ({
      url: `${APP_URL}/schools/${slug}?curriculum=${board}`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.75,
    }))
  );

  return [
    // Core pages
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${APP_URL}/schools`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.95,
    },
    // City hubs (static, SEO-rich landing pages)
    ...cityLandingUrls,
    // Board category pages
    ...boardUrls,
    // City × Board combos
    ...cityBoardUrls,
    // Individual school profiles
    ...schoolUrls,
  ];
}
