// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { RIBBONS, ribbonSvg, ribbonFile, ribbonSrc } = require("./catalogueArt");

test("the committed ribbon files match the generator (run `npm run art:catalogue`)", () => {
  for (const key of Object.keys(RIBBONS)) {
    const committed = fs.readFileSync(path.join(__dirname, "..", ribbonFile(key)), "utf8");
    assert.equal(committed, ribbonSvg(key), `${ribbonFile(key)} is out of date`);
  }
});

test("an unknown range falls back to the whole-catalogue ribbon", () => {
  assert.match(ribbonSrc("nope"), /^\/catalogue\/ribbon-all\.svg\?v=\d+$/);
  assert.match(ribbonSrc("avinova"), /^\/catalogue\/ribbon-avinova\.svg\?v=\d+$/);
});
