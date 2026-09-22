// Shared read-side data access, used both by Server Components (direct calls,
// no self-fetch over HTTP) and by the public API routes under app/api - one
// source of truth for how "public" data is queried and serialized.
const prisma = require("./prisma");
const {
  serializeCategory,
  serializeProductListItem,
  serializeProductDetail,
  serializeBanner,
  serializePage,
  serializeSection,
  serializeSocialLink,
  serializeFeedbackConfig,
  serializeFeedbackField,
} = require("./serializers");
const { DEFAULT_FEEDBACK_CONFIG } = require("./feedbackSchema");
const {
  normalizeQuery,
  isSearchableQuery,
  productNameFilter,
  productDetailFilter,
  productNameExclusionFilter,
  productSearchFilter,
  categorySearchFilter,
  pageSearchFilter,
  contentSearchFilter,
  buildPageResults,
} = require("./search");

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
  // One matching rule for the whole site (see lib/search.js), so a query that
  // finds a product from the header search box also finds it here.
  const query = normalizeQuery(search);
  if (isSearchableQuery(query)) Object.assign(where, productSearchFilter(query));
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

// A managed page plus the sections that should actually render: visible
// ones, in order, with each section's live data already resolved. Returns
// null when the page has no row yet, which the route turns into a 404 rather
// than an empty shell.
async function getManagedPage(key) {
  const [page, blocks] = await Promise.all([
    prisma.page.findUnique({ where: { key } }),
    prisma.contentBlock.findMany({ where: { page: key, isVisible: true }, orderBy: { order: "asc" } }),
  ]);
  if (!page) return null;

  const sections = blocks.map(serializeSection);
  return { page: serializePage(page), sections: await resolveSectionData(sections) };
}

// Fills in the rows a section needs from other tables. Done here, in one
// pass, rather than inside each renderer: a Server Component that queried per
// section would fan out a request per card on the page.
async function resolveSectionData(sections) {
  return Promise.all(
    sections.map(async (section) => {
      if (section.type === "productGrid") {
        const { categorySlug, limit, featuredOnly } = section.config;
        const where = { isActive: true };
        if (categorySlug) where.category = { slug: categorySlug };
        if (featuredOnly) where.isFeatured = true;
        const rows = await prisma.product.findMany({
          where,
          include: { category: true },
          orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
          take: Math.min(Math.max(limit || 3, 1), 12),
        });
        return { ...section, products: rows.map(serializeProductListItem) };
      }

      if (section.type === "categoryGrid") {
        const rows = await prisma.category.findMany({
          orderBy: { name: "asc" },
          include: { _count: { select: { products: true } } },
          take: Math.min(Math.max(section.config.limit || 6, 1), 12),
        });
        return { ...section, categories: rows.map((c) => serializeCategory(c, c._count.products)) };
      }

      return section;
    })
  );
}

// Every section of a page including the hidden ones, for the admin screen.
async function getPageForAdmin(key) {
  const [page, blocks] = await Promise.all([
    prisma.page.findUnique({ where: { key } }),
    prisma.contentBlock.findMany({ where: { page: key }, orderBy: { order: "asc" } }),
  ]);
  return { page: page ? serializePage(page) : null, sections: blocks.map(serializeSection) };
}

// Product search for the results page, ranked in two tiers: rows whose name
// or SKU matches come before rows that only matched deeper in the copy
// (composition, dosage, ...). Two counts plus a windowed read rather than
// sorting in JS, because the ranking has to survive pagination - sorting only
// the rows on the current page would reshuffle the list per page.
async function searchProducts({ query, page = 1, limit = 12 } = {}) {
  const q = normalizeQuery(query);
  // `|| n` also absorbs NaN, which is what `?page=abc` in the URL produces.
  const take = Math.min(Math.max(Number(limit) || 12, 1), 100);
  const currentPage = Math.max(Number(page) || 1, 1);
  if (!isSearchableQuery(q)) return { items: [], total: 0, page: currentPage, limit: take };

  const primaryWhere = { isActive: true, ...productNameFilter(q) };
  // A hit in the body copy, minus everything the first tier already covers -
  // so the two tiers are disjoint and their union is the full result set.
  const secondaryWhere = {
    isActive: true,
    ...productDetailFilter(q),
    ...productNameExclusionFilter(q),
  };

  const [primaryTotal, secondaryTotal] = await Promise.all([
    prisma.product.count({ where: primaryWhere }),
    prisma.product.count({ where: secondaryWhere }),
  ]);

  const orderBy = [{ isFeatured: "desc" }, { name: "asc" }];
  const skip = (currentPage - 1) * take;
  const rows = [];

  if (skip < primaryTotal) {
    rows.push(
      ...(await prisma.product.findMany({ where: primaryWhere, include: { category: true }, orderBy, skip, take }))
    );
  }
  if (rows.length < take) {
    // Once the first tier is exhausted the window continues into the second,
    // offset by however much of the first tier is behind us.
    const secondarySkip = Math.max(skip - primaryTotal, 0);
    rows.push(
      ...(await prisma.product.findMany({
        where: secondaryWhere,
        include: { category: true },
        orderBy,
        skip: secondarySkip,
        take: take - rows.length,
      }))
    );
  }

  return {
    items: rows.map(serializeProductListItem),
    total: primaryTotal + secondaryTotal,
    page: currentPage,
    limit: take,
  };
}

// Site-wide search: products, categories and pages in one call, used by the
// header dropdown and by /search. Only products are paginated; there are only
// ever a handful of categories and pages, so `auxiliaryLimit` caps those two
// lists independently of the product page size (the dropdown wants a preview
// of each, the results page wants them all). Their `total` is always the real
// match count either way.
async function globalSearch({ query, page = 1, limit = 5, auxiliaryLimit } = {}) {
  const q = normalizeQuery(query);
  const take = Math.min(Math.max(Number(limit) || 5, 1), 100);
  const auxTake = Math.min(Math.max(Number(auxiliaryLimit) || take, 1), 100);

  if (!isSearchableQuery(q)) {
    return {
      query: q,
      total: 0,
      products: { items: [], total: 0, page: 1, limit: take },
      categories: { items: [], total: 0 },
      pages: { items: [], total: 0 },
    };
  }

  const [products, categoryRows, pageRows, contentRows] = await Promise.all([
    searchProducts({ query: q, page, limit: take }),
    prisma.category.findMany({
      where: categorySearchFilter(q),
      orderBy: { name: "asc" },
      include: { _count: { select: { products: true } } },
    }),
    prisma.page.findMany({ where: pageSearchFilter(q), orderBy: { key: "asc" } }),
    // Hidden sections are not on the public page, so a hit inside one would
    // send the visitor to a page that does not contain what they searched.
    prisma.contentBlock.findMany({
      where: { isVisible: true, ...contentSearchFilter(q) },
      orderBy: [{ page: "asc" }, { order: "asc" }],
    }),
  ]);

  const categories = categoryRows.map((c) => serializeCategory(c, c._count.products));
  const pages = buildPageResults(q, pageRows, contentRows);

  return {
    query: q,
    total: products.total + categories.length + pages.length,
    products,
    categories: { items: categories.slice(0, auxTake), total: categories.length },
    pages: { items: pages.slice(0, auxTake), total: pages.length },
  };
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
  searchProducts,
  globalSearch,
  getManagedPage,
  getPageForAdmin,
  getActiveSocialLinks,
  getFeedbackConfig,
  getFeedbackFieldRows,
  getFeedbackForm,
  getContentSections,
};
