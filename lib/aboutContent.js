// The About Us page's editable content: the blocks Admin > Website Content >
// About Us shows, and what the page renders until the admin saves them.
//
// Same approach as lib/contactContent.js and lib/homeContent.js. About Us is a
// bespoke layout, so its set of blocks is fixed - and every piece of copy the
// page shows is one of them, so nothing a visitor reads there is out of the
// admin's reach. The defaults are what the page showed before these blocks
// existed (some of it was hard-coded), so a database that has never been
// saved in this shape still renders the same page, and the admin sees every
// block to edit. Saving writes the rows; from then on the database wins.
const { parseSectionConfig } = require("./sectionTypes");

const ABOUT_SECTIONS = [
  {
    key: "banner",
    type: "imageText",
    title: "Dedicated to Better Animal Health",
    body: "For over 15 years, Provet has partnered with veterinarians and clinics to deliver reliable, research-backed animal healthcare products.",
    image: "https://images.unsplash.com/photo-1549488235-42996ae3b650?auto=format&fit=crop&w=1000&h=800&q=80",
    hint: "The banner at the top of the page: the heading, the line under it and the main photo.",
    hideConfig: true,
  },
  {
    key: "story",
    type: "richText",
    title: "Our Story",
    body: "What began as a small veterinary formulation initiative has grown into a dedicated catalogue of medicines serving companion animal clinics and livestock farms alike. Our team combines pharmaceutical manufacturing experience with a genuine passion for animal health.",
    hint: "The Our Story section under the banner. The first sentence is shown larger, as the lead.",
  },
  {
    key: "mission",
    type: "richText",
    title: "Our Mission",
    body: "To provide reliable, well-documented veterinary medicines that veterinarians can prescribe with confidence, supported by clear dosing information and responsive enquiry handling.",
    hint: "Vision and Mission on this page are read from Website Content > Who We Are > Vision & Mission, so both pages always match. This text is only shown if that block has no Mission line.",
  },
  {
    key: "quality",
    type: "richText",
    title: "Quality Commitment",
    body: "Every formulation in our catalogue is developed with attention to composition accuracy, stability and ease of field use. We document dosage and storage guidance clearly so animal handlers and veterinarians can use our products safely.",
    hint: 'A card under "What We Stand For".',
  },
  {
    key: "team",
    type: "richText",
    title: "Our Team",
    body: "Our cross-functional team includes veterinary pharmacologists, quality assurance specialists and field support staff working together to deliver products that perform.",
    hint: 'A card under "What We Stand For".',
  },
  {
    key: "why-us",
    type: "list",
    title: "Why Choose Us",
    body: [
      "Rigorously tested formulations manufactured to consistent quality standards",
      "A broad catalogue spanning companion animal and livestock needs",
      "Responsive technical and enquiry support for veterinarians and distributors",
      "Reliable supply chain and packaging designed for field conditions",
    ].join("\n"),
    hint: "The dark Why Provet band: its heading and the checklist points.",
  },
  {
    key: "why-us-figure",
    type: "richText",
    bodyFormat: "stats",
    title: "Highlight figure",
    body: "98% Client satisfaction across partner clinics",
    hint: "The figure card on the Why Provet photo: one figure and its caption. Hide this block to leave the card out.",
  },
  {
    key: "cta",
    type: "richText",
    title: "Need help choosing the right product for your clinic?",
    body: "Our veterinary specialists are ready to guide you through composition, dosage and suitability for your practice.",
    hint: "The call to action at the foot of the page. Its buttons are the enquiry form and the first phone number in Contact Us > Contact details.",
  },
];

const ABOUT_KEYS = ABOUT_SECTIONS.map((s) => s.key);

// Every About block, filling in any the database doesn't have yet with its
// default. Hidden rows are returned as they are - callers decide what
// `isVisible: false` means.
function withAboutDefaults(sections = []) {
  const byKey = new Map(sections.map((s) => [s.key, s]));
  return ABOUT_SECTIONS.map(({ hint, hideConfig, bodyFormat: _format, ...fallback }) => {
    const saved = byKey.get(fallback.key);
    const section = saved || { ...fallback, isVisible: true };
    return { ...section, type: fallback.type, config: parseSectionConfig(fallback.type, section.config) };
  });
}

module.exports = { ABOUT_SECTIONS, ABOUT_KEYS, withAboutDefaults };
