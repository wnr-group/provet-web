// Files in public/ that are not content-hashed. Next serves them with
// `max-age=0` by default, so every visit re-asked the server about every logo,
// cover and photo. A week (plus a day of serving stale while it refreshes) keeps
// repeat visits free, and a replaced file still shows up within the week - and
// at once under a new name, which is how images are replaced (see the note in
// lib/publicCache.js). Admin uploads live in Supabase Storage under unique
// names and are cached for a year there.
const WEEK = "public, max-age=604800, stale-while-revalidate=86400";
const publicAssets = ["content", "catalogue", "brochure", "provet-photos", "magazines", "uploads"].map((dir) => ({
  source: `/${dir}/:path*`,
  headers: [{ key: "Cache-Control", value: WEEK }],
}));

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Images from Supabase Storage (everything the admin uploads) go through
    // Next's optimizer: resized to the width the layout shows and re-encoded as
    // WebP. The path is pinned to Storage's public objects, so the optimizer
    // cannot be pointed at anything else on that host.
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co", pathname: "/storage/v1/object/public/**" },
    ],
    // One quality, so a request can't ask the server to encode the same image
    // at every value.
    qualities: [75],
    // Next refuses to fetch an image whose host name resolves to a private
    // address. Supabase never does on a normal host, but on an IPv6-only
    // network with DNS64/NAT64 (some home and office connections) it does,
    // and every uploaded image would fail locally. So: allowed in development;
    // in production only if IMAGE_ALLOW_LOCAL_IP=1 is set deliberately, e.g.
    // for a local `next start`. The host is still pinned by remotePatterns.
    dangerouslyAllowLocalIP: process.env.NODE_ENV !== "production" || process.env.IMAGE_ALLOW_LOCAL_IP === "1",
    // Uploaded files get a new name when replaced and are served immutable, so
    // an optimized copy can safely be kept for a month.
    minimumCacheTTL: 60 * 60 * 24 * 31,
  },
  async headers() {
    return [
      ...publicAssets,
      // A PDF held on this site is shown, not saved: the right type, and
      // `inline` (never `attachment`), so every browser opens it in its own PDF
      // viewer. PDFs kept in Supabase Storage are served by Storage with the
      // type they were uploaded with - see contentTypeFor in lib/storage.js.
      {
        source: "/:path*.pdf",
        headers: [
          { key: "Content-Type", value: "application/pdf" },
          { key: "Content-Disposition", value: "inline" },
          { key: "X-Content-Type-Options", value: "nosniff" },
        ],
      },
    ];
  },
};

export default nextConfig;
