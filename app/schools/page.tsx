// Server component — fetches initial school list for SSR so bots receive
// real school cards in the HTML, not an empty skeleton waiting for JS.
import { createClient } from "@/lib/supabase/server";
import { SchoolsClient } from "@/components/schools/SchoolsClient";
import Link from "next/link";
import { headers } from "next/headers";
import type { SchoolSummary } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export default async function SchoolsPage() {
  const headersList = await headers();
  const isBot = headersList.get("x-is-bot") === "1";

  const supabase = await createClient();

  // Fetch the default view: Bengaluru, best-rated first, non-thin profiles only.
  // These are the schools rendered in HTML on first load — visible to bots immediately.
  const { data: raw, count } = await supabase
    .from("schools_with_details")
    .select(
      "id, slug, name, description, type, gender, verified, area, city, " +
      "cover_image_url, logo_url, total_fees_min, total_fees_max, " +
      "has_transport, student_teacher_ratio, student_count, " +
      "avg_rating, review_count, admissions_open, mid_year_available",
      { count: "exact" }
    )
    .eq("city", "Bengaluru")
    .not("total_fees_min", "is", null)
    .order("avg_rating", { ascending: false, nullsFirst: false })
    .limit(12);

  const initialSchools = (raw || []) as SchoolSummary[];
  const initialTotal   = count ?? 0;

  // JSON-LD ItemList — bots read this from the HTML without executing JS
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Top Schools in Bengaluru",
    description: `Browse ${initialTotal}+ verified schools in Bengaluru — CBSE, ICSE, IB, IGCSE and more.`,
    numberOfItems: initialTotal,
    itemListElement: initialSchools.map((s, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: s.name,
      url: `${APP_URL}/schools/${s.slug}`,
    })),
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <SchoolsClient
        initialSchools={initialSchools}
        initialTotal={initialTotal}
        disableMap={isBot}
      />

      {/*
        ── Static HTML directory — visible to crawlers in the raw HTML payload.
        Googlebot and other bots land here when no city is selected and need
        anchor tags to discover deeper pages. This section is visually hidden
        but fully present in the DOM (not display:none — that blocks crawling).
        It renders below the interactive UI so users never see it.
      ──────────────────────────────────────────────────────────────────────── */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          width: 1,
          height: 1,
          overflow: "hidden",
          clip: "rect(0 0 0 0)",
          whiteSpace: "nowrap",
        }}
      >
        <nav>
          {/* City hubs */}
          <Link href="/schools/bengaluru">Schools in Bengaluru</Link>
          <Link href="/schools/delhi">Schools in Delhi</Link>
          <Link href="/schools/chennai">Schools in Chennai</Link>
          <Link href="/schools/mumbai">Schools in Mumbai</Link>

          {/* Board filters */}
          <Link href="/schools/bengaluru?curriculum=cbse">CBSE Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru?curriculum=icse">ICSE Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru?curriculum=ib">IB Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru?curriculum=igcse">IGCSE Schools in Bengaluru</Link>
          <Link href="/schools/delhi?curriculum=cbse">CBSE Schools in Delhi</Link>
          <Link href="/schools/delhi?curriculum=ib">IB Schools in Delhi</Link>
          <Link href="/schools/chennai?curriculum=cbse">CBSE Schools in Chennai</Link>
          <Link href="/schools/mumbai?curriculum=cbse">CBSE Schools in Mumbai</Link>
          <Link href="/schools/mumbai?curriculum=icse">ICSE Schools in Mumbai</Link>

          {/* Neighbourhood landing pages */}
          <Link href="/schools/bengaluru/whitefield">Schools in Whitefield, Bengaluru</Link>
          <Link href="/schools/bengaluru/koramangala">Schools in Koramangala, Bengaluru</Link>
          <Link href="/schools/bengaluru/hsr-layout">Schools in HSR Layout, Bengaluru</Link>
          <Link href="/schools/bengaluru/indiranagar">Schools in Indiranagar, Bengaluru</Link>
          <Link href="/schools/bengaluru/jp-nagar">Schools in JP Nagar, Bengaluru</Link>
          <Link href="/schools/delhi/south-delhi">Schools in South Delhi</Link>
          <Link href="/schools/mumbai/andheri">Schools in Andheri, Mumbai</Link>
          <Link href="/schools/mumbai/bandra">Schools in Bandra, Mumbai</Link>

          {/* Board comparison cross-over pages */}
          <Link href="/schools/bengaluru/cbse-vs-icse">CBSE vs ICSE Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru/cbse-vs-ib">CBSE vs IB Schools in Bengaluru</Link>
          <Link href="/schools/delhi/cbse-vs-icse">CBSE vs ICSE Schools in Delhi</Link>

          {/* Intent-based cluster pages */}
          <Link href="/schools/bengaluru/coed-cbse">Co-ed CBSE Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru/girls-cbse">Girls CBSE Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru/boys-cbse">Boys CBSE Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru/coed-ib">Co-ed IB Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru/girls-ib">Girls IB Schools in Bengaluru</Link>
          <Link href="/schools/bengaluru/coed-cbse-boarding">Co-ed CBSE Boarding Schools in Bengaluru</Link>
          <Link href="/schools/delhi/coed-cbse">Co-ed CBSE Schools in Delhi</Link>
          <Link href="/schools/delhi/girls-cbse">Girls CBSE Schools in Delhi</Link>
          <Link href="/schools/mumbai/coed-icse">Co-ed ICSE Schools in Mumbai</Link>
          <Link href="/schools/chennai/coed-cbse">Co-ed CBSE Schools in Chennai</Link>
        </nav>
      </div>
    </>
  );
}
