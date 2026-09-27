import { isUsableDescription } from "@/lib/schoolText";

// A "Verified" badge on a mostly empty profile hurts trust, so the badge is earned by
// a complete profile and everything else shows an honest completeness score.
// Every input below exists both on the schools_with_details view (listing cards) and on
// the profile page's school + school_details rows, so a school gets the same score everywhere.

export interface CompletenessInput {
  description?: string | null;
  cover_image_url?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  latitude?: number | string | null;
  longitude?: number | string | null;
  total_fees_min?: number | null;
  annual_tuition_fees_min?: number | null;
  student_teacher_ratio?: number | null;
  student_count?: number | null;
  school_hours_start?: string | null;
  curricula?: string[] | null;
  established_year?: number | null;
  has_transport?: boolean | null;
  review_count?: number | null;
}

interface Criterion {
  key: string;
  label: string;
  weight: number;
  met: (s: CompletenessInput) => boolean;
}

const hasCoords = (s: CompletenessInput) => {
  const lat = Number(s.latitude), lng = Number(s.longitude);
  return s.latitude != null && s.longitude != null && Number.isFinite(lat) && Number.isFinite(lng) && !(lat === 0 && lng === 0);
};

export const COMPLETENESS_CRITERIA: Criterion[] = [
  { key: "photos",      label: "Photos",                 weight: 15, met: (s) => !!s.cover_image_url },
  { key: "contact",     label: "Phone or email",         weight: 15, met: (s) => !!(s.phone || s.email) },
  { key: "fees",        label: "Annual fees",            weight: 15, met: (s) => !!s.total_fees_min },
  { key: "description", label: "School description",     weight: 10, met: (s) => isUsableDescription(s.description) },
  { key: "location",    label: "Map location",           weight: 10, met: hasCoords },
  { key: "boards",      label: "Board / curriculum",     weight: 10, met: (s) => (s.curricula?.length ?? 0) > 0 },
  { key: "website",     label: "Official website",       weight: 5,  met: (s) => !!s.website },
  { key: "feeDetail",   label: "Fee breakdown",          weight: 5,  met: (s) => !!s.annual_tuition_fees_min },
  { key: "classSize",   label: "Class size / strength",  weight: 5,  met: (s) => !!(s.student_teacher_ratio || s.student_count) },
  { key: "hours",       label: "School hours",           weight: 3,  met: (s) => !!s.school_hours_start },
  { key: "reviews",     label: "Parent reviews",         weight: 3,  met: (s) => (s.review_count ?? 0) > 0 },
  { key: "established", label: "Year founded",           weight: 2,  met: (s) => !!s.established_year },
  { key: "transport",   label: "Transport information",  weight: 2,  met: (s) => s.has_transport != null },
];

/** A profile needs at least this score before it can carry the Verified badge. */
export const VERIFIED_MIN_SCORE = 70;

export interface Completeness {
  score: number;
  missing: string[];
  /** True only when the team verified it AND the profile is filled in */
  showVerified: boolean;
}

export function profileCompleteness(s: CompletenessInput, verified: boolean | null | undefined): Completeness {
  let score = 0;
  const missing: string[] = [];
  for (const c of COMPLETENESS_CRITERIA) {
    if (c.met(s)) score += c.weight;
    else missing.push(c.label);
  }
  return { score, missing, showVerified: !!verified && score >= VERIFIED_MIN_SCORE };
}
