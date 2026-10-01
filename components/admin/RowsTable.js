"use client";

import { ChevronUp, ChevronDown, Trash2, Plus } from "lucide-react";
import clsx from "clsx";
import { ImagePicker } from "@/components/admin/ImagePicker";

// An editable table: one row per item, one cell per field, with reordering,
// removal and an "Add row" button. Every list-shaped piece of website content
// is edited through this - cards, bullet points, figures, slides, locations,
// buttons - so the client fills in a grid instead of remembering a text
// format ("Heading: text", one per line).
//
// `columns`: [{ key, label, type?, placeholder?, width?, options? }]
//   type: "text" (default) | "textarea" | "image" | "select" | "checkbox"
//   width: a CSS width for the column (e.g. "30%", "5rem"); the rest share.
// `rows`: plain objects keyed by the column keys.
// `newRow`: the object a new row starts as.
export default function RowsTable({
  columns,
  rows,
  onChange,
  newRow,
  addLabel = "Add row",
  itemLabel = "row",
  max,
  emptyText = "Nothing here yet.",
}) {
  const setRow = (i, patch) => onChange(rows.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  const move = (i, delta) => {
    const next = [...rows];
    [next[i], next[i + delta]] = [next[i + delta], next[i]];
    onChange(next);
  };
  const remove = (i) => onChange(rows.filter((_, idx) => idx !== i));
  const add = () => onChange([...rows, { ...newRow }]);
  const canAdd = !max || rows.length < max;

  return (
    <div>
      <div className="overflow-x-auto rounded-xl border border-brand-100">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="bg-mist-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
              <th scope="col" className="w-10 px-3 py-2.5 text-center">
                #
              </th>
              {columns.map((col) => (
                <th key={col.key} scope="col" className="px-2 py-2.5" style={col.width ? { width: col.width } : undefined}>
                  {col.label}
                </th>
              ))}
              <th scope="col" className="w-24 px-3 py-2.5 text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 && (
              <tr>
                <td colSpan={columns.length + 2} className="px-4 py-6 text-center text-ink-soft">
                  {emptyText}
                </td>
              </tr>
            )}
            {rows.map((row, i) => (
              <tr key={i} className="border-t border-brand-100 align-top transition-colors hover:bg-mist-50/60">
                <td className="px-3 py-3 text-center text-xs font-semibold tabular-nums text-ink-soft">{i + 1}</td>
                {columns.map((col) => (
                  <td key={col.key} className="px-2 py-2">
                    <Cell
                      column={col}
                      value={row[col.key]}
                      onChange={(value) => setRow(i, { [col.key]: value })}
                      label={`${itemLabel} ${i + 1} ${col.label}`}
                    />
                  </td>
                ))}
                <td className="px-2 py-2">
                  <div className="flex items-center justify-end gap-0.5">
                    <IconButton label={`Move ${itemLabel} ${i + 1} up`} disabled={i === 0} onClick={() => move(i, -1)}>
                      <ChevronUp size={15} />
                    </IconButton>
                    <IconButton
                      label={`Move ${itemLabel} ${i + 1} down`}
                      disabled={i === rows.length - 1}
                      onClick={() => move(i, 1)}
                    >
                      <ChevronDown size={15} />
                    </IconButton>
                    <IconButton label={`Remove ${itemLabel} ${i + 1}`} danger onClick={() => remove(i)}>
                      <Trash2 size={15} />
                    </IconButton>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {canAdd && (
        <button type="button" onClick={add} className="btn-ghost mt-2 text-sm">
          <Plus size={15} /> {addLabel}
        </button>
      )}
    </div>
  );
}

function Cell({ column, value, onChange, label }) {
  const type = column.type || "text";

  if (type === "image") {
    return <ImagePicker compact value={value || ""} onChange={onChange} label={column.label} />;
  }

  if (type === "checkbox") {
    return (
      <label className="flex h-10 items-center justify-center">
        <input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} aria-label={label} />
      </label>
    );
  }

  if (type === "select") {
    return (
      <select className="input py-2" value={value ?? column.options?.[0]?.value ?? ""} onChange={(e) => onChange(e.target.value)} aria-label={label}>
        {column.options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    );
  }

  if (type === "textarea") {
    return (
      <textarea
        rows={2}
        className="input min-h-[2.75rem] resize-y py-2"
        placeholder={column.placeholder}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        aria-label={label}
      />
    );
  }

  return (
    <input
      className="input py-2"
      placeholder={column.placeholder}
      value={value || ""}
      onChange={(e) => onChange(e.target.value)}
      aria-label={label}
    />
  );
}

function IconButton({ label, onClick, disabled, danger, children }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "rounded-lg p-1.5 text-ink-soft transition disabled:opacity-25",
        danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-brand-50 hover:text-brand-700"
      )}
    >
      {children}
    </button>
  );
}
