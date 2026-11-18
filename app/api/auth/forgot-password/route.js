const prisma = require("../../../../lib/prisma");
const { createSupabaseServerClient } = require("../../../../lib/supabase/server");
const { siteUrl } = require("../../../../lib/supabase/config");
const { forgotPasswordSchema } = require("../../../../lib/adminAccess");

// The same reply whether or not the address belongs to an administrator, so
// this cannot be used to find out who has an account.
const SENT = () => Response.json({ success: true });

// POST /api/auth/forgot-password { email }
// Emails a reset link - but only for an active administrator. Any other
// address, including one with a Supabase account of some other kind, gets the
// same "sent" reply and no email.
export async function POST(request) {
  const body = await request.json().catch(() => null);
  const parsed = forgotPasswordSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.issues[0]?.message || "Enter a valid email" }, { status: 400 });
  }

  const admin = await prisma.adminUser.findUnique({ where: { email: parsed.data.email } });
  if (!admin?.isActive || !admin.authUserId) return SENT();

  try {
    const supabase = await createSupabaseServerClient();
    // The link opens /auth/confirm, which signs the person in for the reset only.
    await supabase.auth.resetPasswordForEmail(parsed.data.email, {
      redirectTo: `${siteUrl(request)}/auth/confirm`,
    });
  } catch (error) {
    // Do not reveal a delivery problem to the visitor; it is logged for us.
    console.error("Password reset email failed:", error?.message || error);
  }
  return SENT();
}
