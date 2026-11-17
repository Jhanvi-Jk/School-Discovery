-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 048 — record what we could NOT confirm, and where each fact came from.
--
--  1. school_details.has_transport may now be NULL = "not confirmed" (it used to default
--     to FALSE, which showed "no transport" for schools we simply knew nothing about).
--  2. school_details.unconfirmed lists fields we looked for and could not confirm
--     (fees, transport, student_teacher_ratio, sports, activities, languages, streams,
--     pre_primary, gender, grades, contact, boarding, established_year). The profile
--     shows them as "Not confirmed yet" instead of silently hiding them.
--  3. schools.affiliation_no (CBSE/CISCE affiliation number) and schools.source_urls.
--  4. school_subjects: Class 11–12 streams and subjects a school offers.
-- ─────────────────────────────────────────────────────────────────────────────

ALTER TABLE school_details ALTER COLUMN has_transport DROP NOT NULL;
ALTER TABLE school_details ALTER COLUMN has_transport DROP DEFAULT;
ALTER TABLE school_details ADD COLUMN IF NOT EXISTS unconfirmed TEXT[] NOT NULL DEFAULT '{}';

ALTER TABLE schools ADD COLUMN IF NOT EXISTS affiliation_no TEXT;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS source_urls    TEXT[] NOT NULL DEFAULT '{}';

CREATE TABLE IF NOT EXISTS school_subjects (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id  UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  kind       TEXT NOT NULL CHECK (kind IN ('stream', 'subject')),
  name       TEXT NOT NULL,
  UNIQUE (school_id, kind, name)
);
CREATE INDEX IF NOT EXISTS school_subjects_name_idx ON school_subjects (kind, name);
ALTER TABLE school_subjects ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Subjects are publicly readable" ON school_subjects;
CREATE POLICY "Subjects are publicly readable" ON school_subjects FOR SELECT USING (TRUE);

INSERT INTO sports (name) VALUES ('Skating') ON CONFLICT (name) DO NOTHING;

NOTIFY pgrst, 'reload schema';
