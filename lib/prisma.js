// Prisma 7 dropped the Rust query engine binary and the `url` field on the
// schema's datasource block - PrismaClient now takes a driver adapter
// directly. For SQLite locally that's @prisma/adapter-better-sqlite3; moving
// to Postgres/Supabase later means swapping this adapter (e.g.
// @prisma/adapter-pg) and DATABASE_URL, nothing else in the app changes.
const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");

const globalForPrisma = globalThis;

function createClient() {
  const adapter = new PrismaBetterSqlite3({
    url: process.env.DATABASE_URL || "file:./prisma/dev.db",
  });
  return new PrismaClient({ adapter });
}

// Reuse the client across hot-reloads in dev so we don't open a new SQLite
// connection (and exhaust file handles) on every edit.
const prisma = globalForPrisma.__prisma || createClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.__prisma = prisma;
}

module.exports = prisma;
