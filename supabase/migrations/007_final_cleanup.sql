-- ================================================================
-- 007_final_cleanup.sql
-- Step 1: ensure every legitimate school has fees set
-- Step 2: delete ALL remaining schools with NULL fees (orphans/blanks)
-- ================================================================

-- ── STEP 1: patch fees for any school still missing them ─────────

UPDATE school_details sd SET total_fees_min=110000, total_fees_max=150000 FROM schools s WHERE sd.school_id=s.id AND s.slug='baldwin-girls-high-school-richmond-town';
UPDATE school_details sd SET total_fees_min=450000, total_fees_max=850000 FROM schools s WHERE sd.school_id=s.id AND s.slug='indus-international-school-sarjapur';
UPDATE school_details sd SET total_fees_min=45000,  total_fees_max=65000  FROM schools s WHERE sd.school_id=s.id AND s.slug='baldwin-girls-pu-college-richmond-town';
UPDATE school_details sd SET total_fees_min=450000, total_fees_max=700000 FROM schools s WHERE sd.school_id=s.id AND s.slug='jain-international-residential-school-kanakapura';
UPDATE school_details sd SET total_fees_min=55000,  total_fees_max=85000  FROM schools s WHERE sd.school_id=s.id AND s.slug='st-josephs-boys-high-school-ashok-nagar';
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='paradise-academy-electronic-city';
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='paradise-international-electronic-city';
UPDATE school_details sd SET total_fees_min=55000,  total_fees_max=85000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sophia-high-school-vasanth-nagar';
UPDATE school_details sd SET total_fees_min=30000,  total_fees_max=50000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sri-vani-international-rajajinagar';
UPDATE school_details sd SET total_fees_min=40000,  total_fees_max=60000  FROM schools s WHERE sd.school_id=s.id AND s.slug='st-meeras-high-school-rajajinagar';
UPDATE school_details sd SET total_fees_min=120000, total_fees_max=200000 FROM schools s WHERE sd.school_id=s.id AND s.slug='vidyashilp-academy-yelahanka';
UPDATE school_details sd SET total_fees_min=45000,  total_fees_max=75000  FROM schools s WHERE sd.school_id=s.id AND s.slug='vishwa-vidyapeeth-yelahanka';
UPDATE school_details sd SET total_fees_min=350000, total_fees_max=500000 FROM schools s WHERE sd.school_id=s.id AND s.slug='mallya-aditi-international-yelahanka';
UPDATE school_details sd SET total_fees_min=500000, total_fees_max=900000 FROM schools s WHERE sd.school_id=s.id AND s.slug='harrow-international-school-devanahalli';
UPDATE school_details sd SET total_fees_min=80000,  total_fees_max=130000 FROM schools s WHERE sd.school_id=s.id AND s.slug='new-baldwin-international-krishnarajapura';
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='mount-carmel-pu-college-vasanth-nagar';
UPDATE school_details sd SET total_fees_min=25000,  total_fees_max=40000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sophia-opportunity-school-vasanth-nagar';
UPDATE school_details sd SET total_fees_min=40000,  total_fees_max=65000  FROM schools s WHERE sd.school_id=s.id AND s.slug='bangalore-international-academy-jayanagar';
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sudarshan-vidya-mandir-jayanagar';
UPDATE school_details sd SET total_fees_min=30000,  total_fees_max=50000  FROM schools s WHERE sd.school_id=s.id AND s.slug='redhouz-international-hennur';
UPDATE school_details sd SET total_fees_min=30000,  total_fees_max=50000  FROM schools s WHERE sd.school_id=s.id AND s.slug='janki-international-school-kengeri';
UPDATE school_details sd SET total_fees_min=300000, total_fees_max=500000 FROM schools s WHERE sd.school_id=s.id AND s.slug='academic-city-school-kanakapura';
UPDATE school_details sd SET total_fees_min=997000, total_fees_max=1072000 FROM schools s WHERE sd.school_id=s.id AND s.slug='sarala-birla-academy-bannerghatta';
UPDATE school_details sd SET total_fees_min=55000,  total_fees_max=85000  FROM schools s WHERE sd.school_id=s.id AND s.slug='frank-anthony-public-ulsoor';
UPDATE school_details sd SET total_fees_min=45000,  total_fees_max=70000  FROM schools s WHERE sd.school_id=s.id AND s.slug='cathedral-high-school-richmond-road';
UPDATE school_details sd SET total_fees_min=25000,  total_fees_max=45000  FROM schools s WHERE sd.school_id=s.id AND s.slug='don-bosco-high-school-chitrakala-layout';
UPDATE school_details sd SET total_fees_min=30000,  total_fees_max=50000  FROM schools s WHERE sd.school_id=s.id AND s.slug='little-flower-public-school-banashankari';
UPDATE school_details sd SET total_fees_min=20000,  total_fees_max=38000  FROM schools s WHERE sd.school_id=s.id AND s.slug='national-high-school-basavanagudi';
UPDATE school_details sd SET total_fees_min=22000,  total_fees_max=38000  FROM schools s WHERE sd.school_id=s.id AND s.slug='st-annes-girls-high-school-miller-road';
UPDATE school_details sd SET total_fees_min=25000,  total_fees_max=42000  FROM schools s WHERE sd.school_id=s.id AND s.slug='holy-saint-high-school-jayanagar';
UPDATE school_details sd SET total_fees_min=18000,  total_fees_max=30000  FROM schools s WHERE sd.school_id=s.id AND s.slug='vvs-sardar-patel-high-school-rajajinagar';
UPDATE school_details sd SET total_fees_min=20000,  total_fees_max=35000  FROM schools s WHERE sd.school_id=s.id AND s.slug='green-country-public-school-hbr-layout';
UPDATE school_details sd SET total_fees_min=70000,  total_fees_max=110000 FROM schools s WHERE sd.school_id=s.id AND s.slug='vibgyor-high-marathahalli';
UPDATE school_details sd SET total_fees_min=70000,  total_fees_max=110000 FROM schools s WHERE sd.school_id=s.id AND s.slug='vibgyor-high-haralur';
UPDATE school_details sd SET total_fees_min=24000,  total_fees_max=40000  FROM schools s WHERE sd.school_id=s.id AND s.slug='ryan-international-school-kundalahalli';
UPDATE school_details sd SET total_fees_min=24000,  total_fees_max=40000  FROM schools s WHERE sd.school_id=s.id AND s.slug='ryan-international-school-yelahanka';
UPDATE school_details sd SET total_fees_min=24000,  total_fees_max=40000  FROM schools s WHERE sd.school_id=s.id AND s.slug='ryan-international-school-bannerghatta';
UPDATE school_details sd SET total_fees_min=55000,  total_fees_max=85000  FROM schools s WHERE sd.school_id=s.id AND s.slug='brigade-school-jayanagar';
UPDATE school_details sd SET total_fees_min=55000,  total_fees_max=85000  FROM schools s WHERE sd.school_id=s.id AND s.slug='brigade-school-mahadevapura';


-- ── STEP 2: delete every school that still has NULL fees ──────────
-- These are orphaned / blank duplicates with no real data.

DELETE FROM schools
WHERE id IN (
  SELECT s.id
  FROM schools s
  LEFT JOIN school_details sd ON sd.school_id = s.id
  WHERE sd.total_fees_min IS NULL
     OR sd.school_id IS NULL   -- no school_details row at all
);
