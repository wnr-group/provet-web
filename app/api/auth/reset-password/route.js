const { createSupabaseServerClient } = require("../../../../lib/supabase/server");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { resetPasswordSchema } = require("../../../../lib/adminAccess");

// POST /api/auth/reset-password { password }
// Sets a new password for the administrator whose reset link was just opened
// (/auth/confirm gave them a session). Needs that session AND an administrator
// account, so a stray Supabase user cannot use it.
export async function POST(request) {
  const admin = await requireAdmin();
  if (!admin) return Response.json({ error: "This reset link has expired. Request a new one." }, { status: 401 });

  const body = await request.json().catch(() => null);
  const parsed = resetPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Invalid password" }, { status: 400 });
  }

  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.updateUser({ password: parsed.data.password });
  if (error) return Response.json({ error: "Could not set the new password. Request a new reset link." }, { status: 400 });

  // A changed password signs every other device out.
  await supabase.auth.signOut({ scope: "others" });
  return Response.json({ success: true });
}
