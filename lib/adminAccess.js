const { z } = require("zod");

// The rules that decide who is an administrator, kept free of Next.js and
// Supabase so they can be tested on their own (lib/adminAccess.test.js).
//
// Authentication is Supabase Auth's job (who is this person?). Authorisation is
// ours, and lives in one place: a row in the AdminUser table that points at the
// Supabase user (authUserId) and is marked active with an allowed role.
//
// Nothing that comes from the Supabase user itself - user_metadata (which a
// person can write to for themselves), the email address, a "role" claim - ever
// grants anything. A person who signs up, or is invited, with no AdminUser row
// is a stranger to the admin; and no route lets anyone write to that table.

const ADMIN_ROLES = ["admin"];

// Does this AdminUser row make the signed-in Supabase user an administrator?
function isAdminRecord(row, authUserId) {
  return Boolean(
    row &&
      authUserId &&
      row.authUserId === authUserId &&
      row.isActive === true &&
      ADMIN_ROLES.includes(row.role)
  );
}

// What the rest of the app gets to see of a verified administrator.
function adminSession(row) {
  return { sub: row.id, role: row.role, name: row.name, email: row.email, authUserId: row.authUserId };
}

// The one entry point: `getUser` returns the Supabase user the server has
// verified with the Auth service (never merely decoded from a cookie), and
// `findAdmin` looks the AdminUser row up by that user's id.
async function resolveAdmin({ getUser, findAdmin }) {
  let user;
  try {
    user = await getUser();
  } catch {
    return null;
  }
  if (!user?.id) return null;
  const row = await findAdmin(user.id);
  return isAdminRecord(row, user.id) ? adminSession(row) : null;
}

// ---- input rules -----------------------------------------------------------

const MIN_PASSWORD_LENGTH = 12;

const emailSchema = z.string().trim().toLowerCase().email("A valid email is required").max(254);

const loginSchema = z.object({
  email: emailSchema,
  // Not length-checked here: a wrong password is just "invalid credentials".
  password: z.string().min(1, "Password is required").max(256),
});

const forgotPasswordSchema = z.object({ email: emailSchema });

const newPassword = z
  .string()
  .min(MIN_PASSWORD_LENGTH, `Use at least ${MIN_PASSWORD_LENGTH} characters`)
  .max(128, "That password is too long")
  .refine((p) => /[a-z]/.test(p) && /[A-Z]/.test(p) && /\d/.test(p), "Use upper and lower case letters and a number")
  .refine((p) => !/^(password|admin|provet|12345)/i.test(p), "That password is too easy to guess");

const resetPasswordSchema = z.object({ password: newPassword });

// ---- cross-site requests ---------------------------------------------------

// A browser that sends an Origin on a state-changing request is telling us
// which site the request came from. Refuse when it is not this one. (Requests
// with no Origin are not browser form posts from another site; the session
// cookie is SameSite=Lax as well.)
function isSameOrigin(originHeader, host) {
  if (!originHeader) return true;
  try {
    return new URL(originHeader).host === host;
  } catch {
    return false;
  }
}

const SAFE_METHODS = new Set(["GET", "HEAD", "OPTIONS"]);

module.exports = {
  ADMIN_ROLES,
  MIN_PASSWORD_LENGTH,
  isAdminRecord,
  adminSession,
  resolveAdmin,
  emailSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  newPassword,
  isSameOrigin,
  SAFE_METHODS,
};
