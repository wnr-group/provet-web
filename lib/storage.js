// Local-disk upload storage, adapter-style so it can be swapped for S3/
// Cloudinary/etc. later without touching route code - just replace the body
// of saveUploadedFile and keep the { url } return shape.
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeExtension(filename) {
  const ext = path.extname(filename || "").toLowerCase();
  return /^\.[a-z0-9]{1,5}$/.test(ext) ? ext : "";
}

// `file` is a Web File instance from a Route Handler's `request.formData()`.
async function saveUploadedFile(file) {
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const ext = safeExtension(file.name);
  const filename = `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());

  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);

  return { url: `/uploads/${filename}` };
}

module.exports = { saveUploadedFile };
