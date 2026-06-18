import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { BugReportModal } from "@/components/BugReportModal";
import { Analytics } from "@vercel/analytics/next";

const inter = Inter({ subsets: ["latin"] });

const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "SchoolFind360 — Discover & Compare Schools Across India",
    template: "%s | SchoolFind360",
  },
  description:
    "Discover, compare, and apply to the best schools in Bengaluru, Delhi, Chennai and across India. Filter by curriculum, fees, area, sports, and more. Verified school profiles.",
  keywords: [
    "schools in India", "best schools Bangalore", "CBSE schools Bangalore",
    "IB schools Bengaluru", "school admissions 2026", "school comparison India",
    "schools in Delhi", "schools in Chennai", "IGCSE schools India",
  ],
  alternates: {
    canonical: appUrl,
    languages: { "en-IN": appUrl },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: appUrl,
    siteName: "SchoolFind360",
    title: "SchoolFind360 — Discover & Compare Schools",
    description: "Browse 150+ verified schools in Bengaluru. Compare fees, curriculum, admissions and more.",
    images: [{ url: "/og-preview.jpg", width: 1200, height: 630, alt: "SchoolFind360" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "SchoolFind360 — Discover & Compare Schools",
    description: "Browse 150+ verified schools in Bengaluru. Compare fees, curriculum, and more.",
    images: ["/og-preview.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <BugReportModal />
        </Providers>
        <Analytics />
      </body>
    </html>
  );
}
