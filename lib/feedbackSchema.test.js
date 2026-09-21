// Run with `npm test` (node --test). Pure unit tests - no DB, no server.
const test = require("node:test");
const assert = require("node:assert/strict");

const {
  DEFAULT_FEEDBACK_CONFIG,
  DEFAULT_FEEDBACK_FIELDS,
  FIELD_TYPE_KEYS,
  SYSTEM_KEYS,
  TEXTAREA_MAX,
  buildFieldKey,
  parseFieldOptions,
  enabledFields,
  feedbackConfigSchema,
  feedbackFieldSchema,
  systemFieldUpdateSchema,
  reorderSchema,
  buildFeedbackSubmissionSchema,
  toFeedbackRow,
} = require("./feedbackSchema");

const firstError = (result) => result.error?.issues[0]?.message;

const field = (over = {}) => ({
  key: "custom",
  label: "Custom",
  type: "text",
  options: null,
  isRequired: false,
  isEnabled: true,
  isSystem: false,
  order: 10,
  ...over,
});

const systemFields = () => DEFAULT_FEEDBACK_FIELDS.map((f) => ({ ...f, options: null }));

// ---- Config ----------------------------------------------------------------

test("accepts the default config", () => {
  assert.equal(feedbackConfigSchema.safeParse(DEFAULT_FEEDBACK_CONFIG).success, true);
});

test("config requires a non-empty title", () => {
  for (const title of ["", "   "]) {
    const result = feedbackConfigSchema.safeParse({ ...DEFAULT_FEEDBACK_CONFIG, title });
    assert.equal(result.success, false);
    assert.match(firstError(result), /Title is required/);
  }
});

test("config allows an empty description but caps its length", () => {
  assert.equal(feedbackConfigSchema.safeParse({ ...DEFAULT_FEEDBACK_CONFIG, description: "" }).success, true);
  assert.equal(feedbackConfigSchema.safeParse({ ...DEFAULT_FEEDBACK_CONFIG, description: null }).success, true);
  assert.equal(
    feedbackConfigSchema.safeParse({ ...DEFAULT_FEEDBACK_CONFIG, description: "x".repeat(501) }).success,
    false
  );
});

// ---- Field definition validation -------------------------------------------

test("accepts a simple custom field", () => {
  const result = feedbackFieldSchema.safeParse({ label: "Clinic name", type: "text" });
  assert.equal(result.success, true);
});

test("a field needs a label and a known type", () => {
  assert.match(firstError(feedbackFieldSchema.safeParse({ label: "", type: "text" })), /Label is required/);
  assert.match(firstError(feedbackFieldSchema.safeParse({ label: "X", type: "carrier-pigeon" })), /Unsupported field type/);
});

test("choice fields must have at least one option", () => {
  for (const type of ["select", "radio", "checkbox"]) {
    const missing = feedbackFieldSchema.safeParse({ label: "Pick", type });
    assert.equal(missing.success, false, `${type} should require options`);
    assert.match(firstError(missing), /at least one option/);

    const ok = feedbackFieldSchema.safeParse({ label: "Pick", type, options: ["A", "B"] });
    assert.equal(ok.success, true, `${type} with options should pass`);
  }
});

test("choice field options must be unique", () => {
  const result = feedbackFieldSchema.safeParse({ label: "Pick", type: "select", options: ["A", "a"] });
  assert.equal(result.success, false);
  assert.match(firstError(result), /Options must be unique/);
});

test("non-choice fields don't need options", () => {
  for (const type of ["text", "textarea", "email", "tel", "number", "rating"]) {
    assert.equal(feedbackFieldSchema.safeParse({ label: "X", type }).success, true, `${type} failed`);
  }
});

test("every declared field type is accepted by the schema", () => {
  for (const type of FIELD_TYPE_KEYS) {
    const payload = { label: "X", type, options: ["A"] };
    assert.equal(feedbackFieldSchema.safeParse(payload).success, true, `${type} failed`);
  }
});

test("a system field update can't change type or key", () => {
  const result = systemFieldUpdateSchema.safeParse({ label: "Your name", type: "number", key: "hacked" });
  assert.equal(result.success, true);
  assert.equal("type" in result.data, false);
  assert.equal("key" in result.data, false);
});

test("reorder needs a non-empty list of ids", () => {
  assert.equal(reorderSchema.safeParse({ order: [] }).success, false);
  assert.equal(reorderSchema.safeParse({ order: ["a", "b"] }).success, true);
});

// ---- Key generation --------------------------------------------------------

test("buildFieldKey slugifies the label", () => {
  assert.equal(buildFieldKey("How did you hear about us?"), "how-did-you-hear-about-us");
  assert.equal(buildFieldKey("Clinic  Name"), "clinic-name");
});

test("buildFieldKey never collides with a built-in column", () => {
  for (const key of SYSTEM_KEYS) {
    assert.notEqual(buildFieldKey(key), key);
  }
});

test("buildFieldKey de-duplicates against existing keys", () => {
  assert.equal(buildFieldKey("Clinic", ["clinic"]), "clinic-2");
  assert.equal(buildFieldKey("Clinic", ["clinic", "clinic-2"]), "clinic-3");
});

test("buildFieldKey falls back for a label with no usable characters", () => {
  assert.equal(buildFieldKey("!!!"), "field");
});

// ---- Helpers ---------------------------------------------------------------

test("parseFieldOptions tolerates arrays, JSON, null and junk", () => {
  assert.deepEqual(parseFieldOptions(["A"]), ["A"]);
  assert.deepEqual(parseFieldOptions('["A","B"]'), ["A", "B"]);
  assert.deepEqual(parseFieldOptions(null), []);
  assert.deepEqual(parseFieldOptions("not json"), []);
  assert.deepEqual(parseFieldOptions('{"a":1}'), []);
});

test("enabledFields drops disabled ones and sorts by order", () => {
  const result = enabledFields([
    field({ key: "b", order: 2 }),
    field({ key: "a", order: 1 }),
    field({ key: "off", order: 0, isEnabled: false }),
  ]);
  assert.deepEqual(result.map((f) => f.key), ["a", "b"]);
});

// ---- Submission validation, driven by the stored fields --------------------

test("accepts a valid submission against the built-in fields", () => {
  const schema = buildFeedbackSubmissionSchema(systemFields());
  assert.equal(schema.safeParse({ name: "Jane", email: "jane@example.com", message: "Great" }).success, true);
});

test("enforces required built-ins", () => {
  const schema = buildFeedbackSubmissionSchema(systemFields());
  assert.match(firstError(schema.safeParse({ email: "j@x.com", message: "Hi" })), /Name is required/);
  assert.match(firstError(schema.safeParse({ name: "Jane", message: "Hi" })), /Email is required/);
  assert.match(firstError(schema.safeParse({ name: "Jane", email: "j@x.com" })), /Feedback is required/);
});

test("a disabled field is neither required nor accepted", () => {
  const fields = systemFields().map((f) => (f.key === "name" ? { ...f, isEnabled: false } : f));
  const schema = buildFeedbackSubmissionSchema(fields);
  const result = schema.safeParse({ name: "Smuggled", email: "j@x.com", message: "Hi" });
  assert.equal(result.success, true);
  assert.equal("name" in result.data, false);
});

test("an optional field may be omitted but must still be valid when given", () => {
  const schema = buildFeedbackSubmissionSchema([field({ key: "alt", label: "Alt email", type: "email" })]);
  assert.equal(schema.safeParse({}).success, true);
  assert.equal(schema.safeParse({ alt: "" }).success, true);
  assert.match(firstError(schema.safeParse({ alt: "nope" })), /Alt email must be a valid email address/);
});

test("select and radio reject a value that isn't one of the options", () => {
  for (const type of ["select", "radio"]) {
    const schema = buildFeedbackSubmissionSchema([
      field({ key: "pick", label: "Pick", type, options: '["A","B"]', isRequired: true }),
    ]);
    assert.equal(schema.safeParse({ pick: "A" }).success, true);
    assert.match(firstError(schema.safeParse({ pick: "C" })), /Pick has an invalid selection/);
    assert.match(firstError(schema.safeParse({})), /Pick is required/);
  }
});

test("checkbox accepts a subset of the options and rejects anything else", () => {
  const schema = buildFeedbackSubmissionSchema([
    field({ key: "topics", label: "Topics", type: "checkbox", options: '["A","B"]', isRequired: true }),
  ]);
  assert.equal(schema.safeParse({ topics: ["A", "B"] }).success, true);
  assert.match(firstError(schema.safeParse({ topics: ["C"] })), /Topics has an invalid selection/);
  assert.match(firstError(schema.safeParse({ topics: [] })), /Topics is required/);
});

test("rating must be a whole number from 1 to 5", () => {
  const schema = buildFeedbackSubmissionSchema([
    field({ key: "score", label: "Score", type: "rating", isRequired: true }),
  ]);
  assert.equal(schema.safeParse({ score: 5 }).success, true);
  assert.equal(schema.safeParse({ score: "3" }).success, true, "a form posts strings");
  for (const bad of [0, 6, 2.5, "abc"]) {
    assert.equal(schema.safeParse({ score: bad }).success, false, `${bad} should be rejected`);
  }
  assert.match(firstError(schema.safeParse({})), /Score is required/);
});

test("number accepts numeric strings and rejects junk", () => {
  const schema = buildFeedbackSubmissionSchema([
    field({ key: "count", label: "Count", type: "number", isRequired: true }),
  ]);
  assert.equal(schema.safeParse({ count: "42" }).success, true);
  assert.equal(schema.safeParse({ count: -3.5 }).success, true);
  assert.match(firstError(schema.safeParse({ count: "abc" })), /Count must be a number/);
});

test("enforces the textarea length cap", () => {
  const schema = buildFeedbackSubmissionSchema(systemFields());
  const base = { name: "Jane", email: "j@x.com" };
  assert.equal(schema.safeParse({ ...base, message: "x".repeat(TEXTAREA_MAX) }).success, true);
  assert.equal(schema.safeParse({ ...base, message: "x".repeat(TEXTAREA_MAX + 1) }).success, false);
});

test("unknown keys in a crafted payload are stripped", () => {
  const schema = buildFeedbackSubmissionSchema(systemFields());
  const result = schema.safeParse({ name: "Jane", email: "j@x.com", message: "Hi", isAdmin: true, extra: "x" });
  assert.equal(result.success, true);
  assert.deepEqual(Object.keys(result.data).sort(), ["email", "message", "name"]);
});

// ---- Row shaping -----------------------------------------------------------

test("toFeedbackRow routes built-ins to columns and customs to answers", () => {
  const fields = [
    ...systemFields(),
    field({ key: "clinic", label: "Clinic", type: "text", order: 3 }),
    field({ key: "score", label: "Score", type: "rating", order: 4 }),
  ];
  const row = toFeedbackRow(
    { name: " Jane ", email: " j@x.com ", message: " Hi ", clinic: " VetCare ", score: "4" },
    fields
  );
  assert.equal(row.name, "Jane");
  assert.equal(row.email, "j@x.com");
  assert.equal(row.message, "Hi");
  assert.deepEqual(JSON.parse(row.answers), [
    { key: "clinic", label: "Clinic", value: "VetCare" },
    { key: "score", label: "Score", value: 4 },
  ]);
});

test("toFeedbackRow stores the label alongside each answer", () => {
  const fields = [field({ key: "clinic", label: "Clinic name", type: "text" })];
  const [answer] = JSON.parse(toFeedbackRow({ clinic: "VetCare" }, fields).answers);
  assert.equal(answer.label, "Clinic name");
});

test("toFeedbackRow omits blank and empty answers", () => {
  const fields = [
    field({ key: "a", label: "A", type: "text" }),
    field({ key: "b", label: "B", type: "checkbox", options: '["X"]' }),
  ];
  assert.equal(toFeedbackRow({ a: "   ", b: [] }, fields).answers, null);
});

test("toFeedbackRow ignores values for disabled fields", () => {
  const fields = [field({ key: "hidden", label: "Hidden", type: "text", isEnabled: false })];
  assert.equal(toFeedbackRow({ hidden: "Smuggled" }, fields).answers, null);
});

test("toFeedbackRow nulls built-ins that are disabled", () => {
  const fields = systemFields().map((f) => (f.key === "name" ? { ...f, isEnabled: false } : f));
  const row = toFeedbackRow({ name: "Smuggled", email: "j@x.com", message: "Hi" }, fields);
  assert.equal(row.name, null);
  assert.equal(row.email, "j@x.com");
});

test("the built-in defaults are internally consistent", () => {
  assert.deepEqual(DEFAULT_FEEDBACK_FIELDS.map((f) => f.key), SYSTEM_KEYS);
  assert.equal(DEFAULT_FEEDBACK_FIELDS.every((f) => f.isSystem), true);
  const message = DEFAULT_FEEDBACK_FIELDS.find((f) => f.key === "message");
  assert.equal(message.isRequired, true);
  assert.equal(message.isEnabled, true);
});
