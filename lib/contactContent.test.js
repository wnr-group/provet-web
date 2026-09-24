// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const { CONTACT_SECTIONS, withContactDefaults, parseDetailLines, contactInfo, telHref } = require("./contactContent");
const { validateSectionConfig } = require("./sectionTypes");

test("every default block's config is valid for its type", () => {
  for (const section of CONTACT_SECTIONS) {
    const result = validateSectionConfig(section.type, section.config);
    assert.ok(result.success, `${section.key}: ${result.error?.issues[0]?.message}`);
  }
});

test("withContactDefaults fills every block when nothing is saved", () => {
  const sections = withContactDefaults([]);
  assert.deepEqual(
    sections.map((s) => s.key),
    ["hero", "details", "footer", "branches"]
  );
  assert.equal(sections[3].config.items.length, 6);
  // Admin-only metadata must not leak into what gets saved or rendered.
  for (const section of sections) {
    assert.equal(section.hint, undefined);
    assert.equal(section.hideConfig, undefined);
  }
});

test("withContactDefaults keeps saved rows, hidden ones included", () => {
  const saved = [
    { key: "hero", type: "richText", title: "Talk to us", body: null, config: null, isVisible: true },
    {
      key: "branches",
      type: "locations",
      title: "Branches",
      config: JSON.stringify({ columns: 2, items: [{ title: "Pune" }] }),
      isVisible: false,
    },
  ];
  const [hero, details, , branches] = withContactDefaults(saved);
  assert.equal(hero.title, "Talk to us");
  assert.equal(details.title, "Contact details");
  assert.equal(branches.isVisible, false);
  assert.deepEqual(branches.config.items, [{ title: "Pune" }]);
  assert.equal(branches.config.columns, 2);
});

test("parseDetailLines splits on the first colon only", () => {
  assert.deepEqual(parseDetailLines("Working Hours: Mon – Sat, 9:00 AM – 6:00 PM\n\n  Just a note  "), [
    { label: "Working Hours", value: "Mon – Sat, 9:00 AM – 6:00 PM" },
    { label: "", value: "Just a note" },
  ]);
  assert.deepEqual(parseDetailLines(null), []);
});

test("locations config strips unknown item fields", () => {
  const result = validateSectionConfig("locations", { items: [{ title: "X", email: "x@y.z" }] });
  // Items are non-strict zod objects, so unknown keys are dropped rather than
  // rejected - the stored config never carries them.
  assert.ok(result.success);
  assert.deepEqual(result.data.items, [{ title: "X" }]);
});

test("contactInfo reads the footer facts from the defaults", () => {
  const info = contactInfo([]);
  assert.match(info.address, /Chakrapani Street/);
  assert.deepEqual(info.phones, ["+91 44 2244 2124", "+91 44 2244 2127"]);
  assert.equal(info.email, "info@provet.in");
  assert.equal(info.companyName, "Provet Pharma Private Limited");
  assert.match(info.tagline, /^Excellence through innovation/);
});

test("contactInfo follows what the admin saved", () => {
  const info = contactInfo([
    {
      key: "details",
      type: "cards",
      body: ["Office: 1 New Road, Pune", "Phone: +91 20 1234 5678", "Mail: hello@provet.in"].join("\n"),
      isVisible: true,
    },
    { key: "footer", type: "richText", title: "Provet Ltd", body: "Better animal health.", isVisible: true },
  ]);
  assert.equal(info.address, "1 New Road, Pune");
  assert.deepEqual(info.phones, ["+91 20 1234 5678"]);
  assert.equal(info.email, "hello@provet.in");
  assert.equal(info.companyName, "Provet Ltd");
  assert.equal(info.tagline, "Better animal health.");
});

test("a hidden footer block drops the tagline and company name", () => {
  const info = contactInfo([{ key: "footer", type: "richText", title: "X", body: "Y", isVisible: false }]);
  assert.equal(info.tagline, "");
  assert.equal(info.companyName, "");
  assert.equal(info.phones.length, 2);
});

test("telHref keeps only digits and a leading plus", () => {
  assert.equal(telHref("+91 44 2244 2124"), "tel:+914422442124");
});
