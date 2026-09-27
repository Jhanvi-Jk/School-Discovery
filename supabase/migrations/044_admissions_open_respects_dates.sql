-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 044 — schools_with_details.admissions_open must respect window dates
--
-- Root cause: the view flagged a school as "admissions open" whenever ANY of its
-- admission_windows rows had status = 'open'. Every seeded window is 2025-26 and
-- was never flipped to 'closed', so listing cards said "Admissions Open" while the
-- profile page showed a window that had ended months earlier.
--
-- Rules (kept identical to resolveAdmissionState() in lib/admissions.ts):
--   • closes_at in the past            → not open
--   • opens_at in the future           → not open (upcoming)
--   • no closes_at and the academic    → not open (an undated window for a past
--     year started before this April     year cannot still be running)
--   • otherwise open if status = 'open', or status = 'upcoming' with both dates set
--     and today between them (the stored label is just stale)
--
-- Also: adds created_at (the API's "newest" sort ordered by it, but the view never
-- exposed it) and keeps the curricula array from migration 027.
-- CREATE OR REPLACE cannot reorder columns, so drop and recreate like 027 did.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE FUNCTION admission_window_is_open(
  p_status        admission_status,
  p_opens_at      DATE,
  p_closes_at     DATE,
  p_academic_year VARCHAR
) RETURNS BOOLEAN
LANGUAGE sql
STABLE
AS $$
  WITH t AS (SELECT (NOW() AT TIME ZONE 'Asia/Kolkata')::DATE AS today)
  SELECT
    (p_closes_at IS NULL OR p_closes_at >= t.today)
    AND (p_opens_at IS NULL OR p_opens_at <= t.today)
    AND (
      -- An undated window belonging to a past academic year (they start in April) is over
      p_closes_at IS NOT NULL
      OR CASE
           WHEN SPLIT_PART(COALESCE(p_academic_year, ''), '-', 1) ~ '^[0-9]{4}$'
           THEN SPLIT_PART(p_academic_year, '-', 1)::INT >=
                  EXTRACT(YEAR FROM t.today)::INT - CASE WHEN EXTRACT(MONTH FROM t.today) >= 4 THEN 0 ELSE 1 END
           ELSE TRUE
         END
    )
    AND (
      p_status = 'open'
      OR (p_status = 'upcoming' AND p_opens_at IS NOT NULL AND p_closes_at IS NOT NULL)
    )
  FROM t
$$;

DROP VIEW IF EXISTS schools_with_details;

CREATE VIEW schools_with_details AS
SELECT
  s.id,
  s.slug,
  s.name,
  s.description,
  s.established_year,
  s.type,
  s.gender,
  s.verified,
  s.last_data_updated_at,
  s.created_at,
  s.area,
  s.city,
  s.pincode,
  s.latitude,
  s.longitude,
  s.cover_image_url,
  s.logo_url,
  s.phone,
  s.email,
  s.website,
  sd.total_fees_min,
  sd.total_fees_max,
  sd.annual_tuition_fees_min,
  sd.annual_tuition_fees_max,
  sd.has_transport,
  sd.student_teacher_ratio,
  sd.school_hours_start,
  sd.school_hours_end,
  sd.student_count,
  sd.teacher_count,
  sd.development_fees,
  sd.transport_fees,
  sd.activity_fees,
  sd.admission_fees,
  -- Aggregated curricula array — e.g. ARRAY['cbse','ib']
  ARRAY_AGG(DISTINCT sc.curriculum::TEXT)
    FILTER (WHERE sc.curriculum IS NOT NULL) AS curricula,
  ROUND(AVG(r.rating_overall)::NUMERIC, 1)  AS avg_rating,
  COUNT(DISTINCT r.id)                       AS review_count,
  EXISTS (
    SELECT 1 FROM admission_windows aw
    WHERE aw.school_id = s.id
      AND admission_window_is_open(aw.status, aw.opens_at, aw.closes_at, aw.academic_year)
  ) AS admissions_open,
  EXISTS (
    SELECT 1 FROM admission_windows aw
    WHERE aw.school_id = s.id
      AND aw.is_mid_year = TRUE
      AND admission_window_is_open(aw.status, aw.opens_at, aw.closes_at, aw.academic_year)
  ) AS mid_year_available
FROM schools s
LEFT JOIN school_details    sd ON sd.school_id = s.id
LEFT JOIN school_curricula  sc ON sc.school_id = s.id
LEFT JOIN reviews            r ON r.school_id  = s.id
GROUP BY s.id, sd.school_id;
