import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { COMPLETENESS_CRITERIA, VERIFIED_MIN_SCORE } from "@/lib/completeness";
import { SITE_NAME, SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "How We Verify School Data",
  description: `Where ${SITE_NAME} gets school information, what the Verified badge and completeness score mean, how admission status is worked out, and how reviews are moderated.`,
  alternates: { canonical: `${SITE_URL}/how-we-verify` },
};

export default async function HowWeVerifyPage() {
  return (
    <ContentPage
      eyebrow="Methodology"
      title="How we verify school data"
      lead="School information changes every year. This page explains where ours comes from, what we check, and what we deliberately don't claim."
    >
      <div className="content-card prose">
        <h2>Where the data comes from</h2>
        <ul>
          <li>The school&apos;s own website, prospectus and admission notices.</li>
          <li>Public school directories and board affiliation listings.</li>
          <li>Corrections from parents and schools submitted through <Link href="/report">Report wrong data</Link>.</li>
          <li>Profiles that schools <Link href="/schools/claim">claim</Link> and update themselves.</li>
        </ul>
        <p>Where we cannot find a fact, the profile says so instead of guessing — you&apos;ll see &quot;Fee details coming&quot; or &quot;Dates not published&quot;, never a made-up number.</p>

        <h2>The completeness score</h2>
        <p>
          Every profile shows how much of it is filled in, out of 100. It measures <em>how much we know</em>, not how good the school is.
        </p>
        <table>
          <thead><tr><th>What we look for</th><th>Points</th></tr></thead>
          <tbody>
            {COMPLETENESS_CRITERIA.map((c) => (
              <tr key={c.key}><td>{c.label}</td><td>{c.weight}</td></tr>
            ))}
          </tbody>
        </table>

        <h2>What the &quot;Verified&quot; badge means</h2>
        <p>
          A profile gets the Verified badge only when <strong>both</strong> are true: a member of our team has checked its key facts
          against the school&apos;s official sources, <strong>and</strong> its completeness score is at least {VERIFIED_MIN_SCORE}. Every other profile
          shows its completeness score instead, so a mostly empty page never looks verified.
        </p>

        <h2>How admission status is decided</h2>
        <p>
          &quot;Admissions open&quot; comes from the dates of each admission window, not from a label someone typed once. A window whose closing date has
          passed shows as closed; one that hasn&apos;t opened yet shows as upcoming; a window with no closing date that belongs to a past academic year is treated as closed.
          When a school hasn&apos;t published dates we say &quot;Dates not published&quot;.
        </p>

        <h2>Entries we hide</h2>
        <p>
          We keep out anything that isn&apos;t a K-12 school (pre-university and junior colleges), duplicates of the same campus, and entries we couldn&apos;t confirm exist.
          Hidden entries are not deleted — they return as soon as someone confirms them.
        </p>

        <h2>Reviews</h2>
        <ul>
          <li>Every review is read by a moderator before it is published.</li>
          <li>Reviews are shown as &quot;Parent&quot; — we never publish reviewer names.</li>
          <li>A <strong>Verified parent</strong> mark means we confirmed the reviewer&apos;s link to the school. Reviews without it are still moderated but not confirmed.</li>
          <li>We remove reviews that are abusive, promotional, from school staff, or that we suspect were paid for.</li>
        </ul>

        <h2>Found a mistake?</h2>
        <p>Tell us on the <Link href="/report">report page</Link>. Corrections that come with a source (a circular, a fee sheet, the school&apos;s own page) are fastest to publish.</p>
      </div>
    </ContentPage>
  );
}
