// Caching for the data the public site reads.
//
// The database is a remote Postgres, where every query costs a network round
// trip of a few hundred milliseconds - far more than the query itself. The
// public pages read the same catalogue, categories and content on every
// request (the category tree alone was being fetched four or five times per
// page view), so those reads are cached:
//
//   * across requests, with Next's data cache (unstable_cache), under one
//     tag. Any write to a model the public site shows clears it at once - see
//     the write hook in lib/prisma.js - so an admin save is live on the next
//     page view, exactly as before. `revalidate` is only a safety net for
//     changes made outside the app (a SQL console, a seed script).
//   * within a request, with React's cache(), so a layout, a page and a
//     component asking for the same thing share one call.
//
// The admin screens never read through this: they use their own /api/admin
// routes, which query the database directly.
const PUBLIC_DATA_TAG = "public-data";
const SAFETY_NET_SECONDS = 600;

// The models whose rows appear on the public site. A write to any other model
// (enquiries, feedback submissions, brochure leads, admin users) doesn't change
// what visitors see, so it doesn't clear the cache.
const PUBLIC_MODELS = new Set([
  "Product",
  "Category",
  "Banner",
  "ContentBlock",
  "Page",
  "SocialLink",
  "BrochureSetting",
  "FeedbackSetting",
  "FeedbackField",
]);

const WRITE_OPERATIONS = new Set([
  "create",
  "createMany",
  "createManyAndReturn",
  "update",
  "updateMany",
  "updateManyAndReturn",
  "upsert",
  "delete",
  "deleteMany",
]);

function isPublicWrite(model, operation) {
  return PUBLIC_MODELS.has(model) && WRITE_OPERATIONS.has(operation);
}

// Expires the cached public data immediately, so the next request reads the
// database. Outside a Next.js request (seed scripts, tests) there is no cache
// to clear and next/cache throws; that is fine to ignore.
function invalidatePublicData() {
  try {
    require("next/cache").revalidateTag(PUBLIC_DATA_TAG, { expire: 0 });
  } catch {
    // not running inside Next.js
  }
}

// Wraps a read for the public site: cached across requests under the public
// tag, and de-duplicated within a request. `name` must be unique per function -
// it is part of the cache key, alongside the arguments.
function cachedRead(name, fn) {
  let persistent;
  let perRequest;
  try {
    const { unstable_cache } = require("next/cache");
    const { cache } = require("react");
    persistent = unstable_cache(fn, ["public", name], { tags: [PUBLIC_DATA_TAG], revalidate: SAFETY_NET_SECONDS });
    perRequest = cache((...args) => persistent(...args));
  } catch {
    perRequest = fn;
  }
  return (...args) => perRequest(...args);
}

module.exports = { PUBLIC_DATA_TAG, isPublicWrite, invalidatePublicData, cachedRead };
