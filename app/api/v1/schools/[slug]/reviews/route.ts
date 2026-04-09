import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

// GET — public: anyone can read reviews
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();

  // Get school by slug
  const { data: school, error: schoolErr } = await supabase
    .from("schools")
    .select("id, name")
    .eq("slug", params.slug)
    .single();

  if (schoolErr || !school) {
    return NextResponse.json({ success: false, error: "School not found" }, { status: 404 });
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id,
      rating_overall,
      rating_academics,
      rating_facilities,
      rating_faculty,
      rating_value,
      title,
      body,
      relation,
      is_verified,
      created_at,
      users (full_name)
    `)
    .eq("school_id", school.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  // Calculate averages
  const count = reviews?.length || 0;
  const avg = (field: string) =>
    count > 0
      ? ((reviews || []).reduce((s: number, r: any) => s + (r[field] || 0), 0) / count).toFixed(1)
      : null;

  return NextResponse.json({
    success: true,
    school: { id: school.id, name: school.name },
    averages: {
      overall:    avg("rating_overall"),
      academics:  avg("rating_academics"),
      facilities: avg("rating_facilities"),
      faculty:    avg("rating_faculty"),
      value:      avg("rating_value"),
    },
    count,
    data: reviews,
  });
}

// POST — auth required: submit a review
export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();

  // Auth check
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Sign in required" }, { status: 401 });
  }

  // Get school
  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("slug", params.slug)
    .single();

  if (!school) {
    return NextResponse.json({ success: false, error: "School not found" }, { status: 404 });
  }

  const body = await request.json();
  const { rating_overall, rating_academics, rating_facilities, rating_faculty, rating_value, title, review_body, relation } = body;

  // Validate
  const ratings = [rating_overall, rating_academics, rating_facilities, rating_faculty, rating_value];
  if (ratings.some((r) => !r || r < 1 || r > 5)) {
    return NextResponse.json({ success: false, error: "All ratings must be between 1 and 5" }, { status: 400 });
  }
  if (!relation) {
    return NextResponse.json({ success: false, error: "Relation is required" }, { status: 400 });
  }

  const { data, error } = await supabase.from("reviews").insert({
    school_id:         school.id,
    user_id:           user.id,
    rating_overall,
    rating_academics,
    rating_facilities,
    rating_faculty,
    rating_value,
    title:             title || null,
    body:              review_body || null,
    relation,
  }).select().single();

  if (error) {
    if (error.code === "23505") {
      return NextResponse.json({ success: false, error: "You have already reviewed this school" }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true, data });
}
