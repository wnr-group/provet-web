"use client";

import { useRef, useState } from "react";
import { Upload, X, Loader2 } from "lucide-react";
import { adminUploadFile } from "./adminApi";

// Single-image picker (banners, category thumbnail)
export function ImagePicker({ value, onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminUploadFile(file);
      onChange(url);
    } finally {
      setUploading(false);
    }
  };

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
    </div>
  );
}

// Multi-image picker (products)
export function MultiImagePicker({ value = [], onChange }) {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await adminUploadFile(file);
      onChange([...value, url]);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-3">
        {value.map((img, i) => (
          <div key={img + i} className="relative h-20 w-20 overflow-hidden rounded-xl border border-brand-100">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={img} alt="" className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onChange(value.filter((_, idx) => idx !== i))}
              className="absolute right-1 top-1 rounded-full bg-black/60 p-0.5 text-white"
            >
              <X size={12} />
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex h-20 w-20 flex-col items-center justify-center gap-1 rounded-xl border border-dashed border-brand-300 text-brand-600 hover:bg-brand-50"
        >
          {uploading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
          <span className="text-xs">{uploading ? "..." : "Add"}</span>
        </button>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleFile(e.target.files?.[0])} />
      </div>
    </div>
  );
}
