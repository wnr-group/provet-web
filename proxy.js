import { NextResponse } from "next/server";
import { COOKIE_NAME, verifyAdminToken } from "./lib/auth";

// UX convenience only - redirects an unauthenticated visit to /admin/login.
// This is NOT the security boundary: every admin API route also calls
// requireAdmin() itself (see lib/requireAdmin.js), since Proxy can be
// bypassed by hitting a route handler directly.
export default async function proxy(request) {
  const { pathname } = request.nextUrl;

  const token = request.cookies.get(COOKIE_NAME)?.value;
  const session = await verifyAdminToken(token);

  if (pathname === "/admin/login") {
    if (session) return NextResponse.redirect(new URL("/admin", request.url));
    return NextResponse.next();
  }

  if (!session) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
