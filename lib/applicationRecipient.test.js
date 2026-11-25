const test = require("node:test");
const assert = require("node:assert/strict");
const { getApplicationRecipient } = require("./applicationRecipient");
const { validateSectionConfig } = require("./sectionTypes");

const prismaWith = (...configs) => ({
  contentBlock: { findMany: async () => configs.map((c) => ({ config: JSON.stringify(c) })) },
});

test("uses the address set on the job-posters section", async () => {
  const prisma = prismaWith({ imageStyle: "poster", applyEmail: " hr@provet.in " });
  assert.equal(await getApplicationRecipient(prisma), "hr@provet.in");
});

test("is null when the address is blank, invalid, or on another kind of section", async () => {
  assert.equal(await getApplicationRecipient(prismaWith({ imageStyle: "poster", applyEmail: "" })), null);
  assert.equal(await getApplicationRecipient(prismaWith({ imageStyle: "poster", applyEmail: "not-an-email" })), null);
  assert.equal(await getApplicationRecipient(prismaWith({ imageStyle: "card", applyEmail: "hr@provet.in" })), null);
  assert.equal(await getApplicationRecipient(prismaWith()), null);
});

test("the section editor accepts a valid address or a blank one, and rejects a bad one", () => {
  const ok = validateSectionConfig("imageCards", { imageStyle: "poster", applyEmail: "hr@provet.in", items: [] });
  const blank = validateSectionConfig("imageCards", { imageStyle: "poster", applyEmail: "", items: [] });
  const bad = validateSectionConfig("imageCards", { imageStyle: "poster", applyEmail: "nope", items: [] });
  assert.ok(ok.success !== false && !ok.error, JSON.stringify(ok));
  assert.ok(blank.success !== false && !blank.error, JSON.stringify(blank));
  assert.ok(bad.success === false || bad.error, JSON.stringify(bad));
});
