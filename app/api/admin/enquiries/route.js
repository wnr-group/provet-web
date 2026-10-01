const prisma = require("../../../../lib/prisma");
const { requireAdmin } = require("../../../../lib/requireAdmin");
const { parseImages } = require("../../../../lib/serializers");
const { productTaxonomy } = require("../../../../lib/categoryTree");

const VALID_STATUSES = ["new", "read", "resolved"];

// The product an enquiry was sent from, trimmed to what the admin needs to
// recognise it: cover image, where it sits in the catalogue, and whether it is
// still live. null for a general enquiry (or one whose product was deleted).
function serializeEnquiry(enquiry) {
  const { product, ...rest } = enquiry;
  return {
    ...rest,
    product: product
      ? {
          id: product.id,
          name: product.name,
          slug: product.slug,
          isActive: product.isActive,
          image: parseImages(product.images)[0] || null,
          ...productTaxonomy(product),
        }
      : null,
  };
}

// GET /api/admin/enquiries?status=&search=&sort=&page=&limit=
//
// `search` matches name, email, phone, subject and message. `sort` is
// "newest" (default) or "oldest". `counts` gives the total per status for the
// current search, so the filter tabs can show how many each holds.
export async function GET(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const searchParams = request.nextUrl.searchParams;
  const page = Math.max(parseInt(searchParams.get("page"), 10) || 1, 1);
  const limit = Math.min(Math.max(parseInt(searchParams.get("limit"), 10) || 20, 1), 100);
  const status = searchParams.get("status");
  const search = (searchParams.get("search") || "").trim().slice(0, 100);
  const sort = searchParams.get("sort") === "oldest" ? "asc" : "desc";

  if (status && !VALID_STATUSES.includes(status)) {
    return Response.json({ error: `status must be one of: ${VALID_STATUSES.join(", ")}` }, { status: 400 });
  }

  // Case-insensitive: on Postgres a bare `contains` is case-sensitive.
  const searchWhere = search
    ? {
        OR: ["name", "email", "phone", "subject", "message"].map((field) => ({
          [field]: { contains: search, mode: "insensitive" },
        })),
      }
    : {};
  const where = { ...searchWhere, ...(status ? { status } : {}) };

  const [items, total, grouped] = await Promise.all([
    prisma.enquiry.findMany({
      where,
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: true,
            isActive: true,
            category: { select: { id: true, name: true, slug: true, parent: { select: { id: true, name: true, slug: true } } } },
          },
        },
      },
      orderBy: { createdAt: sort },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.enquiry.count({ where }),
    prisma.enquiry.groupBy({ by: ["status"], where: searchWhere, _count: { _all: true } }),
  ]);

  const counts = Object.fromEntries(VALID_STATUSES.map((s) => [s, 0]));
  for (const row of grouped) counts[row.status] = row._count._all;
  counts.all = VALID_STATUSES.reduce((sum, s) => sum + counts[s], 0);

  return Response.json({ items: items.map(serializeEnquiry), total, page, limit, counts });
}
