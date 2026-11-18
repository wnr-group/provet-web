const { createSupabaseServerClient } = require("../../../../lib/supabase/server");

// POST /api/auth/logout - ends this session at Supabase (the refresh token is
// revoked, not just forgotten) and clears the cookies.
export async function POST() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  return Response.json({ success: true });
}
