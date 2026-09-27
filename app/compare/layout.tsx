import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Compare Schools Side by Side — Fees, Boards, Admissions",
  description: "Compare up to four schools side by side: annual fees by grade, boards, ratings, transport, distance from home and admission status.",
};

export default function CompareLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Footer /></>;
}
