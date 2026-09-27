import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { createClient } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "School Portal",
  robots: { index: false, follow: false },
};

const STATUS_LABEL: Record<string, { text: string; bg: string; fg: string }> = {
  pending:  { text: "Under review", bg: "#fef3c7", fg: "#92400e" },
  approved: { text: "Approved",     bg: "#dcfce7", fg: "#166534" },
  rejected: { text: "Not approved", bg: "#fee2e2", fg: "#991b1b" },
};

// Middleware already redirects signed-out visitors to /login; this page shows the
// signed-in user's claims and what happens next.
export default async function SchoolPortalPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: claims } = user
    ? await supabase
        .from("school_claims")
        .select("id, status, created_at, schools(name, slug, area, city)")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
    : { data: [] as any[] };

  const list = (claims ?? []) as any[];

  return (
    <ContentPage eyebrow="For schools" title="School Portal" lead="Follow the status of your profile claims here.">
      {list.length === 0 ? (
        <div className="content-card" style={{ textAlign: "center" }}>
          <p style={{ fontSize: 15, color: "var(--dark)", marginBottom: 14 }}>You haven&apos;t claimed a school profile yet.</p>
          <Link className="btn-primary" href="/schools/claim">Claim a profile</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {list.map((c) => {
            const school = Array.isArray(c.schools) ? c.schools[0] : c.schools;
            const st = STATUS_LABEL[c.status] ?? STATUS_LABEL.pending;
            return (
              <div key={c.id} className="content-card" style={{ marginBottom: 0, display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
                <div>
                  <p style={{ fontWeight: 700, color: "var(--dark)" }}>{school?.name ?? "School"}</p>
                  <p style={{ fontSize: 12, color: "var(--muted)" }}>
                    {[school?.area, school?.city].filter(Boolean).join(", ")} · claimed {new Date(c.created_at).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </p>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: st.bg, color: st.fg }}>{st.text}</span>
                  {school?.slug && <Link href={`/schools/${school.slug}`} className="btn-secondary" style={{ padding: "6px 12px", fontSize: 12 }}>View profile</Link>}
                </div>
              </div>
            );
          })}
          <p style={{ fontSize: 13, color: "var(--muted)", lineHeight: 1.6 }}>
            Approved schools can send corrections and new photos through <Link href="/contact?topic=school-listing" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>the contact form</Link> for now — a self-serve editor is on our roadmap.
          </p>
        </div>
      )}
    </ContentPage>
  );
}
