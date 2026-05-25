-- ================================================================
-- 017_upsert_chennai_schools.sql
-- 50 Chennai schools: fees (monthly × 12), coordinates, descriptions.
-- Dual-curriculum schools get a second row in school_curricula.
-- ================================================================

DO $$
DECLARE r RECORD; vid UUID;
BEGIN
  FOR r IN SELECT * FROM (VALUES
    -- (slug, name, stype, gender, area, fmin, fmax, curr, lat, lng, description)
    ('chettinad-vidyashram-ra-puram','Chettinad Vidyashram','private','coed','R.A. Puram',66000,84000,'cbse',13.0212,80.2574,'Massive focus on Indian culture, exceptional fine arts, and sports infrastructure.'),
    ('dav-boys-senior-secondary-mogappair','DAV Boys Senior Secondary School','private','boys','Mogappair',42000,57600,'cbse',13.0874,80.1712,'Top-tier academic record nationwide, strict discipline, highly structured competitive exam coaching.'),
    ('sboa-school-anna-nagar','SBOA School and Junior College','private','coed','Anna Nagar',48000,66000,'cbse',13.0841,80.1984,'Expansive campus, great multimedia labs, rich history in state-level athletic tournaments.'),
    ('schram-academy-maduravoyal','The Schram Academy','private','coed','Maduravoyal',72000,102000,'cbse',13.0642,80.1631,'Strong emphasis on global exchange modules, child-centric coding programs from early years.'),
    ('national-public-school-gopalapuram','National Public School (NPS)','private','coed','Gopalapuram',84000,114000,'cbse',13.0519,80.2552,'Highly selective admissions, excellent science stream outcomes, stellar peer culture.'),
    ('psbb-nungambakkam','Padma Seshadri Bala Bhavan (PSBB)','private','coed','Nungambakkam',60000,81600,'cbse',13.0581,80.2384,'Deep-rooted integration of traditional values with scientific temperament, strong alumni network.'),
    ('chinmaya-vidyalaya-anna-nagar','Chinmaya Vidyalaya','private','coed','Anna Nagar',54000,69600,'cbse',13.0812,80.2114,'Value-based holistic learning framework following the Chinmaya Vision Program.'),
    ('cps-international-school-anna-nagar','CPS International School','private','coed','Anna Nagar',216000,280000,'ib',13.0911,80.2031,'Premium setup, fully digitized interactive classes, robotics labs, dual-degree tracks.'),
    ('st-patricks-higher-sec-adyar','St. Patrick''s AI Higher Secondary School','private','coed','Adyar',36000,50400,'state_board',13.0114,80.2481,'Renowned historic institution, expansive sports turf, heavy focus on track and field sports.'),
    ('alpha-school-cit-nagar','Alpha School','private','coed','CIT Nagar',66000,86400,'cbse',13.0234,80.2361,'Focused on 21st-century skill maps, active digital citizenship courses, premium coding clubs.'),
    ('maharishi-vidya-mandir-chetpet','Maharishi Vidya Mandir','private','coed','Chetpet',54000,72000,'cbse',13.0692,80.2412,'Unique integration of Transcendental Meditation and Yoga into the daily academic cycle.'),
    ('velammal-vidyashram-surapet','Velammal Vidyashram','private','coed','Surapet',60000,78000,'cbse',13.1512,80.1834,'Known for producing international chess champions, heavy scientific project expos.'),
    ('lalaji-memorial-omega-international','Lalaji Memorial Omega International School','private','coed','Kolapakkam',90000,126000,'cbse',13.0084,80.1362,'Strong focus on value-based spiritual education, massive inclusive special education cell.'),
    ('bvm-global-perungudi','BVM Global','private','coed','Perungudi',72000,96000,'cbse',12.9641,80.2394,'Stress-free learning modules, no homework policy for primary sections, deep tech integration.'),
    ('aksharah-international-injambakkam','Aksharah International School','private','coed','Injambakkam',84000,114000,'cbse',12.9231,80.2504,'Beautiful coastal green campus, hands-on environmental study modules, vast sports fields.'),
    ('mount-litera-zee-perambur','Mount Litera Zee School','private','coed','Perambur',60000,81600,'cbse',13.1121,80.2312,'Early childhood focus transitioning seamlessly into active conceptual logical schooling.'),
    ('sri-sankara-senior-sec-adyar','Sri Sankara Senior Secondary School','private','coed','Adyar',57600,74400,'cbse',13.0051,80.2519,'Exceptional scholastic records, highly stable faculty baseline, rich heritage music culture.'),
    ('asan-memorial-senior-sec-egmore','Asan Memorial Senior Secondary School','private','coed','Egmore',48000,66000,'cbse',13.0619,80.2541,'Highly regarded linguistic development programs, premium multi-purpose auditoriums.'),
    ('gateway-international-school-padur','Gateway International School','private','coed','Padur',96000,138000,'cbse',12.7981,80.2214,'Expansive IT infrastructure targeted directly at tech-savvy parents working in the OMR tech corridor.'),
    ('gt-aloha-vidhya-mandir-neelankarai','GT Aloha Vidhya Mandir','private','coed','Neelankarai',72000,93600,'cbse',12.9514,80.2571,'Unique experiential study setups, focus on mental math and Abacus modeling patterns.'),
    ('good-shepherd-matric-nungambakkam','Good Shepherd Matric Higher Secondary School','private','girls','Nungambakkam',42000,60000,'state_board',13.0561,80.2464,'Historic all-girls school, elite focus on fine arts, social sciences, and poise.'),
    ('sacred-heart-matric-church-park','Sacred Heart Matriculation School','private','coed','Church Park',45600,62400,'state_board',13.0489,80.2512,'Celebrated heritage campus, prestigious alumni base, notable focus on humanitarian drives.'),
    ('don-bosco-senior-sec-egmore','Don Bosco Senior Secondary School','private','boys','Egmore',54000,72000,'cbse',13.0721,80.2524,'Top-tier all-boys academy with massive athletic setups, strong scout and guide camps.'),
    ('the-hindu-senior-sec-indira-nagar','The Hindu Senior Secondary School','private','coed','Indira Nagar',50400,67200,'cbse',13.0012,80.2534,'Excellent math and engineering track records, affordable premium education structure.'),
    ('vidya-mandir-senior-sec-mylapore','Vidya Mandir Senior Secondary School','private','coed','Mylapore',57600,78000,'cbse',13.0324,80.2641,'Prestigious cultural standing, massive focus on open discussions and public speaking.'),
    ('chennai-public-school-velachery','Chennai Public School','private','coed','Velachery',90000,117600,'cbse',12.9794,80.2209,'High-end smart classes, robotics, intensive career roadmap planning from class 8 onwards.'),
    ('hiranandani-upscale-school-egattur','Hiranandani Upscale School','private','coed','Egattur',264000,345000,'ib',12.8219,80.2314,'Luxury campus setup within a township, lakeside views, low student-teacher ratios.'),
    ('kc-high-international-navalur','KC High International School','private','coed','Navalur',300000,390000,'ib',12.8415,80.2254,'Regarded for highly progressive, eco-conscious open building spaces and child-led learning.'),
    ('the-grove-school-alwarpet','The Grove School','private','coed','Alwarpet',78000,98400,'icse',13.0315,80.2492,'Affiliated with the C.P. Ramaswami Aiyar Foundation, rich environmental focus.'),
    ('sishya-school-adyar','Sishya School','private','coed','Adyar',120000,156000,'icse',13.0089,80.2501,'Highly elite student intake, no uniform rule for senior classes, focus on independent minds.'),
    ('abacus-montessori-perungudi','Abacus Montessori School','private','coed','Perungudi',102000,132000,'icse',12.9612,80.2421,'Authentic Montessori framework up to primary levels, highly individual growth charting.'),
    ('st-johns-intl-residential-poonamallee','St. John''s International Residential School','private','coed','Poonamallee',144000,216000,'cbse',13.0512,80.0914,'Elite residential and boarding infrastructure, extensive horse riding and sporting arenas.'),
    ('amrita-vidyalayam-nesapakkam','Amrita Vidyalayam','private','coed','Nesapakkam',42000,57600,'cbse',13.0341,80.1912,'Deep emphasis on mental well-being, traditional spiritual values, and service.'),
    ('kola-saraswathi-vaishnav-kilpauk','Kola Saraswathi Vaishnav Senior Secondary School','private','coed','Kilpauk',48000,66000,'cbse',13.0781,80.2404,'Structured daily morning assemblies focusing on cultural value dissemination.'),
    ('bhavans-rajaji-vidyashram-kilpauk','Bhavans Rajaji Vidyashram','private','coed','Kilpauk',66000,86400,'cbse',13.0819,80.2341,'Expansive tree-lined historical campus, high success scale in competitive science exams.'),
    ('modern-senior-sec-nanganallur','Modern Senior Secondary School','private','coed','Nanganallur',38400,54000,'cbse',12.9831,80.1915,'Known for highly stable fees and strong basic foundational science logic training.'),
    ('psbb-millennium-gerugambakkam','PSBB Millennium School','private','coed','Gerugambakkam',78000,102000,'cbse',13.0119,80.1421,'Seamless PSBB learning framework with deep digital learning modules.'),
    ('ravindra-bharathi-global-mogappair','Ravindra Bharathi Global School','private','coed','Mogappair',66000,84000,'cbse',13.0912,80.1694,'Focus on interactive student labs, personalized monitoring diaries for parents.'),
    ('zion-international-mapedu','Zion International Public School','private','coed','Mapedu',54000,72000,'cbse',12.9094,80.1341,'Notable focus on public speaking training and large-scale regional science fairs.'),
    ('alwin-international-padappai','Alwin International Public School','private','coed','Padappai',48000,69600,'cbse',12.8715,80.0212,'Clean suburban campus infrastructure, expansive layout designed for long-term athletics.'),
    ('santhome-higher-sec-mylapore','Santhome Higher Secondary School','private','coed','Mylapore',30000,45600,'state_board',13.0294,80.2761,'Historical sports heritage, exceptionally famous for producing state cricket talent.'),
    ('gill-adarsh-matric-royapettah','Gill Adarsh Matriculation Higher Secondary School','private','coed','Royapettah',45600,60000,'state_board',13.0501,80.2584,'Highly organized extra-curricular tracks, rich fine-arts and theater programs.'),
    ('sir-mutha-venkatasubba-rao-chetpet','Sir Mutha Venkatasubba Rao School','private','coed','Chetpet',78000,102000,'cbse',13.0674,80.2451,'Affiliated with a legendary concert hall, elite art, music, and performance focus.'),
    ('lady-andal-venkatasubba-rao-chetpet','Lady Andal Venkatasubba Rao School','private','coed','Chetpet',180000,234000,'ib',13.0681,80.2442,'Premium, inclusive student approach with customized individual processing tracks.'),
    ('christwood-school-ponmar','Christwood School','private','coed','Ponmar',66000,90000,'cbse',12.8614,80.1719,'Eco-friendly learning philosophy, open fields, deep attention to emotional quotient tracking.'),
    ('newsmarts-international-perumbakkam','The Newsmarts International School','private','coed','Perumbakkam',72000,96000,'cbse',12.8942,80.1981,'Focus on digital logic, young entrepreneur cells, and smart tracking indicators.'),
    ('spartan-international-chembarambakkam','Spartan International School','private','coed','Chembarambakkam',60000,81600,'cbse',13.0319,80.0541,'Strong emphasis on outdoor discovery classes, leadership camps, and martial arts training.'),
    ('ebenezer-marcus-intl-ambattur','Ebenezer Marcus International School','private','coed','Ambattur',54000,72000,'cbse',13.1204,80.1492,'Well-equipped modern laboratory infrastructure, highly reliable school transport grids.'),
    ('velammal-newgen-sholinganallur','Velammal NewGen School','private','coed','Sholinganallur',72000,98400,'cbse',12.8912,80.2284,'Tech-first layout targeting data processing logic skills early in child development.'),
    ('mctm-chidambaram-chettyar-alwarpet','M.C.T.M. Chidambaram Chettyar School','private','coed','Alwarpet',240000,312000,'ib',13.0361,80.2514,'First school in Chennai to offer the IB program; premium global educational paradigms.')
  ) AS t(slug,name,stype,gender,area,fmin,fmax,curr,lat,lng,description)
  LOOP
    INSERT INTO schools (slug, name, type, gender, area, city, verified, latitude, longitude)
    VALUES (
      r.slug, r.name, r.stype::school_type, r.gender::school_gender,
      r.area, 'Chennai', true, r.lat, r.lng
    )
    ON CONFLICT (slug) DO UPDATE SET
      area       = EXCLUDED.area,
      latitude   = EXCLUDED.latitude,
      longitude  = EXCLUDED.longitude,
      updated_at = NOW();

    SELECT id INTO vid FROM schools WHERE slug = r.slug;

    UPDATE schools SET description = r.description WHERE id = vid;

    INSERT INTO school_details (school_id, total_fees_min, total_fees_max, has_transport)
    VALUES (vid, r.fmin, r.fmax, true)
    ON CONFLICT (school_id) DO UPDATE SET
      total_fees_min = EXCLUDED.total_fees_min,
      total_fees_max = EXCLUDED.total_fees_max;

    DELETE FROM school_curricula WHERE school_id = vid;
    INSERT INTO school_curricula (school_id, curriculum)
    VALUES (vid, r.curr::curriculum_type)
    ON CONFLICT DO NOTHING;

    INSERT INTO school_languages (school_id, language, type)
    VALUES (vid, 'English', 'medium_of_instruction')
    ON CONFLICT DO NOTHING;
  END LOOP;
END $$;

-- ── Dual-curriculum schools ────────────────────────────────────────────────────
-- Add Cambridge as a second curriculum where the school offers both.

INSERT INTO school_curricula (school_id, curriculum)
SELECT s.id, 'cambridge'::curriculum_type
FROM schools s
WHERE s.slug IN (
  -- CBSE + Cambridge
  'schram-academy-maduravoyal',
  'lalaji-memorial-omega-international',
  'gateway-international-school-padur',
  -- IB + Cambridge
  'cps-international-school-anna-nagar',
  'hiranandani-upscale-school-egattur',
  'kc-high-international-navalur'
)
ON CONFLICT DO NOTHING;
