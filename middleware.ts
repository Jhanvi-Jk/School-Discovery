import { NextResponse, type NextRequest } from "next/server";
import { createServerClient } from "@supabase/ssr";

// Protected routes that require auth
const PROTECTED_ROUTES = ["/dashboard", "/manage"];

// ── Bot User-Agent detection ─────────────────────────────────────────────────
// Crawlers don't execute JS so serving them the map's large coordinate JSON is waste.
// We stamp a request header that server components can read to strip the map payload,
// serving lightweight HTML+text to bots without affecting regular users.
const BOT_UA_PATTERN =
  /Googlebot|bingbot|Slurp|DuckDuckBot|Baiduspider|YandexBot|Sogou|Exabot|facebot|ia_archiver|msnbot|Applebot|LinkedInBot|Twitterbot|Discordbot|WhatsApp|SemrushBot|AhrefsBot|MJ12bot|DotBot|PetalBot|Bytespider/i;

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value)
          );
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const path = request.nextUrl.pathname;

  // Redirect unauthenticated users trying to access protected routes
  const isProtected = PROTECTED_ROUTES.some((r) => path.startsWith(r));
  if (isProtected && !user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("next", path);
    return NextResponse.redirect(url);
  }

  // Stamp a lightweight request header so server components (SchoolsPage, AreaPage)
  // can omit the map/coordinate JSON entirely when responding to crawlers.
  const ua = request.headers.get("user-agent") || "";
  if (BOT_UA_PATTERN.test(ua)) {
    supabaseResponse.headers.set("x-is-bot", "1");
    // Also forward it as a request header so server components can read it via headers()
    const clone = new NextRequest(request.url, {
      headers: new Headers(request.headers),
    });
    clone.headers.set("x-is-bot", "1");
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
  // Next.js 16 — required to suppress deprecation warning
  runtime: "nodejs",
};
