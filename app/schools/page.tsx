// Server component — renders the first page of results into the HTML, so crawlers and
// slow connections get real school cards instead of a "Finding schools…" placeholder.
import { headers } from "next/headers";
import { SchoolsClient } from "@/components/schools/SchoolsClient";
import { Footer } from "@/components/layout/Footer";
import { createPublicClient } from "@/lib/supabase/public";
import { parseSearchParams, searchSchools } from "@/lib/schools/search";
import { getSiteStats, liveCityNames } from "@/lib/siteStats";
import { SITE_URL } from "@/lib/site";
import type { SchoolSummary } from "@/lib/types";
import type { Metadata } from "next";
import { formatCount } from "@/lib/siteStats";
import type { CityStat } from "@/lib/siteStats";

// Canonical always points to the clean URL — filter state lives in the browser, not the URL,
// so there are no duplicate-content variants to consolidate.
export async function generateMetadata(): Promise<Metadata> {
  const stats = await getSiteStats();
  const cities = liveCityNames(stats);
  // The same figure the listing page shows — never a hard-coded "500+"
  const scope = stats.total > 0 ? `${formatCount(stats.total)} schools in ${cities}` : "schools across India";

  return {
    title: "Explore Schools Across India — Filter by City, Board, Area & Fees",
    description: `Compare ${scope}. Filter by CBSE, ICSE, IB, IGCSE, area, fees and more, see admission status, and shortlist the right school for your child.`,
    alternates: { canonical: `${SITE_URL}/schools` },
    openGraph: {
      title: "Explore Schools Across India | SchoolFind360",
      description: `Browse ${scope}. Compare fees, curriculum, admissions and more.`,
      url: `${SITE_URL}/schools`,
      type: "website",
      siteName: "SchoolFind360",
    },
    twitter: {
      card: "summary_large_image",
      title: "Explore Schools Across India | SchoolFind360",
      description: `Browse ${scope}.`,
    },
  };
}


// Vercel adds the visitor's city (URL-encoded) to every request
function detectCity(rawCity: string | null, cities: CityStat[]): CityStat | undefined {
  if (!rawCity) return undefined;
  let name = rawCity;
  try { name = decodeURIComponent(rawCity); } catch { /* keep raw */ }
  const n = name.toLowerCase();
  const key = /bengaluru|bangalore/.test(n) ? "bangalore"
    : /delhi|noida|gurgaon|gurugram|faridabad|ghaziabad/.test(n) ? "delhi"
    : /chennai|madras/.test(n) ? "chennai"
    : /mumbai|bombay|thane|navi mumbai/.test(n) ? "mumbai"
    : null;
  return cities.find((c) => c.key === key);
}

export default async function SchoolsPage({ searchParams }: { searchParams: Promise<{ city?: string }> }) {
  const { city: cityParam } = await searchParams;
  const headersList = await headers();
  const isBot = headersList.get("x-is-bot") === "1";
  const stats = await getSiteStats();

  // Start in the visitor's own city when we cover it, otherwise the first live city
  const live = stats.liveCities.length ? stats.liveCities : stats.cities;
  const linked = cityParam ? live.find((c) => c.slug === cityParam.toLowerCase() || c.key === cityParam.toLowerCase()) : undefined;
  const initialCity = linked ?? detectCity(headersList.get("x-vercel-ip-city"), live) ?? live[0];

  let initialSchools: SchoolSummary[] = [];
  let initialTotal = 0;
  try {
    const result = await searchSchools(
      createPublicClient(),
      parseSearchParams(new URLSearchParams({ city: initialCity.dbName, page: "1", limit: "24" }))
    );
    initialSchools = result.schools as SchoolSummary[];
    initialTotal = result.total;
  } catch (e) {
    // The client fetches again on mount, so a failed server render degrades to a skeleton, not an error page
    console.error("INITIAL_LOAD_FAILED " + String((e as any)?.message) + " " + String((e as any)?.code) + " " + String((e as any)?.stack).slice(0, 500));
  }

  // JSON-LD ItemList — read from the HTML without executing JS
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Schools in ${initialCity.label}`,
    numberOfItems: initialTotal,
    itemListElement: initialSchools.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${SITE_URL}/schools/${s.slug}`,
    })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <SchoolsClient
        initialSchools={initialSchools}
        initialTotal={initialTotal}
        initialCity={initialCity.key}
        cityStats={stats.cities.map((c) => ({ key: c.key, count: c.count, live: c.live }))}
        totalSchools={stats.total}
        liveCityNames={liveCityNames(stats)}
        disableMap={isBot}
      />
      <Footer />
    </>
  );
}
