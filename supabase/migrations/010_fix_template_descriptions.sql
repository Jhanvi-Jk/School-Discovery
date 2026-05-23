-- ================================================================
-- 010_fix_template_descriptions.sql
-- Schools whose description was set to a raw data template like:
--   "Grades offered: Nursery to Class 12. Fee Range: ₹1,40,000 - ₹1,85,000. Amenities:..."
-- Fix: extract fees into school_details, then clear the junk description.
-- Safe to run multiple times.
-- ================================================================

-- Step 1: Parse fee range out of template descriptions and write into school_details.
-- Matches pattern: "Fee Range: ₹1,40,000 - ₹1,85,000"
UPDATE school_details sd
SET
  total_fees_min = CAST(
    REPLACE(
      SUBSTRING(s.description FROM 'Fee Range: ₹([0-9,]+)'),
      ',', ''
    ) AS INT
  ),
  total_fees_max = CAST(
    REPLACE(
      SUBSTRING(s.description FROM E'- ₹([0-9,]+)'),
      ',', ''
    ) AS INT
  )
FROM schools s
WHERE sd.school_id = s.id
  AND s.description LIKE '%Fee Range: ₹%'
  AND (sd.total_fees_min IS NULL OR sd.total_fees_min = 0);

-- Step 2: Wipe template descriptions so cards show a clean slate.
UPDATE schools
SET description = NULL
WHERE description LIKE 'Grades offered:%Fee Range:%'
   OR description LIKE '%Fee Range: ₹%Amenities:%';
