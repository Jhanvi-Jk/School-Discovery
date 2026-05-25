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
