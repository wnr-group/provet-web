// The site's menu structure, fixed in code for now.
//
// Modelled on the old Provet site's information architecture (About us /
// Products / Resources / Media / Careers / Contact). Two deliberate
// adaptations, because the current data model differs from the old site's:
//
//   * Products has no brand tier. The old site split the catalogue into
//     Avinova (poultry) and Blunova (aqua) and hung categories under each;
//     `Category` here is flat, so the Products submenu is filled from the
//     real categories at render time rather than inventing a tier the
//     database cannot populate.
//   * Resources and Media are content pages, not feeds. The old site's
//     Technical Articles / Booklets / Magazine / News / Events are article
//     listings; with no Post or Resource model they are built here as
//     ordinary configurable pages, which is enough to carry their copy and
//     imagery today and can be pointed at a feed later.
//
// This module is the single source for the header and the footer, so the two
// can never disagree about what the site contains. Everything a menu points
// at is either a real route or a MANAGED_PAGES key - nothing here invents a
// destination.

// Pages whose whole body is assembled from admin-configured sections. The
// key doubles as the route (`/` + key) and as ContentBlock.page, so adding a
// page later means one entry here plus its row - no new renderer.
const MANAGED_PAGES = [
  { key: "about/who-we-are", label: "Who We Are", group: "About Us" },
  { key: "about/core-values", label: "Core Values", group: "About Us" },
  { key: "about/why-provet", label: "Why Provet", group: "About Us" },
  { key: "resources/technical-articles", label: "Technical Articles", group: "Resources" },
  { key: "resources/booklets", label: "Booklets", group: "Resources" },
  { key: "resources/magazine", label: "Magazine", group: "Resources" },
  { key: "resources/trial-reports", label: "Trial Reports", group: "Resources" },
  { key: "media/news", label: "News", group: "Media" },
  { key: "media/events", label: "Events", group: "Media" },
  { key: "careers", label: "Careers", group: "Careers" },
];

const MANAGED_PAGE_KEYS = MANAGED_PAGES.map((p) => p.key);

// Pages that exist as bespoke layouts rather than section stacks. Their
// ContentBlock rows are editable in the admin, but the set of sections is
// fixed by the code that renders them, so the admin must not add or remove
// any (see the `fixed` flag the admin screen reads).
const FIXED_CONTENT_PAGES = [
  { key: "home", label: "Homepage", href: "/" },
  { key: "about", label: "About Us", href: "/about" },
  // Its blocks have built-in defaults (lib/contactContent.js), so it renders
  // and edits correctly even on a database seeded before it was editable.
  { key: "contact", label: "Contact Us", href: "/contact" },
];

function managedPageHref(key) {
  return `/${key}`;
}

function isManagedPageKey(key) {
  return MANAGED_PAGE_KEYS.includes(key);
}

// Every page the admin can edit content for, in the order the admin screen
// lists them: the bespoke ones first, then the section-built ones.
function contentPages() {
  return [
    ...FIXED_CONTENT_PAGES.map((p) => ({ ...p, fixed: true, group: "Site" })),
    ...MANAGED_PAGES.map((p) => ({ ...p, href: managedPageHref(p.key), fixed: false })),
  ];
}

const managed = (key) => {
  const page = MANAGED_PAGES.find((p) => p.key === key);
  if (!page) throw new Error(`Unknown managed page: ${key}`);
  return { label: page.label, href: managedPageHref(page.key) };
};

// Every managed page belonging to a group, in the order MANAGED_PAGES lists
// them. This is what makes the menu derive from the page registry instead of
// repeating it.
function pagesInGroup(group) {
  return MANAGED_PAGES.filter((page) => page.group === group).map((page) => ({
    label: page.label,
    href: managedPageHref(page.key),
  }));
}

// The top-level menu, in order.
//
// `group` pulls that entry's children from MANAGED_PAGES rather than naming
// them again here. The two lists used to be maintained in parallel, which
// meant adding a page made it appear in the admin and at its URL but not in
// the menu - a discrepancy nobody would think to look for.
//
// `href` without a group is a plain link; `dynamic: "categories"` tells the
// navbar to fill the submenu from the catalogue instead.
const MENU = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about", group: "About Us" },
  { label: "Products", href: "/products", dynamic: "categories" },
  { label: "Resources", group: "Resources" },
  { label: "Media", group: "Media" },
  { label: "Careers", group: "Careers" },
  { label: "Contact", href: "/contact" },
];

const MAIN_NAV = MENU.flatMap((item) => {
  if (!item.group) return [item];

  const children = pagesInGroup(item.group);

  // A group holding one page is a plain link, not a dropdown with a single
  // row in it - which is how Careers renders today. Add a second page to the
  // group and it becomes a dropdown on its own.
  if (children.length === 1 && !item.href) return [{ label: item.label, href: children[0].href }];

  // A group with no pages yet would otherwise render an empty dropdown.
  if (!children.length) return item.href ? [{ label: item.label, href: item.href }] : [];

  return [{ ...item, children }];
});

// The footer's link columns, following the old site's grouping.
const FOOTER_NAV = [
  {
    title: "About Us",
    links: [
      managed("about/who-we-are"),
      managed("about/core-values"),
      managed("about/why-provet"),
      managed("careers"),
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Important Links",
    links: [
      { label: "Products", href: "/products" },
      managed("resources/booklets"),
      managed("resources/technical-articles"),
      managed("media/news"),
      managed("media/events"),
    ],
  },
];

module.exports = {
  MANAGED_PAGES,
  MANAGED_PAGE_KEYS,
  FIXED_CONTENT_PAGES,
  MAIN_NAV,
  FOOTER_NAV,
  managedPageHref,
  isManagedPageKey,
  contentPages,
};
