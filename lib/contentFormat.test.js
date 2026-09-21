// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const { splitItems, parseStatItems } = require("./contentFormat");

test("splitItems returns nothing for empty input", () => {
  for (const body of ["", "   ", null, undefined]) {
    assert.deepEqual(splitItems(body), []);
  }
});

test("splitItems treats each line as an item", () => {
  assert.deepEqual(splitItems("One\nTwo\nThree"), ["One", "Two", "Three"]);
});

test("splitItems strips bullet prefixes and blank lines", () => {
  assert.deepEqual(splitItems("- One\n\n* Two\n• Three\n"), ["One", "Two", "Three"]);
});

test("splitItems handles Windows line endings", () => {
  assert.deepEqual(splitItems("One\r\nTwo"), ["One", "Two"]);
});

test("splitItems splits a single line on spaced separators", () => {
  assert.deepEqual(splitItems("One - Two - Three"), ["One", "Two", "Three"]);
  assert.deepEqual(splitItems("One • Two | Three"), ["One", "Two", "Three"]);
});

test("splitItems does not break hyphenated words", () => {
  assert.deepEqual(splitItems("Reliable cold-chain logistics"), ["Reliable cold-chain logistics"]);
});

test("parseStatItems pulls a leading number out as the value", () => {
  assert.deepEqual(parseStatItems("20+ years experience"), [{ value: "20+", label: "years experience" }]);
});

test("parseStatItems handles percentages and thousands separators", () => {
  assert.deepEqual(parseStatItems("98% satisfaction\n1,200 clinics served"), [
    { value: "98%", label: "satisfaction" },
    { value: "1,200", label: "clinics served" },
  ]);
});

test("parseStatItems keeps an item with no leading number as a caption", () => {
  assert.deepEqual(parseStatItems("Supplying clinics across the region."), [
    { value: null, label: "Supplying clinics across the region." },
  ]);
});

test("parseStatItems parses the seeded single-line format", () => {
  const seeded =
    "20+ years combined formulation experience - 100+ SKUs across 6 therapeutic categories - Supplying clinics and distributors across the region.";
  assert.deepEqual(parseStatItems(seeded), [
    { value: "20+", label: "years combined formulation experience" },
    { value: "100+", label: "SKUs across 6 therapeutic categories" },
    { value: null, label: "Supplying clinics and distributors across the region." },
  ]);
});

test("parseStatItems parses the one-per-line format equivalently", () => {
  const perLine = "20+ years combined formulation experience\n100+ SKUs across 6 therapeutic categories";
  assert.deepEqual(parseStatItems(perLine), [
    { value: "20+", label: "years combined formulation experience" },
    { value: "100+", label: "SKUs across 6 therapeutic categories" },
  ]);
});

test("parseStatItems returns nothing for an empty body", () => {
  assert.deepEqual(parseStatItems(""), []);
  assert.deepEqual(parseStatItems(null), []);
});

test("parseStatItems only treats a digit-bearing first token as a value", () => {
  // "Over" has no digit, so the whole thing stays a caption rather than
  // "Over" being promoted to a big number.
  assert.deepEqual(parseStatItems("Over twenty years"), [{ value: null, label: "Over twenty years" }]);
});

test("parseStatItems keeps a bare number as a caption", () => {
  // No text after the number - nothing sensible to label it with, so it is
  // not promoted to a figure.
  assert.deepEqual(parseStatItems("20+"), [{ value: null, label: "20+" }]);
});
