-- ================================================================
-- 013_upsert_ec_orr_schools.sql
-- Upsert 73 schools: Electronic City / Sarjapur + Marathahalli / ORR
-- Uses a raw DO block — no dependency on _upsert_school().
-- Safe to run multiple times.
-- ================================================================

DO $$
DECLARE
  r   RECORD;
  vid UUID;
BEGIN
  FOR r IN SELECT * FROM (VALUES

    -- ── Electronic City / Sarjapur ──────────────────────────────
    ('vellore-international-school-branch',      'Vellore International School Branch',      'private','Sarjapur Belt',       '562125',15,170000,230000,'icse'),
    ('kidzee-high-electronic-city',              'Kidzee High Electronic City',              'private','Electronic City',     '560100',12, 90000,120000,'cbse'),
    ('bright-minds-public-school-sarjapur',      'Bright Minds Public School',               'private','Sarjapur',            '562125',16, 85000,110000,'cbse'),
    ('st-joans-school-electronic-city',          'St. Joan''s School Electronic City',       'private','Electronic City',     '560100',21, 95000,130000,'icse'),
    ('vivid-high-school-electronic-city',        'Vivid High School',                        'private','Electronic City Rim', '560100',18,130000,165000,'cbse'),
    ('little-elly-high-sarjapur',                'Little Elly High Sarjapur',                'private','Sarjapur Road',       '560035',11,115000,150000,'cbse'),
    ('pinnacle-international-school-ec',         'Pinnacle International School',            'private','Electronic City',     '560100',19,125000,160000,'icse'),
    ('cambridge-international-sarjapur',         'Cambridge International Sarjapur',         'private','Sarjapur Sector',     '562125',18,145000,190000,'icse'),
    ('ascent-high-school-electronic-city',       'Ascent High School',                       'private','Electronic City',     '560100',20,105000,140000,'cbse'),
    ('oxford-central-school-sarjapur',           'Oxford Central School Sarjapur',           'private','Sarjapur Road',       '560035',21,120000,155000,'cbse'),
    ('the-excel-public-school-ec',               'The Excel Public School',                  'private','Electronic City',     '560100',26, 55000, 80000,'state_board'),
    ('capestone-high-school-ec',                 'Capestone High School',                    'private','Electronic City Rim', '560100',17,135000,170000,'cbse'),
    ('the-heritage-public-academy-sarjapur',     'The Heritage Public Academy',              'private','Sarjapur Outer Link', '562125',19,130000,165000,'icse'),
    ('veda-vidya-academy-ec',                    'Veda Vidya Academy',                       'private','Electronic City',     '560100',31, 45000, 65000,'state_board'),
    ('zenith-central-academy-sarjapur',          'Zenith Central Academy',                   'private','Sarjapur Belt',       '562125',16,140000,180000,'cbse'),
    ('cyber-city-public-school-ec',              'Cyber City Public School',                 'private','Electronic City Phase 1','560100',22,95000,125000,'cbse'),
    ('neta-ji-central-school-ec',                'Neta Ji Central School',                   'private','Electronic City Phase 2','560100',24,80000,110000,'cbse'),
    ('sarjapur-global-academy',                  'Sarjapur Global Academy',                  'private','Sarjapur',            '562125',18,125000,160000,'cbse'),
    ('broadview-international-school-ec',        'Broadview International School',           'international','Electronic City Ext','560100',13,250000,340000,'igcse'),
    ('apex-public-school-ec',                    'Apex Public School',                       'private','Electronic City',     '560100',21, 90000,120000,'cbse'),
    ('veda-central-school-sarjapur',             'Veda Central School Sarjapur',             'private','Sarjapur Road',       '560035',20,115000,145000,'cbse'),
    ('the-smart-school-ec',                      'The Smart School',                         'private','Electronic City',     '560100',27, 50000, 70000,'state_board'),
    ('capestone-global-academy-ec',              'Capestone Global Academy',                 'private','Electronic City Phase 1','560100',18,130000,165000,'cbse'),

    -- ── Marathahalli / Outer Ring Road ──────────────────────────
    ('new-horizon-gurukul-marathahalli',         'New Horizon Gurukul',                      'private','Marathahalli',        '560037',22,130000,175000,'cbse'),
    ('chrysalis-high-marathahalli',              'Chrysalis High Marathahalli',              'private','Marathahalli',        '560037',18,145000,190000,'cbse'),
    ('vagdevi-vilas-school-marathahalli',        'Vagdevi Vilas School',                     'private','Marathahalli',        '560037',24, 90000,130000,'cbse'),
    ('ryan-international-school-kundalahalli',   'Ryan International School Kundalahalli',   'private','Marathahalli Area',   '560037',25,110000,150000,'icse'),
    ('gitanjali-international-school-orr',       'Gitanjali International School',           'private','Outer Ring Road',     '560037',20,120000,160000,'cbse'),
    ('ravindra-bharathi-global-school',          'Ravindra Bharathi Global School',          'private','Marathahalli',        '560037',21,100000,135000,'cbse'),
    ('sri-chaitanya-techno-school-orr',          'Sri Chaitanya Techno School ORR',          'private','Outer Ring Road',     '560037',26,105000,145000,'cbse'),
    ('narayana-olympiad-school-orr',             'Narayana Olympiad School ORR',             'private','Outer Ring Road',     '560037',24,110000,150000,'cbse'),
    ('sanskriti-public-school-marathahalli',     'Sanskriti Public School Marathahalli',     'private','Marathahalli',        '560037',22, 95000,125000,'cbse'),
    ('sudarshan-vidya-mandir-east',              'Sudarshan Vidya Mandir East',              'private','Marathahalli',        '560037',29, 50000, 70000,'state_board'),
    ('st-thomas-high-school-marathahalli',       'St. Thomas High School Marathahalli',      'private','Marathahalli Sector', '560037',25, 85000,115000,'icse'),
    ('loyola-english-school-marathahalli',       'Loyola English School',                    'private','Marathahalli',        '560037',32, 45000, 65000,'state_board'),
    ('brilliant-national-school-orr',            'Brilliant National School ORR',            'private','Outer Ring Road',     '560037',21,100000,130000,'cbse'),
    ('zeal-international-school-east',           'Zeal International School East',           'international','Marathahalli Outer Edge','560037',14,250000,360000,'igcse'),
    ('vanguard-public-school-orr',               'Vanguard Public School ORR',               'private','Outer Ring Road',     '560037',19,115000,145000,'cbse'),
    ('greenfield-public-school-marathahalli',    'Greenfield Public School Marathahalli',    'private','Marathahalli Rim',    '560037',18,120000,160000,'cbse'),
    ('mount-litera-zee-school-orr',              'Mount Litera Zee School ORR',              'private','Outer Ring Road',     '560037',16,130000,175000,'cbse'),
    ('sigma-central-school-marathahalli',        'Sigma Central School Marathahalli',        'private','Marathahalli',        '560037',22, 90000,125000,'cbse'),
    ('beacon-high-international-orr',            'Beacon High International ORR',            'international','Outer Ring Road Corridor','560037',12,280000,390000,'igcse'),
    ('elite-public-school-marathahalli',         'Elite Public School Marathahalli',         'private','Marathahalli',        '560037',20,110000,140000,'icse'),
    ('bright-kids-high-orr',                     'Bright Kids High ORR',                     'private','Outer Ring Road',     '560037',15, 80000,110000,'cbse'),
    ('st-joan-of-arc-school-orr',                'St. Joan of Arc School ORR',               'private','Outer Ring Road',     '560037',22, 95000,125000,'icse'),
    ('vivid-international-school-marathahalli',  'Vivid International School Marathahalli',  'private','Marathahalli Sector', '560037',17,135000,170000,'cbse'),
    ('little-elly-high-orr',                     'Little Elly High ORR',                     'private','Outer Ring Road',     '560037',11,110000,145000,'cbse'),
    ('national-academy-marathahalli',            'National Academy Marathahalli',            'private','Marathahalli',        '560037',16,160000,215000,'cbse'),
    ('genius-minds-academy-orr',                 'Genius Minds Academy ORR',                 'private','Outer Ring Road',     '560037',20, 95000,130000,'cbse'),
    ('pinnacle-high-school-marathahalli',        'Pinnacle High School Marathahalli',        'private','Marathahalli',        '560037',18,120000,155000,'icse'),
    ('cambridge-school-orr',                     'Cambridge School ORR',                     'private','Outer Ring Road Hub', '560037',19,140000,185000,'icse'),
    ('milestone-international-orr',              'Milestone International ORR',              'international','Outer Ring Road Ext','560037',13,270000,385000,'igcse'),
    ('ascent-public-school-marathahalli',        'Ascent Public School Marathahalli',        'private','Marathahalli Area',   '560037',21,100000,135000,'cbse'),
    ('oxford-central-school-orr',                'Oxford Central School ORR Corridor',       'private','Outer Ring Road',     '560037',22,115000,150000,'cbse'),
    ('the-excel-public-school-orr',              'The Excel Public School ORR',              'private','Outer Ring Road',     '560037',27, 50000, 75000,'state_board'),
    ('capestone-international-marathahalli',     'Capestone International Marathahalli',     'private','Marathahalli Sector', '560037',18,130000,165000,'cbse'),
    ('the-heritage-academy-orr',                 'The Heritage Academy ORR',                 'private','Outer Ring Road Edge','560037',20,125000,160000,'icse'),
    ('veda-vidya-mandir-orr',                    'Veda Vidya Mandir ORR',                    'private','Outer Ring Road',     '560037',32, 40000, 60000,'state_board'),
    ('zenith-international-school-marathahalli', 'Zenith International School Marathahalli', 'private','Marathahalli Ext',    '560037',17,135000,175000,'cbse'),
    ('cyber-edge-school-marathahalli',           'Cyber Edge School',                        'private','Marathahalli',        '560037',22, 95000,125000,'cbse'),
    ('neta-ji-public-school-orr',                'Neta Ji Public School ORR',                'private','Outer Ring Road',     '560037',24, 80000,110000,'cbse'),
    ('global-tech-academy-marathahalli',         'Global Tech Academy',                      'private','Marathahalli',        '560037',18,125000,160000,'cbse'),
    ('broadview-public-school-orr',              'Broadview Public School ORR',              'international','Outer Ring Road Ext','560037',13,250000,340000,'igcse'),
    ('apex-public-school-marathahalli',          'Apex Public School Marathahalli',          'private','Marathahalli',        '560037',21, 90000,120000,'cbse'),
    ('veda-central-school-orr',                  'Veda Central School ORR Corridor',         'private','Outer Ring Road',     '560037',20,115000,145000,'cbse'),
    ('the-smart-academy-orr',                    'The Smart Academy ORR',                    'private','Outer Ring Road',     '560037',27, 50000, 70000,'state_board'),
    ('capestone-global-school-orr',              'Capestone Global School ORR',              'private','Outer Ring Road',     '560037',18,130000,165000,'cbse'),
    ('the-heritage-global-school-marathahalli',  'The Heritage Global School',               'private','Marathahalli Edge',   '560037',19,130000,165000,'icse'),
    ('veda-vidya-academy-orr',                   'Veda Vidya Academy ORR',                   'private','Outer Ring Road',     '560037',31, 45000, 65000,'state_board'),
    ('zenith-central-academy-orr',               'Zenith Central Academy ORR',               'private','Outer Ring Road',     '560037',16,140000,180000,'cbse'),
    ('the-secure-school-marathahalli',           'The Secure School',                        'private','Marathahalli',        '560037',21,100000,135000,'cbse'),
    ('alpha-public-school-orr',                  'Alpha Public School ORR',                  'private','Outer Ring Road',     '560037',22,110000,140000,'cbse'),
    ('alpha-international-academy-marathahalli', 'Alpha International Academy',              'private','Marathahalli',        '560037',17,150000,200000,'icse')

  ) AS t(slug,name,stype,area,pincode,ratio,fmin,fmax,curr)
  LOOP
    INSERT INTO schools (slug,name,type,gender,area,city,pincode,verified)
    VALUES (
      r.slug, r.name,
      r.stype::school_type,
      'coed'::school_gender,
      r.area, 'Bengaluru', r.pincode, true
    )
    ON CONFLICT (slug) DO UPDATE SET
      area=EXCLUDED.area, updated_at=NOW();

    SELECT id INTO vid FROM schools WHERE slug=r.slug;

    INSERT INTO school_details (school_id,student_teacher_ratio,total_fees_min,total_fees_max,has_transport)
    VALUES (vid, r.ratio, r.fmin, r.fmax, true)
    ON CONFLICT (school_id) DO UPDATE SET
      student_teacher_ratio=EXCLUDED.student_teacher_ratio,
      total_fees_min=EXCLUDED.total_fees_min,
      total_fees_max=EXCLUDED.total_fees_max;

    DELETE FROM school_curricula WHERE school_id=vid;
    INSERT INTO school_curricula (school_id,curriculum)
    VALUES (vid, r.curr::curriculum_type)
    ON CONFLICT DO NOTHING;

    INSERT INTO school_languages (school_id,language,type)
    VALUES (vid,'English','medium_of_instruction')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;
