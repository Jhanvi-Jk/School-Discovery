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

  // Fetch photos separately so a missing school_photos table never 404s the page.
  // Once you run migration 024, this will start returning real data automatically.
  let schoolPhotosRaw: any[] = [];
  try {
    const { data: photosData } = await supabase
      .from("school_photos")
      .select("url, sort_order, alt_text, is_cover")
      .eq("school_id", school.id)
      .order("sort_order");
    if (photosData) schoolPhotosRaw = photosData;
  } catch {
    // Table doesn't exist yet — silently fall back to cover_image_url / sheen
  }

  const details = Array.isArray(school.school_details)
    ? school.school_details[0] ?? null
    : school.school_details ?? null;
  const curricula  = (school.school_curricula || []).map((c: any) => c.curriculum);
  const sports     = (school.school_sports || []).map((s: any) => s.sports?.name).filter(Boolean);
  const extras     = (school.school_extracurriculars || []).map((e: any) => e.extracurriculars?.name).filter(Boolean);
  const languages  = school.school_languages || [];
  const admissions = school.admission_windows || [];
  const reviews    = school.reviews || [];
  // Photos: from separate safe query; empty array → sheen fallback in UI
  const photos: { url: string; alt: string }[] = schoolPhotosRaw
    .map((p: any) => ({ url: p.url, alt: p.alt_text || school.name }));

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
      <main style={{ background: "var(--beige-300)" }}>

        {/* ── Hero ── */}
        <div style={{ position: "relative", height: 220, overflow: "hidden", background: "#1a1a1a" }}>
          {school.cover_image_url ? (
            <Image src={school.cover_image_url} alt={school.name} fill className="object-cover" priority
              style={{ opacity: 0.45 }} />
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
                  <Image src={school.logo_url} alt="" width={56} height={56} className="object-cover" />
                </div>
              )}
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6, flexWrap: "wrap" }}>
                  {badge.verified && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "rgba(255,255,255,0.15)",
                      color: "rgba(255,255,255,0.9)", padding: "3px 10px", borderRadius: 99,
                      display: "flex", alignItems: "center", gap: 4 }}>
                      <CheckCircle2 style={{ width: 11, height: 11 }} /> Verified
                    </span>
                  )}
                  {openAdmissions.length > 0 && (
                    <span style={{ fontSize: 11, fontWeight: 700, background: "#16a34a",
                      color: "white", padding: "3px 10px", borderRadius: 99 }}>
                      Admissions Open 2026-27
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

        {/* ── Breadcrumb ── */}
        <div style={{ background: "var(--beige-200)", borderBottom: "1px solid var(--beige-500)" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "8px 20px",
            display: "flex", alignItems: "center", gap: 4, fontSize: 12,
            color: "var(--muted)", overflowX: "auto", whiteSpace: "nowrap" }}>
            <Link href="/" style={{ color: "var(--muted)", flexShrink: 0 }}>Home</Link>
            <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
            <Link href="/schools" style={{ color: "var(--muted)", flexShrink: 0 }}>Schools</Link>
            {school.city && (<>
              <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
              <Link href={`/schools?city=${citySlug}`} style={{ color: "var(--muted)", flexShrink: 0 }}>
                {school.city}
              </Link>
            </>)}
            {school.area && (<>
              <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
              <Link href={`/schools?city=${citySlug}&area=${encodeURIComponent(school.area)}`}
                style={{ color: "var(--muted)", flexShrink: 0 }}>{school.area}</Link>
            </>)}
            <ChevronRight style={{ width: 11, height: 11, flexShrink: 0 }} />
            <span style={{ color: "var(--dark)", fontWeight: 600, flexShrink: 0,
              overflow: "hidden", textOverflow: "ellipsis", maxWidth: 200 }}>{school.name}</span>
          </div>
        </div>

        {/* ── Tab bar ── */}
        <SchoolProfileTabs />

        {/* ── Body ── */}
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "24px 20px" }}>
          <div className="grid grid-cols-1 lg:grid-cols-3" style={{ gap: 20 }}>

            {/* Main */}
            <div className="lg:col-span-2" style={{ display: "flex", flexDirection: "column", gap: 16 }}>

              {/* PHOTOS */}
              <section id="section-photos" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, overflow: "hidden" }}>
                {photos.length > 0 ? (
                  /* Gallery grid — up to 3 photos from school_photos table */
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
                        <Image src={p.url} alt={p.alt} fill className="object-cover"
                          style={{ transition: "transform 0.3s" }} priority={i === 0} />
                      </div>
                    ))}
                  </div>
                ) : school.cover_image_url ? (
                  /* Fallback: single cover image */
                  <div style={{ position: "relative", height: 260 }}>
                    <Image src={school.cover_image_url} alt={`${school.name} campus`} fill className="object-cover" priority />
                  </div>
                ) : (
                  /* Sheen skeleton — no photos yet */
                  <div style={{ padding: 24 }}>
                    <p style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase",
                      letterSpacing: "0.08em", marginBottom: 14 }}>Campus Photos</p>
                    <div className="sheen-wrap">
                      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gridTemplateRows: "180px 180px", gap: 3 }}>
                        <div className="sheen" style={{ gridRow: "1 / 3", borderRadius: "10px 0 0 10px" }} />
                        <div className="sheen" style={{ borderRadius: "0 10px 0 0" }} />
                        <div className="sheen" style={{ borderRadius: "0 0 10px 0" }} />
                      </div>
                      <div className="sheen-overlay"><span className="sheen-badge">📷 Photos Coming Soon</span></div>
                    </div>
                  </div>
                )}
              </section>

              {/* BASIC STATS */}
              <div id="section-basic" className="scroll-mt-[116px]"
                style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
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

              {/* SUMMARY */}
              <section id="section-summary" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 10 }}>About</p>
                {school.description ? (
                  <p style={{ fontSize: 14, color: "var(--dark)", lineHeight: 1.7 }}>{school.description}</p>
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

              {/* FEES */}
              <section id="section-fees" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Fee Breakdown</p>
                {details ? (
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
                      <span style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)" }}>Total Annual</span>
                      <span style={{ fontSize: 15, fontWeight: 800, color: "var(--brown-dark)" }}>
                        {formatFeesRange(details.total_fees_min, details.total_fees_max)}
                      </span>
                    </div>
                  </div>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 110 }}>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                      {["Annual Tuition", "Development Fee", "Transport Fee", "Total"].map((label) => (
                        <div key={label} style={{ display: "flex", justifyContent: "space-between" }}>
                          <div className="sheen" style={{ height: 13, width: "40%" }} />
                          <div className="sheen" style={{ height: 13, width: "20%" }} />
                        </div>
                      ))}
                    </div>
                    <div className="sheen-overlay"><span className="sheen-badge">💰 Fee Details Coming Soon</span></div>
                  </div>
                )}
              </section>

              {/* SCHOOL DETAILS */}
              <section id="section-basic-details" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 16 }}>School Details</p>
                <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 14 }}>
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
                  {school.phone && (
                    <div style={{ display: "flex", gap: 10 }}>
                      <Phone style={{ width: 16, height: 16, color: "var(--muted)", marginTop: 2, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 11, color: "var(--muted)", marginBottom: 2 }}>Phone</p>
                        <a href={`tel:${school.phone}`} style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>
                          {school.phone}
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

              {/* CAMPUS */}
              <section id="section-campus" className="scroll-mt-[116px]"
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

              {/* PEER GROUP */}
              <section id="section-peer" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Peer Group</p>
                <div className="sheen-wrap" style={{ minHeight: 110 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="sheen" style={{ height: 90, borderRadius: 14 }} />
                    ))}
                  </div>
                  <div className="sheen-overlay"><span className="sheen-badge">🏫 Peer Analysis Coming Soon</span></div>
                </div>
              </section>

              {/* UNIQUE THINGS */}
              <section id="section-unique" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>What Makes This School Unique</p>
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

              {/* ADMISSIONS */}
              <section id="section-admission" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Admissions</p>
                {admissions.length > 0 ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                    {admissions.map((a: any) => (
                      <div key={a.id} style={{ border: `1px solid ${a.status === "open" ? "#86efac" : "var(--beige-500)"}`,
                        borderRadius: 12, padding: 14,
                        background: a.status === "open" ? "rgba(134,239,172,0.12)" : "var(--beige-200)" }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
                          <span style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>
                            {a.academic_year} · {a.grade_from} – {a.grade_to}
                          </span>
                          <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99,
                            background: a.status === "open" ? "#16a34a" : a.status === "upcoming" ? "var(--beige-400)" : "var(--beige-300)",
                            color: a.status === "open" ? "white" : "var(--dark)" }}>
                            {a.status ? a.status.charAt(0).toUpperCase() + a.status.slice(1) : "Unknown"}
                          </span>
                        </div>
                        {(a.opens_at || a.closes_at) && (
                          <p style={{ fontSize: 11, color: "var(--muted)" }}>
                            {a.opens_at && `Opens: ${new Date(a.opens_at).toLocaleDateString("en-IN")}`}
                            {a.opens_at && a.closes_at && " · "}
                            {a.closes_at && `Closes: ${new Date(a.closes_at).toLocaleDateString("en-IN")}`}
                          </p>
                        )}
                        {a.application_url && (
                          <a href={a.application_url} target="_blank" rel="noopener noreferrer"
                            style={{ fontSize: 12, color: "var(--brown-dark)", fontWeight: 600,
                              display: "inline-flex", alignItems: "center", gap: 4, marginTop: 6 }}>
                            Apply online <ExternalLink style={{ width: 11, height: 11 }} />
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

              {/* SENTIMENT */}
              <section id="section-sentiment" className="scroll-mt-[116px]"
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
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 130 }}>
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

              {/* FEEDBACK */}
              <section id="section-feedback" className="scroll-mt-[116px]"
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
                  <div className="sheen-wrap" style={{ minHeight: 160 }}>
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
                <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--beige-400)" }}>
                  <Link href={`/schools/${school.slug}/reviews`}
                    style={{ fontSize: 13, fontWeight: 600, color: "var(--brown-dark)" }}>
                    View all reviews & leave a review →
                  </Link>
                </div>
              </section>

              {/* SOURCES */}
              <section id="section-sources" className="scroll-mt-[116px]"
                style={{ background: "var(--beige-100)", border: "1px solid var(--beige-500)", borderRadius: 16, padding: 24 }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Sources & Links</p>
                {school.website ? (
                  <a href={school.website} target="_blank" rel="noopener noreferrer"
                    style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
                      background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                      borderRadius: 12, transition: "border-color 0.15s" }}>
                    <Globe style={{ width: 16, height: 16, color: "var(--muted)", flexShrink: 0 }} />
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <p style={{ fontSize: 13, fontWeight: 600, color: "var(--dark)" }}>Official Website</p>
                      <p style={{ fontSize: 11, color: "var(--muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                        {school.website}
                      </p>
                    </div>
                    <ExternalLink style={{ width: 14, height: 14, color: "var(--muted)", flexShrink: 0 }} />
                  </a>
                ) : (
                  <div className="sheen-wrap" style={{ minHeight: 60 }}>
                    <div className="sheen" style={{ height: 52, borderRadius: 12 }} />
                    <div className="sheen-overlay"><span className="sheen-badge">🔗 Links Coming Soon</span></div>
                  </div>
                )}
                <p style={{ fontSize: 11, color: "var(--muted)", marginTop: 10 }}>
                  Data sourced from school websites, Ezyschooling, and parent surveys. Last updated {YEAR}.
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
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 20px 32px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase",
              letterSpacing: "0.08em", marginBottom: 14 }}>More Schools in {school.city}</p>
            <div className="grid grid-cols-2 lg:grid-cols-4" style={{ gap: 12 }}>
              {relatedSchools.map((s: any) => (
                <Link key={s.slug} href={`/schools/${s.slug}`}
                  style={{ background: "var(--beige-200)", border: "1px solid var(--beige-500)",
                    borderRadius: 14, overflow: "hidden", display: "block",
                    transition: "box-shadow 0.2s, border-color 0.2s" }}>
                  <div style={{ height: 90, background: "var(--beige-300)", position: "relative" }}>
                    {s.cover_image_url && (
                      <Image src={s.cover_image_url} alt={s.name} fill className="object-cover" />
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

        {/* Scroll spacer — guarantees every section can reach the 116px sticky offset.
            Height = full viewport so even section-sources (last) can scroll into position. */}
        <div aria-hidden="true" style={{ height: "100vh", flexShrink: 0 }} />
      </main>
      <Footer />
    </>
  );
}
