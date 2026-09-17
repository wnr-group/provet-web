const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");

const VALID_STATUSES = ["new", "read", "resolved"];

// GET /api/admin/enquiries?status=&page=&limit=
export async function GET(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit"), 10) || 20, 1), 100);
  const status = searchParams.get("status");

  const where = {};
  if (status) {
    if (!VALID_STATUSES.includes(status)) {
      return Response.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
    }
    where.status = status;
  }

  const [items, total] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      include: { product: { select: { id: true, name: true, slug: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.enquiry.count({ where }),
  ]);

  return Response.json({ items, total, page, limit });
}
