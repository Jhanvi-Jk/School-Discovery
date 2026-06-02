// Server component — fetches initial school list for SSR so bots receive
// real school cards in the HTML, not an empty skeleton waiting for JS.
import { createClient } from "@/lib/supabase/server";
import { SchoolsClient } from "@/components/schools/SchoolsClient";
import type { SchoolSummary } from "@/lib/types";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export default async function SchoolsPage() {
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
      />
    </>
  );
}
