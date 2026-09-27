// Post-login redirect targets come from the URL, so only same-site paths are allowed
// ("//evil.com" and "/\evil.com" are treated by browsers as other origins).
export function safeNextPath(next: string | null | undefined, fallback = "/dashboard"): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) return fallback;
  return next;
}
