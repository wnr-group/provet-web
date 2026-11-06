// Upload storage, adapter-style: the routes call saveUploadedFile and use the
// { url } it returns, whatever is behind it.
//
// Production (Vercel): Supabase Storage. Vercel's disk is read-only and wiped
// on every deploy, so uploads cannot live on it. Set, in the host's env:
//   SUPABASE_SERVICE_ROLE_KEY    the project's secret key (sb_secret_... or the
//                                legacy service_role JWT) - server-side only
//   SUPABASE_URL                 optional: https://<ref>.supabase.co. Left out,
//                                it is worked out from DATABASE_URL
//   SUPABASE_STORAGE_BUCKET      optional: a PUBLIC bucket, default "uploads"
// Local development: with no key set, files go to public/uploads as before.
const fs = require("fs/promises");
const path = require("path");
const crypto = require("crypto");

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads");

function safeExtension(filename) {
  const ext = path.extname(filename || "").toLowerCase();
  return /^\.[a-z0-9]{1,5}$/.test(ext) ? ext : "";
}

// The project's API address: SUPABASE_URL, or built from the project ref in the
// pooler login of DATABASE_URL ("postgres.<ref>").
function projectUrl(env) {
  const explicit = String(env.SUPABASE_URL || "").trim().replace(/\/+$/, "");
  if (explicit) return explicit;
  const ref = /\/\/postgres\.([a-z0-9]+)[:@]/i.exec(String(env.DATABASE_URL || ""))?.[1];
  return ref ? `https://${ref}.supabase.co` : "";
}

// The Supabase settings, or null when this environment stores files locally.
function supabaseConfig(env = process.env) {
  const key = String(env.SUPABASE_SERVICE_ROLE_KEY || "").trim();
  const url = projectUrl(env);
  if (!url || !key) return null;
  return { url, key, bucket: String(env.SUPABASE_STORAGE_BUCKET || "uploads").trim() };
}

const newFilename = (ext) => `${Date.now()}-${crypto.randomBytes(6).toString("hex")}${ext}`;
const publicUrl = ({ url, bucket }, filename) => `${url}/storage/v1/object/public/${bucket}/${filename}`;
const authHeaders = ({ key }) => ({ Authorization: `Bearer ${key}`, apikey: key });

async function saveToSupabase(config, filename, buffer, contentType) {
  const response = await fetch(`${config.url}/storage/v1/object/${config.bucket}/${filename}`, {
    method: "POST",
    headers: {
      ...authHeaders(config),
      "Content-Type": contentType || "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
    body: buffer,
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    throw new Error(`Supabase Storage upload failed (${response.status}): ${detail.slice(0, 200)}`);
  }
  return { url: publicUrl(config, filename) };
}

// `file` is a Web File instance from a Route Handler's `request.formData()`.
// `extension` overrides the one taken from the file name (a checked PDF is
// always stored as .pdf).
async function saveUploadedFile(file, { extension } = {}) {
  const filename = newFilename(extension || safeExtension(file.name));
  const buffer = Buffer.from(await file.arrayBuffer());

  const supabase = supabaseConfig();
  if (supabase) return saveToSupabase(supabase, filename, buffer, file.type);

  await fs.mkdir(UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(UPLOAD_DIR, filename), buffer);
  return { url: `/uploads/${filename}` };
}

// A one-time address the browser can send a large file to directly. Vercel
// refuses request bodies over ~4.5 MB, so videos and big PDFs cannot pass
// through a route handler. Returns { uploadUrl, url } - the address to PUT the
// file to and the public address it will have - or null when files are kept
// locally (the caller then uses the ordinary upload).
async function createDirectUpload({ extension }) {
  const config = supabaseConfig();
  if (!config) return null;

  const filename = newFilename(extension);
  const response = await fetch(`${config.url}/storage/v1/object/upload/sign/${config.bucket}/${filename}`, {
    method: "POST",
    headers: { ...authHeaders(config), "Content-Type": "application/json" },
    body: "{}",
  });
  const data = await response.json().catch(() => null);
  if (!response.ok || !data?.url) {
    throw new Error(`Supabase Storage refused the upload (${response.status}): ${JSON.stringify(data).slice(0, 200)}`);
  }
  return { uploadUrl: `${config.url}/storage/v1${data.url}`, url: publicUrl(config, filename) };
}

module.exports = { saveUploadedFile, createDirectUpload, supabaseConfig, projectUrl, safeExtension };
