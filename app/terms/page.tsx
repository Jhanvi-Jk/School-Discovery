import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { LEGAL_LAST_UPDATED, SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `The terms that apply when you use ${SITE_NAME} to search, compare and review schools.`,
  alternates: { canonical: `${SITE_URL}/terms` },
};

export default async function TermsPage() {
  return (
    <ContentPage
      eyebrow="Legal"
      title="Terms of Use"
      lead={`The rules for using ${SITE_NAME}. Last updated ${LEGAL_LAST_UPDATED}.`}
    >
      <div className="content-card prose">
        <p>
          By using {SITE_NAME} you agree to these terms. If you do not agree, please do not use the site.
        </p>

        <h2>1. What the site is</h2>
        <p>
          {SITE_NAME} is an information service that helps parents discover and compare schools. We are not a school, an
          admissions office or an agent of any school. Admission decisions, fees and seats are decided only by the schools.
        </p>

        <h2>2. Accuracy of information</h2>
        <p>
          School details (fees, admission dates, facilities, board results) are compiled from school websites, public
          directories and parent input, and change often. We show how complete each profile is and where data is missing, but
          we cannot guarantee that everything is current. <strong>Confirm fees, dates and eligibility with the school before you
          apply or pay anything.</strong> See <Link href="/how-we-verify">how we verify data</Link>. Found a mistake?{" "}
          <Link href="/report">Report it</Link>.
        </p>

        <h2>3. Your account</h2>
        <p>You are responsible for the activity on your account and for keeping your sign-in details safe. Give accurate information and do not impersonate anyone.</p>

        <h2>4. Reviews and content you submit</h2>
        <ul>
          <li>Write only about your own genuine experience of the school, honestly and without abuse, hate speech, personal attacks on named individuals, or confidential information about children.</li>
          <li>Do not post reviews for a school you work for, own, or compete with, and do not offer or accept payment for reviews.</li>
          <li>Reviews are moderated before publication. We may edit for length or remove reviews that break these rules, and we may show a &quot;Verified parent&quot; mark once we have confirmed the reviewer&apos;s link to the school.</li>
          <li>You keep ownership of what you write and give us a non-exclusive, royalty-free licence to publish it on the site. You can ask us to remove it at any time.</li>
        </ul>

        <h2>5. Enquiries and alerts</h2>
        <p>
          When you send an enquiry or campus-visit request, we pass the details you enter to that school. When you subscribe to alerts
          we only send the alerts you selected, and every message carries an unsubscribe option. See our <Link href="/privacy">Privacy Policy</Link>.
        </p>

        <h2>6. Acceptable use</h2>
        <p>Do not scrape the site at scale, attempt to break or overload it, submit spam, or use it to send unsolicited marketing to schools or parents.</p>

        <h2>7. School profiles</h2>
        <p>
          Schools can <Link href="/schools/claim">claim their profile</Link> to correct and update it. Claims are checked against an official school
          contact before access is given. Claiming a profile does not change how reviews are moderated and does not buy a better ranking.
        </p>

        <h2>8. Liability</h2>
        <p>
          The site is provided &quot;as is&quot;. To the extent the law allows, {SITE_NAME} is not liable for decisions made using the
          information on the site, for the conduct of schools, or for losses arising from inaccurate or outdated listings. Nothing in these terms limits liability that cannot be limited by law.
        </p>

        <h2>9. Changes and governing law</h2>
        <p>We may update these terms and will change the date above when we do. These terms are governed by the laws of India, subject to any mandatory consumer rights you have.</p>

        <div className="note">
          Questions about these terms? <Link href="/contact">Contact us</Link>.
        </div>
      </div>
    </ContentPage>
  );
}
