// The contact page's editable content: the blocks Admin > Website Content >
// Contact Us shows, and what the page renders until the admin saves them.
//
// The contact page is a bespoke layout (its enquiry and feedback forms are
// code), so like home/about its set of blocks is fixed. What is different is
// that these defaults live here rather than only in the seed: the contact
// page existed with this copy hard-coded before it was editable, so a
// database that has never been reseeded must still render it - and the admin
// must still see it to edit - rather than both coming up empty. Saving in the
// admin writes the rows; from then on the database wins.
const { parseSectionConfig } = require("./sectionTypes");

const CONTACT_SECTIONS = [
  {
    key: "hero",
    type: "richText",
    title: "We're Here to Help",
    body: "Reach out for product information, bulk pricing, or veterinary support — our team responds within one business day.",
    hint: "The page heading and the line under it.",
  },
  {
    key: "details",
    type: "cards",
    title: "Contact details",
    // "Heading: value" per line. Only the first colon separates the two, so a
    // value such as "9:00 AM" survives intact.
    body: [
      "Visit Us: No. 9, 1st Floor, 2nd Lane, Chakrapani Street, Guindy, Chennai - 600 032",
      "Call Us: +91 44 2244 2124 / +91 44 2244 2127",
      "Email Us: info@provet.in",
      "Working Hours: Mon – Sat, 9:00 AM – 6:00 PM",
    ].join("\n"),
    hint: 'One detail per line, written as "Heading: value". Headings mentioning visit/address, call/phone, email or hours get a matching icon. The title is not shown on the page.',
    hideConfig: true,
  },
  {
    // The site footer on every page. Its address / phone / email come from
    // "details" above, so the footer and this page can never disagree; this
    // block holds the rest.
    key: "footer",
    type: "richText",
    title: "Provet Pharma Private Limited",
    body: "Excellence through innovation — solution-oriented veterinary healthcare products backed by expert technical guidance.",
    hint: "Shown in the footer of every page: the title is the company name in the copyright line, the text is the tagline under the logo. The footer's address, phone and email come from Contact details above.",
  },
  {
    key: "branches",
    type: "locations",
    title: "Branch Locations",
    body: "Our branches and distribution partners, for stock and support close to your farm.",
    hint: "Optional line shown under the heading.",
    config: {
      columns: 3,
      items: [
        {
          title: "Chennai (CWH)",
          address: "260, First Floor, Gnanam Complex,\nPoonamallee Bye Pass Road,\nPoonamalle, Thiruvallur,\nTamil Nadu - 600 056",
          contact: "Rajesh Devan",
          phone: "+91 97908 16924",
        },
        {
          title: "Nashik (CFA)",
          subtitle: "ARV Enterprises",
          address: "Shop No. 1, Darshan Apartment,\nUpnagar, Nashik,\nMaharashtra - 422 006",
          contact: "Bablu Kalekar",
          phone: "+91 91464 56873",
        },
        {
          title: "Kolkata (Branch)",
          address: "268-XII, Makaltala, Bally,\nDurgapur, Howrah,\nWest Bengal - 711 205",
          contact: "Sanjoy Sau",
          phone: "+91 75501 99914",
        },
        {
          title: "Bhimavaram (Branch)",
          address:
            "19-16-113, Old Jagadamba Rice Mill,\nNear Ganganama Temple, Rest House Road,\nBhimavaram, West Godavari District,\nAndhra Pradesh - 534 201",
          contact: "Omkar Vara Prasad",
          phone: "+91 95422 20291",
        },
        {
          title: "Hyderabad (CFA)",
          subtitle: "Sun Vet Enterprises",
          address: "1-5-1118/1/20, Jannabanda,\nNear St. Paul's School, Old Alwal,\nSecunderabad, Telangana - 500 010",
          contact: "Shiva Krishna",
          phone: "+91 63000 82953",
        },
        {
          title: "Ambala (CFA)",
          subtitle: "Somya Nutraceuticals",
          address: "Third Floor, 3-A-3, Alvid House,\nGrand Trunk Road, New Kuldeep Nagar,\nAmbala, Haryana - 133 001",
          contact: "Sushil",
          phone: "+91 93503 65689",
        },
      ],
    },
  },
];

// Fills in any block the database doesn't have yet with its default, so the
// admin always sees the full set and the page always has something to show.
// Rows the admin has saved are returned as they are, hidden ones included -
// callers decide what `isVisible: false` means for them.
function withContactDefaults(sections = []) {
  const byKey = new Map(sections.map((s) => [s.key, s]));
  return CONTACT_SECTIONS.map(({ hint, hideConfig, ...fallback }) => {
    const saved = byKey.get(fallback.key);
    const section = saved || { ...fallback, isVisible: true };
    return { ...section, type: fallback.type, config: parseSectionConfig(fallback.type, section.config) };
  });
}

// "Heading: value" lines, split on the first colon only.
function parseDetailLines(body) {
  return String(body || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const at = line.indexOf(":");
      if (at === -1) return { label: "", value: line };
      return { label: line.slice(0, at).trim(), value: line.slice(at + 1).trim() };
    });
}

// The site-wide contact facts, read from the same admin blocks the contact
// page renders - used by the footer and the call-to-action box so they always
// match what the admin set. Details are picked out by the wording of each
// line's heading (the same rule the contact page uses for its icons).
function contactInfo(sections = []) {
  const blocks = Object.fromEntries(withContactDefaults(sections).map((s) => [s.key, s]));
  const visible = (key) => (blocks[key]?.isVisible === false ? null : blocks[key]);
  const lines = parseDetailLines(visible("details")?.body);
  const find = (re) => lines.find((line) => re.test(line.label))?.value || "";
  const phoneLine = find(/call|phone|tel|mobile/i);
  const footer = visible("footer");
  return {
    address: find(/visit|address|office|location/i),
    phones: phoneLine ? phoneLine.split(/\s*\/\s*/).filter(Boolean) : [],
    email: find(/mail/i),
    hours: find(/hour|time|open/i),
    companyName: footer?.title || "",
    tagline: footer?.body || "",
  };
}

// Digits and a leading + only, for tel: links.
const telHref = (phone) => `tel:${String(phone).replace(/[^\d+]/g, "")}`;

module.exports = { CONTACT_SECTIONS, withContactDefaults, parseDetailLines, contactInfo, telHref };
