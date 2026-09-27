import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { ClaimForm } from "@/components/forms/ClaimForm";
import { createClient } from "@/lib/supabase/server";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Claim Your School Profile",
  description: "Schools can claim their SchoolFind360 profile to correct details, add photos, fees by grade and board results, and receive parent enquiries.",
  alternates: { canonical: `${SITE_URL}/schools/claim` },
};

export default async function ClaimPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  return (
    <ContentPage
      eyebrow="For schools"
      title="Claim your school's profile"
      lead="Correct your details, add photos, publish fees by grade and board results, and receive enquiries and campus-visit requests from parents."
    >
      <div className="content-card">
        {user ? (
          <ClaimForm defaultEmail={user.email ?? ""} defaultName={(user.user_metadata?.full_name as string) ?? ""} />
        ) : (
          <div style={{ textAlign: "center", padding: "20px 0" }}>
            <p style={{ fontSize: 15, color: "var(--dark)", marginBottom: 14 }}>Sign in with your work email so we can link the claim to your account.</p>
            <Link className="btn-primary" href="/login?next=/schools/claim">Sign in to continue</Link>
            <p style={{ fontSize: 13, color: "var(--muted)", marginTop: 14 }}>
              New here? <Link href="/register?next=/schools/claim" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>Create an account</Link>
            </p>
          </div>
        )}
      </div>
      <div className="content-card prose">
        <h2>How claiming works</h2>
        <ol>
          <li>Tell us which school you represent and how to reach the school officially.</li>
          <li>We check the request against the school&apos;s public contact details — we may call or email the school.</li>
          <li>Once approved, your account can manage the profile from the <Link href="/manage/profile">School Portal</Link>.</li>
        </ol>
        <p>Claiming doesn&apos;t change how reviews are moderated, and it doesn&apos;t buy a better ranking.</p>
      </div>
    </ContentPage>
  );
}
