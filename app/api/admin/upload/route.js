const { requireAdmin } = require("../../../../lib/requireAdmin");
const { saveUploadedFile } = require("../../../../lib/storage");

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 5;
// PDFs (the catalogue brochure) run larger than photos.
const MAX_DOCUMENT_MB = Number(process.env.MAX_DOCUMENT_MB) || 25;

// A real PDF starts with "%PDF-", whatever the browser says its type is.
async function isPdf(file) {
  const head = Buffer.from(await file.slice(0, 5).arrayBuffer()).toString("latin1");
  return head === "%PDF-";
}

// The homepage hero video. Kept modest: every visitor downloads it, and a
// background loop needs no more than a short, compressed clip.
const MAX_VIDEO_MB = Number(process.env.MAX_VIDEO_MB) || 30;

// "mp4" or "webm" from the file's own header, or null. An MP4 carries "ftyp"
// at byte 4; WebM (Matroska) starts with the EBML magic 1A 45 DF A3.
async function videoKind(file) {
  const head = Buffer.from(await file.slice(0, 12).arrayBuffer());
  if (head.subarray(4, 8).toString("latin1") === "ftyp") return "mp4";
  if (head.subarray(0, 4).equals(Buffer.from([0x1a, 0x45, 0xdf, 0xa3]))) return "webm";
  return null;
}

// POST /api/admin/upload (multipart/form-data, field name "file") -> { url }
// Images, the hero video, or PDF documents.
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file provided (expected field name 'file')" }, { status: 400 });
  }

  const isDocument = file.type === "application/pdf" || /\.pdf$/i.test(file.name || "");

  if (isDocument) {
    if (!(await isPdf(file))) {
      return Response.json({ error: "That file isn't a valid PDF" }, { status: 400 });
    }
    if (file.size > MAX_DOCUMENT_MB * 1024 * 1024) {
      return Response.json({ error: `The PDF is larger than the ${MAX_DOCUMENT_MB}MB limit` }, { status: 400 });
    }
    const { url } = await saveUploadedFile(file, { extension: ".pdf" });
    return Response.json({ url }, { status: 201 });
  }

  // The homepage hero video: MP4 or WebM, checked by its first bytes as PDFs are.
  if (/^video\//.test(file.type)) {
    const kind = await videoKind(file);
    if (!kind) {
      return Response.json({ error: "Only MP4 or WebM videos are allowed" }, { status: 400 });
    }
    if (file.size > MAX_VIDEO_MB * 1024 * 1024) {
      return Response.json({ error: `The video is larger than the ${MAX_VIDEO_MB}MB limit` }, { status: 400 });
    }
    const { url } = await saveUploadedFile(file, { extension: `.${kind}` });
    return Response.json({ url }, { status: 201 });
  }

  if (!/^image\//.test(file.type)) {
    return Response.json({ error: "Only image, video or PDF files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return Response.json({ error: `File exceeds the ${MAX_UPLOAD_MB}MB limit` }, { status: 400 });
  }

  const { url } = await saveUploadedFile(file);
  return Response.json({ url }, { status: 201 });
}
