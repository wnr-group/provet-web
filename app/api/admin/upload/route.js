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

// POST /api/admin/upload (multipart/form-data, field name "file") -> { url }
// Images, or PDF documents.
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

  if (!/^image\//.test(file.type)) {
    return Response.json({ error: "Only image or PDF files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return Response.json({ error: `File exceeds the ${MAX_UPLOAD_MB}MB limit` }, { status: 400 });
  }

  const { url } = await saveUploadedFile(file);
  return Response.json({ url }, { status: 201 });
}
