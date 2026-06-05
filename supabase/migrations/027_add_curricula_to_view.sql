-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 027 — Add curricula array to schools_with_details view
--
-- Root cause: the original view (001_initial.sql) never joined school_curricula,
-- so any query that selects "curricula" from this view silently returns 0 rows.
-- This broke the area landing pages, cluster pages, and comparison pages which
-- all query: .from("schools_with_details").select("..., curricula, ...")
--
-- Fix: rebuild the view with a LEFT JOIN to school_curricula and ARRAY_AGG.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE OR REPLACE VIEW schools_with_details AS
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
    WHERE aw.school_id = s.id AND aw.status = 'open'
  ) AS admissions_open,
  EXISTS (
    SELECT 1 FROM admission_windows aw
    WHERE aw.school_id = s.id AND aw.is_mid_year = TRUE AND aw.status = 'open'
  ) AS mid_year_available
FROM schools s
LEFT JOIN school_details    sd ON sd.school_id = s.id
LEFT JOIN school_curricula  sc ON sc.school_id = s.id
LEFT JOIN reviews            r ON r.school_id  = s.id
GROUP BY s.id, sd.school_id;
