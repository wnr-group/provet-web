const prisma = require("../../../../lib/prisma");
const { createSupabaseServerClient } = require("../../../../lib/supabase/server");
const { loginSchema, isAdminRecord, adminSession } = require("../../../../lib/adminAccess");

// One answer for every way a sign-in can fail - wrong password, no such user,
// a real user who is not an administrator - so the form never tells a stranger
// which emails exist or which have admin access.
const REFUSED = () => Response.json({ error: "Invalid email or password" }, { status: 401 });

// POST /api/auth/login { email, password }
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid input" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data?.user) return REFUSED();

  // Signed in with Supabase is not the same as being an administrator. Anyone
  // who is not in the AdminUser table (an account made some other way) is
  // signed straight back out and refused.
  const row = await prisma.adminUser.findUnique({ where: { authUserId: data.user.id } });
  if (!isAdminRecord(row, data.user.id)) {
    await supabase.auth.signOut();
    return REFUSED();
  }

  const { sub, name, email, role } = adminSession(row);
  return Response.json({ id: sub, name, email, role });
}
