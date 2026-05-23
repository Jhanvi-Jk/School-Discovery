import type { Metadata } from "next";

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

// Canonical always points to the clean URL — prevents duplicate content from
// filter params like ?board=CBSE&area=Whitefield appearing as separate pages.
export const metadata: Metadata = {
  title: "Explore Schools in Bengaluru — Filter by Area, Board & Fees",
  description:
    "Browse and compare 150+ schools in Bengaluru. Filter by CBSE, ICSE, IB, IGCSE, area, fees, gender, and more. Find the right school for your child.",
  keywords: [
    "schools in Bengaluru",
    "best CBSE schools Bangalore",
    "ICSE schools Bangalore",
    "IB schools Bengaluru",
    "school fees Bengaluru",
    "schools in Whitefield",
    "schools in Yelahanka",
    "school admission 2026",
  ],
  alternates: { canonical: `${appUrl}/schools` },
  openGraph: {
    title: "Explore Schools in Bengaluru | SchoolFinder",
    description:
      "Browse and compare 150+ verified schools in Bengaluru by curriculum, area, fees, and more.",
    url: `${appUrl}/schools`,
    type: "website",
    siteName: "SchoolFinder Bengaluru",
  },
  twitter: {
    card: "summary_large_image",
    title: "Explore Schools in Bengaluru | SchoolFinder",
    description: "Browse and compare 150+ verified schools in Bengaluru.",
  },
};

export default function SchoolsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
