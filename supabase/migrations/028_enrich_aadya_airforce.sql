-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 028 — Enrich Aadya Academy (Yelahanka/Kannur) and Air Force School
-- (Hebbal) with data researched from official school websites + SchoolMyKids.
-- ─────────────────────────────────────────────────────────────────────────────

-- ══════════════════════════════════════════════════════════════════════════════
-- AADYA ACADEMY — THE WORLD SCHOOL (Yelahanka / Kannur, Bengaluru)
-- Source: https://aadyaacademy.com/home/
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET
  phone   = '+91 96638 04909',
  email   = 'aadyaacademykannur@gmail.com',
  address_line1 = 'No. 123/1, Vinayaka Layout, Hennur-Bagalur Main Road',
  address_line2 = 'Next to Goyal Orchid Greens, Kannur',
  website = 'https://aadyaacademy.com',
  description = 'High parent marks for open growth-mindset tasks. ICSE day school offering an integrated, "future-ready" learning framework with dedicated art studio, library, activity room, MUN conferences, student council, and on-campus medical care and counselling.'
WHERE id = '398b335d-4700-4425-9ae2-9ac9c71348bc';

-- School hours (Prep3/UKG onward — the predominant timing)
UPDATE school_details SET
  school_hours_start = '08:40:00',
  school_hours_end   = '15:30:00'
WHERE school_id = '398b335d-4700-4425-9ae2-9ac9c71348bc';

-- Curriculum — site states ICSE (override existing 'cbse' if present)
DELETE FROM school_curricula WHERE school_id = '398b335d-4700-4425-9ae2-9ac9c71348bc';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '398b335d-4700-4425-9ae2-9ac9c71348bc', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '398b335d-4700-4425-9ae2-9ac9c71348bc')
ON CONFLICT DO NOTHING;

-- Grades: KG to Grade 10
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '398b335d-4700-4425-9ae2-9ac9c71348bc', 'Nursery', 'Class 10', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '398b335d-4700-4425-9ae2-9ac9c71348bc')
ON CONFLICT DO NOTHING;

-- Extracurriculars: MUN, Debate, Nature Club (field trips/excursions)
INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT '398b335d-4700-4425-9ae2-9ac9c71348bc', id FROM extracurriculars
WHERE name IN ('MUN', 'Debate', 'Nature Club')
AND EXISTS (SELECT 1 FROM schools WHERE id = '398b335d-4700-4425-9ae2-9ac9c71348bc')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- AIR FORCE SCHOOL, HEBBAL (Bengaluru)
-- Source: https://www.afshebbal.ac.in/index.php, SchoolMyKids
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET
  phone   = '+91-80-23411061',
  email   = 'afshebbal@gmail.com',
  address_line1 = 'Hebbal HQ TC(U) Air Force',
  address_line2 = 'JC Nagar Post',
  website = 'https://www.afshebbal.ac.in',
  established_year = 1958,
  description = 'Sprawling military grounds with structured discipline. Government CBSE day school (LKG–XII) run by the Indian Air Force Educational & Cultural Society, established 1958. Rated 4.1/5 by parents — praised for large playgrounds, strong sports culture, and free educational trips/camps; priority admission for Air Force families, also open to civilians. Recognised "Best Air Force School" multiple times with consistently 100% Class X results.'
WHERE id = '097b4049-5d36-4796-9575-deba03ea4787';

-- School hours: Shift 1 (morning) — keep existing 07:45–14:15 (already correct)

-- Grades: LKG to Class 12
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '097b4049-5d36-4796-9575-deba03ea4787', 'LKG', 'Class 12', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '097b4049-5d36-4796-9575-deba03ea4787')
ON CONFLICT DO NOTHING;

-- Sports: Cricket, Football, Table Tennis, Swimming
INSERT INTO school_sports (school_id, sport_id)
SELECT '097b4049-5d36-4796-9575-deba03ea4787', id FROM sports
WHERE name IN ('Cricket', 'Football', 'Table Tennis', 'Swimming')
AND EXISTS (SELECT 1 FROM schools WHERE id = '097b4049-5d36-4796-9575-deba03ea4787')
ON CONFLICT DO NOTHING;

-- Extracurriculars: Drama, Debate, NCC, Scout
INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT '097b4049-5d36-4796-9575-deba03ea4787', id FROM extracurriculars
WHERE name IN ('Drama', 'Debate', 'NCC', 'Scout')
AND EXISTS (SELECT 1 FROM schools WHERE id = '097b4049-5d36-4796-9575-deba03ea4787')
ON CONFLICT DO NOTHING;
