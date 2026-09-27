import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { CONTACT_EMAIL, GRIEVANCE_OFFICER, LEGAL_LAST_UPDATED, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${SITE_NAME} collects, uses and protects personal data under India's Digital Personal Data Protection Act, 2023 — and how you can exercise your rights.`,
  alternates: { canonical: `${SITE_URL}/privacy` },
};

export default async function PrivacyPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Privacy Policy"
      lead={`How ${SITE_NAME} handles your personal data. Last updated ${LEGAL_LAST_UPDATED}.`}
    >
      <div className="content-card prose">
        <p>
          {SITE_NAME} (&quot;we&quot;, &quot;us&quot;) helps families in India find and compare schools. We act as the
          <strong> Data Fiduciary</strong> for the personal data described below, under the Digital Personal Data
          Protection Act, 2023 (&quot;DPDP Act&quot;). We collect only what each feature needs, we ask for your consent before
          we use it, and you can withdraw that consent at any time.
        </p>

        <h2>1. What we collect, and why</h2>
        <table>
          <thead><tr><th>Feature</th><th>Data</th><th>Purpose</th></tr></thead>
          <tbody>
            <tr><td>Browsing schools</td><td>None that identifies you. Filters, shortlist and compare lists are stored in your own browser.</td><td>Remember your choices between visits.</td></tr>
            <tr><td>Sign-in / account</td><td>Name, email address, sign-in method (email or Google).</td><td>Create and secure your account; save shortlists.</td></tr>
            <tr><td>Reviews</td><td>Your account identity, relationship to the school, ratings and review text.</td><td>Publish reviews after moderation. Your name is never shown publicly — reviews appear as &quot;Parent&quot;.</td></tr>
            <tr><td>Enquiries &amp; campus-visit requests</td><td>Name, email, phone (optional), grade sought, preferred visit date, your message.</td><td>Pass your enquiry to the school you chose so they can respond.</td></tr>
            <tr><td>Admission alerts</td><td>Email and/or WhatsApp number, the school or city and grade you want alerts for.</td><td>Send admission-window reminders you asked for. Nothing else.</td></tr>
            <tr><td>Claim your profile</td><td>Your name, role, official email and phone.</td><td>Verify that you represent the school.</td></tr>
            <tr><td>Contact form &amp; data reports</td><td>Name, email, message.</td><td>Reply to you and correct listing errors.</td></tr>
            <tr><td>Site analytics</td><td>Page views and device type through Vercel Web Analytics (no advertising cookies, no cross-site tracking).</td><td>Understand which pages are useful and fix performance problems.</td></tr>
          </tbody>
        </table>

        <h2>2. Cookies and local storage</h2>
        <p>
          We use strictly necessary cookies set by our authentication provider (Supabase) to keep you signed in, and browser
          storage for your filters, city, shortlist and compare list. We do not use advertising or cross-site tracking cookies.
        </p>

        <h2>3. Who receives your data</h2>
        <ul>
          <li><strong>The school you enquire with</strong> — only the enquiry details you submit.</li>
          <li><strong>Service providers</strong> that process data for us: Supabase (database and authentication), Vercel (hosting and analytics), and Google (only if you choose &quot;Sign in with Google&quot;). They act on our instructions.</li>
          <li><strong>Authorities</strong> where the law requires it.</li>
        </ul>
        <p>We do not sell personal data and we do not share it with advertisers.</p>

        <h2>4. Children</h2>
        <p>
          {SITE_NAME} is for parents and guardians. We do not knowingly collect personal data of children under 18 and we do
          not track or profile children. Enquiries ask only for the grade a child is applying to, not the child&apos;s name or date
          of birth. If you believe a child&apos;s data reached us, tell us and we will delete it.
        </p>

        <h2>5. How long we keep it</h2>
        <ul>
          <li>Account data: until you delete your account.</li>
          <li>Enquiries: up to 12 months, then deleted.</li>
          <li>Admission alerts: until you unsubscribe, then deleted within 30 days.</li>
          <li>Reviews you write: kept while the review is published; deleted on request.</li>
          <li>Contact messages and data reports: up to 24 months.</li>
        </ul>

        <h2>6. Your rights under the DPDP Act</h2>
        <p>You can, at any time:</p>
        <ul>
          <li>ask for a summary of the personal data we hold about you and who it was shared with;</li>
          <li>ask us to correct or complete it;</li>
          <li>ask us to erase it;</li>
          <li>withdraw consent (withdrawal is as easy as giving it — for alerts, use the unsubscribe link);</li>
          <li>nominate another person to exercise these rights if you die or become incapacitated;</li>
          <li>complain to us first, and then to the Data Protection Board of India if we don&apos;t resolve it.</li>
        </ul>

        <h2>7. Security and breaches</h2>
        <p>
          Data is encrypted in transit (HTTPS) and access to the database is restricted by row-level security. If a personal
          data breach affects you we will tell you and the Data Protection Board as the DPDP Act requires.
        </p>

        <h2>8. Grievance redressal</h2>
        <p>
          {GRIEVANCE_OFFICER ? <>Grievance Officer: <strong>{GRIEVANCE_OFFICER}</strong>. </> : null}
          To exercise any right above or raise a concern, use our <Link href="/contact?topic=privacy">contact form</Link> and select
          &quot;Privacy request&quot;
          {CONTACT_EMAIL ? <>, or write to <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></> : null}.
          We acknowledge requests within 72 hours and aim to resolve them within 30 days.
        </p>

        <h2>9. Changes</h2>
        <p>We will update this page when our practices change and revise the date at the top. Material changes will be flagged on the site.</p>

        <div className="note">
          This policy describes our current practices in plain language. It is not a substitute for legal advice.
        </div>
      </div>
    </ContentPage>
  );
}
