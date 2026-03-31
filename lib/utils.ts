import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatFees(amount: number | null): string {
  if (!amount) return "N/A";
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)}L`;
  if (amount >= 1000) return `₹${(amount / 1000).toFixed(0)}K`;
  return `₹${amount}`;
}

export function formatFeesRange(min: number | null, max: number | null): string {
  if (!min && !max) return "Fees N/A";
  if (!max || min === max) return formatFees(min);
  return `${formatFees(min)} – ${formatFees(max)}`;
}

export function formatRating(rating: number | null): string {
  if (!rating) return "–";
  return rating.toFixed(1);
}

export function getRatingColor(rating: number | null): string {
  if (!rating) return "text-gray-400";
  if (rating >= 4.5) return "text-green-600";
  if (rating >= 4.0) return "text-green-500";
  if (rating >= 3.5) return "text-yellow-500";
  if (rating >= 3.0) return "text-orange-500";
  return "text-red-500";
}

export function formatSchoolHours(start: string | null, end: string | null): string {
  if (!start || !end) return "Hours N/A";
  const fmt = (t: string) => {
    const [h, m] = t.split(":");
    const hour = parseInt(h);
    const ampm = hour >= 12 ? "PM" : "AM";
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${m} ${ampm}`;
  };
  return `${fmt(start)} – ${fmt(end)}`;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getVerificationBadge(verified: boolean): {
  label: string;
  color: string;
} {
  return verified
    ? { label: "Verified", color: "bg-green-100 text-green-700" }
    : { label: "Unverified", color: "bg-gray-100 text-gray-500" };
}
