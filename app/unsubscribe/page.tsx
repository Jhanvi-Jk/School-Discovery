import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { ContentPage } from "@/components/layout/ContentPage";
import { createAdminClient } from "@/lib/supabase/server";

export const metadata: Metadata = { title: "Unsubscribe from alerts", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

async function unsubscribe(formData: FormData) {
  "use server";
  const token = String(formData.get("token") ?? "");
  if (UUID.test(token)) {
    const admin: any = await createAdminClient();
    await admin.from("admission_alert_subscriptions").update({ unsubscribed_at: new Date().toISOString() }).eq("unsubscribe_token", token);
  }
  redirect("/unsubscribe?done=1");
}

// A confirm button (not an automatic GET) so mail scanners that pre-fetch links can't unsubscribe people by accident.
export default async function UnsubscribePage({ searchParams }: { searchParams: Promise<{ token?: string; done?: string }> }) {
  const { token = "", done } = await searchParams;
  const valid = UUID.test(token);
  return (
    <ContentPage eyebrow="Alerts" title="Unsubscribe from admission alerts">
      <div className="content-card">
        {done ? (
          <p style={{ fontSize: 14 }}>You&apos;ve been unsubscribed. We won&apos;t send any more admission alerts to you.</p>
        ) : !valid ? (
          <p style={{ fontSize: 14 }}>This unsubscribe link isn&apos;t valid. Use the link in your latest alert email, or contact us and we&apos;ll remove you.</p>
        ) : (
          <form action={unsubscribe}>
            <input type="hidden" name="token" value={token} />
            <p style={{ fontSize: 14, marginBottom: 14 }}>Stop sending me admission alerts. Your contact details are removed from our alert list.</p>
            <button className="btn-primary" type="submit">Confirm unsubscribe</button>
          </form>
        )}
      </div>
    </ContentPage>
  );
}
