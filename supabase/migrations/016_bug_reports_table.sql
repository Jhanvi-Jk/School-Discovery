-- ================================================================
-- 016_bug_reports_table.sql
-- Table to store user-submitted bug reports / feedback.
-- ================================================================

CREATE TABLE IF NOT EXISTS bug_reports (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  bug_type     TEXT NOT NULL DEFAULT 'general',
  context      TEXT,
  description  TEXT NOT NULL,
  want_contact BOOLEAN NOT NULL DEFAULT false,
  email        TEXT,
  resolved     BOOLEAN NOT NULL DEFAULT false,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for admin review (newest first)
CREATE INDEX IF NOT EXISTS idx_bug_reports_created ON bug_reports (created_at DESC);
