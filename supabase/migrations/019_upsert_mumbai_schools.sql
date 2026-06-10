-- Migration 019: Upsert 50 Mumbai schools
-- Monthly fees × 12 = annual; "+" fees estimated at 130% max
-- Dual-curriculum schools: separate curricula rows inserted below

DO $$
DECLARE
  sid UUID;
BEGIN

  -- 1. Dhirubhai Ambani International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Dhirubhai Ambani International School', 'dhirubhai-ambani-international-school-mumbai',
          'Mumbai', 'BKC', 19.0645, 72.8642,
          'World-renowned infrastructure, elite academic tracking, exceptional global university placements.',
          'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='dhirubhai-ambani-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 540000, 702000, 540000, 702000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'ib'), (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 2. The Cathedral & John Connon School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('The Cathedral & John Connon School', 'cathedral-and-john-connon-school-mumbai',
          'Mumbai', 'Fort', 18.9352, 72.8315,
          'Legacy heritage institution, highly influential alumni network, strong emphasis on sports and debate.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='cathedral-and-john-connon-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 216000, 280800, 216000, 280800)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 3. Campion School (boys)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Campion School', 'campion-school-mumbai',
          'Mumbai', 'Colaba', 18.9248, 72.8324,
          'Elite all-boys school focusing on leadership traits, rigorous academics, and active scout programs.',
          'boys', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, gender=EXCLUDED.gender, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='campion-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 90000, 120000, 90000, 120000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 4. Jamnabai Narsee School (ICSE + IB)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Jamnabai Narsee School', 'jamnabai-narsee-school-mumbai',
          'Mumbai', 'Juhu', 19.1121, 72.8361,
          'Renowned fine arts and theater culture, massive annual inter-school festivals, balanced sports wings.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='jamnabai-narsee-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 144000, 192000, 144000, 192000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse'), (sid, 'ib')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 5. Bombay Scottish School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Bombay Scottish School', 'bombay-scottish-school-mumbai',
          'Mumbai', 'Mahim', 19.0314, 72.8415,
          'Historical academic excellence, strict discipline framework, high selection rate in competitive fields.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='bombay-scottish-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 78000, 102000, 78000, 102000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 6. Aditya Birla World Academy (IB + Cambridge)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Aditya Birla World Academy', 'aditya-birla-world-academy-mumbai',
          'Mumbai', 'Tardeo', 18.9684, 72.8142,
          'Holistically structured mental well-being cells, cutting-edge tech labs, hyper-individual child pace.',
          'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='aditya-birla-world-academy-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 420000, 546000, 420000, 546000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'ib'), (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 7. Oberoi International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Oberoi International School', 'oberoi-international-school-mumbai',
          'Mumbai', 'Goregaon East', 19.1712, 72.8614,
          'State-of-the-art green campus, highly progressive design-thinking modules, low teacher-student ratio.',
          'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='oberoi-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 360000, 468000, 360000, 468000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'ib')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 8. Podar International School (CBSE + Cambridge)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Podar International School', 'podar-international-school-mumbai',
          'Mumbai', 'Santacruz West', 19.0821, 72.8364,
          'Heavily automated tech-classrooms, extensive digital testing modules, massive regional presence.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='podar-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 102000, 138000, 102000, 138000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse'), (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 9. Shishuvan School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Shishuvan School', 'shishuvan-school-mumbai',
          'Mumbai', 'Matunga', 19.0264, 72.8541,
          'Highly progressive democratic learning models, heavy focus on life-skills and inclusive education.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='shishuvan-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 72000, 96000, 72000, 96000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 10. Utpal Shanghvi Global School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Utpal Shanghvi Global School', 'utpal-shanghvi-global-school-mumbai',
          'Mumbai', 'Juhu', 19.1141, 72.8319,
          'Early adopter of international curriculum in Mumbai, exceptional robotics, and coding tracks.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='utpal-shanghvi-global-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 120000, 168000, 120000, 168000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 11. Smt. Sulochanadevi Singhania School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Smt. Sulochanadevi Singhania School', 'sulochanadevi-singhania-school-mumbai',
          'Mumbai', 'Thane West', 19.2012, 72.9642,
          'Sprawling multi-acre campus, multi-award-winning collaborative projects, great athletic infrastructure.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='sulochanadevi-singhania-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 66000, 86400, 66000, 86400)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 12. Ryan International School (CBSE + ICSE)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Ryan International School Malad', 'ryan-international-school-malad-mumbai',
          'Mumbai', 'Malad West', 19.1915, 72.8314,
          'Heavy focus on media studies, young journalist modules, massive national sports competitive networks.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='ryan-international-school-malad-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 60000, 84000, 60000, 84000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse'), (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 13. Don Bosco High School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Don Bosco High School', 'don-bosco-high-school-matunga-mumbai',
          'Mumbai', 'Matunga', 19.0242, 72.8591,
          'Powerhouse of Mumbai school football/hockey, extensive technical training wings, disciplined ethos.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='don-bosco-high-school-matunga-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 36000, 54000, 36000, 54000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'state_board')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 14. Arya Vidya Mandir (AVM)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Arya Vidya Mandir', 'arya-vidya-mandir-bandra-mumbai',
          'Mumbai', 'Bandra West', 19.0581, 72.8312,
          'Strong emphasis on dynamic Vedic values mixed smoothly with modern computer sciences.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='arya-vidya-mandir-bandra-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 78000, 102000, 78000, 102000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 15. Billabong High International School (CBSE + ICSE)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Billabong High International School', 'billabong-high-international-school-mumbai',
          'Mumbai', 'Santacruz West', 19.0815, 72.8291,
          'Proprietary structured neuroscience-backed curriculum, specialized creative design labs.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='billabong-high-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 114000, 156000, 114000, 156000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse'), (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 16. Singapore International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Singapore International School', 'singapore-international-school-mumbai',
          'Mumbai', 'Dahisar', 19.2612, 72.8714,
          'Elite day-boarding and full weekly boarding facilities, international standard indoor sports arenas.',
          'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='singapore-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 480000, 624000, 480000, 624000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'ib')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 17. Vibgyor High (CBSE + ICSE)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Vibgyor High Goregaon', 'vibgyor-high-goregaon-mumbai',
          'Mumbai', 'Goregaon West', 19.1614, 72.8361,
          'Highly structured speech and drama wings, personal inter-school sports training academies.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='vibgyor-high-goregaon-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 96000, 132000, 96000, 132000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse'), (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 18. St. Xavier's High School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('St. Xavier''s High School', 'st-xaviers-high-school-fort-mumbai',
          'Mumbai', 'Fort', 18.9442, 72.8319,
          'Legendary historic landmark school, notable alumni grid, deeply affordable value education.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='st-xaviers-high-school-fort-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 30000, 42000, 30000, 42000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'state_board')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 19. Hiranandani Foundation School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Hiranandani Foundation School', 'hiranandani-foundation-school-mumbai',
          'Mumbai', 'Powai', 19.1181, 72.9114,
          'Situated in prime township context, strong math/science labs, excellent environmental clubs.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='hiranandani-foundation-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 90000, 117600, 90000, 117600)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 20. Pawar Public School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Pawar Public School', 'pawar-public-school-mumbai',
          'Mumbai', 'Chandivali', 19.1092, 72.8984,
          'Highly transparent management framework, focus on community outreach, affordable tech setup.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='pawar-public-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 54000, 72000, 54000, 72000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 21. EuroSchool Airoli
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('EuroSchool Airoli', 'euroschool-airoli-mumbai',
          'Mumbai', 'Airoli', 19.1491, 72.9912,
          '"Balanced Schooling" framework, heavy focus on digital gaming logic and athletic clusters.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='euroschool-airoli-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 78000, 102000, 78000, 102000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 22. Delhi Public School Nerul
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Delhi Public School Nerul', 'delhi-public-school-nerul-mumbai',
          'Mumbai', 'Nerul', 19.0184, 73.0112,
          'Premier competitive performance record for engineering/medical entries, massive campus infrastructure.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='delhi-public-school-nerul-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 84000, 114000, 84000, 114000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 23. The Universal School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('The Universal School', 'the-universal-school-mumbai',
          'Mumbai', 'Tardeo', 18.9712, 72.8119,
          'Fully integrated tablet-based digital learning lanes, specialized audio-visual production setups.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='the-universal-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 168000, 216000, 168000, 216000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 24. Beacon High
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Beacon High School', 'beacon-high-school-mumbai',
          'Mumbai', 'Khar West', 19.0715, 72.8341,
          'Intimate child-focused class configurations, proactive inclusive remedial support framework.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='beacon-high-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 84000, 108000, 84000, 108000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 25. NES International School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('NES International School', 'nes-international-school-mumbai',
          'Mumbai', 'Mulund West', 19.1764, 72.9412,
          'Space science program collaborations, advanced sports facilities like indoor swimming and tennis.',
          'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='nes-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 192000, 249600, 192000, 249600)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'ib')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 26. Greenlawns High School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Greenlawns High School', 'greenlawns-high-school-mumbai',
          'Mumbai', 'Warden Road', 18.9691, 72.8054,
          'Premium South Mumbai standing, specialized public speaking cells, high individual guidance.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='greenlawns-high-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 96000, 132000, 96000, 132000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 27. Witty International School (CBSE + Cambridge)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Witty International School', 'witty-international-school-mumbai',
          'Mumbai', 'Borivali West', 19.2294, 72.8512,
          'High-tech infrastructure, air-conditioned campus lanes, specialized entrepreneurship modules for kids.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='witty-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 108000, 150000, 108000, 150000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse'), (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 28. Lilavatibai Podar High School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Lilavatibai Podar High School', 'lilavatibai-podar-high-school-mumbai',
          'Mumbai', 'Santacruz West', 19.0834, 72.8391,
          'Exceptional volume handling with record high board percentage outcomes, strong science wings.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='lilavatibai-podar-high-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 81600, 102000, 81600, 102000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 29. Thakur International School (ICSE + Cambridge)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Thakur International School', 'thakur-international-school-mumbai',
          'Mumbai', 'Kandivali West', 19.2114, 72.8341,
          'Extensive indoor sports flooring setups, specialized logic labs, active talent management cells.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='thakur-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 90000, 120000, 90000, 120000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse'), (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 30. Christ Church School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Christ Church School', 'christ-church-school-mumbai',
          'Mumbai', 'Byculla', 18.9742, 72.8311,
          '150+ year legacy campus, highly regarded arts programs, multi-cultural student profile.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='christ-church-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 60000, 81600, 60000, 81600)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 31. J.B. Petit High School for Girls
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('J.B. Petit High School for Girls', 'jb-petit-high-school-for-girls-mumbai',
          'Mumbai', 'Fort', 18.9341, 72.8328,
          'Legendary all-girls institution, fierce focus on critical thinking, gender equality, and literature.',
          'girls', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, gender=EXCLUDED.gender, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='jb-petit-high-school-for-girls-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 120000, 156000, 120000, 156000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 32. Holy Family High School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Holy Family High School', 'holy-family-high-school-mumbai',
          'Mumbai', 'Andheri East', 19.1214, 72.8542,
          'Deep community roots, strong track record in regional technical talent and mathematics exhibits.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='holy-family-high-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 30000, 45600, 30000, 45600)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'state_board')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 33. Lokhandwala Foundation School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Lokhandwala Foundation School', 'lokhandwala-foundation-school-mumbai',
          'Mumbai', 'Kandivali East', 19.2091, 72.8712,
          'Highly organized science exhibition circles, robust campus transit networks, safe tracking layout.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='lokhandwala-foundation-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 66000, 84000, 66000, 84000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 34. G.D. Somani Memorial School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('G.D. Somani Memorial School', 'gd-somani-memorial-school-mumbai',
          'Mumbai', 'Cuffe Parade', 18.9142, 72.8194,
          'Strong emphasis on vocal music, theater production houses, integrated visual arts labs.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='gd-somani-memorial-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 84000, 110400, 84000, 110400)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 35. Maneckji Cooper Education Trust
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Maneckji Cooper Education Trust School', 'maneckji-cooper-school-mumbai',
          'Mumbai', 'Juhu', 19.0984, 72.8291,
          'Elite coastal locality presence, strong historical alumni baseline, stellar athletic record.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='maneckji-cooper-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 72000, 98400, 72000, 98400)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 36. St. Gregorios High School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('St. Gregorios High School', 'st-gregorios-high-school-mumbai',
          'Mumbai', 'Chembur', 19.0519, 72.8942,
          'Consistently high scoring analytics profiles in board exams, highly active nature/eco clubs.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='st-gregorios-high-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 66000, 90000, 66000, 90000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 37. Children's Academy
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Children''s Academy', 'childrens-academy-malad-mumbai',
          'Mumbai', 'Malad East', 19.1831, 72.8591,
          'Multiple Limca Book records for student art/science projects, exceptionally high-tech execution arrays.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='childrens-academy-malad-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 57600, 78000, 57600, 78000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 38. R.N. Podar School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('R.N. Podar School', 'rn-podar-school-mumbai',
          'Mumbai', 'Santacruz West', 19.0811, 72.8381,
          'Pioneer of flipped-classroom tech integration in India, advanced digital tech architecture.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='rn-podar-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 84000, 108000, 84000, 108000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 39. Navy Children School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Navy Children School', 'navy-children-school-mumbai',
          'Mumbai', 'Colaba', 18.9042, 72.8124,
          'Defense personnel backing, hyper-disciplined sports fields, maritime history integration loops.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='navy-children-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 42000, 60000, 42000, 60000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 40. Loreto Convent School (girls)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Loreto Convent School', 'loreto-convent-school-mumbai',
          'Mumbai', 'Chembur', 19.0341, 72.8891,
          'Distinguished girls'' academy emphasizing character design, social service frameworks, and ethics.',
          'girls', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, gender=EXCLUDED.gender, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='loreto-convent-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 33600, 48000, 33600, 48000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'state_board')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 41. St. Mary's School Mazgaon (boys)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('St. Mary''s School Mazgaon', 'st-marys-school-mazgaon-mumbai',
          'Mumbai', 'Mazgaon', 18.9694, 72.8341,
          'Historic all-boys campus featuring massive natural sports grass layouts, highly disciplined mechanics.',
          'boys', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, gender=EXCLUDED.gender, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='st-marys-school-mazgaon-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 72000, 96000, 72000, 96000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 42. Universal High School Dahisar
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Universal High School Dahisar', 'universal-high-school-dahisar-mumbai',
          'Mumbai', 'Dahisar East', 19.2514, 72.8612,
          'Audiovisual classroom paradigms, extensive indoor play centers, modern counseling arrays.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='universal-high-school-dahisar-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 78000, 102000, 78000, 102000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 43. Garodia International Centre (IB + Cambridge)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Garodia International Centre for Learning', 'garodia-international-centre-mumbai',
          'Mumbai', 'Ghatkopar East', 19.0815, 72.9112,
          'Fully loaded custom indoor heated swimming pool, advanced LEGO robotics construction spaces.',
          'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='garodia-international-centre-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 264000, 343200, 264000, 343200)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'ib'), (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 44. CP Goenka International School (CBSE + Cambridge)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('CP Goenka International School', 'cp-goenka-international-school-mumbai',
          'Mumbai', 'Juhu', 19.1084, 72.8301,
          'Innovation-led digital learning frameworks, specialized tracking dashboards for parent loops.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='cp-goenka-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 144000, 186000, 144000, 186000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse'), (sid, 'cambridge')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 45. BK Birla Centre for Education
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('BK Birla Centre for Education', 'bk-birla-centre-for-education-mumbai',
          'Mumbai', 'Kalyan', 19.2411, 73.1514,
          'Premium world-class residential infrastructure layout, deep focus on holistic development.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='bk-birla-centre-for-education-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 180000, 234000, 180000, 234000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 46. New Horizon Scholars School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('New Horizon Scholars School', 'new-horizon-scholars-school-mumbai',
          'Mumbai', 'Thane', 19.2541, 72.9781,
          'Wide-open campus design, hyper-organized martial arts, and yoga daily physical structures.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='new-horizon-scholars-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 54000, 72000, 54000, 72000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 47. Orchids The International School Kurla
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Orchids The International School Kurla', 'orchids-international-school-kurla-mumbai',
          'Mumbai', 'Kurla', 19.0614, 72.8812,
          'Highly structured centralized custom curriculum paths, reliable tech-enabled transport setups.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='orchids-international-school-kurla-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 72000, 102000, 72000, 102000)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 48. Sanjeevani World School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Sanjeevani World School', 'sanjeevani-world-school-mumbai',
          'Mumbai', 'Dahisar West', 19.2492, 72.8415,
          'Unique emotional intelligence integration frameworks, specialized mathematical training rooms.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='sanjeevani-world-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 60000, 81600, 60000, 81600)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 49. Kanakia International School (IB + CBSE)
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('Kanakia International School', 'kanakia-international-school-mumbai',
          'Mumbai', 'Chembur', 19.0619, 72.8994,
          'Specialized multi-disciplinary performing arts focus lanes, international teacher exchange loops.',
          'coed', 'international', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='kanakia-international-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 168000, 218400, 168000, 218400)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'ib'), (sid, 'cbse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

  -- 50. St. John's Universal School
  INSERT INTO schools (name, slug, city, area, latitude, longitude, description, gender, type, verified)
  VALUES ('St. John''s Universal School', 'st-johns-universal-school-mumbai',
          'Mumbai', 'Goregaon West', 19.1581, 72.8404,
          'Strong logical reasoning tracking indexes, highly interactive science labs, expansive audio rooms.',
          'coed', 'private', false)
  ON CONFLICT (slug) DO UPDATE SET
    city=EXCLUDED.city, area=EXCLUDED.area, latitude=EXCLUDED.latitude, longitude=EXCLUDED.longitude,
    description=EXCLUDED.description, verified=EXCLUDED.verified;
  SELECT id INTO sid FROM schools WHERE slug='st-johns-universal-school-mumbai';
  INSERT INTO school_details (school_id, total_fees_min, total_fees_max, annual_tuition_fees_min, annual_tuition_fees_max)
  VALUES (sid, 66000, 86400, 66000, 86400)
  ON CONFLICT (school_id) DO UPDATE SET total_fees_min=EXCLUDED.total_fees_min, total_fees_max=EXCLUDED.total_fees_max,
    annual_tuition_fees_min=EXCLUDED.annual_tuition_fees_min, annual_tuition_fees_max=EXCLUDED.annual_tuition_fees_max;
  INSERT INTO school_curricula (school_id, curriculum) VALUES (sid, 'icse')
  ON CONFLICT (school_id, curriculum) DO NOTHING;

END $$;
