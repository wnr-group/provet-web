"use client";

import { useEffect, useState } from "react";
import { Save, FileText } from "lucide-react";
import clsx from "clsx";
import { adminGetContent, adminUpdateContent } from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";

const PAGES = [
  { key: "home", label: "Homepage" },
  { key: "about", label: "About Us" },
];

export default function ContentAdmin() {
  const [page, setPage] = useState("home");
  const [sections, setSections] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: flip the loading flag immediately when `page` changes, before the fetch resolves.
    setLoading(true);
    adminGetContent(page)
      .then((res) => setSections(res.sections))
      .finally(() => setLoading(false));
  }, [page]);

  const updateSection = (key, field, value) => {
    setSections((secs) => secs.map((s) => (s.key === key ? { ...s, [field]: value } : s)));
    setSaved(false);
  };

  const onSave = async () => {
    setSaving(true);
    try {
      await adminUpdateContent(page, sections);
      setSaved(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Website Content</h1>
          <p className="mt-1 text-sm text-ink-soft">Edit the text sections shown on your public pages.</p>
        </div>
        <button onClick={onSave} disabled={saving || !sections} className="btn-primary">
          <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="mt-5 flex gap-2">
        {PAGES.map((p) => (
          <button
            key={p.key}
            onClick={() => setPage(p.key)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              page === p.key ? "bg-brand-600 text-white" : "bg-white text-ink-soft hover:bg-brand-50"
            )}
          >
            {p.label}
          </button>
        ))}
      </div>

      <div className={clsx("mt-5 space-y-4 transition-opacity", loading && sections && "opacity-50")}>
        {!sections ? (
          <PageSpinner />
        ) : sections.length === 0 ? (
          <div className="card p-8 text-center text-ink-soft">
            <FileText size={28} className="mx-auto text-brand-300" />
            <p className="mt-3 text-sm">No content sections found for this page.</p>
          </div>
        ) : (
          sections
            .slice()
            .sort((a, b) => a.order - b.order)
            .map((s) => (
              <div key={s.key} className="card space-y-3 p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-accent-600">{s.key}</p>
                <div>
                  <label className="label">Title</label>
                  <input
                    className="input"
                    value={s.title || ""}
                    onChange={(e) => updateSection(s.key, "title", e.target.value)}
                  />
                </div>
                <div>
                  <label className="label">Body</label>
                  <textarea
                    rows={4}
                    className="input resize-none"
                    value={s.body || ""}
                    onChange={(e) => updateSection(s.key, "body", e.target.value)}
                  />
                </div>
              </div>
            ))
        )}
      </div>
    </div>
  );
}
