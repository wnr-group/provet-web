const { cookies } = require("next/headers");
const { COOKIE_NAME } = require("../../../../lib/auth");

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  return Response.json({ success: true });
}
