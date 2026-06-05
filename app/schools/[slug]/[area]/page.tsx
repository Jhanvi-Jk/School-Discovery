// Area neighbourhood landing page — /schools/bengaluru/whitefield
// Also handles inter-curriculum comparison pages — /schools/bengaluru/cbse-vs-icse
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

// ── Board comparison / cross-over page helpers ────────────────────────────────
// Detects slugs like "cbse-vs-icse", "ib-vs-cbse", etc.
const BOARD_LABEL: Record<string, string> = {
  cbse: "CBSE", icse: "ICSE", ib: "IB", igcse: "IGCSE", state_board: "State Board",
};

function parseComparison(area: string): { boardA: string; boardB: string } | null {
  const match = area.match(/^([a-z_]+)-vs-([a-z_]+)$/);
  if (!match) return null;
  const a = match[1], b = match[2];
  if (!BOARD_LABEL[a] || !BOARD_LABEL[b]) return null;
  return { boardA: a, boardB: b };
}

// ── Intent-based cluster page helpers ────────────────────────────────────────
// Detects slugs like "coed-cbse", "girls-ib-boarding", "boys-igcse-day".
// Requires at least one of: gender token, board token.
const CLUSTER_GENDER: Record<string, string> = {
  coed:  "co-ed",
  girls: "girls",
  boys:  "boys",
};
const CLUSTER_FACILITY: Record<string, string> = {
  boarding:     "boarding",
  day:          "day",
  "day-boarding": "day-boarding",
};
// DB values for gender column
const CLUSTER_GENDER_DB: Record<string, string> = {
  coed: "co-ed", girls: "girls", boys: "boys",
};

interface ClusterParams {
  gender:   string | null;   // DB value e.g. "co-ed"
  board:    string | null;   // DB value e.g. "cbse"
  facility: string | null;   // "boarding" | "day" etc.
  label:    string;          // human label for H1
  slug:     string;          // original URL segment
}

function parseCluster(area: string): ClusterParams | null {
  const parts = area.split("-");
  const genderKey  = parts.find((p) => CLUSTER_GENDER[p]) || null;
  const boardKey   = parts.find((p) => BOARD_LABEL[p])    || null;
  const facilityKey = Object.keys(CLUSTER_FACILITY).find((k) => area.includes(k)) || null;

  // Require at least gender + board for a meaningful cluster page
  if (!genderKey || !boardKey) return null;

  const labelParts: string[] = [];
  if (genderKey) labelParts.push(CLUSTER_GENDER[genderKey]);
  if (boardKey)  labelParts.push(BOARD_LABEL[boardKey]);
  if (facilityKey) labelParts.push(
    facilityKey === "boarding" ? "Boarding" : facilityKey === "day" ? "Day" : "Day-Boarding"
  );
  labelParts.push("Schools");

  return {
    gender:   genderKey   ? CLUSTER_GENDER_DB[genderKey] : null,
    board:    boardKey    ? boardKey                       : null,
    facility: facilityKey ?? null,
    label:    labelParts.join(" "),
    slug:     area,
  };
}

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

  const canonicalUrl = `${APP_URL}/schools/${slug.toLowerCase()}/${area.toLowerCase()}`;

  // Cluster page — /schools/bengaluru/coed-cbse, /schools/delhi/girls-ib-boarding
  const cluster = parseCluster(area.toLowerCase());
  if (cluster) {
    const title = `${cluster.label} in ${cityName} ${YEAR} | Fees & Reviews — SchoolFind360`;
    const description = `Find the best ${cluster.label.toLowerCase()} in ${cityName}. Compare ${YEAR} fees, admission status, and real parent reviews on SchoolFind360.`;
    return {
      title, description,
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1 } },
      openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "SchoolFind360" },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  // Board comparison page — /schools/bengaluru/cbse-vs-icse
  const cmp = parseComparison(area.toLowerCase());
  if (cmp) {
    const la = BOARD_LABEL[cmp.boardA], lb = BOARD_LABEL[cmp.boardB];
    const title = `${la} vs ${lb} Schools in ${cityName} ${YEAR} | Compare Fees, Curriculum — SchoolFind360`;
    const description = `Comparing ${la} and ${lb} schools in ${cityName} — ${YEAR} fee ranges, curriculum differences, teaching style, and which board suits your child best.`;
    return {
      title, description,
      alternates: { canonical: canonicalUrl },
      robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-snippet": -1 } },
      openGraph: { title, description, url: canonicalUrl, type: "website", siteName: "SchoolFind360" },
      twitter: { card: "summary_large_image", title, description },
    };
  }

  const areaLabel = toTitleCase(decodeURIComponent(area));
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

  // ── Cluster page — /schools/bengaluru/coed-cbse, /schools/delhi/girls-ib-boarding ──
  const cluster = parseCluster(area.toLowerCase());
  if (cluster) {
    const supabase = await createClient();

    let query = supabase
      .from("schools_with_details")
      .select("id, slug, name, type, area, city, total_fees_min, total_fees_max, avg_rating, review_count, curricula, admissions_open, gender", { count: "exact" })
      .eq("city", cityName)
      .not("total_fees_min", "is", null)
      .order("avg_rating", { ascending: false, nullsFirst: false });

    if (cluster.gender) query = query.eq("gender", cluster.gender);
    if (cluster.board)  query = query.contains("curricula", [cluster.board]);

    const { data: clusterSchools, count: clusterCount } = await query.limit(20);
    const schoolList = clusterSchools || [];
    const hasResults = schoolList.length > 0;

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
        { "@type": "ListItem", position: 2, name: "Schools", item: `${APP_URL}/schools` },
        { "@type": "ListItem", position: 3, name: `Schools in ${cityName}`, item: `${APP_URL}/schools/${slug.toLowerCase()}` },
        { "@type": "ListItem", position: 4, name: cluster.label, item: `${APP_URL}/schools/${slug.toLowerCase()}/${cluster.slug}` },
      ],
    };

    const itemListSchema = hasResults ? {
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `${cluster.label} in ${cityName}`,
      numberOfItems: clusterCount ?? 0,
      itemListElement: schoolList.map((s, i) => ({
        "@type": "ListItem", position: i + 1,
        name: s.name, url: `${APP_URL}/schools/${s.slug}`,
      })),
    } : null;

    return (
      <>
        {itemListSchema && (
          <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        )}
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        {!hasResults && <meta name="robots" content="noindex, follow" />}

        <Header />
        <main style={{ background: "var(--beige-100)", minHeight: "100vh" }}>

          {/* Hero */}
          <div style={{ background: "var(--dark)", color: "white", padding: "36px 20px 32px" }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, flexWrap: "wrap" }}>
                <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
                <ChevronRight size={11} />
                <Link href="/schools" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Schools</Link>
                <ChevronRight size={11} />
                <Link href={`/schools/${slug.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Schools in {cityName}</Link>
                <ChevronRight size={11} />
                <span style={{ color: "rgba(255,255,255,0.85)" }}>{cluster.label}</span>
              </nav>
              <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
                {cluster.label} in {cityName}
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                {hasResults
                  ? `${clusterCount} verified ${cluster.label.toLowerCase()} — compare ${YEAR} fees and real parent reviews.`
                  : `No ${cluster.label.toLowerCase()} found in ${cityName} yet — browse all schools below.`}
              </p>
            </div>
          </div>

          <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px" }}>
            {hasResults ? (
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {schoolList.map((school) => {
                  const curricula = (school.curricula as string[] | null) || [];
                  return (
                    <Link key={school.id} href={`/schools/${school.slug}`} style={{ textDecoration: "none" }}>
                      <div style={{ background: "white", border: "1px solid var(--beige-400)", borderRadius: 16, padding: "18px 20px" }}>
                        {curricula.length > 0 && (
                          <div style={{ marginBottom: 8, display: "flex", flexWrap: "wrap", gap: 4 }}>
                            {curricula.map((c) => (
                              <span key={c} className="card-badge">{CURRICULUM_LABELS[c as keyof typeof CURRICULUM_LABELS] ?? c}</span>
                            ))}
                          </div>
                        )}
                        <p style={{ fontSize: 17, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>{school.name}</p>
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
            ) : (
              <div style={{ textAlign: "center", padding: "40px 0" }}>
                <p style={{ fontSize: 40, marginBottom: 12 }}>🔍</p>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--dark)", marginBottom: 8 }}>
                  No {cluster.label} listed in {cityName} yet
                </h2>
                <Link href={`/schools/${slug.toLowerCase()}`} style={{
                  display: "inline-flex", alignItems: "center", gap: 6, background: "var(--brown-dark)", color: "white",
                  padding: "12px 24px", borderRadius: 12, fontSize: 13, fontWeight: 700, textDecoration: "none",
                }}>
                  Explore all schools in {cityName} →
                </Link>
              </div>
            )}

            {/* "Recommended Searches" cross-links — satisfies Item 4 inter-linking requirement */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--beige-400)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Recommended Searches
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {cluster.board && (
                  <Link href={`/schools/${slug.toLowerCase()}?curriculum=${cluster.board}`}
                    style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "var(--beige-200)", border: "1px solid var(--beige-400)", borderRadius: 99, padding: "5px 14px", textDecoration: "none" }}>
                    All {BOARD_LABEL[cluster.board]} schools in {cityName}
                  </Link>
                )}
                {["coed-cbse", "girls-cbse", "boys-cbse", "coed-ib"].filter(s => s !== cluster.slug).slice(0, 3).map((s) => (
                  <Link key={s} href={`/schools/${slug.toLowerCase()}/${s}`}
                    style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "var(--beige-200)", border: "1px solid var(--beige-400)", borderRadius: 99, padding: "5px 14px", textDecoration: "none" }}>
                    {s.split("-").map(p => (CLUSTER_GENDER[p] || BOARD_LABEL[p] || p).charAt(0).toUpperCase() + (CLUSTER_GENDER[p] || BOARD_LABEL[p] || p).slice(1)).join(" ")} Schools
                  </Link>
                ))}
                <Link href={`/schools/${slug.toLowerCase()}`}
                  style={{ fontSize: 12, fontWeight: 600, color: "var(--brown-dark)", background: "rgba(44,24,16,0.06)", border: "1px solid rgba(44,24,16,0.12)", borderRadius: 99, padding: "5px 14px", textDecoration: "none" }}>
                  All schools in {cityName} →
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // ── Board comparison cross-over page ────────────────────────────────────────
  const cmp = parseComparison(area.toLowerCase());
  if (cmp) {
    const la = BOARD_LABEL[cmp.boardA], lb = BOARD_LABEL[cmp.boardB];
    const supabase = await createClient();

    // Fetch schools for each board in this city
    const [resA, resB] = await Promise.all([
      supabase
        .from("schools_with_details")
        .select("id, slug, name, type, area, city, total_fees_min, total_fees_max, avg_rating, review_count, curricula, admissions_open")
        .eq("city", cityName)
        .contains("curricula", [cmp.boardA])
        .not("total_fees_min", "is", null)
        .order("avg_rating", { ascending: false, nullsFirst: false })
        .limit(6),
      supabase
        .from("schools_with_details")
        .select("id, slug, name, type, area, city, total_fees_min, total_fees_max, avg_rating, review_count, curricula, admissions_open")
        .eq("city", cityName)
        .contains("curricula", [cmp.boardB])
        .not("total_fees_min", "is", null)
        .order("avg_rating", { ascending: false, nullsFirst: false })
        .limit(6),
    ]);

    const schoolsA = resA.data || [];
    const schoolsB = resB.data || [];

    const boardInfo: Record<string, { focus: string; style: string; recognition: string }> = {
      cbse: { focus: "Science & Maths", style: "Structured, exam-oriented", recognition: "All-India university entrance" },
      icse: { focus: "English & Balanced arts/science", style: "Broad-based, analytical", recognition: "Strong for humanities + sciences" },
      ib:   { focus: "Critical thinking & inquiry", style: "Holistic, internationally mobile", recognition: "Global university acceptance" },
      igcse:{ focus: "Subject flexibility", style: "Project-based, international", recognition: "O-Level equivalent worldwide" },
      state_board: { focus: "Regional syllabus", style: "Cost-effective, mother-tongue", recognition: "State universities" },
    };

    const infoA = boardInfo[cmp.boardA];
    const infoB = boardInfo[cmp.boardB];

    const breadcrumbSchema = {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: APP_URL },
        { "@type": "ListItem", position: 2, name: "Schools", item: `${APP_URL}/schools` },
        { "@type": "ListItem", position: 3, name: `${cityName} Schools`, item: `${APP_URL}/schools/${slug.toLowerCase()}` },
        { "@type": "ListItem", position: 4, name: `${la} vs ${lb}`, item: `${APP_URL}/schools/${slug.toLowerCase()}/${area.toLowerCase()}` },
      ],
    };

    const faqSchema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: [
        {
          "@type": "Question",
          name: `What is the difference between ${la} and ${lb} schools in ${cityName}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `${la} schools focus on ${infoA?.focus} with a ${infoA?.style} teaching approach. ${lb} schools emphasise ${infoB?.focus} with a ${infoB?.style} style. ${la} is recognised for ${infoA?.recognition}, while ${lb} suits ${infoB?.recognition}.`,
          },
        },
        {
          "@type": "Question",
          name: `Which board is better — ${la} or ${lb}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `The right board depends on your child's learning style and future goals. ${la} suits families seeking ${infoA?.recognition}. ${lb} is preferred for ${infoB?.recognition}. Compare fees and school profiles on SchoolFind360 to make an informed choice.`,
          },
        },
        {
          "@type": "Question",
          name: `Are ${la} schools cheaper than ${lb} schools in ${cityName}?`,
          acceptedAnswer: {
            "@type": "Answer",
            text: `Fee ranges vary widely by school. Use SchoolFind360's fee filters to compare exact annual fees for ${la} and ${lb} schools in ${cityName} side-by-side.`,
          },
        },
      ],
    };

    return (
      <>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

        <Header />
        <main style={{ background: "var(--beige-100)", minHeight: "100vh" }}>

          {/* Hero */}
          <div style={{ background: "var(--dark)", color: "white", padding: "36px 20px 32px" }}>
            <div style={{ maxWidth: 960, margin: "0 auto" }}>
              <nav style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, flexWrap: "wrap" }}>
                <Link href="/" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Home</Link>
                <ChevronRight size={11} />
                <Link href="/schools" style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>Schools</Link>
                <ChevronRight size={11} />
                <Link href={`/schools/${slug.toLowerCase()}`} style={{ color: "rgba(255,255,255,0.5)", textDecoration: "none" }}>{cityName}</Link>
                <ChevronRight size={11} />
                <span style={{ color: "rgba(255,255,255,0.85)" }}>{la} vs {lb}</span>
              </nav>

              <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
                {la} vs {lb} Schools in {cityName}
              </h1>
              <p style={{ fontSize: 14, color: "rgba(255,255,255,0.6)" }}>
                Compare {la} and {lb} schools in {cityName} — fees, teaching style, and which board fits your child&apos;s future.
              </p>
            </div>
          </div>

          <div style={{ maxWidth: 960, margin: "0 auto", padding: "32px 20px 60px" }}>

            {/* Quick comparison table */}
            {infoA && infoB && (
              <div style={{ background: "white", border: "1px solid var(--beige-400)", borderRadius: 16, padding: "24px", marginBottom: 32 }}>
                <p style={{ fontSize: 13, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 18 }}>
                  Quick Comparison
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, fontSize: 13 }}>
                  <div style={{ fontWeight: 700, color: "var(--dark)" }}></div>
                  <div style={{ fontWeight: 700, color: "var(--dark)", textAlign: "center" }}>{la}</div>
                  <div style={{ fontWeight: 700, color: "var(--dark)", textAlign: "center" }}>{lb}</div>

                  <div style={{ color: "var(--muted)" }}>Focus</div>
                  <div style={{ color: "var(--dark)", textAlign: "center" }}>{infoA.focus}</div>
                  <div style={{ color: "var(--dark)", textAlign: "center" }}>{infoB.focus}</div>

                  <div style={{ color: "var(--muted)" }}>Teaching style</div>
                  <div style={{ color: "var(--dark)", textAlign: "center" }}>{infoA.style}</div>
                  <div style={{ color: "var(--dark)", textAlign: "center" }}>{infoB.style}</div>

                  <div style={{ color: "var(--muted)" }}>Recognition</div>
                  <div style={{ color: "var(--dark)", textAlign: "center" }}>{infoA.recognition}</div>
                  <div style={{ color: "var(--dark)", textAlign: "center" }}>{infoB.recognition}</div>
                </div>
              </div>
            )}

            {/* Side-by-side school lists */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
              {[{ board: la, schools: schoolsA, curriculum: cmp.boardA }, { board: lb, schools: schoolsB, curriculum: cmp.boardB }].map(({ board, schools, curriculum }) => (
                <div key={board}>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <p style={{ fontSize: 15, fontWeight: 700, color: "var(--dark)" }}>{board} Schools</p>
                    <Link href={`/schools/${slug.toLowerCase()}?curriculum=${curriculum}`} style={{ fontSize: 12, color: "var(--brown-dark)", fontWeight: 600, textDecoration: "none" }}>
                      View all →
                    </Link>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {schools.length === 0 ? (
                      <p style={{ fontSize: 13, color: "var(--muted)" }}>No {board} schools listed in {cityName} yet.</p>
                    ) : schools.map((s) => (
                      <Link key={s.id} href={`/schools/${s.slug}`} style={{ textDecoration: "none" }}>
                        <div style={{ background: "white", border: "1px solid var(--beige-400)", borderRadius: 14, padding: "14px 16px" }}>
                          <p style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)", marginBottom: 3 }}>{s.name}</p>
                          <p style={{ fontSize: 12, color: "var(--muted)", marginBottom: 6, display: "flex", alignItems: "center", gap: 4 }}>
                            <MapPin size={10} />{s.area || s.city}
                          </p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 8, fontSize: 12 }}>
                            {(s.total_fees_min || s.total_fees_max) && (
                              <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--dark)", fontWeight: 600 }}>
                                <IndianRupee size={11} style={{ color: "var(--muted)" }} />
                                {formatFeesRange(s.total_fees_min, s.total_fees_max)}
                              </span>
                            )}
                            {s.avg_rating && (
                              <span style={{ display: "flex", alignItems: "center", gap: 3, color: "var(--dark)", fontWeight: 600 }}>
                                <Star size={11} style={{ fill: "#f59e0b", color: "#f59e0b" }} />
                                {formatRating(s.avg_rating)}
                              </span>
                            )}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* FAQ section — targets voice/featured-snippet queries */}
            <div style={{ marginTop: 40 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--dark)", marginBottom: 20 }}>
                Frequently Asked Questions
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {faqSchema.mainEntity.map((q, i) => (
                  <div key={i} style={{ background: "white", border: "1px solid var(--beige-400)", borderRadius: 14, padding: "18px 20px" }}>
                    <p style={{ fontSize: 14, fontWeight: 700, color: "var(--dark)", marginBottom: 8 }}>{q.name}</p>
                    <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>{q.acceptedAnswer.text}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Hub cross-links */}
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: "1px solid var(--beige-400)" }}>
              <p style={{ fontSize: 11, fontWeight: 700, color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 12 }}>
                Explore more boards in {cityName}
              </p>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {["cbse", "icse", "ib", "igcse"].filter(b => b !== cmp.boardA && b !== cmp.boardB).map((board) => (
                  <Link key={board} href={`/schools/${slug.toLowerCase()}?curriculum=${board}`}
                    style={{ fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "var(--beige-200)", border: "1px solid var(--beige-400)", borderRadius: 99, padding: "5px 14px", textDecoration: "none" }}
                  >
                    {BOARD_LABEL[board]} schools in {cityName}
                  </Link>
                ))}
                <Link href={`/schools/${slug.toLowerCase()}`}
                  style={{ fontSize: 12, fontWeight: 600, color: "var(--brown-dark)", background: "rgba(44,24,16,0.06)", border: "1px solid rgba(44,24,16,0.12)", borderRadius: 99, padding: "5px 14px", textDecoration: "none" }}
                >
                  All schools in {cityName} →
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }
  // ── End board comparison ─────────────────────────────────────────────────────

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
