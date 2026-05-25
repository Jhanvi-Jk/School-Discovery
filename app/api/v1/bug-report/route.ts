import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bugType, context, description, wantContact, email } = body;

    if (!description?.trim()) {
      return NextResponse.json({ error: "Description required" }, { status: 400 });
    }

    const supabase = await createClient();

    // Store in DB (create this table via migration 016)
    await supabase.from("bug_reports").insert({
      bug_type:     bugType || "general",
      context:      context || null,
      description:  description.trim(),
      want_contact: wantContact ?? false,
      email:        wantContact && email ? email.trim() : null,
    });

    // Forward to admin email via Resend (or any HTTP email API)
    const adminEmail = "admin@legitfarms.com";
    const resendKey  = process.env.RESEND_API_KEY;

    if (resendKey) {
      await fetch("https://api.resend.com/emails", {
        method:  "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:    "SchoolFind360 <noreply@schoolfind360.com>",
          to:      [adminEmail],
          subject: `[Bug Report] ${bugType || "General"} — ${context || "No context"}`,
          html: `
            <h2>New Bug Report</h2>
            <p><strong>Type:</strong> ${bugType || "General"}</p>
            ${context ? `<p><strong>Context:</strong> ${context}</p>` : ""}
            <p><strong>Description:</strong><br>${description}</p>
            <p><strong>Wants notification:</strong> ${wantContact ? "Yes" : "No"}</p>
            ${wantContact && email ? `<p><strong>Email:</strong> ${email}</p>` : ""}
          `,
        }),
      });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Bug report error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
