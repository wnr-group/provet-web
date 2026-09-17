const { getProducts } = require("../../../lib/data");

// GET /api/products?search=&category=&page=&limit=&sort=
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const result = await getProducts({
    search: searchParams.get("search"),
    category: searchParams.get("category"),
    sort: searchParams.get("sort"),
    page: parseInt(searchParams.get("page"), 10) || 1,
    limit: parseInt(searchParams.get("limit"), 10) || 12,
  });
  return Response.json(result);
}
