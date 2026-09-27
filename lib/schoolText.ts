import { CURRICULUM_LABELS, type Curriculum } from "@/lib/types";

// Descriptions imported from directories are a mix of real prose, template
// fragments ("Grades offered: … Fee Range: …"), text cut off mid-sentence and
// one-line seed blurbs. Only prose that reads as a finished description is
// shown; everything else falls back to text built from structured fields.
const MIN_DESCRIPTION_LENGTH = 90;

// Notes our own team left in the description column while researching ("POSSIBLE
// DUPLICATE … Flagged for manual review"). They must never reach a parent.
const INTERNAL_NOTE =
  /possible duplicate|erroneous entry|flagged for|manual review|de-?duplication|research (found|suggests)|\bTODO\b|\bFIXME\b|\bNOTE:|needs? (to be )?verif/i;

// Filler produced by the original seed scripts: fragments that read as generated
// ("Balanced practical application layout parameters", "tier index tracking choice").
const MACHINE_FILLER =
  /\b(layout parameters?|tier index|tracking (data|choices?|metrics?|index)|index ranking|metrics? index|performance index|brand extension|framework metrics?|profile metrics?|layout scores?|layout framework|infrastructure tracking|campus tracking)\b/i;

// Raw database codes leaking into prose: "Offers STATE_BOARD curriculum."
const RAW_ENUM_CODE = /\b[A-Z]{2,}(?:_[A-Z]+)+\b/;

/** Team notes / raw codes / generated filler — text that must be hidden, not shown. */
export function isInternalOrMachineText(d: string | null | undefined): boolean {
  if (!d) return false;
  return INTERNAL_NOTE.test(d) || MACHINE_FILLER.test(d) || RAW_ENUM_CODE.test(d);
}

export function isUsableDescription(d: string | null | undefined): d is string {
  if (!d) return false;
  const t = d.trim();
  if (t.length < MIN_DESCRIPTION_LENGTH) return false;
  if (t.startsWith("Grades offered:") || t.includes("Fee Range:")) return false;
  if (isInternalOrMachineText(t)) return false;
  if (/(\.\.\.|…)$/.test(t)) return false;
  return /[.!?]["')\]]?$/.test(t);
}

const TYPE_ADJECTIVE: Record<string, string> = {
  private: "private",
  government: "government",
  aided: "government-aided",
  international: "international",
};

const GENDER_PHRASE: Record<string, string> = {
  coed: "co-educational",
  boys: "boys'",
  girls: "girls'",
};

const INTERNATIONAL_BOARDS: Curriculum[] = ["ib", "igcse", "cambridge"];

interface FactSheet {
  name: string;
  type?: string | null;
  gender?: string | null;
  area?: string | null;
  city?: string | null;
  establishedYear?: number | null;
  curricula: string[];
  gradeFrom?: string | null;
  gradeTo?: string | null;
}

const boardName = (c: string) => CURRICULUM_LABELS[c as Curriculum] || c.toUpperCase();

function joinList(items: string[]): string {
  if (items.length <= 1) return items.join("");
  return `${items.slice(0, -1).join(", ")} and ${items[items.length - 1]}`;
}

/** A plain factual summary assembled only from fields we actually hold. */
export function buildFactualSummary(f: FactSheet): string {
  const kind = [TYPE_ADJECTIVE[f.type ?? ""], GENDER_PHRASE[f.gender ?? ""]].filter(Boolean).join(" ");
  const where = [f.area, f.city].filter(Boolean).join(", ");
  const parts: string[] = [];

  parts.push(`${f.name} is a ${kind ? `${kind} ` : ""}school${where ? ` in ${where}` : ""}.`);

  if (f.curricula.length > 0) {
    const grades = f.gradeFrom && f.gradeTo ? ` for ${f.gradeFrom} to ${f.gradeTo}` : "";
    parts.push(`It follows the ${joinList(f.curricula.map(boardName))} curriculum${grades}.`);
  } else if (f.gradeFrom && f.gradeTo) {
    parts.push(`It offers ${f.gradeFrom} to ${f.gradeTo}.`);
  }

  if (f.establishedYear) parts.push(`The school was established in ${f.establishedYear}.`);
  return parts.join(" ");
}

interface HighlightInput {
  establishedYear?: number | null;
  curricula: string[];
  studentTeacherRatio?: number | null;
  hasTransport?: boolean | null;
  sports: string[];
  extracurriculars: string[];
  gradeMin?: number | null;
  gradeMax?: number | null;
  languages: string[];
  currentYear: number;
}

/** Facts worth calling out, each derived directly from stored data (no invented claims). */
export function buildHighlights(h: HighlightInput): string[] {
  const out: string[] = [];

  if (h.establishedYear && h.currentYear - h.establishedYear >= 50) {
    out.push(`${h.currentYear - h.establishedYear}+ year legacy — established in ${h.establishedYear}`);
  }

  const intl = h.curricula.filter((c) => INTERNATIONAL_BOARDS.includes(c as Curriculum));
  if (intl.length > 0) out.push(`Offers international curriculum: ${joinList(intl.map(boardName))}`);
  if (h.curricula.length > 1 && intl.length === 0) out.push(`Multiple boards available: ${joinList(h.curricula.map(boardName))}`);

  if (h.studentTeacherRatio && h.studentTeacherRatio <= 20) {
    out.push(`Small classes — ${h.studentTeacherRatio}:1 student-to-teacher ratio`);
  }

  if (h.gradeMin != null && h.gradeMax != null && h.gradeMin <= -1 && h.gradeMax >= 12) {
    out.push("Continuous schooling from pre-primary through Class 12");
  }

  if (h.sports.length >= 5) out.push(`${h.sports.length} sports on offer, including ${joinList(h.sports.slice(0, 3))}`);
  if (h.extracurriculars.length >= 5) {
    out.push(`${h.extracurriculars.length} clubs and activities, including ${joinList(h.extracurriculars.slice(0, 3))}`);
  }

  if (h.hasTransport) out.push("School transport available");
  if (h.languages.length >= 3) out.push(`Languages offered: ${joinList(h.languages.slice(0, 4))}`);

  return out;
}
