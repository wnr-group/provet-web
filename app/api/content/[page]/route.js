const { getContentSections } = require("../../../../lib/data");

export async function GET(request, { params }) {
  const { page } = await params;
  const sections = await getContentSections(page);
  return Response.json({ page, sections });
}
