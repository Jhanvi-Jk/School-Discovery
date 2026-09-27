import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { escapeHtml, notifyAdmin } from "@/lib/notify";

const schema = z.object({
  name: z.string().trim().min(2).max(120),
  email: z.string().trim().email().max(200),
  topic: z.enum(["general", "data-correction", "school-listing", "partnership", "privacy", "press"]).default("general"),
  message: z.string().trim().min(10).max(4000),
  website: z.string().optional(), // honeypot: real users leave it empty
});

export async function POST(req: NextRequest) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ success: false, error: "Please fill in your name, a valid email and a message." }, { status: 400 });
  }
  const { website, ...data } = parsed.data;
  if (website) return NextResponse.json({ success: true }); // bot: pretend it worked

  const supabase: any = await createClient(); // tables added after the generated Database types
  const { error } = await supabase.from("contact_messages").insert(data);
  if (error) {
    console.error("[contact] insert failed:", error.message);
    return NextResponse.json({ success: false, error: "We couldn't send your message. Please try again shortly." }, { status: 500 });
  }

  await notifyAdmin(
    `[Contact] ${data.topic} — ${data.name}`,
    `<p><strong>${escapeHtml(data.name)}</strong> &lt;${escapeHtml(data.email)}&gt; · ${escapeHtml(data.topic)}</p><p>${escapeHtml(data.message)}</p>`
  );
  return NextResponse.json({ success: true });
}
