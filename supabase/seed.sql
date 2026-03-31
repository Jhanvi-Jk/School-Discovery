-- ============================================================
-- Seed Data — School Discovery Platform
-- Uses name-based lookups so IDs never matter
-- ============================================================

-- Sports lookup
INSERT INTO sports (name) VALUES
  ('Cricket'), ('Football'), ('Basketball'), ('Tennis'), ('Swimming'),
  ('Badminton'), ('Table Tennis'), ('Athletics'), ('Volleyball'), ('Hockey'),
  ('Chess'), ('Gymnastics'), ('Cycling'), ('Kabaddi'), ('Kho-Kho');

-- Extracurriculars lookup
INSERT INTO extracurriculars (name, category) VALUES
  ('Music', 'arts'), ('Dance', 'arts'), ('Drama', 'arts'), ('Painting', 'arts'),
  ('Robotics', 'tech'), ('Coding', 'tech'), ('Debate', 'academic'),
  ('MUN', 'academic'), ('Photography', 'arts'), ('Creative Writing', 'academic'),
  ('Yoga', 'wellness'), ('Karate', 'wellness'), ('NCC', 'discipline'),
  ('Scout', 'discipline'), ('Nature Club', 'environment');

-- Sample schools
INSERT INTO schools (id, slug, name, description, established_year, type, gender, verified, area, city, pincode, latitude, longitude, cover_image_url, logo_url)
VALUES
  (
    'a1b2c3d4-0001-0001-0001-000000000001',
    'delhi-public-school-east',
    'Delhi Public School East',
    'One of the premier CBSE schools in Bengaluru, known for academic excellence and holistic development.',
    1982, 'private', 'coed', true,
    'Whitefield', 'Bengaluru', '560066',
    12.9698, 77.7500,
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    NULL
  ),
  (
    'a1b2c3d4-0002-0002-0002-000000000002',
    'bishop-cottons-boys',
    'Bishop Cotton''s Boys'' School',
    'Established in 1865, Bishop Cotton''s is one of India''s oldest and most prestigious boarding schools.',
    1865, 'private', 'boys', true,
    'Sadashivanagar', 'Bengaluru', '560001',
    12.9942, 77.5706,
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800',
    NULL
  ),
  (
    'a1b2c3d4-0003-0003-0003-000000000003',
    'inventure-academy',
    'Inventure Academy',
    'A progressive IB & IGCSE school with a focus on inquiry-based learning and entrepreneurial thinking.',
    2005, 'private', 'coed', true,
    'Sarjapur', 'Bengaluru', '560035',
    12.8970, 77.7000,
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800',
    NULL
  ),
  (
    'a1b2c3d4-0004-0004-0004-000000000004',
    'national-public-school-koramangala',
    'National Public School Koramangala',
    'NPS Koramangala is a top-ranked CBSE school offering world-class education in the heart of the city.',
    1992, 'private', 'coed', true,
    'Koramangala', 'Bengaluru', '560034',
    12.9352, 77.6244,
    'https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800',
    NULL
  ),
  (
    'a1b2c3d4-0005-0005-0005-000000000005',
    'canadian-international-school',
    'Canadian International School',
    'Offering IB PYP, MYP, DP programmes with a truly international community from 40+ countries.',
    1996, 'international', 'coed', true,
    'Yelahanka', 'Bengaluru', '560064',
    13.1007, 77.5963,
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800',
    NULL
  );

-- School details
INSERT INTO school_details (
  school_id, student_count, teacher_count, student_teacher_ratio,
  school_hours_start, school_hours_end, has_transport,
  annual_tuition_fees_min, annual_tuition_fees_max,
  development_fees, transport_fees, activity_fees, admission_fees,
  total_fees_min, total_fees_max
) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 3200, 160, 20.0, '08:00', '15:30', true,  85000, 100000, 25000, 18000, 12000, 5000,  145000, 160000),
  ('a1b2c3d4-0002-0002-0002-000000000002', 1800, 120, 15.0, '07:30', '14:30', true,  120000, 140000, 30000, 20000, 15000, 8000, 193000, 213000),
  ('a1b2c3d4-0003-0003-0003-000000000003', 900,  90,  10.0, '08:00', '15:00', true,  250000, 300000, 50000, 25000, 20000, 10000, 355000, 405000),
  ('a1b2c3d4-0004-0004-0004-000000000004', 2800, 140, 20.0, '08:00', '15:00', true,  90000,  110000, 28000, 20000, 12000, 6000,  156000, 176000),
  ('a1b2c3d4-0005-0005-0005-000000000005', 1200, 100, 12.0, '08:30', '15:30', true,  400000, 500000, 75000, 35000, 30000, 15000, 555000, 655000);

-- Curricula
INSERT INTO school_curricula (school_id, curriculum) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'cbse'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'icse'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'ib'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'igcse'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'cbse'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'ib');

-- Grades
INSERT INTO school_grades (school_id, grade_from, grade_to) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'LKG', 'Grade 12'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Grade 5', 'Grade 12'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'Grade 1', 'Grade 12'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'Nursery', 'Grade 12'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'Grade 1', 'Grade 12');

-- Languages
INSERT INTO school_languages (school_id, language, type) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', 'English', 'medium_of_instruction'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Kannada', 'offered_as_subject'),
  ('a1b2c3d4-0001-0001-0001-000000000001', 'Hindi', 'offered_as_subject'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'English', 'medium_of_instruction'),
  ('a1b2c3d4-0002-0002-0002-000000000002', 'Kannada', 'offered_as_subject'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'English', 'medium_of_instruction'),
  ('a1b2c3d4-0003-0003-0003-000000000003', 'French', 'offered_as_subject'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'English', 'medium_of_instruction'),
  ('a1b2c3d4-0004-0004-0004-000000000004', 'Hindi', 'offered_as_subject'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'English', 'medium_of_instruction'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'French', 'offered_as_subject'),
  ('a1b2c3d4-0005-0005-0005-000000000005', 'German', 'offered_as_subject');

-- Sports — lookup by name so IDs don't matter
INSERT INTO school_sports (school_id, sport_id)
SELECT 'a1b2c3d4-0001-0001-0001-000000000001', id FROM sports WHERE name IN ('Cricket', 'Football', 'Swimming', 'Chess');

INSERT INTO school_sports (school_id, sport_id)
SELECT 'a1b2c3d4-0002-0002-0002-000000000002', id FROM sports WHERE name IN ('Cricket', 'Football', 'Basketball', 'Swimming');

INSERT INTO school_sports (school_id, sport_id)
SELECT 'a1b2c3d4-0003-0003-0003-000000000003', id FROM sports WHERE name IN ('Football', 'Basketball', 'Swimming', 'Tennis');

INSERT INTO school_sports (school_id, sport_id)
SELECT 'a1b2c3d4-0004-0004-0004-000000000004', id FROM sports WHERE name IN ('Cricket', 'Football', 'Badminton', 'Chess');

INSERT INTO school_sports (school_id, sport_id)
SELECT 'a1b2c3d4-0005-0005-0005-000000000005', id FROM sports WHERE name IN ('Football', 'Basketball', 'Tennis', 'Swimming');

-- Extracurriculars — lookup by name so IDs don't matter
INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT 'a1b2c3d4-0001-0001-0001-000000000001', id FROM extracurriculars WHERE name IN ('Music', 'Dance', 'Debate');

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT 'a1b2c3d4-0002-0002-0002-000000000002', id FROM extracurriculars WHERE name IN ('Music', 'Drama', 'Debate', 'MUN');

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT 'a1b2c3d4-0003-0003-0003-000000000003', id FROM extracurriculars WHERE name IN ('Robotics', 'Coding', 'Debate', 'MUN');

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT 'a1b2c3d4-0004-0004-0004-000000000004', id FROM extracurriculars WHERE name IN ('Music', 'Coding', 'Debate');

INSERT INTO school_extracurriculars (school_id, extracurricular_id)
SELECT 'a1b2c3d4-0005-0005-0005-000000000005', id FROM extracurriculars WHERE name IN ('Music', 'Dance', 'Robotics', 'MUN');

-- Admission windows
INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, is_mid_year, status, application_url) VALUES
  ('a1b2c3d4-0001-0001-0001-000000000001', '2026-27', 'LKG', 'Grade 12', '2026-01-01', '2026-03-31', false, 'open', 'https://dps-east.edu.in/admissions'),
  ('a1b2c3d4-0003-0003-0003-000000000003', '2026-27', 'Grade 1', 'Grade 12', '2026-02-01', '2026-04-30', false, 'open', NULL),
  ('a1b2c3d4-0003-0003-0003-000000000003', '2025-26', 'Grade 1', 'Grade 12', '2025-06-01', '2025-08-31', true, 'open', NULL),
  ('a1b2c3d4-0005-0005-0005-000000000005', '2026-27', 'Grade 1', 'Grade 12', '2026-01-15', '2026-05-15', false, 'open', NULL);
