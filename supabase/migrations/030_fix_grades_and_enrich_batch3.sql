-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 030
--   PART A: Fix the failed school_grades inserts from migrations 028 & 029.
--           The live DB has an additional NOT NULL "curriculum" column on
--           school_grades that wasn't reflected in 001_initial.sql, so the
--           original 3-column inserts failed with a not-null violation.
--   PART B: Enrich a new batch of confirmed Bengaluru schools (Bishop Cotton's
--           Boys', Brigade Jayanagar/Mahadevapura, Broadvision World School,
--           Cambridge International School (TCIS), Canadian International
--           School, Canara Gurukula Public School, Sri Chaitanya Techno
--           School, Christ Academy, Chrysalis High x3 + Chrysalis Kids,
--           Clarence High School) with address, contact, sports and
--           extracurriculars, including area corrections where confirmed.
-- All FK-constrained INSERTs use WHERE EXISTS so they skip gracefully on
-- databases where the referenced school UUID does not exist.
-- ─────────────────────────────────────────────────────────────────────────────


-- ══════════════════════════════════════════════════════════════════════════════
-- PART A — Re-insert school_grades rows that failed in migrations 028 & 029
-- (These are now handled in 028/029 directly; kept here as safety no-ops)
-- ══════════════════════════════════════════════════════════════════════════════

-- Aadya Academy — ICSE, Nursery to Class 10
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '398b335d-4700-4425-9ae2-9ac9c71348bc', 'Nursery', 'Class 10', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '398b335d-4700-4425-9ae2-9ac9c71348bc')
ON CONFLICT DO NOTHING;

-- Air Force School Hebbal — CBSE, LKG to Class 12
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '097b4049-5d36-4796-9575-deba03ea4787', 'LKG', 'Class 12', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '097b4049-5d36-4796-9575-deba03ea4787')
ON CONFLICT DO NOTHING;

-- Baldwin Boys' High School — ICSE, Nursery to Class 10
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '999a6105-38a2-4df1-9bab-4dbd6b86bea7', 'Nursery', 'Class 10', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '999a6105-38a2-4df1-9bab-4dbd6b86bea7')
ON CONFLICT DO NOTHING;

-- Baldwin Girls' High School — ICSE, Pre-Nursery to Class 10
INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '6be968e2-18e3-430a-9314-20a950f1ac5b', 'Pre-Nursery', 'Class 10', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '6be968e2-18e3-430a-9314-20a950f1ac5b')
ON CONFLICT DO NOTHING;

-- Bangalore International School — IB, IGCSE and ICSE streams, Nursery to Class 12
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


-- ══════════════════════════════════════════════════════════════════════════════
-- PART B — New batch enrichment
-- ══════════════════════════════════════════════════════════════════════════════

-- ────────────────────────────────────────────────────────────────────────────
-- BISHOP COTTON'S BOYS' SCHOOL
-- DB area was "Sadashivanagar" — actual location is Residency Road / Ashok Nagar
-- Source: bishopcottonboysschool.edu.in
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  area = 'Residency Road',
  address_line1 = '15, Residency Road',
  pincode = '560025',
  phone = '+91-80-40527888',
  website = 'https://bishopcottonboysschool.edu.in',
  established_year = 1865,
  description = 'A historic boys'' school (est. 1865) managed by the Karnataka Central Diocese, Church of South India. Renowned for its strong record in sports, music, debate, and Model United Nations (MUN), with students regularly competing at state and national level.'
WHERE id = 'a1b2c3d4-0002-0002-0002-000000000002';

DELETE FROM school_curricula WHERE school_id = 'a1b2c3d4-0002-0002-0002-000000000002';
INSERT INTO school_curricula (school_id, curriculum)
SELECT 'a1b2c3d4-0002-0002-0002-000000000002', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = 'a1b2c3d4-0002-0002-0002-000000000002')
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT 'a1b2c3d4-0002-0002-0002-000000000002', id FROM extracurriculars
WHERE name IN ('Music', 'Dance', 'Drama', 'Debate', 'MUN')
AND EXISTS (SELECT 1 FROM schools WHERE id = 'a1b2c3d4-0002-0002-0002-000000000002')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- BRIGADE SCHOOL JAYANAGAR
-- DB area was "Jayanagar" — official campus is "The Brigade School", JP Nagar
-- 7th Phase (adjacent neighbourhood). Corrected to JP Nagar.
-- Source: brigadeschools.edu.in, brigadegroup.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  area = 'JP Nagar',
  address_line1 = 'JP Nagar 7th Phase',
  website = 'https://www.brigadeschools.edu.in',
  description = 'Part of The Brigade School group (Brigade Group Foundation), offering a CBSE curriculum in a green, low-density campus environment.'
WHERE id = '9fe6a920-f438-4b4e-b529-d8703680877d';

DELETE FROM school_curricula WHERE school_id = '9fe6a920-f438-4b4e-b529-d8703680877d';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '9fe6a920-f438-4b4e-b529-d8703680877d', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '9fe6a920-f438-4b4e-b529-d8703680877d')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- BRIGADE SCHOOL MAHADEVAPURA
-- Source: sulekha.com, brigadeschools.edu.in
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  address_line1 = 'No.9, 4th Cross, Whitefield Road',
  address_line2 = 'Mahadevapura',
  pincode = '560048',
  phone = '+91 6364859376',
  email = 'tbswadmission@brigadeschools.edu.in',
  website = 'https://www.brigadeschools.edu.in',
  description = 'Part of The Brigade School group, offering CBSE curriculum from Nursery to Standard 8 on Whitefield Road, Mahadevapura.'
WHERE id = '98989adf-29f0-4201-bbd5-34c0ae810804';

DELETE FROM school_curricula WHERE school_id = '98989adf-29f0-4201-bbd5-34c0ae810804';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '98989adf-29f0-4201-bbd5-34c0ae810804', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '98989adf-29f0-4201-bbd5-34c0ae810804')
ON CONFLICT DO NOTHING;

INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '98989adf-29f0-4201-bbd5-34c0ae810804', 'Nursery', 'Standard 8', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '98989adf-29f0-4201-bbd5-34c0ae810804')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- BROADVISION WORLD SCHOOL
-- DB area was "Hebbal" — actual location is Hennur Garden / Hennur Road.
-- Source: bvwschool.com, ezyschooling.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  area = 'Hennur',
  address_line1 = 'Hennur Garden, Hennur Road Cross',
  address_line2 = 'Near D''Mart, Ward No 24',
  pincode = '560043',
  phone = '+91 9513917595',
  email = 'admissions@bvwschool.com',
  website = 'https://bvwschool.com',
  description = 'CBSE day school on Hennur Road with a second campus in Thanisandra. Offers a modern curriculum with a focus on holistic development.'
WHERE id = 'd916d35c-2b64-41d3-9ea5-764e6643ea9b';

DELETE FROM school_curricula WHERE school_id = 'd916d35c-2b64-41d3-9ea5-764e6643ea9b';
INSERT INTO school_curricula (school_id, curriculum)
SELECT 'd916d35c-2b64-41d3-9ea5-764e6643ea9b', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = 'd916d35c-2b64-41d3-9ea5-764e6643ea9b')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CAMBRIDGE INTERNATIONAL SCHOOL (TCIS), Sarjapur
-- DB area "Sarjapur Sector" — corrected to Kudlu / Sarjapur Road
-- Source: tcis.in
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  area = 'Sarjapur Road',
  address_line1 = 'Survey No 145/2, 100ft Road, Kudlu',
  address_line2 = 'Off Sarjapur Road',
  pincode = '560068',
  phone = '+91 95132 38818',
  email = 'info@tcis.in',
  website = 'https://www.tcis.in',
  established_year = 2015,
  description = 'The Cambridge International School (TCIS), founded in 2015, offers the CBSE curriculum from KG1 to Class XII on Sarjapur Road.'
WHERE id = '113d1036-ead0-4f5d-aad6-8ac9b8de322f';

DELETE FROM school_curricula WHERE school_id = '113d1036-ead0-4f5d-aad6-8ac9b8de322f';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '113d1036-ead0-4f5d-aad6-8ac9b8de322f', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '113d1036-ead0-4f5d-aad6-8ac9b8de322f')
ON CONFLICT DO NOTHING;

INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '113d1036-ead0-4f5d-aad6-8ac9b8de322f', 'KG1', 'Class 12', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '113d1036-ead0-4f5d-aad6-8ac9b8de322f')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CANADIAN INTERNATIONAL SCHOOL
-- DB area "Yelahanka" — confirmed correct (BSF Campus, Yelahanka)
-- Source: ezyschooling.com, edustoke.com, Wikipedia
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  address_line1 = '4 & 20, Manchenahalli',
  address_line2 = 'BSF Campus, Yelahanka',
  pincode = '560064',
  description = 'A premier IB World School offering the IB Primary Years, Middle Years and Diploma Programmes alongside Cambridge IGCSE, on a residential BSF campus in Yelahanka.'
WHERE id = 'a1b2c3d4-0005-0005-0005-000000000005';

DELETE FROM school_curricula WHERE school_id = 'a1b2c3d4-0005-0005-0005-000000000005';
INSERT INTO school_curricula (school_id, curriculum)
SELECT 'a1b2c3d4-0005-0005-0005-000000000005', 'ib'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = 'a1b2c3d4-0005-0005-0005-000000000005')
ON CONFLICT DO NOTHING;
INSERT INTO school_curricula (school_id, curriculum)
SELECT 'a1b2c3d4-0005-0005-0005-000000000005', 'igcse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = 'a1b2c3d4-0005-0005-0005-000000000005')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CANARA GURUKULA PUBLIC SCHOOL
-- DB area "Electronic City" — confirmed (T. Gollahalli, Electronic City Post)
-- Source: canaragurukulapublicschool.in, ezyschooling.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  address_line1 = 'T. Gollahalli',
  address_line2 = 'Electronic City Post, Anekal Taluk',
  pincode = '560100',
  website = 'http://www.canaragurukulapublicschool.in',
  description = 'CBSE day school serving the Electronic City / Anekal Taluk area.'
WHERE id = '768d4c52-5a56-4061-a34e-9f4f086ace46';

DELETE FROM school_curricula WHERE school_id = '768d4c52-5a56-4061-a34e-9f4f086ace46';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '768d4c52-5a56-4061-a34e-9f4f086ace46', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '768d4c52-5a56-4061-a34e-9f4f086ace46')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- SRI CHAITANYA TECHNO SCHOOL ("Chaitanya Techno School")
-- DB area "Electronic City" — confirmed
-- Source: sulekha.com, careers360.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  name = 'Sri Chaitanya Techno School',
  address_line1 = 'Lakshmi Narayanapura, Huskur Road, Huskur Post',
  address_line2 = 'Behind APMC Fruit Market, Electronic City',
  pincode = '560099',
  established_year = 2009,
  description = 'CBSE co-ed day school in Electronic City, part of the Sri Chaitanya schools network, established 2009. Open Monday–Saturday, 8:30 AM–5:00 PM.'
WHERE id = '815da18b-0f58-4d57-bca4-d9daa5485e65';

UPDATE school_details SET
  school_hours_start = '08:30:00',
  school_hours_end   = '17:00:00'
WHERE school_id = '815da18b-0f58-4d57-bca4-d9daa5485e65';

DELETE FROM school_curricula WHERE school_id = '815da18b-0f58-4d57-bca4-d9daa5485e65';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '815da18b-0f58-4d57-bca4-d9daa5485e65', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '815da18b-0f58-4d57-bca4-d9daa5485e65')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CHRIST ACADEMY
-- DB area "Bannerghatta Road" — confirmed (Sakalwara Post, Begur Koppa Road,
-- Bannerghatta)
-- Source: christacademy.in, icbse.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  address_line1 = 'Christ Nagar, Hullahalli, Begur Koppa Road',
  address_line2 = 'Sakalwara Post, Bannerghatta',
  pincode = '560083',
  phone = '+91 9448204411',
  website = 'https://www.christacademy.in',
  description = 'ICSE/ISC co-ed day school on Begur Koppa Road, Bannerghatta, run by the Christ educational trust.'
WHERE id = '640b137f-9cd9-4007-a888-4d88e6b3adec';

DELETE FROM school_curricula WHERE school_id = '640b137f-9cd9-4007-a888-4d88e6b3adec';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '640b137f-9cd9-4007-a888-4d88e6b3adec', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '640b137f-9cd9-4007-a888-4d88e6b3adec')
ON CONFLICT DO NOTHING;

INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '640b137f-9cd9-4007-a888-4d88e6b3adec', 'Nursery', 'Class 12', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '640b137f-9cd9-4007-a888-4d88e6b3adec')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CHRYSALIS HIGH (Whitefield / Kadugodi campus)
-- DB area "Whitefield" — confirmed
-- Source: chrysalishigh.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  address_line1 = 'Sy. No 125, Kumbena Agrahara, Kadugodi Road',
  address_line2 = 'Behind HP Petrol Pump, Whitefield',
  pincode = '560067',
  phone = '+91-95352 33040',
  email = 'info.kadugodi@chrysalishigh.com',
  website = 'https://chrysalishigh.com',
  description = 'CBSE campus of the Chrysalis High network, spread across ~4 acres with a Semi-Olympic swimming pool, futsal ground, and basketball court.'
WHERE id = 'a0ea665a-8753-49c3-975d-129e7a51c728';

DELETE FROM school_curricula WHERE school_id = 'a0ea665a-8753-49c3-975d-129e7a51c728';
INSERT INTO school_curricula (school_id, curriculum)
SELECT 'a0ea665a-8753-49c3-975d-129e7a51c728', 'cbse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = 'a0ea665a-8753-49c3-975d-129e7a51c728')
ON CONFLICT DO NOTHING;

INSERT INTO school_sports (school_id, sport_id)
SELECT 'a0ea665a-8753-49c3-975d-129e7a51c728', id FROM sports
WHERE name IN ('Cricket', 'Basketball', 'Swimming', 'Gymnastics', 'Chess')
AND EXISTS (SELECT 1 FROM schools WHERE id = 'a0ea665a-8753-49c3-975d-129e7a51c728')
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT 'a0ea665a-8753-49c3-975d-129e7a51c728', id FROM extracurriculars
WHERE name IN ('Music', 'Dance', 'Drama', 'Karate', 'Yoga')
AND EXISTS (SELECT 1 FROM schools WHERE id = 'a0ea665a-8753-49c3-975d-129e7a51c728')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CHRYSALIS HIGH MARATHAHALLI
-- DB area "Marathahalli" — address corrected to Gunjur, Marathahalli-Sarjapur Road.
-- Source: schoolmykids.com, chrysalishigh.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  address_line1 = 'Sy No. 219/3 & 219/5, Gunjur',
  address_line2 = 'Marathahalli-Sarjapur Road',
  pincode = '560087',
  phone = '+91 8861063812',
  email = 'support.varthur@chrysalishigh.com',
  website = 'https://www.chrysalishigh.com',
  description = 'CISCE (ICSE) co-ed day school on Marathahalli-Sarjapur Road, offering Nursery to Class XII.'
WHERE id = '2c6e87af-9273-444c-9a73-1dfc139b4ff0';

DELETE FROM school_curricula WHERE school_id = '2c6e87af-9273-444c-9a73-1dfc139b4ff0';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '2c6e87af-9273-444c-9a73-1dfc139b4ff0', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '2c6e87af-9273-444c-9a73-1dfc139b4ff0')
ON CONFLICT DO NOTHING;

INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '2c6e87af-9273-444c-9a73-1dfc139b4ff0', 'Nursery', 'Class 12', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '2c6e87af-9273-444c-9a73-1dfc139b4ff0')
ON CONFLICT DO NOTHING;

INSERT INTO school_sports (school_id, sport_id)
SELECT '2c6e87af-9273-444c-9a73-1dfc139b4ff0', id FROM sports
WHERE name IN ('Cricket', 'Basketball', 'Swimming', 'Gymnastics', 'Chess')
AND EXISTS (SELECT 1 FROM schools WHERE id = '2c6e87af-9273-444c-9a73-1dfc139b4ff0')
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT '2c6e87af-9273-444c-9a73-1dfc139b4ff0', id FROM extracurriculars
WHERE name IN ('Music', 'Dance', 'Drama', 'Karate', 'Yoga')
AND EXISTS (SELECT 1 FROM schools WHERE id = '2c6e87af-9273-444c-9a73-1dfc139b4ff0')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CHRYSALIS HIGH VARTHUR
-- NOTE: Research found only ONE Chrysalis campus in the Marathahalli/Varthur
-- corridor (Gunjur, Marathahalli-Sarjapur Road) — the same campus matched
-- above for "Chrysalis High Marathahalli". This entry is very likely a
-- DUPLICATE of that school in the DB. Flagging via description only;
-- NOT deleting/merging without your confirmation.
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  description = 'POSSIBLE DUPLICATE: research suggests this may be the same campus as "Chrysalis High Marathahalli" (Gunjur, Marathahalli-Sarjapur Road, 560087) — only one Chrysalis campus was found in this corridor. Flagged for manual review/de-duplication.'
WHERE id = 'c4f5504b-2ed2-4b3d-b06a-bd199bfa73ed';


-- ────────────────────────────────────────────────────────────────────────────
-- CHRYSALIS KIDS
-- DB area "Whitefield" — confirmed
-- Source: chrysaliskids.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  address_line1 = '#3 & 4, Giddens Layout',
  address_line2 = 'Behind First Cry, Whitefield',
  pincode = '560066',
  phone = '+91-70223 76607',
  email = 'support.whitefield@chrysaliskids.com',
  website = 'https://www.chrysaliskids.com',
  type = 'private',
  description = 'Montessori-curriculum preschool/daycare serving Pre-School to Sr. KG2. Play School hours 9:30–11:30 AM; Nursery/Jr.KG/Sr.KG hours 8:30 AM–12:30 PM.'
WHERE id = 'b60fd775-9c08-4f89-817b-899f938b8e7a';

UPDATE school_details SET
  school_hours_start = '08:30:00',
  school_hours_end   = '12:30:00'
WHERE school_id = 'b60fd775-9c08-4f89-817b-899f938b8e7a';


-- ────────────────────────────────────────────────────────────────────────────
-- CLARENCE HIGH SCHOOL
-- DB area was "Indiranagar" — actual location is Richards Town / Cox Town.
-- Source: clarencehighschool.in, Wikipedia, edustoke.com
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  area = 'Richards Town',
  address_line1 = 'Richards Town',
  address_line2 = 'Near Cox Town',
  pincode = '560005',
  phone = '+91 804 633 4633',
  website = 'https://clarencehighschool.in',
  established_year = 1914,
  description = 'A co-educational Christian minority day school founded in 1914 by the Redwood brothers (named after Clarence School, Somerset, UK). Offers CISCE curriculum from Prep to Class XII. Sports facilities include a playground at Cox Town (Assaye Road), a basketball court and three covered pavilions; hosts the annual "Clarencian Shield" inter-school basketball tournament. Football, cricket and throw-ball are also played.'
WHERE id = '2e83a6fc-085a-4f2f-bed3-77061f947f61';

DELETE FROM school_curricula WHERE school_id = '2e83a6fc-085a-4f2f-bed3-77061f947f61';
INSERT INTO school_curricula (school_id, curriculum)
SELECT '2e83a6fc-085a-4f2f-bed3-77061f947f61', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '2e83a6fc-085a-4f2f-bed3-77061f947f61')
ON CONFLICT DO NOTHING;

INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT '2e83a6fc-085a-4f2f-bed3-77061f947f61', 'Prep', 'Class 12', 'icse'
WHERE EXISTS (SELECT 1 FROM schools WHERE id = '2e83a6fc-085a-4f2f-bed3-77061f947f61')
ON CONFLICT DO NOTHING;

INSERT INTO school_sports (school_id, sport_id)
SELECT '2e83a6fc-085a-4f2f-bed3-77061f947f61', id FROM sports
WHERE name IN ('Basketball', 'Cricket', 'Football')
AND EXISTS (SELECT 1 FROM schools WHERE id = '2e83a6fc-085a-4f2f-bed3-77061f947f61')
ON CONFLICT DO NOTHING;


-- ────────────────────────────────────────────────────────────────────────────
-- CLARENCE PU COLLEGE
-- NOTE: Research found NO separate "Clarence PU College" — Clarence High
-- School itself runs through to Class XII (CISCE doesn't have a separate PU
-- stream). This DB entry may be erroneous/duplicate. Flagging via description
-- only; NOT deleting without your confirmation.
-- ────────────────────────────────────────────────────────────────────────────
UPDATE schools SET
  area = 'Richards Town',
  description = 'POSSIBLE DUPLICATE/ERRONEOUS ENTRY: research found no separate "Clarence PU College" — Clarence High School (Richards Town, CISCE) runs directly through to Class XII without a distinct PU college. Flagged for manual review.'
WHERE id = '16685c27-2273-45c5-8c20-da89ef36eaf8';
