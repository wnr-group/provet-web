const { requireAdmin } = require("../../../../../lib/requireAdmin");
const { createDirectUpload, safeExtension } = require("../../../../../lib/storage");

const MB = 1024 * 1024;
const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 5;
const MAX_DOCUMENT_MB = Number(process.env.MAX_DOCUMENT_MB) || 25;
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_MB) || 30;

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".gif", ".avif", ".svg"]);
const VIDEO_EXTENSIONS = new Set([".mp4", ".webm"]);

// What a file is allowed to be, from what the browser says about it: its
// kind, the extension it is stored under and its size limit. null = refused.
function classify({ name, type }) {
  const ext = safeExtension(name);
  if (type === "application/pdf" || ext === ".pdf") return { ext: ".pdf", limitMb: MAX_DOCUMENT_MB, label: "PDF" };
  if (/^video\//.test(type) && VIDEO_EXTENSIONS.has(ext)) return { ext, limitMb: MAX_VIDEO_MB, label: "video" };
  if (/^image\//.test(type) && IMAGE_EXTENSIONS.has(ext)) return { ext, limitMb: MAX_UPLOAD_MB, label: "file" };
  return null;
}

// POST /api/admin/upload/sign  { name, type, size } -> { uploadUrl, url }
//
// For files too big to pass through a route handler on Vercel (bodies over
// ~4.5 MB are refused): the browser gets a one-time address and sends the file
// straight to storage. { direct: false } when this environment keeps files on
// its own disk, so the caller uses the ordinary /api/admin/upload instead.
// Unlike that route, the file itself is never seen here, so its contents are
// not checked - only what the admin's browser declares, which is trusted as far
// as an authenticated admin can be.
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const body = await request.json().catch(() => null);
  const name = String(body?.name || "");
  const type = String(body?.type || "");
  const size = Number(body?.size);

  const kind = classify({ name, type });
  if (!kind) return Response.json({ error: "Only image, MP4/WebM video or PDF files are allowed" }, { status: 400 });
  if (!Number.isFinite(size) || size <= 0 || size > kind.limitMb * MB) {
    return Response.json({ error: `The ${kind.label} is larger than the ${kind.limitMb}MB limit` }, { status: 400 });
  }

  try {
    const upload = await createDirectUpload({ extension: kind.ext });
    if (!upload) return Response.json({ direct: false });
    return Response.json({ direct: true, ...upload }, { status: 201 });
  } catch (error) {
    console.error(error);
    return Response.json({ error: "Could not prepare the upload" }, { status: 502 });
  }
}
