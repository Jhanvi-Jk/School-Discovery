-- ================================================================
-- 004_admission_windows.sql
-- Adds 2025-26 admission windows for all 150 schools.
-- Paste into Supabase SQL Editor and click Run.
-- ================================================================

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-03-31','open'::admission_status,false FROM schools WHERE slug='delhi-public-school-north-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-03-31','open'::admission_status,false FROM schools WHERE slug='delhi-public-school-south-konanakunte' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-20','2025-04-15','open'::admission_status,false FROM schools WHERE slug='delhi-public-school-east-sarjapur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-11-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='cambridge-international-school-whitefield' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-11-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='cambridge-international-school-sarjapur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-10','2025-03-20','open'::admission_status,false FROM schools WHERE slug='new-horizon-gurukul-marathahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='wisdomwood-high-begur-lake' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-12-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='national-public-school-indiranagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-12-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='national-public-school-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-12-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='national-public-school-hsr-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-12-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='national-public-school-koramangala' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2024-12-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='national-public-school-jayanagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='goldenbee-global-school-bannerghatta' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='goldenbee-global-school-btm-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='goldenbee-global-school-horamavu' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Grade 9','2025-02-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='podar-global-school-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-15','open'::admission_status,false FROM schools WHERE slug='new-oxford-school-sarjapur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='mvm-school-devanahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-03-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='canara-gurukula-public-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='kesar-international-school-bagalur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-31','open'::admission_status,false FROM schools WHERE slug='ms-dhoni-global-school-hsr-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='broadvision-world-school-thanisandra' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='orchids-international-jalahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='orchids-international-btm-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='orchids-international-bannerghatta' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='orchids-international-haralur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='orchids-international-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='vyasa-international-school-vidyaranyapura' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 1','Class 12','2025-01-15','2025-04-15','open'::admission_status,false FROM schools WHERE slug='amaatra-academy-haralur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 1','Class 12','2025-03-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='army-public-school-kamaraj-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 1','Class 12','2025-03-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='kendriya-vidyalaya-iisc-malleshwaram' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='chrysalis-high-varthur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='chrysalis-high-whitefield' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-03-31','open'::admission_status,false FROM schools WHERE slug='silver-oaks-international-whitefield' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='tattva-school-kumbalgodu' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','LKG','Class 12','2025-02-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='hal-public-school-vimandipura' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','LKG','Class 12','2025-02-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='air-force-school-hebbal' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-15','open'::admission_status,false FROM schools WHERE slug='presidency-school-bangalore-south' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-15','open'::admission_status,false FROM schools WHERE slug='presidency-school-bangalore-north' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='samarthanam-high-school-hsr-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='insight-academy-marathahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='whitefield-global-school-whitefield' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='vibgyor-high-marathahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='vibgyor-high-haralur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='millennium-world-school-north-bangalore' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='sherwood-high-bannerghatta' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='soundarya-central-school-nagasandra' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-11-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='ekya-school-btm-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-15','2025-04-15','open'::admission_status,false FROM schools WHERE slug='kle-society-school-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 1','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='sjr-public-school-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-11-15','2025-01-15','open'::admission_status,false FROM schools WHERE slug='bishop-cotton-boys-ashok-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-11-15','2025-01-15','open'::admission_status,false FROM schools WHERE slug='bishop-cotton-girls-ashok-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='st-josephs-boys-high-school-ashok-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='paradise-academy-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='paradise-international-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='new-oxford-international-anekal' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-15','open'::admission_status,false FROM schools WHERE slug='st-germain-academy-frazer-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-31','open'::admission_status,false FROM schools WHERE slug='national-academy-for-learning-basaveshwar-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-05-31','open'::admission_status,false FROM schools WHERE slug='venus-international-school-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='aadya-academy-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='federal-public-school-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='gopalan-international-school-hoodi' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='greenwood-high-sarjapur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-01','2025-03-31','open'::admission_status,false FROM schools WHERE slug='greenwood-high-bannerghatta' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-15','open'::admission_status,false FROM schools WHERE slug='frank-anthony-public-ulsoor' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='christ-academy-begur-koppa-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='ryan-international-school-bannerghatta' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='ryan-international-school-kundalahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='ryan-international-school-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='baldwin-boys-high-school-richmond-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='baldwin-girls-high-school-richmond-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='trinity-central-school-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-31','open'::admission_status,false FROM schools WHERE slug='bethany-high-school-koramangala' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Grade 7','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='tenderfoot-international-hsr-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-15','2025-04-15','open'::admission_status,false FROM schools WHERE slug='st-francis-school-koramangala' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='lawrence-high-school-hsr-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-31','open'::admission_status,false FROM schools WHERE slug='clarence-high-school-frazer-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-15','open'::admission_status,false FROM schools WHERE slug='cathedral-high-school-richmond-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='sunrise-international-school-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='brigade-school-jayanagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='brigade-school-mahadevapura' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='little-flower-public-school-banashankari' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='orchids-international-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='don-bosco-high-school-chitrakala-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='innisfree-house-school-jp-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='green-country-public-school-hbr-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='st-pauls-english-school-jp-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='silicon-city-academy-konanakunte' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Grade 5','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='vibgyor-roots-and-rise-hsr-layout' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='maruthi-vidyalaya-subbanapalya' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 5','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='jain-international-residential-school-kanakapura' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='academic-city-school-kanakapura' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='redbridge-international-academy-sarjapur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-09-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='canadian-international-school-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-11-01','2025-03-31','open'::admission_status,false FROM schools WHERE slug='naavu-school-whitefield' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-09-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='tisb-whitefield' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-09-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='stonehill-international-school-north-bangalore' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='harrow-international-school-devanahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='treamis-world-school-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='legacy-school-hennur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='trio-world-academy-sahakar-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='primus-public-school-sarjapur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='oakridge-international-sarjapur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Grade 5','2025-01-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='chrysalis-kids-varthur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='inventure-academy-sarjapur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-09-01','2025-01-31','open'::admission_status,false FROM schools WHERE slug='indus-international-school-sarjapur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='greenwood-high-international-sarjapur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='ebenezer-international-school-sarjapur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='global-city-international-malleshwaram' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='bangalore-international-school-hennur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-15','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='christ-university-junior-college-hosur-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='royal-public-school-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='gvs-english-school-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-15','2025-06-30','open'::admission_status,false FROM schools WHERE slug='st-johns-high-school-frazer-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='new-horizon-high-school-kasturi-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='vvs-sardar-patel-high-school-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-15','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='st-josephs-pu-college-residency-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-01','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='bishop-cotton-pu-college-residency-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-15','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='cathedral-pu-college-richmond-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-01','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='mes-pu-college-malleshwaram' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-15','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='mount-carmel-pu-college-vasanth-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-01','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='baldwin-methodist-pu-college-richmond-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-15','2025-06-30','open'::admission_status,false FROM schools WHERE slug='st-charles-high-school-hennur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-15','2025-06-30','open'::admission_status,false FROM schools WHERE slug='holy-saint-high-school-jayanagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='cluny-convent-high-school-jallahalli' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='stella-maris-high-school-gayathrinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-05-31','open'::admission_status,false FROM schools WHERE slug='sophia-opportunity-school-vasanth-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='narayana-e-techno-school-jp-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-04-30','open'::admission_status,false FROM schools WHERE slug='chaitanya-techno-school-electronic-city' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='sri-kumaran-childrens-home-basavanagudi' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='sri-bhagawan-mahaveer-college-vv-puram' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-15','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='nmkrv-pu-college-jayanagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='vijaya-high-school-jayanagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='national-high-school-basavanagudi' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-05-31','open'::admission_status,false FROM schools WHERE slug='bangalore-international-academy-jayanagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-05-31','open'::admission_status,false FROM schools WHERE slug='sudarshan-vidya-mandir-jayanagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-01','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='clarence-pu-college-frazer-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='st-annes-girls-high-school-miller-road' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 11','Grade 12','2025-03-01','2025-06-15','upcoming'::admission_status,false FROM schools WHERE slug='baldwin-girls-pu-college-richmond-town' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 5','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='sarala-birla-academy-bannerghatta' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Grade 8','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='redhouz-international-hennur' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='janki-international-school-kengeri' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='st-meeras-high-school-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 1','Class 12','2024-11-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='vidyashilp-academy-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='vishwa-vidyapeeth-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-01','2025-03-15','open'::admission_status,false FROM schools WHERE slug='sophia-high-school-vasanth-nagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 10','2025-02-01','2025-05-31','open'::admission_status,false FROM schools WHERE slug='sri-vani-international-rajajinagar' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Grade 1','Class 10','2025-02-01','2025-06-30','open'::admission_status,false FROM schools WHERE slug='new-age-world-school-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2024-10-01','2025-02-28','open'::admission_status,false FROM schools WHERE slug='mallya-aditi-international-yelahanka' ON CONFLICT DO NOTHING;

INSERT INTO admission_windows (school_id, academic_year, grade_from, grade_to, opens_at, closes_at, status, is_mid_year)
SELECT id,'2025-26','Nursery','Class 12','2025-01-15','2025-04-30','open'::admission_status,false FROM schools WHERE slug='new-baldwin-international-krishnarajapura' ON CONFLICT DO NOTHING;
