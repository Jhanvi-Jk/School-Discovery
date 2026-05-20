import type { MetadataRoute } from "next";
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const { data: schools } = await supabase
    .from("schools")
    .select("slug, updated_at")
    .order("updated_at", { ascending: false });

  const schoolUrls: MetadataRoute.Sitemap = (schools || []).map((s) => ({
    url: `https://www.schoolfind360.com/schools/${s.slug}`,
    lastModified: s.updated_at ? new Date(s.updated_at) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    {
      url: "https://www.schoolfind360.com",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: "https://www.schoolfind360.com/schools",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: "https://www.schoolfind360.com/map",
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.7,
    },
    ...schoolUrls,
  ];
}
