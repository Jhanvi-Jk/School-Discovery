import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ContentPage } from "@/components/layout/ContentPage";
import { ModerationList } from "@/components/reviews/ModerationList";
import { getPlatformAdmin } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Review moderation", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminReviewsPage() {
  // Anyone who isn't a platform admin sees a plain 404 — the page's existence isn't advertised
  if (!(await getPlatformAdmin())) notFound();

  const admin = await createAdminClient();
  const { data } = await admin
    .from("reviews")
    .select("id, rating_overall, title, body, relation, created_at, user_id, schools(name, slug)")
    .eq("status" as any, "pending")
    .order("created_at", { ascending: true });

  const rows = (data ?? []) as any[];
  const userIds = [...new Set(rows.map((r) => r.user_id).filter(Boolean))];
  const { data: users } = userIds.length
    ? await admin.from("users").select("id, email").in("id", userIds)
    : { data: [] as any[] };
  const emailById = new Map((users ?? []).map((u: any) => [u.id, u.email]));

  const items = rows.map((r) => {
    const school = Array.isArray(r.schools) ? r.schools[0] : r.schools;
    return {
      id: r.id, school: school?.name ?? "School", slug: school?.slug ?? "", relation: r.relation,
      created_at: r.created_at, rating_overall: r.rating_overall, title: r.title, body: r.body,
      email: emailById.get(r.user_id) ?? null,
    };
  });

  return (
    <ContentPage eyebrow="Admin" title={`Review moderation (${items.length} pending)`} lead="Approve genuine reviews, mark confirmed parents as verified, reject anything abusive, promotional or from school staff.">
      <ModerationList initial={items} />
    </ContentPage>
  );
}
