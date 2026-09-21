// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const { PLATFORMS, PLATFORM_KEYS, platformLabel, isSafeHttpUrl, socialLinksSchema } = require("./socialSchema");

const firstError = (result) => result.error?.issues[0]?.message;

test("PLATFORMS covers exactly the five required platforms", () => {
  assert.deepEqual(PLATFORM_KEYS, ["instagram", "facebook", "youtube", "linkedin", "twitter"]);
  assert.equal(PLATFORMS.length, 5);
  for (const platform of PLATFORMS) {
    assert.ok(platform.label, `${platform.key} needs a label`);
    assert.ok(platform.placeholder, `${platform.key} needs a placeholder`);
  }
});

test("platformLabel falls back to the raw key for unknown platforms", () => {
  assert.equal(platformLabel("youtube"), "YouTube");
  assert.equal(platformLabel("myspace"), "myspace");
});

test("isSafeHttpUrl accepts http(s) and rejects everything else", () => {
  assert.equal(isSafeHttpUrl("https://instagram.com/provet"), true);
  assert.equal(isSafeHttpUrl("http://example.com"), true);
  assert.equal(isSafeHttpUrl("javascript:alert(1)"), false);
  assert.equal(isSafeHttpUrl("data:text/html,<script>alert(1)</script>"), false);
  assert.equal(isSafeHttpUrl("ftp://example.com"), false);
  assert.equal(isSafeHttpUrl("not a url"), false);
  assert.equal(isSafeHttpUrl("instagram.com/provet"), false);
});

test("accepts a fully configured, enabled link", () => {
  const result = socialLinksSchema.safeParse({
    links: [{ platform: "instagram", url: "https://instagram.com/provet", isActive: true, order: 0 }],
  });
  assert.equal(result.success, true);
});

test("accepts a blank URL as 'not configured yet' when disabled", () => {
  const result = socialLinksSchema.safeParse({
    links: [
      { platform: "facebook", url: "", isActive: false },
      { platform: "youtube", url: null, isActive: false },
      { platform: "linkedin", isActive: false },
    ],
  });
  assert.equal(result.success, true);
});

test("rejects enabling a platform that has no URL", () => {
  for (const url of ["", "   ", null, undefined]) {
    const result = socialLinksSchema.safeParse({ links: [{ platform: "twitter", url, isActive: true }] });
    assert.equal(result.success, false, `expected ${JSON.stringify(url)} to be rejected when enabled`);
    assert.match(firstError(result), /needs a URL before it can be enabled/);
  }
});

test("rejects a non-http(s) URL even when the platform is disabled", () => {
  const result = socialLinksSchema.safeParse({
    links: [{ platform: "facebook", url: "javascript:alert(document.cookie)", isActive: false }],
  });
  assert.equal(result.success, false);
  assert.match(firstError(result), /must be a valid http\(s\) link/);
});

test("error messages name the offending platform", () => {
  const result = socialLinksSchema.safeParse({
    links: [
      { platform: "instagram", url: "https://instagram.com/provet", isActive: true },
      { platform: "youtube", url: "", isActive: true },
    ],
  });
  assert.equal(result.success, false);
  assert.match(firstError(result), /^YouTube/);
});

test("rejects an unsupported platform", () => {
  const result = socialLinksSchema.safeParse({ links: [{ platform: "myspace", url: "https://myspace.com/x" }] });
  assert.equal(result.success, false);
  assert.match(firstError(result), /Unsupported platform/);
});

test("rejects duplicate platforms", () => {
  const result = socialLinksSchema.safeParse({
    links: [
      { platform: "linkedin", url: "https://linkedin.com/company/a" },
      { platform: "linkedin", url: "https://linkedin.com/company/b" },
    ],
  });
  assert.equal(result.success, false);
  assert.match(firstError(result), /Duplicate entry for LinkedIn/);
});

test("rejects a payload that isn't shaped like { links: [...] }", () => {
  assert.equal(socialLinksSchema.safeParse(null).success, false);
  assert.equal(socialLinksSchema.safeParse({}).success, false);
  assert.equal(socialLinksSchema.safeParse({ links: "nope" }).success, false);
});

test("trims surrounding whitespace off URLs", () => {
  const result = socialLinksSchema.safeParse({
    links: [{ platform: "instagram", url: "  https://instagram.com/provet  ", isActive: true }],
  });
  assert.equal(result.success, true);
  assert.equal(result.data.links[0].url, "https://instagram.com/provet");
});

test("an empty link list is valid (nothing configured)", () => {
  assert.equal(socialLinksSchema.safeParse({ links: [] }).success, true);
});
