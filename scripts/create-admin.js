// Creates an administrator, or moves an existing one over to Supabase Auth.
// This is the only way to make one: no route in the app can create or promote
// an admin, so nobody can give themselves the role.
//
//   node scripts/create-admin.js --email someone@provet.in --name "Full Name"
//
// You are asked for the password (typed hidden, twice). For a non-interactive
// run, set ADMIN_PASSWORD in the environment instead. The password is never
// printed and never stored by us - Supabase keeps only its hash.
//
// What it does, using the server-side secret key (SUPABASE_SERVICE_ROLE_KEY):
//   1. creates the Supabase Auth user (email confirmed), or, if the email
//      already has one, sets its password;
//   2. creates or updates the AdminUser row for that email: links authUserId,
//      sets the role to "admin", marks it active, and clears the old password
//      hash so the pre-Supabase login can no longer work.
// Safe to run again for the same email.
require("dotenv").config();
const readline = require("readline");
const { createClient } = require("@supabase/supabase-js");
const prisma = require("../lib/prisma");
const { supabaseConfig } = require("../lib/storage");
const { newPassword, emailSchema } = require("../lib/adminAccess");

function arg(name) {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
}

// A line typed without echo.
function askHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (text) => {
      if (text.includes(question)) rl.output.write(text);
    };
    rl.question(question, (answer) => {
      rl.output.write("\n");
      rl.close();
      resolve(answer);
    });
  });
}

async function readPassword() {
  if (process.env.ADMIN_PASSWORD) return process.env.ADMIN_PASSWORD;
  if (!process.stdin.isTTY) throw new Error("No terminal to ask for a password: set ADMIN_PASSWORD, or run this in an interactive terminal");
  const first = await askHidden("Password: ");
  const second = await askHidden("Repeat password: ");
  if (first !== second) throw new Error("The passwords do not match");
  return first;
}

async function findAuthUserByEmail(admin, email) {
  for (let page = 1; page < 50; page++) {
    const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
    if (error) throw error;
    const hit = data.users.find((u) => u.email?.toLowerCase() === email);
    if (hit) return hit;
    if (data.users.length < 200) return null;
  }
  return null;
}

async function main() {
  const email = emailSchema.parse(arg("email"));
  const name = String(arg("name") || "").trim();
  if (!name) throw new Error('Give the admin\'s name: --name "Full Name"');
  const password = newPassword.parse(await readPassword());

  const config = supabaseConfig();
  if (!config) throw new Error("SUPABASE_SERVICE_ROLE_KEY (and the project URL) must be set");
  const admin = createClient(config.url, config.key, { auth: { persistSession: false, autoRefreshToken: false } });

  let user;
  const created = await admin.auth.admin.createUser({ email, password, email_confirm: true });
  if (!created.error) {
    user = created.data.user;
    console.log("Created the Supabase Auth user.");
  } else if (/already|exists|registered/i.test(created.error.message) || created.error.code === "email_exists") {
    user = await findAuthUserByEmail(admin, email);
    if (!user) throw new Error("That email is registered but the user could not be found");
    const updated = await admin.auth.admin.updateUserById(user.id, { password, email_confirm: true });
    if (updated.error) throw updated.error;
    console.log("That email already had a Supabase Auth user: its password was set.");
  } else {
    throw created.error;
  }

  const row = await prisma.adminUser.upsert({
    where: { email },
    create: { name, email, authUserId: user.id, role: "admin", isActive: true, passwordHash: null },
    update: { name, authUserId: user.id, role: "admin", isActive: true, passwordHash: null },
  });
  console.log(`Administrator ready: ${row.email} (${row.role}). They can sign in at /admin/login.`);
}

main()
  .catch((error) => {
    console.error("Failed:", error?.issues?.[0]?.message || error?.message || error);
    process.exitCode = 1;
  })
  .finally(() => prisma.$disconnect());
