const prisma = require("./prisma");
const { createSupabaseServerClient } = require("./supabase/server");
const { resolveAdmin } = require("./adminAccess");

// Verifies, inside a Route Handler or Server Component, that the request comes
// from a signed-in administrator. proxy.js also redirects unauthenticated page
// navigations away from /admin, but that is a UX convenience, not the security
// boundary - every admin API route and every admin page must check this itself
// (a Proxy can be bypassed by calling a route directly).
//
// Two checks, both on the server, both on every call:
//   1. Supabase Auth verifies the session (auth.getUser asks the Auth service;
//      it does not just trust the cookie), so a deleted, banned or signed-out
//      user stops working at once.
//   2. The AdminUser table says whether that user is an active admin.
// Returns { sub, role, name, email, authUserId } or null.
async function requireAdmin() {
  const supabase = await createSupabaseServerClient();
  return resolveAdmin({
    getUser: async () => {
      const { data, error } = await supabase.auth.getUser();
      return error ? null : data.user;
    },
    findAdmin: (authUserId) => prisma.adminUser.findUnique({ where: { authUserId } }),
  });
}

module.exports = { requireAdmin };
