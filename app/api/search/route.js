const { globalSearch } = require("../../../lib/data");

// GET /api/search?q=&page=&limit= - site-wide search across products,
// categories and pages. Backs the header dropdown; /search renders the same
// data server-side rather than calling this.
export async function GET(request) {
  const searchParams = request.nextUrl.searchParams;
  const result = await globalSearch({
    query: searchParams.get("q"),
    page: parseInt(searchParams.get("page"), 10) || 1,
    limit: parseInt(searchParams.get("limit"), 10) || 5,
  });
  return Response.json(result);
}
