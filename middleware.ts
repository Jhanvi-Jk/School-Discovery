import { NextResponse, type NextRequest } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cityFromSlug, hubRedirectTarget } from "@/lib/cities";

// Routes that require a signed-in user. /manage shows its own landing page to visitors
// (explaining the school portal) instead of bouncing them to the login form.
const PROTECTED_ROUTES = ["/dashboard", "/admin"];

// Crawlers don't execute JS, so server components skip the map payload for them.
const BOT_UA_PATTERN =
  /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver|msnbot|Applebot|LinkedInBot|Twitterbot|Discordbot|WhatsApp|SemrushBot|AhrefsBot|MJ12bot|DotBot|PetalBot|Bytespider/i;

/** Permanent redirects that depend on query params (next.config redirects can't rewrite them). */
function legacyRedirect(request: NextRequest): URL | null {
  const { pathname, searchParams } = request.nextUrl;

  // /schools/bengaluru?curriculum=ib → /schools/bengaluru/ib (other filters → /schools?city=…)
  const hub = pathname.match(/^\/schools\/([a-z-]+)\/?$/i);
  if (hub && cityFromSlug(hub[1])) {
    const target = hubRedirectTarget(hub[1], searchParams);
    if (target) return new URL(target, request.url);
  }

  // One spelling for the state board in URLs: state-board (never state_board)
  if (pathname === "/schools" && searchParams.getAll("curriculum").some((v) => v.includes("_"))) {
    const url = request.nextUrl.clone();
    const values = searchParams.getAll("curriculum").map((v) => v.replace(/_/g, "-"));
    url.searchParams.delete("curriculum");
    values.forEach((v) => url.searchParams.append("curriculum", v));
    return url;
  }
  return null;
}

export async function middleware(request: NextRequest) {
  const redirectTo = legacyRedirect(request);
  if (redirectTo) return NextResponse.redirect(redirectTo, 301);

  const requestHeaders = new Headers(request.headers);
  if (BOT_UA_PATTERN.test(request.headers.get("user-agent") || "")) requestHeaders.set("x-is-bot", "1");
  const next = () => NextResponse.next({ request: { headers: requestHeaders } });

  let response = next();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = next();
          cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        },
      },
    }
  );

  const path = request.nextUrl.pathname;
  const isProtected = PROTECTED_ROUTES.some((r) => path === r || path.startsWith(`${r}/`));
  if (!isProtected) {
    // Refresh the session cookie for signed-in visitors without blocking public pages on auth
    if (request.cookies.getAll().some((c) => c.name.startsWith("sb-"))) await supabase.auth.getUser();
    return response;
  }

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }
  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|api/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|txt|xml)$).*)",
  ],
};
