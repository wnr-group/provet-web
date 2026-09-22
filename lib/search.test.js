// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  MIN_QUERY_LENGTH,
  MAX_QUERY_LENGTH,
  normalizeQuery,
  isSearchableQuery,
  productNameFilter,
  productDetailFilter,
  productNameExclusionFilter,
  productSearchFilter,
  categorySearchFilter,
  routeForPageKey,
  matchStaticPages,
  buildSnippet,
  buildPageResults,
} = require("./search");

// ---- query handling ----

test("normalizeQuery trims and collapses whitespace", () => {
  assert.equal(normalizeQuery("  amoxicillin  bolus "), "amoxicillin bolus");
  assert.equal(normalizeQuery("a\n\tb"), "a b");
});

test("normalizeQuery returns an empty string for non-strings", () => {
  for (const value of [null, undefined, 42, {}, []]) {
    assert.equal(normalizeQuery(value), "");
  }
});

test("normalizeQuery caps the length", () => {
  assert.equal(normalizeQuery("x".repeat(500)).length, MAX_QUERY_LENGTH);
});

test("isSearchableQuery rejects anything shorter than the minimum", () => {
  assert.equal(isSearchableQuery("a"), false);
  assert.equal(isSearchableQuery("  a  "), false);
  assert.equal(isSearchableQuery(""), false);
  assert.equal(isSearchableQuery(null), false);
  assert.equal(isSearchableQuery("x".repeat(MIN_QUERY_LENGTH)), true);
});

// ---- filters ----

test("no filter sets `mode`, which SQLite rejects", () => {
  // Prisma throws "Unknown argument `mode`" on this provider, so a stray
  // mode:"insensitive" would take down every search rather than degrade it.
  const clauses = [
    ...productSearchFilter("x").OR,
    ...categorySearchFilter("x").OR,
  ];
  for (const clause of clauses) {
    const [[, condition]] = Object.entries(clause);
    assert.equal(condition.contains, "x");
    assert.equal("mode" in condition, false);
  }
});

test("the two product tiers partition the full product filter", () => {
  const fields = (filter) => filter.OR.map((c) => Object.keys(c)[0]);
  const names = fields(productNameFilter("amox"));
  const details = fields(productDetailFilter("amox"));
  const all = fields(productSearchFilter("amox"));

  assert.deepEqual(names, ["name", "sku"]);
  // Disjoint, and together they cover every searched field - otherwise the
  // paginated two-tier read would double-count or drop products.
  assert.deepEqual(
    names.filter((f) => details.includes(f)),
    []
  );
  assert.deepEqual([...names, ...details].sort(), [...all].sort());
});

test("the name exclusion filter lets a NULL sku through", () => {
  // `NOT (name LIKE .. OR sku LIKE ..)` is NULL - and so excludes the row -
  // when sku is NULL. The filter has to spell the null case out instead.
  const filter = productNameExclusionFilter("amox");
  const skuClause = filter.AND.find((c) => c.OR);
  assert.ok(skuClause, "expected an OR branch covering sku");
  assert.ok(
    skuClause.OR.some((c) => c.sku === null),
    "expected an explicit `sku IS NULL` branch"
  );
  assert.deepEqual(filter.AND[0], { name: { not: { contains: "amox" } } });
});

test("category filter covers name and description", () => {
  const fields = categorySearchFilter("vaccine").OR.map((c) => Object.keys(c)[0]);
  assert.deepEqual(fields, ["name", "description"]);
});

// ---- routes ----

test("page keys resolve to their public routes", () => {
  assert.equal(routeForPageKey("home").href, "/");
  assert.equal(routeForPageKey("about").href, "/about");
  assert.equal(routeForPageKey("about/who-we-are").href, "/about/who-we-are");
  assert.equal(routeForPageKey("careers").href, "/careers");
});

test("an unknown page key resolves to nothing", () => {
  assert.equal(routeForPageKey("does/not/exist"), null);
});

test("matchStaticPages covers routes with no database row", () => {
  assert.deepEqual(
    matchStaticPages("enquiry").map((p) => p.href),
    ["/contact"]
  );
  // "brochure" appears only in the Products page keywords.
  assert.deepEqual(
    matchStaticPages("brochure").map((p) => p.href),
    ["/products"]
  );
  assert.deepEqual(matchStaticPages("zzzz"), []);
});

test("matchStaticPages ignores case", () => {
  assert.deepEqual(matchStaticPages("CONTACT"), matchStaticPages("contact"));
});

// ---- snippets ----

test("buildSnippet centres the excerpt on the match", () => {
  const text = `${"a".repeat(200)} amoxicillin ${"b".repeat(200)}`;
  const snippet = buildSnippet(text, "amoxicillin", 10);
  assert.ok(snippet.includes("amoxicillin"));
  assert.ok(snippet.startsWith("…"));
  assert.ok(snippet.endsWith("…"));
  assert.ok(snippet.length < 60);
});

test("buildSnippet returns nothing when the query is absent", () => {
  assert.equal(buildSnippet("nothing here", "amox"), "");
  assert.equal(buildSnippet("", "amox"), "");
  assert.equal(buildSnippet(null, "amox"), "");
});

test("buildSnippet matches case-insensitively and normalizes whitespace", () => {
  assert.equal(buildSnippet("Our  Mission\nstatement", "mission"), "Our Mission statement");
});

// ---- page results ----

test("buildPageResults maps a Page row to its route", () => {
  const rows = [{ key: "careers", title: "Careers", description: "Join our team" }];
  const results = buildPageResults("careers", rows, []);
  assert.equal(results.length, 1);
  assert.equal(results[0].href, "/careers");
  assert.equal(results[0].title, "Careers");
});

test("buildPageResults maps a content block to its page route", () => {
  const rows = [{ page: "about", title: "Our Mission", body: "We deliver quality vaccines." }];
  const results = buildPageResults("mission", [], rows);
  assert.equal(results.length, 1);
  assert.equal(results[0].href, "/about");
  assert.ok(results[0].excerpt.includes("Our Mission"));
});

test("a page matching in several ways is listed once", () => {
  // Title, page row and two content blocks all match - one result, not four.
  const pageRows = [{ key: "about/who-we-are", title: "Who We Are", description: "about us" }];
  const contentRows = [
    { page: "about/who-we-are", title: "Our Story", body: "about our team" },
    { page: "about/who-we-are", title: "The Team", body: "about our values" },
  ];
  const hrefs = buildPageResults("about", pageRows, contentRows).map((p) => p.href);
  assert.deepEqual(hrefs, [...new Set(hrefs)]);
});

test("a content snippet beats a canned description", () => {
  const pageRows = [{ key: "careers", title: "Careers", description: "Generic blurb" }];
  const contentRows = [{ page: "careers", title: "Roles", body: "We are hiring a field officer now." }];
  const [result] = buildPageResults("field officer", pageRows, contentRows);
  assert.ok(result.excerpt.includes("field officer"));
});

test("buildPageResults skips rows with no public route", () => {
  // "bolus" deliberately matches nothing in the static index, so the only
  // thing that could come back is the unroutable row.
  assert.deepEqual(buildPageResults("bolus", [{ key: "internal", title: "bolus plan" }], []), []);
  assert.deepEqual(buildPageResults("bolus", [], [{ page: "internal", title: "x", body: "bolus" }]), []);
});

test("buildPageResults works with no rows at all", () => {
  assert.deepEqual(
    buildPageResults("contact").map((p) => p.href),
    ["/contact"]
  );
});
