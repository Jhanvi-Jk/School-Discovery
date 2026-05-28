import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

// Canonical always points to the clean URL — prevents duplicate content from
// filter params like ?board=CBSE&area=Whitefield appearing as separate pages.
export const metadata: Metadata = {
  title: "Explore Schools Across India — Filter by City, Board, Area & Fees",
  description:
    "Discover and compare 500+ verified schools in Bengaluru, Delhi, Chennai, Mumbai and more. Filter by CBSE, ICSE, IB, IGCSE, area, fees, gender, and more. Find the right school for your child.",
  keywords: [
    "schools in India", "best schools Bangalore", "schools in Delhi",
    "schools in Chennai", "schools in Mumbai", "CBSE schools India", "IB schools India",
    "school fees comparison", "school admission 2026",
  ],
  alternates: { canonical: `${appUrl}/schools` },
  openGraph: {
    title: "Explore Schools Across India | SchoolFind360",
    description:
      "Browse 400+ verified schools in Bengaluru, Delhi & Chennai. Compare fees, curriculum, admissions and more.",
    url: `${appUrl}/schools`,
    type: "website",
    siteName: "SchoolFind360",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Schools Across India | SchoolFind360",
    description: "Browse 400+ verified schools in Bengaluru, Delhi & Chennai.",
  },
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
