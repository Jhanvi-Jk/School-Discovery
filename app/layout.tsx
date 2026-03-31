import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SchoolFinder Bengaluru — Discover & Compare Schools",
    template: "%s | SchoolFinder Bengaluru",
  },
  description:
    "Discover, compare, and apply to the best schools in Bengaluru. Filter by curriculum, fees, area, sports, and more. Verified school profiles.",
  keywords: ["schools in Bengaluru", "CBSE schools", "IB schools", "school admissions", "school comparison"],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "SchoolFinder Bengaluru",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
