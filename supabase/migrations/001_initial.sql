-- ============================================================
-- School Discovery Platform — Initial Schema
-- Compatible with Supabase (PostgreSQL 15)
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- for geo queries (enable in Supabase dashboard)

-- ============================================================
-- ENUMS
-- ============================================================
CREATE TYPE user_role AS ENUM ('parent', 'student', 'school_admin', 'platform_admin');
CREATE TYPE auth_provider AS ENUM ('email', 'google', 'phone');
CREATE TYPE school_type AS ENUM ('private', 'government', 'aided', 'international');
CREATE TYPE school_gender AS ENUM ('coed', 'boys', 'girls');
CREATE TYPE curriculum_type AS ENUM ('cbse', 'icse', 'ib', 'igcse', 'state_board', 'cambridge');
CREATE TYPE language_type AS ENUM ('medium_of_instruction', 'offered_as_subject');
CREATE TYPE admission_status AS ENUM ('upcoming', 'open', 'closed', 'waitlist');
CREATE TYPE review_relation AS ENUM ('current_parent', 'former_parent', 'current_student', 'alumnus');
CREATE TYPE enquiry_status AS ENUM ('new', 'read', 'responded');
CREATE TYPE application_status AS ENUM (
  'interested', 'enquired', 'applied', 'shortlisted',
  'admitted', 'rejected', 'withdrawn'
);

-- ============================================================
-- USERS (mirrors Supabase auth.users)
-- ============================================================
CREATE TABLE users (
  id            UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email         VARCHAR NOT NULL,
  full_name     VARCHAR,
  phone         VARCHAR,
  role          user_role NOT NULL DEFAULT 'parent',
  auth_provider auth_provider NOT NULL DEFAULT 'email',
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SCHOOLS
-- ============================================================
CREATE TABLE schools (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug                  VARCHAR UNIQUE NOT NULL,
  name                  VARCHAR NOT NULL,
  description           TEXT,
  established_year      INT,
  type                  school_type NOT NULL DEFAULT 'private',
  gender                school_gender NOT NULL DEFAULT 'coed',
  verified              BOOLEAN NOT NULL DEFAULT FALSE,
  verified_at           TIMESTAMPTZ,
  last_data_updated_at  TIMESTAMPTZ,
  address_line1         VARCHAR,
  address_line2         VARCHAR,
  area                  VARCHAR,
  city                  VARCHAR NOT NULL DEFAULT 'Bengaluru',
  pincode               VARCHAR,
  latitude              DECIMAL(9,6),
  longitude             DECIMAL(9,6),
  phone                 VARCHAR,
  email                 VARCHAR,
  website               VARCHAR,
  cover_image_url       VARCHAR,
  logo_url              VARCHAR,
  created_at            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SCHOOL DETAILS (1:1)
-- ============================================================
CREATE TABLE school_details (
  school_id                 UUID PRIMARY KEY REFERENCES schools(id) ON DELETE CASCADE,
  student_count             INT,
  teacher_count             INT,
  student_teacher_ratio     DECIMAL(4,2),
  school_hours_start        TIME,
  school_hours_end          TIME,
  has_transport             BOOLEAN NOT NULL DEFAULT FALSE,
  transport_description     TEXT,
  annual_tuition_fees_min   INT,
  annual_tuition_fees_max   INT,
  development_fees          INT,
  transport_fees            INT,
  activity_fees             INT,
  admission_fees            INT,
  total_fees_min            INT,
  total_fees_max            INT
);

-- ============================================================
-- CURRICULA (many-to-many)
-- ============================================================
CREATE TABLE school_curricula (
  school_id  UUID REFERENCES schools(id) ON DELETE CASCADE,
  curriculum curriculum_type NOT NULL,
  PRIMARY KEY (school_id, curriculum)
);

-- ============================================================
-- GRADES
-- ============================================================
CREATE TABLE school_grades (
  school_id  UUID REFERENCES schools(id) ON DELETE CASCADE,
  grade_from VARCHAR NOT NULL,
  grade_to   VARCHAR NOT NULL,
  PRIMARY KEY (school_id, grade_from, grade_to)
);

-- ============================================================
-- LANGUAGES
-- ============================================================
CREATE TABLE school_languages (
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  language  VARCHAR NOT NULL,
  type      language_type NOT NULL,
  PRIMARY KEY (school_id, language, type)
);

-- ============================================================
-- SPORTS
-- ============================================================
CREATE TABLE sports (
  id   SERIAL PRIMARY KEY,
  name VARCHAR UNIQUE NOT NULL
);

CREATE TABLE school_sports (
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  sport_id  INT REFERENCES sports(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, sport_id)
);

-- ============================================================
-- EXTRACURRICULARS
-- ============================================================
CREATE TABLE extracurriculars (
  id       SERIAL PRIMARY KEY,
  name     VARCHAR UNIQUE NOT NULL,
  category VARCHAR
);

CREATE TABLE school_extracurriculars (
  school_id          UUID REFERENCES schools(id) ON DELETE CASCADE,
  extracurricular_id INT REFERENCES extracurriculars(id) ON DELETE CASCADE,
  PRIMARY KEY (school_id, extracurricular_id)
);

-- ============================================================
-- ADMISSION WINDOWS
-- ============================================================
CREATE TABLE admission_windows (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id      UUID REFERENCES schools(id) ON DELETE CASCADE,
  academic_year  VARCHAR NOT NULL,
  grade_from     VARCHAR,
  grade_to       VARCHAR,
  opens_at       DATE,
  closes_at      DATE,
  is_mid_year    BOOLEAN NOT NULL DEFAULT FALSE,
  status         admission_status NOT NULL DEFAULT 'upcoming',
  application_url VARCHAR,
  notes          TEXT
);

-- ============================================================
-- REVIEWS
-- ============================================================
CREATE TABLE reviews (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id         UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  rating_academics  INT NOT NULL CHECK (rating_academics BETWEEN 1 AND 5),
  rating_facilities INT NOT NULL CHECK (rating_facilities BETWEEN 1 AND 5),
  rating_faculty    INT NOT NULL CHECK (rating_faculty BETWEEN 1 AND 5),
  rating_value      INT NOT NULL CHECK (rating_value BETWEEN 1 AND 5),
  rating_overall    INT NOT NULL CHECK (rating_overall BETWEEN 1 AND 5),
  title             VARCHAR,
  body              TEXT,
  relation          review_relation NOT NULL,
  is_verified       BOOLEAN NOT NULL DEFAULT FALSE,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (user_id, school_id)
);

-- ============================================================
-- Q&A
-- ============================================================
CREATE TABLE questions (
  id         UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id  UUID REFERENCES schools(id) ON DELETE CASCADE,
  asked_by   UUID REFERENCES users(id) ON DELETE CASCADE,
  body       TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE answers (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id       UUID REFERENCES questions(id) ON DELETE CASCADE,
  answered_by       UUID REFERENCES users(id) ON DELETE CASCADE,
  is_school_response BOOLEAN NOT NULL DEFAULT FALSE,
  body              TEXT NOT NULL,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SAVED SCHOOLS
-- ============================================================
CREATE TABLE saved_schools (
  user_id   UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id UUID REFERENCES schools(id) ON DELETE CASCADE,
  saved_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (user_id, school_id)
);

-- ============================================================
-- APPLICATION TRACKER
-- ============================================================
CREATE TABLE applications (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id       UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id     UUID REFERENCES schools(id) ON DELETE CASCADE,
  grade         VARCHAR,
  academic_year VARCHAR,
  status        application_status NOT NULL DEFAULT 'interested',
  deadline      DATE,
  notes         TEXT,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ENQUIRIES
-- ============================================================
CREATE TABLE enquiries (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  school_id     UUID REFERENCES schools(id) ON DELETE CASCADE,
  user_id       UUID REFERENCES users(id) ON DELETE SET NULL,
  name          VARCHAR NOT NULL,
  email         VARCHAR NOT NULL,
  phone         VARCHAR,
  grade         VARCHAR,
  message       TEXT,
  status        enquiry_status NOT NULL DEFAULT 'new',
  responded_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- USER ALERTS
-- ============================================================
CREATE TABLE user_alerts (
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  school_id           UUID REFERENCES schools(id) ON DELETE CASCADE,
  alert_admission_open BOOLEAN NOT NULL DEFAULT TRUE,
  alert_fee_change    BOOLEAN NOT NULL DEFAULT FALSE,
  alert_new_review    BOOLEAN NOT NULL DEFAULT FALSE,
  PRIMARY KEY (user_id, school_id)
);

-- ============================================================
-- MATERIALIZED VIEW: schools_with_details
-- Used for fast listing/search queries
-- ============================================================
CREATE OR REPLACE VIEW schools_with_details AS
SELECT
  s.id,
  s.slug,
  s.name,
  s.description,
  s.established_year,
  s.type,
  s.gender,
  s.verified,
  s.last_data_updated_at,
  s.area,
  s.city,
  s.pincode,
  s.latitude,
  s.longitude,
  s.cover_image_url,
  s.logo_url,
  s.phone,
  s.email,
  s.website,
  sd.total_fees_min,
  sd.total_fees_max,
  sd.annual_tuition_fees_min,
  sd.annual_tuition_fees_max,
  sd.has_transport,
  sd.student_teacher_ratio,
  sd.school_hours_start,
  sd.school_hours_end,
  sd.student_count,
  sd.teacher_count,
  sd.development_fees,
  sd.transport_fees,
  sd.activity_fees,
  sd.admission_fees,
  ROUND(AVG(r.rating_overall)::NUMERIC, 1) AS avg_rating,
  COUNT(r.id) AS review_count,
  EXISTS (
    SELECT 1 FROM admission_windows aw
    WHERE aw.school_id = s.id AND aw.status = 'open'
  ) AS admissions_open,
  EXISTS (
    SELECT 1 FROM admission_windows aw
    WHERE aw.school_id = s.id AND aw.is_mid_year = TRUE AND aw.status = 'open'
  ) AS mid_year_available
FROM schools s
LEFT JOIN school_details sd ON sd.school_id = s.id
LEFT JOIN reviews r ON r.school_id = s.id
GROUP BY s.id, sd.school_id;

-- ============================================================
-- INDEXES
-- ============================================================
CREATE INDEX idx_schools_city ON schools(city);
CREATE INDEX idx_schools_verified ON schools(verified);
CREATE INDEX idx_schools_area ON schools(area);
CREATE INDEX idx_schools_type ON schools(type);
CREATE INDEX idx_schools_gender ON schools(gender);
CREATE INDEX idx_schools_slug ON schools(slug);
CREATE INDEX idx_schools_name_fts ON schools USING GIN (to_tsvector('english', name));
CREATE INDEX idx_admission_status ON admission_windows(status);
CREATE INDEX idx_admission_school ON admission_windows(school_id);
CREATE INDEX idx_admission_midyear ON admission_windows(is_mid_year);
CREATE INDEX idx_reviews_school ON reviews(school_id);
CREATE INDEX idx_fees_range ON school_details(total_fees_min, total_fees_max);
CREATE INDEX idx_saved_user ON saved_schools(user_id);
CREATE INDEX idx_applications_user ON applications(user_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_schools ENABLE ROW LEVEL SECURITY;
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_alerts ENABLE ROW LEVEL SECURITY;

-- Public read on schools
CREATE POLICY "Schools are publicly readable"
  ON schools FOR SELECT USING (TRUE);

CREATE POLICY "School details are publicly readable"
  ON school_details FOR SELECT USING (TRUE);

CREATE POLICY "School curricula are publicly readable"
  ON school_curricula FOR SELECT USING (TRUE);

CREATE POLICY "School sports are publicly readable"
  ON school_sports FOR SELECT USING (TRUE);

CREATE POLICY "School extracurriculars are publicly readable"
  ON school_extracurriculars FOR SELECT USING (TRUE);

CREATE POLICY "School grades are publicly readable"
  ON school_grades FOR SELECT USING (TRUE);

CREATE POLICY "School languages are publicly readable"
  ON school_languages FOR SELECT USING (TRUE);

CREATE POLICY "Admission windows are publicly readable"
  ON admission_windows FOR SELECT USING (TRUE);

CREATE POLICY "Reviews are publicly readable"
  ON reviews FOR SELECT USING (TRUE);

CREATE POLICY "Sports lookup is publicly readable"
  ON sports FOR SELECT USING (TRUE);

CREATE POLICY "Extracurriculars lookup is publicly readable"
  ON extracurriculars FOR SELECT USING (TRUE);

-- Users can only see/edit their own data
CREATE POLICY "Users can view own profile"
  ON users FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can manage own saved schools"
  ON saved_schools FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own applications"
  ON applications FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can submit reviews"
  ON reviews FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reviews"
  ON reviews FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can submit enquiries"
  ON enquiries FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Users can view own enquiries"
  ON enquiries FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can manage own alerts"
  ON user_alerts FOR ALL USING (auth.uid() = user_id);

-- Auto-create user profile on sign-up
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, auth_provider)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    CASE
      WHEN NEW.app_metadata->>'provider' = 'google' THEN 'google'
      WHEN NEW.app_metadata->>'provider' = 'phone' THEN 'phone'
      ELSE 'email'
    END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
