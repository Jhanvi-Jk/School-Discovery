-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 025 — Wikipedia founding years for historical Bengaluru schools
-- Source: https://en.wikipedia.org/wiki/List_of_schools_in_Bengaluru
--
-- Uses ILIKE fuzzy matching so minor name variations in the DB still match.
-- Only updates rows where established_year IS NULL — never overwrites existing
-- data that was added manually with higher confidence.
-- ─────────────────────────────────────────────────────────────────────────────

UPDATE schools SET established_year = 1832
WHERE name ILIKE '%United Mission School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1854
WHERE name ILIKE '%St John%High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1855
WHERE name ILIKE '%Goodwill%Girls%School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1858
WHERE name ILIKE '%St%Joseph%Boys%High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1865
WHERE name ILIKE '%Bishop Cotton Boys%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1865
WHERE name ILIKE '%Bishop Cotton Girls%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1866
WHERE name ILIKE '%Cathedral High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1880
WHERE name ILIKE '%Baldwin Boys%High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1880
WHERE name ILIKE '%Baldwin Girls%High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1904
WHERE name ILIKE '%St%Joseph%Indian High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1913
WHERE name ILIKE '%St Anthony%Boys%School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1914
WHERE name ILIKE '%Clarence High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1917
WHERE name ILIKE '%National High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1944
WHERE name ILIKE '%St%Germain High School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

UPDATE schools SET established_year = 1946
WHERE name ILIKE '%Bangalore Military School%'
  AND city = 'Bengaluru'
  AND established_year IS NULL;

-- ── Verification query — run this after applying to confirm matches ──────────
-- SELECT name, established_year, city
-- FROM schools
-- WHERE city = 'Bengaluru'
--   AND established_year IS NOT NULL
-- ORDER BY established_year;
