-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 029 — Enrich Baldwin Boys'/Girls' High Schools, Baldwin Girls' PU
-- College, and Bangalore International School, including AREA CORRECTIONS
-- (these schools were mis-tagged to the wrong neighbourhood in the DB).
-- ─────────────────────────────────────────────────────────────────────────────

-- ══════════════════════════════════════════════════════════════════════════════
-- BALDWIN BOYS' HIGH SCHOOL
-- DB area was "Basavanagudi" — actual location is Richmond Town.
-- Source: https://www.baldwinboyshighschool.edu.in/, uniapply.com, careers360
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET
  area = 'Richmond Town',
  address_line1 = '#14, Hosur Road',
  address_line2 = 'Richmond Town',
  pincode = '560025',
  website = 'https://www.baldwinboyshighschool.edu.in',
  established_year = 1880,
  description = 'A 145-year-old heritage Methodist institution (est. 1880) for boys, offering Nursery to Class 10 under the ICSE board. Known for its hostel facility and school bus transport network across Bangalore.'
WHERE id = '999a6105-38a2-4df1-9bab-4dbd6b86bea7';

-- Curriculum — ICSE (override any existing entry)
DELETE FROM school_curricula WHERE school_id = '999a6105-38a2-4df1-9bab-4dbd6b86bea7';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '999a6105-38a2-4df1-9bab-4dbd6b86bea7', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '999a6105-38a2-4df1-9bab-4dbd6b86bea7')
ON CONFLICT DO NOTHING;

-- Grades: Nursery to Class 10
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '999a6105-38a2-4df1-9bab-4dbd6b86bea7', 'Nursery', 'Class 10', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '999a6105-38a2-4df1-9bab-4dbd6b86bea7')
ON CONFLICT DO NOTHING;

-- Boarding facility
UPDATE school_details SET
  has_transport = TRUE
WHERE school_id = '999a6105-38a2-4df1-9bab-4dbd6b86bea7';


-- ══════════════════════════════════════════════════════════════════════════════
-- BALDWIN GIRLS' HIGH SCHOOL
-- DB area was "Basavanagudi" — actual location is Richmond Town / Langford Gardens.
-- Source: https://www.baldwingirls.edu.in/, schoolsuniverse.com
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET
  area = 'Richmond Town',
  address_line1 = '90 (34), Richmond Road',
  address_line2 = 'Langford Gardens (opp. HDFC Bank)',
  pincode = '560025',
  website = 'https://www.baldwingirls.edu.in',
  established_year = 1880,
  gender = 'girls',
  description = 'A 145-year-old heritage all-girls Methodist institution (est. 1880), offering pre-Nursery to Class 10 under the ICSE board. One of the earliest and most well-known girls'' schools in India.'
WHERE id = '6be968e2-18e3-430a-9314-20a950f1ac5b';

-- Curriculum — ICSE (override any existing entry)
DELETE FROM school_curricula WHERE school_id = '6be968e2-18e3-430a-9314-20a950f1ac5b';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '6be968e2-18e3-430a-9314-20a950f1ac5b', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '6be968e2-18e3-430a-9314-20a950f1ac5b')
ON CONFLICT DO NOTHING;

-- Grades: Pre-Nursery to Class 10
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '6be968e2-18e3-430a-9314-20a950f1ac5b', 'Pre-Nursery', 'Class 10', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '6be968e2-18e3-430a-9314-20a950f1ac5b')
ON CONFLICT DO NOTHING;

-- Fees: ~Rs. 6,000 (Nursery) to Rs. 10,000/month (Class 10)
UPDATE school_details SET
  annual_tuition_fees_min = 72000,
  annual_tuition_fees_max = 120000
WHERE school_id = '6be968e2-18e3-430a-9314-20a950f1ac5b';


-- ══════════════════════════════════════════════════════════════════════════════
-- BALDWIN GIRLS' PU COLLEGE
-- DB area was "Basavanagudi" — actual location is Richmond Town (sister campus
-- of Baldwin Girls' High School).
-- Source: https://www.edustoke.com/bengaluru/baldwin-girls-pu-college-richmond-town,
--         https://baldwingirlspucollege.edu.in/
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET
  area = 'Richmond Town',
  address_line1 = 'Hosur Road',
  address_line2 = 'Richmond Town',
  pincode = '560025',
  website = 'https://baldwingirlspucollege.edu.in',
  gender = 'girls',
  description = 'Pre-University (PU) college for girls, sister institution of Baldwin Girls'' High School, offering Science and Commerce streams under the Karnataka State PU Board.'
WHERE id = '4d95bf4c-82d5-4af6-82b8-112c4b756e24';


-- ══════════════════════════════════════════════════════════════════════════════
-- BALDWIN METHODIST PU COLLEGE
-- DB area was "Basavanagudi" — actual location is Richmond Town (Hosur Road
-- campus, alongside Baldwin Boys' High School / Baldwin Methodist College).
-- Source: https://www.baldwinmethodistcollege.com/, uniapply.com
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET
  area = 'Richmond Town',
  address_line1 = 'Hosur Road',
  address_line2 = 'Richmond Town',
  pincode = '560025',
  website = 'https://www.baldwinmethodistcollege.com',
  description = 'Pre-University (PU) college, part of the Baldwin group of institutions on Hosur Road, Richmond Town, offering Science, Commerce and Arts streams.'
WHERE id = 'a22098c3-80eb-469e-a152-5c27fe5ab5be';


-- ══════════════════════════════════════════════════════════════════════════════
-- BANGALORE INTERNATIONAL SCHOOL
-- DB area was "Hebbal" — actual location is Hennur Bagalur Road / Geddalahalli /
-- Kothanur Post.
-- Source: https://www.bangaloreinternationalschool.org/, edarabia.com,
--         schoolmykids.com
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET
  area = 'Hennur',
  address_line1 = 'Hennur Bagalur Road, Geddalahalli',
  address_line2 = 'Kothanur Post',
  website = 'https://www.bangaloreinternationalschool.org',
  description = 'A private, non-profit, parent-owned international day school for ages 3-18, offering the IB Diploma Programme, Cambridge IGCSE/AS/A-Levels, and the Indian curriculum (ICSE). Extensive campus facilities include the BISON Arena (200m running track), cricket pitch, football & basketball courts, swimming pool, three computer labs, science/home-economics/music labs, and drama, dance, pottery and fine-arts studios.'
WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf';

-- Curricula: IB + IGCSE + ICSE (override any existing entry)
DELETE FROM school_curricula WHERE school_id = '3176530b-097c-4923-87f4-7b81f9a07eaf';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', 'ib'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;
INSERT INTO school_curricula (school_id, curriculum)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', 'igcse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;
INSERT INTO school_curricula (school_id, curriculum)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;

-- Grades: Nursery to Class 12 (ages 3-18) — one row per curriculum stream
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', 'Nursery', 'Class 12', 'ib'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', 'Nursery', 'Class 12', 'igcse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', 'Nursery', 'Class 12', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;

-- Fees: annual tuition Rs. 1,78,200 (PreK-K2) to Rs. 2,66,000 (IGCSE Gr 9-10);
-- admission/infrastructure fee Rs. 1,00,000 + Rs. 20,000 refundable deposit
UPDATE school_details SET
  annual_tuition_fees_min = 178200,
  annual_tuition_fees_max = 266000,
  admission_fees = 100000
WHERE school_id = '3176530b-097c-4923-87f4-7b81f9a07eaf';

-- Sports: Cricket, Football, Basketball, Swimming, Athletics
INSERT INTO school_sports (school_id, sport_id)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', id FROM sports
WHERE name IN ('Cricket', 'Football', 'Basketball', 'Swimming', 'Athletics')
AND EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;

-- Extracurriculars: Music, Dance, Drama, Art
INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT '3176530b-097c-4923-87f4-7b81f9a07eaf', id FROM extracurriculars
WHERE name IN ('Music', 'Dance', 'Drama', 'Painting')
AND EXISTS (SELECT 1 FROM schools WHERE id = '3176530b-097c-4923-87f4-7b81f9a07eaf')
ON CONFLICT DO NOTHING;
