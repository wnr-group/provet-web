const { MANAGED_PAGES, FIXED_CONTENT_PAGES, managedPageHref } = require("./navigation");

// The shared vocabulary of site-wide search: what counts as a query, which
// columns each entity is matched on, and how a content row becomes a link.
//
// Deliberately free of Prisma imports so it stays unit-testable, and shared
// by lib/data.js so the catalogue filter on /products and the header search
// box can never drift apart on what "matches".

// One letter matches almost everything, which makes the dropdown useless and
// the query expensive; two is the shortest thing worth running.
const MIN_QUERY_LENGTH = 2;
// Nothing longer is a real search - it is a paste or an abuse of the query
// string, and it would still be sent to the database on every keystroke.
const MAX_QUERY_LENGTH = 100;

function normalizeQuery(raw) {
  if (typeof raw !== "string") return "";
  return raw.trim().replace(/\s+/g, " ").slice(0, MAX_QUERY_LENGTH);
}

function isSearchableQuery(raw) {
  return normalizeQuery(raw).length >= MIN_QUERY_LENGTH;
}

// No `mode: "insensitive"` anywhere below, on purpose.
//
// That option is Postgres-only: on the SQLite provider this project currently
// uses, Prisma rejects it outright with "Unknown argument `mode`" and the
// whole query throws. SQLite's LIKE is already case-insensitive for ASCII, so
// `contains` alone does what is wanted here.
//
// If this project moves back to Postgres, `contains` becomes case-SENSITIVE
// and every filter below needs `mode: "insensitive"` added. This is the one
// place to change.
function containsAny(fields, query) {
  return { OR: fields.map((field) => ({ [field]: { contains: query } })) };
}

// Split in two on purpose: a hit on the name or the SKU is what the visitor
// meant, a hit buried in the composition or dosage text is a fallback. The
// two are searched as separate tiers so the obvious matches come first (see
// searchProducts in lib/data.js).
const PRODUCT_NAME_FIELDS = ["name", "sku"];
const PRODUCT_DETAIL_FIELDS = [
  "shortDescription",
  "composition",
  "uses",
  "dosage",
  "applications",
  "packSize",
];

function productNameFilter(query) {
  return containsAny(PRODUCT_NAME_FIELDS, query);
}

function productDetailFilter(query) {
  return containsAny(PRODUCT_DETAIL_FIELDS, query);
}

// The complement of productNameFilter, spelled out instead of written as
// `NOT: productNameFilter(query)`.
//
// `sku` is nullable, and in SQL `NOT (name LIKE ... OR sku LIKE ...)` is NULL
// - not true - whenever sku is NULL, so the row is dropped. Written that way
// the second tier would silently lose every product without a SKU. Hence the
// explicit `sku IS NULL` branch; `name` is non-nullable, so negating it
// directly is well defined.
function productNameExclusionFilter(query) {
  const excludes = (field) => ({ [field]: { not: { contains: query } } });
  return { AND: [excludes("name"), { OR: [{ sku: null }, excludes("sku")] }] };
}

// Every field a product can match on - the union of both tiers.
function productSearchFilter(query) {
  return containsAny([...PRODUCT_NAME_FIELDS, ...PRODUCT_DETAIL_FIELDS], query);
}

function categorySearchFilter(query) {
  return containsAny(["name", "description"], query);
}

function pageSearchFilter(query) {
  return containsAny(["title", "description", "seoTitle", "seoDescription"], query);
}

// `config` is included because a section's real copy increasingly lives
// there rather than in `body`: image-card headings and text, CTA button
// labels. Without it a search for a director's name or a booklet title found
// nothing, because those are stored inside the JSON blob.
//
// It is matched as raw JSON, so the query can also hit a structural key
// ("title", "image") or a URL. configText() below is what sorts that out -
// a row whose query appears only in the JSON scaffolding is dropped when the
// result is built.
function contentSearchFilter(query) {
  return containsAny(["title", "body", "config"], query);
}

// The human-readable strings inside a section's config: the words an editor
// typed, not the keys or the URLs around them. Matching a URL would make
// "provet" hit every image on the site.
const CONFIG_TEXT_KEYS = ["title", "text", "label"];

function configText(raw) {
  if (!raw) return "";
  let parsed;
  try {
    parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
  } catch {
    return "";
  }
  if (!parsed || typeof parsed !== "object") return "";

  const out = [];
  for (const list of [parsed.items, parsed.buttons]) {
    if (!Array.isArray(list)) continue;
    for (const entry of list) {
      if (!entry || typeof entry !== "object") continue;
      for (const key of CONFIG_TEXT_KEYS) {
        if (typeof entry[key] === "string" && entry[key].trim()) out.push(entry[key].trim());
      }
    }
  }
  return out.join(" ");
}

// Routes that carry no Page row and no ContentBlock, so nothing in the
// database would ever match them. `keywords` are the words a visitor is
// likely to type for a page whose title does not contain them.
const STATIC_PAGES = [
  {
    key: "products",
    title: "Products",
    href: "/products",
    description: "Browse the full catalogue by category, or search for a specific product.",
    keywords: ["catalogue", "catalog", "range", "brochure", "download", "medicines", "vaccines"],
  },
  {
    key: "contact",
    title: "Contact Us",
    href: "/contact",
    description: "Send an enquiry, share feedback, or find our address and phone number.",
    keywords: ["contact", "enquiry", "enquire", "email", "phone", "address", "feedback", "support"],
  },
];

// Every page key the site can link to, mapped to its route and its label.
// Built from lib/navigation.js so a page added to the menu is searchable
// without touching this file.
const PAGE_ROUTES = new Map([
  ...FIXED_CONTENT_PAGES.map((p) => [p.key, { href: p.href, title: p.label }]),
  ...MANAGED_PAGES.map((p) => [p.key, { href: managedPageHref(p.key), title: p.label }]),
]);

function routeForPageKey(key) {
  return PAGE_ROUTES.get(key) || null;
}

function matchStaticPages(query) {
  const q = query.toLowerCase();
  return STATIC_PAGES.filter((page) =>
    [page.title, page.description, ...page.keywords].some((text) => text.toLowerCase().includes(q))
  );
}

// An excerpt of `text` centred on the first occurrence of the query, so a
// page result shows the sentence that actually matched instead of its first
// 80 characters. Empty string when the query is not in the text at all.
function buildSnippet(text, query, radius = 70) {
  if (!text) return "";
  const plain = String(text).replace(/\s+/g, " ").trim();
  const index = plain.toLowerCase().indexOf(query.toLowerCase());
  if (index === -1) return "";
  const start = Math.max(0, index - radius);
  const end = Math.min(plain.length, index + query.length + radius);
  return `${start > 0 ? "…" : ""}${plain.slice(start, end).trim()}${end < plain.length ? "…" : ""}`;
}

// Merges three sources into one list of page results keyed by route: the
// static index, matching Page rows, and matching ContentBlock rows. A page
// whose title *and* whose body both match must appear once, not three times.
//
// Content wins the excerpt when it has one, because a snippet showing the
// match in context beats a canned description.
function buildPageResults(query, pageRows = [], contentRows = []) {
  const byHref = new Map();

  for (const page of matchStaticPages(query)) {
    byHref.set(page.href, { key: page.key, title: page.title, href: page.href, excerpt: page.description });
  }

  for (const row of pageRows) {
    const route = routeForPageKey(row.key);
    if (!route) continue;
    byHref.set(route.href, {
      key: row.key,
      title: row.title || route.title,
      href: route.href,
      excerpt: buildSnippet(row.description, query) || row.description || "",
    });
  }

  for (const row of contentRows) {
    const route = routeForPageKey(row.page);
    if (!route) continue;

    const snippet =
      buildSnippet(row.body, query) ||
      buildSnippet(row.title, query) ||
      buildSnippet(configText(row.config), query);

    // No snippet means the query matched only the config's JSON scaffolding
    // or a URL inside it, not anything a visitor would read. Listing the page
    // then would send them somewhere the word does not appear.
    if (!snippet) continue;

    const existing = byHref.get(route.href);
    if (existing) {
      if (snippet) existing.excerpt = snippet;
      continue;
    }
    byHref.set(route.href, {
      key: row.page,
      title: route.title,
      href: route.href,
      excerpt: snippet || row.title || "",
    });
  }

  return [...byHref.values()];
}

module.exports = {
  MIN_QUERY_LENGTH,
  MAX_QUERY_LENGTH,
  normalizeQuery,
  isSearchableQuery,
  productNameFilter,
  productDetailFilter,
  productNameExclusionFilter,
  productSearchFilter,
  categorySearchFilter,
  pageSearchFilter,
  contentSearchFilter,
  configText,
  STATIC_PAGES,
  PAGE_ROUTES,
  routeForPageKey,
  matchStaticPages,
  buildSnippet,
  buildPageResults,
};
