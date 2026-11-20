const test = require("node:test");
const assert = require("node:assert/strict");
const { brochureLeadSchema, firstFieldErrors } = require("./brochureLeadSchema");
const { checkBrochureLead } = require("./brochureLeadRules");

const valid = { name: "Jane Doe", email: "jane@clinic.com", phone: "+91 98765 43210", company: "Green Valley", city: "Chennai" };

// The browser's dependency-free check must agree with the server's Zod schema
// on every input: the same verdict, the same message, the same data.
function bothAgree(form) {
  const server = brochureLeadSchema.safeParse(form);
  const client = checkBrochureLead(form);
  if (server.success) {
    assert.ok(client.data, `client rejected a valid form: ${JSON.stringify(form)} ${JSON.stringify(client.errors)}`);
    assert.deepEqual(client.data, JSON.parse(JSON.stringify(server.data)), JSON.stringify(form));
  } else {
    assert.ok(client.errors, `client accepted what the server refuses: ${JSON.stringify(form)}`);
    assert.deepEqual(client.errors, firstFieldErrors(server.error), JSON.stringify(form));
  }
}

test("a valid form is accepted by both, with the same trimmed data", () => {
  bothAgree(valid);
  bothAgree({ ...valid, city: undefined });
  bothAgree({ ...valid, city: "" });
  bothAgree({ ...valid, name: "  Jane Doe  ", email: " jane@clinic.com " });
});

test("every field's failure modes give the same message on both sides", () => {
  const bad = {
    name: ["", "   ", "J", undefined, null, 42],
    email: ["", "nope", "a@b", "a@b.c", "a b@c.com", "jane@@clinic.com", undefined],
    phone: ["", "123456", "abc defg hij", "+91 98765 43210", "12345678;", undefined],
    company: ["", " ", "G", undefined],
    city: ["x".repeat(121), "x".repeat(120)],
  };
  for (const [field, values] of Object.entries(bad)) {
    for (const value of values) bothAgree({ ...valid, [field]: value });
  }
});

test("a city that is not text is refused by both (their wording differs, the verdict does not)", () => {
  for (const city of [5, true, {}, []]) {
    assert.equal(brochureLeadSchema.safeParse({ ...valid, city }).success, false);
    assert.ok(checkBrochureLead({ ...valid, city }).errors?.city);
  }
});

test("several problems at once report the first one per field", () => {
  bothAgree({});
  bothAgree({ name: "", email: "", phone: "", company: "" });
  bothAgree({ name: "J", email: "x", phone: "1", company: "C", city: "y".repeat(200) });
});

test("anything that is not an object is refused, not a crash", () => {
  assert.ok(checkBrochureLead(null).errors);
  assert.ok(checkBrochureLead(undefined).errors);
});
