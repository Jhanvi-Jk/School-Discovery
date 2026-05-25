import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { bugType, context, description, wantContact, email } = body;

    if (!description?.trim()) {
      return NextResponse.json({ error: "Description required" }, { status: 400 });
    }

    const payload = {
      bug_type:     bugType || "general",
      context:      context || null,
      description:  description.trim(),
      want_contact: wantContact ?? false,
      email:        wantContact && email ? email.trim() : null,
    };

    // Try service-role client first (bypasses RLS); fall back to anon (uses INSERT policy from migration 018)
    let dbError: unknown = null;
    try {
      const adminSupabase = await createAdminClient();
      const { error } = await adminSupabase.from("bug_reports").insert(payload);
      if (error) {
        console.error("[bug-report] admin insert error:", error.message, error.details);
        dbError = error;
      }
    } catch (adminErr) {
      console.error("[bug-report] createAdminClient failed (SUPABASE_SERVICE_ROLE_KEY missing?):", adminErr);
      dbError = adminErr;
    }

    // Fallback: anon client — works once migration 018 RLS INSERT policy is applied
    if (dbError) {
      const anonSupabase = await createClient();
      const { error: anonError } = await anonSupabase.from("bug_reports").insert(payload);
      if (anonError) {
        console.error("[bug-report] anon insert also failed:", anonError.message);
      } else {
        dbError = null; // anon fallback succeeded
      }
    }

    // Send email via Resend regardless of DB outcome
    const adminEmail = "admin@legitfarms.com";
    const resendKey  = process.env.RESEND_API_KEY;

    if (resendKey) {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method:  "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from:    "SchoolFind360 <noreply@schoolfind360.com>",
          to:      [adminEmail],
          subject: `[Bug Report] ${bugType || "General"} — ${context || "No context"}`,
          html: `
            <h2>New Bug Report — SchoolFind360</h2>
            <p><strong>Type:</strong> ${bugType || "General"}</p>
            ${context ? `<p><strong>Context:</strong> ${context}</p>` : ""}
            <p><strong>Description:</strong><br>${(description as string).trim()}</p>
            <p><strong>Wants notification:</strong> ${wantContact ? "Yes" : "No"}</p>
            ${wantContact && email ? `<p><strong>Contact email:</strong> ${email}</p>` : ""}
            ${dbError ? `<p style="color:red"><em>⚠️ DB insert failed — check server logs.</em></p>` : ""}
          `,
        }),
      });
      if (!emailRes.ok) {
        const txt = await emailRes.text();
        console.error("[bug-report] Resend error:", emailRes.status, txt);
      }
    } else {
      console.warn("[bug-report] RESEND_API_KEY not set — email skipped. Report:", JSON.stringify(payload));
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[bug-report] Unhandled error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
