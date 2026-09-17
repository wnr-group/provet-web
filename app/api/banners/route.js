const { getActiveBanners } = require("../../../lib/data");

export async function GET() {
  return Response.json(await getActiveBanners());
}
