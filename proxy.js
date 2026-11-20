import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { authConfig } from "./lib/supabase/config";
import { COOKIE_OPTIONS } from "./lib/supabase/cookieOptions";
import { isSameOrigin, SAFE_METHODS } from "./lib/adminAccess";

// Two jobs, neither of which is the security boundary:
//
//   1. Keeps the Supabase session fresh. An access token lives an hour; on
//      each admin request this refreshes it and writes the new cookies, so a
//      working session does not drop mid-edit.
//   2. Turns away what is obviously wrong early - a page visit with no session
//      goes to the login page, and a state-changing request that a browser says
//      came from another site is refused.
//
// Every admin API route and page still calls requireAdmin() itself
// (lib/requireAdmin.js), since a Proxy can be bypassed by reaching a route
// handler directly, and a signed-in person is not necessarily an administrator.

// Admin pages a signed-out person may open.
const PUBLIC_ADMIN_PAGES = new Set(["/admin/login", "/admin/forgot-password", "/admin/reset-password"]);

export default async function proxy(request) {
  const { pathname } = request.nextUrl;
  const isApi = pathname.startsWith("/api/");

  // Cross-site request forgery: a form on another site cannot get a browser to
  // post to these as the admin.
  if (isApi && !SAFE_METHODS.has(request.method) && !isSameOrigin(request.headers.get("origin"), request.nextUrl.host)) {
    return Response.json({ error: "Cross-site request refused" }, { status: 403 });
  }

  let response = NextResponse.next({ request });
  const { url, key } = authConfig();
  const supabase = createServerClient(url, key, {
    cookieOptions: COOKIE_OPTIONS,
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(list, headers) {
        list.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        list.forEach(({ name, value, options }) => response.cookies.set(name, value, { ...options, ...COOKIE_OPTIONS }));
        Object.entries(headers || {}).forEach(([k, v]) => response.headers.set(k, v));
      },
    },
  });

  // Verifies the token's signature and refreshes it when it is near expiry.
  const { data } = await supabase.auth.getClaims();
  const signedIn = Boolean(data?.claims?.sub);

  if (!isApi && !signedIn && !PUBLIC_ADMIN_PAGES.has(pathname)) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  response.headers.set("Cache-Control", "no-store");
  return response;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/api/auth/:path*"],
};
