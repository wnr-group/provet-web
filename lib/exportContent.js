// The Export page's editable content: the blocks Admin > Website Content >
// Export shows, and what the page and the homepage's export map render until
// the admin saves them. Same approach as lib/contactContent.js: the layout is
// bespoke, so the set of blocks is fixed, and the defaults live here so a
// database that has never been saved in this shape still renders (and shows
// the admin every block to edit). Saving writes the rows; from then on the
// database wins.
const { parseSectionConfig } = require("./sectionTypes");

const EXPORT_SECTIONS = [
  {
    key: "hero",
    type: "imageText",
    title: "Animal Health, Delivered Worldwide",
    body: "Provet products reach farms, hatcheries and clinics well beyond home. Explore the regions and countries we distribute to.",
    image: "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80",
    hint: "The Export page banner: the heading, the line under it and the full-width banner photo. The country total beside the intro is counted from the regions below.",
    hideConfig: true,
  },
  {
    key: "regions",
    type: "cards",
    bodyFormat: "regions",
    title: "Where We Export",
    // Each row is "Region: Country, Country, ...".
    body: [
      "South Asia: India, Sri Lanka, Bangladesh, Nepal",
      "Southeast Asia: Vietnam, Thailand, Indonesia, Philippines, Malaysia",
      "Middle East & Africa: UAE, Saudi Arabia, Egypt, Kenya, Nigeria",
      "Americas: Ecuador, Peru, Mexico, Brazil",
    ].join("\n"),
    hint: "The countries shown on the world map on the Export page. One row per region; list its countries separated by commas. The title is the heading over the map; the totals are counted from the rows.",
    hideConfig: true,
  },
  {
    key: "distributors",
    type: "cards",
    bodyFormat: "distributors",
    title: "Distributor contacts",
    // One row per country: "Country: Name | Address | Phone | Email". These
    // are placeholders - replace each with the real distributor's details. The
    // trailing line break keeps a single row from being split on its pipes.
    body:
      [
        "India",
        "Sri Lanka",
        "Bangladesh",
        "Nepal",
        "Vietnam",
        "Thailand",
        "Indonesia",
        "Philippines",
        "Malaysia",
        "UAE",
        "Saudi Arabia",
        "Egypt",
        "Kenya",
        "Nigeria",
        "Ecuador",
        "Peru",
        "Mexico",
        "Brazil",
      ]
        .map((country) => `${country}: Distributor Name | Street Address, City | +00 000 000 0000 | name@example.com`)
        .join("\n") + "\n",
    hint: "The contact shown when a visitor opens a country on the Export page: one row per country with the distributor's name, address, phone and email. A country with no row (or an empty row) simply isn't clickable. The country must be spelled as in the Regions block. The title is not shown on the page.",
    hideConfig: true,
  },
];

const EXPORT_KEYS = EXPORT_SECTIONS.map((s) => s.key);

function withExportDefaults(sections = []) {
  const byKey = new Map(sections.map((s) => [s.key, s]));
  return EXPORT_SECTIONS.map(({ hint, hideConfig, bodyFormat: _format, ...fallback }) => {
    const saved = byKey.get(fallback.key);
    const section = saved || { ...fallback, isVisible: true };
    return { ...section, type: fallback.type, config: parseSectionConfig(fallback.type, section.config) };
  });
}

module.exports = { EXPORT_SECTIONS, EXPORT_KEYS, withExportDefaults };
