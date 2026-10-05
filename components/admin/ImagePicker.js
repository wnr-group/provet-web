"use client";

import { useRef, useState } from "react";
import clsx from "clsx";
import { Upload, X, Loader2, ImagePlus, ChevronLeft, ChevronRight, Star } from "lucide-react";
import { adminUploadFile } from "./adminApi";

// Mirrors MAX_UPLOAD_MB's default in app/api/admin/upload/route.js; the
// server is still the one that enforces it.
const UPLOAD_HINT = "JPG, PNG or WebP · up to 5 MB each";

// Single-image picker (banners, category thumbnail)
export function ImagePicker({ value, onChange, compact = false, label = "Image" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await adminUploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  // Table-cell size: the thumbnail is itself the upload button, with a small
  // remove control - room for one picture per row without a separate button.
  if (compact) {
    return (
      <div className="w-16">
        <div className="group relative h-14 w-16">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            aria-label={value ? `Replace ${label.toLowerCase()}` : `Upload ${label.toLowerCase()}`}
            title={value ? "Click to replace" : "Click to upload"}
            className="flex h-full w-full items-center justify-center overflow-hidden rounded-lg border border-dashed border-brand-200 bg-mist-50 text-brand-400 transition hover:border-brand-400 hover:text-brand-600"
          >
            {uploading ? (
              <Loader2 size={16} className="animate-spin" />
            ) : value ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={value} alt="" className="h-full w-full object-cover" />
            ) : (
              <Upload size={16} />
            )}
          </button>
          {value && !uploading && (
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute -right-1.5 -top-1.5 rounded-full bg-black/70 p-0.5 text-white opacity-0 transition group-hover:opacity-100 focus:opacity-100"
              aria-label={`Remove ${label.toLowerCase()}`}
            >
              <X size={11} />
            </button>
          )}
          <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
        </div>
        {error && <p className="mt-1 text-[0.7rem] leading-tight text-red-600">{error}</p>}
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3">
        {value ? (
          <div className="relative h-20 w-20 overflow-hidden rounded-xl border border-brand-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={value} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange("")}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
              aria-label="Remove image"
            >
              <X size={12} />
            </button>
          </div>
        ) : null}
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline text-sm" disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : value ? "Replace Image" : "Upload Image"}
        </button>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Mirrors MAX_VIDEO_MB's default in app/api/admin/upload/route.js.
const VIDEO_HINT = "MP4 or WebM · up to 30 MB · a short, silent, compressed loop";

// Single-video picker (the homepage hero video): upload a file, or paste a
// link to one hosted elsewhere.
export function VideoPicker({ value, onChange, label = "Video" }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const { url } = await adminUploadFile(file);
      onChange(url);
    } catch (err) {
      setError(err.message || "Upload failed.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {value && (
        <div className="relative mb-3 aspect-video w-full max-w-xs overflow-hidden rounded-xl border border-brand-100 bg-brand-900">
          {/* A still frame (#t=) with controls rather than autoplay: the
              admin can play it, and the page isn't playing two videos. */}
          <video key={value} src={`${value}#t=1`} muted controls playsInline preload="metadata" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white"
            aria-label={`Remove ${label.toLowerCase()}`}
          >
            <X size={12} />
          </button>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3">
        <button type="button" onClick={() => inputRef.current?.click()} className="btn-outline text-sm" disabled={uploading}>
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Upload size={14} />}
          {uploading ? "Uploading..." : value ? "Replace Video" : "Upload Video"}
        </button>
        <span className="text-xs text-ink-soft">{VIDEO_HINT}</span>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="video/mp4,video/webm"
        hidden
        onChange={(e) => {
          handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
      <input
        className="input mt-3"
        placeholder="...or paste a link to an MP4 / WebM file"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        aria-label={`${label} link`}
      />
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
    </div>
  );
}

// Multi-image picker (products). The first image is the cover - the one the
// catalogue card, search results and enquiry list show - so it is labelled,
// and any other image can be promoted to it or moved along the row.
export function MultiImagePicker({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [errors, setErrors] = useState([]);

  // Several files upload in parallel; each success is appended as it lands,
  // and failures are listed by file name rather than silently dropped.
  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []).filter(Boolean);
    if (!files.length) return;
    setErrors([]);
    setUploading((n) => n + files.length);
    const results = await Promise.allSettled(files.map((file) => adminUploadFile(file)));
    setUploading((n) => n - files.length);

    const urls = results.filter((r) => r.status === "fulfilled").map((r) => r.value.url);
    if (urls.length) onChange([...value, ...urls]);
    setErrors(
      results
        .map((r, i) => (r.status === "rejected" ? `${files[i].name}: ${r.reason?.message || "upload failed"}` : null))
        .filter(Boolean)
    );
  };

  const move = (from, to) => {
    if (to < 0 || to >= value.length) return;
    const next = value.slice();
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange(next);
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const dropHandlers = {
    onDragOver: (e) => {
      e.preventDefault();
      setDragging(true);
    },
    onDragLeave: () => setDragging(false),
    onDrop,
  };
  const busy = uploading > 0;

  return (
    <div {...dropHandlers}>
      {value.length > 0 && (
        <ul
          className={clsx(
            "grid grid-cols-3 gap-3 rounded-2xl sm:grid-cols-4 lg:grid-cols-5",
            dragging && "ring-2 ring-accent-400 ring-offset-4"
          )}
        >
          {value.map((img, i) => (
            <li
              key={img + i}
              className={clsx(
                "group relative aspect-square overflow-hidden rounded-xl bg-mist-50 ring-1",
                i === 0 ? "ring-2 ring-accent-400" : "ring-brand-100"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs */}
              <img src={img} alt={`Product image ${i + 1}`} className="h-full w-full object-contain p-1.5" />
              {i === 0 && (
                <span className="absolute left-1.5 top-1.5 inline-flex items-center gap-1 rounded-full bg-accent-500 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white shadow-soft">
                  <Star size={10} /> Cover
                </span>
              )}
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="absolute right-1.5 top-1.5 rounded-full bg-black/60 p-1 text-white transition hover:bg-red-600"
                aria-label={`Remove image ${i + 1}`}
              >
                <X size={12} />
              </button>
              {/* Always visible on touch; revealed on hover with a pointer. */}
              <div className="absolute inset-x-1.5 bottom-1.5 flex items-center justify-between gap-1 transition sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => move(i, i - 1)}
                  disabled={i === 0}
                  className="rounded-full bg-white/95 p-1 text-ink shadow-soft disabled:invisible"
                  aria-label={`Move image ${i + 1} left`}
                >
                  <ChevronLeft size={12} />
                </button>
                {i !== 0 && (
                  <button
                    type="button"
                    onClick={() => move(i, 0)}
                    className="rounded-full bg-white/95 px-2 py-0.5 text-[10px] font-semibold text-brand-700 shadow-soft"
                  >
                    Make cover
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => move(i, i + 1)}
                  disabled={i === value.length - 1}
                  className="rounded-full bg-white/95 p-1 text-ink shadow-soft disabled:invisible"
                  aria-label={`Move image ${i + 1} right`}
                >
                  <ChevronRight size={12} />
                </button>
              </div>
            </li>
          ))}
          {/* Adding more is a tile in the same grid, not a second box below. */}
          <li>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              disabled={busy}
              className="flex aspect-square w-full flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-brand-200 bg-mist-50/50 text-brand-600 transition hover:border-brand-300 hover:bg-brand-50/60"
            >
              {busy ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
              <span className="text-xs font-semibold">{busy ? `Uploading ${uploading}...` : "Add images"}</span>
            </button>
          </li>
        </ul>
      )}
      {value.length > 0 && <p className="mt-2 text-xs text-ink-soft">Drag and drop to add · {UPLOAD_HINT}</p>}

      {value.length === 0 && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={busy}
          className={clsx(
            "flex w-full flex-col items-center justify-center gap-1.5 rounded-2xl border-2 border-dashed px-4 py-6 text-center transition",
            dragging ? "border-accent-400 bg-accent-50" : "border-brand-200 bg-mist-50/50 hover:border-brand-300 hover:bg-brand-50/50"
          )}
        >
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-brand-600 shadow-soft ring-1 ring-brand-100">
            {uploading > 0 ? <Loader2 size={18} className="animate-spin" /> : <ImagePlus size={18} />}
          </span>
          <span className="text-sm font-semibold text-ink">
            {busy ? `Uploading ${uploading} ${uploading === 1 ? "image" : "images"}...` : "Upload product images"}
          </span>
          <span className="text-xs text-ink-soft">Drag and drop, or click to browse · {UPLOAD_HINT}</span>
        </button>
      )}
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          handleFiles(e.target.files);
          e.target.value = "";
        }}
      />

      {errors.length > 0 && (
        <ul className="mt-2 space-y-0.5 text-xs text-red-600" role="alert">
          {errors.map((msg) => (
            <li key={msg}>{msg}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
