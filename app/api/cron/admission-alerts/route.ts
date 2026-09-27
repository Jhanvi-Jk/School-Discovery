import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { fetchAllRows, fetchByIds } from "@/lib/supabase/fetchAll";
import { escapeHtml, sendEmail } from "@/lib/notify";
import { gradeInRange } from "@/lib/schools/search";
import { formatAcademicYear, formatAdmissionDate, resolveAdmissionState, todayISO } from "@/lib/admissions";
import { SITE_URL } from "@/lib/site";

// Runs daily (see vercel.json). Vercel sends `Authorization: Bearer $CRON_SECRET`.
// Emails subscribers about admission windows that have opened, or that close within a week.
// WhatsApp needs a WhatsApp Business provider, so those subscriptions are counted, not sent.
export const dynamic = "force-dynamic";

const DAY = 86400000;

export async function GET(req: NextRequest) {
  const secret = process.env.CRON_SECRET;
  if (!secret || req.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin: any = await createAdminClient();
  const today = todayISO();
  const now = Date.now();

  const subs = await fetchAllRows<any>((from, to) =>
    admin.from("admission_alert_subscriptions").select("*").is("unsubscribed_at", null).order("id").range(from, to)
  );
  const windows = (await fetchAllRows<any>((from, to) =>
    admin.from("admission_windows").select("id, school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status").order("id").range(from, to)
  )).filter((w) => resolveAdmissionState(w, today) === "open");

  const schools = await fetchByIds<any>([...new Set(windows.map((w) => w.school_id))] as string[], (batch) =>
    admin.from("schools_with_details").select("id, name, slug, city").in("id", batch)
  );
  const schoolById = new Map(schools.map((s) => [s.id, s]));

  let sent = 0, failed = 0, whatsappPending = 0;

  for (const sub of subs) {
    if (sub.channel === "whatsapp") { whatsappPending++; continue; }
    if (sub.channel === "both") whatsappPending++;
    if (!sub.email) continue;

    const last = sub.last_notified_at ? new Date(sub.last_notified_at).getTime() : 0;
    const matches = windows.filter((w) => {
      const school = schoolById.get(w.school_id);
      if (!school) return false;
      if (sub.school_id ? w.school_id !== sub.school_id : school.city !== sub.city) return false;
      if (sub.grade && w.grade_from && w.grade_to && !gradeInRange(sub.grade, w.grade_from, w.grade_to)) return false;
      const opened = w.opens_at ? new Date(w.opens_at).getTime() : 0;
      const closesSoon = w.closes_at && new Date(w.closes_at).getTime() - now <= 7 * DAY;
      const reminderDue = closesSoon && last < new Date(w.closes_at).getTime() - 7 * DAY;
      return last === 0 || opened > last || reminderDue;
    });
    if (matches.length === 0) continue;

    const rows = matches.slice(0, 15).map((w) => {
      const s = schoolById.get(w.school_id);
      return `<li><a href="${SITE_URL}/schools/${escapeHtml(s.slug)}">${escapeHtml(s.name)}</a> — admissions ${w.academic_year ? escapeHtml(formatAcademicYear(w.academic_year)) + " " : ""}open${w.closes_at ? `, closes ${escapeHtml(formatAdmissionDate(w.closes_at))}` : ""}</li>`;
    }).join("");
    const html = `
      <p>Good news — admissions are open at ${matches.length === 1 ? "a school" : "schools"} you asked us to watch:</p>
      <ul>${rows}</ul>
      <p>Confirm dates and eligibility with the school before you apply.</p>
      <p style="font-size:12px;color:#666">You're receiving this because you asked for admission alerts on SchoolFind360.
      <a href="${SITE_URL}/unsubscribe?token=${sub.unsubscribe_token}">Unsubscribe</a></p>`;

    if (await sendEmail(sub.email, "Admissions are open — SchoolFind360 alert", html)) {
      sent++;
      await admin.from("admission_alert_subscriptions").update({ last_notified_at: new Date().toISOString() }).eq("id", sub.id);
    } else failed++;
  }

  return NextResponse.json({ subscriptions: subs.length, emailsSent: sent, emailsFailed: failed, whatsappNotSent: whatsappPending });
}
