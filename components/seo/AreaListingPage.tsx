import type { Metadata } from "next";
import Link from "next/link";
import { notFound, permanentRedirect } from "next/navigation";
import { ChevronRight, Map as MapIcon } from "lucide-react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { SchoolGrid } from "@/components/schools/SchoolGrid";
import { loadCityCatalog } from "@/lib/schools/catalog";
import { areaStats, boardToUrl, curriculumLabel, slugifyArea, type CatalogSchool } from "@/lib/schools/core";
import { cityFromSlug, type CityConfig } from "@/lib/cities";
import { SITE_URL } from "@/lib/site";

// /schools/{city}/{area}. The school list and its count come from the same catalogue
// rows (grouped by area slug) that produce the counts on the city page, so the two always agree.

interface ResolvedArea {
  city: CityConfig;
  slug: string;
  name: string;
  schools: CatalogSchool[];
  nearby: { slug: string; name: string; count: number }[];
}

async function resolveArea(citySlug: string, rawArea: string): Promise<ResolvedArea | { redirect: string } | null> {
  const city = cityFromSlug(citySlug);
  if (!city) return null;
  const all = await loadCityCatalog(city);
  const stats = areaStats(all);
  const wanted = rawArea.toLowerCase();
  let stat = stats.find((a) => a.slug === wanted);
  if (!stat) {
    // Older links used "s.g.-palya" / "Whitefield" spellings — send them to the canonical slug
    let decoded = rawArea;
    try { decoded = decodeURIComponent(rawArea); } catch { /* keep raw */ }
    const normalised = slugifyArea(decoded.replace(/-/g, " "));
    const match = stats.find((a) => a.slug === normalised);
    if (match) return { redirect: `/schools/${city.slug}/${match.slug}` };
    return null;
  }
  if (citySlug !== city.slug || rawArea !== stat.slug) return { redirect: `/schools/${city.slug}/${stat.slug}` };

  const schools = all
    .filter((s) => s.areaSlug === stat!.slug)
    .sort((a, b) => b.completeness.score - a.completeness.score || a.name.localeCompare(b.name));

  // "Nearby" = areas whose schools' average position is closest to this one (falls back to biggest areas)
  const centre = (rows: CatalogSchool[]) => {
    const pts = rows.filter((s) => s.lat != null && s.lng != null);
    return pts.length ? [pts.reduce((t, s) => t + s.lat!, 0) / pts.length, pts.reduce((t, s) => t + s.lng!, 0) / pts.length] : null;
  };
  const here = centre(schools);
  const nearby = stats
    .filter((a) => a.slug !== stat!.slug)
    .map((a) => {
      const c = here ? centre(all.filter((s) => s.areaSlug === a.slug)) : null;
      return { ...a, d: here && c ? Math.hypot(c[0] - here[0], c[1] - here[1]) : Infinity };
    })
    .sort((a, b) => a.d - b.d || b.count - a.count)
    .slice(0, 8);

  return { city, slug: stat.slug, name: stat.name, schools, nearby };
}

export async function areaMetadata(citySlug: string, rawArea: string): Promise<Metadata> {
  const r = await resolveArea(citySlug, rawArea);
  if (!r || "redirect" in r) return { title: "Page not found", robots: { index: false, follow: false } };
  const n = r.schools.length;
  const boards = boardCounts(r.schools).slice(0, 3).map(([b]) => curriculumLabel(b)).join(", ");
  const url = `${SITE_URL}/schools/${r.city.slug}/${r.slug}`;
  const title = `Schools in ${r.name}, ${r.city.label} (${n}) – Fees, Boards & Reviews`;
  const description = `Compare ${n} school${n === 1 ? "" : "s"} in ${r.name}, ${r.city.label}${boards ? ` — ${boards}` : ""}. See fees, admission status, map location and parent reviews.`;
  return {
    title, description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", siteName: "SchoolFind360" },
    twitter: { card: "summary_large_image", title, description },
  };
}

function boardCounts(schools: CatalogSchool[]): [string, number][] {
  const m: Record<string, number> = {};
  schools.forEach((s) => s.curricula.forEach((c) => { m[c] = (m[c] || 0) + 1; }));
  return Object.entries(m).sort((a, b) => b[1] - a[1]);
}

export async function AreaListingPage({ citySlug, areaSlug }: { citySlug: string; areaSlug: string }) {
  const r = await resolveArea(citySlug, areaSlug);
  if (!r) notFound();
  if ("redirect" in r) permanentRedirect(r.redirect);

  const { city, name, slug, schools, nearby } = r;
  const url = `${SITE_URL}/schools/${city.slug}/${slug}`;
  const exploreHref = `/schools?city=${city.slug}&area=${slug}`;
  const boards = boardCounts(schools);

  const jsonLd = [
    {
      "@context": "https://schema.org", "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Schools", item: `${SITE_URL}/schools` },
        { "@type": "ListItem", position: 3, name: `Schools in ${city.label}`, item: `${SITE_URL}/schools/${city.slug}` },
        { "@type": "ListItem", position: 4, name: `Schools in ${name}`, item: url },
      ],
    },
    {
      "@context": "https://schema.org", "@type": "ItemList",
      name: `Schools in ${name}, ${city.label}`, numberOfItems: schools.length,
      itemListElement: schools.map((s, i) => ({ "@type": "ListItem", position: i + 1, name: s.name, url: `${SITE_URL}/schools/${s.slug}` })),
    },
  ];

  return (
    <>
      {jsonLd.map((j, i) => <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(j) }} />)}
      <Header />
      <main className="listing-page">
        <div className="listing-hero">
          <div className="listing-hero-inner">
            <nav aria-label="Breadcrumb" className="crumbs">
              <Link href="/">Home</Link><ChevronRight size={11} aria-hidden="true" />
              <Link href="/schools">Schools</Link><ChevronRight size={11} aria-hidden="true" />
              <Link href={`/schools/${city.slug}`}>Schools in {city.label}</Link><ChevronRight size={11} aria-hidden="true" />
              <span aria-current="page">{name}</span>
            </nav>
            <h1>Schools in {name}, {city.label}</h1>
            <p>{schools.length} school{schools.length === 1 ? "" : "s"} listed in {name}. Compare fees, boards, admission status and parent reviews.</p>
            {boards.length > 0 && (
              <div className="hero-chips">
                {boards.map(([b, n]) => (
                  <Link key={b} href={`${exploreHref}&curriculum=${boardToUrl(b)}`}>{curriculumLabel(b)} ({n})</Link>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="listing-body">
          <div className="listing-toolbar">
            <p><strong>{schools.length}</strong> school{schools.length === 1 ? "" : "s"}</p>
            <Link href={exploreHref} className="btn-secondary"><MapIcon size={14} /> Filter &amp; map these schools</Link>
          </div>
          <SchoolGrid schools={schools} />

          {nearby.length > 0 && (
            <section className="listing-related">
              <h2>Schools in nearby areas</h2>
              <div className="pill-links">
                {nearby.map((a) => <Link key={a.slug} href={`/schools/${city.slug}/${a.slug}`}>{a.name} ({a.count})</Link>)}
                <Link href={`/schools/${city.slug}`} className="strong">All schools in {city.label} →</Link>
              </div>
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
