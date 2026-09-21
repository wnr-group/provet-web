const { getActiveSocialLinks } = require("../../../lib/data");

// GET /api/social-links - enabled, configured links only.
export async function GET() {
  return Response.json(await getActiveSocialLinks());
}
