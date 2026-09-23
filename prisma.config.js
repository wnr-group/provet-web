require("dotenv").config();
const { defineConfig } = require("prisma/config");

module.exports = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Supabase's transaction pooler (port 6543) drops the session state the
    // migration engine needs, so migrations run over the direct/session
    // connection (port 5432) while the app keeps using the pooled URL.
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
});
