-- ================================================================
-- 005_patch_fees_descriptions.sql
-- Fills in NULL fees for schools missing them + re-applies
-- descriptions for any schools where description is NULL.
-- Safe to run multiple times (won't overwrite existing non-null values).
-- ================================================================

-- ── Re-apply fees for schools that SHOULD have them (from 002) ──
-- (covers any school whose school_details row missed the upsert)
UPDATE school_details sd SET total_fees_min=110000, total_fees_max=150000 FROM schools s WHERE sd.school_id=s.id AND s.slug='baldwin-girls-high-school-richmond-town'   AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=450000, total_fees_max=850000 FROM schools s WHERE sd.school_id=s.id AND s.slug='indus-international-school-sarjapur'        AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=45000,  total_fees_max=65000  FROM schools s WHERE sd.school_id=s.id AND s.slug='baldwin-girls-pu-college-richmond-town'     AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=450000, total_fees_max=700000 FROM schools s WHERE sd.school_id=s.id AND s.slug='jain-international-residential-school-kanakapura' AND sd.total_fees_min IS NULL;

-- ── Add estimated fees for schools that had NULL in migration ──
UPDATE school_details sd SET total_fees_min=55000,  total_fees_max=85000  FROM schools s WHERE sd.school_id=s.id AND s.slug='st-josephs-boys-high-school-ashok-nagar'   AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='paradise-academy-electronic-city'           AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='paradise-international-electronic-city'     AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=55000,  total_fees_max=85000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sophia-high-school-vasanth-nagar'           AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=30000,  total_fees_max=50000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sri-vani-international-rajajinagar'         AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=40000,  total_fees_max=60000  FROM schools s WHERE sd.school_id=s.id AND s.slug='st-meeras-high-school-rajajinagar'          AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=120000, total_fees_max=200000 FROM schools s WHERE sd.school_id=s.id AND s.slug='vidyashilp-academy-yelahanka'               AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=45000,  total_fees_max=75000  FROM schools s WHERE sd.school_id=s.id AND s.slug='vishwa-vidyapeeth-yelahanka'                AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=350000, total_fees_max=500000 FROM schools s WHERE sd.school_id=s.id AND s.slug='mallya-aditi-international-yelahanka'       AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=500000, total_fees_max=900000 FROM schools s WHERE sd.school_id=s.id AND s.slug='harrow-international-school-devanahalli'    AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=80000,  total_fees_max=130000 FROM schools s WHERE sd.school_id=s.id AND s.slug='new-baldwin-international-krishnarajapura'  AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='mount-carmel-pu-college-vasanth-nagar'      AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=25000,  total_fees_max=40000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sophia-opportunity-school-vasanth-nagar'    AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=40000,  total_fees_max=65000  FROM schools s WHERE sd.school_id=s.id AND s.slug='bangalore-international-academy-jayanagar'  AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=35000,  total_fees_max=55000  FROM schools s WHERE sd.school_id=s.id AND s.slug='sudarshan-vidya-mandir-jayanagar'           AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=30000,  total_fees_max=50000  FROM schools s WHERE sd.school_id=s.id AND s.slug='redhouz-international-hennur'               AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=30000,  total_fees_max=50000  FROM schools s WHERE sd.school_id=s.id AND s.slug='janki-international-school-kengeri'         AND sd.total_fees_min IS NULL;
UPDATE school_details sd SET total_fees_min=300000, total_fees_max=500000 FROM schools s WHERE sd.school_id=s.id AND s.slug='academic-city-school-kanakapura'            AND sd.total_fees_min IS NULL;

-- ── Re-apply descriptions for schools where description is NULL ──
UPDATE schools SET description='Championship swimming pools; emphasis on morals and all-round excellence.'        WHERE slug='baldwin-girls-high-school-richmond-town'    AND description IS NULL;
UPDATE schools SET description='Highly acclaimed leadership training and startup tracks; premium IB campus.'      WHERE slug='indus-international-school-sarjapur'         AND description IS NULL;
UPDATE schools SET description='Strong leadership layout parameters for women''s academic and career tracks.'    WHERE slug='baldwin-girls-pu-college-richmond-town'      AND description IS NULL;
UPDATE schools SET description='Prestigious British legacy model; renowned house structure and sports culture.'  WHERE slug='harrow-international-school-devanahalli'     AND description IS NULL;
UPDATE schools SET description='Celebrated 40-year IB legacy; exceptional arts placement and cultural record.'  WHERE slug='mallya-aditi-international-yelahanka'        AND description IS NULL;
UPDATE schools SET description='500-year Jesuit pedagogical legacy; stellar MUN and debate track record.'       WHERE slug='st-josephs-boys-high-school-ashok-nagar'     AND description IS NULL;
UPDATE schools SET description='Practical workspace focus with a friendly, close-knit community atmosphere.'    WHERE slug='paradise-academy-electronic-city'            AND description IS NULL;
UPDATE schools SET description='Highly supportive local system; strong neighbourhood community rating.'         WHERE slug='paradise-international-electronic-city'      AND description IS NULL;
UPDATE schools SET description='Celebrated convent values; outstanding language skills and arts excellence.'    WHERE slug='sophia-high-school-vasanth-nagar'            AND description IS NULL;
UPDATE schools SET description='Traditional values with a well-balanced co-curricular activity index.'          WHERE slug='sri-vani-international-rajajinagar'          AND description IS NULL;
UPDATE schools SET description='Emphasis on individual student potential tracking and personal development.'     WHERE slug='st-meeras-high-school-rajajinagar'           AND description IS NULL;
UPDATE schools SET description='Inquiry-based layout with strong critical thinking and IB excellence reviews.'  WHERE slug='vidyashilp-academy-yelahanka'                AND description IS NULL;
UPDATE schools SET description='Holistic synthesis of traditional values and modern technology integration.'     WHERE slug='vishwa-vidyapeeth-yelahanka'                 AND description IS NULL;
UPDATE schools SET description='Value-based multicultural design frameworks; strong global placement track.'     WHERE slug='new-baldwin-international-krishnarajapura'   AND description IS NULL;
UPDATE schools SET description='Highly sought-after legacy choice for girls'' academic and leadership tracks.'  WHERE slug='mount-carmel-pu-college-vasanth-nagar'       AND description IS NULL;
UPDATE schools SET description='Renowned inclusion and special education framework; celebrated community care.'  WHERE slug='sophia-opportunity-school-vasanth-nagar'     AND description IS NULL;
UPDATE schools SET description='Balanced lifestyle track parameters; strong CBSE and state board records.'       WHERE slug='bangalore-international-academy-jayanagar'   AND description IS NULL;
UPDATE schools SET description='Values-oriented framework with high support and nurturing community metrics.'    WHERE slug='sudarshan-vidya-mandir-jayanagar'            AND description IS NULL;
UPDATE schools SET description='Cosy foundational layout; warm community focus for early primary years.'        WHERE slug='redhouz-international-hennur'                AND description IS NULL;
UPDATE schools SET description='Strong traditional integration with an encouraging neighbourhood profile.'       WHERE slug='janki-international-school-kengeri'          AND description IS NULL;
UPDATE schools SET description='Focus on elite sports programmes and global technology transition pathways.'     WHERE slug='academic-city-school-kanakapura'             AND description IS NULL;
UPDATE schools SET description='Ranked #1 state boarding layout; massive infrastructure and campus facilities.' WHERE slug='jain-international-residential-school-kanakapura' AND description IS NULL;
