// Prisma 7 dropped the Rust query engine binary and the `url` field on the
// schema's datasource block - PrismaClient now takes a driver adapter
// directly. This app runs against Postgres on Supabase via @prisma/adapter-pg.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");

const globalForPrisma = globalThis;

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
  });
  return new PrismaClient({ adapter });
}

// Reuse the client across hot-reloads in dev so we don't open a new Postgres
// connection pool on every edit.
const prisma = globalForPrisma.__prisma || createClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}

module.exports = prisma;
