import { type NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. Never intercept Next.js internals (including HMR and static files) or API routes
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/favicon.ico")
  ) {
    return NextResponse.next();
  }

  // 2. Get the session token from cookies
  const sessionToken = request.cookies.get("session")?.value;

  // 3. Define public vs protected paths
  const isAuthPage = pathname.startsWith("/auth");

  // 4. If user is NOT logged in and trying to access a protected page, redirect to /auth
  if (!sessionToken && !isAuthPage) {
    const authUrl = new URL("/auth", request.url);
    if (pathname !== "/") {
      authUrl.searchParams.set("from", pathname);
    }
    return NextResponse.redirect(authUrl);
  }

  return NextResponse.next();
}

export default proxy;

// Specify which routes this proxy applies to
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next (static files, image optimization, HMR websocket/events)
     * - api routes (/api/*)
     * - static files (favicon.ico, images, etc.)
     */
    "/((?!api|_next|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
