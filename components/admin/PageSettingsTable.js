"use client";

import clsx from "clsx";
import { ImagePicker } from "@/components/admin/ImagePicker";

// The managed pages' settings as a table - one row per setting, with what it
// is, its value and where it appears - so it reads the same way as the
// sections table under it. The limits match lib/pageSchema.js, which refuses
// longer SEO text on save; the counters say so before that happens.
const ROWS = [
  {
    key: "title",
    label: "Page title",
    required: true,
    where: "The heading in the page banner and the browser tab.",
  },
  {
    key: "description",
    label: "Intro",
    type: "textarea",
    where: "The line under the heading in the banner.",
  },
  {
    key: "heroImage",
    label: "Banner image",
    type: "image",
    where: "The photo on the right of the banner.",
  },
  {
    key: "seoTitle",
    label: "SEO title",
    placeholder: "Defaults to the page title",
    max: 70,
    where: "The title shown in Google results.",
  },
  {
    key: "seoDescription",
    label: "SEO description",
    type: "textarea",
    placeholder: "Defaults to the intro",
    max: 200,
    where: "The summary shown under the title in Google results.",
  },
];

// One line for the "Page settings" row of the sections table.
export function summarizePageSettings(settings) {
  return [
    settings.title || "No title",
    settings.description ? settings.description.replace(/\s+/g, " ").trim() : "no intro",
    settings.heroImage ? "banner image set" : "no banner image",
    settings.seoTitle || settings.seoDescription ? "SEO set" : "SEO from title and intro",
  ].join(" · ");
}

// `bare`: just the table, for the edit dialog (which supplies the heading).
export default function PageSettingsTable({ settings, onChange, bare = false }) {
  const set = (key, value) => onChange((s) => ({ ...s, [key]: value }));

  return (
    <div className={bare ? "overflow-hidden rounded-xl border border-brand-100" : "card overflow-hidden"}>
      {!bare && (
        <div className="border-b border-brand-100 px-5 py-4">
          <h2 className="font-display font-semibold text-ink">Page settings</h2>
          <p className="mt-0.5 text-xs text-ink-soft">The page&apos;s banner and how it appears in search engines.</p>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[44rem] border-collapse text-sm">
          <thead>
            <tr className="bg-mist-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th scope="col" className="w-44 px-5 py-3">
                Setting
              </th>
              <th scope="col" className="px-3 py-3">
                Value
              </th>
              <th scope="col" className="w-64 px-5 py-3">
                Where it shows
              </th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => {
              const value = settings[row.key] || "";
              const over = row.max && value.length > row.max;
              const id = `page-setting-${row.key}`;
              return (
                <tr key={row.key} className="border-t border-brand-100 align-top transition-colors hover:bg-mist-50/60">
                  <th scope="row" className="px-5 py-4 text-left font-semibold text-ink">
                    <label htmlFor={row.type === "image" ? undefined : id}>
                      {row.label}
                      {row.required && <span className="ml-0.5 text-accent-600">*</span>}
                    </label>
                  </th>
                  <td className="px-3 py-3">
                    {row.type === "image" ? (
                      <ImagePicker value={value} onChange={(v) => set(row.key, v)} />
                    ) : row.type === "textarea" ? (
                      <textarea
                        id={id}
                        rows={2}
                        className={clsx("input resize-y", over && "border-red-300 ring-2 ring-red-100")}
                        placeholder={row.placeholder}
                        value={value}
                        onChange={(e) => set(row.key, e.target.value)}
                      />
                    ) : (
                      <input
                        id={id}
                        className={clsx("input", over && "border-red-300 ring-2 ring-red-100")}
                        placeholder={row.placeholder}
                        value={value}
                        onChange={(e) => set(row.key, e.target.value)}
                      />
                    )}
                    {row.max && (
                      <p className={clsx("mt-1 text-right text-xs tabular-nums", over ? "font-semibold text-red-600" : "text-ink-soft")}>
                        {value.length}/{row.max}
                      </p>
                    )}
                  </td>
                  <td className="px-5 py-4 text-xs leading-relaxed text-ink-soft">{row.where}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
