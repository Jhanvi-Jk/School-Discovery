import type { Metadata } from "next";
import { Footer } from "@/components/layout/Footer";

export const metadata: Metadata = {
  title: "Your Shortlist",
  robots: { index: false, follow: true },
};

export default function ShortlistLayout({ children }: { children: React.ReactNode }) {
  return <>{children}<Footer /></>;
}
