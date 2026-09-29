// The built-in content blocks of the pages laid out in code (home, about,
// contact - FIXED_CONTENT_PAGES in lib/navigation.js).
//
// Each of these layouts renders a fixed set of block keys in its own design
// (the homepage mission statement, the About story, the contact details...).
// Those blocks can be edited but not deleted or retyped, because the layout
// depends on them. Anything else on the page is a section the admin added:
// it can be any section type (videos, cards, a product grid...), is rendered
// after the page's own content by components/sections/PageSections, and can
// be reordered and removed freely.
//
// Pure data, no Prisma - shared by the admin editor, the content API and the
// public pages so all three agree on which block is which.
const { CONTACT_SECTIONS } = require("./contactContent");
const { HOME_KEYS, RETIRED_HOME_KEYS } = require("./homeContent");

const BUILT_IN_SECTION_KEYS = {
  // The retired keys are reserved rather than editable: never shown in the
  // Homepage editor (it lists HOME_KEYS), never deleted when it saves.
  home: [...HOME_KEYS, ...RETIRED_HOME_KEYS],
  about: ["story", "mission", "quality", "team"],
  contact: CONTACT_SECTIONS.map((s) => s.key),
};

function isFixedContentPage(page) {
  return Object.prototype.hasOwnProperty.call(BUILT_IN_SECTION_KEYS, page);
}

function builtInSectionKeys(page) {
  return BUILT_IN_SECTION_KEYS[page] || [];
}

function isBuiltInSection(page, key) {
  return builtInSectionKeys(page).includes(key);
}

// The sections an admin added to a fixed page, in their saved order.
function addedSections(page, sections = []) {
  const builtIn = new Set(builtInSectionKeys(page));
  return sections.filter((s) => !builtIn.has(s.key)).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

module.exports = { BUILT_IN_SECTION_KEYS, isFixedContentPage, builtInSectionKeys, isBuiltInSection, addedSections };
