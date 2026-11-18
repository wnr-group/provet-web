// The session cookie settings, in a file of their own because proxy.js runs
// without Node's `next/headers` and cannot import lib/supabase/server.js.
const { SESSION_MAX_AGE } = require("./config");

// httpOnly (no script on the page can read them - there is no browser
// Supabase client that would need to), SameSite=Lax, Secure in production,
// and capped at a week.
const COOKIE_OPTIONS = {
  httpOnly: true,
  sameSite: "lax",
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: SESSION_MAX_AGE,
};

module.exports = { COOKIE_OPTIONS };
