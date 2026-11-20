const { createServerClient } = require("@supabase/ssr");
const { cookies } = require("next/headers");
const { authConfig } = require("./config");
const { COOKIE_OPTIONS } = require("./cookieOptions");

// A Supabase client acting as whoever's cookies came with this request, for
// route handlers and Server Components. Signing in, out or refreshing writes
// the new cookies through next/headers; a Server Component may not set cookies,
// which is fine - proxy.js already refreshed the session on the way in.
async function createSupabaseServerClient() {
  const { url, key } = authConfig();
  const store = await cookies();
  return createServerClient(url, key, {
    cookieOptions: COOKIE_OPTIONS,
    cookies: {
      getAll: () => store.getAll(),
      setAll(list) {
        try {
          list.forEach(({ name, value, options }) => store.set(name, value, { ...options, ...COOKIE_OPTIONS }));
        } catch {
          // called from a Server Component - see above
        }
      },
    },
  });
}

module.exports = { createSupabaseServerClient };
