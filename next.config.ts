import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Canonical URLs never have a trailing slash.
  // Next.js redirects /schools/ → /schools automatically when this is false (the default),
  // but stating it explicitly prevents accidental override and keeps intent clear.
  trailingSlash: false,

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  serverExternalPackages: [],

  // Permanent redirects for protocol / www normalisation.
  // These fire before any page render so there's zero duplicate-content risk.
  async redirects() {
    return [
      // Non-www → www  (only matters when deployed without Vercel's auto-redirect)
      {
        source: "/:path*",
        has: [{ type: "host", value: "schoolfind360.com" }],
        destination: "https://www.schoolfind360.com/:path*",
        permanent: true,
      },
    ];
  },

  // Cache-Control headers — lets Googlebot and edge CDNs cache page responses
  // and issue lightweight 304 Not-Modified checks instead of full re-downloads.
  // Using stale-while-revalidate so bots always get a fast (possibly stale) response
  // while a fresh render runs in the background.
  async headers() {
    return [
      // School profiles — data can change (admissions, fees). 5-min fresh, 1-hr stale.
      {
        source: "/schools/:slug",
        headers: [
          { key: "Cache-Control", value: "public, max-age=300, stale-while-revalidate=3600" },
          { key: "Vary",          value: "Accept-Encoding" },
        ],
      },
      // City hub + area pages — changes less often. 30-min fresh, 24-hr stale.
      {
        source: "/schools/:slug/:area",
        headers: [
          { key: "Cache-Control", value: "public, max-age=1800, stale-while-revalidate=86400" },
          { key: "Vary",          value: "Accept-Encoding" },
        ],
      },
      // Top-level schools directory
      {
        source: "/schools",
        headers: [
          { key: "Cache-Control", value: "public, max-age=600, stale-while-revalidate=7200" },
          { key: "Vary",          value: "Accept-Encoding" },
        ],
      },
      // Sitemaps — fresh for 1 hr, stale for 24 hrs
      {
        source: "/:sitemap(sitemap.*\\.xml|sitemap)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=3600, stale-while-revalidate=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
