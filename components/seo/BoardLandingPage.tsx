import Link from "next/link";
import { ChevronRight, IndianRupee, MapPin, Star } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchByIds } from "@/lib/supabase/fetchAll";
import { parseSearchParams, searchSchools } from "@/lib/schools/search";
import { BOARD_INFO } from "@/lib/seo/boards";
import { BOARD_SLUGS, type CityConfig } from "@/lib/cities";
import { formatFeesRange, formatFees, formatRating } from "@/lib/utils";
import { formatAcademicYear } from "@/lib/admissions";
import { SITE_URL } from "@/lib/site";

const YEAR = new Date().getFullYear();

export interface BoardPageData {
  count: number;
  schools: any[];
  areas: [string, number][];
  feeMedian: number | null;
  feeLow: number | null;
  feeHigh: number | null;
}

const EMPTY_BOARD_DATA: BoardPageData = { count: 0, schools: [], areas: [], feeMedian: null, feeLow: null, feeHigh: null };

export async function loadBoardPageData(city: CityConfig, boardDb: string): Promise<BoardPageData> {
  try {
    return await loadBoardPageDataUnsafe(city, boardDb);
  } catch (e) {
    // e.g. the view's curricula column is missing (migration 027+ not applied): show "none yet", not a 500
    console.error("board page data failed", (e as any)?.message ?? e);
    return EMPTY_BOARD_DATA;
  }
}

async function loadBoardPageDataUnsafe(city: CityConfig, boardDb: string): Promise<BoardPageData> {
  const supabase = createPublicClient();
  const query = (extra: Record<string, string>) =>
    parseSearchParams(new URLSearchParams({ city: city.dbName, curriculum: boardDb, ...extra }));

  const [list, every] = await Promise.all([
    searchSchools(supabase, query({ limit: "24" })),
    // Every match (ids + area only) for neighbourhood counts and the fee range
    searchSchools(supabase, query({ lean: "1", limit: "1000" })),
  ]);
  const fees = (await fetchByIds<{ id: string; total_fees_min: number | null }>(
    every.schools.map((s: any) => s.id),
    (batch) => supabase.from("schools_with_details").select("id, total_fees_min").in("id", batch)
  )).map((r) => r.total_fees_min).filter((f): f is number => !!f).sort((a, b) => a - b);

  const areaCounts: Record<string, number> = {};
  every.schools.forEach((r: any) => { if (r.area) areaCounts[r.area] = (areaCounts[r.area] || 0) + 1; });

  return {
    count: list.total,
    schools: list.schools,
    areas: Object.entries(areaCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0])).slice(0, 12),
    feeMedian: fees.length ? fees[Math.floor(fees.length / 2)] : null,
    feeLow: fees.length ? fees[0] : null,
    feeHigh: fees.length ? fees[fees.length - 1] : null,
  };
}

export function boardFaqs(city: CityConfig, boardDb: string, d: BoardPageData) {
  const info = BOARD_INFO[boardDb];
  const faqs = [
    {
      q: `What is ${info.name}, and how is it different from other boards?`,
      a: `${info.about} ${info.suitedFor.charAt(0).toUpperCase()}${info.suitedFor.slice(1)} often prefer it.`,
    },
    {
      q: `How many ${info.name} schools are there in ${city.label}?`,
      a: d.count > 0
        ? `SchoolFind360 currently lists ${d.count} ${info.name} school${d.count === 1 ? "" : "s"} in ${city.label}${d.areas[0] ? `, with the most in ${d.areas.slice(0, 3).map((a) => a[0]).join(", ")}` : ""}. New schools are added as we verify them.`
        : `We don't list any ${info.name} schools in ${city.label} yet. Browse all schools in ${city.label} instead.`,
    },
  ];
  if (d.feeMedian && d.feeLow && d.feeHigh) {
    faqs.push({
      q: `What are the fees at ${info.name} schools in ${city.label}?`,
      a: `Among the ${info.name} schools in ${city.label} with published fees, annual fees start from ${formatFees(d.feeLow)} and go up to ${formatFees(d.feeHigh)}; the middle school charges around ${formatFees(d.feeMedian)}. Always confirm the full fee schedule — including development, transport and activity fees — with the school.`,
    });
  }
  faqs.push({
    q: `Which exams do ${info.name} students take?`,
    a: `${info.exams}.`,
  });
  return faqs;
}

export function boardMeta(city: CityConfig, boardDb: string, d: BoardPageData) {
  const info = BOARD_INFO[boardDb];
  const title = `${info.name} Schools in ${city.label} (${YEAR}) — Fees, Admissions & Reviews`;
  const fee = d.feeLow && d.feeHigh ? ` Annual fees from ${formatFees(d.feeLow)} to ${formatFees(d.feeHigh)}.` : "";
  const description = d.count > 0
    ? `Compare ${d.count} ${info.name} school${d.count === 1 ? "" : "s"} in ${city.label}.${fee} See admission status, boards, areas and parent reviews.`
    : `${info.name} schools in ${city.label} — coming soon to SchoolFind360.`;
  return { title, description };
}

export async function BoardLandingPage({ city, boardSlug }: { city: CityConfig; boardSlug: string }) {
  const board = BOARD_SLUGS[boardSlug];
  const info = BOARD_INFO[board.db];
  const d = await loadBoardPageData(city, board.db);
  const faqs = boardFaqs(city, board.db, d);
  const url = `${SITE_URL}/schools/${city.slug}/${boardSlug}`;
  const otherBoards = city.boards.filter((b) => b !== boardSlug);

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: "Schools", item: `${SITE_URL}/schools` },
      { "@type": "ListItem", position: 3, name: `Schools in ${city.label}`, item: `${SITE_URL}/schools/${city.slug}` },
      { "@type": "ListItem", position: 4, name: `${info.name} Schools`, item: url },
    ],
  };
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
  const itemListSchema = d.schools.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${info.name} schools in ${city.label}`,
    numberOfItems: d.count,
    itemListElement: d.schools.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE_URL}/schools/${s.slug}` })),
  } : null;

  const pill: React.CSSProperties = {
    fontSize: 12, fontWeight: 600, color: "var(--muted)", background: "var(--beige-200)",
    border: "1px solid var(--beige-400)", borderRadius: 99, padding: "5px 14px", textDecoration: "none",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      {itemListSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />}
      <Header />
      <main style={{ background: "var(--beige-100)" }}>
        <div style={{ background: "var(--dark)", color: "white", padding: "36px 20px 32px" }}>
          <div style={{ maxWidth: 960, margin: "0 auto" }}>
            <nav aria-label="Breadcrumb" style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "rgba(255,255,255,0.5)", marginBottom: 14, flexWrap: "wrap" }}>
              <Link href="/" style={{ color: "inherit" }}>Home</Link><ChevronRight size={11} />
              <Link href="/schools" style={{ color: "inherit" }}>Schools</Link><ChevronRight size={11} />
              <Link href={`/schools/${city.slug}`} style={{ color: "inherit" }}>Schools in {city.label}</Link><ChevronRight size={11} />
              <span style={{ color: "rgba(255,255,255,0.85)" }}>{info.name}</span>
            </nav>
            <h1 style={{ fontSize: "clamp(22px, 4vw, 32px)", fontWeight: 800, marginBottom: 8, lineHeight: 1.2 }}>
              {info.name} Schools in {city.label}
            </h1>
            <p style={{ fontSize: 14, color: "rgba(255,255,255,0.65)", maxWidth: 680, lineHeight: 1.6 }}>
              {d.count > 0
                ? `${d.count} ${info.name} school${d.count === 1 ? "" : "s"} in ${city.label}${d.feeLow && d.feeHigh ? `, with annual fees from ${formatFees(d.feeLow)} to ${formatFees(d.feeHigh)}` : ""}. Compare fees, admission status and parent reviews.`
                : `We don't list any ${info.name} schools in ${city.label} yet.`}
            </p>
          </div>
        </div>

        <div style={{ maxWidth: 960, margin: "0 auto", padding: "28px 20px 60px" }}>
          {/* About the board — unique per board */}
          <section className="content-card prose">
            <h2 style={{ marginTop: 0 }}>About {info.name}</h2>
            <p><strong>{info.fullName}.</strong> {info.about}</p>
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 20 }}>
              <div><h3 style={{ marginTop: 0 }}>Strengths</h3><ul>{info.strengths.map((s) => <li key={s}>{s}</li>)}</ul></div>
              <div><h3 style={{ marginTop: 0 }}>Things to consider</h3><ul>{info.considerations.map((s) => <li key={s}>{s}</li>)}</ul></div>
            </div>
            <p>Best suited to {info.suitedFor}. Not sure which board fits? Read <Link href="/blog/cbse-vs-icse-vs-ib-bengaluru">CBSE vs ICSE vs IB</Link>.</p>
          </section>

          {/* Schools */}
          {d.schools.length > 0 ? (
            <section aria-labelledby="school-list" style={{ marginBottom: 28 }}>
              <h2 id="school-list" style={{ fontSize: 20, fontWeight: 800, color: "var(--dark)", marginBottom: 14 }}>
                Top {info.name} schools in {city.label}
              </h2>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {d.schools.map((s) => (
                  <Link key={s.id} href={`/schools/${s.slug}`} style={{ textDecoration: "none" }}>
                    <div style={{ background: "white", border: "1px solid var(--beige-400)", borderRadius: 16, padding: "16px 18px" }}>
                      <p style={{ fontSize: 16, fontWeight: 700, color: "var(--dark)", marginBottom: 4 }}>{s.name}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: "4px 12px", fontSize: 12, color: "var(--muted)" }}>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><MapPin size={11} />{s.area || s.city}</span>
                        <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "var(--dark)", fontWeight: 600 }}><IndianRupee size={11} />{formatFeesRange(s.total_fees_min, s.total_fees_max)}</span>
                        {s.avg_rating != null && s.review_count > 0 && (
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 3 }}><Star size={11} style={{ fill: "#f59e0b", color: "#f59e0b" }} />{formatRating(Number(s.avg_rating))} ({s.review_count})</span>
                        )}
                        {s.admissions_open && (
                          <span style={{ background: "#dcfce7", color: "#166534", fontSize: 11, fontWeight: 600, padding: "2px 8px", borderRadius: 99 }}>
                            {s.admission_year ? `Admissions open ${formatAcademicYear(s.admission_year)}` : "Admissions open"}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              {d.count > d.schools.length && (
                <p style={{ marginTop: 14, fontSize: 13 }}>
                  Showing {d.schools.length} of {d.count}. <Link href={`/schools?city=${city.slug}&curriculum=${board.db}`} style={{ fontWeight: 700, color: "var(--brown-dark)" }}>See all {info.name} schools in the explorer →</Link>
                </p>
              )}
            </section>
          ) : (
            <div className="content-card" style={{ textAlign: "center" }}>
              <p style={{ marginBottom: 12, color: "var(--dark)" }}>No {info.name} schools listed in {city.label} yet.</p>
              <Link className="btn-primary" href={`/schools/${city.slug}`}>Browse all schools in {city.label}</Link>
            </div>
          )}

          {/* Neighbourhoods */}
          {d.areas.length > 0 && (
            <section style={{ marginBottom: 28 }}>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: "var(--dark)", marginBottom: 12 }}>{info.name} schools by neighbourhood</h2>
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                {d.areas.map(([area, n]) => (
                  <Link key={area} href={`/schools/${city.slug}/${area.toLowerCase().replace(/\s+/g, "-")}`} style={pill}>{area} ({n})</Link>
                ))}
              </div>
            </section>
          )}

          {/* FAQ */}
          <section className="content-card prose">
            <h2 style={{ marginTop: 0 }}>Frequently asked questions</h2>
            {faqs.map((f) => (
              <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>
            ))}
          </section>

          {/* Cross-links */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
            {otherBoards.map((b) => (
              <Link key={b} href={`/schools/${city.slug}/${b}`} style={pill}>{BOARD_SLUGS[b].label} schools in {city.label}</Link>
            ))}
            <Link href={`/schools/${city.slug}`} style={{ ...pill, color: "var(--brown-dark)" }}>All schools in {city.label} →</Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
