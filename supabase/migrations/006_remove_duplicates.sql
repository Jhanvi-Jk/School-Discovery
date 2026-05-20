-- ================================================================
-- 006_remove_duplicates.sql
-- Removes duplicate schools (same name + area), keeping the record
-- that has the most data (description, fees, etc.)
-- Run in Supabase SQL Editor.
-- ================================================================

-- Preview what will be deleted (run this SELECT first to verify)
-- SELECT s.slug, s.name, s.area, sd.total_fees_min, s.description
-- FROM schools s
-- LEFT JOIN school_details sd ON sd.school_id = s.id
-- WHERE s.name IN (
--   SELECT name FROM schools GROUP BY name, area HAVING COUNT(*) > 1
-- )
-- ORDER BY s.name, s.area, sd.total_fees_min NULLS LAST;

-- ── Delete the weaker duplicate from each pair ──────────────────
-- Strategy: for each (name, area) group, keep the school_id with
-- the lowest ctid (first inserted) UNLESS it has no fees, in which
-- case keep the one that does.
-- Simpler: keep the one with non-null total_fees_min; delete the rest.

DELETE FROM schools
WHERE id IN (
  SELECT s.id
  FROM schools s
  LEFT JOIN school_details sd ON sd.school_id = s.id
  WHERE (s.name, s.area) IN (
    SELECT name, area
    FROM schools
    GROUP BY name, area
    HAVING COUNT(*) > 1
  )
  -- Within each duplicate group, delete the one(s) with NULL fees
  -- but only if at least one sibling has non-null fees
  AND sd.total_fees_min IS NULL
  AND EXISTS (
    SELECT 1
    FROM schools s2
    JOIN school_details sd2 ON sd2.school_id = s2.id
    WHERE s2.name = s.name
      AND s2.area = s.area
      AND s2.id   != s.id
      AND sd2.total_fees_min IS NOT NULL
  )
);

-- ── Fallback: if both have fees (or both null), keep the one with
-- a description and delete the other ──────────────────────────────
DELETE FROM schools
WHERE id IN (
  SELECT s.id
  FROM schools s
  WHERE (s.name, s.area) IN (
    SELECT name, area
    FROM schools
    GROUP BY name, area
    HAVING COUNT(*) > 1
  )
  AND s.description IS NULL
  AND EXISTS (
    SELECT 1 FROM schools s2
    WHERE s2.name = s.name
      AND s2.area = s.area
      AND s2.id   != s.id
      AND s2.description IS NOT NULL
  )
);

-- ── Last resort: if still duplicated, keep the earliest by created_at ─
DELETE FROM schools
WHERE id IN (
  SELECT id FROM (
    SELECT id,
           ROW_NUMBER() OVER (PARTITION BY name, area ORDER BY created_at ASC) AS rn
    FROM schools
  ) ranked
  WHERE rn > 1
);
