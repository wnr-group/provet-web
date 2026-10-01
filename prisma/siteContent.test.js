// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");
const { siteContent } = require("./siteContent");
const { builtInSectionKeys } = require("../lib/fixedPages");
const { RETIRED_HOME_KEYS } = require("../lib/homeContent");
const { SECTION_TYPES, validateSectionConfig } = require("../lib/sectionTypes");

test("the seed creates every built-in section of the pages laid out in code", () => {
  for (const page of ["home", "about", "contact"]) {
    const seeded = new Set(siteContent[page].map((s) => s.key));
    const expected = builtInSectionKeys(page).filter((k) => !(page === "home" && RETIRED_HOME_KEYS.includes(k)));
    for (const key of expected) assert.ok(seeded.has(key), `${page}: "${key}" is not seeded`);
  }
});

test("every seeded section has a known type and settings the admin would accept", () => {
  for (const [page, sections] of Object.entries(siteContent)) {
    const keys = new Set();
    for (const section of sections) {
      assert.ok(!keys.has(section.key), `${page}: "${section.key}" is seeded twice`);
      keys.add(section.key);
      assert.ok(SECTION_TYPES[section.type], `${page}/${section.key}: unknown type "${section.type}"`);
      if (section.config) {
        const result = validateSectionConfig(section.type, section.config);
        assert.ok(result.success, `${page}/${section.key}: ${result.error?.issues?.[0]?.message}`);
      }
    }
  }
});
