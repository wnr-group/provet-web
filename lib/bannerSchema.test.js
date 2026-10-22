const test = require("node:test");
const assert = require("node:assert/strict");
const { bannerSchema } = require("./bannerSchema");

const base = { title: "Poultry health", image: "/uploads/hero.jpg" };

test("a photo slide needs no video, and an empty one is stored as none", () => {
  assert.equal(bannerSchema.safeParse(base).success, true);
  assert.equal(bannerSchema.parse({ ...base, video: "  " }).video, null);
});

test("a video slide takes an uploaded, shipped or http(s) video", () => {
  for (const video of ["/uploads/1759-abc.mp4", "/content/hero/provet-hero-1280.mp4", "https://cdn.example.com/loop.webm"]) {
    assert.equal(bannerSchema.parse({ ...base, video }).video, video);
  }
});

test("any other video address is refused, since it lands in a <video src>", () => {
  for (const video of ["javascript:alert(1)", "data:video/mp4;base64,AAAA", "/uploads/../secret.mp4", "loop.mp4"]) {
    assert.equal(bannerSchema.safeParse({ ...base, video }).success, false, video);
  }
});

test("a video slide still needs its image, the poster", () => {
  assert.equal(bannerSchema.safeParse({ title: "x", image: "", video: "/uploads/v.mp4" }).success, false);
});
