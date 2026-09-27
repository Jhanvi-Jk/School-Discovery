import { createClient } from "@/lib/supabase/server";

/** The signed-in user if — and only if — they are a platform admin. */
export async function getPlatformAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("users").select("role").eq("id", user.id).single();
  return (profile as { role?: string } | null)?.role === "platform_admin" ? user : null;
}
