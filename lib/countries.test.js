const test = require("node:test");
const assert = require("node:assert/strict");
const { countryKey } = require("./countries");

test("common short names map to the atlas spelling", () => {
  assert.equal(countryKey("UAE"), "united arab emirates");
  assert.equal(countryKey("  USA "), "united states of america");
  assert.equal(countryKey("Sri Lanka"), "sri lanka");
});
