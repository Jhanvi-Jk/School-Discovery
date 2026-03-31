import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const q = request.nextUrl.searchParams.get("q") || "";

  if (!q || q.length < 2) {
    return NextResponse.json({ success: true, data: [] });
  }

  try {
    const { data, error } = await supabase
      .from("schools")
      .select("id, slug, name, area, city, type, cover_image_url")
      .ilike("name", `%${q}%`)
      .limit(8);

    if (error) throw error;

    return NextResponse.json({ success: true, data: data || [] });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: { code: "SEARCH_ERROR", message: "Search failed" } },
      { status: 500 }
    );
  }
}
