// Shared read-side data access, used both by Server Components (direct calls,
// no self-fetch over HTTP) and by the public API routes under app/api - one
// source of truth for how "public" data is queried and serialized.
const prisma = require("./prisma");
const {
  serializeCategory,
  serializeProductListItem,
  serializeProductDetail,
  serializeBanner,
  serializeSocialLink,
  serializeFeedbackConfig,
  serializeFeedbackField,
} = require("./serializers");
const { DEFAULT_FEEDBACK_CONFIG } = require("./feedbackSchema");

async function getCategories() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });
  return categories.map((c) => serializeCategory(c, c._count.products));
}

async function getCategoryBySlug(slug) {
  const category = await prisma.category.findUnique({
    where: { slug },
    include: { _count: { select: { products: true } } },
  });
  if (!category) return null;
  return serializeCategory(category, category._count.products);
}

async function getProducts({ search, category, sort, page = 1, limit = 12 } = {}) {
  const where = { isActive: true };
  if (search) {
    where.OR = [
      { name: { contains: search } },
      { shortDescription: { contains: search } },
      { sku: { contains: search } },
    ];
  }
  if (category) where.category = { slug: category };

  const orderBy = sort === "name" ? { name: "asc" } : { createdAt: "desc" };
  const take = Math.min(Math.max(limit, 1), 100);
  const currentPage = Math.max(page, 1);

  const [items, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { category: true },
      orderBy,
      skip: (currentPage - 1) * take,
      take,
    }),
    prisma.product.count({ where }),
  ]);

  return { items: items.map(serializeProductListItem), total, page: currentPage, limit: take };
}

async function getProductBySlug(slug) {
  const product = await prisma.product.findUnique({ where: { slug }, include: { category: true } });
  if (!product || !product.isActive) return null;
  return serializeProductDetail(product);
}

async function getActiveBanners() {
  const banners = await prisma.banner.findMany({ where: { isActive: true }, orderBy: { order: "asc" } });
  return banners.map(serializeBanner);
}

// Links that are safe to render publicly: enabled *and* actually configured.
// The URL check is a second line of defence - the admin API already rejects
// enabling a platform without a URL, but a row edited directly in the DB (or
// left behind by an older migration) must never reach the footer as a dead
// icon pointing at nothing.
async function getActiveSocialLinks() {
  const links = await prisma.socialLink.findMany({
    where: { isActive: true, NOT: { url: null } },
    orderBy: { order: "asc" },
  });
  return links.filter((l) => l.url && l.url.trim()).map(serializeSocialLink);
}

// Reads the singleton feedback config, falling back to the defaults when no
// row exists yet so callers never have to null-check. Both the public form
// and the submit route read through here, which is what keeps server-side
// validation in step with what the visitor was actually shown.
async function getFeedbackConfig() {
  const config = await prisma.feedbackSetting.findUnique({ where: { key: "default" } });
  return config ? serializeFeedbackConfig(config) : { ...DEFAULT_FEEDBACK_CONFIG };
}

// Every field the admin has defined, in display order. Raw rows (not
// serialized) so callers that need `options` as stored can have it; the
// public reader below serializes.
async function getFeedbackFieldRows() {
  return prisma.feedbackField.findMany({ orderBy: { order: "asc" } });
}

// The whole public form in one read: the config plus the enabled fields in
// order. The submit route and the page both go through here, which is what
// keeps server-side validation in step with what the visitor was shown.
async function getFeedbackForm() {
  const [config, rows] = await Promise.all([getFeedbackConfig(), getFeedbackFieldRows()]);
  return { config, fields: rows.filter((f) => f.isEnabled).map(serializeFeedbackField) };
}

async function getContentSections(page) {
  const blocks = await prisma.contentBlock.findMany({ where: { page }, orderBy: { order: "asc" } });
  return blocks.map((b) => ({ key: b.key, title: b.title, body: b.body, image: b.image, order: b.order }));
}

module.exports = {
  getCategories,
  getCategoryBySlug,
  getProducts,
  getProductBySlug,
  getActiveBanners,
  getActiveSocialLinks,
  getFeedbackConfig,
  getFeedbackFieldRows,
  getFeedbackForm,
  getContentSections,
};
