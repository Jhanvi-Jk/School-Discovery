-- Run this in Supabase SQL Editor → fixes bug reports not saving
-- Step 1: Enable RLS
ALTER TABLE bug_reports ENABLE ROW LEVEL SECURITY;

-- Step 2: Allow anyone to insert (anon + authenticated)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'bug_reports' AND policyname = 'allow_anon_insert'
  ) THEN
    CREATE POLICY "allow_anon_insert"
      ON bug_reports FOR INSERT TO anon
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'bug_reports' AND policyname = 'allow_auth_insert'
  ) THEN
    CREATE POLICY "allow_auth_insert"
      ON bug_reports FOR INSERT TO authenticated
      WITH CHECK (true);
  END IF;
END $$;
