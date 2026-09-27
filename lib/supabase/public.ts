import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// Cookie-free, anonymous client for public reads. Unlike the SSR client it doesn't touch
// request cookies, so its results can be cached across visitors (unstable_cache, ISR).
// Untyped on purpose: it only reads views/tables the anon role can already read.
export function createPublicClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );
}
