import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { escapeHtml, notifyAdmin } from "@/lib/notify";

const schema = z.object({
  school_slug: z.string().min(1).max(200),
  claimant_name: z.string().trim().min(2).max(120),
  role_title: z.string().trim().max(120).optional(),
  official_email: z.string().trim().email().max(200),
  phone: z.string().trim().max(30).optional(),
  message: z.string().trim().max(2000).optional(),
});

export async function POST(req: NextRequest) {
  const supabase: any = await createClient(); // tables added after the generated Database types
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ success: false, error: "Please sign in to claim a profile." }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Please check the highlighted fields." }, { status: 400 });
  }
  const { school_slug, ...claim } = parsed.data;

  const { data: school } = await supabase.from("schools").select("id, name").eq("slug", school_slug).single();
  if (!school) return NextResponse.json({ success: false, error: "School not found." }, { status: 404 });

  const { error } = await supabase.from("school_claims").insert({ ...claim, school_id: school.id, user_id: user.id });
  if (error) {
    console.error("[claims] insert failed:", error.message);
    return NextResponse.json({ success: false, error: "We couldn't save your claim. Please try again shortly." }, { status: 500 });
  }

  await notifyAdmin(
    `[Profile claim] ${school.name}`,
    `<p><strong>${escapeHtml(claim.claimant_name)}</strong> (${escapeHtml(claim.role_title || "role not given")}) wants to claim <strong>${escapeHtml(school.name)}</strong>.</p>
     <p>Official email: ${escapeHtml(claim.official_email)}<br>Phone: ${escapeHtml(claim.phone || "—")}</p>
     <p>${escapeHtml(claim.message || "")}</p>`
  );
  return NextResponse.json({ success: true });
}
