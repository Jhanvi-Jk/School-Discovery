-- Migration 021: Upsert ~40 additional Bangalore schools (Batch 2)
-- Monthly fees × 12 → annual.
-- Boys-only: Baldwin Boys', St. Joseph's Boys'.  Girls-only: Bishop Cotton Girls', Sophia High.

DO $$
DECLARE sid UUID;
BEGIN

  -- 1. The International School Bangalore (TISB)
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('The International School Bangalore', 'the-international-school-bangalore-tisb',
    'Bengaluru', 'Sarjapur', 12.8741, 77.7494,
    'Sarjapur Road', 'https://tisb.org', 2000, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='the-international-school-bangalore-tisb';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 1020000, 1104000, 1020000, 1104000, 9)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 2. National Public School (NPS) Indiranagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('National Public School Indiranagar', 'national-public-school-indiranagar-bangalore',
    'Bengaluru', 'Indiranagar', 12.9723, 77.6495,
    'HAL 2nd Stage, Indiranagar', 'https://npsin.com', 1982, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='national-public-school-indiranagar-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 168000, 222000, 168000, 222000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 3. Mallya Aditi International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Mallya Aditi International School', 'mallya-aditi-international-school-bangalore',
    'Bengaluru', 'Yelahanka', 13.0975, 77.5878,
    'Yelahanka New Town', 'https://aditi.edu.in', 1984, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='mallya-aditi-international-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 600000, 660000, 600000, 660000, 10)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 4. The Valley School
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('The Valley School', 'the-valley-school-bangalore',
    'Bengaluru', 'Kanakapura Road', 12.8360, 77.5302,
    'Kanakapura Road, Thatguni', 'https://thevalleyschool.info', 1978, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='the-valley-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 480000, 516000, 480000, 516000, 12)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 5. Greenwood High International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Greenwood High International School', 'greenwood-high-international-school-bangalore',
    'Bengaluru', 'Sarjapur', 12.8687, 77.7516,
    'Sarjapur Road', 'https://greenwoodhigh.edu.in', 2004, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='greenwood-high-international-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 300000, 648000, 300000, 648000, 12)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 6. New Horizon Public School, Indiranagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('New Horizon Public School', 'new-horizon-public-school-indiranagar-bangalore',
    'Bengaluru', 'Indiranagar', 12.9641, 77.6415,
    '100 Feet Road, Indiranagar', 'https://nhps.in', 1970, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='new-horizon-public-school-indiranagar-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 156000, 180000, 156000, 180000, 22)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 7. Bethany High School, Koramangala
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Bethany High School', 'bethany-high-school-koramangala-bangalore',
    'Bengaluru', 'Koramangala', 12.9430, 77.6186,
    'Koramangala', 'https://bethanyhigh.in', 1954, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='bethany-high-school-koramangala-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 132000, 162000, 132000, 162000, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 8. Vidyashilp Academy, Yelahanka
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Vidyashilp Academy', 'vidyashilp-academy-yelahanka-bangalore',
    'Bengaluru', 'Yelahanka', 13.0911, 77.6044,
    'Yelahanka', 'https://vidyashilp.academy', 1996, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='vidyashilp-academy-yelahanka-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 300000, 456000, 300000, 456000, 12)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 9. Oakridge International School, Sarjapur
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Oakridge International School Bangalore', 'oakridge-international-school-bangalore',
    'Bengaluru', 'Sarjapur', 12.8524, 77.7554,
    'Sarjapur Road', 'https://oakridge.in/bangalore', 2012, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='oakridge-international-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 492000, 996000, 492000, 996000, 11)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 10. Canadian International School, Yelahanka
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Canadian International School Bangalore', 'canadian-international-school-yelahanka-bangalore',
    'Bengaluru', 'Yelahanka', 13.1162, 77.6067,
    'Yelahanka', 'https://canadianinternationalschool.com', 1996, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='canadian-international-school-yelahanka-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 792000, 1092000, 792000, 1092000, 8)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 11. Stonehill International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Stonehill International School', 'stonehill-international-school-bangalore',
    'Bengaluru', 'Hebbal', 13.1972, 77.6252,
    'Tarahunise, Jala Hobli', 'https://stonehill.in', 2008, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='stonehill-international-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 996000, 1500000, 996000, 1500000, 7)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 12. The Deens Academy, Whitefield
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('The Deens Academy', 'the-deens-academy-whitefield-bangalore',
    'Bengaluru', 'Whitefield', 12.9734, 77.7358,
    'Whitefield', 'https://deensacademy.com', 2006, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='the-deens-academy-whitefield-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 114000, 138000, 114000, 138000, 16)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 13. National Public School (NPS) Koramangala
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('National Public School Koramangala', 'national-public-school-koramangala-bangalore',
    'Bengaluru', 'Koramangala', 12.9427, 77.6204,
    'National Games Village, Koramangala', 'https://npskrm.com', 2003, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='national-public-school-koramangala-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 228000, 252000, 228000, 252000, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 14. Chrysalis High, Varthur
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Chrysalis High', 'chrysalis-high-varthur-bangalore',
    'Bengaluru', 'Whitefield', 12.9287, 77.7342,
    'Varthur', 'https://chrysalishigh.com', 2011, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='chrysalis-high-varthur-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 138000, 210000, 138000, 210000, 14)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 15. Ryan International School Bangalore, Kundalahalli
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Ryan International School Bangalore', 'ryan-international-school-kundalahalli-bangalore',
    'Bengaluru', 'Marathahalli', 12.9691, 77.7123,
    'Kundalahalli', 'https://ryaninternational.org', 1999, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='ryan-international-school-kundalahalli-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 96000, 198000, 96000, 198000, 25)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse'),(sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 16. BGS National Public School, Bannerghatta Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('BGS National Public School', 'bgs-national-public-school-bangalore',
    'Bengaluru', 'Bannerghatta Road', 12.8752, 77.6011,
    'Hulimavu, Bannerghatta Road', 'https://bgsnps.edu.in', 2006, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='bgs-national-public-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 78000, 249600, 78000, 249600, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 17. Legacy School Bangalore, Hennur
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Legacy School Bangalore', 'legacy-school-bangalore',
    'Bengaluru', 'Hebbal', 13.0614, 77.6491,
    'Hennur Bagalur Road', 'https://lsb.edu.in', 2009, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='legacy-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 696000, 948000, 696000, 948000, 10)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 18. Army Public School Bangalore
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Army Public School Bangalore', 'army-public-school-bangalore',
    'Bengaluru', 'Sadashivanagar', 12.9765, 77.6121,
    'Kamaraj Road', 'https://apsbangalore.edu.in', 1981, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='army-public-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 48000, 120000, 48000, 120000, 30)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 19. Presidency School, RT Nagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Presidency School RT Nagar', 'presidency-school-rt-nagar-bangalore',
    'Bengaluru', 'RT Nagar', 13.0182, 77.5954,
    'RT Nagar', 'https://presidencyschoolrt.org', 1976, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='presidency-school-rt-nagar-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 78000, 150000, 78000, 150000, 22)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 20. Vibgyor High School, Marathahalli
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Vibgyor High School Marathahalli', 'vibgyor-high-school-marathahalli-bangalore',
    'Bengaluru', 'Marathahalli', 12.9491, 77.6974,
    'Marathahalli', 'https://vibgyorhigh.com', 2004, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='vibgyor-high-school-marathahalli-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 150000, 348000, 150000, 348000, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse'),(sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 21. Ekya School, BTM Layout
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Ekya School BTM Layout', 'ekya-school-btm-layout-bangalore',
    'Bengaluru', 'BTM Layout', 12.9102, 77.6083,
    'BTM Layout', 'https://ekyaschools.com', 2010, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='ekya-school-btm-layout-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 189600, 210000, 189600, 210000, 14)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse'),(sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 22. Orchids The International School, Jalahalli
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Orchids The International School Jalahalli', 'orchids-international-school-jalahalli-bangalore',
    'Bengaluru', 'Rajajinagar', 13.0483, 77.5432,
    'Jalahalli', 'https://orchidsinternationalschool.com', 2002, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='orchids-international-school-jalahalli-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 108000, 162000, 108000, 162000, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 23. New Horizon Gurukul, Kadubeesanahalli
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('New Horizon Gurukul', 'new-horizon-gurukul-bangalore',
    'Bengaluru', 'Marathahalli', 12.9348, 77.6912,
    'Kadubeesanahalli', 'https://newhorizongurukul.in', 2010, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='new-horizon-gurukul-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 159600, 180000, 159600, 180000, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 24. Whitefield Global School
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Whitefield Global School', 'whitefield-global-school-bangalore',
    'Bengaluru', 'Whitefield', 12.9812, 77.7501,
    'Whitefield', 'https://wgs-cet.in', 2009, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='whitefield-global-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 114000, 156000, 114000, 156000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 25. Primus Public School, Sarjapur Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Primus Public School', 'primus-public-school-sarjapur-bangalore',
    'Bengaluru', 'Sarjapur', 12.8891, 77.6823,
    'Sarjapur Road', 'https://primusschool.edu.in', 2007, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='primus-public-school-sarjapur-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 132000, 174000, 132000, 174000, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 26. Sarvaloka Education, Whitefield (IGCSE)
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Sarvaloka Education', 'sarvaloka-education-whitefield-bangalore',
    'Bengaluru', 'Whitefield', 12.9542, 77.7410,
    'Whitefield', 'https://sarvaloka.org', 2016, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='sarvaloka-education-whitefield-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 300000, 420000, 300000, 420000, 10)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 27. Harvest International School, Sarjapur Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Harvest International School', 'harvest-international-school-bangalore',
    'Bengaluru', 'Sarjapur', 12.8592, 77.7103,
    'Sarjapur Road', 'https://harvestinternationalschool.in', 2008, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='harvest-international-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 126000, 186000, 126000, 186000, 14)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 28. Sherwood High, Bannerghatta Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Sherwood High', 'sherwood-high-bannerghatta-bangalore',
    'Bengaluru', 'Bannerghatta Road', 12.8391, 77.5921,
    'Bannerghatta Road', 'https://sherwoodhigh.com', 2010, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='sherwood-high-bannerghatta-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 117600, 168000, 117600, 168000, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 29. Baldwin Boys' High School (boys), Richmond Town
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Baldwin Boys'' High School', 'baldwin-boys-high-school-bangalore',
    'Bengaluru', 'Sadashivanagar', 12.9645, 77.6002,
    'Richmond Town', 'https://baldwinboyshighschool.edu.in', 1880, 'boys', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year, gender=EXCLUDED.gender;
  SELECT id INTO sid FROM schools WHERE slug='baldwin-boys-high-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 102000, 138000, 102000, 138000, 25)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 30. St. Joseph's Boys' High School (boys), Museum Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('St. Joseph''s Boys'' High School', 'st-josephs-boys-high-school-bangalore',
    'Bengaluru', 'Sadashivanagar', 12.9702, 77.6041,
    'Museum Road', 'https://sjbhshome.com', 1858, 'boys', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year, gender=EXCLUDED.gender;
  SELECT id INTO sid FROM schools WHERE slug='st-josephs-boys-high-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 90000, 126000, 90000, 126000, 24)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 31. Bishop Cotton Girls' School (girls)
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Bishop Cotton Girls'' School', 'bishop-cotton-girls-school-bangalore',
    'Bengaluru', 'Sadashivanagar', 12.9725, 77.6014,
    'St. Mark''s Road', 'https://bishopcottongirls.com', 1865, 'girls', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year, gender=EXCLUDED.gender;
  SELECT id INTO sid FROM schools WHERE slug='bishop-cotton-girls-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 126000, 162000, 126000, 162000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 32. Silver Oaks International School, Sarjapur
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Silver Oaks International School', 'silver-oaks-international-school-bangalore',
    'Bengaluru', 'Sarjapur', 12.8410, 77.7341,
    'Sarjapur Road', 'https://silveroaks.co.in', 2013, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='silver-oaks-international-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 168000, 234000, 168000, 234000, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 33. National Academy For Learning (NAFL), Basaveshwarnagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('National Academy For Learning', 'national-academy-for-learning-bangalore',
    'Bengaluru', 'Rajajinagar', 12.9862, 77.5354,
    'Basaveshwarnagar', 'https://nafl.in', 1994, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='national-academy-for-learning-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 192000, 240000, 192000, 240000, 16)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 34. Bangalore International School, Hennur Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Bangalore International School', 'bangalore-international-school-hennur',
    'Bengaluru', 'Hebbal', 13.0454, 77.6401,
    'Hennur Road', 'https://bangaloreinternationalschool.org', 1969, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='bangalore-international-school-hennur';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 660000, 1056000, 660000, 1056000, 8)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 35. Oasis International School, Hennur Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Oasis International School', 'oasis-international-school-bangalore',
    'Bengaluru', 'Hebbal', 13.0512, 77.6542,
    'Hennur Road', 'https://oasisintschool.org', 1999, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='oasis-international-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 168000, 264000, 168000, 264000, 12)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 36. Trio World Academy, Sahakar Nagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Trio World Academy', 'trio-world-academy-bangalore',
    'Bengaluru', 'Hebbal', 13.0642, 77.5914,
    'Sahakar Nagar', 'https://trioworldacademy.com', 2007, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='trio-world-academy-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 420000, 816000, 420000, 816000, 10)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'ib'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 37. Mirambika School for New Age, Jayanagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Mirambika School for New Age', 'mirambika-school-for-new-age-bangalore',
    'Bengaluru', 'Jayanagar', 12.9214, 77.5812,
    'Jayanagar', 'https://mirambikaschool.edu.in', 2004, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='mirambika-school-for-new-age-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 66000, 102000, 66000, 102000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 38. Sophia High School (girls), Palace Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Sophia High School', 'sophia-high-school-bangalore',
    'Bengaluru', 'Sadashivanagar', 12.9871, 77.5884,
    'Palace Road', 'https://sophiahighschool.org', 1949, 'girls', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year, gender=EXCLUDED.gender;
  SELECT id INTO sid FROM schools WHERE slug='sophia-high-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 84000, 120000, 84000, 120000, 22)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 39. Kumarans Children's Academy, Kanakapura Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, website, established_year, gender, type, verified)
  VALUES ('Kumarans Children''s Academy', 'kumarans-childrens-academy-bangalore',
    'Bengaluru', 'Kanakapura Road', 12.8642, 77.5412,
    'Kanakapura Road', 'https://kumarans.org', 1995, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, website=EXCLUDED.website,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='kumarans-childrens-academy-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 150000, 186000, 150000, 186000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 40. Vishwa Vidyapeeth, Yelahanka
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, established_year, gender, type, verified)
  VALUES ('Vishwa Vidyapeeth', 'vishwa-vidyapeeth-yelahanka-bangalore',
    'Bengaluru', 'Yelahanka', 13.1205, 77.5794,
    'Yelahanka', 2012, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1,
    established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='vishwa-vidyapeeth-yelahanka-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 98400, 176400, 98400, 176400, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse'),(sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

END $$;
