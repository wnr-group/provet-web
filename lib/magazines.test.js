const test = require("node:test");
const assert = require("node:assert/strict");
const {
  magazineSchema, magazinePatchSchema, magazineYearSchema, magazineYearPatchSchema, magazineSettingsSchema,
  serializePublicMagazine, serializeAdminMagazine, serializeAdminYear, serializeAdminSettings, settingsToRow,
} = require("./magazines");
const { DEFAULT_MAGAZINE_SETTINGS } = require("./magazineLibrary");

const issue = { title: "Propulse", year: 2026, month: 10 };

test("an issue needs a name, a year and a month; they become the 1st of that month in UTC", () => {
  assert.equal(magazineSchema.parse(issue).publishedAt.toISOString(), "2026-10-01T00:00:00.000Z");
  assert.equal(magazineSchema.parse({ ...issue, year: 2024, month: 1 }).publishedAt.toISOString(), "2024-01-01T00:00:00.000Z");
  const parsed = magazineSchema.parse(issue);
  assert.equal("year" in parsed || "month" in parsed, false); // stored as the one date
  for (const bad of [{ title: "  " }, { year: 1989 }, { year: 2101 }, { year: 2026.5 }, { year: "2026" }, { year: undefined }, { month: 0 }, { month: 13 }, { month: "10" }, { month: undefined }]) {
    assert.equal(magazineSchema.safeParse({ ...issue, ...bad }).success, false, JSON.stringify(bad));
  }
});

test("a partial update: the publish switch alone, or year and month together - never one without the other", () => {
  assert.deepEqual(magazinePatchSchema.parse({ isPublished: true }), { isPublished: true });
  assert.equal(magazinePatchSchema.parse({ year: 2025, month: 3, title: "T" }).publishedAt.toISOString(), "2025-03-01T00:00:00.000Z");
  assert.equal(magazinePatchSchema.safeParse({ year: 2025 }).success, false);
  assert.equal(magazinePatchSchema.safeParse({ month: 3 }).success, false);
  assert.equal(magazinePatchSchema.safeParse({ year: 3000, month: 3 }).success, false);
});

test("cover and PDF addresses: uploaded files and https links only", () => {
  const ok = ["/uploads/1-abc.pdf", "/content/magazines/a.jpg", "/magazines/Propulse%20April.pdf", "https://x.supabase.co/storage/v1/object/public/magazines/2026/a.pdf", ""];
  const bad = ["javascript:alert(1)", "/etc/passwd", "/uploads/../x.pdf", "http://insecure.example/x.pdf", "data:text/html,hi", "//evil.example/x.pdf"];
  for (const url of ok) assert.equal(magazineSchema.safeParse({ ...issue, pdfUrl: url, coverImage: url }).success, true, url);
  for (const url of bad) {
    assert.equal(magazineSchema.safeParse({ ...issue, pdfUrl: url }).success, false, url);
    assert.equal(magazineSchema.safeParse({ ...issue, coverImage: url }).success, false, url);
  }
});

test("only known cover layouts are accepted; unknown keys are dropped, never stored", () => {
  assert.equal(magazineSchema.safeParse({ ...issue, coverLayout: "crop" }).success, true);
  assert.equal(magazineSchema.safeParse({ ...issue, coverLayout: "wide" }).success, false);
  const parsed = magazineSchema.parse({ ...issue, id: "evil", createdAt: "2000-01-01", role: "admin" });
  assert.deepEqual(Object.keys(parsed).sort(), ["publishedAt", "title"]);
});

test("a year is a whole number in range, and a recent flag is a real boolean", () => {
  assert.equal(magazineYearSchema.safeParse({ year: 2024 }).success, true);
  assert.equal(magazineYearSchema.parse({ year: 2024, isRecent: true }).isRecent, true);
  for (const year of [1989, 2101, 2024.5, "2024", null, undefined, NaN]) assert.equal(magazineYearSchema.safeParse({ year }).success, false, String(year));
  assert.equal(magazineYearPatchSchema.safeParse({ isRecent: false }).success, true);
  for (const isRecent of ["yes", 1, null, undefined]) assert.equal(magazineYearPatchSchema.safeParse({ isRecent }).success, false, String(isRecent));
});

test("the public shape carries only what the page shows; the admin shape adds year and month", () => {
  const row = { id: "a", title: "T", publishedAt: new Date("2025-03-01"), coverImage: "/c.jpg", pdfUrl: "/p.pdf", summary: "s", isPublished: true, updatedAt: new Date() };
  const pub = serializePublicMagazine(row);
  assert.deepEqual(Object.keys(pub).sort(), ["coverLayout", "href", "id", "image", "issueNumber", "publishedAt", "text", "title"]);
  const admin = serializeAdminMagazine({ ...row, isPublished: false });
  assert.deepEqual([admin.year, admin.month, admin.isPublished], [2025, 3, false]);
  assert.deepEqual(serializeAdminYear({ id: "y", year: 2025, isRecent: true }, 4), { id: "y", year: 2025, isRecent: true, count: 4 });
});

test("wording: lengths are enforced, blanks are saved as null and show their defaults", () => {
  assert.equal(magazineSettingsSchema.safeParse({}).success, true);
  for (const bad of [{ archivesHeading: "x".repeat(81) }, { archivesIntro: "x".repeat(301) }, { readLabel: "x".repeat(31) }]) {
    assert.equal(magazineSettingsSchema.safeParse(bad).success, false, JSON.stringify(bad));
  }
  const row = settingsToRow(magazineSettingsSchema.parse({ archivesHeading: "Back issues", readLabel: "" }));
  assert.equal(row.archivesHeading, "Back issues");
  assert.equal(row.readLabel, null);
  const shown = serializeAdminSettings(row);
  assert.equal(shown.readLabel, DEFAULT_MAGAZINE_SETTINGS.readLabel);
  assert.equal(shown.archivesHeading, "Back issues");
  // an older client still sending the retired months setting is ignored
  assert.equal("recentMonths" in magazineSettingsSchema.parse({ recentMonths: 6 }), false);
});
