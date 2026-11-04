const test = require("node:test");
const assert = require("node:assert/strict");
const { supabaseConfig, projectUrl } = require("./storage");

const POOLER = "postgresql://postgres.abcdef123:pw@aws-0-x.pooler.supabase.com:6543/postgres";

test("Supabase storage is used only with a key and a project address", () => {
  assert.equal(supabaseConfig({}), null);
  assert.equal(supabaseConfig({ DATABASE_URL: POOLER }), null);
  assert.equal(supabaseConfig({ SUPABASE_SERVICE_ROLE_KEY: "k" }), null);
});

test("the project address comes from SUPABASE_URL, else from the pooler login", () => {
  assert.equal(projectUrl({ SUPABASE_URL: "https://x.supabase.co/ " }), "https://x.supabase.co");
  assert.equal(projectUrl({ DATABASE_URL: POOLER }), "https://abcdef123.supabase.co");
  assert.equal(projectUrl({ DATABASE_URL: "postgresql://u:p@localhost:5432/db" }), "");
});

test("the settings are tidied and the bucket defaults to uploads", () => {
  assert.deepEqual(supabaseConfig({ SUPABASE_SERVICE_ROLE_KEY: " k ", DATABASE_URL: POOLER }), {
    url: "https://abcdef123.supabase.co",
    key: "k",
    bucket: "uploads",
  });
});
