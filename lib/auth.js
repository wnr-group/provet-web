const bcrypt = require("bcryptjs");
const { SignJWT, jwtVerify } = require("jose");

const COOKIE_NAME = "provet_admin_session";
const TOKEN_TTL = "7d";

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET is not set");
  return new TextEncoder().encode(secret);
}

async function hashPassword(plain) {
  return bcrypt.hash(plain, 10);
}

async function verifyPassword(plain, hash) {
  return bcrypt.compare(plain, hash);
}

async function signAdminToken(admin) {
  return new SignJWT({ role: admin.role })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(admin.id)
    .setIssuedAt()
    .setExpirationTime(TOKEN_TTL)
    .sign(getSecretKey());
}

// Returns the decoded payload ({ sub, role }) or null if the token is
// missing/invalid/expired - callers should treat null as "not authenticated"
// rather than throwing, since an expired session is an expected condition.
async function verifyAdminToken(token) {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecretKey());
    return payload;
  } catch {
    return null;
  }
}

module.exports = {
  COOKIE_NAME,
  hashPassword,
  verifyPassword,
  signAdminToken,
  verifyAdminToken,
};
