const test = require("node:test");
const assert = require("node:assert/strict");
const {
  isAdminRecord,
  resolveAdmin,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  isSameOrigin,
  SAFE_METHODS,
} = require("./adminAccess");

const row = (over = {}) => ({
  id: "adm_1",
  name: "Asha",
  email: "asha@provet.in",
  authUserId: "uid-1",
  role: "admin",
  isActive: true,
  ...over,
});

// ---- who counts as an administrator ----------------------------------------

test("an active admin row linked to the signed-in user is an administrator", () => {
  assert.equal(isAdminRecord(row(), "uid-1"), true);
});

test("no row, no user, or a row for somebody else is not an administrator", () => {
  assert.equal(isAdminRecord(null, "uid-1"), false);
  assert.equal(isAdminRecord(row(), undefined), false);
  assert.equal(isAdminRecord(row({ authUserId: "uid-2" }), "uid-1"), false);
  assert.equal(isAdminRecord(row({ authUserId: null }), null), false);
});

test("an inactive admin, or a role that is not allowed, is refused", () => {
  assert.equal(isAdminRecord(row({ isActive: false }), "uid-1"), false);
  assert.equal(isAdminRecord(row({ isActive: undefined }), "uid-1"), false);
  for (const role of ["user", "customer", "superuser", "ADMIN", "", null]) {
    assert.equal(isAdminRecord(row({ role }), "uid-1"), false, String(role));
  }
});

test("resolveAdmin returns the session for a verified admin", async () => {
  const session = await resolveAdmin({
    getUser: async () => ({ id: "uid-1" }),
    findAdmin: async (id) => (id === "uid-1" ? row() : null),
  });
  assert.deepEqual(session, { sub: "adm_1", role: "admin", name: "Asha", email: "asha@provet.in", authUserId: "uid-1" });
});

test("a signed-in stranger (no AdminUser row) gets nothing, whatever their metadata claims", async () => {
  // A person can write their own user_metadata; the claim must change nothing.
  const stranger = { id: "uid-9", email: "mallory@evil.test", user_metadata: { role: "admin", is_admin: true }, app_metadata: { role: "admin" } };
  const session = await resolveAdmin({ getUser: async () => stranger, findAdmin: async () => null });
  assert.equal(session, null);
});

test("an existing admin row cannot be claimed by a different Supabase user", async () => {
  const session = await resolveAdmin({
    getUser: async () => ({ id: "uid-9", email: "asha@provet.in" }), // same email, different account
    findAdmin: async (id) => (id === "uid-1" ? row() : null),
  });
  assert.equal(session, null);
});

test("no session, or a failing auth service, means not authenticated - never an exception", async () => {
  assert.equal(await resolveAdmin({ getUser: async () => null, findAdmin: async () => row() }), null);
  assert.equal(await resolveAdmin({ getUser: async () => ({}), findAdmin: async () => row() }), null);
  assert.equal(
    await resolveAdmin({
      getUser: async () => {
        throw new Error("network");
      },
      findAdmin: async () => row(),
    }),
    null
  );
});

// ---- input validation ------------------------------------------------------

test("the login form needs a valid email and a password", () => {
  assert.equal(loginSchema.safeParse({ email: "a@b.co", password: "x" }).success, true);
  assert.equal(loginSchema.safeParse({ email: "not-an-email", password: "x" }).success, false);
  assert.equal(loginSchema.safeParse({ email: "a@b.co", password: "" }).success, false);
  assert.equal(loginSchema.safeParse({ email: "a@b.co" }).success, false);
  assert.equal(loginSchema.safeParse({ email: "a@b.co", password: "x".repeat(300) }).success, false);
  assert.equal(loginSchema.safeParse(null).success, false);
  assert.equal(loginSchema.safeParse({ email: { $ne: "" }, password: { $ne: "" } }).success, false);
});

test("emails are normalised so one account cannot hide behind letter case", () => {
  assert.equal(forgotPasswordSchema.parse({ email: "  Asha@Provet.IN " }).email, "asha@provet.in");
});

test("a new password must be long, mixed and not a known weak one", () => {
  const ok = (password) => resetPasswordSchema.safeParse({ password }).success;
  assert.equal(ok("Correct-Horse-9-Battery"), true);
  assert.equal(ok("Sh0rt"), false); // too short
  assert.equal(ok("alllowercase1234567"), false); // no upper case
  assert.equal(ok("ALLUPPERCASE1234567"), false); // no lower case
  assert.equal(ok("NoDigitsInThisOneAtAll"), false);
  assert.equal(ok("Admin@1234567890"), false); // starts like a default
  assert.equal(ok("Password12345678"), false);
  assert.equal(ok("A1" + "a".repeat(200)), false); // absurdly long
  assert.equal(resetPasswordSchema.safeParse({}).success, false);
  assert.equal(resetPasswordSchema.safeParse({ password: ["Correct-Horse-9-Battery"] }).success, false);
});

// ---- cross-site requests ---------------------------------------------------

test("a request that came from another site is refused; this site's own is not", () => {
  assert.equal(isSameOrigin("https://provet.in", "provet.in"), true);
  assert.equal(isSameOrigin("http://localhost:3001", "localhost:3001"), true);
  assert.equal(isSameOrigin("https://evil.example", "provet.in"), false);
  assert.equal(isSameOrigin("https://provet.in.evil.example", "provet.in"), false);
  assert.equal(isSameOrigin("null", "provet.in"), false);
  assert.equal(isSameOrigin("garbage", "provet.in"), false);
  assert.equal(isSameOrigin(undefined, "provet.in"), true); // not a cross-site browser post
});

test("only reads are exempt from the cross-site check", () => {
  for (const m of ["GET", "HEAD", "OPTIONS"]) assert.equal(SAFE_METHODS.has(m), true);
  for (const m of ["POST", "PUT", "PATCH", "DELETE"]) assert.equal(SAFE_METHODS.has(m), false);
});
