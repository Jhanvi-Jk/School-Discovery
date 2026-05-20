-- ================================================================
-- 006_remove_duplicates.sql  (v2 — handles all duplicate cases)
-- For every group of schools sharing the exact same (name, area),
-- keeps the single best record and deletes the rest.
-- "Best" = has fees > has description > earliest created_at.
-- Safe to run multiple times.
-- ================================================================

-- Step 1: preview — uncomment to check before deleting
-- SELECT s.name, s.area, COUNT(*) AS copies
-- FROM schools s
-- GROUP BY s.name, s.area
-- HAVING COUNT(*) > 1
-- ORDER BY copies DESC, s.name;

-- Step 2: delete all duplicates, keeping one winner per (name, area)
DELETE FROM schools
WHERE id IN (
  SELECT id FROM (
    SELECT
      s.id,
      ROW_NUMBER() OVER (
        PARTITION BY s.name, s.area
        ORDER BY
          (sd.total_fees_min IS NOT NULL) DESC,   -- prefer has fees
          (s.description     IS NOT NULL) DESC,   -- then has description
          s.created_at ASC                        -- then earliest inserted
      ) AS rn
    FROM schools s
    LEFT JOIN school_details sd ON sd.school_id = s.id
  ) ranked
  WHERE rn > 1   -- delete every copy except rank-1
);
