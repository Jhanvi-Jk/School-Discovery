import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import type { CSSProperties } from "react";
import {
  MapPin, Phone, Globe, Mail, CheckCircle2, Star,
  Users, Bus, Clock, Calendar, IndianRupee, BookOpen,
  Building2, Trophy, Music, Languages, ChevronRight,
  ExternalLink, AlertCircle, Navigation, Sparkles
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchoolActionsSidebar } from "@/components/schools/SchoolActionsSidebar";
import { SchoolProfileTabs, type TabId } from "@/components/schools/SchoolProfileTabs";
import { SchoolLocationMap } from "@/components/map/SchoolLocationMap";
import {
  admissionLabel, currentAcademicYear, formatAcademicYear, formatAdmissionDate,
  resolveAdmissionState, summarizeAdmissions,
} from "@/lib/admissions";
import { CityHubPage } from "@/components/seo/CityHubPage";
import { cityFromSlug, boardPageHref } from "@/lib/cities";
import { getSiteStats, formatCount } from "@/lib/siteStats";
import { profileCompleteness } from "@/lib/completeness";
import { buildFactualSummary, buildHighlights, isUsableDescription } from "@/lib/schoolText";
import {
  formatFeesRange, formatRating, formatSchoolHours,
  cn, formatFees
} from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS, GENDER_LABELS } from "@/lib/types";

// Dynamic rendering — no static params needed at build time
export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";
const YEAR = new Date().getFullYear();

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // City hub pages get their own meta, built from the same counts the page shows
  const hubCity = cityFromSlug(slug);
  if (hubCity) {
    const stats = await getSiteStats();
    const stat = stats.cities.find((c) => c.slug === hubCity.slug);
    const canonicalUrl = `${APP_URL}/schools/${hubCity.slug}`;
    if (!stat?.live) {
      return {
        title: `Schools in ${hubCity.label} — coming soon`,
        description: `SchoolFind360 is still collecting verified school data for ${hubCity.label}.`,
        alternates: { canonical: canonicalUrl },
        robots: { index: false, follow: true },
      };
    }
    const title = `Top Schools in ${hubCity.label} ${YEAR} | CBSE, ICSE, IB — SchoolFind360`;
    const description = `Browse ${formatCount(stat.count)} schools in ${hubCity.label}. Compare ${YEAR} fees, CBSE, ICSE, IB boards, area-wise listings, and real parent reviews on SchoolFind360.`;
    return {
      title, description,
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true },
      openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "SchoolFind360" },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  const supabase = await createClient();
  // Query the schools table directly (select * so a missing is_listed column can't break the lookup)
  const { data } = await supabase
    .from("schools")
    .select("*, admission_windows(status, opens_at, closes_at, academic_year, is_mid_year)")
    .eq("slug", slug)
    .single();

  // Unlisted (hidden) schools are treated exactly like a missing page
  if (!data || (data as any).is_listed === false) return {
    title: { absolute: "School not found | SchoolFind360" },
    robots: { index: false, follow: false },
  };

  const canonicalUrl = `${APP_URL}/schools/${slug}`;
  const location  = data.area || data.city || "India";
  const city      = data.city || "Bengaluru";

  // "Indus International School, Sarjapur — Fees, Admissions 2026-27, Reviews": name, place and the
  // things parents search for. When a window is open its academic year is used, else the running year.
  const admission = summarizeAdmissions((data as any).admission_windows);
  const yearLabel = admission.state === "open" && admission.academicYear
    ? formatAcademicYear(admission.academicYear).replace("–", "-")
    : currentAcademicYear();
  const titleAbsolute = `${data.name}${data.area ? `, ${data.area}` : `, ${city}`} — Fees, Admissions ${yearLabel}, Reviews`;

  const description = isUsableDescription(data.description)
    ? `${data.description} View fees, admissions ${yearLabel} and parent reviews on SchoolFind360.`
    : `${data.name} in ${location}, ${city} — fee structure, curriculum, admissions ${yearLabel}, facilities and parent reviews on SchoolFind360.`;

  return {
    title: { absolute: titleAbsolute },
    description,
    keywords: [
      data.name,
      `${data.name} fees ${YEAR}`,
      `${data.name} admissions ${yearLabel}`,
      `schools in ${location}`,
      `best schools ${city}`,
    ],
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1 } },
    openGraph: {
      title: titleAbsolute,
      description,
      url: canonicalUrl,
      type: "website",
      siteName: "SchoolFind360",
      ...(data.cover_image_url && {
        images: [{ url: data.cover_image_url, alt: data.name, width: 1200, height: 630 }],
      }),
    },
    twitter: {
      card: "summary_large_image",
      title: titleAbsolute,
      description,
      ...(data.cover_image_url && { images: [data.cover_image_url] }),
    },
  };
}

// ── Stat box ─────────────────────────────────────────────────────────────────
function StatBox({ icon: Icon, label, value, sub, color = "text-gray-700" }: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  color?: string;
}) {
  return (
    <div className="bg-gray-50 rounded-xl p-4 flex items-center gap-3">
      <div className="p-2 bg-white rounded-lg shadow-sm">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div>
        <p className="text-xs text-gray-500">{label}</p>
        <p className={cn("font-bold text-sm", color)}>{value}</p>
        {sub && <p className="text-xs text-gray-400">{sub}</p>}
      </div>
    </div>
  );
}

// ── Rating bar ───────────────────────────────────────────────────────────────
function RatingBar({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600 w-24 flex-shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full"
          style={{ width: `${(value / 5) * 100}%` }}
        />
      </div>
      <span className="text-sm font-semibold text-gray-700 w-6">{value}</span>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SchoolProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Intercept city hub URLs and render city landing page
  const hubCity = cityFromSlug(slug);
  if (hubCity) {
    return <CityHubPage city={hubCity} />;
  }

  const supabase = await createClient();

  // Fetch school — never call notFound() inside try, it throws and gets swallowed
  let school: any = null;
  let fetchFailed = false;
  try {
    const { data, error } = await supabase
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
        reviews(*)
      `)
      .eq("slug", slug)
      .single();

    if (error || !data) fetchFailed = true;
    else school = data;
  } catch {
    fetchFailed = true;
  }

  // Hidden (unlisted) schools 404, same as a school that doesn't exist
  if (fetchFailed || !school || school.is_listed === false) notFound();

  // A missing/erroring photos table just yields no rows — the gallery section is then omitted.
  const { data: photosData } = await supabase
    .from("school_photos")
    .select("url, sort_order, alt_text, is_cover")
    .eq("school_id", school.id)
    .order("sort_order");
  const schoolPhotosRaw: any[] = photosData ?? [];

  // Optional sections: each stays hidden until the school has rows (and if a table isn't there yet, nothing breaks)
  const optional = async (q: PromiseLike<{ data: any[] | null }>) => {
    try { return (await q).data ?? []; } catch { return []; }
  };
  const [feeRows, resultRows, routeRows] = await Promise.all([
    optional(supabase.from("school_fee_structure").select("*").eq("school_id", school.id).order("academic_year", { ascending: false }).order("sort_order")),
    optional(supabase.from("school_board_results").select("*").eq("school_id", school.id).order("exam_year", { ascending: false })),
    optional(supabase.from("school_transport_routes").select("*").eq("school_id", school.id).order("route_name")),
  ]);
  // Fees by grade: show only the most recent year we have
  const feeYear = feeRows[0]?.academic_year as string | undefined;
  const feesByGrade = feeRows.filter((f: any) => f.academic_year === feeYear);

  const details = Array.isArray(school.school_details)
    ? school.school_details[0] ?? null
    : school.school_details ?? null;
  const curricula  = (school.school_curricula || []).map((c: any) => c.curriculum);
  const sports     = (school.school_sports || []).map((s: any) => s.sports?.name).filter(Boolean);
  const extras     = (school.school_extracurriculars || []).map((e: any) => e.extracurriculars?.name).filter(Boolean);
  const languages  = school.school_languages || [];
  const admissions = school.admission_windows || [];
  // Only moderator-approved reviews are shown (rows from before moderation existed have no status and count as approved)
  const reviews    = (school.reviews || []).filter((r: any) => (r.status ?? "approved") === "approved");
  // Photos: from separate safe query; empty array → sheen fallback in UI
  const photos: { url: string; alt: string }[] = schoolPhotosRaw
    .map((p: any) => ({ url: p.url, alt: p.alt_text || school.name }));

  // ── School level detection from grade data ────────────────────────────────
  // Maps grade strings to a numeric order so we can detect level coverage.
  const GRADE_NUM_MAP: Record<string, number> = {
    "nursery": -3, "playgroup": -3, "pre-kg": -3, "pre kg": -3, "prekindergarten": -3,
    "lkg": -2, "lower kg": -2, "kg1": -2, "kg 1": -2, "prep": -2, "pp1": -2,
    "ukg": -1, "upper kg": -1, "kg2": -1, "kg 2": -1, "kg": -1, "pp2": -1, "kindergarten": -1,
  };
  function parseGradeNum(g: string | null | undefined): number {
    if (!g) return NaN;
    const s = g.toLowerCase().trim()
      .replace(/^class\s+/, "").replace(/^grade\s+/, "").replace(/^std\s+/, "");
    if (GRADE_NUM_MAP[s] !== undefined) return GRADE_NUM_MAP[s];
    const n = parseInt(s, 10);
    return isNaN(n) ? NaN : n;
  }
  const rawGrades = (school.school_grades || []) as { grade_from: string; grade_to: string }[];
  const gradeNums = rawGrades
    .flatMap((g) => [parseGradeNum(g.grade_from), parseGradeNum(g.grade_to)])
    .filter((n) => !isNaN(n));
  const minGrade = gradeNums.length ? Math.min(...gradeNums) : null;
  const maxGrade = gradeNums.length ? Math.max(...gradeNums) : null;

  const ALL_LEVELS = [
    { name: "Pre-School",    min: -3, max: 0  },
    { name: "Elementary",    min: 1,  max: 5  },
    { name: "Middle School", min: 6,  max: 8  },
    { name: "High School",   min: 9,  max: 12 },
  ];
  // A level is applicable if the school's grade range overlaps with the level range
  const applicableLevels =
    minGrade !== null && maxGrade !== null
      ? ALL_LEVELS.filter((l) => l.max >= minGrade && l.min <= maxGrade)
      : [];

  const avgRating = reviews.length
    ? reviews.reduce((s: number, r: any) => s + r.rating_overall, 0) / reviews.length
    : null;
  const avgBreakdown = reviews.length
    ? {
        academics: reviews.reduce((s: number, r: any) => s + r.rating_academics, 0) / reviews.length,
        facilities: reviews.reduce((s: number, r: any) => s + r.rating_facilities, 0) / reviews.length,
        faculty: reviews.reduce((s: number, r: any) => s + r.rating_faculty, 0) / reviews.length,
        value: reviews.reduce((s: number, r: any) => s + r.rating_value, 0) / reviews.length,
      }
    : null;

  // The stored `status` goes stale; the window dates decide (see lib/admissions.ts)
  const admissionSummary = summarizeAdmissions(admissions);
  const admissionOpen = admissionSummary.state === "open";
  const openAdmissions = admissions.filter((a: any) => resolveAdmissionState(a) === "open");
  const admissionYear = formatAcademicYear(admissionSummary.academicYear);
  // "Verified" is earned by a filled-in profile; otherwise show how complete it is
  const completeness = profileCompleteness(
    { ...details, ...school, curricula, review_count: reviews.length },
    school.verified
  );

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";
  const sd = Array.isArray(school.school_details) ? school.school_details[0] : school.school_details;

  // Map city name → state for schema
  const STATE_BY_CITY: Record<string, string> = {
    Bengaluru: "Karnataka",
    Delhi: "Delhi",
    Chennai: "Tamil Nadu",
    Mumbai: "Maharashtra",
    Pune: "Maharashtra",
    Kolkata: "West Bengal",
  };
  const addressRegion = STATE_BY_CITY[school.city] || "India";

  const schoolSchema = {
    "@context": "https://schema.org",
    "@type": "School",
    name: school.name,
    description: isUsableDescription(school.description) ? school.description : undefined,
    url: `${appUrl}/schools/${school.slug}`,
    ...(school.phone && { telephone: school.phone }),
    ...(school.email && { email: school.email }),
    ...(school.logo_url && { logo: school.logo_url }),
    ...(school.cover_image_url && { image: school.cover_image_url }),
    address: {
      "@type": "PostalAddress",
      addressLocality: school.area || school.city,
      addressRegion,
      addressCountry: "IN",
    },
    ...(school.latitude && school.longitude && {
      geo: {
        "@type": "GeoCoordinates",
        latitude: school.latitude,
        longitude: school.longitude,
      },
    }),
    // Human-readable priceRange (broad string for quick scanning in SERPs)
    ...(sd?.total_fees_min && {
      priceRange: `₹${(sd.total_fees_min / 100000).toFixed(1)}L – ₹${((sd.total_fees_max || sd.total_fees_min) / 100000).toFixed(1)}L`,
    }),
    // Machine-readable fee breakdown — enables rich pricing snippets in SERPs.
    // PriceSpecification lets Google extract exact numeric fee values per category.
    ...(sd?.total_fees_min && {
      makesOffer: {
        "@type": "Offer",
        "priceCurrency": "INR",
        "availability": "https://schema.org/InStock",
        "priceSpecification": [
          {
            "@type": "UnitPriceSpecification",
            "name": "Annual Tuition Fees",
            "minPrice": sd.total_fees_min,
            ...(sd.total_fees_max && sd.total_fees_max !== sd.total_fees_min && { "maxPrice": sd.total_fees_max }),
            "priceCurrency": "INR",
            "unitCode": "ANN",
            "unitText": "per year",
          },
          ...(sd.admission_fee ? [{
            "@type": "UnitPriceSpecification",
            "name": "One-Time Admission Fee",
            "price": sd.admission_fee,
            "priceCurrency": "INR",
            "unitCode": "C62",
            "unitText": "one-time",
          }] : []),
          ...(sd.transport_fee_min ? [{
            "@type": "UnitPriceSpecification",
            "name": "Annual Transport / Bus Fee",
            "minPrice": sd.transport_fee_min,
            ...(sd.transport_fee_max ? { "maxPrice": sd.transport_fee_max } : {}),
            "priceCurrency": "INR",
            "unitCode": "ANN",
            "unitText": "per year",
          }] : []),
        ],
      },
    }),
    ...(avgRating && reviews.length && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: "5",
      },
    }),
    // Individual review items — enables review stars in SERPs and Bing rich results
    ...(reviews.length > 0 && {
      review: reviews.slice(0, 5).map((r: any) => ({
        "@type": "Review",
        reviewRating: {
          "@type": "Rating",
          ratingValue: String(r.rating_overall ?? 4),
          bestRating: "5",
        },
        ...(r.body && { reviewBody: r.body }),
        author: {
          "@type": "Person",
          name: r.relation
            ? `${r.relation.charAt(0).toUpperCase()}${r.relation.slice(1)} of student`
            : "Parent",
        },
        ...(r.created_at && {
          datePublished: new Date(r.created_at).toISOString().split("T")[0],
        }),
      })),
    }),
  };

  // BreadcrumbList JSON-LD — keyword-rich anchor text boosts internal PageRank flow.
  // Use "Schools in Bengaluru" not "Bengaluru" so the anchor carries the keyword.
  // Link to canonical city hub URL (/schools/bengaluru) not the explore-page filter.
  const citySlug = school.city?.toLowerCase().replace(/\s+/g, "-") || "bengaluru";
  const areaSlug = school.area ? school.area.toLowerCase().replace(/\s+/g, "-") : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
      { "@type": "ListItem", position: 2, name: "Schools in India", item: `${appUrl}/schools` },
      ...(school.city
        ? [{ "@type": "ListItem", position: 3, name: `Schools in ${school.city}`, item: `${appUrl}/schools/${citySlug}` }]
        : []),
      ...(school.area && areaSlug
        ? [{ "@type": "ListItem", position: school.city ? 4 : 3, name: `Schools in ${school.area}`, item: `${appUrl}/schools/${citySlug}/${areaSlug}` }]
        : []),
      { "@type": "ListItem", position: school.city && school.area ? 5 : school.city || school.area ? 4 : 3, name: school.name, item: `${appUrl}/schools/${school.slug}` },
    ],
  };

  // ── FAQPage schema — drops-down answers directly in Google SERPs ────────────
  const faqItems: { q: string; a: string }[] = [];

  // Fees FAQ
  if (sd?.total_fees_min) {
    faqItems.push({
      q: `What is the fee structure at ${school.name}?`,
      a: `Annual fees at ${school.name} range from ₹${(sd.total_fees_min / 100000).toFixed(1)}L to ₹${((sd.total_fees_max || sd.total_fees_min) / 100000).toFixed(1)}L. Exact fees may vary by grade — contact the school directly for the latest fee schedule.`,
    });
  }

  // Curriculum FAQ
  if (curricula.length > 0) {
    const boardList = curricula.map((c: string) => CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c).join(", ");
    faqItems.push({
      q: `Which curriculum or board does ${school.name} follow?`,
      a: `${school.name} follows the ${boardList} curriculum. It is a ${SCHOOL_TYPE_LABELS[school.type as keyof typeof SCHOOL_TYPE_LABELS] || "private"} school located in ${school.area || school.city}.`,
    });
  }

  // Transport FAQ
  if (sd?.has_transport !== undefined && sd.has_transport !== null) {
    faqItems.push({
      q: `Does ${school.name} provide school bus or transport facility?`,
      a: sd.has_transport
        ? `Yes, ${school.name} provides a school bus / transport facility for students.`
        : `${school.name} does not currently list a school bus service. Parents may need to arrange private transport.`,
    });
  }

  // Admissions FAQ
  const admissionFaqAnswer = (() => {
    switch (admissionSummary.state) {
      case "open":
        return `Yes — ${school.name} has an admission window open${admissionYear ? ` for ${admissionYear}` : ""}${admissionSummary.closesAt ? ` until ${formatAdmissionDate(admissionSummary.closesAt)}` : ""}. Visit the school's official website or contact them directly to apply.`;
      case "upcoming":
        return `Not yet. The next admission window at ${school.name} ${admissionSummary.opensAt ? `opens on ${formatAdmissionDate(admissionSummary.opensAt)}` : "has not opened"}. Contact the school for the latest schedule.`;
      case "waitlist":
        return `${school.name} is currently taking waitlist applications only. Contact the school directly for the latest status.`;
      case "closed":
        return `No. The most recent admission window listed for ${school.name}${admissionYear ? ` (${admissionYear})` : ""} has closed. Dates for the next session haven't been published yet — contact the school directly to ask.`;
      default:
        return `${school.name} hasn't published admission dates yet. Contact the school directly to ask about the next intake.`;
    }
  })();
  faqItems.push({
    q: `Are admissions currently open at ${school.name}?`,
    a: admissionFaqAnswer,
  });

  // Student-teacher ratio FAQ
  if (sd?.student_teacher_ratio) {
    faqItems.push({
      q: `What is the student-teacher ratio at ${school.name}?`,
      a: `${school.name} has a student-teacher ratio of ${sd.student_teacher_ratio}:1, which provides ${sd.student_teacher_ratio <= 20 ? "a relatively personalised classroom experience" : "a standard classroom environment"}.`,
    });
  }

  // Location FAQ
  if (school.area) {
    faqItems.push({
      q: `Where is ${school.name} located?`,
      a: `${school.name} is located in ${school.area}, ${school.city}${school.address_line1 ? ` — ${school.address_line1}` : ""}. It is a ${SCHOOL_TYPE_LABELS[school.type as keyof typeof SCHOOL_TYPE_LABELS] || "private"} school offering ${curricula.map((c: string) => CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c).join(", ") || "a standard"} curriculum.`,
    });
  }

  const faqSchema = faqItems.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqItems.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  } : null;

  // Related schools (same area/city, excluding current)
  const { data: relatedSchools } = await supabase
    .from("schools_with_details")
    .select("id, slug, name, area, city, total_fees_min, total_fees_max, avg_rating, cover_image_url")
    .eq("city", school.city)
    .neq("slug", school.slug)
    .not("total_fees_min", "is", null)
    .limit(4);

  // ── Peer group: nearby schools on a comparable board and fee band ──────────
  const myMin: number | null = details?.total_fees_min ?? null;
  const myMax: number | null = details?.total_fees_max ?? myMin;
  const myMid = myMin != null && myMax != null ? (myMin + myMax) / 2 : null;
  let peers: any[] = [];
  try {
    const cols = "id, slug, name, area, city, total_fees_min, total_fees_max, avg_rating, review_count";
    let candidates: any[] = [];
    if (school.area) {
      const { data } = await supabase.from("schools_with_details").select(cols)
        .eq("city", school.city).eq("area", school.area).neq("id", school.id)
        .not("total_fees_min", "is", null).limit(40);
      candidates = data ?? [];
    }
    if (candidates.length < 8) {
      let q = supabase.from("schools_with_details").select(cols)
        .eq("city", school.city).neq("id", school.id).not("total_fees_min", "is", null);
      if (myMid) q = q.gte("total_fees_min", Math.round(myMid * 0.5)).lte("total_fees_min", Math.round(myMid * 1.5));
      const { data } = await q.limit(40);
      const have = new Set(candidates.map((c) => c.id));
      candidates = [...candidates, ...(data ?? []).filter((c: any) => !have.has(c.id))];
    }
    if (candidates.length > 0) {
      const { data: candCurricula } = await supabase
        .from("school_curricula").select("school_id, curriculum")
        .in("school_id", candidates.map((c) => c.id));
      const byId: Record<string, string[]> = {};
      (candCurricula ?? []).forEach((r: any) => { (byId[r.school_id] ||= []).push(r.curriculum); });

      peers = candidates
        .map((c) => ({ ...c, curricula: byId[c.id] ?? [] }))
        // A peer must share at least one board with this school (when we know it)
        .filter((c) => curricula.length === 0 || c.curricula.some((x: string) => curricula.includes(x)))
        .map((c) => {
          const mid = (c.total_fees_min + (c.total_fees_max ?? c.total_fees_min)) / 2;
          return { ...c, _gap: myMid ? Math.abs(mid - myMid) : 0, _sameArea: school.area && c.area === school.area ? 0 : 1 };
        })
        .sort((a, b) => a._sameArea - b._sameArea || a._gap - b._gap)
        .slice(0, 3);
    }
  } catch {
    peers = [];
  }

  const lat = school.latitude != null ? Number(school.latitude) : NaN;
  const lng = school.longitude != null ? Number(school.longitude) : NaN;
  const hasCoords = Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
  const mapsQuery = hasCoords
    ? `${lat},${lng}`
    : encodeURIComponent([school.name, school.area, school.city].filter(Boolean).join(", "));
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  const firstGrade = rawGrades[0];
  const summaryText = isUsableDescription(school.description)
    ? school.description
    : buildFactualSummary({
        name: school.name, type: school.type, gender: school.gender,
        area: school.area, city: school.city, establishedYear: school.established_year,
        curricula, gradeFrom: firstGrade?.grade_from, gradeTo: firstGrade?.grade_to,
      });

  const highlights = buildHighlights({
    establishedYear: school.established_year, curricula,
    studentTeacherRatio: details?.student_teacher_ratio, hasTransport: details?.has_transport,
    sports, extracurriculars: extras,
    gradeMin: minGrade, gradeMax: maxGrade,
    languages: languages.map((l: any) => l.language), currentYear: YEAR,
  });

  const hasFeeFigures = !!(details && (details.total_fees_min || details.total_fees_max ||
    details.annual_tuition_fees_min || details.development_fees || details.transport_fees ||
    details.activity_fees || details.admission_fees));

  // Only sections that have real content get a tab — an empty tab can never highlight.
  const availableTabs: TabId[] = ["basic", "summary", "fees", "admission", "feedback", "sources"];
  if (photos.length > 0) availableTabs.push("photos");
  if (sports.length > 0 || extras.length > 0) availableTabs.push("campus");
  if (routeRows.length > 0) availableTabs.push("transport");
  if (resultRows.length > 0) availableTabs.push("results");
  if (peers.length > 0) availableTabs.push("peer");
  if (highlights.length > 0) availableTabs.push("unique");
  if (avgBreakdown) availableTabs.push("sentiment");

  const cardStyle: CSSProperties = {
    background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24,
  };
  const eyebrowStyle: CSSProperties = {
    fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase",
    letterSpacing: "0.08em", marginBottom: 14,
  };
  const mutedNote: CSSProperties = { fontSize: 13, color: "var(--muted)", lineHeight: 1.6 };


  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schoolSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <Header />
      <main style={{ background: "var(--beige-300)" }}>

        {/* ── Hero ── */}
        <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#1a1a1a" }}>
          {school.cover_image_url ? (
            <Image
              src={school.cover_image_url}
              alt={`${school.name} campus in ${school.area || school.city} — ${curricula.map((c: string) => CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c).join(", ") || "private"} school`}
              fill className="object-cover" priority style={{ opacity: 0.45 }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0,
              background: "linear-gradient(135deg, #2C1810 0%, #1a1a1a 60%, #0f0f0f 100%)" }} />
          )}
          <div style={{ position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.2) 60%, transparent 100%)" }} />
          <div style={{ position: "absolute", bottom: 20, left: 20, right: 20, maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ display: "flex", alignItems: "flex-end", gap: 14 }}>
              {school.logo_url && (
                <div style={{ width: 56, height: 56, borderRadius: 12, overflow: "hidden",
                  border: "2px solid rgba(255,255,255,0.2)", background: "var(--beige-100)", flexShrink: 0 }}>
                  <Image src={school.logo_url} alt={`${school.name} logo`} width={56} height={56} className="object-cover" />
                </div>
              )}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  {completeness.showVerified ? (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.9)", padding: "3px 10px", borderRadius: 99,
                      display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 style={{ width: 11, height: 11 }} /> Verified
                    </span>
                  ) : (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.75)", padding: "3px 10px", borderRadius: 99 }}>
                      Profile {completeness.score}% complete
                    </span>
                  )}
                  {admissionOpen && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#16a34a",
                      color: "white", padding: "3px 10px", borderRadius: 99 }}>
                      {admissionYear ? `Admissions Open ${admissionYear}` : "Admissions Open"}
                    </span>
                  )}
                  {curricula.slice(0, 2).map((c: string) => (
                    <span key={c} style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.1)",
                      color: "rgba(255,255,255,0.8)", padding: "3px 10px", borderRadius: 99 }}>
                      {CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c}
                    </span>
                  ))}
                </div>
                <h1 style={{ fontSize: "clamp(20px, 4vw, 28px)", fontWeight: 800, color: "white",
                  lineHeight: 1.2, marginBottom: 4 }}>
                  {school.name}
                </h1>
                <p style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", display: "flex", alignItems: "center", gap: 5 }}>
                  <MapPin style={{ width: 13, height: 13 }} />
                  {[school.area, school.city, school.pincode && `– ${school.pincode}`].filter(Boolean).join(" · ")}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ── Breadcrumb ── keyword-rich anchors so every crumb passes a target phrase ── */}
        <div style={{ background: "var(--beige-200)", borderBottom: "1px solid var(--beige-500)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "8px 20px",
            display: "flex", alignItems: "center", gap: 4, fontSize: 12,
            color: "var(--muted)", overflowX: "auto", whiteSpace: "nowrap" }}>
            <Link href="/" style={{ color: "var(--muted)", flexShrink: 0 }}>Home</Link>
            <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
            <Link href="/schools" style={{ color: "var(--muted)", flexShrink: 0 }}>Schools in India</Link>
            {school.city && (<>
              <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
              {/* Link to canonical city hub, not the explore-filter URL */}
              <Link href={`/schools/${citySlug}`} style={{ color: "var(--muted)", flexShrink: 0 }}>
                Schools in {school.city}
              </Link>
            </>)}
            {school.area && areaSlug && (<>
              <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
              <Link href={`/schools/${citySlug}/${areaSlug}`}
                style={{ color: "var(--muted)", flexShrink: 0 }}>Schools in {school.area}</Link>
            </>)}
            <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
            <span style={{ color: "var(--dark)", fontWeight: 600, flexShrink: 0,
              overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{school.name}</span>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <SchoolProfileTabs availableTabs={availableTabs} />

        {/* ── Body ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 20 }}>

            {/* Main */}
            <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* PHOTOS — only rendered when real photos exist */}
              {photos.length > 0 && (
                <section id="section-photos" className="profile-section"
                  style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, overflow: "hidden" }}>
                  <div style={{
                    display: "grid",
                    gridTemplateColumns: photos.length === 1 ? "1fr" : photos.length === 2 ? "1fr 1fr" : "2fr 1fr",
                    gridTemplateRows: photos.length >= 3 ? "180px 180px" : "260px",
                    gap: 3,
                  }}>
                    {photos.map((p, i) => (
                      <div key={p.url} style={{
                        position: "relative",
                        gridRow: photos.length >= 3 && i === 0 ? "1 / 3" : undefined,
                        overflow: "hidden",
                      }}>
                        <Image src={p.url} alt={p.alt} fill className="object-cover" unoptimized
                          style={{ transition: "transform 0.3s" }} priority={i === 0} />
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* BASIC DETAILS: key stats, school details, location & contact */}
              <div id="section-basic" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                {[
                  { icon: IndianRupee, label: "Annual Fees", value: formatFeesRange(details?.total_fees_min, details?.total_fees_max) },
                  avgRating ? { icon: Star, label: "Overall Rating", value: `${formatRating(avgRating)} / 5`, sub: `${reviews.length} reviews` } : null,
                  details?.student_count ? { icon: Users, label: "Students", value: details.student_count.toLocaleString() } : null,
                  details?.student_teacher_ratio ? { icon: Users, label: "Student:Teacher", value: `${details.student_teacher_ratio}:1` } : null,
                ].filter(Boolean).map((stat: any) => (
                  <div key={stat.label} style={{ background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                    borderRadius: 14, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "var(--beige-100)",
                      display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                      <stat.icon style={{ width: 16, height: 16, color: "var(--muted)" }} />
                    </div>
                    <div>
                      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>{stat.label}</p>
                      <p style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)" }}>{stat.value}</p>
                      {stat.sub && <p style={{ fontSize: 11, color: "var(--muted)" }}>{stat.sub}</p>}
                    </div>
                  </div>
                ))}
              </div>


              {/* SCHOOL DETAILS */}
              <section
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>School Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>

                  {/* Year Founded — shown whenever established_year is set */}
                  {school.established_year && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <Calendar style={{ width: 16, height: 16, color: "var(--muted)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Year Founded</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>
                          {school.established_year}
                          {school.established_year <= 1900 && (
                            <span style={{ marginLeft: 6, fontSize: 11, color: "var(--brown-dark)", fontWeight: 700,
                              background: "rgba(44,24,16,0.08)", padding: "2px 8px", borderRadius: 99 }}>
                              {new Date().getFullYear() - school.established_year}+ yrs legacy
                            </span>
                          )}
                        </p>
                      </div>
                    </div>
                  )}

                  {details?.school_hours_start && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <Clock style={{ width: 16, height: 16, color: "var(--muted)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>School Hours</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>
                          {formatSchoolHours(details.school_hours_start, details.school_hours_end)}
                        </p>
                      </div>
                    </div>
                  )}
                  {details?.has_transport && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <Bus style={{ width: 16, height: 16, color: "var(--muted)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Transport</p>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>Available</p>
                      </div>
                    </div>
                  )}
                  {school.website && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <Globe style={{ width: 16, height: 16, color: "var(--muted)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Website</p>
                        <a href={school.website} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 13, fontWeight: 600, color: "var(--brown-dark)",
                            display: "flex", alignItems: "center", gap: 4 }}>
                          Visit website <ExternalLink style={{ width: 11, height: 11 }} />
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                {languages.length > 0 && (
                  <div style={{ marginTop: 16, paddingTop: 14, borderTop: "1px solid var(--beige-400)" }}>
                    <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 10,
                      display: "flex", alignItems: "center", gap: 4 }}>
                      <Languages style={{ width: 13, height: 13 }} /> Languages
                    </p>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {languages.map((l: any) => (
                        <span key={`${l.language}-${l.type}`}
                          style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99,
                            background: "var(--beige-300)", color: "var(--muted)",
                            border: "1px solid var(--beige-500)" }}>
                          {l.language}
                          {l.type === "medium_of_instruction" && (
                            <span style={{ color: "var(--brown-dark)", marginLeft: 4 }}>(medium)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>


              {/* LOCATION & CONTACT */}
              <section className="profile-section" style={cardStyle}>
                <p style={eyebrowStyle}>Location &amp; Contact</p>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14, marginBottom: 16 }}>
                  <div style={{ display: "flex", gap: 10 }}>
                    <MapPin style={{ width: 16, height: 16, color: "var(--muted)", marginTop: 2, flexShrink: 0 }} />
                    <div>
                      <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Address</p>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)", lineHeight: 1.5 }}>
                        {school.address_line1 && <>{school.address_line1}<br /></>}
                        {school.address_line2 && <>{school.address_line2}<br /></>}
                        {[school.area, school.city, school.pincode && `– ${school.pincode}`].filter(Boolean).join(", ")}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {school.phone && (
                      <a href={`tel:${school.phone}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>
                        <Phone style={{ width: 16, height: 16, color: "var(--muted)", flexShrink: 0 }} />
                        {school.phone}
                      </a>
                    )}
                    {school.email && (
                      <a href={`mailto:${school.email}`} style={{ display: "flex", alignItems: "center", gap: 10, fontSize: 13, fontWeight: 600, color: "var(--dark)", overflowWrap: "anywhere" }}>
                        <Mail style={{ width: 16, height: 16, color: "var(--muted)", flexShrink: 0 }} />
                        {school.email}
                      </a>
                    )}
                    {!school.phone && !school.email && (
                      <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                        Phone and email aren&apos;t listed for this school yet
                        {school.website ? " — try the school website." : "."}
                      </p>
                    )}
                  </div>
                </div>

                {hasCoords && <SchoolLocationMap latitude={lat} longitude={lng} name={school.name} />}

                <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                  style={{ marginTop: hasCoords ? 12 : 0, display: "inline-flex", alignItems: "center", gap: 6,
                    fontSize: 13, fontWeight: 600, color: "var(--brown-dark)" }}>
                  <Navigation style={{ width: 14, height: 14 }} />
                  {hasCoords ? "Get directions" : "Find on Google Maps"}
                  <ExternalLink style={{ width: 11, height: 11, opacity: 0.6 }} />
                </a>
              </section>
              </div>

              {/* SUMMARY */}
              <section id="section-summary" className="profile-section" style={cardStyle}>
                <p style={eyebrowStyle}>About</p>
                <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7 }}>{summaryText}</p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginTop: 16 }}>
                  {[
                    SCHOOL_TYPE_LABELS[school.type as keyof typeof SCHOOL_TYPE_LABELS],
                    GENDER_LABELS[school.gender as keyof typeof GENDER_LABELS],
                    school.established_year && `Est. ${school.established_year}`,
                  ].filter(Boolean).map((tag: any) => (
                    <span key={tag} style={{ fontSize: 12, background: "var(--beige-300)",
                      color: "var(--muted)", padding: "4px 12px", borderRadius: 99,
                      border: "1px solid var(--beige-500)" }}>{tag}</span>
                  ))}
                  {curricula.map((c: string) => (
                    <span key={c} style={{ fontSize: 12, background: "var(--dark)", color: "white",
                      padding: "4px 12px", borderRadius: 99, fontWeight: 600 }}>
                      {CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c}
                    </span>
                  ))}
                </div>
              </section>

              {/* PROFILE COMPLETENESS */}
              <section className="profile-section" style={cardStyle} aria-label="Profile completeness">
                <p style={eyebrowStyle}>Profile completeness</p>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
                  <div style={{ flex: 1, height: 8, background: "var(--beige-400)", borderRadius: 99, overflow: "hidden" }}>
                    <div style={{ width: `${completeness.score}%`, height: "100%", background: completeness.showVerified ? "#16a34a" : "var(--brown-dark)" }} />
                  </div>
                  <span style={{ fontSize: 15, fontWeight: 800, color: "var(--dark)" }}>{completeness.score}%</span>
                </div>
                <p style={mutedNote}>
                  {completeness.showVerified
                    ? "This profile has been checked by our team and is well filled in."
                    : "We show a completeness score, not a Verified badge, until a profile is both checked and well filled in."}
                  {completeness.missing.length > 0 && <> Still missing: {completeness.missing.slice(0, 6).join(", ")}{completeness.missing.length > 6 ? "…" : ""}.</>}
                </p>
                <p style={{ ...mutedNote, marginTop: 8 }}>
                  <Link href={`/report?school=${encodeURIComponent(school.name)}&slug=${school.slug}`} style={{ fontWeight: 600, color: "var(--brown-dark)" }}>Report wrong or missing data</Link>
                  {" · "}
                  <Link href="/schools/claim" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>Are you the school? Claim this profile</Link>
                  {" · "}
                  <Link href="/how-we-verify" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>How we verify</Link>
                </p>
              </section>

              {/* FEES */}
              <section id="section-fees" className="profile-section"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Fee Breakdown</p>
                {hasFeeFigures ? (
                  <div>
                    {[
                      { label: "Annual Tuition", min: details.annual_tuition_fees_min, max: details.annual_tuition_fees_max },
                      { label: "Development Fee", min: details.development_fees, max: null },
                      { label: "Transport Fee",   min: details.transport_fees,   max: null },
                      { label: "Activity Fee",    min: details.activity_fees,    max: null },
                      { label: "Admission (one-time)", min: details.admission_fees, max: null },
                    ].filter((f) => f.min).map((fee, i, arr) => (
                      <div key={fee.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "10px 0", borderBottom: i < arr.length - 1 ? "1px solid var(--beige-400)" : "none" }}>
                        <span style={{ fontSize: 13, color: "var(--muted)" }}>{fee.label}</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>{formatFeesRange(fee.min, fee.max)}</span>
                      </div>
                    ))}
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center",
                      paddingTop: 12, marginTop: 4, borderTop: "2px solid var(--beige-400)" }}>
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)" }}>Total Annual Fees</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "var(--brown-dark)" }}>
                        {formatFeesRange(details.total_fees_min, details.total_fees_max)}
                      </span>
                    </div>

                  </div>
                ) : (
                  <p style={mutedNote}>
                    {school.name} hasn&apos;t published its fee structure with us yet. Please contact the school
                    directly for the current fee schedule before you plan your budget.
                  </p>
                )}

                {feesByGrade.length > 0 && (
                  <div style={{ marginTop: 20 }}>
                    <p style={{ ...eyebrowStyle, marginBottom: 8 }}>Fees by grade · {formatAcademicYear(feeYear)}</p>
                    <div style={{ overflowX: "auto" }}>
                      <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 380 }}>
                        <thead>
                          <tr style={{ textAlign: "left", color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                            <th style={{ padding: "6px 8px 8px 0" }}>Grades</th>
                            <th style={{ padding: "6px 8px 8px" }}>Tuition</th>
                            <th style={{ padding: "6px 8px 8px" }}>Other fees</th>
                            <th style={{ padding: "6px 0 8px 8px" }}>One-time admission</th>
                          </tr>
                        </thead>
                        <tbody>
                          {feesByGrade.map((f: any) => (
                            <tr key={f.id} style={{ borderTop: "1px solid var(--beige-400)" }}>
                              <td style={{ padding: "9px 8px 9px 0", fontWeight: 600, color: "var(--dark)" }}>{f.grade_label}</td>
                              <td style={{ padding: "9px 8px" }}>{f.tuition_fee ? formatFees(f.tuition_fee) : "—"}</td>
                              <td style={{ padding: "9px 8px" }}>{f.other_fees ? formatFees(f.other_fees) : "—"}</td>
                              <td style={{ padding: "9px 0 9px 8px" }}>{f.admission_fee ? formatFees(f.admission_fee) : "—"}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {feesByGrade[0]?.source_url && (
                      <p style={{ ...mutedNote, marginTop: 8, fontSize: 11 }}>
                        Source: <a href={feesByGrade[0].source_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>school fee circular</a>. Confirm with the school before paying.
                      </p>
                    )}
                  </div>
                )}
              </section>

              {(sports.length > 0 || extras.length > 0) && (
              <section id="section-campus" className="profile-section"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Sports & Extracurriculars</p>
                {(sports.length > 0 || extras.length > 0) ? (
                  <>
                    {sports.length > 0 && (
                      <div style={{ marginBottom: 16 }}>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 8,
                          display: "flex", alignItems: "center", gap: 6 }}>
                          <Trophy style={{ width: 14, height: 14, color: "#d97706" }} /> Sports
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {sports.map((s: string) => (
                            <span key={s} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99,
                              background: "var(--beige-300)", color: "var(--dark)",
                              border: "1px solid var(--beige-500)" }}>{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {extras.length > 0 && (
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", marginBottom: 8,
                          display: "flex", alignItems: "center", gap: 6 }}>
                          <Music style={{ width: 14, height: 14, color: "#7c3aed" }} /> Activities
                        </p>
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                          {extras.map((e: string) => (
                            <span key={e} style={{ fontSize: 12, padding: "4px 12px", borderRadius: 99,
                              background: "var(--beige-300)", color: "var(--dark)",
                              border: "1px solid var(--beige-500)" }}>{e}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : null}
              </section>
              )}

              {/* TRANSPORT ROUTES */}
              {routeRows.length > 0 && (
                <section id="section-transport" className="profile-section" style={cardStyle}>
                  <p style={eyebrowStyle}>Transport Routes</p>
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {routeRows.map((r: any) => (
                      <div key={r.id} style={{ border: "1px solid var(--beige-500)", background: "var(--beige-200)", borderRadius: 12, padding: 14 }}>
                        <div style={{ display: "flex", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontSize: 13, fontWeight: 700, color: "var(--dark)" }}>{r.route_name}</span>
                          {r.annual_fee ? <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>{formatFees(r.annual_fee)} / year</span> : null}
                        </div>
                        {r.areas_covered?.length > 0 && <p style={{ ...mutedNote, marginTop: 4 }}>Covers: {r.areas_covered.join(", ")}</p>}
                        {r.notes && <p style={{ ...mutedNote, marginTop: 2 }}>{r.notes}</p>}
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* BOARD RESULTS — every row cites its source */}
              {resultRows.length > 0 && (
                <section id="section-results" className="profile-section" style={cardStyle}>
                  <p style={eyebrowStyle}>Board Results</p>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 420 }}>
                      <thead>
                        <tr style={{ textAlign: "left", color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          <th style={{ padding: "6px 8px 8px 0" }}>Exam</th>
                          <th style={{ padding: "6px 8px 8px" }}>Year</th>
                          <th style={{ padding: "6px 8px 8px" }}>Appeared</th>
                          <th style={{ padding: "6px 8px 8px" }}>Pass %</th>
                          <th style={{ padding: "6px 0 8px 8px" }}>Average</th>
                        </tr>
                      </thead>
                      <tbody>
                        {resultRows.map((r: any) => (
                          <tr key={r.id} style={{ borderTop: "1px solid var(--beige-400)" }}>
                            <td style={{ padding: "9px 8px 9px 0", fontWeight: 600, color: "var(--dark)" }}>
                              {r.source_url ? <a href={r.source_url} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "underline" }}>{r.exam}</a> : r.exam}
                            </td>
                            <td style={{ padding: "9px 8px" }}>{r.exam_year}</td>
                            <td style={{ padding: "9px 8px" }}>{r.students_appeared ?? "—"}</td>
                            <td style={{ padding: "9px 8px" }}>{r.pass_percentage != null ? `${r.pass_percentage}%` : "—"}</td>
                            <td style={{ padding: "9px 0 9px 8px" }}>{r.average_score != null ? r.average_score : "—"}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p style={{ ...mutedNote, marginTop: 8, fontSize: 11 }}>Results are as published by the school or the board; tap an exam name for the source.</p>
                </section>
              )}

              {/* PEER GROUP — nearby schools on a comparable board and fee band */}
              {peers.length > 0 && (
                <section id="section-peer" className="profile-section" style={cardStyle}>
                  <p style={eyebrowStyle}>Peer Group</p>
                  <p style={{ ...mutedNote, marginBottom: 14 }}>
                    Schools in {school.area || school.city} following a similar curriculum, closest in fees first.
                  </p>
                  <div style={{ overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13, minWidth: 460 }}>
                      <thead>
                        <tr style={{ textAlign: "left", color: "var(--muted)", fontSize: 11, textTransform: "uppercase", letterSpacing: "0.06em" }}>
                          <th style={{ padding: "6px 8px 10px 0", fontWeight: 700 }}>School</th>
                          <th style={{ padding: "6px 8px 10px", fontWeight: 700 }}>Board</th>
                          <th style={{ padding: "6px 8px 10px", fontWeight: 700 }}>Annual fees</th>
                          <th style={{ padding: "6px 0 10px 8px", fontWeight: 700 }}>Rating</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { id: school.id, slug: null as string | null, name: school.name, area: school.area,
                            curricula, total_fees_min: details?.total_fees_min ?? null, total_fees_max: details?.total_fees_max ?? null,
                            avg_rating: avgRating, review_count: reviews.length },
                          ...peers,
                        ].map((row: any, i: number) => (
                          <tr key={row.id} style={{ borderTop: "1px solid var(--beige-400)", background: i === 0 ? "var(--beige-200)" : "transparent" }}>
                            <td style={{ padding: "10px 8px 10px 6px" }}>
                              {row.slug ? (
                                <Link href={`/schools/${row.slug}`} style={{ fontWeight: 600, color: "var(--dark)" }}>{row.name}</Link>
                              ) : (
                                <span style={{ fontWeight: 700, color: "var(--dark)" }}>{row.name} <span style={{ fontWeight: 500, color: "var(--muted)" }}>(this school)</span></span>
                              )}
                              {row.area && <div style={{ fontSize: 11, color: "var(--muted)" }}>{row.area}</div>}
                            </td>
                            <td style={{ padding: "10px 8px", color: "var(--dark)" }}>
                              {(row.curricula || []).map((c: string) => CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c).join(", ") || "—"}
                            </td>
                            <td style={{ padding: "10px 8px", color: "var(--dark)", whiteSpace: "nowrap" }}>
                              {row.total_fees_min ? formatFeesRange(row.total_fees_min, row.total_fees_max) : "—"}
                            </td>
                            <td style={{ padding: "10px 0 10px 8px", color: "var(--dark)", whiteSpace: "nowrap" }}>
                              {row.avg_rating && row.review_count > 0 ? `${formatRating(Number(row.avg_rating))} / 5` : "No reviews"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              )}

              {/* UNIQUE THINGS — every line is derived from data we hold for this school */}
              {highlights.length > 0 && (
                <section id="section-unique" className="profile-section" style={cardStyle}>
                  <p style={eyebrowStyle}>What Makes This School Unique</p>
                  <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: 10 }}>
                    {highlights.map((h) => (
                      <li key={h} style={{ display: "flex", gap: 10, alignItems: "flex-start", fontSize: 14, color: "var(--dark)", lineHeight: 1.5 }}>
                        <Sparkles style={{ width: 15, height: 15, color: "#d97706", flexShrink: 0, marginTop: 3 }} />
                        {h}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {/* ADMISSIONS — status is derived from the window dates, never the stored label */}
              <section id="section-admission" className="profile-section" style={cardStyle}>
                <p style={eyebrowStyle}>Admissions</p>

                <div style={{
                  padding: "12px 14px", borderRadius: 12, marginBottom: admissions.length > 0 ? 14 : 0,
                  border: `1px solid ${admissionSummary.state === "open" ? "#86efac" : "var(--beige-500)"}`,
                  background: admissionSummary.state === "open" ? "rgba(134,239,172,0.12)" : "var(--beige-200)",
                }}>
                  <p style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)", marginBottom: 2 }}>
                    {admissionLabel(admissionSummary)}
                  </p>
                  <p style={{ fontSize: 12, color: "var(--muted)", lineHeight: 1.5 }}>
                    {admissionSummary.state === "open" && (admissionSummary.closesAt
                      ? `Applications close on ${formatAdmissionDate(admissionSummary.closesAt)}.`
                      : "Contact the school for the closing date.")}
                    {admissionSummary.state === "upcoming" && "Contact the school to confirm the schedule."}
                    {admissionSummary.state === "waitlist" && "New applications are being added to the waitlist."}
                    {admissionSummary.state === "closed" &&
                      `The latest window we have on record ended${admissionSummary.closesAt ? ` on ${formatAdmissionDate(admissionSummary.closesAt)}` : ""}. Dates for the next session haven't been published — enquire with the school directly.`}
                    {admissionSummary.state === "unknown" &&
                      "This school hasn't published its admission dates with us. Enquire with the school directly about the next intake."}
                  </p>
                </div>

                {admissions.length > 0 && (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {[...admissions]
                      .sort((a: any, b: any) => (b.opens_at ?? "").localeCompare(a.opens_at ?? ""))
                      .map((a: any) => {
                        const state = resolveAdmissionState(a);
                        const chip = {
                      open:     { label: "Open",      bg: "#16a34a",         fg: "white" },
                      upcoming: { label: "Upcoming",  bg: "var(--beige-400)", fg: "var(--dark)" },
                      waitlist: { label: "Waitlist",  bg: "#f59e0b",         fg: "white" },
                      closed:   { label: "Closed",    bg: "var(--beige-300)", fg: "var(--muted)" },
                    }[state];
                        const live = state === "open" || state === "upcoming";
                        return (
                          <div key={a.id} style={{ border: `1px solid ${state === "open" ? "#86efac" : "var(--beige-500)"}`,
                            borderRadius: 12, padding: 14, opacity: state === "closed" ? 0.8 : 1,
                            background: state === "open" ? "rgba(134,239,172,0.12)" : "var(--beige-200)" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 8, marginBottom: 4 }}>
                              <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>
                                {formatAcademicYear(a.academic_year)}{a.grade_from && ` · ${a.grade_from}${a.grade_to && a.grade_to !== a.grade_from ? ` – ${a.grade_to}` : ""}`}
                                {a.is_mid_year && " · Mid-year"}
                              </span>
                              <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                                background: chip.bg, color: chip.fg, flexShrink: 0 }}>{chip.label}</span>
                            </div>
                            {(a.opens_at || a.closes_at) && (
                              <p style={{ fontSize: 11, color: "var(--muted)" }}>
                                {a.opens_at && `Opens ${formatAdmissionDate(a.opens_at)}`}
                                {a.opens_at && a.closes_at && " · "}
                                {a.closes_at && `Closes ${formatAdmissionDate(a.closes_at)}`}
                              </p>
                            )}
                            {a.application_url && live && (
                              <a href={a.application_url} target="_blank" rel="noopener noreferrer"
                                style={{ fontSize: 12, color: "var(--brown-dark)", fontWeight: 600,
                                  display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                                Apply online <ExternalLink style={{ width: 11, height: 11 }} />
                              </a>
                            )}
                          </div>
                        );
                      })}
                  </div>
                )}
              </section>

              {avgBreakdown && (
              <section id="section-sentiment" className="profile-section"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>
                  Sentiment Analysis {reviews.length > 0 && <span style={{ fontWeight: 400, textTransform: "none", fontSize: 11 }}>({reviews.length} reviews)</span>}
                </p>
                {avgBreakdown ? (
                  <div style={{ background: "var(--beige-200)", border: "1px solid var(--beige-400)", borderRadius: 14, padding: 16 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 14 }}>
                      <span style={{ fontSize: 40, fontWeight: 800, color: "var(--dark)", lineHeight: 1 }}>{formatRating(avgRating)}</span>
                      <div>
                        <div style={{ display: "flex", gap: 2, marginBottom: 4 }}>
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s} style={{ width: 14, height: 14,
                              fill: s <= Math.round(avgRating || 0) ? "#f59e0b" : "transparent",
                              color: s <= Math.round(avgRating || 0) ? "#f59e0b" : "var(--beige-500)" }} />
                          ))}
                        </div>
                        <p style={{ fontSize: 11, color: "var(--muted)" }}>{reviews.length} reviews</p>
                      </div>
                    </div>
                    {[
                      { label: "Academics",  val: avgBreakdown.academics },
                      { label: "Facilities", val: avgBreakdown.facilities },
                      { label: "Faculty",    val: avgBreakdown.faculty },
                      { label: "Value",      val: avgBreakdown.value },
                    ].map(({ label, val }) => (
                      <div key={label} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                        <span style={{ fontSize: 12, color: "var(--muted)", width: 70, flexShrink: 0 }}>{label}</span>
                        <div style={{ flex: 1, height: 6, background: "var(--beige-400)", borderRadius: 99, overflow: "hidden" }}>
                          <div style={{ height: "100%", width: `${(val / 5) * 100}%`,
                            background: "var(--dark)", borderRadius: 99 }} />
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: "var(--dark)", width: 24 }}>{val.toFixed(1)}</span>
                      </div>
                    ))}
                  </div>
                ) : null}
              </section>
              )}

              {/* FEEDBACK */}
              <section id="section-feedback" className="profile-section"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Parent Feedback</p>
                {reviews.length > 0 ? (
                  <div>
                    {reviews.slice(0, 5).map((r: any, i: number) => (
                      <div key={r.id} style={{ paddingBottom: 14, marginBottom: 14,
                        borderBottom: i < Math.min(reviews.length, 5) - 1 ? "1px solid var(--beige-400)" : "none" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--beige-300)",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 13, fontWeight: 700, color: "var(--dark)", flexShrink: 0 }}>P</div>
                            <div>
                              <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>Parent</p>
                              <p style={{ fontSize: 11, color: "var(--muted)", textTransform: "capitalize" }}>
                                {(r.relation || "parent").replace(/_/g, " ")}
                              </p>
                            </div>
                          </div>
                          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                            <Star style={{ width: 13, height: 13, fill: "#f59e0b", color: "#f59e0b" }} />
                            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--dark)" }}>{r.rating_overall}</span>
                          </div>
                        </div>
                        {r.title && <p style={{ fontSize: 13, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>{r.title}</p>}
                        {r.body  && <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{r.body}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <p style={mutedNote}>
                    No parent reviews have been posted for this school yet. If your child studies here, your
                    experience would help other families decide.
                  </p>
                )}
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--beige-400)" }}>
                  <Link href={`/schools/${school.slug}/reviews`}
                    style={{ fontSize: 13, fontWeight: 600, color: "var(--brown-dark)" }}>
                    Read all reviews · Share your experience →
                  </Link>
                </div>
              </section>

              {/* SOURCES */}
              <section id="section-sources" className="profile-section" style={cardStyle}>
                <p style={eyebrowStyle}>Sources &amp; Links</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {school.website && (
                    <a href={school.website} target="_blank" rel="noopener noreferrer"
                      style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                        background: "var(--beige-200)", border: "1px solid var(--beige-500)", borderRadius: 12 }}>
                      <Globe style={{ width: 16, height: 16, color: "var(--muted)", flexShrink: 0 }} />
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>Official Website</p>
                        <p style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {school.website}
                        </p>
                      </div>
                      <ExternalLink style={{ width: 14, height: 14, color: "var(--muted)", flexShrink: 0 }} />
                    </a>
                  )}
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      background: "var(--beige-200)", border: "1px solid var(--beige-500)", borderRadius: 12 }}>
                    <MapPin style={{ width: 16, height: 16, color: "var(--muted)", flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>Google Maps</p>
                      <p style={{ fontSize: 11, color: "var(--muted)" }}>Location, directions and photos</p>
                    </div>
                    <ExternalLink style={{ width: 14, height: 14, color: "var(--muted)", flexShrink: 0 }} />
                  </a>
                  {!school.website && (
                    <p style={{ fontSize: 12, color: "var(--muted)" }}>The school&apos;s official website isn&apos;t listed yet.</p>
                  )}
                </div>
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 12, lineHeight: 1.6 }}>
                  Compiled from the school&apos;s own website, public school directories and parent feedback.
                  {school.last_data_updated_at && ` Last updated ${new Date(school.last_data_updated_at).toLocaleDateString("en-IN", { month: "short", year: "numeric" })}.`}
                  {" "}Fees and admission dates change — please confirm with the school before you apply.
                </p>
              </section>
            </div>

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-1">
              <SchoolActionsSidebar
                school={{
                  // Only what the sidebar needs — the full row (raw description, reviews…) stays on the server
                  id: school.id, slug: school.slug, name: school.name, area: school.area, city: school.city,
                  pincode: school.pincode, type: school.type, cover_image_url: school.cover_image_url,
                  website: school.website, phone: school.phone, email: school.email,
                  address_line1: school.address_line1, address_line2: school.address_line2,
                  last_data_updated_at: school.last_data_updated_at,
                  total_fees_min: details?.total_fees_min ?? null, total_fees_max: details?.total_fees_max ?? null,
                  curricula, avg_rating: avgRating,
                }}
                admission={{ open: admissionOpen, yearLabel: admissionYear, applicationUrl: openAdmissions.find((a: any) => a.application_url)?.application_url ?? null }}
              />
            </aside>
          </div>
        </div>

        {/* ── Hub-and-Spoke cross-links (PageRank distribution) ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 8px" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", gap: 8,
            borderTop: "1px solid var(--beige-400)", paddingTop: 20,
          }}>
            {/* Board-specific links for this school's curricula */}
            {curricula.map((c: string) => {
              const boardName = CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c;
              return (
                <Link key={`board-${c}`}
                  href={boardPageHref(citySlug, c)}
                  style={{
                    fontSize: 12, fontWeight: 600, color: "var(--muted)",
                    background: "var(--beige-200)", border: "1px solid var(--beige-400)",
                    borderRadius: 99, padding: "5px 12px", textDecoration: "none",
                    whiteSpace: "nowrap",
                  }}
                >
                  More {boardName} schools in {school.city}
                </Link>
              );
            })}

            {/* Area-specific link */}
            {school.area && areaSlug && (
              <Link
                href={`/schools/${citySlug}/${areaSlug}`}
                style={{
                  fontSize: 12, fontWeight: 600, color: "var(--muted)",
                  background: "var(--beige-200)", border: "1px solid var(--beige-400)",
                  borderRadius: 99, padding: "5px 12px", textDecoration: "none",
                  whiteSpace: "nowrap",
                }}
              >
                All schools in {school.area}
              </Link>
            )}

            {/* City hub link */}
            <Link
              href={`/schools/${citySlug}`}
              style={{
                fontSize: 12, fontWeight: 600, color: "var(--brown-dark)",
                background: "rgba(44,24,16,0.06)", border: "1px solid rgba(44,24,16,0.12)",
                borderRadius: 99, padding: "5px 12px", textDecoration: "none",
                whiteSpace: "nowrap",
              }}
            >
              Top-rated schools in {school.city} →
            </Link>
          </div>
        </div>

        {/* Related Schools */}
        {relatedSchools && relatedSchools.length > 0 && (
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 32px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase",
              letterSpacing: "0.08em", marginBottom: 14 }}>Families also explored in {school.city}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 12 }}>
              {relatedSchools.map((s: any) => (
                <Link key={s.slug} href={`/schools/${s.slug}`}
                  style={{ background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                    borderRadius: 14, overflow: "hidden", display: "block",
                    transition: "box-shadow 0.2s, border-color 0.2s" }}>
                  <div style={{ height: 90, background: "var(--beige-300)", position: "relative" }}>
                    {s.cover_image_url && (
                      <Image src={s.cover_image_url} alt={`${s.name} campus in ${s.area || s.city}`} fill className="object-cover" />
                    )}
                  </div>
                  <div style={{ padding: "10px 12px" }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--dark)", marginBottom: 4,
                      overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical" }}>{s.name}</p>
                    {s.area && (
                      <p style={{ fontSize: 11, color: "var(--muted)", display: "flex", alignItems: "center", gap: 4 }}>
                        <MapPin style={{ width: 10, height: 10 }} /> {s.area}
                      </p>
                    )}
                    {s.total_fees_min && (
                      <p style={{ fontSize: 12, fontWeight: 600, color: "var(--brown-dark)", marginTop: 4 }}>
                        {formatFeesRange(s.total_fees_min, s.total_fees_max)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

      </main>
      <Footer />
    </>
  );
}
