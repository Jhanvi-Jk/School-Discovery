-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 045 — launch-readiness fixes (data hygiene, moderation, new features)
--
-- Requires 044 (admission_window_is_open + the recreated schools_with_details view).
--
--  1. schools.is_listed        soft-hide switch. Nothing below DELETEs a school, so every
--                              hide can be undone with:  UPDATE schools SET is_listed = TRUE WHERE slug = '…';
--  2. Hide duplicate / wrong-category / unverifiable entries (incl. ~30 exact-name duplicates)
--  3. Clear descriptions that are internal notes, raw enum codes or generated filler
--  4. Fix Chrysalis Kids (Montessori pre-school, not a CBSE school)
--  5. Review moderation (status + verified-parent flag) with matching RLS
--  6. New tables: admission alerts, school claims, contact messages, fee structure,
--     board results, transport routes; enquiries get a "campus visit" type
--  7. Recreate schools_with_details: unlisted schools and unapproved reviews are excluded
-- ─────────────────────────────────────────────────────────────────────────────

-- ══ 1. Soft-hide switch ══════════════════════════════════════════════════════
ALTER TABLE schools ADD COLUMN IF NOT EXISTS is_listed    BOOLEAN NOT NULL DEFAULT TRUE;
ALTER TABLE schools ADD COLUMN IF NOT EXISTS listing_note TEXT;

-- ══ 2. Hide entries that should not be shown ═════════════════════════════════

-- 2a. Duplicates / erroneous entries flagged in migration 030 ("NOT deleting without your confirmation")
UPDATE schools SET
  is_listed = FALSE,
  listing_note = 'Duplicate of Chrysalis High Marathahalli — research found a single Chrysalis campus in this corridor (Gunjur, Marathahalli-Sarjapur Road).'
WHERE id = 'c4f5504b-2ed2-4b3d-b06a-bd199bfa73ed';

UPDATE schools SET
  is_listed = FALSE,
  listing_note = 'No separate Clarence PU College exists — Clarence High School (Richards Town, CISCE) runs through Class XII.'
WHERE id = '16685c27-2273-45c5-8c20-da89ef36eaf8';

-- 2b. Pre-university / junior colleges are not schools (MES, NMKRV, Baldwin Methodist, …).
--     Names containing "school" are kept — those are K-12 schools that also run a PU section.
UPDATE schools SET
  is_listed = FALSE,
  listing_note = COALESCE(listing_note, 'Pre-university / junior college — not a K-12 school.')
WHERE is_listed
  AND name ~* '(\mPU\M|pre-?university|junior college|\mcollege\M)'
  AND name !~* 'school';

--     Any other entry whose only grades are Class 11-12
UPDATE schools s SET
  is_listed = FALSE,
  listing_note = COALESCE(s.listing_note, 'Offers Class 11-12 only — not a K-12 school.')
WHERE s.is_listed
  AND EXISTS (SELECT 1 FROM school_grades g WHERE g.school_id = s.id)
  AND NOT EXISTS (
    SELECT 1 FROM school_grades g
    WHERE g.school_id = s.id AND g.grade_from NOT IN ('Class 11', 'Grade 11', 'Class 12', 'Grade 12')
  );

-- 2c. Electronic City / ORR cluster from migration 013. These 73 rows were bulk-generated:
--     repeated name patterns ("Zenith Central Academy" / "… ORR"), invented neighbourhoods
--     ("Marathahalli Rim", "Outer Ring Road Hub") and every row flagged verified = TRUE.
--     Any of them that a later migration enriched with a real address, phone or website
--     stays listed; the rest are hidden until someone confirms they exist.
UPDATE schools s SET
  is_listed = FALSE,
  verified  = FALSE,
  listing_note = 'Unverified bulk-seeded entry (migration 013) — no address, phone or website on record. Re-list after confirming the school exists.'
WHERE s.slug IN (
    'vellore-international-school-branch',
    'kidzee-high-electronic-city',
    'bright-minds-public-school-sarjapur',
    'st-joans-school-electronic-city',
    'vivid-high-school-electronic-city',
    'little-elly-high-sarjapur',
    'pinnacle-international-school-ec',
    'cambridge-international-sarjapur',
    'ascent-high-school-electronic-city',
    'oxford-central-school-sarjapur',
    'the-excel-public-school-ec',
    'capestone-high-school-ec',
    'the-heritage-public-academy-sarjapur',
    'veda-vidya-academy-ec',
    'zenith-central-academy-sarjapur',
    'cyber-city-public-school-ec',
    'neta-ji-central-school-ec',
    'sarjapur-global-academy',
    'broadview-international-school-ec',
    'apex-public-school-ec',
    'veda-central-school-sarjapur',
    'the-smart-school-ec',
    'capestone-global-academy-ec',
    'new-horizon-gurukul-marathahalli',
    'chrysalis-high-marathahalli',
    'vagdevi-vilas-school-marathahalli',
    'ryan-international-school-kundalahalli',
    'gitanjali-international-school-orr',
    'ravindra-bharathi-global-school',
    'sri-chaitanya-techno-school-orr',
    'narayana-olympiad-school-orr',
    'sanskriti-public-school-marathahalli',
    'sudarshan-vidya-mandir-east',
    'st-thomas-high-school-marathahalli',
    'loyola-english-school-marathahalli',
    'brilliant-national-school-orr',
    'zeal-international-school-east',
    'vanguard-public-school-orr',
    'greenfield-public-school-marathahalli',
    'mount-litera-zee-school-orr',
    'sigma-central-school-marathahalli',
    'beacon-high-international-orr',
    'elite-public-school-marathahalli',
    'bright-kids-high-orr',
    'st-joan-of-arc-school-orr',
    'vivid-international-school-marathahalli',
    'little-elly-high-orr',
    'national-academy-marathahalli',
    'genius-minds-academy-orr',
    'pinnacle-high-school-marathahalli',
    'cambridge-school-orr',
    'milestone-international-orr',
    'ascent-public-school-marathahalli',
    'oxford-central-school-orr',
    'the-excel-public-school-orr',
    'capestone-international-marathahalli',
    'the-heritage-academy-orr',
    'veda-vidya-mandir-orr',
    'zenith-international-school-marathahalli',
    'cyber-edge-school-marathahalli',
    'neta-ji-public-school-orr',
    'global-tech-academy-marathahalli',
    'broadview-public-school-orr',
    'apex-public-school-marathahalli',
    'veda-central-school-orr',
    'the-smart-academy-orr',
    'capestone-global-school-orr',
    'the-heritage-global-school-marathahalli',
    'veda-vidya-academy-orr',
    'zenith-central-academy-orr',
    'the-secure-school-marathahalli',
    'alpha-public-school-orr',
    'alpha-international-academy-marathahalli'
  )
  AND s.website IS NULL AND s.phone IS NULL AND s.address_line1 IS NULL;

-- 2d. Exact duplicates: the same name, neighbourhood and city listed under two slugs
--     (e.g. national-public-school-rajajinagar and national-public-school-rajajinagar-bengaluru).
--     Keep the richest row — verified first, then the most contact/fee/description data,
--     then the oldest — and hide the rest, noting which slug was kept.
WITH ranked AS (
  SELECT
    s.id,
    ROW_NUMBER() OVER w AS rn,
    FIRST_VALUE(s.slug) OVER w AS keep_slug
  FROM schools s
  LEFT JOIN school_details sd ON sd.school_id = s.id
  WHERE s.is_listed
  WINDOW w AS (
    PARTITION BY lower(btrim(s.name)), lower(btrim(COALESCE(s.area, ''))), s.city
    ORDER BY s.verified DESC,
             ((s.website IS NOT NULL)::INT + (s.phone IS NOT NULL)::INT + (s.address_line1 IS NOT NULL)::INT
              + (sd.total_fees_min IS NOT NULL)::INT + (s.description IS NOT NULL)::INT) DESC,
             s.created_at ASC, s.slug ASC
  )
)
UPDATE schools s SET
  is_listed = FALSE,
  listing_note = 'Duplicate listing of ' || r.keep_slug || ' (same name, area and city).'
FROM ranked r
WHERE s.id = r.id AND r.rn > 1;

-- ══ 3. Descriptions that must never be shown ═════════════════════════════════
-- Internal team notes, raw enum codes ("Offers STATE_BOARD curriculum"), generated
-- filler ("layout parameters", "tier index tracking") and one-liners too short to be
-- a real description. The site builds a factual summary from structured fields instead.
UPDATE schools SET description = NULL
WHERE description IS NOT NULL AND (
     length(btrim(description)) < 90
  OR description ~* '(possible duplicate|erroneous entry|flagged for|manual review|de-?duplication|research (found|suggests))'
  OR description ~* '(layout parameters?|tier index|tracking (data|choices?|metrics?|index)|index ranking|brand extension|framework metrics?|layout scores?|layout framework)'
  OR description ~ '\m[A-Z]{2,}(_[A-Z]+)+\M'
  OR description LIKE 'Grades offered:%'
  OR description LIKE '%Fee Range:%'
);

-- ══ 4. Chrysalis Kids is a Montessori pre-school, not CBSE ═══════════════════
DELETE FROM school_curricula
WHERE school_id IN (SELECT id FROM schools WHERE name = 'Chrysalis Kids');

-- ══ 5. Review moderation ═════════════════════════════════════════════════════
-- Existing reviews stay visible ('approved'); anything submitted from now on waits for a moderator.
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS status TEXT NOT NULL DEFAULT 'approved';
ALTER TABLE reviews ALTER COLUMN status SET DEFAULT 'pending';
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reviews_status_check' AND conrelid = 'reviews'::regclass) THEN
    ALTER TABLE reviews ADD CONSTRAINT reviews_status_check CHECK (status IN ('pending', 'approved', 'rejected'));
  END IF;
END $$;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS moderated_at     TIMESTAMPTZ;
ALTER TABLE reviews ADD COLUMN IF NOT EXISTS moderation_note  TEXT;
COMMENT ON COLUMN reviews.is_verified IS 'Verified parent: a moderator confirmed the reviewer is a parent/student of this school (fee receipt, school e-mail, ID card…).';
CREATE INDEX IF NOT EXISTS reviews_status_idx ON reviews (status, created_at DESC);

DROP POLICY IF EXISTS "Reviews are publicly readable" ON reviews;
DROP POLICY IF EXISTS "Approved reviews are publicly readable" ON reviews;
CREATE POLICY "Approved reviews are publicly readable"
  ON reviews FOR SELECT USING (status = 'approved' OR auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can submit reviews" ON reviews;
CREATE POLICY "Users can submit reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id AND status = 'pending' AND is_verified = FALSE);

DROP POLICY IF EXISTS "Users can update own reviews" ON reviews;
CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id AND status = 'pending' AND is_verified = FALSE);

-- ══ 6. New tables ════════════════════════════════════════════════════════════

-- 6a. Admission deadline alerts (email / WhatsApp). Consent is recorded explicitly (DPDP Act 2023).
CREATE TABLE IF NOT EXISTS admission_alert_subscriptions (
  id                 UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id          UUID REFERENCES schools(id) ON DELETE CASCADE,
  city               TEXT,
  grade              TEXT,
  channel            TEXT NOT NULL CHECK (channel IN ('email', 'whatsapp', 'both')),
  email              TEXT,
  phone              TEXT,
  consented_at       TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  unsubscribe_token  UUID NOT NULL DEFAULT gen_random_uuid(),
  unsubscribed_at    TIMESTAMPTZ,
  last_notified_at   TIMESTAMPTZ,
  created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (school_id IS NOT NULL OR city IS NOT NULL),
  CHECK (channel = 'whatsapp' OR email IS NOT NULL),
  CHECK (channel = 'email' OR phone IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS alert_subs_school_idx ON admission_alert_subscriptions (school_id) WHERE unsubscribed_at IS NULL;
ALTER TABLE admission_alert_subscriptions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can subscribe to alerts" ON admission_alert_subscriptions;
CREATE POLICY "Anyone can subscribe to alerts"
  ON admission_alert_subscriptions FOR INSERT WITH CHECK (TRUE);
-- no SELECT policy: subscriptions are read only with the service role

-- 6b. "Claim your profile" requests from schools
CREATE TABLE IF NOT EXISTS school_claims (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  user_id         UUID REFERENCES users(id) ON DELETE SET NULL,
  claimant_name   TEXT NOT NULL,
  role_title      TEXT,
  official_email  TEXT NOT NULL,
  phone           TEXT,
  message         TEXT,
  status          TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at     TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS school_claims_user_idx ON school_claims (user_id);
ALTER TABLE school_claims ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Signed-in users can submit claims" ON school_claims;
CREATE POLICY "Signed-in users can submit claims"
  ON school_claims FOR INSERT TO authenticated WITH CHECK (auth.uid() = user_id AND status = 'pending');
DROP POLICY IF EXISTS "Users can see their own claims" ON school_claims;
CREATE POLICY "Users can see their own claims"
  ON school_claims FOR SELECT TO authenticated USING (auth.uid() = user_id);

-- 6c. Contact form
CREATE TABLE IF NOT EXISTS contact_messages (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  email       TEXT NOT NULL,
  topic       TEXT NOT NULL DEFAULT 'general',
  message     TEXT NOT NULL,
  resolved    BOOLEAN NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can send a message" ON contact_messages;
CREATE POLICY "Anyone can send a message"
  ON contact_messages FOR INSERT WITH CHECK (TRUE);

-- 6d. Fees by grade (feeds the compare table and the profile page; sections stay hidden until rows exist)
CREATE TABLE IF NOT EXISTS school_fee_structure (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id       UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  academic_year   TEXT NOT NULL,
  grade_label     TEXT NOT NULL,           -- "Nursery – UKG", "Grades 1–5", "Grades 9–10"
  sort_order      SMALLINT NOT NULL DEFAULT 0,
  tuition_fee     INT,
  other_fees      INT,                     -- annual, excluding one-time admission fee
  admission_fee   INT,                     -- one-time
  source_url      TEXT,
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (school_id, academic_year, grade_label)
);
ALTER TABLE school_fee_structure ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Fee structure is publicly readable" ON school_fee_structure;
CREATE POLICY "Fee structure is publicly readable" ON school_fee_structure FOR SELECT USING (TRUE);

-- 6e. Board results / exam outcomes
CREATE TABLE IF NOT EXISTS school_board_results (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id         UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  exam              TEXT NOT NULL,         -- "CBSE Class 10", "ISC Class 12", "IB Diploma"
  exam_year         SMALLINT NOT NULL,
  students_appeared INT,
  pass_percentage   NUMERIC(5,2),
  average_score     NUMERIC(5,2),          -- percentage, or IB points for the diploma
  top_score         NUMERIC(5,2),
  source_url        TEXT NOT NULL,         -- every published result must cite where it came from
  UNIQUE (school_id, exam, exam_year)
);
ALTER TABLE school_board_results ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Board results are publicly readable" ON school_board_results;
CREATE POLICY "Board results are publicly readable" ON school_board_results FOR SELECT USING (TRUE);

-- 6f. Transport routes
CREATE TABLE IF NOT EXISTS school_transport_routes (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  school_id     UUID NOT NULL REFERENCES schools(id) ON DELETE CASCADE,
  route_name    TEXT NOT NULL,
  areas_covered TEXT[] NOT NULL DEFAULT '{}',
  annual_fee    INT,
  notes         TEXT,
  UNIQUE (school_id, route_name)
);
ALTER TABLE school_transport_routes ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Transport routes are publicly readable" ON school_transport_routes;
CREATE POLICY "Transport routes are publicly readable" ON school_transport_routes FOR SELECT USING (TRUE);

-- 6g. Enquiries can now be campus-visit requests
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS kind       TEXT NOT NULL DEFAULT 'admission';
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS visit_date DATE;
ALTER TABLE enquiries ADD COLUMN IF NOT EXISTS consented_at TIMESTAMPTZ;
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'enquiries_kind_check' AND conrelid = 'enquiries'::regclass) THEN
    ALTER TABLE enquiries ADD CONSTRAINT enquiries_kind_check CHECK (kind IN ('admission', 'campus_visit'));
  END IF;
END $$;

-- ══ 7. schools_with_details: listed schools + approved reviews only ═════════
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
LEFT JOIN reviews            r ON r.school_id  = s.id AND r.status = 'approved'
WHERE s.is_listed
GROUP BY s.id, sd.school_id;

GRANT SELECT ON schools_with_details TO anon, authenticated;
