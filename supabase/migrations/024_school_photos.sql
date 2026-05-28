-- ── School Photos Table ──────────────────────────────────────────────────────
-- Stores up to N photos per school, sourced from Google Places or manual upload.
-- sort_order 0 = primary/cover photo (used as hero image fallback).
-- The frontend reads this table when it wants a photo gallery; the Sheen skeleton
-- is shown when photo_count = 0, so DO NOT insert placeholder rows.

CREATE TABLE IF NOT EXISTS school_photos (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id    uuid        NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  sort_order   smallint    NOT NULL DEFAULT 0,   -- 0-indexed; 0 = cover
  url          text        NOT NULL,              -- full image URL
  photo_ref    text,                              -- Google Places photo_reference token
  place_id     text,                              -- Google Places place_id
  source       text        NOT NULL DEFAULT 'google_places'
                           CHECK (source IN ('google_places', 'manual', 'school_website')),
  is_cover     boolean     NOT NULL DEFAULT false,
  width        int,                               -- pixels (null = unknown)
  height       int,                               -- pixels (null = unknown)
  alt_text     text,                              -- optional accessible label
  created_at   timestamptz NOT NULL DEFAULT now(),

  -- Idempotent upserts: (school, position) is unique
  UNIQUE (school_id, sort_order)
);

-- Indexes
CREATE INDEX IF NOT EXISTS school_photos_school_idx  ON school_photos (school_id, sort_order);
CREATE INDEX IF NOT EXISTS school_photos_cover_idx   ON school_photos (school_id) WHERE is_cover = true;

-- RLS: public read, only service-role can write
ALTER TABLE school_photos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Photos are publicly readable"
  ON school_photos FOR SELECT
  USING (true);

-- Schools_with_details view extension helper (optional — use in your view query)
-- SELECT array_agg(url ORDER BY sort_order) FILTER (WHERE sort_order < 3) AS photo_urls

COMMENT ON TABLE school_photos IS
  'Up to 3 Google Places photos per school. Empty rows = intentional absence; '
  'frontend Sheen skeleton renders for schools with 0 rows here.';
