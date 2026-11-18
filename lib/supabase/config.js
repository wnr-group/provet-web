// Supabase Auth settings, read on the server only - nothing here is ever sent
// to the browser (the site has no browser-side Supabase client at all; every
// sign-in, sign-out and reset goes through a route handler).
//
//   SUPABASE_URL                  https://<ref>.supabase.co (worked out from
//                                 DATABASE_URL when left out - see lib/storage)
//   SUPABASE_PUBLISHABLE_KEY      the project's publishable (anon) key. Public
//                                 by design, but still kept out of the bundle.
//   SUPABASE_SERVICE_ROLE_KEY     the secret key. Only the admin-creation
//                                 script (scripts/create-admin.js) and storage
//                                 uploads use it; no request handler can
//                                 create or promote a user with it.
//   SITE_URL                      the public address of the site, used for the
//                                 password-reset link (never taken from the
//                                 request's Host header in production)
const { projectUrl } = require("../storage");

function authConfig(env = process.env) {
  const url = projectUrl(env);
  const key = String(
    env.SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
  ).trim();
  if (!url || !key) {
    throw new Error("Supabase Auth is not configured: set SUPABASE_URL (or DATABASE_URL) and SUPABASE_PUBLISHABLE_KEY");
  }
  return { url, key };
}

// Where a password-reset email sends the admin back to.
function siteUrl(request, env = process.env) {
  const configured = String(env.SITE_URL || "").trim().replace(/\/+$/, "");
  if (configured) return configured;
  if (env.NODE_ENV === "production") throw new Error("SITE_URL is not set");
  return new URL(request.url).origin;
}

// Admin sessions last a week at most, whatever the browser cookie default is.
const SESSION_MAX_AGE = 60 * 60 * 24 * 7;

module.exports = { authConfig, siteUrl, SESSION_MAX_AGE };
