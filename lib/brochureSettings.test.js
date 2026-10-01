const test = require("node:test");
const assert = require("node:assert/strict");
const {
  DEFAULT_BROCHURE_SETTINGS,
  brochureSettingsSchema,
  serializeBrochureSettings,
  brochureAvailable,
} = require("./brochureSettings");

const valid = { isEnabled: true, fileUrl: "/uploads/1759-abc123.pdf", fileName: "Catalogue.pdf", buttonLabel: "Download Brochure", requireDetails: true };

test("an uploaded PDF, a shipped file or an https link are accepted", () => {
  for (const fileUrl of ["/uploads/1759-abc123.pdf", "/brochure/provet-brochure.pdf", "https://cdn.example.com/provet.pdf"]) {
    assert.equal(brochureSettingsSchema.safeParse({ ...valid, fileUrl }).success, true, fileUrl);
  }
});

test("other paths and schemes are refused", () => {
  for (const fileUrl of ["/etc/passwd", "../uploads/x.pdf", "javascript:alert(1)", "ftp://example.com/x.pdf"]) {
    assert.equal(brochureSettingsSchema.safeParse({ ...valid, fileUrl }).success, false, fileUrl);
  }
});

test("the button label is required", () => {
  assert.equal(brochureSettingsSchema.safeParse({ ...valid, buttonLabel: "  " }).success, false);
});

test("with nothing saved, the shipped brochure is used behind the details form", () => {
  const settings = serializeBrochureSettings(null);
  assert.deepEqual(settings, DEFAULT_BROCHURE_SETTINGS);
  assert.equal(settings.requireDetails, true);
  assert.equal(brochureAvailable(settings), true);
});

test("the button is hidden when switched off or when there is no file", () => {
  assert.equal(brochureAvailable({ ...valid, isEnabled: false }), false);
  assert.equal(brochureAvailable({ ...valid, fileUrl: null }), false);
});
