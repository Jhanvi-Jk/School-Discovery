// Area neighbourhood landing page — /schools/bengaluru/whitefield
// Serves "CBSE schools in Whitefield Bengaluru" type searches with real SSR HTML.
// Only activated for known city slugs; redirects to 404 for unknown city/area combos.

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, MapPin, IndianRupee, Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { formatFeesRange, formatRating } from "@/lib/utils";
import { CURRICULUM_LABELS, SCHOOL_TYPE_LABELS } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";
const YEAR = new Date().getFullYear();

// Map URL city slug → DB city name
const CITY_MAP: Record<string, string> = {
  bengaluru: "Bengaluru",
  bangalore: "Bengaluru",
  delhi:     "Delhi",
  chennai:   "Chennai",
  mumbai:    "Mumbai",
};

function toTitleCase(str: string) {
  return str.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string; area: string }>;
}): Promise<Metadata> {
  const { slug, area } = await params;
  const cityName = CITY_MAP[slug.toLowerCase()];
  if (!cityName) return { robots: { index: false, follow: false } };

  const areaLabel = toTitleCase(decodeURIComponent(area));
  const canonicalUrl = `${APP_URL}/schools/${slug.toLowerCase()}/${area.toLowerCase()}`;

  const title = `Schools in ${areaLabel}, ${cityName} ${YEAR} | Fees, Curriculum & Reviews — SchoolFind360`;
  const description = `Find and compare verified schools in ${areaLabel}, ${cityName}. Browse ${YEAR} fees, CBSE, ICSE, IB curriculum options, admission status, and real parent reviews.`;

  return {
    title,
    description,
    alternates: { canonical: canonicalUrl },
    robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1 } },
    openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "SchoolFind360" },
    twitter: { card: "summary_large_image", title, description },
  };
}

export default async function AreaPage({
  params,
}: {
  params: Promise<{ slug: string; area: string }>;
}) {
  const { slug, area } = await params;
  const cityName = CITY_MAP[slug.toLowerCase()];

  // Only serve area pages for known cities
  if (!cityName) notFound();

  const areaLabel = toTitleCase(decodeURIComponent(area));
  const areaParam = decodeURIComponent(area).replace(/-/g, " ");

  const supabase = await createClient();

  // Fetch schools in this area
  const { data: schools, count } = await supabase
    .from("schools_with_details")
    .select(
      "id, slug, name, type, area, city, total_fees_min, total_fees_max, avg_rating, review_count, curricula, admissions_open, description",
      { count: "exact" }
    )
    .eq("city", cityName)
    .ilike("area", `%${areaParam}%`)
    .order("avg_rating", { ascending: false, nullsFirst: false });

  const schoolList = schools || [];

  // If 0 results, still serve the page but with noindex
  const hasResults = schoolList.length > 0;

  // JSON-LD for this area
  const itemListSchema = hasResults ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Schools in ${areaLabel}, ${cityName}`,
    numberOfItems: count ?? 0,
    itemListElement: schoolList.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${APP_URL}/schools/${s.slug}`,
    })),
  } : null;

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home",    item: APP_URL },
      { "@type": "ListItem", position: 2, name: "Schools", item: `${APP_URL}/schools` },
      { "@type": "ListItem", position: 3, name: `${cityName} Schools`, item: `${APP_URL}/schools/${slug.toLowerCase()}` },
      { "@type": "ListItem", position: 4, name: `${areaLabel} Schools`, item: `${APP_URL}/schools/${slug.toLowerCase()}/${area.toLowerCase()}` },
    ],
  };

  return (
    <>
      {itemListSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      {/* noindex if zero results — prevents thin-content indexing */}
      {!hasResults && (
        <meta name="robots" content="noindex, follow" />
      )}

      <Header />
      <main style={{ background: "var(--beige-100)", minHeight: "100vh" }}>

        {/* Hero */}
        <div style={{ background: "var(--dark)", color: "white", padding: "36px 20px 32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            {/* Breadcrumb */}
            <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, flexWrap: "wrap" }}>
              <Link href="/"                                  style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
              <ChevronRight size={11} />
              <Link href="/schools"                           style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Schools</Link>
              <ChevronRight size={11} />
              <Link href={`/schools/${slug.toLowerCase()}`}  style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{cityName}</Link>
              <ChevronRight size={11} />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{areaLabel}</span>
            </nav>

            <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
              Schools in {areaLabel}, {cityName}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)", marginBottom: 20 }}>
              {hasResults
                ? `${count} verified school${count !== 1 ? "s" : ""} in ${areaLabel} — compare ${YEAR} fees, boards, and real parent reviews.`
                : `We don't have schools listed in ${areaLabel} yet — browse all schools in ${cityName} instead.`}
            </p>

            {/* Board filter chips */}
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {["cbse", "icse", "ib", "igcse"].map((board) => (
                <Link
                  key={board}
                  href={`/schools/${slug.toLowerCase()}?curriculum=${board}&area=${encodeURIComponent(areaParam)}`}
                  style={{
                    fontSize: 12, fontWeight: 600, padding: "5px 14px", borderRadius: 99,
                    background: "rgba(255,255,255,0.12)", color: "rgba(255,255,255,0.85)",
                    textDecoration: "none", border: "1px solid rgba(255,255,255,0.15)",
                  }}
                >
                  {board.toUpperCase()} Schools
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px" }}>

          {hasResults ? (
            <>
              {/* School cards */}
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {schoolList.map((school) => {
                  const curricula = (school.curricula as string[] | null) || [];
                  return (
                    <Link key={school.id} href={`/schools/${school.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: "white", border: "1px solid var(--beige-400)",
                        borderRadius: 16, padding: "18px 20px", transition: "box-shadow 0.2s",
                      }}>
                        {/* Curricula */}
                        {curricula.length > 0 && (
                          <div style={{ marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {curricula.map((c) => (
                              <span key={c} className="card-badge">{CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] ?? c}</span>
                            ))}
                          </div>
                        )}

                        {/* Name */}
                        <p style={{ fontSize: 17, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>{school.name}</p>

                        {/* Meta */}
                        <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "var(--muted)", marginBottom: 10, flexWrap: "wrap" }}>
                          <MapPin size={11} />
                          {[school.area, school.city].filter(Boolean).join(", ")}
                          {school.type && <><span style={{ margin: "0 3px" }}>·</span>{SCHOOL_TYPE_LABELS[school.type as keyof typeof SCHOOL_TYPE_LABELS] ?? school.type}</>}
                          {school.admissions_open && (
                            <span style={{ marginLeft: 4, background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
                              Admissions Open {YEAR}–{String(YEAR + 1).slice(2)}
                            </span>
                          )}
                        </div>

                        {/* Stats */}
                        <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
                          {(school.total_fees_min || school.total_fees_max) && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                              <IndianRupee size={12} style={{ color: "var(--muted)" }} />
                              <span style={{ color: "var(--dark)", fontWeight: 600 }}>{formatFeesRange(school.total_fees_min, school.total_fees_max)}</span>
                            </div>
                          )}
                          {school.avg_rating && (
                            <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 13 }}>
                              <Star size={12} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                              <span style={{ color: "var(--dark)", fontWeight: 600 }}>{formatRating(school.avg_rating)}</span>
                              {school.review_count && school.review_count > 0 && (
                                <span style={{ color: "var(--muted)", fontSize: 11 }}>({school.review_count} reviews)</span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>

              {/* Hub cross-links */}
              <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--beige-400)" }}>
                <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                  Explore more in {cityName}
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                  <Link href={`/schools/${slug.toLowerCase()}`} style={{ fontSize: 12, fontWeight: 600, color: "var(--brown-dark)", background: "rgba(44,24,16,0.06)", border: "1px solid rgba(44,24,16,0.12)", borderRadius: 99, padding: "5px 14px", textDecoration: "none" }}>
                    All schools in {cityName} →
                  </Link>
                  {["cbse", "ib", "igcse"].map((board) => (
                    <Link key={board} href={`/schools/${slug.toLowerCase()}?curriculum=${board}`}
                      style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "var(--beige-200)", border: "1px solid var(--beige-400)", borderRadius: 99, padding: "5px 14px", textDecoration: "none" }}
                    >
                      {board.toUpperCase()} schools in {cityName}
                    </Link>
                  ))}
                </div>
              </div>
            </>
          ) : (
            /* Empty state with cross-links */
            <div style={{ textAlign: "center", padding: "40px 0" }}>
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--dark)", marginBottom: 8 }}>
                No schools listed in {areaLabel} yet
              </h2>
              <p style={{ color: "var(--muted)", fontSize: 14, marginBottom: 24 }}>
                We're adding schools every week. In the meantime, explore all verified schools in {cityName}.
              </p>
              <Link href={`/schools/${slug.toLowerCase()}`} style={{
                display: "inline-flex", alignItems: "center", gap: 6,
                background: "var(--brown-dark)", color: "white",
                padding: "12px 24px", borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none",
              }}>
                Explore all schools in {cityName} →
              </Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
