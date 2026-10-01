// Prisma 7 dropped the Rust query engine binary and the `url` field on the
// schema's datasource block - PrismaClient now takes a driver adapter
// directly. This app runs against Postgres on Supabase via @prisma/adapter-pg.
const { PrismaClient } = require("@prisma/client");
const { PrismaPg } = require("@prisma/adapter-pg");
const { isPublicWrite, invalidatePublicData } = require("./publicCache");

const globalForPrisma = globalThis;

function createClient() {
  const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
    // The database is remote (Supabase, Seoul) and opening a connection - TCP
    // plus TLS to the pooler - costs ~1.5 s. node-postgres closes idle
    // connections after 10 s by default, so any request after a short pause
    // (a search, an admin save) paid that again. Keep them for five minutes.
    idleTimeoutMillis: 5 * 60 * 1000,
  });
  const base = new PrismaClient({ adapter });

  // The public site caches what it reads (lib/publicCache.js). Every write
  // that changes something visitors see - through any route, admin or not -
  // clears that cache here, once the write has succeeded, so no save can
  // forget to and no visitor is served stale content after it.
  return base.$extends({
    query: {
      $allModels: {
        async $allOperations({ model, operation, args, query }) {
          const result = await query(args);
          if (isPublicWrite(model, operation)) invalidatePublicData();
          return result;
        },
      },
    },
  });
}

// Reuse the client across hot-reloads in dev so we don't open a new Postgres
// connection pool on every edit.
//
// The key is versioned: a dev server holds the client across reloads, so after
// the client itself changes (here, the cache-clearing write hook) it would keep
// serving the old one - saves went through but the public site's cache was
// never cleared. Bump the version whenever createClient changes.
const CLIENT_KEY = "__prisma_v2";
const prisma = globalForPrisma[CLIENT_KEY] || createClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma[CLIENT_KEY] = prisma;
}

module.exports = prisma;
