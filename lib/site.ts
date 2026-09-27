// Site-wide constants for legal/contact copy. Set the env vars in Vercel; when they're
// missing the pages fall back to the contact form rather than showing an invented address.
export const SITE_NAME = "SchoolFind360";
export const SITE_URL = process.env.NEXT_PUBLIC_APP_URL || "https://www.schoolfind360.com";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_EMAIL || "";
export const GRIEVANCE_OFFICER = process.env.NEXT_PUBLIC_GRIEVANCE_OFFICER || "";
export const LEGAL_LAST_UPDATED = "25 September 2026";
