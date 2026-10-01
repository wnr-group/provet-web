// The homepage's editable content: the blocks Admin > Website Content >
// Homepage shows, and what the homepage renders until the admin saves them.
//
// Same approach as the contact page (lib/contactContent.js): the homepage is
// a bespoke layout, so its set of blocks is fixed, and its copy was
// hard-coded before it was editable - so the defaults live here, and a
// database that has never been saved in the new shape still renders the page
// (and shows the admin every block to edit) instead of coming up empty.
// Saving in the admin writes the rows; from then on the database wins.
//
// Each block can be hidden (the eye in the admin). The blocks marked
// `section` are the homepage's sections between the hero and the closing
// call to action, and their order in the admin is the order on the page. The
// hero slides themselves are edited in Admin > Banners.
const { parseSectionConfig } = require("./sectionTypes");

const HOME_SECTIONS = [
  {
    key: "hero-stats",
    type: "richText",
    bodyFormat: "stats",
    title: "Trusted by veterinarians nationwide",
    body: "250+ Products - 15+ Years Experience - 1,200+ Clinics Served",
    hint: "Shown on every hero slide: the title is the small badge above the headline, the figures are shown under the buttons. Hide it to show neither.",
  },
  {
    key: "feature-strip",
    type: "cards",
    title: "Why choose Provet",
    body: [
      "Reliable Supply: Consistent stock & timely delivery",
      "Certified Quality: GMP-compliant manufacturing",
      "Research Backed: Formulated with veterinary experts",
      "Animal Wellness: Focused on better health outcomes",
    ].join("\n"),
    hint: "The strip under the hero: up to four points, each a heading and a short description. The title is not shown on the page.",
    hideConfig: true,
    section: true,
  },
  {
    key: "species",
    type: "richText",
    title: "Solutions by Species",
    body: "",
    hint: "The heading over the product ranges (Avinova, Blunova, ...). The text is an optional line under it. The ranges themselves come from Admin > Categories.",
    section: true,
  },
  {
    key: "featured",
    type: "richText",
    title: "Featured Products",
    body: "A snapshot of the medicines veterinarians trust most.",
    hint: "The heading over the featured products and the line under it. The products are the ones marked Featured in Admin > Products.",
    section: true,
  },
  {
    key: "stats",
    type: "richText",
    bodyFormat: "stats",
    title: "By the Numbers",
    body: "20+ years combined formulation experience - 100+ SKUs across 6 therapeutic categories - Supplying clinics and distributors across the region.",
    hint: 'Each row is a figure ("20+") and its caption ("years of experience"). Leave the figure empty to show the caption as a note under the figures.',
    section: true,
  },
  {
    key: "testimonials",
    type: "carousel",
    title: "What Our Customers Say",
    body: "",
    hint: "The testimonials carousel: add, reorder or remove slides below.",
    section: true,
  },
  {
    key: "cta",
    type: "richText",
    title: "Need help choosing the right product for your clinic?",
    body: "Our veterinary specialists are ready to guide you through composition, dosage and suitability for your practice.",
    hint: "The closing call to action - always the last section of the page, after any added sections. Its buttons are the enquiry form and the first phone number in Contact Us > Contact details.",
  },
];

const HOME_KEYS = HOME_SECTIONS.map((s) => s.key);

// Older homepage blocks that are no longer part of the homepage or its editor:
// "Our Mission" and "Why Choose Us" (company information lives on the About
// Us pages; the About Us page still shows "Why Choose Us" from its row). They
// stay reserved keys so saving the Homepage editor never deletes those rows.
const RETIRED_HOME_KEYS = ["mission", "why-us"];
const SECTION_KEYS = new Set(HOME_SECTIONS.filter((s) => s.section).map((s) => s.key));

// Every homepage block, filling in any the database doesn't have yet with its
// default. Hidden rows are returned as they are - callers decide what
// `isVisible: false` means.
//
// Order: once the admin has saved every block (so each has a saved order),
// the saved order wins; until then - a database from before these blocks
// were editable - the default order is used, so the page looks exactly as it
// did.
function withHomeDefaults(sections = []) {
  const byKey = new Map(sections.map((s) => [s.key, s]));
  const merged = HOME_SECTIONS.map(({ hint, hideConfig, bodyFormat: _format, section: _section, ...fallback }, index) => {
    const saved = byKey.get(fallback.key);
    const block = saved || { ...fallback, isVisible: true };
    return {
      ...block,
      type: fallback.type,
      config: parseSectionConfig(fallback.type, block.config),
      _default: index,
      _saved: Boolean(saved),
    };
  });
  const allSaved = merged.every((s) => s._saved);
  merged.sort((a, b) => (allSaved ? (a.order ?? 0) - (b.order ?? 0) : a._default - b._default));
  return merged.map(({ _default, _saved, ...s }) => s);
}

// The homepage's sections below the hero, in the admin's order, visible ones
// only - each as its saved block.
function homeSectionOrder(sections) {
  return withHomeDefaults(sections).filter((s) => SECTION_KEYS.has(s.key) && s.isVisible !== false);
}

module.exports = { HOME_SECTIONS, HOME_KEYS, RETIRED_HOME_KEYS, withHomeDefaults, homeSectionOrder };
