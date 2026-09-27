import Image from "next/image";
import Link from "next/link";
import { ChevronRight, MapPin } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { createPublicClient } from "@/lib/supabase/public";
import { fetchAllRows } from "@/lib/supabase/fetchAll";
import { parseSearchParams, searchSchools } from "@/lib/schools/search";
import { getSiteStats, formatCount } from "@/lib/siteStats";
import { BOARD_SLUGS, boardSlugFromDb, type CityConfig } from "@/lib/cities";
import { formatFeesRange, formatFees } from "@/lib/utils";
import { SITE_URL } from "@/lib/site";

const YEAR = new Date().getFullYear();

export async function CityHubPage({ city }: { city: CityConfig }) {
  const stats = await getSiteStats();
  const stat = stats.cities.find((c) => c.slug === city.slug);
  const otherLive = stats.liveCities.filter((c) => c.slug !== city.slug);

  // ── Not launched: an honest "coming soon" page instead of "0+ verified schools" ──
  if (!stat?.live) {
    return (
      <>
        <Header />
        <main style={{ background: "var(--beige-300)", minHeight: "calc(100vh - 56px)", padding: "56px 20px" }}>
          <div className="content-card" style={{ maxWidth: 620, margin: "0 auto", textAlign: "center", padding: "36px 28px" }}>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", marginBottom: 10 }}>Coming soon</p>
            <h1 style={{ fontSize: 26, fontWeight: 800, color: "var(--dark)", marginBottom: 10 }}>Schools in {city.label}</h1>
            <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.7, marginBottom: 22 }}>
              We&apos;re still collecting and checking school information for {city.label}, and we won&apos;t list schools until we can stand behind the details.
              {otherLive.length > 0 ? " In the meantime you can explore the cities that are live." : ""}
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, justifyContent: "center" }}>
              {otherLive.map((c) => (
                <Link key={c.slug} className="btn-primary" href={`/schools/${c.slug}`}>Schools in {c.label} ({formatCount(c.count)})</Link>
              ))}
              <Link className="btn-secondary" href="/contact">Ask us to prioritise {city.label}</Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  const supabase = createPublicClient();
  const [list, rows] = await Promise.all([
    searchSchools(supabase, parseSearchParams(new URLSearchParams({ city: city.dbName, limit: "24" }))),
    // The view's curricula column needs migration 027+; without it, fall back to areas and fees only
    fetchAllRows<{ area: string | null; curricula?: string[] | null; total_fees_min: number | null }>((from, to) =>
      supabase.from("schools_with_details").select("area, curricula, total_fees_min").eq("city", city.dbName).order("area").range(from, to)
    ).catch(() =>
      fetchAllRows<{ area: string | null; curricula?: string[] | null; total_fees_min: number | null }>((from, to) =>
        supabase.from("schools_with_details").select("area, total_fees_min").eq("city", city.dbName).order("area").range(from, to)
      )
    ),
  ]);

  const areaCounts: Record<string, number> = {};
  const boardCounts: Record<string, number> = {};
  rows.forEach((r) => {
    if (r.area) areaCounts[r.area] = (areaCounts[r.area] || 0) + 1;
    (r.curricula ?? []).forEach((c) => { boardCounts[c] = (boardCounts[c] || 0) + 1; });
  });
  const areas = Object.entries(areaCounts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const boards = Object.entries(boardCounts).sort((a, b) => b[1] - a[1]);
  const fees = rows.map((r) => r.total_fees_min).filter((f): f is number => !!f).sort((a, b) => a - b);
  const count = stat.count;
  const url = `${SITE_URL}/schools/${city.slug}`;

  const faqs = [
    {
      q: `How many schools are listed in ${city.label}?`,
      a: `SchoolFind360 lists ${formatCount(count)} schools in ${city.label}${areas[0] ? `, across ${areas.length} neighbourhoods` : ""}.`,
    },
    boards.length > 0 && {
      q: `Which boards do schools in ${city.label} follow?`,
      a: `Schools in ${city.label} on SchoolFind360 follow ${boards.map(([b, n]) => `${BOARD_SLUGS[boardSlugFromDb(b)]?.label ?? b} (${n})`).join(", ")}. A school can offer more than one board.`,
    },
    fees.length > 0 && {
      q: `What are typical school fees in ${city.label}?`,
      a: `Among ${city.label} schools with published fees, annual fees start from ${formatFees(fees[0])} and go up to ${formatFees(fees[fees.length - 1])}; the middle school charges around ${formatFees(fees[Math.floor(fees.length / 2)])}. Confirm the full fee schedule with each school.`,
    },
    {
      q: `When do school admissions open in ${city.label}?`,
      a: `Dates vary by school. Many private schools open applications in the autumn for the next April. See the admission calendar for windows we track, and set an alert so you're told when one opens.`,
    },
  ].filter(Boolean) as { q: string; a: string }[];

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "ItemList",
      name: `Top Schools in ${city.label}`, numberOfItems: count,
      itemListElement: list.schools.map((s: any, i: number) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE_URL}/schools/${s.slug}` })),
    },
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Schools", item: `${SITE_URL}/schools` },
        { "@type": "ListItem", position: 3, name: `Schools in ${city.label}`, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <>
      {jsonLd.map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
      <Header />
      <main style={{ background: "var(--beige-100)", minHeight: "100vh", paddingBottom: 64 }}>
        <div style={{ background: "linear-gradient(135deg, #2C1810 0%, #5C3820 100%)", color: "#fff", padding: "48px 16px" }}>
          <div style={{ maxWidth: 896, margin: "0 auto" }}>
            <nav aria-label="Breadcrumb" style={{ fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 16, display: "flex", alignItems: "center", gap: 4 }}>
              <Link href="/" style={{ color: "inherit" }}>Home</Link><ChevronRight style={{ width: 12, height: 12 }} />
              <Link href="/schools" style={{ color: "inherit" }}>Schools in India</Link><ChevronRight style={{ width: 12, height: 12 }} />
              <span style={{ color: "#fff" }}>Schools in {city.label}</span>
            </nav>
            <h1 style={{ fontSize: "clamp(24px,5vw,36px)", fontWeight: 700, marginBottom: 8 }}>Schools in {city.label}</h1>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, marginBottom: 24 }}>
              {city.tagline} · {formatCount(count)} schools listed
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {city.boards.map((b) => (
                <Link key={b} href={`/schools/${city.slug}/${b}`} style={{ fontSize: 12, padding: "6px 14px", borderRadius: 99, background: "rgba(255,255,255,0.15)", color: "#fff", fontWeight: 500, display: "inline-block" }}>
                  {BOARD_SLUGS[b].label} Schools
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div style={{ maxWidth: 896, margin: "0 auto", padding: "32px 16px" }}>
          {areas.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--dark)", marginBottom: 16 }}>Browse by Neighbourhood</h2>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: 12 }}>
                {areas.map(([area, n]) => (
                  <Link key={area} href={`/schools/${city.slug}/${area.toLowerCase().replace(/\s+/g, "-")}`}
                    style={{ background: "#fff", borderRadius: 12, padding: "14px 16px", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid var(--beige-400)", display: "block" }}>
                    <p style={{ fontWeight: 600, color: "var(--dark)", fontSize: 14 }}>{area}</p>
                    <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 2 }}>{n} school{n !== 1 ? "s" : ""}</p>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {list.schools.length > 0 && (
            <section style={{ marginBottom: 40 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <h2 style={{ fontSize: 20, fontWeight: 700, color: "var(--dark)" }}>Top Schools in {city.label}</h2>
                <Link href={`/schools?city=${city.slug}`} style={{ fontSize: 14, color: "var(--brown-dark)", fontWeight: 600 }}>View all →</Link>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: 16 }}>
                {list.schools.map((s: any) => (
                  <Link key={s.slug} href={`/schools/${s.slug}`}
                    style={{ background: "#fff", borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.08)", border: "1px solid var(--beige-400)", display: "flex" }}>
                    <div style={{ width: 96, flexShrink: 0, background: "var(--beige-300)", position: "relative", alignSelf: "stretch", minHeight: 96 }}>
                      {s.cover_image_url && <Image src={s.cover_image_url} alt={`${s.name} campus in ${s.area || city.label}`} fill sizes="96px" style={{ objectFit: "cover" }} />}
                    </div>
                    <div style={{ padding: "12px 14px", flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 600, color: "var(--dark)", fontSize: 14, lineHeight: 1.3 }}>{s.name}</p>
                      {s.area && <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 4, display: "flex", alignItems: "center", gap: 4 }}><MapPin style={{ width: 12, height: 12, flexShrink: 0 }} />{s.area}</p>}
                      {s.total_fees_min && <p style={{ fontSize: 12, fontWeight: 500, color: "var(--brown-dark)", marginTop: 4 }}>{formatFeesRange(s.total_fees_min, s.total_fees_max)}</p>}
                    </div>
                  </Link>
                ))}
              </div>
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Link href={`/schools?city=${city.slug}`} className="btn-primary">Explore all {formatCount(count)} {city.label} schools →</Link>
              </div>
            </section>
          )}

          <section className="content-card prose">
            <h2 style={{ marginTop: 0 }}>Choosing a school in {city.label} ({YEAR})</h2>
            {faqs.map((f) => (
              <div key={f.q}><h3>{f.q}</h3><p>{f.a}</p></div>
            ))}
            <p>
              New to the boards? Read <Link href="/blog/cbse-vs-icse-vs-ib-bengaluru">CBSE vs ICSE vs IB</Link>, check the <Link href="/admission-calendar">admission calendar</Link>, or take the <Link href="/quiz">two-minute matching quiz</Link>.
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
