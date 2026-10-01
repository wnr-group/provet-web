// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  buildCategoryTree,
  resolveCategorySlug,
  productCategoryWhere,
  productCategoryIdWhere,
  productTaxonomy,
  parentChangeError,
  deleteCategoryError,
  productPlacementError,
  reorderError,
} = require("./categoryTree");

const rows = [
  { id: "aqua", name: "Aquaculture", slug: "aquaculture", parentId: null, sortOrder: 1, productCount: 0 },
  { id: "poultry", name: "Poultry", slug: "poultry", parentId: null, sortOrder: 0, productCount: 0 },
  { id: "amr", name: "Ammonia Reducers", slug: "ammonia-reducers", parentId: "aqua", sortOrder: 0, productCount: 3 },
  { id: "cox", name: "Anticoccidials", slug: "anticoccidials", parentId: "poultry", sortOrder: 1, productCount: 8 },
  { id: "agp", name: "AGPs", slug: "agps", parentId: "poultry", sortOrder: 0, productCount: 8 },
];

// ---- tree ----

test("buildCategoryTree nests subcategories under their category, in order", () => {
  const tree = buildCategoryTree(rows);
  assert.deepEqual(
    tree.map((c) => c.slug),
    ["poultry", "aquaculture"]
  );
  assert.deepEqual(
    tree[0].children.map((c) => c.slug),
    ["agps", "anticoccidials"]
  );
});

test("a category's product count includes its subcategories'", () => {
  const [poultry, aqua] = buildCategoryTree(rows);
  assert.equal(poultry.productCount, 16);
  assert.equal(aqua.productCount, 3);
});

test("siblings sharing a position fall back to name order", () => {
  const tree = buildCategoryTree([
    { id: "p", name: "P", slug: "p", parentId: null },
    { id: "b", name: "Beta", slug: "b", parentId: "p", sortOrder: 0 },
    { id: "a", name: "Alpha", slug: "a", parentId: "p", sortOrder: 0 },
  ]);
  assert.deepEqual(
    tree[0].children.map((c) => c.name),
    ["Alpha", "Beta"]
  );
});

test("a row whose parent is missing surfaces at the top level instead of vanishing", () => {
  const tree = buildCategoryTree([{ id: "x", name: "Orphan", slug: "x", parentId: "gone" }]);
  assert.equal(tree.length, 1);
  assert.equal(tree[0].slug, "x");
});

// ---- slugs ----

test("resolveCategorySlug finds both levels", () => {
  const tree = buildCategoryTree(rows);
  assert.equal(resolveCategorySlug(tree, "poultry").category.slug, "poultry");
  assert.equal(resolveCategorySlug(tree, "poultry").subcategory, null);

  const sub = resolveCategorySlug(tree, "anticoccidials");
  assert.equal(sub.category.slug, "poultry");
  assert.equal(sub.subcategory.slug, "anticoccidials");

  assert.equal(resolveCategorySlug(tree, "nope"), null);
  assert.equal(resolveCategorySlug(tree, ""), null);
});

test("the product filter matches a slug at either level", () => {
  assert.deepEqual(productCategoryWhere("poultry"), {
    category: { OR: [{ slug: "poultry" }, { parent: { slug: "poultry" } }] },
  });
  assert.deepEqual(productCategoryIdWhere("poultry"), {
    OR: [{ categoryId: "poultry" }, { category: { parentId: "poultry" } }],
  });
});

// ---- products ----

test("productTaxonomy reports category and subcategory for a filed product", () => {
  const product = {
    category: { id: "cox", name: "Anticoccidials", slug: "anticoccidials", parent: { id: "poultry", name: "Poultry", slug: "poultry" } },
  };
  assert.deepEqual(productTaxonomy(product), {
    category: { id: "poultry", name: "Poultry", slug: "poultry" },
    subcategory: { id: "cox", name: "Anticoccidials", slug: "anticoccidials" },
  });
});

test("productTaxonomy tolerates a product filed on a top-level category or on none", () => {
  const legacy = { category: { id: "p", name: "Poultry", slug: "poultry", parent: null } };
  assert.deepEqual(productTaxonomy(legacy), {
    category: { id: "p", name: "Poultry", slug: "poultry" },
    subcategory: null,
  });
  assert.deepEqual(productTaxonomy({}), { category: null, subcategory: null });
});

test("products must be filed under a subcategory", () => {
  assert.ok(productPlacementError(null));
  assert.ok(productPlacementError({ id: "poultry", parentId: null }));
  assert.equal(productPlacementError({ id: "cox", parentId: "poultry" }), null);
});

// ---- admin rules ----

test("a subcategory's parent must be a top-level category", () => {
  assert.equal(parentChangeError({ id: "cox", parent: { id: "poultry", parentId: null } }), null);
  assert.ok(parentChangeError({ id: "x", parent: { id: "cox", parentId: "poultry" } }));
  assert.ok(parentChangeError({ id: "poultry", parent: { id: "poultry", parentId: null } }));
});

test("a category with subcategories cannot become a subcategory", () => {
  assert.ok(parentChangeError({ id: "poultry", parent: { id: "aqua", parentId: null }, childCount: 2 }));
});

test("a subcategory holding products cannot be promoted to the top level", () => {
  assert.ok(parentChangeError({ id: "cox", parent: null, becomingTopLevel: true, productCount: 8 }));
  assert.equal(parentChangeError({ id: "cox", parent: null, becomingTopLevel: true, productCount: 0 }), null);
});

test("delete is blocked while a category still holds subcategories or products", () => {
  assert.match(deleteCategoryError({ childCount: 1 }), /1 subcategory/);
  assert.match(deleteCategoryError({ childCount: 3 }), /3 subcategories/);
  assert.match(deleteCategoryError({ productCount: 2 }), /2 products/);
  assert.equal(deleteCategoryError({}), null);
});

test("a reorder must name every sibling exactly once", () => {
  assert.equal(reorderError(["b", "a"], ["a", "b"]), null);
  assert.ok(reorderError(["a"], ["a", "b"]));
  assert.ok(reorderError(["a", "a"], ["a", "b"]));
  assert.ok(reorderError(["a", "c"], ["a", "b"]));
});
