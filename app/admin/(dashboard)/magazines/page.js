"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import {
  Plus, Pencil, Trash2, ExternalLink, FileText, Upload, Eye, EyeOff, AlertCircle, CalendarDays, Type,
} from "lucide-react";
import {
  adminGetMagazines,
  adminCreateMagazine,
  adminUpdateMagazine,
  adminDeleteMagazine,
  adminGetMagazineYears,
  adminCreateMagazineYear,
  adminUpdateMagazineYear,
  adminDeleteMagazineYear,
  adminGetMagazineSettings,
  adminUploadFile,
} from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import Modal from "@/components/admin/Modal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import MagazineSettings from "@/components/admin/MagazineSettings";
import { MONTH_NAMES } from "@/lib/magazineLibrary";

// Mirrors MAX_DOCUMENT_MB's default in app/api/admin/upload/route.js; the
// server is the one that enforces it.
const MAX_DOCUMENT_MB = 25;

const blankIssue = (year) => ({
  title: "Propulse",
  issueNumber: "",
  year,
  month: new Date().getMonth() + 1,
  coverImage: "",
  coverLayout: "portrait",
  pdfUrl: "",
  pdfFileName: "",
  summary: "",
  isPublished: false,
});

// Admin > Magazine. The magazine library is organised by year: add a year, then
// add magazines to it. Each year has a Recent Edition switch - on, that year is
// shown under Recent Editions; off, it is in the Archives, where visitors pick
// it from the year buttons. Nothing else needs arranging.
export default function MagazinesAdmin() {
  const [tab, setTab] = useState("years");
  const [years, setYears] = useState(null);
  const [items, setItems] = useState(null);
  const [settings, setSettings] = useState(null);
  const [error, setError] = useState("");

  const reload = () =>
    Promise.all([adminGetMagazineYears(), adminGetMagazines()]).then(([y, i]) => {
      setYears(y);
      setItems(i);
    });

  useEffect(() => {
    Promise.all([adminGetMagazineYears(), adminGetMagazines(), adminGetMagazineSettings()])
      .then(([y, i, s]) => {
        setYears(y);
        setItems(i);
        setSettings(s);
      })
      .catch((err) => setError(err.data?.error || "Could not load the magazine."));
  }, []);

  if (error) return <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>;
  if (!years || !items || !settings) return <PageSpinner />;

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Magazine</h1>
          <p className="mt-1 max-w-2xl text-sm text-ink-soft">
            Add a year, then add its magazines. Turn <strong>Recent Edition</strong> on for the year that should appear as the
            recent editions; every other year goes to the <strong>Archives</strong>, where visitors pick it from the year buttons.
          </p>
        </div>
        <Link href="/resources/magazine" target="_blank" className="btn-outline text-sm">
          <ExternalLink size={15} /> View on website
        </Link>
      </div>

      <div role="tablist" className="mt-6 inline-flex rounded-full bg-mist-100 p-1 ring-1 ring-brand-100">
        {[
          ["years", "Years & magazines", CalendarDays],
          ["wording", "Wording", Type],
        ].map(([key, label, Icon]) => (
          <button
            key={key}
            role="tab"
            aria-selected={tab === key}
            onClick={() => setTab(key)}
            className={clsx(
              "inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold transition-colors",
              tab === key ? "bg-brand-700 text-white shadow-soft" : "text-ink-soft hover:text-brand-700"
            )}
          >
            <Icon size={15} /> {label}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {tab === "years" ? (
          <YearsAndMagazines years={years} items={items} reload={reload} />
        ) : (
          <MagazineSettings settings={settings} onSaved={setSettings} items={items} years={years} />
        )}
      </div>
    </div>
  );
}

// ---- Years and their magazines ------------------------------------------------------

// An on/off switch with its state spelled out, so nobody has to guess.
function RecentSwitch({ on, onChange, year }) {
  return (
    <div className="flex items-center gap-2.5">
      <span id={`recent-${year}`} className="text-sm font-semibold text-ink">Recent Edition</span>
      <button
        type="button"
        role="switch"
        aria-checked={on}
        aria-labelledby={`recent-${year}`}
        onClick={() => onChange(!on)}
        title={on ? "On: this year is shown as the Recent Editions. Click to move it to the Archives." : "Off: this year is in the Archives. Click to show it as the Recent Editions."}
        className={clsx("relative h-6 w-11 shrink-0 rounded-full transition-colors focus-visible:outline-2 focus-visible:outline-offset-2", on ? "bg-accent-500" : "bg-mist-200 ring-1 ring-brand-200")}
      >
        <span className={clsx("absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all", on ? "left-[1.375rem]" : "left-0.5")} />
      </button>
      <span className={clsx("w-8 text-xs font-bold", on ? "text-accent-700" : "text-ink-soft")}>{on ? "ON" : "OFF"}</span>
    </div>
  );
}

function YearsAndMagazines({ years, items, reload }) {
  const [newYear, setNewYear] = useState("");
  const [newRecent, setNewRecent] = useState(null); // null = follow the suggestion
  const [yearError, setYearError] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState("");
  const [issueModal, setIssueModal] = useState(null); // { editing, form }

  const yearNumber = parseInt(newYear, 10);
  // A year newer than every year in the list is most likely the current one.
  const suggestRecent = Number.isFinite(yearNumber) && years.every((y) => yearNumber > y.year);
  const recentChecked = newRecent ?? suggestRecent;

  const fail = (err, fallback) => setNotice(err?.data?.error || fallback);

  const addYear = async (e) => {
    e.preventDefault();
    setYearError("");
    if (!/^\d{4}$/.test(newYear.trim())) return setYearError("Type a four-digit year, for example 2027.");
    setBusy(true);
    try {
      await adminCreateMagazineYear({ year: Number(newYear), isRecent: recentChecked });
      setNewYear("");
      setNewRecent(null);
      await reload();
    } catch (err) {
      setYearError(err.data?.error || "Could not add the year.");
    } finally {
      setBusy(false);
    }
  };

  const setRecent = async (y, isRecent) => {
    setNotice("");
    try {
      await adminUpdateMagazineYear(y.id, { isRecent });
      await reload();
    } catch (err) {
      fail(err, "Could not change the year.");
    }
  };

  const removeYear = async (y) => {
    if (!confirm(`Remove the year ${y.year}?`)) return;
    setNotice("");
    try {
      await adminDeleteMagazineYear(y.id);
      await reload();
    } catch (err) {
      fail(err, "Could not remove the year.");
    }
  };

  const togglePublished = async (m) => {
    setNotice("");
    try {
      await adminUpdateMagazine(m.id, { isPublished: !m.isPublished });
      await reload();
    } catch (err) {
      fail(err, "Could not change the status.");
    }
  };

  const removeIssue = async (m) => {
    if (!confirm(`Delete "${m.title} ${MONTH_NAMES[m.month - 1]} ${m.year}"? This can't be undone.`)) return;
    setNotice("");
    try {
      await adminDeleteMagazine(m.id);
      await reload();
    } catch (err) {
      fail(err, "Could not delete the magazine.");
    }
  };

  return (
    <div>
      {/* Add a year */}
      <form onSubmit={addYear} className="card p-5">
        <h2 className="font-display text-base font-bold text-ink">Add a year</h2>
        <div className="mt-3 flex flex-wrap items-end gap-4">
          <div>
            <label className="label" htmlFor="new-year">Year</label>
            <input
              id="new-year"
              inputMode="numeric"
              maxLength={4}
              placeholder="e.g. 2027"
              className="input w-32"
              value={newYear}
              onChange={(e) => {
                setNewYear(e.target.value.replace(/\D/g, ""));
                setYearError("");
              }}
            />
          </div>
          <div className="pb-1.5">
            <RecentSwitch on={recentChecked} onChange={setNewRecent} year="new" />
          </div>
          <button type="submit" disabled={busy || !newYear} className="btn-primary">
            <Plus size={16} /> Add year
          </button>
        </div>
        {yearError && <p role="alert" className="mt-3 flex items-center gap-2 text-sm text-red-700"><AlertCircle size={15} /> {yearError}</p>}
      </form>

      {notice && <p role="alert" className="mt-4 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{notice}</p>}

      {years.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-dashed border-brand-200 bg-mist-50/60 px-6 py-12 text-center text-sm text-ink-soft">
          No years yet. Add a year above, then add its magazines.
        </p>
      ) : (
        <div className="mt-6 space-y-5">
          {years.map((y) => {
            const inYear = items.filter((m) => m.year === y.year).sort((a, b) => b.month - a.month);
            return (
              <section key={y.id} className="card overflow-hidden" aria-label={`${y.year}`}>
                <header className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 bg-mist-50/70 px-5 py-4">
                  <div>
                    <div className="flex items-center gap-3">
                      <h2 className="font-display text-2xl font-extrabold text-brand-700">{y.year}</h2>
                      <span className="text-sm text-ink-soft">
                        {inYear.length} {inYear.length === 1 ? "magazine" : "magazines"}
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-ink-soft">
                      {y.isRecent ? "Shown as the Recent Editions on the website." : `In the Archives - visitors pick ${y.year} from the year buttons.`}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-4">
                    <RecentSwitch on={y.isRecent} onChange={(v) => setRecent(y, v)} year={y.year} />
                    <button type="button" onClick={() => setIssueModal({ editing: null, form: blankIssue(y.year) })} className="btn-primary text-sm">
                      <Plus size={15} /> Add magazine to {y.year}
                    </button>
                    <button
                      type="button"
                      onClick={() => removeYear(y)}
                      disabled={inYear.length > 0}
                      aria-label={`Remove ${y.year}`}
                      title={inYear.length > 0 ? "Only an empty year can be removed" : "Remove this year"}
                      className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-soft"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </header>

                {inYear.length === 0 ? (
                  <p className="px-5 py-8 text-center text-sm text-ink-soft">No magazines in {y.year} yet. Use &ldquo;Add magazine to {y.year}&rdquo; to add the first.</p>
                ) : (
                  <ul className="divide-y divide-brand-50">
                    {inYear.map((m) => (
                      <li key={m.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                        <div className="h-12 w-16 shrink-0 overflow-hidden rounded-md bg-mist-100 ring-1 ring-brand-100">
                          {m.coverImage && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={m.coverImage} alt="" loading="lazy" className="h-full w-full object-cover object-top" />
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-medium text-ink">{MONTH_NAMES[m.month - 1]} {m.year}</p>
                          <p className="truncate text-xs text-ink-soft">{m.title}{m.issueNumber ? ` · ${m.issueNumber}` : ""}</p>
                        </div>
                        {m.pdfUrl ? (
                          <a href={m.pdfUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs font-medium text-brand-700 hover:underline">
                            <FileText size={13} /> PDF
                          </a>
                        ) : (
                          <span className="text-xs text-ink-soft">No PDF</span>
                        )}
                        <button
                          onClick={() => togglePublished(m)}
                          title={m.isPublished ? "Click to unpublish" : "Click to publish"}
                          className={clsx("badge transition hover:opacity-80", m.isPublished ? "bg-accent-50 text-accent-700" : "bg-mist-100 text-ink-soft")}
                        >
                          {m.isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
                          {m.isPublished ? "Published" : "Draft"}
                        </button>
                        <div className="flex gap-1">
                          <button
                            onClick={() =>
                              setIssueModal({
                                editing: m,
                                form: { ...m, issueNumber: m.issueNumber || "", pdfFileName: m.pdfFileName || "", summary: m.summary || "", coverImage: m.coverImage || "", pdfUrl: m.pdfUrl || "" },
                              })
                            }
                            aria-label={`Edit ${MONTH_NAMES[m.month - 1]} ${m.year}`}
                            className="rounded-lg p-2 text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                          >
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => removeIssue(m)} aria-label={`Delete ${MONTH_NAMES[m.month - 1]} ${m.year}`} className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </section>
            );
          })}
        </div>
      )}

      {issueModal && (
        <IssueModal
          key={issueModal.editing?.id || `new-${issueModal.form.year}`}
          editing={issueModal.editing}
          initial={issueModal.form}
          years={years}
          onClose={() => setIssueModal(null)}
          onSaved={async () => {
            setIssueModal(null);
            await reload();
          }}
        />
      )}
    </div>
  );
}

// ---- Add / edit a magazine -------------------------------------------------------------

function IssueModal({ editing, initial, years, onClose, onSaved }) {
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);
  const [uploadingPdf, setUploadingPdf] = useState(false);
  const [error, setError] = useState("");
  const pdfInput = useRef(null);
  const set = (patch) => setForm((f) => ({ ...f, ...patch }));

  const onPickPdf = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (file.type !== "application/pdf" && !/\.pdf$/i.test(file.name)) return setError("Choose a PDF file.");
    if (file.size > MAX_DOCUMENT_MB * 1024 * 1024) {
      return setError(`The PDF is larger than the ${MAX_DOCUMENT_MB}MB limit. Upload it elsewhere and paste its link below.`);
    }
    setUploadingPdf(true);
    setError("");
    try {
      const { url } = await adminUploadFile(file);
      set({ pdfUrl: url, pdfFileName: file.name });
    } catch (err) {
      setError(err.data?.error || err.message || "Upload failed.");
    } finally {
      setUploadingPdf(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (form.isPublished && !form.coverImage) return setError("Add a cover image before publishing.");
    setSaving(true);
    setError("");
    const payload = {
      title: form.title,
      issueNumber: form.issueNumber,
      year: Number(form.year),
      month: Number(form.month),
      coverImage: form.coverImage,
      coverLayout: form.coverLayout,
      pdfUrl: form.pdfUrl,
      pdfFileName: form.pdfFileName,
      summary: form.summary,
      isPublished: form.isPublished,
    };
    try {
      if (editing) await adminUpdateMagazine(editing.id, payload);
      else await adminCreateMagazine(payload);
      await onSaved();
    } catch (err) {
      setError(err.data?.error || err.message || "Could not save the magazine.");
      setSaving(false);
    }
  };

  return (
    <Modal
      open
      onClose={onClose}
      title={editing ? "Edit magazine" : `Add magazine to ${form.year}`}
      footer={
        <div className="flex justify-end gap-2">
          <button type="button" onClick={onClose} className="btn-outline">Cancel</button>
          <button type="submit" form="magazine-form" disabled={saving || uploadingPdf} className="btn-primary">
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      }
    >
      <form id="magazine-form" onSubmit={onSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="mag-year">Year</label>
            <select id="mag-year" className="input" value={form.year} onChange={(e) => set({ year: Number(e.target.value) })}>
              {years.map((y) => <option key={y.id} value={y.year}>{y.year}</option>)}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="mag-month">Month</label>
            <select id="mag-month" className="input" value={form.month} onChange={(e) => set({ month: Number(e.target.value) })}>
              {MONTH_NAMES.map((name, i) => <option key={name} value={i + 1}>{name}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="mag-title">Magazine name</label>
            <input id="mag-title" required maxLength={120} className="input" value={form.title} onChange={(e) => set({ title: e.target.value })} />
          </div>
          <div>
            <label className="label" htmlFor="mag-issue">Issue number (optional)</label>
            <input id="mag-issue" maxLength={40} className="input" value={form.issueNumber} onChange={(e) => set({ issueNumber: e.target.value })} placeholder="e.g. Issue 36" />
          </div>
        </div>

        <div>
          <label className="label">Cover image</label>
          <ImagePicker value={form.coverImage} onChange={(url) => set({ coverImage: url })} label="Cover image" />
          <p className="mt-1 text-xs text-ink-soft">JPG, PNG or WebP, up to 5MB.</p>
          <fieldset className="mt-2 space-y-1.5 text-sm text-ink-soft">
            <legend className="sr-only">Cover shape</legend>
            {[
              ["portrait", "A whole cover (portrait) - shown as it is."],
              ["crop", "A landscape crop of the cover's top half - shown above a printed cover band."],
            ].map(([value, text]) => (
              <label key={value} className="flex items-start gap-2">
                <input type="radio" name="cover-layout" className="mt-1" checked={form.coverLayout === value} onChange={() => set({ coverLayout: value })} />
                <span>{text}</span>
              </label>
            ))}
          </fieldset>
        </div>

        <div>
          <label className="label">Magazine PDF</label>
          {form.pdfUrl ? (
            <div className="flex items-center gap-3 rounded-xl bg-mist-50 p-3">
              <FileText size={18} className="shrink-0 text-red-600" />
              <span className="min-w-0 flex-1 truncate text-sm text-ink" title={form.pdfFileName || form.pdfUrl}>
                {form.pdfFileName || form.pdfUrl.split("/").pop()}
              </span>
              <button type="button" onClick={() => set({ pdfUrl: "", pdfFileName: "" })} aria-label="Remove the PDF" className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600">
                <Trash2 size={15} />
              </button>
            </div>
          ) : (
            <p className="text-sm text-ink-soft">No PDF. The magazine shows without a Read now button.</p>
          )}
          <input ref={pdfInput} type="file" accept="application/pdf,.pdf" className="hidden" onChange={onPickPdf} />
          <button type="button" onClick={() => pdfInput.current?.click()} disabled={uploadingPdf} className="btn-outline mt-2 text-sm">
            <Upload size={14} /> {uploadingPdf ? "Uploading..." : form.pdfUrl ? "Replace PDF" : "Upload PDF"}
          </button>
          <p className="mt-1 text-xs text-ink-soft">PDF only, up to {MAX_DOCUMENT_MB}MB. Or paste the address of a PDF stored elsewhere:</p>
          <input
            className="input mt-1.5"
            inputMode="url"
            placeholder="https://..."
            value={/^https:\/\//i.test(form.pdfUrl) && !form.pdfFileName ? form.pdfUrl : ""}
            onChange={(e) => set({ pdfUrl: e.target.value, pdfFileName: "" })}
            aria-label="PDF link"
          />
        </div>

        <div>
          <label className="label" htmlFor="mag-summary">Summary (optional)</label>
          <textarea id="mag-summary" rows={3} maxLength={600} className="input" value={form.summary} onChange={(e) => set({ summary: e.target.value })} placeholder="A line or two about this issue, shown beside the latest edition." />
        </div>

        <label className="flex items-start gap-3">
          <input type="checkbox" className="mt-1" checked={form.isPublished} onChange={(e) => set({ isPublished: e.target.checked })} />
          <span>
            <span className="block text-sm font-semibold text-ink">Published</span>
            <span className="block text-sm text-ink-soft">A draft is not shown on the website at all.</span>
          </span>
        </label>

        {error && (
          <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
            <AlertCircle size={16} className="shrink-0" /> {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
