-- ================================================================
-- 014_upsert_delhi_schools.sql
-- Upsert 50 Delhi schools. Fees converted from monthly → annual.
-- Safe to run multiple times.
-- ================================================================

DO $$
DECLARE
  r   RECORD;
  vid UUID;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    -- slug, name, stype, gender, area, pincode, ratio, fmin, fmax, curr, description
    ('kiit-world-school-pitampura',          'KIIT World School',                     'private','coed',  'Pitampura',         '110034',20, 44400, 50400,'cbse',  'NEP 2020-aligned curriculum with global citizenship focus and excellent board history.'),
    ('vandana-international-school-dwarka',  'Vandana International School',          'private','coed',  'Dwarka Sec-10',     '110075',22, 74400,110400,'cbse',  'Strong emphasis on character-building, leadership traits, and modern campus tech.'),
    ('sri-venkateshwar-intl-school-dwarka',  'Sri Venkateshwar International School', 'private','coed',  'Dwarka Sec-18',     '110075',20, 82800,104400,'cbse',  'Value-driven experiential learning, dynamic sports facilities, high popularity index.'),
    ('the-indian-heights-school-dwarka',     'The Indian Heights School',             'private','coed',  'Dwarka Sec-23',     '110077',18, 84000, 84000,'cbse',  'Dual curriculum option, focuses heavily on preparing Gen-Alpha global citizens.'),
    ('queen-global-intl-school-dilshad',     'Queen Global International School',     'private','coed',  'Dilshad Garden',    '110095',18,106800,151200,'cbse',  'Co-ed tech-driven infrastructure with focus on personality development and modern learning.'),
    ('bosco-public-school-paschim-vihar',    'Bosco Public School',                   'private','coed',  'Paschim Vihar',     '110063',22, 54000, 72000,'cbse',  'Highly regarded for athletic programs, academic rigor, and creative arts clubs.'),
    ('lovely-public-english-school',         'Lovely Public English School',          'private','coed',  'Anand Vihar',       '110092',25, 48000, 48000,'cbse',  'Targets 100% student participation in co-curricular activities with holistic progress tracking.'),
    ('st-andrews-scots-school-krishna-nagar','St. Andrews Scots School',              'private','coed',  'Krishna Nagar',     '110051',22, 36000, 38400,'cbse',  'Premium sports features including on-campus swimming pool and high-tier security systems.'),
    ('saai-memorial-girls-school',           'Saai Memorial Girls School',            'private','girls', 'Geeta Colony',      '110031',20, 36000, 51600,'cbse',  'Empowering girl child education with massive library resource base and smart digital classrooms.'),
    ('mayur-public-school-patparganj',       'Mayur Public School',                   'private','coed',  'Patparganj',        '110092',22,100800,100800,'cbse',  'British Council International School Award winner featuring Robotics and Math labs.'),
    ('nanki-public-school-sangam-vihar',     'Nanki Public School',                   'private','coed',  'Sangam Vihar',      '110080',28, 24000, 36000,'cbse',  'Values mental, physical and spiritual tri-balance with a structural Green Code.'),
    ('new-nanki-public-school-dakshinpuri',  'New Nanki Public School',               'private','coed',  'Dakshinpuri',       '110062',28, 24000, 36000,'cbse',  'Rooted in rich Indian heritage, value systems, and cultural programs.'),
    ('apeejay-school-international-panchsheel','Apeejay School International',        'international','coed','Panchsheel Park', '110017',15,420000,500000,'ib',   'Fully air-conditioned state-of-the-art campus with low 15:1 student-to-teacher ratio.'),
    ('colonel-satsangis-kiran-memorial',     'Colonel Satsangi''s Kiran Memorial',    'private','coed',  'Chattarpur',        '110074',18,124800,231600,'cbse',  'Provides premium full-time boarding and extended day-boarding setups.'),
    ('kalka-public-school-alaknanda',        'Kalka Public School',                   'private','coed',  'Alaknanda',         '110019',22, 62400, 81600,'cbse',  'Long-standing educational history, massive athletic complex, and strong science wings.'),
    ('birla-vidya-niketan-pushp-vihar',      'Birla Vidya Niketan',                   'private','coed',  'Pushp Vihar',       '110062',20,102000,121200,'cbse',  'Top-tier academic results, intensive career counseling cells, and expansive alumni network.'),
    ('delhi-intl-school-edge-dwarka',        'Delhi International School Edge',       'private','coed',  'Dwarka Sec-18',     '110075',18, 96000,132000,'cbse',  'Focuses on multi-disciplinary STEM fields, creative learning spaces, and global tie-ups.'),
    ('jm-international-school-dwarka',       'JM International School',               'private','coed',  'Dwarka Sec-6',      '110075',20, 90000,114000,'cbse',  'Focus on intelligence-building models, experiential learning, and design-thinking modules.'),
    ('rd-rajpal-school-dwarka',              'R.D. Rajpal School',                    'private','coed',  'Dwarka Sec-9',      '110075',22, 72000, 96000,'cbse',  'Sprawling green campus with focus on physical education and traditional values meeting tech.'),
    ('guru-tegh-bahadur-public-school',      'Guru Tegh Bahadur Public School',       'private','coed',  'Model Town',        '110009',22, 54000, 72000,'cbse',  'Strong emphasis on moral values, community service, and linguistic skills.'),
    ('viaan-international-school-preet-vihar','Viaan International School',           'private','coed',  'Preet Vihar',       '110092',20, 60000, 84000,'cbse',  'Child-centric primary education with interactive learning methods and highly trained educators.'),
    ('angels-public-school-vasundhara',      'Angels Public School',                  'private','coed',  'Vasundhara Enclave','110096',22, 48000, 66000,'cbse',  'Active community engagement programs with focus on creative performing arts.'),
    ('mbs-international-school-dwarka',      'MBS International School',              'private','coed',  'Dwarka Sec-11',     '110075',20, 84000,108000,'cbse',  'Focus on logical thinking skills, rich sports facilities, and tech-enabled tracking apps.'),
    ('universal-public-school-preet-vihar',  'Universal Public School',               'private','coed',  'Preet Vihar',       '110092',22, 54000, 72000,'cbse',  'Consistently high performance in regional sports competitions with great faculty stability.'),
    ('rainbow-english-school-janakpuri',     'Rainbow English Sr. Sec. School',       'private','coed',  'Janakpuri',         '110058',24, 42000, 60000,'cbse',  'Balanced academic blueprint, multi-purpose auditoriums, and skilled science faculties.'),
    ('ramakrishna-senior-sec-school',        'Ramakrishna Senior Sec. School',        'private','coed',  'Vikas Puri',        '110018',24, 48000, 66000,'cbse',  'Heavily focused on leadership skills, patriotic values, and personality mapping.'),
    ('pragati-public-school-dwarka',         'Pragati Public School',                 'private','coed',  'Dwarka Sec-13',     '110078',22, 72000, 96000,'cbse',  'Focuses on inclusive education patterns, remediation wings, and active art associations.'),
    ('bharat-national-public-school',        'Bharat National Public School',         'private','coed',  'Karkardooma',       '110092',24, 66000, 84000,'cbse',  'Child-led classrooms with active focus on emotional health and sports integration.'),
    ('kamal-public-school-vikas-puri',       'Kamal Public Sr. Sec. School',          'private','coed',  'Vikas Puri',        '110018',24, 48000, 66000,'cbse',  'Well-established vocational education tracks, smart classes, and active NCC cells.'),
    ('arwachin-bharti-bhawan-school',        'Arwachin Bharti Bhawan School',         'private','coed',  'Vivek Vihar',       '110095',22, 54000, 72000,'cbse',  'Strong linguistic focus, international language training modules, and fine arts clubs.'),
    ('delhi-international-school-dwarka-23', 'Delhi International School',            'private','coed',  'Dwarka Sec-23',     '110077',22, 78000,102000,'cbse',  'Core focus on global awareness programs and interactive science setups.'),
    ('maxfort-school-rohini',                'Maxfort School Rohini',                 'private','coed',  'Rohini Sec-14',     '110085',20, 90000,120000,'cbse',  'Focuses on individual growth curves, highly interactive environment, and rich labs.'),
    ('shadley-public-school-rajouri',        'Shadley Public School',                 'private','coed',  'Rajouri Garden',    '110027',24, 42000, 60000,'cbse',  'Prominent focus on student welfare programs and personalized mentoring setups.'),
    ('prudence-school-meera-bagh',           'Prudence School',                       'private','coed',  'Meera Bagh',        '110087',20, 96000,132000,'cbse',  'State-of-the-art academic setups, consistent ranking records, and elite sports programs.'),
    ('modern-school-barakhamba',             'Modern School',                         'private','coed',  'Barakhamba Road',   '110001',15,180000,220000,'cbse',  'Iconic heritage school with unparalleled infrastructure and rich history in molding leaders.'),
    ('delhi-public-school-rk-puram',         'Delhi Public School RK Puram',          'private','coed',  'R.K. Puram',        '110022',20,144000,192000,'cbse',  'Renowned engineering and medical placement statistics with massive competitive exam focus.'),
    ('vasant-valley-school',                 'Vasant Valley School',                  'private','coed',  'Vasant Kunj',       '110070',15,216000,270000,'cbse',  'Progressive academic frameworks with exemplary arts and drama culture at child-led pace.'),
    ('the-mothers-international-school',     'The Mother''s International School',    'private','coed',  'Sri Aurobindo Marg','110016',18, 96000,132000,'cbse',  'Integrated spiritual and moral values, calm learning habitat, and stellar academic history.'),
    ('sanskriti-school-chanakyapuri',        'Sanskriti School',                      'private','coed',  'Chanakyapuri',      '110021',18,120000,168000,'cbse',  'Elite civil services-backed institution with highly inclusive structure for diverse kids.'),
    ('mount-carmel-school-anand-niketan',    'Mount Carmel School',                   'private','coed',  'Anand Niketan',     '110021',20, 78000,102000,'cbse',  'Deep-rooted Christian ethics with heavy focus on public speaking and debates.'),
    ('springdales-school-dhaula-kuan',       'Springdales School',                    'private','coed',  'Dhaula Kuan',       '110021',20, 84000,114000,'cbse',  'Strong emphasis on social justice, community outreach, and international fellowships.'),
    ('amity-international-school-saket',     'Amity International School Saket',      'private','coed',  'Saket',             '110017',18,108000,144000,'cbse',  'Science-innovation incubators, global cultural exchange programs, and high-tech labs.'),
    ('don-bosco-school-alaknanda',           'Don Bosco School',                      'private','boys',  'Alaknanda',         '110019',20, 60000, 84000,'cbse',  'Renowned all-boys school focusing on discipline, sports supremacy, and strong work ethic.'),
    ('loreto-convent-school-delhi-cantt',    'Loreto Convent School',                 'private','girls', 'Delhi Cantt',       '110010',22, 54000, 78000,'cbse',  'Historic girls institution focusing on value education, character development, and social grace.'),
    ('apeejay-school-pitampura',             'Apeejay School Pitampura',              'private','coed',  'Pitampura',         '110034',18,108000,144000,'cbse',  'Strong tech foundation, robotics championships, and balanced academic environments.'),
    ('bal-bharati-public-school-grh-marg',   'Bal Bharati Public School',             'private','coed',  'Rajinder Nagar',    '110060',20, 90000,120000,'cbse',  'Deep sports roots, extensive campus spaces, and exceptional track record in board exams.'),
    ('tagores-international-school',         'Tagores International School',          'private','coed',  'Vasant Vihar',      '110057',18,108000,144000,'cbse',  'Focus on UN Sustainable Goals, global exchange programs, and human rights activism.'),
    ('red-roses-public-school-saket',        'Red Roses Public School',               'private','coed',  'Saket',             '110017',22, 60000, 84000,'cbse',  'Nurturing primary education wings with individual tracking portfolios and community-driven approach.'),
    ('bluebells-school-international',       'Bluebells School International',        'private','coed',  'Kailash Colony',    '110048',18,114000,156000,'cbse',  'Focus on cross-cultural learning, global peace studies, and premium humanities wing.'),
    ('jain-bharati-mrigavati-vidyalaya',     'Jain Bharati Mrigavati Vidyalaya',      'private','coed',  'G.T. Karnal Road',  '110033',22, 48000, 72000,'cbse',  'Values character building via Sanskar Samvardhan with monthly parent-teacher collaborative frameworks.')

  ) AS t(slug,name,stype,gender,area,pincode,ratio,fmin,fmax,curr,description)
  LOOP
    INSERT INTO schools (slug,name,description,type,gender,area,city,pincode,verified)
    VALUES (
      r.slug, r.name, r.description,
      r.stype::school_type,
      r.gender::school_gender,
      r.area, 'Delhi', r.pincode, true
    )
    ON CONFLICT (slug) DO UPDATE SET
      description=EXCLUDED.description,
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

  -- Add Cambridge curriculum to dual-board schools
  UPDATE school_curricula sc
  SET curriculum='cambridge'::curriculum_type
  WHERE school_id IN (
    SELECT id FROM schools WHERE slug IN (
      'the-indian-heights-school-dwarka',
      'delhi-intl-school-edge-dwarka'
    )
  ) AND curriculum='cbse';

  INSERT INTO school_curricula (school_id, curriculum)
  SELECT s.id, 'cbse'::curriculum_type
  FROM schools s
  WHERE s.slug IN ('the-indian-heights-school-dwarka','delhi-intl-school-edge-dwarka')
  ON CONFLICT DO NOTHING;

END $$;
