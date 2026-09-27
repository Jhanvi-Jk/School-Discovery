import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BugReportModal } from "@/components/BugReportModal";
import { Analytics } from "@vercel/analytics/next";
import { getSiteStats, formatCount, liveCityNames } from "@/lib/siteStats";
import { SITE_URL } from "@/lib/site";

const inter = Inter({ subsets: ["latin"] });

const appUrl = SITE_URL;

export async function generateMetadata(): Promise<Metadata> {
  const stats = await getSiteStats();
  const scope = stats.total > 0
    ? `${formatCount(stats.total)} schools in ${liveCityNames(stats)}`
    : "schools across India";

  return {
    metadataBase: new URL(appUrl),
    title: {
      default: "SchoolFind360 — Discover & Compare Schools Across India",
      template: "%s | SchoolFind360",
    },
    description: `Discover and compare ${scope}. Filter by curriculum, fees, area and more, with honest profile-completeness scores instead of unearned badges.`,
    keywords: [
      "schools in India", "best schools Bangalore", "CBSE schools Bangalore",
      "IB schools Bengaluru", "school admissions 2026", "school comparison India",
      "schools in Delhi", "schools in Chennai", "IGCSE schools India",
    ],
    openGraph: {
      type: "website",
      locale: "en_IN",
      siteName: "SchoolFind360",
      title: "SchoolFind360 — Discover & Compare Schools",
      description: `Browse ${scope}. Compare fees, curriculum, admissions and more.`,
      images: [{ url: "/og-preview.jpg", width: 1200, height: 630, alt: "SchoolFind360" }],
    },
    twitter: {
      card: "summary_large_image",
      title: "SchoolFind360 — Discover & Compare Schools",
      description: `Browse ${scope}. Compare fees, curriculum, and more.`,
      images: ["/og-preview.jpg"],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-snippet": -1 },
    },
  };
}

// Site-level structured data, once, on every page
const siteSchema = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "SchoolFind360",
    url: appUrl,
    logo: `${appUrl}/favicon.svg`,
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "SchoolFind360",
    url: appUrl,
    inLanguage: "en-IN",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${appUrl}/schools?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  },
];

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={inter.className}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(siteSchema) }} />
        <Providers>
          {children}
          <BugReportModal />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
