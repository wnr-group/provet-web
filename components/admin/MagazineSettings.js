"use client";

import { useMemo, useState } from "react";
import clsx from "clsx";
import { AlertCircle, Archive, ArrowRight, BookOpen, CheckCircle2, Download, RotateCcw, Save } from "lucide-react";
import { adminUpdateMagazineSettings } from "@/components/admin/adminApi";
import { DEFAULT_MAGAZINE_SETTINGS, organise } from "@/lib/magazineLibrary";

// Admin > Magazine > Wording: what the Magazine page says. A miniature of the
// page sits beside the fields and shows every change as it is typed. Click a
// piece of the preview to jump to the field behind it; focus a field to see where
// it appears. A field always shows the text the visitor sees, and has a Reset
// button once it differs from the standard wording.
//
// Which years are Recent Editions and which are Archive years is not set here:
// that is the Recent Edition switch on each year (Years & magazines).

const WORDING = [
  {
    title: "The two tabs",
    fields: [
      ["recentTabLabel", "First tab", 30],
      ["archivesTabLabel", "Second tab", 30],
    ],
  },
  {
    title: "The latest edition",
    fields: [
      ["latestLabel", "Small tag above the month", 40],
      ["readLabel", "Button that opens the PDF", 30],
      ["downloadLabel", "Button that downloads the PDF", 30],
    ],
  },
  {
    title: "Getting to the Archives",
    fields: [["otherMagazinesLabel", "Pink button under the latest edition", 40]],
  },
  {
    title: "Inside the Archives",
    fields: [
      ["archivesHeading", "Heading", 80],
      ["archivesIntro", "Sentence under the heading", 300, "textarea"],
    ],
  },
];
const WORD_KEYS = WORDING.flatMap((g) => g.fields.map(([key]) => key));

const issueName = (i) => (i ? `${i.month} ${i.year}` : "October 2026");

export default function MagazineSettings({ settings, items, years, onSaved }) {
  const [form, setForm] = useState(settings);
  const [active, setActive] = useState(null); // the field being edited, lit up in the preview
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const set = (patch) => {
    setForm((f) => ({ ...f, ...patch }));
    setSaved(false);
    setError("");
  };

  // The library as visitors will see it: the years switched on as Recent Edition
  // are the Recent Editions, every other year is in the Archives.
  const { recent, years: archiveYears } = useMemo(() => {
    const published = items.filter((m) => m.isPublished).map((m) => ({ id: m.id, title: m.title, publishedAt: m.publishedAt }));
    return organise(published, { recentYears: years.filter((y) => y.isRecent).map((y) => y.year) });
  }, [items, years]);
  const archiveYearList = archiveYears.map((y) => y.year);

  const focusField = (id) => {
    const el = document.getElementById(id);
    el?.scrollIntoView({ block: "center", behavior: "smooth" });
    el?.focus({ preventScroll: true });
  };

  const onSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      // Wording still equal to the standard text is saved as blank, so it keeps
      // following the standard wording instead of freezing a copy of it.
      const payload = { ...form };
      for (const key of WORD_KEYS) if (payload[key] === DEFAULT_MAGAZINE_SETTINGS[key]) payload[key] = "";
      const next = await adminUpdateMagazineSettings(payload);
      onSaved(next);
      setForm(next);
      setSaved(true);
    } catch (err) {
      setError(err.data?.error || "Could not save the wording.");
    } finally {
      setSaving(false);
    }
  };

  const customised = WORD_KEYS.some((k) => form[k] !== DEFAULT_MAGAZINE_SETTINGS[k]);

  return (
    <form onSubmit={onSave} className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_23rem]">
      <div className="space-y-5">
        <section className="card p-5">
          <h2 className="font-display text-base font-bold text-ink">What does the page say?</h2>
          <p className="mt-1 text-sm text-ink-soft">
            Change any wording. The preview shows it as you type; use <RotateCcw size={12} className="inline align-[-1px]" /> to go back to the standard text.
          </p>
          <div className="mt-4 space-y-5">
            {WORDING.map((group) => (
              <fieldset key={group.title}>
                <legend className="text-xs font-semibold uppercase tracking-[0.14em] text-brand-700">{group.title}</legend>
                <div className="mt-2 grid gap-3 sm:grid-cols-2">
                  {group.fields.map(([key, text, max, kind]) => {
                    const changed = form[key] !== DEFAULT_MAGAZINE_SETTINGS[key];
                    const Field = kind === "textarea" ? "textarea" : "input";
                    return (
                      <div key={key} className={clsx(kind === "textarea" && "sm:col-span-2")}>
                        <div className="flex items-center justify-between gap-2">
                          <label className="label !mb-1" htmlFor={`m-${key}`}>{text}</label>
                          {changed && (
                            <button
                              type="button"
                              onClick={() => set({ [key]: DEFAULT_MAGAZINE_SETTINGS[key] })}
                              className="mb-1 inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline"
                              title={`Standard wording: ${DEFAULT_MAGAZINE_SETTINGS[key]}`}
                            >
                              <RotateCcw size={11} /> Reset
                            </button>
                          )}
                        </div>
                        <Field
                          id={`m-${key}`}
                          maxLength={max}
                          {...(kind === "textarea" ? { rows: 2 } : {})}
                          className={clsx("input", active === key && "!border-accent-400 ring-2 ring-accent-100")}
                          value={form[key] ?? ""}
                          onFocus={() => setActive(key)}
                          onBlur={() => setActive((a) => (a === key ? null : a))}
                          onChange={(e) => set({ [key]: e.target.value })}
                        />
                      </div>
                    );
                  })}
                </div>
              </fieldset>
            ))}
          </div>
          {customised && (
            <button type="button" onClick={() => set(Object.fromEntries(WORD_KEYS.map((k) => [k, DEFAULT_MAGAZINE_SETTINGS[k]])))} className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-brand-700 hover:underline">
              <RotateCcw size={13} /> Reset all wording to the standard text
            </button>
          )}
        </section>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </p>
        )}
        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="btn-primary">
            {saved ? <CheckCircle2 size={16} /> : <Save size={16} />} {saving ? "Saving..." : saved ? "Saved" : "Save wording"}
          </button>
          {saved && <span className="text-sm text-ink-soft">Live on the website now.</span>}
        </div>
      </div>

      {/* The page in miniature */}
      <aside aria-label="Preview of the Magazine page" className="lg:sticky lg:top-6">
        <div className="card overflow-hidden">
          <p className="border-b border-brand-100 bg-mist-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-ink-soft">How it looks &middot; click anything to edit it</p>
          <div className="space-y-5 p-4">
            <div className="flex justify-center">
              <div className="inline-flex rounded-full bg-mist-100 p-1 ring-1 ring-brand-100">
                <Spot k="recentTabLabel" active={active} onPick={focusField} className="inline-flex items-center gap-1.5 rounded-full bg-brand-700 px-3 py-1.5 text-xs font-semibold text-white">
                  <BookOpen size={12} /> {form.recentTabLabel || DEFAULT_MAGAZINE_SETTINGS.recentTabLabel}
                </Spot>
                <Spot k="archivesTabLabel" active={active} onPick={focusField} className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold text-ink-soft">
                  <Archive size={12} /> {form.archivesTabLabel || DEFAULT_MAGAZINE_SETTINGS.archivesTabLabel}
                </Spot>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="aspect-[3/4] w-20 shrink-0 rounded-[2px_6px_6px_2px] bg-gradient-to-b from-brand-100 to-brand-700 shadow-card" aria-hidden="true" />
              <div className="min-w-0 space-y-1.5">
                <Spot k="latestLabel" active={active} onPick={focusField} className="inline-flex items-center gap-1 text-[10px] font-semibold uppercase tracking-[0.16em] text-accent-600">
                  <BookOpen size={10} /> {form.latestLabel || DEFAULT_MAGAZINE_SETTINGS.latestLabel}
                </Spot>
                <p className="font-display text-xl font-extrabold leading-none text-ink">{issueName(recent[0])}</p>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <Spot k="readLabel" active={active} onPick={focusField} className="inline-flex items-center gap-1 rounded-full bg-brand-600 px-2.5 py-1 text-[11px] font-semibold text-white">
                    {form.readLabel || DEFAULT_MAGAZINE_SETTINGS.readLabel} <ArrowRight size={10} />
                  </Spot>
                  <Spot k="downloadLabel" active={active} onPick={focusField} className="inline-flex items-center gap-1 rounded-full border border-brand-200 px-2.5 py-1 text-[11px] font-semibold text-brand-700">
                    <Download size={10} /> {form.downloadLabel || DEFAULT_MAGAZINE_SETTINGS.downloadLabel}
                  </Spot>
                </div>
                <Spot k="otherMagazinesLabel" active={active} onPick={focusField} className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-3 py-1 text-[11px] font-semibold text-white ring-2 ring-accent-100">
                  <Archive size={10} /> {form.otherMagazinesLabel || DEFAULT_MAGAZINE_SETTINGS.otherMagazinesLabel} <ArrowRight size={10} />
                </Spot>
              </div>
            </div>

            <div className="border-t border-dashed border-brand-200 pt-4">
              <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-soft">After clicking the pink button</p>
              <div className="text-center">
                <Spot k="archivesHeading" active={active} onPick={focusField} className="block w-full font-display text-lg font-extrabold text-ink">
                  {form.archivesHeading || DEFAULT_MAGAZINE_SETTINGS.archivesHeading}
                </Spot>
                <Spot k="archivesIntro" active={active} onPick={focusField} className="mt-1 block w-full text-[11px] leading-snug text-ink-soft">
                  {form.archivesIntro || DEFAULT_MAGAZINE_SETTINGS.archivesIntro}
                </Spot>
              </div>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                {(archiveYearList.length ? archiveYearList.slice(0, 5) : [2025, 2024]).map((y, i) => (
                  <span key={y} className={clsx("rounded-full border px-3 py-1 text-[11px] font-semibold", i === 0 ? "border-brand-700 bg-brand-700 text-white" : "border-brand-200 text-brand-700")}>
                    {y}
                  </span>
                ))}
              </div>
              <p className="mt-2 text-center text-[10px] text-ink-soft">One button for each Archive year. The newest opens first.</p>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}

// A piece of the preview: clicking it goes to the field that controls it, and it
// lights up while that field is being edited.
function Spot({ k, active, onPick, className, children }) {
  return (
    <button
      type="button"
      onClick={() => onPick(`m-${k}`)}
      title="Click to edit this wording"
      className={clsx(className, "cursor-pointer text-left transition hover:ring-2 hover:ring-accent-300", active === k && "ring-2 ring-accent-400")}
    >
      {children}
    </button>
  );
}
