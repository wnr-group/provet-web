const test = require("node:test");
const assert = require("node:assert/strict");
const { DEFAULT_MAGAZINE_SETTINGS, resolveMagazineSettings, organise, pickYear, describe } = require("./magazineLibrary");

const issue = (id, iso, extra = {}) => ({ id, title: "Propulse", publishedAt: iso, ...extra });
const legacy = (title) => ({ title, image: "/x.jpg" });

test("an issue's own date wins; an old card is read from its title", () => {
  const a = describe(issue("a", "2024-03-01T00:00:00.000Z"));
  assert.deepEqual([a.year, a.month, a.masthead], [2024, "March", "Propulse"]);
  const b = describe(legacy("Propulse August 2025"));
  assert.deepEqual([b.year, b.month, b.masthead], [2025, "August", "Propulse"]);
  const c = describe(legacy("Special edition"));
  assert.deepEqual([c.year, c.month, c.time], [null, "", null]);
});

test("the years marked recent are Recent Editions; every other year is an Archive year", () => {
  const items = [
    issue("a", "2026-10-01T00:00:00.000Z"), issue("b", "2026-04-01T00:00:00.000Z"),
    issue("c", "2025-08-01T00:00:00.000Z"), issue("d", "2024-12-01T00:00:00.000Z"), issue("e", "2024-01-01T00:00:00.000Z"),
  ];
  const r = organise(items, { recentYears: [2026] });
  assert.deepEqual(r.recent.map((i) => i.id), ["a", "b"]);
  assert.deepEqual(r.archived.map((i) => i.id), ["c", "d", "e"]);
  assert.deepEqual(r.years, [{ year: 2025, count: 1 }, { year: 2024, count: 2 }]);
});

test("more than one year can be recent, and the choice is the admin's, not the calendar's", () => {
  const items = [issue("a", "2026-10-01T00:00:00.000Z"), issue("b", "2025-08-01T00:00:00.000Z"), issue("c", "2024-08-01T00:00:00.000Z")];
  assert.deepEqual(organise(items, { recentYears: [2026, 2025] }).recent.map((i) => i.id), ["a", "b"]);
  assert.deepEqual(organise(items, { recentYears: [2024] }).recent.map((i) => i.id), ["c"]); // an older year can be the recent one
});

test("Recent Editions is never empty while something is published", () => {
  const items = [issue("a", "2026-10-01T00:00:00.000Z"), issue("b", "2025-08-01T00:00:00.000Z")];
  assert.deepEqual(organise(items, { recentYears: [] }).recent.map((i) => i.id), ["a"]); // none marked -> the newest year
  assert.deepEqual(organise(items, { recentYears: [1999] }).recent.map((i) => i.id), ["a"]); // marked years with no issues -> the newest
  const none = organise([], { recentYears: [2026] });
  assert.deepEqual([none.recent.length, none.archived.length, none.years.length], [0, 0, 0]);
});

test("within a year the newest month comes first; duplicates and undated cards are handled", () => {
  const items = [
    issue("jan", "2024-01-01T00:00:00.000Z"), issue("dec", "2024-12-01T00:00:00.000Z"), issue("jun", "2024-06-01T00:00:00.000Z"),
    issue("new", "2026-01-01T00:00:00.000Z"), issue("new", "2026-01-01T00:00:00.000Z"), legacy("Special edition"),
  ];
  const r = organise(items, { recentYears: [2026] });
  assert.deepEqual(r.archived.filter((i) => i.year === 2024).map((i) => i.id), ["dec", "jun", "jan"]);
  assert.equal(r.recent.length, 1);
  assert.equal(r.archived.filter((i) => i.year === null).length, 1);
});

test("the archive opens on the visitor's choice, else the newest archive year", () => {
  const lib = { years: [{ year: 2025, count: 3 }, { year: 2023, count: 1 }], archived: [{}] };
  assert.equal(pickYear("2023", lib), 2023);
  assert.equal(pickYear(null, lib), 2025);
  assert.equal(pickYear("junk", lib), 2025);
  assert.equal(pickYear("earlier", lib), "earlier");
  assert.equal(pickYear(null, { years: [], archived: [{}] }), "earlier");
  assert.equal(pickYear(null, { years: [], archived: [] }), null);
});

test("saved wording overrides the defaults; blanks fall back", () => {
  assert.deepEqual(resolveMagazineSettings(null), DEFAULT_MAGAZINE_SETTINGS);
  const s = resolveMagazineSettings({ archivesHeading: "  Back issues ", readLabel: "   ", archivesTabLabel: "", recentMonths: 6 });
  assert.equal(s.archivesHeading, "Back issues");
  assert.equal(s.readLabel, DEFAULT_MAGAZINE_SETTINGS.readLabel);
  assert.equal(s.archivesTabLabel, DEFAULT_MAGAZINE_SETTINGS.archivesTabLabel);
  assert.equal("recentMonths" in s, false); // the old months window no longer exists
});
