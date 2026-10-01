"use client";

import { ChevronUp, ChevronDown, Pencil, Trash2, Lock, Plus, FileText, Settings2 } from "lucide-react";
import clsx from "clsx";
import { SECTION_TYPES } from "@/lib/sectionTypes";
import { bodyToRows } from "@/lib/contentFormat";
import { bodyFormatFor } from "@/components/admin/SectionEditor";

// A page's sections as one table: order, what each section is, what's in it,
// whether it shows, and Edit / Delete. The client scans the whole page at a
// glance and opens a section to change it (the edit dialog in the content
// admin), instead of hunting through a stack of collapsed cards.
//
// On the bespoke home/about/contact pages the built-in sections come first and
// can't be deleted or retyped (they show a lock); sections added on top are
// listed after a divider, and move among themselves.
export default function SectionsTable({
  sections,
  editable,
  isFixedPage,
  isLocked,
  reorderable,
  meta,
  onEdit,
  onMove,
  onToggle,
  onRemove,
  onAdd,
  // { summary, onEdit } - the managed pages' banner/SEO settings, shown as a
  // pinned first row so the whole page is edited from this one table.
  pageSettings = null,
}) {
  const shownCount = sections.filter((s) => s.isVisible).length;

  return (
    <div className="card overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 px-5 py-4">
        <div>
          <h2 className="font-display font-semibold text-ink">Sections</h2>
          <p className="mt-0.5 text-xs text-ink-soft">
            {sections.length} {sections.length === 1 ? "section" : "sections"} · {shownCount} shown on the website
          </p>
        </div>
        <button type="button" onClick={onAdd} className="btn-primary text-sm">
          <Plus size={16} /> Add section
        </button>
      </div>

      {sections.length === 0 && !pageSettings ? (
        <div className="p-10 text-center text-ink-soft">
          <FileText size={28} className="mx-auto text-brand-300" />
          <p className="mt-3 text-sm">
            {editable ? "No sections yet - add one to start building this page." : "No content sections found."}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[48rem] border-collapse text-sm">
            <thead>
              <tr className="bg-mist-50 text-left text-xs font-semibold uppercase tracking-wide text-ink-soft">
                <th scope="col" className="w-24 px-5 py-3">
                  Order
                </th>
                <th scope="col" className="px-3 py-3">
                  Section
                </th>
                <th scope="col" className="w-36 px-3 py-3">
                  Type
                </th>
                <th scope="col" className="px-3 py-3">
                  Content
                </th>
                <th scope="col" className="w-24 px-3 py-3 text-center">
                  Shown
                </th>
                <th scope="col" className="w-28 px-5 py-3 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {pageSettings && (
                <tr className="border-t border-brand-100 bg-brand-50/40 transition-colors hover:bg-brand-50/70">
                  <td className="px-5 py-3">
                    <Settings2 size={15} className="text-brand-400" aria-hidden="true" />
                  </td>
                  <td className="px-3 py-3">
                    <button
                      type="button"
                      onClick={pageSettings.onEdit}
                      className="font-semibold text-ink hover:text-brand-600"
                    >
                      Page settings
                    </button>
                  </td>
                  <td className="px-3 py-3">
                    <span className="badge whitespace-nowrap bg-brand-100 text-brand-700">Banner &amp; SEO</span>
                  </td>
                  <td className="px-3 py-3">
                    <p className="max-w-[24rem] truncate text-ink-soft">{pageSettings.summary}</p>
                  </td>
                  <td className="px-3 py-3 text-center text-xs text-ink-soft">Always</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        type="button"
                        onClick={pageSettings.onEdit}
                        className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-600 hover:text-white hover:ring-brand-600"
                      >
                        <Pencil size={13} /> Edit
                      </button>
                      {/* Keeps the Edit buttons lined up with the rows below,
                          which carry a delete icon here. */}
                      <span aria-hidden="true" className="w-[27px]" />
                    </div>
                  </td>
                </tr>
              )}
              {sections.length === 0 && (
                <tr className="border-t border-brand-100">
                  <td colSpan={6} className="px-5 py-8 text-center text-sm text-ink-soft">
                    No sections yet - add one to start building this page.
                  </td>
                </tr>
              )}
              {sections.map((section, i) => {
                // On a fixed page, order and arrows work within a group: the
                // built-in blocks, or the added sections.
                const locked = isLocked(section);
                const group = isFixedPage ? sections.filter((s) => isLocked(s) === locked) : sections;
                const position = group.indexOf(section);
                const firstAdded = isFixedPage && !locked && position === 0;
                const canMove = !locked || reorderable;
                const definition = SECTION_TYPES[section.type] || SECTION_TYPES.richText;
                const format = bodyFormatFor(section, meta?.[section.key]?.bodyFormat);

                return (
                  <SectionRowGroup key={section.key} divider={firstAdded}>
                    <tr
                      className={clsx(
                        "border-t border-brand-100 transition-colors hover:bg-mist-50/70",
                        !section.isVisible && "bg-mist-50/40"
                      )}
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-1">
                          <span className="w-6 text-xs font-semibold tabular-nums text-ink-soft">{position + 1}</span>
                          {canMove && (
                            <>
                              <button
                                type="button"
                                aria-label={`Move ${label(section, definition)} up`}
                                title="Move up"
                                disabled={position === 0}
                                onClick={() => onMove(i, -1)}
                                className="rounded-lg p-1 text-ink-soft hover:bg-brand-50 hover:text-brand-700 disabled:opacity-25"
                              >
                                <ChevronUp size={15} />
                              </button>
                              <button
                                type="button"
                                aria-label={`Move ${label(section, definition)} down`}
                                title="Move down"
                                disabled={position === group.length - 1}
                                onClick={() => onMove(i, 1)}
                                className="rounded-lg p-1 text-ink-soft hover:bg-brand-50 hover:text-brand-700 disabled:opacity-25"
                              >
                                <ChevronDown size={15} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="px-3 py-3">
                        <button
                          type="button"
                          onClick={() => onEdit(section.key)}
                          className={clsx(
                            "flex max-w-[22rem] items-center gap-1.5 text-left font-semibold hover:text-brand-600",
                            section.isVisible ? "text-ink" : "text-ink-soft"
                          )}
                        >
                          {locked && <Lock size={12} className="shrink-0 text-brand-300" aria-label="Built-in section" />}
                          <span className="truncate">{label(section, definition)}</span>
                        </button>
                      </td>
                      <td className="px-3 py-3">
                        <span className="badge whitespace-nowrap bg-brand-50 text-brand-700">{definition.label}</span>
                      </td>
                      <td className="px-3 py-3">
                        <p className="max-w-[24rem] truncate text-ink-soft">{summarize(section, format)}</p>
                      </td>
                      <td className="px-3 py-3 text-center">
                        <Switch
                          checked={section.isVisible}
                          onChange={() => onToggle(i)}
                          label={`${section.isVisible ? "Hide" : "Show"} ${label(section, definition)}`}
                        />
                      </td>
                      <td className="px-5 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            type="button"
                            onClick={() => onEdit(section.key)}
                            className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-600 hover:text-white hover:ring-brand-600"
                          >
                            <Pencil size={13} /> Edit
                          </button>
                          {/* Every row can be removed. A built-in section is
                              part of the page's layout - the page would put
                              it straight back with its default content - so
                              removing one hides it instead, and the Shown
                              switch brings it back. */}
                          {editable || !locked ? (
                            <button
                              type="button"
                              aria-label={`Delete ${label(section, definition)}`}
                              title="Delete section"
                              onClick={() => onRemove(i)}
                              className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
                            >
                              <Trash2 size={15} />
                            </button>
                          ) : (
                            <button
                              type="button"
                              aria-label={`Remove ${label(section, definition)} from the website`}
                              title={
                                section.isVisible
                                  ? "Remove from the website - built-in sections are hidden, and the Shown switch brings them back"
                                  : "Already removed from the website - turn on Shown to bring it back"
                              }
                              disabled={!section.isVisible}
                              onClick={() => onToggle(i)}
                              className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink-soft"
                            >
                              <Trash2 size={15} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  </SectionRowGroup>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// A row, preceded on a fixed page by the divider that starts the added
// sections.
function SectionRowGroup({ divider, children }) {
  return (
    <>
      {divider && (
        <tr className="border-t border-brand-100 bg-mist-50">
          <td colSpan={6} className="px-5 py-2 text-xs font-semibold uppercase tracking-wider text-ink-soft">
            Added sections · shown after the page&apos;s main content
          </td>
        </tr>
      )}
      {children}
    </>
  );
}

function Switch({ checked, onChange, label }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      title={checked ? "Shown - click to hide" : "Hidden - click to show"}
      onClick={onChange}
      className={clsx(
        "relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors",
        checked ? "bg-brand-600" : "bg-mist-300"
      )}
    >
      <span
        className={clsx(
          "inline-block h-5 w-5 rounded-full bg-white shadow-soft transition-transform",
          checked ? "translate-x-[1.375rem]" : "translate-x-0.5"
        )}
      />
    </button>
  );
}

// The section's own heading where it has one - "Our Values", not the
// database key - falling back to its type.
function label(section, definition) {
  return section.title?.trim() || definition.label;
}

const plural = (n, one, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;

// One line saying what is in the section, so the table shows the page's
// content without opening anything.
function summarize(section, format) {
  const { type, config = {}, body = "" } = section;
  const items = config.items || [];

  if (type === "carousel") return items.length ? plural(items.length, "slide") : "No slides yet";
  if (type === "imageCards") return items.length ? `${plural(items.length, "card")}: ${names(items)}` : "No cards yet";
  if (type === "locations") return items.length ? `${plural(items.length, "location")}: ${names(items)}` : "No locations yet";
  if (type === "videos") return items.length ? plural(items.length, "video") : "No videos yet";
  if (type === "productGrid") {
    return `${config.featuredOnly ? "Featured products" : "Products"} from ${config.categorySlug || "all categories"}, up to ${config.limit ?? 3}`;
  }
  if (type === "categoryGrid") return `Up to ${config.limit ?? 6} categories`;
  if (type === "cta") {
    const buttons = (config.buttons || []).map((b) => b.label).filter(Boolean);
    return [body.trim(), buttons.length ? `Buttons: ${buttons.join(", ")}` : null].filter(Boolean).join(" · ") || "Empty";
  }

  if (format) {
    const rows = bodyToRows(format, body);
    if (!rows.length) return "Empty";
    const first = rows
      .slice(0, 3)
      .map((r) => (format === "stats" ? [r.value, r.label].filter(Boolean).join(" ") : r.heading || r.text))
      .join(", ");
    const noun = format === "stats" ? "figure" : format === "lines" ? "item" : "row";
    return `${plural(rows.length, noun)}: ${first}${rows.length > 3 ? ", ..." : ""}`;
  }

  const text = body.replace(/\s+/g, " ").trim();
  return text || (section.image ? "Image" : "Empty");
}

function names(items) {
  const titles = items.map((it) => it.title).filter(Boolean);
  return titles.slice(0, 3).join(", ") + (titles.length > 3 ? ", ..." : "");
}
