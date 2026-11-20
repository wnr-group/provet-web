import { NextResponse } from "next/server";

const { createSupabaseServerClient } = require("../../../lib/supabase/server");

// The address in a password-reset email lands here, with either a token_hash
// (the link written into the Supabase email template) or a code (the default
// template's redirect). Either is exchanged for a session, and the visitor is
// sent on to choose a new password. The destination is fixed: nothing in the
// link can redirect anywhere else.
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const type = searchParams.get("type");
  const code = searchParams.get("code");

  const supabase = await createSupabaseServerClient();
  let error = new Error("no token");
  if (tokenHash && type === "recovery") {
    ({ error } = await supabase.auth.verifyOtp({ type: "recovery", token_hash: tokenHash }));
  } else if (code) {
    ({ error } = await supabase.auth.exchangeCodeForSession(code));
  }

  return NextResponse.redirect(new URL(error ? "/admin/forgot-password?expired=1" : "/admin/reset-password", origin));
}
