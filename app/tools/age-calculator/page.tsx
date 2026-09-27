import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { AgeCalculator } from "@/components/tools/AgeCalculator";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "School Admission Age Cut-off Calculator — Nursery to Class 3",
  description: "Enter your child's date of birth and the school's cut-off date to see which class they're eligible for under NEP 2020 minimum ages.",
  alternates: { canonical: `${SITE_URL}/tools/age-calculator` },
};

export default async function AgeCalculatorPage() {
  return (
    <ContentPage
      eyebrow="Admission tool"
      title="Age cut-off calculator"
      lead="Which class can your child join? Enter their date of birth and the date the school counts age on."
    >
      <div className="content-card">
        <AgeCalculator />
      </div>
      <div className="content-card prose">
        <h2>Check the cut-off with the school</h2>
        <p>
          The NEP 2020 minimum ages above are national guidance. Each state, board and school chooses its own <strong>cut-off date</strong> (for example 31 July, 1 June or 31 March) and some
          apply their own minimum ages. Look for the cut-off in the school&apos;s admission notice, then enter it above.
        </p>
        <p>Ready to shortlist? <Link href="/schools">Browse schools</Link> or read <Link href="/tools/documents-checklist">what documents to keep ready</Link>.</p>
      </div>
    </ContentPage>
  );
}
