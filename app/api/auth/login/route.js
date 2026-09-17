const { z } = require("zod");
const { cookies } = require("next/headers");
const prisma = require("../../../../lib/prisma");
const { COOKIE_NAME, verifyPassword, signAdminToken } = require("../../../../lib/auth");

const loginSchema = z.object({
  email: z.string().trim().email("A valid email is required"),
  password: z.string().min(1, "Password is required"),
});

export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const { email, password } = parsed.data;
  const admin = await prisma.adminUser.findUnique({ where: { email } });
  if (!admin) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const valid = await verifyPassword(password, admin.passwordHash);
  if (!valid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signAdminToken(admin);
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  return Response.json({ id: admin.id, name: admin.name, email: admin.email, role: admin.role });
}
