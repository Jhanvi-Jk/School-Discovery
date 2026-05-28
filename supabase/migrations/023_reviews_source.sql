-- Add source column to reviews table for multi-source imports
-- Supported sources: schoolfind360 (own platform), curious_parent, ezyschooling

ALTER TABLE reviews
  ADD COLUMN IF NOT EXISTS source text NOT NULL DEFAULT 'schoolfind360';

-- Enforce known sources
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'reviews_source_check' AND conrelid = 'reviews'::regclass
  ) THEN
    ALTER TABLE reviews
      ADD CONSTRAINT reviews_source_check
      CHECK (source IN ('schoolfind360', 'curious_parent', 'ezyschooling'));
  END IF;
END$$;

-- Index for fast per-source aggregation
CREATE INDEX IF NOT EXISTS reviews_school_source_idx
  ON reviews (school_id, source);

-- Comment for clarity
COMMENT ON COLUMN reviews.source IS
  'Origin of the review: schoolfind360 (own platform), curious_parent (TheCuriousParent.com), ezyschooling (Ezyschooling.com)';
