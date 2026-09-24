// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const { CONTACT_SECTIONS, withContactDefaults, parseDetailLines } = require("./contactContent");
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
    ["hero", "details", "branches"]
  );
  assert.equal(sections[2].config.items.length, 6);
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
  const [hero, details, branches] = withContactDefaults(saved);
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
