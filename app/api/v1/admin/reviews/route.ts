import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getPlatformAdmin } from "@/lib/adminAuth";
import { createAdminClient } from "@/lib/supabase/server";

// Review moderation. Restricted to users whose role is platform_admin; writes use the
// service role because reviewers' RLS policies (rightly) don't let anyone approve a review.
const schema = z.object({
  id: z.string().uuid(),
  action: z.enum(["approve", "approve_verified", "reject"]),
  note: z.string().max(500).optional(),
});

export async function POST(req: NextRequest) {
  if (!(await getPlatformAdmin())) return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return NextResponse.json({ success: false, error: "Invalid request" }, { status: 400 });
  const { id, action, note } = parsed.data;

  const admin = await createAdminClient();
  const { error } = await admin.from("reviews").update({
    status: action === "reject" ? "rejected" : "approved",
    is_verified: action === "approve_verified",
    moderated_at: new Date().toISOString(),
    moderation_note: note || null,
  } as any).eq("id", id);

  if (error) {
    console.error("[admin/reviews] update failed:", error.message);
    return NextResponse.json({ success: false, error: "Update failed" }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
