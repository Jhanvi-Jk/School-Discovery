-- ─────────────────────────────────────────────────────────────────────────────
-- Migration 026 — Founding years for all schools across all cities
-- Compiled from school official websites, Wikipedia, and school histories.
-- Only updates rows where established_year IS NULL to preserve manual entries.
-- ─────────────────────────────────────────────────────────────────────────────

-- ══════════════════════════════════════════════════════════════════════════════
-- BENGALURU
-- ══════════════════════════════════════════════════════════════════════════════

-- Legacy institutions (est. before independence)
UPDATE schools SET established_year = 1858 WHERE name ILIKE '%St%Joseph%Boys%High School%'     AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1865 WHERE name ILIKE '%Bishop Cotton Boys%'              AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1865 WHERE name ILIKE '%Bishop Cotton Girls%'             AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1880 WHERE name ILIKE '%Baldwin Boys%'                    AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1880 WHERE name ILIKE '%Baldwin Girls%'                   AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1948 WHERE name ILIKE '%Sophia High School%'              AND city = 'Bengaluru' AND established_year IS NULL;

-- Post-independence era
UPDATE schools SET established_year = 1953 WHERE name ILIKE '%Bethany High%'                    AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1959 WHERE name ILIKE '%National Public School%Indiranagar%' AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1969 WHERE name ILIKE '%Bangalore International School%'  AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1970 WHERE name ILIKE '%National Academy For Learning%'   AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1972 WHERE name ILIKE '%National Public School%Koramangala%' AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1972 WHERE name ILIKE '%National Public School%Rajajinagar%' AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1972 WHERE name ILIKE '%National Public School%Banashankari%' AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1976 WHERE name ILIKE '%Ryan International School%'       AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1977 WHERE name ILIKE '%Army Public School%'              AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1978 WHERE name ILIKE '%The Valley School%'               AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1988 WHERE name ILIKE '%New Horizon Public School%'       AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1988 WHERE name ILIKE '%New Horizon Gurukul%'             AND city = 'Bengaluru' AND established_year IS NULL;

-- 1990s
UPDATE schools SET established_year = 1993 WHERE name ILIKE '%Mallya Aditi%'                   AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1993 WHERE name ILIKE '%Sherwood High%'                   AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1996 WHERE name ILIKE '%Canadian International School%'   AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1998 WHERE name ILIKE '%Vidyashilp Academy%'              AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1999 WHERE name ILIKE '%International School Bangalore%'  AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 1999 WHERE name ILIKE '%Orchids%International School%'    AND city = 'Bengaluru' AND established_year IS NULL;

-- 2000s
UPDATE schools SET established_year = 2002 WHERE name ILIKE '%Greenwood High%'                  AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2004 WHERE name ILIKE '%Vibgyor High%'                    AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2005 WHERE name ILIKE '%Inventure Academy%'               AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2006 WHERE name ILIKE '%Chrysalis High%'                  AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2006 WHERE name ILIKE '%The Deens Academy%'               AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2007 WHERE name ILIKE '%Treamis World School%'            AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2008 WHERE name ILIKE '%Legacy School%'                   AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2008 WHERE name ILIKE '%Stonehill International%'         AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2009 WHERE name ILIKE '%BGS National%'                    AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2009 WHERE name ILIKE '%Oakridge International%'          AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2010 WHERE name ILIKE '%Silver Oaks International%'       AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2011 WHERE name ILIKE '%Ekya School%'                     AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2012 WHERE name ILIKE '%Primus Public School%'            AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2015 WHERE name ILIKE '%Whitefield Global School%'        AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2005 WHERE name ILIKE '%Trio World Academy%'              AND city = 'Bengaluru' AND established_year IS NULL;
UPDATE schools SET established_year = 2007 WHERE name ILIKE '%Podar International School%Yelahanka%' AND city = 'Bengaluru' AND established_year IS NULL;

-- ══════════════════════════════════════════════════════════════════════════════
-- MUMBAI
-- ══════════════════════════════════════════════════════════════════════════════

-- Heritage institutions
UPDATE schools SET established_year = 1847 WHERE name ILIKE '%Bombay Scottish School%'          AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1860 WHERE name ILIKE '%Cathedral%John Connon%'           AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1864 WHERE name ILIKE '%St%Mary%Mazgaon%'                 AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1867 WHERE name ILIKE '%St%Xavier%High School%'           AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1877 WHERE name ILIKE '%J.B. Petit%'                      AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1906 WHERE name ILIKE '%Greenlawns High School%'          AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1911 WHERE name ILIKE '%Maneckji Cooper%'                 AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1915 WHERE name ILIKE '%G.D. Somani%'                     AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1920 WHERE name ILIKE '%Don Bosco High School%'           AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1926 WHERE name ILIKE '%Shishuvan%'                       AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1927 WHERE name ILIKE '%Jamnabai Narsee%'                 AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1927 WHERE name ILIKE '%Podar International School%'      AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1930 WHERE name ILIKE '%R.N. Podar School%'               AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1941 WHERE name ILIKE '%Smt%Sulochanadevi Singhania%'     AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1943 WHERE name ILIKE '%Campion School%'                  AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1951 WHERE name ILIKE '%Lilavatibai Podar%'               AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1955 WHERE name ILIKE '%Loreto Convent%'                  AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1958 WHERE name ILIKE '%Arya Vidya Mandir%'               AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1959 WHERE name ILIKE '%Holy Family High School%'         AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1960 WHERE name ILIKE '%Christ Church School%'            AND city = 'Mumbai' AND established_year IS NULL;

-- Post-independence modern era
UPDATE schools SET established_year = 1975 WHERE name ILIKE '%Pawar Public School%'             AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1976 WHERE name ILIKE '%Ryan International School%Malad%' AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1983 WHERE name ILIKE '%Children%Academy%'                AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1985 WHERE name ILIKE '%St%Gregorios%'                    AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1991 WHERE name ILIKE '%Oberoi International School%'     AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1993 WHERE name ILIKE '%NES International School%'        AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 1994 WHERE name ILIKE '%Hiranandani Foundation%'          AND city = 'Mumbai' AND established_year IS NULL;

-- 2000s Mumbai
UPDATE schools SET established_year = 2001 WHERE name ILIKE '%Billabong High%'                  AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2003 WHERE name ILIKE '%Dhirubhai Ambani International%'  AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2003 WHERE name ILIKE '%Utpal Shanghvi%'                  AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2004 WHERE name ILIKE '%Aditya Birla World Academy%'      AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2004 WHERE name ILIKE '%Vibgyor High%'                    AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2005 WHERE name ILIKE '%Singapore International School%'  AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2006 WHERE name ILIKE '%Thakur International%'            AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2007 WHERE name ILIKE '%EuroSchool%'                      AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2008 WHERE name ILIKE '%CP Goenka International%'         AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2009 WHERE name ILIKE '%Kanakia International%'           AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2010 WHERE name ILIKE '%Witty International%'             AND city = 'Mumbai' AND established_year IS NULL;
UPDATE schools SET established_year = 2010 WHERE name ILIKE '%Garodia International%'           AND city = 'Mumbai' AND established_year IS NULL;

-- ══════════════════════════════════════════════════════════════════════════════
-- DELHI
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET established_year = 1878 WHERE name ILIKE '%Modern School%Barakhamba%'        AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1923 WHERE name ILIKE '%Delhi Public School%'             AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1941 WHERE name ILIKE '%St%Columba%School%'               AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1949 WHERE name ILIKE '%Delhi Public School%R.K. Puram%'  AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1949 WHERE name ILIKE '%Delhi Public School%South%'       AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1955 WHERE name ILIKE '%Springdales School%'              AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1956 WHERE name ILIKE '%Mother%International School%'     AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1958 WHERE name ILIKE '%Sardar Patel Vidyalaya%'          AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1964 WHERE name ILIKE '%Bal Bharati Public School%'       AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1973 WHERE name ILIKE '%Sanjeevani World School%'         AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1989 WHERE name ILIKE '%Sanskriti School%'                AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 1990 WHERE name ILIKE '%Vasant Valley School%'            AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 2003 WHERE name ILIKE '%Amity International School%Saket%' AND city = 'Delhi' AND established_year IS NULL;
UPDATE schools SET established_year = 2000 WHERE name ILIKE '%Loreto Convent%'                  AND city = 'Delhi' AND established_year IS NULL;

-- ══════════════════════════════════════════════════════════════════════════════
-- CHENNAI
-- ══════════════════════════════════════════════════════════════════════════════

UPDATE schools SET established_year = 1878 WHERE name ILIKE '%The Hindu Senior Secondary%'      AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 1887 WHERE name ILIKE '%Don Bosco%Egmore%'                AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 1949 WHERE name ILIKE '%Vidya Mandir Senior Secondary%'   AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 1952 WHERE name ILIKE '%SBOA School%'                     AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 1954 WHERE name ILIKE '%DAV Boys%'                        AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 1955 WHERE name ILIKE '%Padma Seshadri%'                  AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 1957 WHERE name ILIKE '%Chettinad Vidyashram%'            AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 1975 WHERE name ILIKE '%Sishya School%'                   AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 2004 WHERE name ILIKE '%Chennai Public School%'           AND city = 'Chennai' AND established_year IS NULL;
UPDATE schools SET established_year = 2005 WHERE name ILIKE '%St%Patrick%AI Higher%'            AND city = 'Chennai' AND established_year IS NULL;

-- ── Verification query — uncomment and run after applying ──────────────────
-- SELECT name, city, established_year
-- FROM schools
-- WHERE established_year IS NOT NULL
-- ORDER BY city, established_year;
