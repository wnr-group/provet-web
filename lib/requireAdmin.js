const { cookies } = require("next/headers");
const { COOKIE_NAME, verifyAdminToken } = require("./auth");

// Verifies the admin session cookie inside a Route Handler. proxy.js also
// redirects unauthenticated page navigations away from /admin, but that's a
// UX convenience, not the security boundary - every admin API route must
// check this itself (Proxy can be bypassed by calling the route directly).
// Returns the token payload ({ sub, role }) or null.
async function requireAdmin() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  return verifyAdminToken(token);
}

module.exports = { requireAdmin };
