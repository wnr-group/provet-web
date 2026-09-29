// The catalogue's Category -> Subcategory hierarchy, as pure functions.
//
// Both levels live in the one Category table (see prisma/schema.prisma): a
// row with no parentId is a top-level category, a row with one is a
// subcategory, and products are filed under subcategories. Everything that
// has to agree on what that means - the admin API's validation, the public
// catalogue's filters, the product serializers - reads it from here.
//
// Deliberately free of Prisma imports, like lib/search.js, so it stays
// unit-testable.

// Siblings sort by their admin-set position, then by name so rows that share
// a position (a fresh import, say) still come out in a stable, readable order.
function compareCategories(a, b) {
  const byOrder = (a.sortOrder ?? 0) - (b.sortOrder ?? 0);
  return byOrder || String(a.name).localeCompare(String(b.name));
}

// Flat rows (each with parentId and an optional productCount of its own
// products) -> top-level categories, each carrying its sorted `children`.
// A category's productCount is its own products plus its subcategories',
// which is what a visitor browsing that category will actually see.
//
// A row whose parent is missing from the list is surfaced at the top level
// rather than silently dropped, so nothing goes invisible.
function buildCategoryTree(rows) {
  const ids = new Set(rows.map((r) => r.id));
  const childrenOf = new Map();
  const roots = [];

  for (const row of rows) {
    if (row.parentId && ids.has(row.parentId)) {
      if (!childrenOf.has(row.parentId)) childrenOf.set(row.parentId, []);
      childrenOf.get(row.parentId).push(row);
    } else {
      roots.push(row);
    }
  }

  return roots.sort(compareCategories).map((root) => {
    const children = (childrenOf.get(root.id) || []).sort(compareCategories).map((child) => ({
      ...child,
      productCount: child.productCount ?? 0,
    }));
    const own = root.productCount ?? 0;
    return {
      ...root,
      productCount: own + children.reduce((sum, c) => sum + c.productCount, 0),
      children,
    };
  });
}

// Which node a `?category=<slug>` names, at either level. A subcategory slug
// resolves to its parent too, so the page can show "Poultry > Anticoccidials".
function resolveCategorySlug(tree, slug) {
  if (!slug) return null;
  for (const category of tree) {
    if (category.slug === slug) return { category, subcategory: null };
    const subcategory = category.children.find((c) => c.slug === slug);
    if (subcategory) return { category, subcategory };
  }
  return null;
}

// Prisma `where` on Product for "everything under this slug": a subcategory's
// own products, or - for a top-level category - its subcategories' products
// (plus any filed on the category itself). One filter for both levels means
// every existing /products?category=<slug> link keeps working unchanged.
function productCategoryWhere(slug) {
  return { category: { OR: [{ slug }, { parent: { slug } }] } };
}

// The same, by id - for the admin product list's category filter.
function productCategoryIdWhere(id) {
  return { OR: [{ categoryId: id }, { category: { parentId: id } }] };
}

// A product row (with `category` and, when loaded, `category.parent`) ->
// the public { category, subcategory } pair. Products are filed under a
// subcategory, so normally `category` is its parent; a product still filed
// directly on a top-level category (from before the hierarchy) reports that
// category with no subcategory rather than failing.
const categoryRef = (c) => (c ? { id: c.id, name: c.name, slug: c.slug } : null);

function productTaxonomy(product) {
  const filed = product?.category;
  if (!filed) return { category: null, subcategory: null };
  if (filed.parent) return { category: categoryRef(filed.parent), subcategory: categoryRef(filed) };
  return { category: categoryRef(filed), subcategory: null };
}

// ---- admin rules --------------------------------------------------------
//
// Each returns an error message for the admin, or null when the change is
// allowed. They take plain facts rather than querying, so the routes gather
// the facts once and the rules stay testable.

// Where a category may sit. Only two levels exist, so a parent must itself be
// top-level, and a category that already has subcategories cannot become one.
function parentChangeError({ id, parent, childCount = 0, productCount = 0, becomingTopLevel = false }) {
  if (parent) {
    if (id && parent.id === id) return "A category cannot be its own parent.";
    if (parent.parentId) return "Subcategories can only be placed under a top-level category.";
    if (childCount > 0) {
      return "This category has subcategories of its own, so it cannot become a subcategory. Move or delete them first.";
    }
  }
  if (becomingTopLevel && productCount > 0) {
    return "Products are filed under subcategories. Move this subcategory's products elsewhere before making it a top-level category.";
  }
  return null;
}

function deleteCategoryError({ childCount = 0, productCount = 0 }) {
  if (childCount > 0) {
    return `This category still has ${childCount} ${childCount === 1 ? "subcategory" : "subcategories"}. Move or delete ${childCount === 1 ? "it" : "them"} first.`;
  }
  if (productCount > 0) {
    return `This category still has ${productCount} ${productCount === 1 ? "product" : "products"}. Move ${productCount === 1 ? "it" : "them"} to another subcategory first.`;
  }
  return null;
}

// Products are filed under a subcategory, never directly on a top-level
// category - that is what makes "Category > Subcategory > Product" hold.
function productPlacementError(category) {
  if (!category) return "Choose a subcategory for this product.";
  if (!category.parentId) return "Choose a subcategory - products are filed under a subcategory, not directly under a category.";
  return null;
}

// A reorder must name every sibling exactly once; a partial list would leave
// stale positions behind and scramble the order.
function reorderError(ids, siblingIds) {
  const known = new Set(siblingIds);
  if (new Set(ids).size !== ids.length) return "The reorder list contains duplicates.";
  if (ids.length !== siblingIds.length || ids.some((id) => !known.has(id))) {
    return "The reorder list must name every category at that level exactly once.";
  }
  return null;
}

module.exports = {
  compareCategories,
  buildCategoryTree,
  resolveCategorySlug,
  productCategoryWhere,
  productCategoryIdWhere,
  productTaxonomy,
  parentChangeError,
  deleteCategoryError,
  productPlacementError,
  reorderError,
};
