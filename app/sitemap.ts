import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  // Only include schools with fee data (non-thin profiles)
  const { data: schools } = await supabase
    .from("schools_with_details")
    .select("slug, city, updated_at")
    .not("total_fees_min", "is", null)
    .order("updated_at", { ascending: false });

  const schoolUrls: MetadataRoute.Sitemap = (schools || []).map((s) => ({
    url: `${APP_URL}/schools/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // City landing pages (highest priority after home)
  const cityUrls: MetadataRoute.Sitemap = [
    { city: "bangalore", label: "Bengaluru" },
    { city: "delhi",     label: "Delhi" },
    { city: "chennai",   label: "Chennai" },
  ].map(({ city }) => ({
    url: `${APP_URL}/schools?city=${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  return [
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
      priority: 0.9,
    },
    ...cityUrls,
    ...schoolUrls,
  ];
}
