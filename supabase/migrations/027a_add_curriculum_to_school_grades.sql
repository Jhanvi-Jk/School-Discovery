-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 027a — Add curriculum column to school_grades.
-- The original production DB had this column added manually; this migration
-- ensures new deployments match the live schema before enrichment migrations
-- 028+ run. Uses IF NOT EXISTS so it is safe to replay on the original DB.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE school_grades
  ADD COLUMN IF NOT EXISTS curriculum curriculum_type NOT NULL DEFAULT 'cbse';

-- Drop the default after adding so future inserts must supply the value explicitly.
ALTER TABLE school_grades
  ALTER COLUMN curriculum DROP DEFAULT;
