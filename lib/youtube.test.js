// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const { parseYouTubeUrl, isYouTubeUrl, youTubeEmbedUrl, youTubeThumbnailUrl, parseStart } = require("./youtube");

const ID = "dQw4w9WgXcQ";

test("accepts every common single-video link format", () => {
  const links = [
    `https://www.youtube.com/watch?v=${ID}`,
    `https://youtube.com/watch?v=${ID}&feature=share`,
    `https://m.youtube.com/watch?v=${ID}`,
    `https://www.youtube.com/watch?list=PL123&v=${ID}&index=2`,
    `https://youtu.be/${ID}`,
    `https://youtu.be/${ID}?si=abcdef`,
    `https://www.youtube.com/embed/${ID}`,
    `https://www.youtube-nocookie.com/embed/${ID}`,
    `https://www.youtube.com/shorts/${ID}`,
    `https://www.youtube.com/live/${ID}?feature=shared`,
    `http://www.youtube.com/watch?v=${ID}`,
    `youtu.be/${ID}`,
    `  https://www.youtube.com/watch?v=${ID}  `,
  ];
  for (const link of links) {
    assert.equal(parseYouTubeUrl(link)?.id, ID, link);
  }
});

test("rejects links that are not a single YouTube video", () => {
  const links = [
    "",
    null,
    "not a url",
    "https://vimeo.com/123456",
    "https://www.youtube.com/@provet",
    "https://www.youtube.com/channel/UC1234567890",
    "https://www.youtube.com/playlist?list=PL123",
    "https://www.youtube.com/watch?v=short",
    `https://evil.example.com/watch?v=${ID}`,
    `https://youtube.com.evil.example/watch?v=${ID}`,
    `javascript:alert("${ID}")`,
    `ftp://youtube.com/watch?v=${ID}`,
  ];
  for (const link of links) {
    assert.equal(parseYouTubeUrl(link), null, String(link));
    assert.equal(isYouTubeUrl(link), false);
  }
});

test("keeps the start time in any of YouTube's formats", () => {
  assert.equal(parseYouTubeUrl(`https://youtu.be/${ID}?t=90`).start, 90);
  assert.equal(parseYouTubeUrl(`https://www.youtube.com/watch?v=${ID}&t=1m30s`).start, 90);
  assert.equal(parseYouTubeUrl(`https://www.youtube.com/embed/${ID}?start=45`).start, 45);
  assert.equal(parseYouTubeUrl(`https://youtu.be/${ID}`).start, 0);
  assert.equal(parseStart("1h2m3s"), 3723);
  assert.equal(parseStart("junk"), 0);
});

test("gives a canonical watch URL", () => {
  assert.equal(parseYouTubeUrl(`https://youtu.be/${ID}?si=x`).url, `https://www.youtube.com/watch?v=${ID}`);
  assert.equal(parseYouTubeUrl(`https://youtu.be/${ID}?t=90`).url, `https://www.youtube.com/watch?v=${ID}&t=90s`);
});

test("embeds through the privacy-enhanced domain", () => {
  const embed = youTubeEmbedUrl(ID, { start: 30, autoplay: true });
  assert.ok(embed.startsWith(`https://www.youtube-nocookie.com/embed/${ID}?`));
  assert.match(embed, /autoplay=1/);
  assert.match(embed, /start=30/);
  assert.match(embed, /rel=0/);
  assert.doesNotMatch(youTubeEmbedUrl(ID), /autoplay|start/);
  assert.equal(youTubeThumbnailUrl(ID), `https://i.ytimg.com/vi/${ID}/hqdefault.jpg`);
});

// ---- the Videos section's validation (lib/sectionTypes.js) ----

const { validateSectionConfig, parseSectionConfig } = require("./sectionTypes");

test("a Videos section accepts valid YouTube links", () => {
  const result = validateSectionConfig("videos", {
    layout: "featured",
    items: [{ url: `https://youtu.be/${ID}`, title: "Farm visit" }, { url: `https://www.youtube.com/shorts/${ID}` }],
  });
  assert.equal(result.success, true);
});

test("a Videos section refuses a non-video link and names which one", () => {
  const result = validateSectionConfig("videos", {
    items: [{ url: `https://youtu.be/${ID}` }, { url: "https://www.youtube.com/@provet" }],
  });
  assert.equal(result.success, false);
  assert.match(result.error.issues[0].message, /Video 2/);
});

test("a Videos section defaults to an empty grid", () => {
  assert.deepEqual(parseSectionConfig("videos", null), { layout: "grid", items: [] });
});
