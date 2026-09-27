// Small helpers shared by the form endpoints (contact, claims, alerts, bug reports).

const ADMIN_EMAIL = process.env.ADMIN_NOTIFY_EMAIL || "admin@legitfarms.com";

export const escapeHtml = (s: unknown) =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

/** Best-effort e-mail to the team via Resend. Never throws: the DB row is the source of truth. */
export async function notifyAdmin(subject: string, html: string): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.warn("[notify] RESEND_API_KEY not set — skipping e-mail:", subject);
    return;
  }
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "SchoolFind360 <noreply@schoolfind360.com>", to: [ADMIN_EMAIL], subject, html }),
    });
    if (!res.ok) console.error("[notify] Resend error:", res.status, await res.text());
  } catch (e) {
    console.error("[notify] Resend request failed:", e);
  }
}

/** Indian mobile numbers: optional +91/0, then 10 digits starting 6-9 */
export const INDIAN_MOBILE = /^(?:\+?91[\s-]?|0)?[6-9]\d{9}$/;

export function normalisePhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, "");
  return `+91${digits.slice(-10)}`;
}

/** Send one e-mail to a subscriber via Resend. Returns false on failure so callers can retry tomorrow. */
export async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  if (!key) return false;
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({ from: "SchoolFind360 <noreply@schoolfind360.com>", to: [to], subject, html }),
    });
    if (!res.ok) console.error("[email] Resend error:", res.status, await res.text());
    return res.ok;
  } catch (e) {
    console.error("[email] request failed:", e);
    return false;
  }
}
