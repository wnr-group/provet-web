"use client";

import { useEffect, useRef, useState } from "react";
import { FileText, Upload, Save, Trash2, ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react";
import clsx from "clsx";
import { adminGetBrochure, adminUpdateBrochure, adminUploadFile } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";

const MAX_DOCUMENT_MB = 25;

// Admin > Brochure: the catalogue brochure behind the Download Brochure button
// on the Products page (lib/brochureSettings.js).
export default function BrochureAdmin() {
  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Brochure</h1>
      <p className="mt-1 text-sm text-ink-soft">
        The PDF behind the Download Brochure button on the Products page.
      </p>
      <div className="mt-6 max-w-2xl">
        <Settings />
      </div>
    </div>
  );
}

// ---- Settings ----------------------------------------------------------------

function Settings() {
  const [settings, setSettings] = useState(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const fileInput = useRef(null);

  useEffect(() => {
    adminGetBrochure()
      .then(setSettings)
      .catch((err) => setError(err.data?.error || "Could not load the brochure settings."));
  }, []);

  const update = (patch) => {
    setSettings((s) => ({ ...s, ...patch }));
    setSaved(false);
    setError("");
  };

  const onPickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = ""; // picking the same file again should still fire
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) {
      setError("Choose a PDF file.");
      return;
    }
    if (file.size > MAX_DOCUMENT_MB * 1024 * 1024) {
      setError(`The PDF is larger than the ${MAX_DOCUMENT_MB}MB limit.`);
      return;
    }
    setUploading(true);
    setError("");
    try {
      const { url } = await adminUploadFile(file);
      update({ fileUrl: url, fileName: file.name });
    } catch (err) {
      setError(err.data?.error || err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      setSettings(await adminUpdateBrochure(settings));
      setSaved(true);
    } catch (err) {
      setError(err.data?.error || "Could not save the brochure settings.");
    } finally {
      setSaving(false);
    }
  };

  if (!settings) return error ? <ErrorNote>{error}</ErrorNote> : <PageSpinner />;

  const live = settings.isEnabled && settings.fileUrl;
  // Uploaded files are stored under a generated name; show the admin's own.
  const displayName = settings.fileName || settings.fileUrl?.split("/").pop();

  return (
    <form onSubmit={onSave} className="space-y-4">
      <p
        className={clsx(
          "flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium",
          live ? "bg-accent-50 text-accent-700" : "bg-mist-100 text-ink-soft"
        )}
      >
        {live ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
        {live
          ? "The Download Brochure button is showing on the Products page."
          : settings.fileUrl
            ? "The button is hidden - turn on “Show the button” to offer the brochure."
            : "No brochure yet - upload a PDF to offer it on the Products page."}
      </p>

      <div className="card p-5">
        <p className="text-sm font-semibold text-ink">Brochure PDF</p>
        {settings.fileUrl ? (
          <div className="mt-3 flex items-center gap-3 rounded-xl bg-mist-50 p-3">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
              <FileText size={20} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-ink" title={displayName}>
                {displayName}
              </p>
              <a
                href={settings.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
              >
                Open PDF <ExternalLink size={12} />
              </a>
            </div>
            <button
              type="button"
              onClick={() => update({ fileUrl: null, fileName: null, isEnabled: false })}
              aria-label="Remove the brochure PDF"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-ink-soft hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ) : (
          <p className="mt-2 text-sm text-ink-soft">No PDF uploaded.</p>
        )}

        <input ref={fileInput} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onPickFile} />
        <button
          type="button"
          onClick={() => fileInput.current?.click()}
          disabled={uploading}
          className="btn-outline mt-3 w-full justify-center sm:w-auto"
        >
          <Upload size={16} />
          {uploading ? "Uploading..." : settings.fileUrl ? "Replace PDF" : "Upload PDF"}
        </button>
        <p className="mt-2 text-xs text-ink-soft">PDF only, up to {MAX_DOCUMENT_MB}MB. Save to put it live.</p>
      </div>

      <div className="card space-y-4 p-5">
        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={settings.isEnabled}
            onChange={(e) => update({ isEnabled: e.target.checked })}
          />
          <span>
            <span className="block text-sm font-semibold text-ink">Show the button</span>
            <span className="block text-sm text-ink-soft">When off, the Products page has no brochure button.</span>
          </span>
        </label>

        <label className="flex items-start gap-3">
          <input
            type="checkbox"
            className="mt-1"
            checked={settings.requireDetails}
            onChange={(e) => update({ requireDetails: e.target.checked })}
          />
          <span>
            <span className="block text-sm font-semibold text-ink">Ask for details first</span>
            <span className="block text-sm text-ink-soft">
              Visitors give their name, email, phone and company before the PDF opens. When off, the button
              opens the PDF straight away.
            </span>
          </span>
        </label>

        <div>
          <label className="label" htmlFor="brochure-label">
            Button label
          </label>
          <input
            id="brochure-label"
            required
            maxLength={40}
            className="input"
            value={settings.buttonLabel}
            onChange={(e) => update({ buttonLabel: e.target.value })}
            placeholder="Download Brochure"
          />
        </div>
      </div>

      {error && <ErrorNote>{error}</ErrorNote>}

      <button type="submit" disabled={saving || uploading} className="btn-primary w-full justify-center sm:w-auto">
        <Save size={16} /> {saving ? "Saving..." : saved ? "Saved" : "Save Changes"}
      </button>
    </form>
  );
}

function ErrorNote({ children, className }) {
  return (
    <p role="alert" className={clsx("flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700", className)}>
      <AlertCircle size={16} className="shrink-0" /> {children}
    </p>
  );
}
