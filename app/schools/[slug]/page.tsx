import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import {
  MapPin, Phone, Globe, Mail, CheckCircle2, Star,
  Users, Bus, Clock, Calendar, IndianRupee, BookOpen,
  Building2, Trophy, Music, Languages, ChevronRight,
  ExternalLink, AlertCircle
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { EnquiryForm } from "@/components/schools/EnquiryForm";
import { SchoolActionsSidebar } from "@/components/schools/SchoolActionsSidebar";
import { SchoolProfileTabs } from "@/components/schools/SchoolProfileTabs";
import {
  formatFeesRange, formatRating, formatSchoolHours,
  getVerificationBadge, cn
} from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS, GENDER_LABELS } from "@/lib/types";

// Dynamic rendering — no static params needed at build time
export const dynamic = "force-dynamic";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";
const YEAR = new Date().getFullYear();

// Lookup maps used by generateMetadata (hoisted before function call)
const CITY_HUB_SLUGS_META: Record<string, string> = {
  bengaluru: "bangalore", bangalore: "bangalore", delhi: "delhi",
  chennai: "chennai", mumbai: "mumbai",
};
const CITY_META_LABELS: Record<string, { label: string }> = {
  bangalore: { label: "Bengaluru" },
  delhi:     { label: "Delhi" },
  chennai:   { label: "Chennai" },
  mumbai:    { label: "Mumbai" },
};

// ── Metadata ─────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;

  // City hub pages get their own meta
  const cityKey = CITY_HUB_SLUGS_META[slug.toLowerCase()];
  if (cityKey) {
    const m = CITY_META_LABELS[cityKey];
    const canonicalUrl = `${APP_URL}/schools/${slug.toLowerCase()}`;
    const title = `Top Schools in ${m.label} ${YEAR} | CBSE, ICSE, IB — SchoolFind360`;
    const description = `Browse 50+ verified schools in ${m.label}. Compare ${YEAR} fees, CBSE, ICSE, IB boards, area-wise listings, and real parent reviews on SchoolFind360.`;
    return {
      title, description,
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true },
      openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "SchoolFind360" },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  const supabase = await createClient();
  const { data } = await supabase
    .from("schools_with_details")
    .select("name, description, area, city, cover_image_url, total_fees_min, total_fees_max, avg_rating, type, verified")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "School Not Found", robots: { index: false, follow: false } };

  // Count populated fields to detect thin content
  const fieldsPopulated = [
    data.name, data.description, data.area, data.total_fees_min,
    data.total_fees_max, data.avg_rating, data.type,
  ].filter(Boolean).length;
  const isThinContent = fieldsPopulated < 3; // less than 30% of key fields

  const canonicalUrl = `${APP_URL}/schools/${slug}`;
  const location  = data.area || data.city;
  const city      = data.city || "Bengaluru";

  // Dynamic title template: {School_Name}, {Neighbourhood} | Fees, Admissions {Year} & Reviews
  const title = `${data.name}, ${location} | Fees, Admissions ${YEAR} & Reviews - SchoolFind360`;

  // Dynamic description template
  const description = data.description
    ? `${data.description} View full fees, admissions ${YEAR}, and parent reviews on SchoolFind360.`
    : `Looking for admissions at ${data.name} in ${location}, ${city}? Check the complete ${YEAR} fee structure, board curriculum, facilities, and real parent reviews on SchoolFind360.`;

  return {
    title,
    description,
    keywords: [
      data.name,
      `${data.name} fees ${YEAR}`,
      `${data.name} admissions ${YEAR}`,
      `schools in ${location}`,
      `best schools ${city}`,
      `school admission ${city} ${YEAR}`,
    ],
    // Self-referential canonical — every profile points to itself
    alternates: { canonical: canonicalUrl },
    // noindex thin/incomplete profiles
    robots: isThinContent
      ? { index: false, follow: true }
      : { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1 } },
    openGraph: {
      title,
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
      title,
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

// ── City hub page (SSR) ───────────────────────────────────────────────────────
const CITY_META: Record<string, { label: string; state: string; description: string; boards: string[] }> = {
  bangalore: { label: "Bengaluru", state: "Karnataka",    description: "India's tech capital",  boards: ["CBSE","ICSE","IB","IGCSE","Cambridge","State Board"] },
  delhi:     { label: "Delhi",     state: "Delhi",        description: "The national capital",   boards: ["CBSE","ICSE","IB","IGCSE","Cambridge"] },
  chennai:   { label: "Chennai",   state: "Tamil Nadu",   description: "Gateway to the South",  boards: ["CBSE","ICSE","IB","Cambridge","State Board"] },
  mumbai:    { label: "Mumbai",    state: "Maharashtra",  description: "India's financial hub",  boards: ["CBSE","ICSE","IB","Cambridge","State Board"] },
};

async function CityHubPage({ cityKey, citySlug }: { cityKey: string; citySlug: string }) {
  const supabase = await createClient();
  const meta = CITY_META[cityKey];
  const cityDbName = meta.label;

  // Fetch top schools in this city (server-side, no JS needed)
  const { data: schools } = await supabase
    .from("schools_with_details")
    .select("slug, name, area, type, total_fees_min, total_fees_max, avg_rating, cover_image_url")
    .eq("city", cityDbName)
    .not("total_fees_min", "is", null)
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .limit(24);

  // Unique areas with school counts
  const { data: areaRows } = await supabase
    .from("schools")
    .select("area")
    .eq("city", cityDbName)
    .not("area", "is", null);

  const areaCounts: Record<string, number> = {};
  (areaRows || []).forEach((r: any) => {
    if (r.area) areaCounts[r.area] = (areaCounts[r.area] || 0) + 1;
  });
  const areas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1]);

  const canonicalUrl = `${APP_URL}/schools/${citySlug}`;
  const title = `Top Schools in ${meta.label} ${YEAR} | CBSE, ICSE, IB Schools — SchoolFind360`;
  const desc  = `Browse ${(schools || []).length}+ verified schools in ${meta.label}. Compare ${YEAR} fees, CBSE, ICSE, IB boards, area-wise listings, and real parent reviews.`;

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Top Schools in ${meta.label}`,
    description: desc,
    numberOfItems: (schools || []).length,
    itemListElement: (schools || []).map((s: any, i: number) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${APP_URL}/schools/${s.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      {/* Inline metadata via Next.js Head is handled by generateMetadata above; here we just render the page */}
      <Header />
      <main className="bg-gray-50 min-h-screen pb-16">
        {/* Hero */}
        <div className="bg-gradient-to-br from-[#2C1810] to-[#5C3820] text-white py-12 px-4">
          <div className="max-w-4xl mx-auto">
            <nav className="text-xs text-white/60 mb-4 flex items-center gap-1">
              <Link href="/" className="hover:text-white">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/schools" className="hover:text-white">Schools</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-white">{meta.label}</span>
            </nav>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">
              Schools in {meta.label}
            </h1>
            <p className="text-white/70 text-base mb-6">{meta.description} · {(schools || []).length}+ verified schools</p>
            <div className="flex flex-wrap gap-2">
              {meta.boards.map((b) => (
                <Link
                  key={b}
                  href={`/schools?city=${cityKey}&curriculum=${b.toLowerCase().replace(/\s/g,"-")}`}
                  className="text-xs px-3 py-1.5 rounded-full bg-white/15 hover:bg-white/25 text-white font-medium transition-colors"
                >
                  {b} Schools
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-10">
          {/* Neighbourhoods */}
          {areas.length > 0 && (
            <section>
              <h2 className="text-xl font-bold text-gray-900 mb-4">Browse by Neighbourhood</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {areas.map(([area, count]) => (
                  <Link
                    key={area}
                    href={`/schools?city=${cityKey}&area=${encodeURIComponent(area)}`}
                    className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
                  >
                    <p className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors">{area}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{count} school{count !== 1 ? "s" : ""}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {/* School list */}
          {(schools || []).length > 0 && (
            <section>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-900">Top Schools in {meta.label}</h2>
                <Link href={`/schools?city=${cityKey}`} className="text-sm text-blue-600 hover:underline">
                  View all →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(schools || []).map((s: any) => (
                  <Link
                    key={s.slug}
                    href={`/schools/${s.slug}`}
                    className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 flex gap-0"
                  >
                    <div className="w-24 h-24 flex-shrink-0 bg-gradient-to-br from-blue-100 to-indigo-100 relative self-stretch">
                      {s.cover_image_url && (
                        <Image src={s.cover_image_url} alt={s.name} fill className="object-cover" />
                      )}
                    </div>
                    <div className="p-3 flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{s.name}</p>
                      {s.area && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 flex-shrink-0" />{s.area}
                        </p>
                      )}
                      {s.total_fees_min && (
                        <p className="text-xs font-medium text-blue-700 mt-1">
                          {formatFeesRange(s.total_fees_min, s.total_fees_max)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center mt-6">
                <Link
                  href={`/schools?city=${cityKey}`}
                  className="inline-block px-6 py-3 bg-[#2C1810] text-white rounded-xl font-semibold text-sm hover:bg-[#5C3820] transition-colors"
                >
                  Explore all {meta.label} schools →
                </Link>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}

// ── City hub redirect ─────────────────────────────────────────────────────────
// /schools/bengaluru, /schools/delhi, /schools/chennai → city hub pages
const CITY_HUB_SLUGS: Record<string, string> = {
  bengaluru: "bangalore",
  bangalore: "bangalore",
  delhi: "delhi",
  chennai: "chennai",
  mumbai: "mumbai",
};

// ── Page ──────────────────────────────────────────────────────────────────────
export default async function SchoolProfilePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  // Intercept city hub URLs and render city landing page
  const cityKey = CITY_HUB_SLUGS[slug.toLowerCase()];
  if (cityKey) {
    return <CityHubPage cityKey={cityKey} citySlug={slug.toLowerCase()} />;
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
        reviews(
          id, rating_academics, rating_facilities,
          rating_faculty, rating_value, rating_overall,
          title, body, relation, is_verified, created_at
        )
      `)
      .eq("slug", slug)
      .single();

    if (error || !data) fetchFailed = true;
    else school = data;
  } catch {
    fetchFailed = true;
  }

  if (fetchFailed || !school) notFound();

  const details = Array.isArray(school.school_details)
    ? school.school_details[0] ?? null
    : school.school_details ?? null;
  const curricula = (school.school_curricula || []).map((c: any) => c.curriculum);
  const sports = (school.school_sports || []).map((s: any) => s.sports?.name).filter(Boolean);
  const extras = (school.school_extracurriculars || []).map((e: any) => e.extracurriculars?.name).filter(Boolean);
  const languages = school.school_languages || [];
  const admissions = school.admission_windows || [];
  const reviews = school.reviews || [];

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

  const openAdmissions = admissions.filter((a: any) => a.status === "open");
  const badge = getVerificationBadge(school.verified);

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
    description: school.description ?? undefined,
    url: `${appUrl}/schools/${school.slug}`,
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
    ...(sd?.total_fees_min && {
      priceRange: `₹${(sd.total_fees_min / 100000).toFixed(1)}L – ₹${(sd.total_fees_max / 100000).toFixed(1)}L`,
    }),
    ...(avgRating && reviews.length && {
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: avgRating.toFixed(1),
        reviewCount: reviews.length,
        bestRating: "5",
      },
    }),
  };

  // BreadcrumbList JSON-LD
  const citySlug = school.city?.toLowerCase().replace(/\s+/g, "-") || "bengaluru";
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: appUrl },
      { "@type": "ListItem", position: 2, name: "Schools", item: `${appUrl}/schools` },
      ...(school.city
        ? [{ "@type": "ListItem", position: 3, name: `${school.city} Schools`, item: `${appUrl}/schools?city=${citySlug}` }]
        : []),
      ...(school.area
        ? [{ "@type": "ListItem", position: school.city ? 4 : 3, name: school.area, item: `${appUrl}/schools?city=${citySlug}&area=${encodeURIComponent(school.area)}` }]
        : []),
      { "@type": "ListItem", position: school.city && school.area ? 5 : school.city || school.area ? 4 : 3, name: school.name, item: `${appUrl}/schools/${school.slug}` },
    ],
  };

  // Related schools (same area/city, excluding current)
  const { data: relatedSchools } = await supabase
    .from("schools_with_details")
    .select("id, slug, name, area, city, total_fees_min, total_fees_max, avg_rating, cover_image_url")
    .eq("city", school.city)
    .neq("slug", school.slug)
    .not("total_fees_min", "is", null)
    .limit(4);


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
      <Header />
      <main className="bg-gray-50 min-h-screen pb-24">
        {/* Hero */}
        <div className="relative h-56 sm:h-72 bg-gray-200 overflow-hidden">
          {school.cover_image_url ? (
            <Image
              src={school.cover_image_url}
              alt={school.name}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-700" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
          <div className="absolute bottom-5 left-5 right-5">
            <div className="flex items-end gap-3">
              {school.logo_url && (
                <div className="w-16 h-16 rounded-xl overflow-hidden border-2 border-white shadow-lg bg-white flex-shrink-0">
                  <Image src={school.logo_url} alt="" width={64} height={64} className="object-cover" />
                </div>
              )}
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium", badge.color)}>
                    {badge.verified && <CheckCircle2 className="inline w-3 h-3 mr-1" />}
                    {badge.label}
                  </span>
                  {openAdmissions.length > 0 && (
                    <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full font-medium">
                      Admissions Open 2026-27
                    </span>
                  )}
                </div>
                <h1 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
                  {school.name}
                </h1>
                <p className="text-white/80 text-sm mt-1 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5" />
                  {school.address_line1 ? `${school.address_line1}, ` : ""}
                  {school.area || ""} · {school.city}
                  {school.pincode && ` – ${school.pincode}`}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumb */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center gap-1 text-xs text-gray-500 overflow-x-auto whitespace-nowrap">
            <Link href="/" className="hover:text-blue-600 flex-shrink-0">Home</Link>
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <Link href="/schools" className="hover:text-blue-600 flex-shrink-0">Schools</Link>
            {school.city && (
              <>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <Link href={`/schools?city=${citySlug}`} className="hover:text-blue-600 flex-shrink-0">
                  {school.city} Schools
                </Link>
              </>
            )}
            {school.area && (
              <>
                <ChevronRight className="w-3 h-3 flex-shrink-0" />
                <Link href={`/schools?city=${citySlug}&area=${encodeURIComponent(school.area)}`} className="hover:text-blue-600 flex-shrink-0">
                  {school.area}
                </Link>
              </>
            )}
            <ChevronRight className="w-3 h-3 flex-shrink-0" />
            <span className="text-gray-900 flex-shrink-0 truncate max-w-[180px]">{school.name}</span>
          </div>
        </div>

        {/* Tab navigation bar — sticky below the site header (top-14 = 56px) */}
        <SchoolProfileTabs />

        {/* Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ── Main content ── */}
            <div className="lg:col-span-2 space-y-8">

              {/* ── PHOTOS ── */}
              <section id="section-photos" className="bg-white rounded-2xl overflow-hidden shadow-sm scroll-mt-[116px]">
                {school.cover_image_url ? (
                  <div className="relative h-56 sm:h-72">
                    <Image src={school.cover_image_url} alt={`${school.name} campus`} fill className="object-cover" />
                  </div>
                ) : (
                  <div className="p-6">
                    <h2 className="text-lg font-bold text-gray-900 mb-4">Campus Photos</h2>
                    <div className="sheen-wrap">
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                        {[160, 140, 155, 145, 165, 150].map((h, i) => (
                          <div key={i} className="sheen" style={{ height: h, borderRadius: 12 }} />
                        ))}
                      </div>
                      <div className="sheen-overlay"><span className="sheen-badge">📷 Photos Coming Soon</span></div>
                    </div>
                  </div>
                )}
              </section>

              {/* ── BASIC DETAILS (stats) ── */}
              <div id="section-basic" className="grid grid-cols-2 sm:grid-cols-4 gap-3 scroll-mt-[116px]">
                <StatBox icon={IndianRupee} label="Annual Fees"
                  value={formatFeesRange(details?.total_fees_min, details?.total_fees_max)} />
                {avgRating && (
                  <StatBox icon={Star} label="Overall Rating"
                    value={`${formatRating(avgRating)} / 5`}
                    sub={`${reviews.length} reviews`} color="text-amber-600" />
                )}
                {details?.student_count && (
                  <StatBox icon={Users} label="Students"
                    value={details.student_count.toLocaleString()} />
                )}
                {details?.student_teacher_ratio && (
                  <StatBox icon={Users} label="Student:Teacher"
                    value={`${details.student_teacher_ratio}:1`} />
                )}
              </div>

              {/* ── SUMMARY ── */}
              <section id="section-summary" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-3">About</h2>
                {school.description ? (
                  <p className="text-gray-600 leading-relaxed">{school.description}</p>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 90 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[85, 65, 75, 55].map((w, i) => (
                        <div key={i} className="sheen" style={{ height: 13, width: `${w}%` }} />
                      ))}
                    </div>
                    <div className="sheen-overlay"><span className="sheen-badge">📝 Summary Coming Soon</span></div>
                  </div>
                )}
                <div className="flex flex-wrap gap-2 mt-4">
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {SCHOOL_TYPE_LABELS[school.type as keyof typeof SCHOOL_TYPE_LABELS]}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                    {GENDER_LABELS[school.gender as keyof typeof GENDER_LABELS]}
                  </span>
                  {school.established_year && (
                    <span className="text-xs bg-gray-100 text-gray-600 px-3 py-1 rounded-full">
                      Est. {school.established_year}
                    </span>
                  )}
                  {curricula.map((c: string) => (
                    <span key={c} className="text-xs bg-blue-50 text-blue-700 px-3 py-1 rounded-full font-medium">
                      {CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] || c}
                    </span>
                  ))}
                </div>
              </section>

              {/* ── FEES ── */}
              <section id="section-fees" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <IndianRupee className="w-5 h-5 text-blue-600" /> Fee Breakdown
                </h2>
                {details ? (
                  <div className="space-y-3">
                    {[
                      { label: "Annual Tuition", min: details.annual_tuition_fees_min, max: details.annual_tuition_fees_max },
                      { label: "Development Fee", min: details.development_fees, max: null },
                      { label: "Transport Fee", min: details.transport_fees, max: null },
                      { label: "Activity Fee", min: details.activity_fees, max: null },
                      { label: "Admission Fee (one-time)", min: details.admission_fees, max: null },
                    ]
                      .filter((f) => f.min)
                      .map((fee) => (
                        <div key={fee.label} className="flex justify-between items-center py-2 border-b border-gray-50">
                          <span className="text-sm text-gray-600">{fee.label}</span>
                          <span className="text-sm font-semibold text-gray-900">{formatFeesRange(fee.min, fee.max)}</span>
                        </div>
                      ))}
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm font-bold text-gray-900">Total Annual</span>
                      <span className="text-base font-bold text-blue-700">
                        {formatFeesRange(details.total_fees_min, details.total_fees_max)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 110 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {["Annual Tuition", "Development Fee", "Transport Fee", "Total Annual"].map((label) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <div className="sheen" style={{ height: 13, width: "40%" }} />
                          <div className="sheen" style={{ height: 13, width: "20%" }} />
                        </div>
                      ))}
                    </div>
                    <div className="sheen-overlay"><span className="sheen-badge">💰 Fee Details Coming Soon</span></div>
                  </div>
                )}
              </section>

              {/* ── SCHOOL DETAILS ── */}
              <section id="section-basic-details" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">School Details</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {details?.school_hours_start && (
                    <div className="flex items-start gap-3">
                      <Clock className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">School Hours</p>
                        <p className="text-sm font-medium text-gray-800">
                          {formatSchoolHours(details.school_hours_start, details.school_hours_end)}
                        </p>
                      </div>
                    </div>
                  )}
                  {details?.has_transport && (
                    <div className="flex items-start gap-3">
                      <Bus className="w-4 h-4 text-green-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Transport</p>
                        <p className="text-sm font-medium text-gray-800">Available</p>
                        {details.transport_description && (
                          <p className="text-xs text-gray-500 mt-0.5">{details.transport_description}</p>
                        )}
                      </div>
                    </div>
                  )}
                  {school.website && (
                    <div className="flex items-start gap-3">
                      <Globe className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Website</p>
                        <a href={school.website} target="_blank" rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:underline flex items-center gap-1">
                          Visit website <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    </div>
                  )}
                  {school.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-4 h-4 text-blue-500 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500">Phone</p>
                        <a href={`tel:${school.phone}`} className="text-sm font-medium text-gray-800 hover:text-blue-600">
                          {school.phone}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
                {languages.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <p className="text-xs text-gray-500 mb-2 flex items-center gap-1">
                      <Languages className="w-3.5 h-3.5" /> Languages
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {languages.map((l: any) => (
                        <span key={`${l.language}-${l.type}`}
                          className="text-xs px-2.5 py-1 rounded-full border border-gray-200 text-gray-600">
                          {l.language}
                          {l.type === "medium_of_instruction" && (
                            <span className="text-blue-500 ml-1">(medium)</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </section>

              {/* ── CAMPUS ── */}
              <section id="section-campus" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Sports & Extracurriculars</h2>
                {(sports.length > 0 || extras.length > 0) ? (
                  <>
                    {sports.length > 0 && (
                      <div className="mb-4">
                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Trophy className="w-4 h-4 text-amber-500" /> Sports
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {sports.map((s: string) => (
                            <span key={s} className="text-xs bg-amber-50 text-amber-700 px-2.5 py-1 rounded-full border border-amber-200">{s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {extras.length > 0 && (
                      <div>
                        <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                          <Music className="w-4 h-4 text-purple-500" /> Activities
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {extras.map((e: string) => (
                            <span key={e} className="text-xs bg-purple-50 text-purple-700 px-2.5 py-1 rounded-full border border-purple-200">{e}</span>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 100 }}>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                      {[80, 100, 65, 90, 75, 110, 70, 95].map((w, i) => (
                        <div key={i} className="sheen" style={{ height: 28, width: w, borderRadius: 99 }} />
                      ))}
                    </div>
                    <div className="sheen-overlay"><span className="sheen-badge">🏟️ Campus Details Coming Soon</span></div>
                  </div>
                )}
              </section>

              {/* ── PEER GROUP ── */}
              <section id="section-peer" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">Peer Group</h2>
                <div className="sheen-wrap" style={{ minHeight: 110 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="sheen" style={{ height: 90, borderRadius: 14 }} />
                    ))}
                  </div>
                  <div className="sheen-overlay"><span className="sheen-badge">🏫 Peer Analysis Coming Soon</span></div>
                </div>
              </section>

              {/* ── UNIQUE THINGS ── */}
              <section id="section-unique" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4">What Makes This School Unique</h2>
                <div className="sheen-wrap" style={{ minHeight: 100 }}>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {[70, 55, 65].map((w, i) => (
                      <div key={i} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                        <div className="sheen" style={{ width: 20, height: 20, borderRadius: "50%", flexShrink: 0 }} />
                        <div className="sheen" style={{ height: 13, width: `${w}%` }} />
                      </div>
                    ))}
                  </div>
                  <div className="sheen-overlay"><span className="sheen-badge">✨ Unique Insights Coming Soon</span></div>
                </div>
              </section>

              {/* ── ADMISSIONS ── */}
              <section id="section-admission" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-blue-600" /> Admissions
                </h2>
                {admissions.length > 0 ? (
                  <div className="space-y-3">
                    {admissions.map((a: any) => (
                      <div key={a.id}
                        className={cn("border rounded-xl p-4",
                          a.status === "open" ? "border-green-200 bg-green-50" : "border-gray-200 bg-gray-50")}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="font-semibold text-sm text-gray-800">
                            {a.academic_year} · {a.grade_from} – {a.grade_to}
                          </span>
                          <span className={cn("text-xs px-2 py-0.5 rounded-full font-medium",
                            a.status === "open" ? "bg-green-500 text-white" :
                            a.status === "upcoming" ? "bg-blue-100 text-blue-700" :
                            a.status === "waitlist" ? "bg-orange-100 text-orange-700" :
                            "bg-gray-200 text-gray-600")}>
                            {a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : "Unknown"}
                          </span>
                        </div>
                        {a.is_mid_year && (
                          <span className="text-xs bg-orange-100 text-orange-600 px-2 py-0.5 rounded-full mr-2">Mid-year</span>
                        )}
                        {(a.opens_at || a.closes_at) && (
                          <p className="text-xs text-gray-500 mt-1">
                            {a.opens_at && `Opens: ${new Date(a.opens_at).toLocaleDateString("en-IN")}`}
                            {a.opens_at && a.closes_at && " · "}
                            {a.closes_at && `Closes: ${new Date(a.closes_at).toLocaleDateString("en-IN")}`}
                          </p>
                        )}
                        {a.notes && <p className="text-xs text-gray-500 mt-1">{a.notes}</p>}
                        {a.application_url && (
                          <a href={a.application_url} target="_blank" rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline mt-2 inline-flex items-center gap-1">
                            Apply online <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 90 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                      {[1, 2].map((i) => (
                        <div key={i} className="sheen" style={{ height: 56, borderRadius: 14 }} />
                      ))}
                    </div>
                    <div className="sheen-overlay"><span className="sheen-badge">📅 Admissions Details Coming Soon</span></div>
                  </div>
                )}
              </section>

              {/* ── SENTIMENT ANALYSIS ── */}
              <section id="section-sentiment" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" /> Sentiment Analysis
                  {reviews.length > 0 && (
                    <span className="text-sm font-normal text-gray-500">({reviews.length} reviews)</span>
                  )}
                </h2>
                {avgBreakdown ? (
                  <div className="mb-6 p-4 bg-amber-50 rounded-xl">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-4xl font-bold text-amber-600">{formatRating(avgRating)}</span>
                      <div>
                        <div className="flex gap-0.5 mb-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star key={s}
                              className={cn("w-4 h-4", s <= Math.round(avgRating || 0) ? "fill-amber-400 text-amber-400" : "text-gray-300")} />
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{reviews.length} reviews</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <RatingBar label="Academics"  value={parseFloat(avgBreakdown.academics.toFixed(1))} />
                      <RatingBar label="Facilities" value={parseFloat(avgBreakdown.facilities.toFixed(1))} />
                      <RatingBar label="Faculty"    value={parseFloat(avgBreakdown.faculty.toFixed(1))} />
                      <RatingBar label="Value"      value={parseFloat(avgBreakdown.value.toFixed(1))} />
                    </div>
                  </div>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 130 }}>
                    {/* Skeleton: big score circle + 4 rating bars */}
                    <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                      <div className="sheen" style={{ width: 72, height: 72, borderRadius: "50%", flexShrink: 0 }} />
                      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12, paddingTop: 4 }}>
                        {["Academics", "Facilities", "Faculty", "Value"].map((label) => (
                          <div key={label} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                            <div className="sheen" style={{ height: 11, width: 70, flexShrink: 0 }} />
                            <div className="sheen" style={{ height: 8, flex: 1, borderRadius: 99 }} />
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="sheen-overlay"><span className="sheen-badge">📊 Analytics Coming Soon</span></div>
                  </div>
                )}
              </section>

              {/* ── PARENT FEEDBACK ── */}
              <section id="section-feedback" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-500" /> Parent Feedback
                </h2>
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.slice(0, 5).map((r: any) => (
                      <div key={r.id} className="border-b border-gray-100 pb-4 last:border-0">
                        <div className="flex items-center justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-semibold text-sm">
                              P
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-800">Parent</p>
                              <p className="text-xs text-gray-400 capitalize">{(r.relation || "parent").replace(/_/g, " ")}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                            <span className="text-sm font-semibold text-gray-700">{r.rating_overall}</span>
                          </div>
                        </div>
                        {r.title && <p className="text-sm font-semibold text-gray-800 mb-1">{r.title}</p>}
                        {r.body  && <p className="text-sm text-gray-600">{r.body}</p>}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 160 }}>
                    {/* 3 review card skeletons */}
                    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                      {[1, 2, 3].map((i) => (
                        <div key={i} style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                          <div className="sheen" style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0 }} />
                          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 8 }}>
                            <div className="sheen" style={{ height: 12, width: "45%" }} />
                            <div className="sheen" style={{ height: 11, width: "80%" }} />
                            <div className="sheen" style={{ height: 11, width: "65%" }} />
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="sheen-overlay">
                      <span className="sheen-badge">✍️ Be the first to review {school.name}!</span>
                    </div>
                  </div>
                )}
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <Link href={`/schools/${school.slug}/reviews`}
                    className="text-sm text-blue-600 hover:underline font-medium">
                    View all reviews & leave a review →
                  </Link>
                </div>
              </section>

              {/* ── SOURCES ── */}
              <section id="section-sources" className="bg-white rounded-2xl p-6 shadow-sm scroll-mt-[116px]">
                <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <ExternalLink className="w-5 h-5 text-blue-600" /> Sources & Links
                </h2>
                {school.website ? (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-colors group">
                    <Globe className="w-4 h-4 text-blue-500 flex-shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-800 group-hover:text-blue-700">Official Website</p>
                      <p className="text-xs text-gray-400 truncate">{school.website}</p>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-gray-400 flex-shrink-0 ml-auto" />
                  </a>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 60 }}>
                    <div className="sheen" style={{ height: 52, borderRadius: 12 }} />
                    <div className="sheen-overlay"><span className="sheen-badge">🔗 Links Coming Soon</span></div>
                  </div>
                )}
                <p className="text-xs text-gray-400 mt-3">
                  Fee and rating data sourced from school websites, Ezyschooling, and parent surveys. Last updated {YEAR}.
                </p>
              </section>
            </div>

            {/* ── Sidebar ── */}
            <aside className="lg:col-span-1">
              <SchoolActionsSidebar school={school} />
            </aside>
          </div>
        </div>
        {/* Related Schools */}
        {relatedSchools && relatedSchools.length > 0 && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              More Schools in {school.city}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedSchools.map((s: any) => (
                <Link
                  key={s.slug}
                  href={`/schools/${s.slug}`}
                  className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow border border-gray-100 group"
                >
                  <div className="h-28 bg-gradient-to-br from-blue-100 to-indigo-100 relative overflow-hidden">
                    {s.cover_image_url && (
                      <Image src={s.cover_image_url} alt={s.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 mb-1">{s.name}</p>
                    {s.area && (
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> {s.area}
                      </p>
                    )}
                    {s.total_fees_min && (
                      <p className="text-xs font-medium text-blue-700 mt-1">
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
