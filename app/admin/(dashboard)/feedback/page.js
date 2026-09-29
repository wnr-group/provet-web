"use client";

import { useCallback, useEffect, useState } from "react";
import { MessageSquare, Save, Trash2, ChevronDown, ChevronUp, Plus, Pencil, Reply, AlertCircle, Eye, Mail } from "lucide-react";
import clsx from "clsx";
import {
  adminGetFeedbacks,
  adminDeleteFeedback,
  adminGetFeedbackConfig,
  adminUpdateFeedbackConfig,
  adminGetFeedbackFields,
  adminCreateFeedbackField,
  adminUpdateFeedbackField,
  adminDeleteFeedbackField,
  adminReorderFeedbackFields,
} from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Pagination from "@/components/ui/Pagination";
import Modal from "@/components/admin/Modal";

const TABS = [
  { key: "submissions", label: "Submissions" },
  { key: "settings", label: "Form Settings" },
];

const LIMIT = 10;

// Both halves of the feature live on one screen rather than two nav entries:
// the submissions list and the form that produced them are read together
// often enough that splitting them just adds a click.
export default function FeedbackAdmin() {
  const [tab, setTab] = useState("submissions");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-ink">Feedback</h1>
      <p className="mt-1 text-sm text-ink-soft">
        Feedback submitted from the website, and the fields that make up the public form.
      </p>

      <div className="mt-5 flex gap-2">
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-medium transition",
              tab === t.key ? "bg-brand-600 text-white" : "bg-white text-ink-soft hover:bg-brand-50"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="mt-5">{tab === "submissions" ? <Submissions /> : <FormSettings />}</div>
    </div>
  );
}

// ---- Submissions -----------------------------------------------------------
//
// A table - name, email, message, when it was sent, and actions (view, reply
// by email, delete). Clicking the sender's profile (or anywhere on the row,
// or the view action) opens the submission in a popup: the full message and
// the answers to the form's extra fields. On narrow screens the table scrolls
// sideways rather than squeezing its columns.

function formatAnswer(value) {
  if (Array.isArray(value)) return value.join(", ");
  return String(value);
}

const fullDate = (iso) =>
  new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" });

// "3 days ago", "just now" - the list is scanned by recency.
const RELATIVE = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });
const STEPS = [
  ["year", 365 * 24 * 3600],
  ["month", 30 * 24 * 3600],
  ["week", 7 * 24 * 3600],
  ["day", 24 * 3600],
  ["hour", 3600],
  ["minute", 60],
];
function relativeDate(iso) {
  const seconds = (new Date(iso).getTime() - Date.now()) / 1000;
  for (const [unit, size] of STEPS) {
    if (Math.abs(seconds) >= size) return RELATIVE.format(Math.round(seconds / size), unit);
  }
  return "just now";
}

const initials = (name) =>
  (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

function Submissions() {
  const [page, setPage] = useState(1);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewing, setViewing] = useState(null); // the submission in the popup
  const [error, setError] = useState("");

  const load = useCallback(
    () =>
      adminGetFeedbacks({ page, limit: LIMIT })
        .then(setResult)
        .catch((err) => setError(err.message || "Could not load feedback.")),
    [page]
  );

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: flip the loading flag immediately when the page changes, before the fetch resolves.
    setLoading(true);
    load().finally(() => setLoading(false));
  }, [load]);

  const onDelete = async (feedback) => {
    const who = feedback.name || feedback.email || "this anonymous feedback";
    if (!confirm(`Delete feedback from ${who}? This can't be undone.`)) return;
    try {
      await adminDeleteFeedback(feedback.id);
      if (viewing?.id === feedback.id) setViewing(null);
      // Stepping back a page avoids landing on an empty last page after
      // deleting its only row.
      if (result.items.length === 1 && page > 1) setPage((p) => p - 1);
      else load();
    } catch (err) {
      setError(err.message || "Could not delete that feedback.");
    }
  };

  if (!result) {
    return error ? <ErrorNote>{error}</ErrorNote> : <PageSpinner />;
  }

  if (result.items.length === 0) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No feedback yet"
        description="Feedback submitted through the website form will appear here."
      />
    );
  }

  const totalPages = Math.max(1, Math.ceil(result.total / LIMIT));

  return (
    <div className={clsx("transition-opacity duration-200", loading && "opacity-50")}>
      {error && <ErrorNote className="mb-4">{error}</ErrorNote>}

      <div className="mb-3 flex items-baseline justify-between gap-3 px-1">
        <p className="text-sm font-medium text-ink">
          {result.total} {result.total === 1 ? "submission" : "submissions"}
        </p>
        {totalPages > 1 && (
          <p className="text-xs text-ink-soft">
            Page {page} of {totalPages}
          </p>
        )}
      </div>

      {/* Phones: a list of cards - the sender, the start of the message and
          when it came in - each opening the same popup (which carries reply
          and delete), rather than a table scrolled sideways. */}
      <ul className="divide-y divide-brand-100 overflow-hidden rounded-2xl border border-brand-100 bg-white sm:hidden">
        {result.items.map((item) => (
          <li key={item.id}>
            <button
              type="button"
              onClick={() => setViewing(item)}
              aria-label={`Open feedback from ${item.name || "Anonymous"}`}
              className="flex w-full gap-3 p-4 text-left transition-colors active:bg-mist-50"
            >
              <Avatar name={item.name} />
              <span className="min-w-0 flex-1">
                <span className="flex items-baseline justify-between gap-2">
                  <span className="truncate font-medium text-ink">{item.name || "Anonymous"}</span>
                  <time dateTime={item.createdAt} className="shrink-0 text-xs text-ink-soft">
                    {relativeDate(item.createdAt)}
                  </time>
                </span>
                {item.email && <span className="block truncate text-xs text-ink-soft">{item.email}</span>}
                <span className="mt-1.5 line-clamp-2 block text-sm text-ink-soft">{item.message}</span>
                {item.answers.length > 0 && (
                  <span className="mt-1 block text-xs text-ink-soft/80">
                    + {item.answers.length} {item.answers.length === 1 ? "answer" : "answers"}
                  </span>
                )}
              </span>
            </button>
          </li>
        ))}
      </ul>

      {/* The same table treatment as Admin > Products. A row opens its
          submission in a popup. */}
      <div className="overflow-x-auto rounded-2xl border border-brand-100 bg-white max-sm:hidden">
        <table className="w-full min-w-[46rem] text-sm">
          <thead className="border-b border-brand-100 bg-mist-50/60 text-left text-xs uppercase tracking-wide text-ink-soft">
            <tr>
              <th className="px-4 py-3 font-semibold">Name</th>
              <th className="px-4 py-3 font-semibold">Email</th>
              <th className="px-4 py-3 font-semibold">Message</th>
              <th className="px-4 py-3 font-semibold">Submitted</th>
              <th className="px-4 py-3 text-right font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-brand-100">
            {result.items.map((item) => {
              const open = () => setViewing(item);
              return (
                <tr
                  key={item.id}
                  onClick={open}
                  className={clsx(
                    "cursor-pointer align-middle transition-colors",
                    viewing?.id === item.id ? "bg-brand-50/50" : "hover:bg-mist-50/70"
                  )}
                >
                  <td className="px-4 py-3">
                    {/* The profile: a real button, so the popup opens from the
                        keyboard too. */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        open();
                      }}
                      className="group/profile -m-1 flex items-center gap-3 rounded-xl p-1 text-left focus-visible:outline-2 focus-visible:outline-brand-500"
                      aria-label={`Open feedback from ${item.name || "Anonymous"}`}
                    >
                      <Avatar name={item.name} />
                      <span className="font-medium text-ink group-hover/profile:text-brand-700 group-hover/profile:underline">
                        {item.name || "Anonymous"}
                      </span>
                    </button>
                  </td>
                  <td className="px-4 py-3">
                    {item.email ? (
                      <a
                        href={`mailto:${item.email}`}
                        onClick={(e) => e.stopPropagation()}
                        className="text-ink-soft hover:text-brand-700 hover:underline"
                      >
                        {item.email}
                      </a>
                    ) : (
                      <span className="text-ink-soft/60">-</span>
                    )}
                  </td>
                  <td className="max-w-[22rem] px-4 py-3">
                    <p className="truncate text-ink-soft">{item.message}</p>
                    {item.answers.length > 0 && (
                      <p className="mt-0.5 text-xs text-ink-soft/80">
                        + {item.answers.length} {item.answers.length === 1 ? "answer" : "answers"}
                      </p>
                    )}
                  </td>
                  <td className="whitespace-nowrap px-4 py-3 text-ink-soft">
                    <time dateTime={item.createdAt} title={fullDate(item.createdAt)}>
                      {relativeDate(item.createdAt)}
                    </time>
                  </td>
                  <td className="px-4 py-3" onClick={(e) => e.stopPropagation()}>
                    <div className="flex justify-end gap-0.5">
                      <RowAction label="View feedback" onClick={open}>
                        <Eye size={16} />
                      </RowAction>
                      {item.email && (
                        <RowAction label="Reply by email" href={`mailto:${item.email}`}>
                          <Reply size={16} />
                        </RowAction>
                      )}
                      <RowAction label="Delete" onClick={() => onDelete(item)} danger>
                        <Trash2 size={15} />
                      </RowAction>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <Pagination page={page} totalPages={totalPages} onChange={setPage} />

      <Modal open={Boolean(viewing)} onClose={() => setViewing(null)} title="Feedback">
        {viewing && <SubmissionDetail item={viewing} onDelete={() => onDelete(viewing)} />}
      </Modal>
    </div>
  );
}

// The popup: who sent it, the full message, the answers to the form's extra
// fields, and replying or deleting without going back to the table.
function SubmissionDetail({ item, onDelete }) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <Avatar name={item.name} />
        <div className="min-w-0">
          <p className="truncate font-semibold text-ink">{item.name || "Anonymous"}</p>
          {item.email && <p className="truncate text-sm text-ink-soft">{item.email}</p>}
        </div>
      </div>

      <blockquote className="mt-5 max-h-[45vh] overflow-y-auto whitespace-pre-line rounded-xl border-l-4 border-brand-200 bg-mist-50/60 px-5 py-4 leading-relaxed text-ink">
        {item.message}
      </blockquote>

      {item.answers.length > 0 && (
        <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
          {item.answers.map((answer) => (
            <div key={answer.key}>
              {/* The label is the one stored with the answer, so this still
                  reads correctly after the field was renamed or deleted. */}
              <dt className="text-xs text-ink-soft">{answer.label || answer.key}</dt>
              <dd className="mt-0.5 text-sm font-medium text-ink">{formatAnswer(answer.value)}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-4 text-xs text-ink-soft">
        Submitted <time dateTime={item.createdAt}>{fullDate(item.createdAt)}</time>
      </p>

      <div className="mt-5 flex flex-wrap gap-2 border-t border-brand-100 pt-4">
        {item.email && (
          <a href={`mailto:${item.email}`} className="btn-primary">
            <Mail size={16} /> Reply by email
          </a>
        )}
        <button type="button" onClick={onDelete} className="btn-ghost text-red-600 hover:bg-red-50">
          <Trash2 size={15} /> Delete
        </button>
      </div>
    </div>
  );
}

// A quiet icon action with a small tooltip; a link when given `href`.
function RowAction({ label, onClick, href, danger = false, children }) {
  const className = clsx(
    "flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft transition-colors",
    danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-brand-50 hover:text-brand-700"
  );
  return (
    <span className="group/tip relative inline-flex">
      {href ? (
        <a href={href} aria-label={label} className={className}>
          {children}
        </a>
      ) : (
        <button type="button" onClick={onClick} aria-label={label} className={className}>
          {children}
        </button>
      )}
      <span
        role="tooltip"
        className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium normal-case tracking-normal text-white opacity-0 transition-opacity group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
      >
        {label}
      </span>
    </span>
  );
}

// The sender's initials on a tinted square; "?" for anonymous feedback.
function Avatar({ name }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "flex shrink-0 items-center justify-center rounded-xl font-display font-bold",
        "h-9 w-9 text-xs",
        name ? "bg-brand-50 text-brand-700" : "bg-mist-100 text-ink-soft"
      )}
    >
      {initials(name)}
    </span>
  );
}

function ErrorNote({ children, className }) {
  return (
    <p role="alert" className={clsx("flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700", className)}>
      <AlertCircle size={16} className="shrink-0" /> {children}
    </p>
  );
}

// ---- Form settings + field builder ----------------------------------------

function FormSettings() {
  const [config, setConfig] = useState(null);
  const [fields, setFields] = useState(null);
  const [types, setTypes] = useState([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(null); // a field object, or the string "new"

  const loadFields = useCallback(
    () =>
      adminGetFeedbackFields().then((res) => {
        setFields(res.fields);
        setTypes(res.types);
      }),
    []
  );

  useEffect(() => {
    Promise.all([adminGetFeedbackConfig().then(setConfig), loadFields()]).catch((err) =>
      setError(err.message || "Could not load the form settings.")
    );
  }, [loadFields]);

  const updateConfig = (field, value) => {
    setConfig((c) => ({ ...c, [field]: value }));
    setSaved(false);
    setError("");
  };

  const onSaveConfig = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      setConfig(await adminUpdateFeedbackConfig(config));
      setSaved(true);
    } catch (err) {
      setError(err.message || "Could not save the form settings.");
    } finally {
      setSaving(false);
    }
  };

  // Shown/Required are single clicks, so they save immediately - a separate
  // Save button just for them would be easy to miss.
  const toggleField = async (field, key, value) => {
    setError("");
    try {
      await adminUpdateFeedbackField(field.id, { ...field, [key]: value });
      await loadFields();
    } catch (err) {
      setError(err.message || "Could not update that field.");
      loadFields();
    }
  };

  const move = async (index, delta) => {
    const next = index + delta;
    if (next < 0 || next >= fields.length) return;
    const reordered = fields.slice();
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    setFields(reordered); // optimistic: the arrows should feel instant
    setError("");
    try {
      const res = await adminReorderFeedbackFields(reordered.map((f) => f.id));
      setFields(res.fields);
    } catch (err) {
      setError(err.message || "Could not reorder the fields.");
      loadFields();
    }
  };

  const onDeleteField = async (field) => {
    if (!confirm(`Delete the "${field.label}" field? Answers already submitted are kept.`)) return;
    setError("");
    try {
      await adminDeleteFeedbackField(field.id);
      await loadFields();
    } catch (err) {
      setError(err.message || "Could not delete that field.");
    }
  };

  if (!config || !fields) return error ? <p className="text-sm text-red-600">{error}</p> : <PageSpinner />;

  const typeLabel = (key) => types.find((t) => t.key === key)?.label || key;

  return (
    <div className="max-w-3xl space-y-4">
      <form onSubmit={onSaveConfig} className="space-y-4">
        <div className="card p-5">
          <label className="flex items-start gap-3">
            <input
              type="checkbox"
              className="mt-1"
              checked={config.isEnabled}
              onChange={(e) => updateConfig("isEnabled", e.target.checked)}
            />
            <span>
              <span className="block text-sm font-semibold text-ink">Show the feedback form</span>
              <span className="block text-sm text-ink-soft">
                When off, the form is hidden on the website and submissions are rejected.
              </span>
            </span>
          </label>
        </div>

        <div className="card space-y-4 p-5">
          <div>
            <label className="label" htmlFor="feedback-title">
              Title
            </label>
            <input
              id="feedback-title"
              required
              maxLength={120}
              className="input"
              value={config.title}
              onChange={(e) => updateConfig("title", e.target.value)}
              placeholder="Share Your Feedback"
            />
          </div>
          <div>
            <label className="label" htmlFor="feedback-description">
              Description
            </label>
            <textarea
              id="feedback-description"
              rows={3}
              maxLength={500}
              className="input resize-none"
              value={config.description || ""}
              onChange={(e) => updateConfig("description", e.target.value)}
              placeholder="Shown under the title, above the form."
            />
          </div>
        </div>

        <button type="submit" disabled={saving} className="btn-primary">
          <Save size={16} /> {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
        </button>
      </form>

      <div className="card p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-ink">Form fields</p>
            <p className="mt-1 text-sm text-ink-soft">
              Add your own fields, reorder them, or turn the built-in ones off.
            </p>
          </div>
          <button type="button" onClick={() => setEditing("new")} className="btn-outline">
            <Plus size={16} /> Add Field
          </button>
        </div>

        <div className="mt-4 space-y-2">
          {fields.map((field, index) => (
            <div key={field.id} className="rounded-xl bg-mist-50/60 p-3">
              <div className="flex flex-wrap items-center gap-3">
                <div className="flex shrink-0 flex-col">
                  <button
                    type="button"
                    onClick={() => move(index, -1)}
                    disabled={index === 0}
                    className="rounded p-0.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
                    aria-label={`Move ${field.label} up`}
                  >
                    <ChevronUp size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => move(index, 1)}
                    disabled={index === fields.length - 1}
                    className="rounded p-0.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
                    aria-label={`Move ${field.label} down`}
                  >
                    <ChevronDown size={14} />
                  </button>
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-medium text-ink">{field.label}</span>
                    <span className="badge bg-mist-100 text-ink-soft">{typeLabel(field.type)}</span>
                    {field.isSystem && <span className="badge bg-brand-50 text-brand-700">Built-in</span>}
                  </div>
                  {field.options.length > 0 && (
                    <p className="mt-0.5 truncate text-xs text-ink-soft">{field.options.join(" · ")}</p>
                  )}
                </div>

                <div className="flex shrink-0 items-center gap-4">
                  <label
                    className={clsx(
                      "flex items-center gap-1.5 text-xs",
                      field.locked ? "cursor-not-allowed text-ink-soft/60" : "text-ink"
                    )}
                    title={field.locked ? "The feedback message is always shown" : undefined}
                  >
                    <input
                      type="checkbox"
                      disabled={field.locked}
                      checked={field.isEnabled}
                      onChange={(e) => toggleField(field, "isEnabled", e.target.checked)}
                    />
                    Shown
                  </label>
                  <label
                    className={clsx(
                      "flex items-center gap-1.5 text-xs",
                      field.locked || !field.isEnabled ? "cursor-not-allowed text-ink-soft/60" : "text-ink"
                    )}
                    title={field.locked ? "The feedback message is always required" : undefined}
                  >
                    <input
                      type="checkbox"
                      disabled={field.locked || !field.isEnabled}
                      checked={field.isRequired}
                      onChange={(e) => toggleField(field, "isRequired", e.target.checked)}
                    />
                    Required
                  </label>
                  <button
                    type="button"
                    onClick={() => setEditing(field)}
                    className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 hover:text-brand-700"
                    aria-label={`Edit ${field.label}`}
                  >
                    <Pencil size={14} />
                  </button>
                  <button
                    type="button"
                    onClick={() => onDeleteField(field)}
                    disabled={field.isSystem}
                    title={field.isSystem ? "Built-in fields can't be deleted" : undefined}
                    className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600 disabled:opacity-30"
                    aria-label={`Delete ${field.label}`}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <FieldModal
        editing={editing}
        types={types}
        onClose={() => setEditing(null)}
        onSaved={async () => {
          setEditing(null);
          await loadFields();
        }}
      />
    </div>
  );
}

const emptyField = {
  label: "",
  type: "text",
  placeholder: "",
  helpText: "",
  options: [],
  isRequired: false,
  isEnabled: true,
};

function FieldModal({ editing, types, onClose, onSaved }) {
  const isNew = editing === "new";
  const [form, setForm] = useState(emptyField);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!editing) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: seed the modal's form when it opens for a different field.
    setForm(
      isNew
        ? emptyField
        : {
            label: editing.label,
            type: editing.type,
            placeholder: editing.placeholder || "",
            helpText: editing.helpText || "",
            options: editing.options || [],
            isRequired: editing.isRequired,
            isEnabled: editing.isEnabled,
          }
    );
    setError("");
  }, [editing, isNew]);

  const isSystem = !isNew && Boolean(editing?.isSystem);
  const isLocked = !isNew && Boolean(editing?.locked);
  const needsOptions = Boolean(types.find((t) => t.key === form.type)?.hasOptions);

  const set = (key, value) => setForm((f) => ({ ...f, [key]: value }));
  const setOption = (index, value) =>
    setForm((f) => ({ ...f, options: f.options.map((o, i) => (i === index ? value : o)) }));
  const addOption = () => setForm((f) => ({ ...f, options: [...f.options, ""] }));
  const removeOption = (index) => setForm((f) => ({ ...f, options: f.options.filter((_, i) => i !== index) }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const payload = {
        label: form.label,
        placeholder: form.placeholder,
        helpText: form.helpText,
        isRequired: form.isRequired,
        isEnabled: form.isEnabled,
        // A built-in's type is fixed, so it isn't part of its payload.
        ...(isSystem ? {} : { type: form.type, options: needsOptions ? form.options : [] }),
      };
      if (isNew) await adminCreateFeedbackField(payload);
      else await adminUpdateFeedbackField(editing.id, payload);
      await onSaved();
    } catch (err) {
      setError(err.message || "Could not save that field.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal open={Boolean(editing)} onClose={onClose} title={isNew ? "Add Field" : `Edit "${editing?.label}"`}>
      <form onSubmit={onSubmit} className="space-y-4">
        <div>
          <label className="label">Label</label>
          <input
            required
            maxLength={80}
            className="input"
            value={form.label}
            onChange={(e) => set("label", e.target.value)}
            placeholder="Clinic name"
          />
        </div>

        <div>
          <label className="label">Type</label>
          <select className="input" disabled={isSystem} value={form.type} onChange={(e) => set("type", e.target.value)}>
            {types.map((t) => (
              <option key={t.key} value={t.key}>
                {t.label}
              </option>
            ))}
          </select>
          {isSystem && (
            <p className="mt-1.5 text-xs text-ink-soft">
              Built-in fields keep their type — they write to their own database column.
            </p>
          )}
        </div>

        {needsOptions && !isSystem && (
          <div>
            <label className="label">Options</label>
            <div className="space-y-2">
              {form.options.map((option, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    className="input"
                    value={option}
                    onChange={(e) => setOption(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                  />
                  <button
                    type="button"
                    onClick={() => removeOption(index)}
                    className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
                    aria-label={`Remove option ${index + 1}`}
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              ))}
            </div>
            <button type="button" onClick={addOption} className="btn-ghost mt-2 text-xs">
              <Plus size={14} /> Add option
            </button>
          </div>
        )}

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Placeholder</label>
            <input
              maxLength={120}
              className="input"
              value={form.placeholder}
              onChange={(e) => set("placeholder", e.target.value)}
            />
          </div>
          <div>
            <label className="label">Help text</label>
            <input
              maxLength={200}
              className="input"
              value={form.helpText}
              onChange={(e) => set("helpText", e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-6">
          <label className={clsx("flex items-center gap-2 text-sm", isLocked ? "cursor-not-allowed text-ink-soft/60" : "text-ink")}>
            <input
              type="checkbox"
              disabled={isLocked}
              checked={form.isEnabled}
              onChange={(e) => set("isEnabled", e.target.checked)}
            />
            Shown on the form
          </label>
          <label className={clsx("flex items-center gap-2 text-sm", isLocked ? "cursor-not-allowed text-ink-soft/60" : "text-ink")}>
            <input
              type="checkbox"
              disabled={isLocked}
              checked={form.isRequired}
              onChange={(e) => set("isRequired", e.target.checked)}
            />
            Required
          </label>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button type="submit" disabled={saving} className="btn-primary w-full justify-center">
          {saving ? "Saving..." : isNew ? "Add Field" : "Save Changes"}
        </button>
      </form>
    </Modal>
  );
}
