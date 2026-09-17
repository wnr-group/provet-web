const { getProductBySlug } = require("../../../../lib/data");

export async function GET(request, { params }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return Response.json({ error: "Product not found" }, { status: 404 });
  return Response.json(product);
}
