const { getCategories } = require("../../../lib/data");

export async function GET() {
  return Response.json(await getCategories());
}
