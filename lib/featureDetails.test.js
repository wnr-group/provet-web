const test = require("node:test");
const assert = require("node:assert/strict");
const { detailFor, parseDetailText, parseDetailLinks, isSafeLink } = require("./featureDetails");

test("blank lines separate paragraphs, and dashed lines become a list", () => {
  const blocks = parseDetailText("First paragraph\ncontinues here.\n\n- One\n- Two\n\nLast one.");
  assert.deepEqual(blocks, [
    { type: "p", text: "First paragraph continues here." },
    { type: "ul", items: ["One", "Two"] },
    { type: "p", text: "Last one." },
  ]);
  assert.deepEqual(parseDetailText("  \n\n "), []);
  assert.deepEqual(parseDetailText(null), []);
});

test("links are written 'Label | address', and a missing label shows the address", () => {
  assert.deepEqual(parseDetailLinks("Check it | https://fami-qs.org/certified-organisations/\n/contact"), [
    { label: "Check it", url: "https://fami-qs.org/certified-organisations/" },
    { label: "/contact", url: "/contact" },
  ]);
});

test("only site paths and http(s) links survive", () => {
  for (const ok of ["https://example.org/a.pdf", "http://example.org", "/uploads/1-a.pdf", "/contact"]) {
    assert.equal(isSafeLink(ok), true, ok);
  }
  for (const bad of ["javascript:alert(1)", "data:text/html,x", "//evil.example", "/uploads/../x", "fami-qs.org", "ftp://x/y"]) {
    assert.equal(isSafeLink(bad), false, bad);
  }
  assert.deepEqual(parseDetailLinks("Bad | javascript:alert(1)"), []);
});

test("details are matched to a strip point by heading, not by position", () => {
  const details = [
    { heading: "Research Backed", text: "R&D.", links: "" },
    { heading: " certified quality ", text: "", links: "Verify | https://fami-qs.org/certified-organisations/" },
  ];
  assert.equal(detailFor(details, "Reliable Supply"), null);
  assert.deepEqual(detailFor(details, "Research Backed").blocks, [{ type: "p", text: "R&D." }]);
  assert.equal(detailFor(details, "Certified Quality").links.length, 1);
});

test("a point whose details are empty has none", () => {
  assert.equal(detailFor([{ heading: "Animal Wellness", text: "  ", links: "" }], "Animal Wellness"), null);
  assert.equal(detailFor(undefined, "Animal Wellness"), null);
});
