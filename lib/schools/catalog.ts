import { unstable_cache } from "next/cache";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchAllRows } from "@/lib/supabase/fetchAll";
import { loadAdmissionIndex, admissionLabel } from "@/lib/admissions";
import { profileCompleteness } from "@/lib/completeness";
import { cleanDescription, isSeedTemplate } from "@/lib/schoolText";
import { CITIES, cityFromSlug, type CityConfig } from "@/lib/cities";
import { gradeIndex, slugifyArea, type CatalogSchool, type GeoPrecision } from "@/lib/schools/core";

// Builds the compact catalogue every listing on the site is computed from. It reads the
// base tables with `select *` (plus the public view only to decide which schools are listed
// and their approved-review ratings), so it works on every schema version in production.

const ABOUT_MAX = 220;
const num = (v: unknown) => (v == null || v === "" || !Number.isFinite(Number(v)) ? null : Number(v));

async function loadCatalogUncached(): Promise<CatalogSchool[]> {
  const sb = createPublicClient();
  const all = <T,>(table: string, columns: string, order: string[]) =>
    fetchAllRows<T>((from, to) => {
      let q: any = sb.from(table).select(columns);
      for (const o of order) q = q.order(o);
      return q.range(from, to);
    });

  const [listed, schools, details, curricula, grades, sports, extras, languages, admissions] = await Promise.all([
    all<any>("schools_with_details", "*", ["id"]),
    all<any>("schools", "*", ["id"]),
    all<any>("school_details", "*", ["school_id"]),
    all<{ school_id: string; curriculum: string }>("school_curricula", "school_id, curriculum", ["school_id", "curriculum"]),
    all<{ school_id: string; grade_from: string; grade_to: string }>("school_grades", "school_id, grade_from, grade_to", ["school_id", "grade_from", "grade_to"]),
    all<{ school_id: string; sports: { name: string } | null }>("school_sports", "school_id, sports(name)", ["school_id", "sport_id"]),
    all<{ school_id: string; extracurriculars: { name: string } | null }>("school_extracurriculars", "school_id, extracurriculars(name)", ["school_id", "extracurricular_id"]),
    all<{ school_id: string; language: string; type: string }>("school_languages", "school_id, language, type", ["school_id", "language"]),
    loadAdmissionIndex(),
  ]);

  const group = <T extends { school_id: string }, V>(rows: T[], pick: (r: T) => V | null) => {
    const m = new Map<string, V[]>();
    for (const r of rows) {
      const v = pick(r);
      if (v == null) continue;
      const arr = m.get(r.school_id) ?? [];
      if (!arr.includes(v)) arr.push(v);
      m.set(r.school_id, arr);
    }
    return m;
  };
  const curByS = group(curricula, (r) => r.curriculum);
  const gradeByS = group(grades, (r) => {
    const lo = gradeIndex(r.grade_from), hi = gradeIndex(r.grade_to);
    return lo != null && hi != null ? `${Math.min(lo, hi)}:${Math.max(lo, hi)}` : null;
  });
  const sportByS = group(sports, (r) => r.sports?.name ?? null);
  const extraByS = group(extras, (r) => r.extracurriculars?.name ?? null);
  const langByS = group(languages, (r) => (r.type === "medium_of_instruction" ? r.language : null));
  const schoolById = new Map(schools.map((s) => [s.id, s]));
  const detailById = new Map(details.map((d) => [d.school_id, d]));

  const out: CatalogSchool[] = [];
  for (const v of listed) {
    const s = schoolById.get(v.id);
    if (!s || s.is_listed === false || s.verification_status === "rejected") continue;
    const d = detailById.get(v.id) ?? {};
    const boards = (curByS.get(v.id) ?? []).sort();
    const lat = num(s.latitude), lng = num(s.longitude);
    const hasGeo = lat != null && lng != null && !(lat === 0 && lng === 0);
    const reviewCount = Number(v.review_count ?? 0) || 0;
    const summary = admissions.bySchool.get(v.id);
    const state = summary?.state ?? "unknown";
    const description = cleanDescription(s.description);
    // Card blurb: skip the generated "X is a private school located in Y. Offers Z." line —
    // the card's badges already say exactly that
    const blurb = description && !isSeedTemplate(description) ? description : null;

    out.push({
      id: s.id,
      slug: s.slug,
      name: s.name,
      city: s.city,
      area: s.area ?? null,
      areaSlug: s.area_slug ?? slugifyArea(s.area),
      lat: hasGeo ? lat : null,
      lng: hasGeo ? lng : null,
      geoPrecision: hasGeo ? ((s.geo_precision as GeoPrecision) ?? null) : null,
      address: [s.address_line1, s.address_line2, s.area, s.city, s.pincode].filter(Boolean).join(", ") || null,
      type: s.type,
      gender: s.gender,
      curricula: boards,
      feesMin: num(d.total_fees_min),
      feesMax: num(d.total_fees_max),
      rating: reviewCount > 0 ? num(v.avg_rating) : null,
      reviewCount,
      admission: { state, label: state === "unknown" ? null : admissionLabel(summary!) },
      midYearOpen: admissions.midYearOpenIds.has(v.id),
      grades: (gradeByS.get(v.id) ?? []).map((g) => g.split(":").map(Number) as [number, number]),
      hasTransport: d.has_transport ?? null,
      str: num(d.student_teacher_ratio),
      sports: (sportByS.get(v.id) ?? []).sort(),
      extracurriculars: (extraByS.get(v.id) ?? []).sort(),
      languages: (langByS.get(v.id) ?? []).sort(),
      about: blurb ? (blurb.length > ABOUT_MAX ? blurb.slice(0, ABOUT_MAX).replace(/\s+\S*$/, "") + "…" : blurb) : null,
      coverImage: s.cover_image_url ?? null,
      completeness: profileCompleteness(
        { ...s, ...d, description, curricula: boards, review_count: reviewCount },
        s.verification_status ? s.verification_status === "verified" : s.verified,
      ),
      createdAt: s.created_at ?? null,
    });
  }
  return out;
}

const cachedCatalog = unstable_cache(loadCatalogUncached, ["school-catalog-v1"], { revalidate: 600, tags: ["schools"] });

/** Every listed school (all cities). Cached for 10 minutes and shared by every page. */
export async function loadCatalog(): Promise<CatalogSchool[]> {
  return cachedCatalog();
}

/** Listed schools in one city (by URL slug or CityConfig). */
export async function loadCityCatalog(city: CityConfig | string): Promise<CatalogSchool[]> {
  const cfg = typeof city === "string" ? cityFromSlug(city) : city;
  if (!cfg) return [];
  const all = await loadCatalog();
  return all.filter((s) => s.city.toLowerCase() === cfg.dbName.toLowerCase());
}

/** city slug for a school's DB city name */
export function citySlugFor(dbCity: string): string | null {
  return CITIES.find((c) => c.dbName.toLowerCase() === dbCity.toLowerCase())?.slug ?? null;
}
