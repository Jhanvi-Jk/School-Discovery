import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { formatCount, getSiteStats, liveCityNames } from "@/lib/siteStats";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "About SchoolFind360",
  description: `${SITE_NAME} helps families in India compare schools on fees, boards, admissions and location — with honest completeness scores instead of unearned badges.`,
  alternates: { canonical: `${SITE_URL}/about` },
};

export default async function AboutPage() {
  const stats = await getSiteStats();
  return (
    <ContentPage
      eyebrow="About"
      title="Finding the right school shouldn't take a hundred browser tabs"
      lead={`${SITE_NAME} puts fees, boards, admission dates and location for schools across India in one comparable place.`}
    >
      <div className="content-card prose">
        <h2>What we do</h2>
        <p>
          {stats.total > 0
            ? <>Today we list <strong>{formatCount(stats.total)} schools</strong> in {liveCityNames(stats)}. </>
            : null}
          You can filter by board, area, fees and facilities, see schools on a map, shortlist them and compare them side by side.
          Then you can enquire or book a campus visit straight from the school&apos;s page.
        </p>

        <h2>What we believe</h2>
        <ul>
          <li><strong>Say what we don&apos;t know.</strong> Missing information is shown as missing, and every profile carries a completeness score.</li>
          <li><strong>Dates decide, labels don&apos;t.</strong> Admission status is worked out from real window dates.</li>
          <li><strong>Parents first.</strong> Reviews are moderated, unpaid and anonymous to the public. Schools can&apos;t buy ranking.</li>
        </ul>
        <p>Read the details in <Link href="/how-we-verify">how we verify data</Link>.</p>

        <h2>For schools</h2>
        <p>
          <Link href="/schools/claim">Claim your profile</Link> to correct your details, add photos, fees by grade and board results.
          Claiming doesn&apos;t change how parent reviews are moderated.
        </p>

        <h2>Get in touch</h2>
        <p>Feedback, corrections and partnership ideas are welcome — <Link href="/contact">contact us</Link>.</p>
      </div>
    </ContentPage>
  );
}
