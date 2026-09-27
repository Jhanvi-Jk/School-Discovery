import type { Metadata } from "next";
import { ContentPage } from "@/components/layout/ContentPage";
import { QuizClient } from "@/components/quiz/QuizClient";
import { getSiteStats } from "@/lib/siteStats";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Get Matched — Find Schools That Fit Your Child in 5 Questions",
  description: "Answer five quick questions about city, grade, board, budget and must-haves and get a shortlist of matching schools with fees and admission status.",
  alternates: { canonical: `${SITE_URL}/quiz` },
};

export default async function QuizPage() {
  const stats = await getSiteStats();
  const cities = (stats.liveCities.length ? stats.liveCities : stats.cities).map((c) => ({ dbName: c.dbName, label: c.label, key: c.key }));
  return (
    <ContentPage eyebrow="Get matched" title="Five questions, a shortlist" lead="Tell us what matters and we'll show schools that fit — then you can refine in the explorer.">
      <div className="content-card">
        <QuizClient cities={cities} />
      </div>
    </ContentPage>
  );
}
