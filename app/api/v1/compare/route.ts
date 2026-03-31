import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();

  try {
    const body = await request.json();
    const { ids } = body as { ids: string[] };

    if (!ids || ids.length < 2 || ids.length > 3) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "Provide 2-3 school IDs" } },
        { status: 400 }
      );
    }

    const { data: schools, error } = await supabase
      .from("schools")
      .select(`
        id, slug, name, type, gender, verified, area, city,
        cover_image_url, logo_url, established_year,
        school_details(*),
        school_curricula(curriculum),
        school_grades(grade_from, grade_to),
        school_languages(language, type),
        school_sports(sports(name)),
        school_extracurriculars(extracurriculars(name, category)),
        admission_windows(status, is_mid_year, academic_year)
      `)
      .in("id", ids);

    if (error) throw error;

    // Re-order to match requested IDs order
    const ordered = ids
      .map((id) => schools?.find((s) => s.id === id))
      .filter(Boolean);

    return NextResponse.json({ success: true, data: ordered });
  } catch (error) {
    console.error("Compare API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch comparison data" } },
      { status: 500 }
    );
  }
}
