-- Migration 020: Upsert enriched school data (Bangalore · Delhi · Chennai)
-- Adds / updates: address_line1, pincode, latitude, longitude, website,
--                 established_year, student_teacher_ratio, fees, curricula
-- Monthly fees × 12 → annual.  "CISCE/IGCSE" → icse + igcse curriculum rows.
-- Boys-only schools: Bishop Cotton Boys', DAV Boys Senior Secondary.

DO $$
DECLARE sid UUID;
BEGIN

-- ════════════════════════════════════════════════════════
--  BANGALORE
-- ════════════════════════════════════════════════════════

  -- 1. The Cambridge International School, Whitefield
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('The Cambridge International School', 'the-cambridge-international-school-whitefield',
    'Bengaluru', 'Whitefield', 12.9412, 77.7471,
    'Varthur, Whitefield', '560087', 'https://tcis.in', 2019, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='the-cambridge-international-school-whitefield';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 180000, 219600, 180000, 219600, 10)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse'),(sid,'ib')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 2. Goldenbee Global School, Bannerghatta Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Goldenbee Global School', 'goldenbee-global-school-bangalore',
    'Bengaluru', 'Bannerghatta Road', 12.8711, 77.5982,
    'Bannerghatta Road', '560076', 'https://goldenbeeschool.edu.in', 2014, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='goldenbee-global-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 75600, 238800, 75600, 238800, 14)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse'),(sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 3. New Oxford School, Sarjapur Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('New Oxford School', 'new-oxford-school-sarjapur-bangalore',
    'Bengaluru', 'Sarjapur', 12.8624, 77.7781,
    'Sarjapur Road', '562125', 'https://newoxfordschool.in', 2012, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='new-oxford-school-sarjapur-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 54000, 84000, 54000, 84000, 25)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 4. Podar International School, Yelahanka
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Podar International School Yelahanka', 'podar-international-school-yelahanka-bangalore',
    'Bengaluru', 'Yelahanka', 13.1007, 77.5963,
    'Yelahanka', '560064', 'https://podareducation.org', 2011, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='podar-international-school-yelahanka-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 109200, 150000, 109200, 150000, 30)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 5. MVM School, Devanahalli
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('MVM School', 'mvm-school-devanahalli-bangalore',
    'Bengaluru', 'Devanahalli', 13.2483, 77.7132,
    'Devanahalli', '562110', 'https://mvmduddanahalli.com', 2014, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='mvm-school-devanahalli-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 49200, 97200, 49200, 97200, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 6. Bishop Cotton Boys' School (boys)
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Bishop Cotton Boys'' School', 'bishop-cotton-boys-school-bangalore',
    'Bengaluru', 'Ashok Nagar', 12.9719, 77.5982,
    '15, Residency Rd, Ashok Nagar', '560025', 'https://bishopcottons.com', 1865, 'boys', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year,
    gender=EXCLUDED.gender;
  SELECT id INTO sid FROM schools WHERE slug='bishop-cotton-boys-school-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 129600, 168000, 129600, 168000, 17)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 7. Inventure Academy, Sarjapur (ICSE + IGCSE)
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Inventure Academy', 'inventure-academy-sarjapur-bangalore',
    'Bengaluru', 'Sarjapur', 12.8996, 77.7479,
    'Sarjapur-Attibele Road', '562125', 'https://inventureacademy.com', 2005, 'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='inventure-academy-sarjapur-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 372000, 744000, 372000, 744000, 25)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse'),(sid,'igcse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 8. Treamis World School, Electronic City
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Treamis World School', 'treamis-world-school-electronic-city-bangalore',
    'Bengaluru', 'Electronic City', 12.8181, 77.6719,
    'Near Electronic City', '560100', 'https://treamis.org', 2007, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='treamis-world-school-electronic-city-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 204000, 260400, 204000, 260400, 8)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse'),(sid,'ib')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 9. Delhi Public School South, Kanakapura Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Delhi Public School South', 'delhi-public-school-south-bangalore',
    'Bengaluru', 'Kanakapura Road', 12.8710, 77.5458,
    'Kanakapura Road, Bikaspura', '560062', 'https://south.dpsbangalore.edu.in', 2001, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='delhi-public-school-south-bangalore';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 108000, 162000, 108000, 162000, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;


-- ════════════════════════════════════════════════════════
--  DELHI
-- ════════════════════════════════════════════════════════

  -- 10. Delhi Public School, R.K. Puram
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Delhi Public School R.K. Puram', 'delhi-public-school-rk-puram',
    'Delhi', 'R.K. Puram', 28.5639, 77.1714,
    'Kaifi Azmi Marg, Sector 12, RK Puram', '110022', 'https://dpsrkp.net', 1972, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='delhi-public-school-rk-puram';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 102000, 144000, 102000, 144000, 22)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 11. Modern School, Barakhamba Road
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Modern School Barakhamba Road', 'modern-school-barakhamba-road-delhi',
    'Delhi', 'Barakhamba Road', 28.6307, 77.2307,
    'Barakhamba Road, Connaught Place', '110001', 'https://modernschool.net', 1920, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='modern-school-barakhamba-road-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 108000, 168000, 108000, 168000, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 12. Vasant Valley School
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Vasant Valley School', 'vasant-valley-school-delhi',
    'Delhi', 'Vasant Kunj', 28.5256, 77.1492,
    'Sector C, Vasant Kunj', '110070', 'https://vasantvalley.org', 1990, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='vasant-valley-school-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 180000, 264000, 180000, 264000, 12)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 13. The Mother's International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('The Mother''s International School', 'mothers-international-school-delhi',
    'Delhi', 'Sri Aurobindo Marg', 28.5441, 77.2065,
    'Sri Aurobindo Marg', '110016', 'https://themis.in', 1956, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='mothers-international-school-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 84000, 126000, 84000, 126000, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 14. Sanskriti School, Chanakyapuri
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Sanskriti School', 'sanskriti-school-chanakyapuri-delhi',
    'Delhi', 'Chanakyapuri', 28.5991, 77.1856,
    'Dr S Radhakrishnan Marg, Chanakyapuri', '110021', 'https://sanskritischool.edu.in', 1998, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='sanskriti-school-chanakyapuri-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 120000, 180000, 120000, 180000, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 15. Springdales School, Dhaula Kuan
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Springdales School Dhaula Kuan', 'springdales-school-dhaula-kuan-delhi',
    'Delhi', 'Dhaula Kuan', 28.5875, 77.1654,
    'Benito Juarez Marg, Dhaula Kuan', '110021', 'https://springdales.com', 1955, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='springdales-school-dhaula-kuan-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 78000, 114000, 78000, 114000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 16. St. Columba's School, Gole Market
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('St. Columba''s School', 'st-columbas-school-delhi',
    'Delhi', 'Gole Market', 28.6293, 77.2078,
    '1, Ashok Place, Gole Market', '110001', 'https://stcolumbas.edu.in', 1941, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='st-columbas-school-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 66000, 102000, 66000, 102000, 20)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 17. Amity International School, Saket
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Amity International School Saket', 'amity-international-school-saket-delhi',
    'Delhi', 'Saket', 28.5212, 77.2189,
    'Saket', '110017', 'https://ais.amity.edu', 1991, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='amity-international-school-saket-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 96000, 144000, 96000, 144000, 17)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 18. Bal Bharati Public School, Pitampura
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Bal Bharati Public School Pitampura', 'bal-bharati-public-school-pitampura-delhi',
    'Delhi', 'Pitampura', 28.6942, 77.1245,
    'Pitampura', '110034', 'https://bbpspitampura.balbharati.org', 1984, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='bal-bharati-public-school-pitampura-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 72000, 108000, 72000, 108000, 22)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 19. Sardar Patel Vidyalaya, Lodi Estate
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Sardar Patel Vidyalaya', 'sardar-patel-vidyalaya-delhi',
    'Delhi', 'Lodi Estate', 28.5976, 77.2281,
    'Lodi Estate', '110003', 'https://spvdelhi.org', 1958, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='sardar-patel-vidyalaya-delhi';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 90000, 132000, 90000, 132000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;


-- ════════════════════════════════════════════════════════
--  CHENNAI
-- ════════════════════════════════════════════════════════

  -- 20. Padma Seshadri Bala Bhavan (PSBB), Nungambakkam
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Padma Seshadri Bala Bhavan', 'padma-seshadri-bala-bhavan-nungambakkam-chennai',
    'Chennai', 'Nungambakkam', 13.0562, 80.2417,
    '7, Lake First Main Rd, Nungambakkam', '600034', 'https://psbbschools.ac.in', 1958, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='padma-seshadri-bala-bhavan-nungambakkam-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 60000, 102000, 60000, 102000, 25)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 21. Chettinad Vidyashram, MRC Nagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Chettinad Vidyashram', 'chettinad-vidyashram-mrc-nagar-chennai',
    'Chennai', 'R.A. Puram', 13.0171, 80.2681,
    'Rajah Annamalaipuram, MRC Nagar', '600028', 'https://chettinadvidyashram.org', 1986, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='chettinad-vidyashram-mrc-nagar-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 72000, 114000, 72000, 114000, 24)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 22. SBOA School & Junior College, Anna Nagar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('SBOA School & Junior College', 'sboa-school-anna-nagar-chennai',
    'Chennai', 'Anna Nagar', 13.0892, 80.1983,
    '18, School Road, Anna Nagar West Ext', '600101', 'https://sboajc.org', 1979, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='sboa-school-anna-nagar-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 54000, 84000, 54000, 84000, 28)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 23. Sishya School, Adyar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Sishya School', 'sishya-school-adyar-chennai',
    'Chennai', 'Adyar', 13.0039, 80.2522,
    '2, Padmanabha Nagar, Adyar', '600020', 'https://sishya.com', 1970, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='sishya-school-adyar-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 114000, 168000, 114000, 168000, 15)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 24. Vidya Mandir Senior Secondary School, Mylapore
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Vidya Mandir Senior Secondary School', 'vidya-mandir-senior-sec-school-mylapore-chennai',
    'Chennai', 'Mylapore', 13.0360, 80.2631,
    '124, Royapettah High Rd, Mylapore', '600004', 'https://vidyamandir.estd1956.org', 1956, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='vidya-mandir-senior-sec-school-mylapore-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 48000, 78000, 48000, 78000, 22)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 25. Don Bosco Senior Secondary School, Egmore
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Don Bosco Senior Secondary School Egmore', 'don-bosco-senior-secondary-school-egmore-chennai',
    'Chennai', 'Egmore', 13.0743, 80.2547,
    '13, Casa Major Rd, Egmore', '600008', 'https://dbegmore.org', 1958, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='don-bosco-senior-secondary-school-egmore-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 42000, 72000, 42000, 72000, 25)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 26. Chennai Public School, Anna Nagar West
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('Chennai Public School', 'chennai-public-school-anna-nagar-chennai',
    'Chennai', 'Anna Nagar', 13.0910, 80.1925,
    'TVS Colony, Anna Nagar West Ext', '600101', 'https://chennaipublicschool.com', 2009, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='chennai-public-school-anna-nagar-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 96000, 150000, 96000, 150000, 18)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 27. St. Patrick's AI Higher Secondary School, Adyar
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('St. Patrick''s AI Higher Secondary School', 'st-patricks-ai-higher-sec-school-adyar-chennai',
    'Chennai', 'Adyar', 13.0114, 80.2504,
    '15, 1st Main Rd, Gandhi Nagar, Adyar', '600020', 'https://stpatricks.in', 1875, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='st-patricks-ai-higher-sec-school-adyar-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 30000, 54000, 30000, 54000, 30)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'state_board')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 28. The Hindu Senior Secondary School, Triplicane
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('The Hindu Senior Secondary School', 'the-hindu-senior-secondary-school-triplicane-chennai',
    'Chennai', 'Royapettah', 13.0538, 80.2736,
    'Big Street, Triplicane', '600005', 'https://hsss-triplicane.edu.in', 1978, 'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year;
  SELECT id INTO sid FROM schools WHERE slug='the-hindu-senior-secondary-school-triplicane-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 45600, 69600, 45600, 69600, 25)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 29. DAV Boys Senior Secondary School, Gopalapuram (boys)
  INSERT INTO schools (name, slug, city, area, latitude, longitude,
    address_line1, pincode, website, established_year, gender, type, verified)
  VALUES ('DAV Boys Senior Secondary School', 'dav-boys-senior-secondary-school-gopalapuram-chennai',
    'Chennai', 'Gopalapuram', 13.0519, 80.2536,
    'Lloyd''s Road, Gopalapuram', '600086', 'https://davboysgopalapuram.org', 1970, 'boys', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    address_line1=EXCLUDED.address_line1, pincode=EXCLUDED.pincode,
    website=EXCLUDED.website, established_year=EXCLUDED.established_year,
    gender=EXCLUDED.gender;
  SELECT id INTO sid FROM schools WHERE slug='dav-boys-senior-secondary-school-gopalapuram-chennai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max,
    annual_tuition_fees_min, annual_tuition_fees_max, student_teacher_ratio)
  VALUES (sid, 50400, 78000, 50400, 78000, 26)
  ON CONFLICT (school_id) DO UPDATE SET
    total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min,
    annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max,
    student_teacher_ratio=EXCLUDED.student_teacher_ratio;
  INSERT INTO school_curricula (school_id, curriculum)
    VALUES (sid,'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

END $$;
