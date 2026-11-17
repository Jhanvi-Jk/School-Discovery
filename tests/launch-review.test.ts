// Regression tests for the issues raised in the Nov 2026 site review. Each case uses the
// exact text / figures that were visible on the live site.
import { describe, expect, it } from "vitest";
import { cleanDescription, isSeedTemplate, isUsableDescription } from "@/lib/schoolText";
import { formatFeesRange } from "@/lib/utils";
import { gradeRangeLabel, gradeIndex, curriculumLabel, humaniseEnums } from "@/lib/schools/core";
import { resolveAdmissionState, summarizeAdmissions, admissionLabel } from "@/lib/admissions";

describe("descriptions shown to parents", () => {
  it.each([
    // internal QA notes
    `POSSIBLE DUPLICATE/ERRONEOUS ENTRY: research found no separate "Clarence PU College" — Clarence High School (Richards Town, CISCE) runs through Class XII. Flagged for manual review.`,
    `POSSIBLE DUPLICATE: research suggests this may be the same campus as "Chrysalis High Marathahalli" (Gunjur, Marathahalli-Sarjapur Road). Flagged for manual review/de-duplication.`,
    // raw enum leak
    "Veda Vidya Mandir ORR is a private co-educational school, located in Outer Ring Road, Bengaluru. Offers STATE_BOARD curriculum.",
    // generated filler
    "Balanced practical application layout parameters.",
    "Well-located urban international blend profiles.",
    "Clean legacy campus tracking; high localised scores.",
    // unsourced one-line puffery that is long enough to pass the length rule
    "Iconic heritage school with unparalleled infrastructure and rich history in molding leaders.",
    "Top-tier academic record nationwide, strict discipline, highly structured competitive exam coaching.",
    "Exceptional scholastic records, highly stable faculty baseline, rich heritage music culture.",
  ])("hides %s", (d) => {
    expect(isUsableDescription(d)).toBe(false);
  });

  it.each([
    "CISCE (ICSE) co-ed day school on Marathahalli-Sarjapur Road, offering Nursery to Class XII. The school runs a single campus.",
    "CBSE campus of the Chrysalis High network, spread across ~4 acres with a Semi-Olympic swimming pool, futsal ground, and basketball court.",
    "Candor International School is a private co-educational school established in 2007, located in HAL, Bengaluru. Offers IB and IGCSE curriculum from Grade 1 to Grade 12.",
  ])("keeps factual text %s", (d) => {
    expect(isUsableDescription(d)).toBe(true);
  });

  it("recognises the seeded one-line template so cards don't repeat their own badges", () => {
    expect(isSeedTemplate("Amrita Vidyalayam Kolathur is a private co-educational school established in 2001, located in Kolathur, Chennai. Offers CBSE curriculum from Nursery to Class 12.")).toBe(true);
    expect(isSeedTemplate("CBSE campus of the Chrysalis High network, spread across ~4 acres.")).toBe(false);
  });

  it("repairs a leaked board code instead of discarding a real description", () => {
    expect(cleanDescription("St. Joseph Patchappas Higher Secondary School is a private boys school established in 1887, located in Triplicane, Chennai. Offers STATE_BOARD curriculum from Class 1 to Class 12."))
      .toBe("St. Joseph Patchappas Higher Secondary School is a private boys school established in 1887, located in Triplicane, Chennai. Offers State Board curriculum from Class 1 to Class 12.");
    expect(cleanDescription("Balanced practical application layout parameters.")).toBeNull();
  });

  it("formats board codes for display", () => {
    expect(curriculumLabel("state_board")).toBe("State Board");
    expect(humaniseEnums("Offers STATE_BOARD curriculum")).toBe("Offers State Board curriculum");
  });
});

describe("fees", () => {
  it("collapses a range whose ends round to the same figure (KLE Society: 107,000–115,000)", () => {
    expect(formatFeesRange(107000, 115000)).toBe("₹1.1L");
  });
  it("collapses an identical range", () => {
    expect(formatFeesRange(110000, 110000)).toBe("₹1.1L");
  });
  it("keeps a real range", () => {
    expect(formatFeesRange(130000, 210000)).toBe("₹1.3L – ₹2.1L");
  });
});

describe("grade-range badge", () => {
  const r = (a: string, b: string): [number, number] => [gradeIndex(a)!, gradeIndex(b)!];
  it("labels a K-12 school", () => expect(gradeRangeLabel([r("Nursery", "Class 12")])).toBe("Nursery–Class 12"));
  it("flags a standalone PU college", () => expect(gradeRangeLabel([r("Class 11", "Class 12")])).toBe("Class 11–12 only"));
  it("flags a pre-school", () => expect(gradeRangeLabel([r("Playgroup", "UKG")])).toBe("Pre-school only"));
  it("merges several ranges", () => expect(gradeRangeLabel([r("Nursery", "Class 5"), r("Class 6", "Class 10")])).toBe("Nursery–Class 10"));
  it("returns null without data", () => expect(gradeRangeLabel([])).toBeNull());
});

describe("admissions (today = 17 Nov 2026)", () => {
  const today = "2026-11-17";
  const past = { academic_year: "2025-26", status: "upcoming", opens_at: "2025-03-01", closes_at: "2025-06-15" };

  it("a 2025-26 window that ended in June 2025 is closed, not 'Upcoming'", () => {
    expect(resolveAdmissionState(past, today)).toBe("closed");
  });
  it("a stale 'open' status can't produce an 'Admissions open 2026-27' badge", () => {
    const s = summarizeAdmissions([{ ...past, status: "open" }], today);
    expect(s.state).toBe("closed");
    expect(admissionLabel(s)).toBe("Closed for 2025–26");
  });
  it("a window that is actually running is open", () => {
    const s = summarizeAdmissions([{ academic_year: "2027-28", status: "upcoming", opens_at: "2026-11-01", closes_at: "2027-01-31" }], today);
    expect(admissionLabel(s)).toBe("Admissions open 2027–28");
  });
});
