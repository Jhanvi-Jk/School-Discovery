import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { ReportForm } from "@/components/forms/ReportForm";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Report Wrong or Outdated School Data",
  description: "Spotted a wrong fee, admission date, phone number or a school that no longer exists? Tell us and we'll check it against official sources.",
  alternates: { canonical: `${SITE_URL}/report` },
  robots: { index: false, follow: true },
};

export default async function ReportPage({ searchParams }: { searchParams: Promise<{ school?: string; slug?: string }> }) {
  const { school, slug } = await searchParams;
  return (
    <ContentPage
      eyebrow="Help us get it right"
      title="Report wrong or outdated data"
      lead="Parents and schools spot mistakes faster than we can. Every report is checked against the school's official sources before we change anything."
    >
      <div className="content-card">
        <ReportForm schoolName={school?.slice(0, 160)} schoolSlug={slug?.slice(0, 160)} />
      </div>
    </ContentPage>
  );
}
