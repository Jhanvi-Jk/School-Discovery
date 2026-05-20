-- ================================================================
-- 006_remove_duplicates.sql  (v3)
-- Deletes the "Fees N/A" empty copy whenever a school with the
-- same name already exists with real fee data.
-- Area is intentionally NOT used — duplicates often differ by area.
-- ================================================================

-- Preview first (uncomment to check):
-- SELECT s.slug, s.name, s.area, sd.total_fees_min
-- FROM schools s
-- LEFT JOIN school_details sd ON sd.school_id = s.id
-- WHERE sd.total_fees_min IS NULL
--   AND EXISTS (
--     SELECT 1 FROM schools s2
--     JOIN school_details sd2 ON sd2.school_id = s2.id
--     WHERE s2.name = s.name AND s2.id != s.id AND sd2.total_fees_min IS NOT NULL
--   )
-- ORDER BY s.name;

DELETE FROM schools
WHERE id IN (
  SELECT s.id
  FROM schools s
  LEFT JOIN school_details sd ON sd.school_id = s.id
  WHERE sd.total_fees_min IS NULL
    AND EXISTS (
      SELECT 1 FROM schools s2
      JOIN school_details sd2 ON sd2.school_id = s2.id
      WHERE s2.name = s.name
        AND s2.id  != s.id
        AND sd2.total_fees_min IS NOT NULL
    )
);
