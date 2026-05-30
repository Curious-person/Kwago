import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { UserRole } from "./types";

/**
 * Build a Supabase server client that reads/writes cookies from the
 * middleware request/response pair. This also refreshes the session
 * cookie on every request so it never silently expires.
 */
function createMiddlewareSupabaseClient(
  request: NextRequest,
  response: NextResponse,
) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Only intercept /dashboard/* routes
  if (!pathname.startsWith("/dashboard")) {
    return NextResponse.next();
  }

  // Start with a pass-through response so cookies can be mutated
  const response = NextResponse.next({ request });
  const supabase = createMiddlewareSupabaseClient(request, response);

  // Refresh session — this also writes the updated cookie to the response
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1. Unauthenticated → redirect to /login
  if (!user) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirectTo", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Fetch role once — needed for both member gate and route checks
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const role = (profile?.role ?? null) as UserRole | null;

  // 3. Members have no dashboard — redirect to home
  if (role === "member" || role === null) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // 4. Role-protected sub-routes
  const isAdminRoute = pathname.startsWith("/dashboard/admin");
  const isAuthorRoute = pathname.startsWith("/dashboard/author");

  // /dashboard/admin/* — admin only
  if (isAdminRoute && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  // /dashboard/author/* — author or admin
  if (isAuthorRoute && role !== "author" && role !== "admin") {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match /dashboard and all sub-paths.
     * Exclude Next.js internals and static assets so the middleware
     * doesn't run on requests that never need auth checks.
     */
    "/dashboard/:path*",
    /*
     * Negative lookahead pattern that skips:
     *   - _next/static  (static files)
     *   - _next/image   (image optimisation)
     *   - favicon.ico
     *   - public folder files (svg, png, jpg, jpeg, gif, webp)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
