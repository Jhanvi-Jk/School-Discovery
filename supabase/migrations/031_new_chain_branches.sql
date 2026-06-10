-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 031 — Add missing real-world branches for major school chains
-- (DPS, VIBGYOR, Greenwood High, Christ School, GIIS), with sports,
-- extracurriculars, contact, address, curriculum and grade data researched
-- from official websites and school directories.
-- ─────────────────────────────────────────────────────────────────────────────

-- ══════════════════════════════════════════════════════════════════════════════
-- 1. DELHI PUBLIC SCHOOL WHITEFIELD
-- Source: dpswhitefield.org, schoolmykids.com
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO schools (slug, name, description, established_year, type, gender, area, address_line1, address_line2, city, pincode, website)
VALUES (
  'delhi-public-school-whitefield-bengaluru',
  'Delhi Public School Whitefield',
  'CBSE day school on a 6-acre campus with a 2-acre professional sports ground. Strong focus on football and cricket coaching, plus art, music, dance and technology clubs. Hosts DWMUN (DPS Whitefield Model United Nations) and a Student Exchange Programme.',
  NULL, 'private', 'coed', 'Whitefield', 'Survey No. 123/123, Mallasandra Village', 'Hoskote Taluk, Whitefield', 'Bengaluru', '560067', 'https://dpswhitefield.org'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO school_curricula (school_id, curriculum)
SELECT id, 'cbse' FROM schools WHERE slug = 'delhi-public-school-whitefield-bengaluru'
ON CONFLICT DO NOTHING;

INSERT INTO school_details (school_id, has_transport)
SELECT id, TRUE FROM schools WHERE slug = 'delhi-public-school-whitefield-bengaluru'
ON CONFLICT (school_id) DO NOTHING;

INSERT INTO school_sports (school_id, sport_id)
SELECT s.id, sp.id FROM schools s, sports sp
WHERE s.slug = 'delhi-public-school-whitefield-bengaluru' AND sp.name IN ('Cricket', 'Football')
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT s.id, e.id FROM schools s, extracurriculars e
WHERE s.slug = 'delhi-public-school-whitefield-bengaluru' AND e.name IN ('Music', 'Dance', 'Painting', 'MUN')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- 2. VIBGYOR HIGH YELAHANKA
-- Source: vibgyorhigh.com, edarabia.com, schoolmykids.com
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO schools (slug, name, description, established_year, type, gender, area, address_line1, address_line2, city, pincode, website)
VALUES (
  'vibgyor-high-yelahanka-bengaluru',
  'VIBGYOR High Yelahanka',
  'CBSE school with a structured Sports & Performing Arts (SPA) curriculum. Campus features a gymnasium, kids'' play area, football pitch, skating rink and music room. Extracurriculars include Nature''s Club, Greaders Club and VIBGYOR Model United Nations.',
  NULL, 'private', 'coed', 'Yelahanka', 'Survey No 80/81, Singanayakanahalli', 'Off Doddaballapura Main Road, Yelahanka', 'Bengaluru', '560064', 'https://www.vibgyorhigh.com/school/bengaluru/cbse/yelahanka'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO school_curricula (school_id, curriculum)
SELECT id, 'cbse' FROM schools WHERE slug = 'vibgyor-high-yelahanka-bengaluru'
ON CONFLICT DO NOTHING;

INSERT INTO school_sports (school_id, sport_id)
SELECT s.id, sp.id FROM schools s, sports sp
WHERE s.slug = 'vibgyor-high-yelahanka-bengaluru' AND sp.name IN ('Football')
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT s.id, e.id FROM schools s, extracurriculars e
WHERE s.slug = 'vibgyor-high-yelahanka-bengaluru' AND e.name IN ('Music', 'Dance', 'Drama', 'Painting', 'MUN', 'Nature Club')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- 3. VIBGYOR HIGH ELECTRONIC CITY
-- Source: sulekha.com, vibgyorhigh.com, ezyschooling.com
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO schools (slug, name, description, established_year, type, gender, area, address_line1, address_line2, city, pincode, phone, website)
VALUES (
  'vibgyor-high-electronic-city-bengaluru',
  'VIBGYOR High Electronic City',
  'CBSE & CISCE affiliated school established 2012. Campus equipped with a football pitch, skating rink and gymnasium. Sports offered include football, cricket, basketball, swimming, skating and karate.',
  2012, 'private', 'coed', 'Electronic City', 'Survey No. 45/1 & 112, Village Vittasandra', 'Begur Hobli, Bengaluru South Taluk, Electronic City', 'Bengaluru', '560100', '+91-80-2441 0400', 'https://www.vibgyorhigh.com/school/bengaluru/cbse/electronic-city'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO school_curricula (school_id, curriculum)
SELECT id, c FROM schools s, (VALUES ('cbse'::curriculum_type), ('icse'::curriculum_type)) AS v(c)
WHERE s.slug = 'vibgyor-high-electronic-city-bengaluru'
ON CONFLICT DO NOTHING;

INSERT INTO school_sports (school_id, sport_id)
SELECT s.id, sp.id FROM schools s, sports sp
WHERE s.slug = 'vibgyor-high-electronic-city-bengaluru' AND sp.name IN ('Football', 'Cricket', 'Basketball', 'Swimming')
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT s.id, e.id FROM schools s, extracurriculars e
WHERE s.slug = 'vibgyor-high-electronic-city-bengaluru' AND e.name IN ('Karate', 'Music', 'Dance', 'MUN')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- 4. GREENWOOD HIGH WHITEFIELD (pre-school / campus)
-- Source: greenwoodhigh.edu.in, sulekha.com, proeves.com
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO schools (slug, name, description, established_year, type, gender, area, address_line1, address_line2, city, pincode, phone, website)
VALUES (
  'greenwood-high-whitefield-bengaluru',
  'Greenwood High Whitefield',
  'Greenwood High pre-school and campus in Whitefield, part of the Greenwood High group (main ICSE/IB campuses in Sarjapur and Bannerghatta, with pre-schools across Koramangala, Jayanagar, JP Nagar, Electronic City and Whitefield).',
  NULL, 'private', 'coed', 'Whitefield', '#333, Ward No. 84, ECC Road', 'Opp. Gold''s Gym, Hagadoor Main Road, Whitefield', 'Bengaluru', '560066', '+91-7829917501', 'https://greenwoodhigh.edu.in'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO school_curricula (school_id, curriculum)
SELECT id, 'icse' FROM schools WHERE slug = 'greenwood-high-whitefield-bengaluru'
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT s.id, e.id FROM schools s, extracurriculars e
WHERE s.slug = 'greenwood-high-whitefield-bengaluru' AND e.name IN ('Music', 'Dance', 'Painting')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- 5. CHRIST SCHOOL S.G. PALYA
-- Source: oakveda.com, ezyschooling.com, edustoke.com
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO schools (slug, name, description, established_year, type, gender, area, address_line1, address_line2, city, pincode, website)
VALUES (
  'christ-school-sg-palya-bengaluru',
  'Christ School S.G. Palya',
  'State Board / ICSE school (LKG to Class 10) on Christ School Road, S.G. Palya, distinct from Christ Academy (Bannerghatta Road). Smart classrooms, indoor and outdoor sports facilities, library/reading room, playground and active alumni association. Extracurriculars include art and craft, dance, drama and music plus regular picnics and excursions.',
  NULL, 'private', 'coed', 'S.G. Palya', 'Christ School Road', 'Dharmaram College Post, S.G. Palya', 'Bengaluru', '560029', 'https://christschoolsgpalya.edu.in'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO school_curricula (school_id, curriculum)
SELECT id, c FROM schools s, (VALUES ('icse'::curriculum_type), ('state_board'::curriculum_type)) AS v(c)
WHERE s.slug = 'christ-school-sg-palya-bengaluru'
ON CONFLICT DO NOTHING;

INSERT INTO school_grades (school_id, grade_from, grade_to, curriculum)
SELECT id, 'LKG', 'Class 10', 'icse' FROM schools WHERE slug = 'christ-school-sg-palya-bengaluru'
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT s.id, e.id FROM schools s, extracurriculars e
WHERE s.slug = 'christ-school-sg-palya-bengaluru' AND e.name IN ('Music', 'Dance', 'Drama', 'Painting')
ON CONFLICT DO NOTHING;


-- ══════════════════════════════════════════════════════════════════════════════
-- 6. GIIS WHITEFIELD CAMPUS (Global Indian International School)
-- Source: globalindianschool.org, ezyschooling.com, urbanpro.com
-- ══════════════════════════════════════════════════════════════════════════════
INSERT INTO schools (slug, name, description, established_year, type, gender, area, address_line1, address_line2, city, pincode, phone, website)
VALUES (
  'giis-whitefield-bengaluru',
  'Global Indian International School Whitefield',
  'International day school (KG to Grade 12) offering CBSE, Cambridge (CLSP and IGCSE) and the Global Montessori Plus programme. Extensive sports facilities including basketball, football, skating and athletics, plus dedicated dance, music and art & craft rooms.',
  2013, 'international', 'coed', 'Whitefield', 'No. 5, 6, 8 Heggondanahalli Village', 'Whitefield-Sarjapur Main Road, Gunjur Post', 'Bengaluru', '560087', '+91-7588886800', 'https://globalindianschool.org/bangalore/whitefield/'
)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO school_curricula (school_id, curriculum)
SELECT id, c FROM schools s, (VALUES ('cbse'::curriculum_type), ('igcse'::curriculum_type)) AS v(c)
WHERE s.slug = 'giis-whitefield-bengaluru'
ON CONFLICT DO NOTHING;

INSERT INTO school_sports (school_id, sport_id)
SELECT s.id, sp.id FROM schools s, sports sp
WHERE s.slug = 'giis-whitefield-bengaluru' AND sp.name IN ('Basketball', 'Football', 'Athletics')
ON CONFLICT DO NOTHING;

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT s.id, e.id FROM schools s, extracurriculars e
WHERE s.slug = 'giis-whitefield-bengaluru' AND e.name IN ('Music', 'Dance', 'Painting')
ON CONFLICT DO NOTHING;
