import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const enquirySchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional(),
  grade: z.string().optional(),
  message: z.string().optional(),
});

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  const supabase = await createClient();

  try {
    // Get school ID from slug
    const { data: school } = await supabase
      .from("schools")
      .select("id")
      .eq("slug", params.slug)
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
      ...parsed.data,
      status: "new",
    });

    if (error) throw error;

    return NextResponse.json({ success: true, message: "Enquiry submitted successfully" });
  } catch (error) {
    console.error("Enquiry API error:", error);
    return NextResponse.json(
      { success: false, error: { code: "SUBMIT_ERROR", message: "Failed to submit enquiry" } },
      { status: 500 }
    );
  }
}
