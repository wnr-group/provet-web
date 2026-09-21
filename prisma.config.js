require("dotenv").config();
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Migrations run schema-engine commands (advisory locks, etc.) that need a
  // real session, which Supabase's transaction-mode pooler (DATABASE_URL)
  // doesn't support - so migrate/introspect use the direct connection
  // instead. The app itself (lib/prisma.js) still uses DATABASE_URL.
  datasource: {
    url: process.env.DIRECT_URL,
  },
});
