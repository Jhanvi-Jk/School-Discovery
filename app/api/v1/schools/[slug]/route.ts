import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();
  const { slug } = params;

  try {
    const { data: school, error } = await supabase
      .from("schools")
      .select(`
        *,
        school_details(*),
        school_curricula(curriculum),
        school_grades(grade_from, grade_to),
        school_languages(language, type),
        school_sports(sports(id, name)),
        school_extracurriculars(extracurriculars(id, name, category)),
        admission_windows(*),
        reviews(
          id, rating_academics, rating_facilities, rating_faculty,
          rating_value, rating_overall, title, body, relation,
          is_verified, created_at,
          users(full_name)
        )
      `)
      .eq("slug", slug)
      .single();

    if (error || !school) {
      return NextResponse.json(
        { success: false, error: { code: "SCHOOL_NOT_FOUND", message: "School not found" } },
        { status: 404 }
      );
    }

    // Compute average ratings
    const reviews = school.reviews || [];
    const avgRating =
      reviews.length > 0
        ? reviews.reduce((sum: number, r: any) => sum + r.rating_overall, 0) / reviews.length
        : null;

    return NextResponse.json({
      success: true,
      data: { ...school, avg_rating: avgRating, review_count: reviews.length },
    });
  } catch (error) {
    console.error("School detail API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch school" } },
      { status: 500 }
    );
  }
}
