const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { serializeFeedback } = require("../../../../lib/serializers");

// GET /api/admin/feedback?page=&limit=
// Same pagination contract as /api/admin/enquiries: { items, total, page, limit }.
export async function GET(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit"), 10) || 20, 1), 100);

  const [items, total] = await Promise.all([
    prisma.feedback.findMany({
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.feedback.count(),
  ]);

  return Response.json({ items: items.map(serializeFeedback), total, page, limit });
}
