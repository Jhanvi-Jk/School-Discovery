-- Belt-and-suspenders: enable RLS on bug_reports and allow anon INSERT.
-- The API route already uses the service-role key (bypasses RLS entirely),
-- but this policy keeps things safe if the key ever falls back to anon.

ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- Allow anyone (anon / authenticated) to insert a report
CREATE POLICY "allow_anon_insert"
  ON bug_reports FOR INSERT TO anon
  WITH CHECK (true);

CREATE POLICY "allow_auth_insert"
  ON bug_reports FOR INSERT TO authenticated
  WITH CHECK (true);

-- Only service_role / platform admins can read reports (no policy = deny for anon)

-- ═══════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════

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

-- ═══════════════════════════════════════════════════════════════

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
