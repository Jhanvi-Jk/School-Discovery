import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { INDIAN_MOBILE, normalisePhone } from "@/lib/notify";

// Admission-deadline alerts by email and/or WhatsApp. Consent is explicit and recorded.
const schema = z.object({
  school_slug: z.string().min(1).max(200).optional(),
  city: z.string().min(2).max(60).optional(),
  grade: z.string().max(40).optional(),
  channel: z.enum(["email", "whatsapp", "both"]),
  email: z.string().trim().email().max(200).optional(),
  phone: z.string().trim().optional(),
  consent: z.literal(true),
}).refine((d) => d.school_slug || d.city, { message: "Choose a school or a city" })
  .refine((d) => d.channel === "whatsapp" || !!d.email, { message: "Email is required", path: ["email"] })
  .refine((d) => d.channel === "email" || (!!d.phone && INDIAN_MOBILE.test(d.phone)), { message: "Enter a valid 10-digit mobile number", path: ["phone"] });

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const msg = parsed.error.issues[0]?.message || "Please check your details.";
    return NextResponse.json({ success: false, error: msg === "Invalid literal value, expected true" ? "Please tick the consent box." : msg }, { status: 400 });
  }
  const d = parsed.data;
  const supabase: any = await createClient(); // tables added after the generated Database types

  let schoolId: string | null = null;
  if (d.school_slug) {
    const { data: school } = await supabase.from("schools").select("id").eq("slug", d.school_slug).single();
    if (!school) return NextResponse.json({ success: false, error: "School not found." }, { status: 404 });
    schoolId = school.id;
  }

  const { error } = await supabase.from("admission_alert_subscriptions").insert({
    school_id: schoolId,
    city: schoolId ? null : d.city,
    grade: d.grade || null,
    channel: d.channel,
    email: d.channel === "whatsapp" ? null : d.email!.toLowerCase(),
    phone: d.channel === "email" ? null : normalisePhone(d.phone!),
  });
  if (error) {
    console.error("[alerts] insert failed:", error.message);
    return NextResponse.json({ success: false, error: "We couldn't save your alert. Please try again shortly." }, { status: 500 });
  }
  return NextResponse.json({ success: true });
}
