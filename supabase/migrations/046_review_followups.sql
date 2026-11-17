-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 046 — follow-ups from the Nov 2026 site review. Requires 045.
--
--  1. Unsourced one-sentence marketing blurbs ("Iconic heritage school with unparalleled
--     infrastructure…") are cleared; the site shows a factual summary instead.
--     (lib/schoolText.ts isUnsourcedBlurb applies the same rule at render time.)
--  2. St. Germain Academy's ₹3,15,000 flat fee is withheld: it is ~2.6x its Frazer Town
--     ICSE peer (Clarence High, ₹80K–1.2L) and in line only with international schools,
--     and there is no source on record. Shows "Fees N/A" until a verified figure is added.
--  3. Chrysalis Kids (a Montessori pre-school, per its own description) is unlisted,
--     the same policy 045 applies to PU colleges, instead of mixing it in with K-12 schools.
--
-- Everything is reversible; the old values are kept in schools.listing_note.
-- ─────────────────────────────────────────────────────────────────────────────

-- ══ 1. Unsourced blurbs ══════════════════════════════════════════════════════
-- One sentence, at most 170 characters, and nothing a parent could verify
-- (no board, year, group, campus, road or grade).
UPDATE schools SET
  listing_note = concat_ws(E'\n', listing_note, 'Cleared unsourced blurb: ' || description),
  description  = NULL
WHERE description IS NOT NULL
  AND length(btrim(description)) <= 170
  AND btrim(description) !~ '[.!?]\s+\S'                -- a single sentence
  AND description !~* '(CBSE|ICSE|\mISC\M|CISCE|\mIB\M|IGCSE|Cambridge|State Board|NIOS|Montessori|founded|established|affiliat|run by|managed by|part of|campus|road|nagar|layout|[0-9]{4}|\mclass(es)?\M|\mgrades?\M|nursery)';

-- ══ 2. Withhold the unverified St. Germain Academy fee ═══════════════════════
UPDATE schools SET
  listing_note = concat_ws(E'\n', listing_note,
    'Fee withheld 2026-11: ₹3,15,000 flat was an outlier vs Frazer Town ICSE peers with no source. Restore with the verified figure.')
WHERE slug = 'st-germain-academy-frazer-town';

UPDATE school_details SET total_fees_min = NULL, total_fees_max = NULL,
                          annual_tuition_fees_min = NULL, annual_tuition_fees_max = NULL
WHERE school_id = (SELECT id FROM schools WHERE slug = 'st-germain-academy-frazer-town')
  AND total_fees_min = 315000 AND total_fees_max = 315000;

-- ══ 3. Chrysalis Kids is a pre-school, not a K-12 school ═════════════════════
-- Same policy 045 applies to PU colleges. A grade row can't be added instead:
-- school_grades.curriculum is a NOT NULL curriculum_type enum with no
-- Montessori / pre-school value, and inventing a board would be wrong.
UPDATE schools SET
  is_listed = FALSE,
  listing_note = concat_ws(E'\n', listing_note,
    'Montessori pre-school / daycare (Pre-School to Sr. KG, per chrysaliskids.com) — not a K-12 school.')
WHERE slug = 'chrysalis-kids-varthur';

-- Refresh cached listings/counts on the next request
NOTIFY pgrst, 'reload schema';
