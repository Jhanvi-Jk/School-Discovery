import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { SortOption } from "@/lib/types";

// Grade order for range-based filtering
const GRADE_ORDER = [
  "Nursery", "LKG", "UKG",
  "Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6",
  "Grade 7", "Grade 8", "Grade 9", "Grade 10", "Grade 11", "Grade 12",
];

function gradeInRange(grade: string, from: string, to: string): boolean {
  const gi = GRADE_ORDER.indexOf(grade);
  const fi = GRADE_ORDER.indexOf(from);
  const ti = GRADE_ORDER.indexOf(to);
  if (gi === -1 || fi === -1 || ti === -1) return false;
  return gi >= fi && gi <= ti;
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { searchParams } = request.nextUrl;

  // Parse query params
  const query = searchParams.get("q") || "";
  const areas = searchParams.getAll("area");
  const curricula = searchParams.getAll("curriculum");
  const types = searchParams.getAll("type");
  const gender = searchParams.getAll("gender");
  const grades = searchParams.getAll("grade");
  const sports = searchParams.getAll("sport");
  const extracurriculars = searchParams.getAll("extracurricular");
  const languages = searchParams.getAll("language");
  const fees_min = parseInt(searchParams.get("fees_min") || "0");
  const fees_max = parseInt(searchParams.get("fees_max") || "1000000");
  const str_max = searchParams.get("str_max") ? parseFloat(searchParams.get("str_max")!) : null;
  const has_transport = searchParams.get("has_transport");
  const admissions_open = searchParams.get("admissions_open");
  const mid_year = searchParams.get("mid_year");
  const sort = (searchParams.get("sort") || "relevance") as SortOption;
  const city = searchParams.get("city") || "";
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "200");
  const offset = (page - 1) * limit;

  try {
    let queryBuilder = supabase
      .from("schools_with_details")
      .select("*", { count: "exact" });

    // City filter — omit to show all cities
    if (city) {
      queryBuilder = queryBuilder.eq("city", city);
    }

    // Full-text search
    if (query) {
      queryBuilder = queryBuilder.textSearch("name", query, {
        type: "websearch",
        config: "english",
      });
    }

    // Area filter
    if (areas.length > 0) {
      queryBuilder = queryBuilder.in("area", areas);
    }

    // Type filter
    if (types.length > 0) {
      queryBuilder = queryBuilder.in("type", types);
    }

    // Gender filter
    if (gender.length > 0) {
      queryBuilder = queryBuilder.in("gender", gender);
    }

    // Fees range
    if (fees_min > 0) {
      queryBuilder = queryBuilder.gte("total_fees_min", fees_min);
    }
    if (fees_max < 1000000) {
      queryBuilder = queryBuilder.lte("total_fees_max", fees_max);
    }

    // Student:teacher ratio cap
    if (str_max !== null) {
      queryBuilder = queryBuilder.lte("student_teacher_ratio", str_max);
    }

    // Boolean filters
    if (has_transport === "true") {
      queryBuilder = queryBuilder.eq("has_transport", true);
    }
    if (admissions_open === "true") {
      queryBuilder = queryBuilder.eq("admissions_open", true);
    }
    if (mid_year === "true") {
      queryBuilder = queryBuilder.eq("mid_year_available", true);
    }

    // Sorting
    switch (sort) {
      case "fees_asc":
        queryBuilder = queryBuilder.order("total_fees_min", { ascending: true, nullsFirst: false });
        break;
      case "fees_desc":
        queryBuilder = queryBuilder.order("total_fees_max", { ascending: false, nullsFirst: false });
        break;
      case "rating":
        queryBuilder = queryBuilder.order("avg_rating", { ascending: false, nullsFirst: false });
        break;
      case "newest":
        queryBuilder = queryBuilder.order("created_at", { ascending: false });
        break;
      default:
        queryBuilder = queryBuilder
          .order("verified", { ascending: false })
          .order("avg_rating", { ascending: false, nullsFirst: false });
        break;
    }

    // Pagination
    queryBuilder = queryBuilder.range(offset, offset + limit - 1);

    const { data: schools, error, count } = await queryBuilder;

    if (error) throw error;

    const schoolIds = (schools || []).map((s) => s.id);
    let enrichedSchools = schools || [];

    if (schoolIds.length > 0) {
      const [curriculaRes, sportsRes, extrasRes, langsRes, gradesRes] = await Promise.all([
        supabase.from("school_curricula").select("school_id, curriculum").in("school_id", schoolIds),
        supabase.from("school_sports").select("school_id, sports(name)").in("school_id", schoolIds),
        supabase.from("school_extracurriculars").select("school_id, extracurriculars(name)").in("school_id", schoolIds),
        supabase.from("school_languages").select("school_id, language").in("school_id", schoolIds).eq("type", "medium_of_instruction"),
        supabase.from("school_grades").select("school_id, grade_from, grade_to").in("school_id", schoolIds),
      ]);

      // Build maps
      const curriculaMap: Record<string, string[]> = {};
      (curriculaRes.data || []).forEach((r) => {
        if (!curriculaMap[r.school_id]) curriculaMap[r.school_id] = [];
        curriculaMap[r.school_id].push(r.curriculum);
      });

      const sportsMap: Record<string, string[]> = {};
      (sportsRes.data || []).forEach((r: any) => {
        if (!sportsMap[r.school_id]) sportsMap[r.school_id] = [];
        if (r.sports?.name) sportsMap[r.school_id].push(r.sports.name);
      });

      const extrasMap: Record<string, string[]> = {};
      (extrasRes.data || []).forEach((r: any) => {
        if (!extrasMap[r.school_id]) extrasMap[r.school_id] = [];
        if (r.extracurriculars?.name) extrasMap[r.school_id].push(r.extracurriculars.name);
      });

      const langsMap: Record<string, string[]> = {};
      (langsRes.data || []).forEach((r) => {
        if (!langsMap[r.school_id]) langsMap[r.school_id] = [];
        langsMap[r.school_id].push(r.language);
      });

      // grades: array of {grade_from, grade_to} per school
      const gradesMap: Record<string, { grade_from: string; grade_to: string }[]> = {};
      (gradesRes.data || []).forEach((r: any) => {
        if (!gradesMap[r.school_id]) gradesMap[r.school_id] = [];
        gradesMap[r.school_id].push({ grade_from: r.grade_from, grade_to: r.grade_to });
      });

      enrichedSchools = (schools || [])
        .map((s) => ({
          ...s,
          curricula: curriculaMap[s.id] || [],
          sports: sportsMap[s.id] || [],
          extracurriculars: extrasMap[s.id] || [],
          languages: langsMap[s.id] || [],
        }))
        .filter((s) => {
          if (curricula.length > 0 && !curricula.some((c) => s.curricula.includes(c))) return false;
          if (sports.length > 0 && !sports.some((sp) => s.sports.includes(sp))) return false;
          if (extracurriculars.length > 0 && !extracurriculars.some((e) => s.extracurriculars.includes(e))) return false;
          if (languages.length > 0 && !languages.some((l) => s.languages.includes(l))) return false;
          if (grades.length > 0) {
            const ranges = gradesMap[s.id] || [];
            if (ranges.length === 0) return false;
            if (!grades.some((g) => ranges.some((r) => gradeInRange(g, r.grade_from, r.grade_to)))) return false;
          }
          return true;
        });
    }

    return NextResponse.json({
      success: true,
      data: enrichedSchools,
      pagination: {
        page,
        limit,
        total: count || 0,
        pages: Math.ceil((count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Schools API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "FETCH_ERROR", message: "Failed to fetch schools" } },
      { status: 500 }
    );
  }
}
