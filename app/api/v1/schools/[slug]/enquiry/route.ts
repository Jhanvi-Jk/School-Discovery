import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";
import { escapeHtml, notifyAdmin } from "@/lib/notify";

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  grade: z.string().optional(),
  message: z.string().max(2000).optional(),
  kind: z.enum(["admission", "campus_visit"]).default("admission"),
  // ISO date the family would like to visit (campus_visit only)
  visit_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  consent: z.literal(true),
});

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const supabase = await createClient();
  const { slug } = await params;

  try {
    // Get school ID from slug
    const { data: school } = await supabase
      .from("schools")
      .select("id, name")
      .eq("slug", slug)
      .single();

    if (!school) {
      return NextResponse.json(
        { success: false, error: { code: "SCHOOL_NOT_FOUND", message: "School not found" } },
        { status: 404 }
      );
    }

    const body = await request.json();
    const parsed = enquirySchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: { code: "VALIDATION_ERROR", message: "Invalid input", details: parsed.error.flatten() } },
        { status: 400 }
      );
    }

    // Get current user (optional)
    const { data: { user } } = await supabase.auth.getUser();

    const { error } = await supabase.from("enquiries").insert({
      school_id: school.id,
      user_id: user?.id || null,
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone || null,
      grade: parsed.data.grade || null,
      message: parsed.data.message || null,
      kind: parsed.data.kind,
      visit_date: parsed.data.kind === "campus_visit" ? parsed.data.visit_date ?? null : null,
      consented_at: new Date().toISOString(),
      status: "new",
    });

    if (error) throw error;

    const e = parsed.data;
    await notifyAdmin(
      `[${e.kind === "campus_visit" ? "Campus visit" : "Enquiry"}] ${school.name}`,
      `<p><strong>${escapeHtml(e.name)}</strong> &lt;${escapeHtml(e.email)}&gt; ${escapeHtml(e.phone || "")}</p>
       <p>School: ${escapeHtml(school.name)} · Grade: ${escapeHtml(e.grade || "—")}${e.visit_date ? ` · Preferred visit: ${escapeHtml(e.visit_date)}` : ""}</p>
       <p>${escapeHtml(e.message || "")}</p>`
    );

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SUBMIT_ERROR", message: "Failed to submit enquiry" } },
      { status: 500 }
    );
  }
}
