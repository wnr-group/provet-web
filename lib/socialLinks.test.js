// Run with `npm test` (node --test). Covers the pure helpers that back the
// admin form and the public payload; the Prisma query itself is not unit
// tested (it needs a live DB) but its filter is mirrored here.
const test = require("node:test");
const assert = require("node:assert/strict");

const { PLATFORMS, mergeWithPlatformDefaults } = require("./socialSchema");
const { serializeSocialLink } = require("./serializers");

test("mergeWithPlatformDefaults returns every platform when the table is empty", () => {
  const merged = mergeWithPlatformDefaults([]);
  assert.equal(merged.length, PLATFORMS.length);
  assert.deepEqual(
    merged.map((l) => l.platform),
    PLATFORMS.map((p) => p.key)
  );
  for (const link of merged) {
    assert.equal(link.url, "");
    assert.equal(link.isActive, false);
    assert.ok(link.label);
    assert.ok(link.placeholder);
  }
});

test("mergeWithPlatformDefaults keeps stored values and pads the rest", () => {
  const merged = mergeWithPlatformDefaults([
    { platform: "youtube", url: "https://youtube.com/@provet", isActive: true, order: 0 },
  ]);

  const youtube = merged.find((l) => l.platform === "youtube");
  assert.equal(youtube.url, "https://youtube.com/@provet");
  assert.equal(youtube.isActive, true);
  assert.equal(youtube.order, 0);

  const instagram = merged.find((l) => l.platform === "instagram");
  assert.equal(instagram.url, "");
  assert.equal(instagram.isActive, false);

  assert.equal(merged.length, PLATFORMS.length);
});

test("mergeWithPlatformDefaults sorts by stored order", () => {
  const merged = mergeWithPlatformDefaults([
    { platform: "twitter", url: "https://x.com/provet", isActive: true, order: 0 },
    { platform: "instagram", url: "https://instagram.com/provet", isActive: true, order: 1 },
  ]);
  assert.equal(merged[0].platform, "twitter");
  assert.equal(merged[1].platform, "instagram");
});

test("mergeWithPlatformDefaults ignores rows for unknown platforms", () => {
  const merged = mergeWithPlatformDefaults([
    { platform: "myspace", url: "https://myspace.com/provet", isActive: true, order: 0 },
  ]);
  assert.equal(merged.length, PLATFORMS.length);
  assert.equal(
    merged.some((l) => l.platform === "myspace"),
    false
  );
});

test("mergeWithPlatformDefaults normalises a NULL url to an empty string for the form", () => {
  const [first] = mergeWithPlatformDefaults([
    { platform: "instagram", url: null, isActive: false, order: 0 },
  ]);
  assert.equal(first.url, "");
});

test("serializeSocialLink exposes only the public fields", () => {
  const serialized = serializeSocialLink({
    id: "abc123",
    platform: "linkedin",
    url: "https://linkedin.com/company/provet",
    isActive: true,
    order: 3,
    createdAt: new Date(),
    updatedAt: new Date(),
  });
  assert.deepEqual(serialized, {
    platform: "linkedin",
    url: "https://linkedin.com/company/provet",
    order: 3,
  });
});

// Mirrors the guard in lib/data.js getActiveSocialLinks: a row that is
// enabled but has a blank/NULL URL must never reach the public UI.
const publiclyVisible = (rows) => rows.filter((r) => r.isActive && r.url && r.url.trim());

test("only enabled rows with a real URL are publicly visible", () => {
  const visible = publiclyVisible([
    { platform: "instagram", url: "https://instagram.com/provet", isActive: true },
    { platform: "facebook", url: "https://facebook.com/provet", isActive: false },
    { platform: "youtube", url: null, isActive: true },
    { platform: "linkedin", url: "   ", isActive: true },
    { platform: "twitter", url: "", isActive: false },
  ]);
  assert.deepEqual(
    visible.map((l) => l.platform),
    ["instagram"]
  );
});
