const { getCategoryBySlug } = require("../../../../lib/data");

export async function GET(request, { params }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return Response.json({ error: "Category not found" }, { status: 404 });
  return Response.json(category);
}
