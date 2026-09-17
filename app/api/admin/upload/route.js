const { requireAdmin } = require("../../../../lib/requireAdmin");
const { saveUploadedFile } = require("../../../../lib/storage");

const MAX_UPLOAD_MB = Number(process.env.MAX_UPLOAD_MB) || 5;

// POST /api/admin/upload (multipart/form-data, field name "file") -> { url }
export async function POST(request) {
  const session = await requireAdmin();
  if (!session) return Response.json({ error: "Not authenticated" }, { status: 401 });

  const formData = await request.formData().catch(() => null);
  const file = formData?.get("file");

  if (!file || typeof file === "string") {
    return Response.json({ error: "No file provided (expected field name 'file')" }, { status: 400 });
  }

  if (!/^image\//.test(file.type)) {
    return Response.json({ error: "Only image files are allowed" }, { status: 400 });
  }

  if (file.size > MAX_UPLOAD_MB * 1024 * 1024) {
    return Response.json({ error: `File exceeds the ${MAX_UPLOAD_MB}MB limit` }, { status: 400 });
  }

  const { url } = await saveUploadedFile(file);
  return Response.json({ url }, { status: 201 });
}
