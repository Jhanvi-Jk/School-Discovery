import { NextRequest, NextResponse } from "next/server";
import { createPublicClient } from "@/lib/supabase/public";
import { parseSearchParams, searchSchools } from "@/lib/schools/search";

// Public, read-only data: a cookie-free client lets the CDN cache the response.
// s-maxage keeps repeat searches instant; stale-while-revalidate hides the refresh.
const CACHE_CONTROL = "public, s-maxage=300, stale-while-revalidate=900";

export async function GET(request: NextRequest) {
  const params = parseSearchParams(request.nextUrl.searchParams);

  try {
    const { schools, total } = await searchSchools(createPublicClient(), params);
    return NextResponse.json(
      {
        success: true,
        data: schools,
        pagination: { page: params.page, limit: params.limit, total, pages: Math.ceil(total / params.limit) },
      },
      { headers: { "Cache-Control": CACHE_CONTROL } }
    );
  } catch (error) {
    console.error("Schools API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch schools" } },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}
