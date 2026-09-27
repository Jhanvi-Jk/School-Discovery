import { NextRequest, NextResponse } from "next/server";
import { createAdminClient, createClient } from "@/lib/supabase/server";
import { escapeHtml, notifyAdmin } from "@/lib/notify";

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

    // E-mail the team regardless of DB outcome (user text is escaped: it goes into an HTML mail)
    await notifyAdmin(
      `[Bug Report] ${bugType || "General"} — ${context || "No context"}`.slice(0, 200),
      `
        <h2>New Bug Report — SchoolFind360</h2>
        <p><strong>Type:</strong> ${escapeHtml(bugType || "General")}</p>
        ${context ? `<p><strong>Context:</strong> ${escapeHtml(context)}</p>` : ""}
        <p><strong>Description:</strong><br>${escapeHtml((description as string).trim())}</p>
        <p><strong>Wants notification:</strong> ${wantContact ? "Yes" : "No"}</p>
        ${wantContact && email ? `<p><strong>Contact email:</strong> ${escapeHtml(email)}</p>` : ""}
        ${dbError ? `<p style="color:red"><em>DB insert failed — check server logs.</em></p>` : ""}
      `
    );

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("[bug-report] Unhandled error:", err);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
