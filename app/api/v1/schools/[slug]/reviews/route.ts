import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

type Source = "schoolfind360" | "curious_parent" | "ezyschooling";

const SOURCE_LABELS: Record<Source, string> = {
  schoolfind360:  "SchoolFind360",
  curious_parent: "The Curious Parent",
  ezyschooling:   "Ezyschooling",
};

// ── helpers ──────────────────────────────────────────────────
function avgField(reviews: any[], field: string): string | null {
  const vals = reviews.map((r) => r[field]).filter((v) => v != null);
  if (!vals.length) return null;
  return (vals.reduce((s: number, v: number) => s + v, 0) / vals.length).toFixed(1);
}

function buildAverages(reviews: any[]) {
  return {
    overall:    avgField(reviews, "rating_overall"),
    academics:  avgField(reviews, "rating_academics"),
    facilities: avgField(reviews, "rating_facilities"),
    faculty:    avgField(reviews, "rating_faculty"),
    value:      avgField(reviews, "rating_value"),
  };
}

// ── GET — public: returns combined + per-source averages ─────
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: school, error: schoolErr } = await supabase
    .from("schools")
    .select("id, name, description")
    .eq("slug", slug)
    .single();

  if (schoolErr || !school) {
    return NextResponse.json({ success: false, error: "School not found" }, { status: 404 });
  }

  const { data: reviews, error } = await supabase
    .from("reviews")
    .select(`
      id,
      source,
      rating_overall,
      rating_academics,
      rating_facilities,
      rating_faculty,
      rating_value,
      title,
      body,
      relation,
      is_verified,
      created_at
    `)
    .eq("school_id", school.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }

  const allReviews = reviews || [];
  const count = allReviews.length;

  // Combined averages (equal weight per review regardless of source)
  const averages = buildAverages(allReviews);

  // Per-source breakdown
  const sources = (["schoolfind360", "curious_parent", "ezyschooling"] as Source[])
    .map((src) => {
      const subset = allReviews.filter((r) => (r.source || "schoolfind360") === src);
      if (!subset.length) return null;
      return {
        source:      src,
        label:       SOURCE_LABELS[src],
        count:       subset.length,
        averages:    buildAverages(subset),
      };
    })
    .filter(Boolean);

  return NextResponse.json({
    success: true,
    school:  { id: school.id, name: school.name, description: school.description },
    count,
    averages,   // combined across all sources
    sources,    // per-source breakdown
    data: allReviews,
  });
}

// ── POST — auth required: submit a review ────────────────────
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const { slug } = await params;

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ success: false, error: "Sign in required" }, { status: 401 });
  }

  const { data: school } = await supabase
    .from("schools")
    .select("id")
    .eq("slug", slug)
    .single();

  if (!school) {
    return NextResponse.json({ success: false, error: "School not found" }, { status: 404 });
  }

  const body = await request.json();
  const {
    rating_overall, rating_academics, rating_facilities,
    rating_faculty, rating_value, title, review_body, relation,
  } = body;

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
    source:            "schoolfind360",   // user-submitted reviews are always our platform
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
