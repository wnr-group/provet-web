const test = require("node:test");
const assert = require("node:assert/strict");
const { HOME_KEYS, withHomeDefaults, homeSectionOrder } = require("./homeContent");

const keys = (sections) => sections.map((s) => s.key);

test("an empty database still gives every homepage block, in the default order", () => {
  assert.deepEqual(keys(withHomeDefaults([])), HOME_KEYS);
});

test("saved rows win over the defaults", () => {
  const saved = [{ key: "featured", title: "Our picks", body: "", order: 0, isVisible: true }];
  const featured = withHomeDefaults(saved).find((s) => s.key === "featured");
  assert.equal(featured.title, "Our picks");
});

test("until every block has been saved, the default order is kept", () => {
  // A database from before the blocks were editable: only a few rows, with
  // their old orders.
  const saved = [
    { key: "testimonials", order: 0, isVisible: true },
    { key: "stats", order: 1, isVisible: true },
  ];
  assert.deepEqual(keys(homeSectionOrder(saved)), ["feature-strip", "species", "featured", "stats", "testimonials"]);
});

test("once every block is saved, the admin's order is the page's order", () => {
  const order = ["testimonials", "featured", "hero-stats", "species", "stats", "feature-strip", "cta"];
  const saved = order.map((key, i) => ({ key, order: i, isVisible: true }));
  assert.deepEqual(keys(homeSectionOrder(saved)), ["testimonials", "featured", "species", "stats", "feature-strip"]);
});

test("hidden sections are left out of the page", () => {
  const saved = HOME_KEYS.map((key, i) => ({ key, order: i, isVisible: key !== "stats" }));
  assert.equal(keys(homeSectionOrder(saved)).includes("stats"), false);
});

test("only the orderable sections are laid out between hero and call to action", () => {
  const laidOut = keys(homeSectionOrder([]));
  for (const key of ["hero-stats", "cta"]) assert.equal(laidOut.includes(key), false);
});

test("Our Mission and Why Choose Us are not homepage blocks, even with saved rows", () => {
  const saved = [
    { key: "mission", title: "Our Mission", order: 0, isVisible: true },
    { key: "why-us", title: "Why Choose Us", order: 1, isVisible: true },
  ];
  const listed = keys(withHomeDefaults(saved));
  assert.equal(listed.includes("mission"), false);
  assert.equal(listed.includes("why-us"), false);
});

test("the retired rows stay reserved, so saving the Homepage editor keeps them", () => {
  const { isBuiltInSection } = require("./fixedPages");
  assert.equal(isBuiltInSection("home", "mission"), true);
  assert.equal(isBuiltInSection("home", "why-us"), true);
});
