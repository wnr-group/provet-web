// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const { isFixedContentPage, builtInSectionKeys, isBuiltInSection, addedSections } = require("./fixedPages");

test("home, about and contact are the fixed pages", () => {
  assert.equal(isFixedContentPage("home"), true);
  assert.equal(isFixedContentPage("about"), true);
  assert.equal(isFixedContentPage("contact"), true);
  assert.equal(isFixedContentPage("media/news"), false);
  assert.deepEqual(builtInSectionKeys("media/news"), []);
});

test("each fixed page knows the blocks its layout renders", () => {
  assert.equal(isBuiltInSection("home", "testimonials"), true);
  assert.equal(isBuiltInSection("about", "story"), true);
  assert.equal(isBuiltInSection("contact", "details"), true);
  assert.equal(isBuiltInSection("home", "section-5"), false);
});

test("addedSections keeps only admin-added sections, in saved order", () => {
  const sections = [
    { key: "mission", order: 0 },
    { key: "section-6", order: 5 },
    { key: "why-us", order: 1 },
    { key: "section-5", order: 4 },
  ];
  assert.deepEqual(
    addedSections("home", sections).map((s) => s.key),
    ["section-5", "section-6"]
  );
  assert.deepEqual(addedSections("home", []), []);
});
