import type { Metadata } from "next";
import Link from "next/link";
import { ContentPage } from "@/components/layout/ContentPage";
import { DocumentsChecklist } from "@/components/tools/DocumentsChecklist";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "School Admission Document Checklist — What to Keep Ready",
  description: "A tick-off checklist of the documents Indian schools usually ask for at admission: birth certificate, address proof, TC, report cards, category certificates and more.",
  alternates: { canonical: `${SITE_URL}/tools/documents-checklist` },
};

export default async function DocumentsChecklistPage() {
  return (
    <ContentPage
      eyebrow="Admission tool"
      title="Admission document checklist"
      lead="Tick off what you already have. Your progress is saved on this device."
    >
      <div className="content-card">
        <DocumentsChecklist />
      </div>
      <p style={{ fontSize: 13, color: "var(--muted)" }}>
        Next: <Link href="/tools/age-calculator" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>check your child&apos;s age eligibility</Link> · <Link href="/admission-calendar" style={{ fontWeight: 600, color: "var(--brown-dark)" }}>see admission dates</Link>
      </p>
    </ContentPage>
  );
}
