"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import {
  Plus,
  Pencil,
  Trash2,
  FolderTree,
  Folder,
  ChevronUp,
  ChevronDown,
  Search,
  X,
  Layers,
  LayoutGrid,
  Feather,
  Waves,
  ExternalLink,
  AlertCircle,
  RotateCw,
} from "lucide-react";
import {
  adminGetCategories,
  adminCreateCategory,
  adminUpdateCategory,
  adminDeleteCategory,
  adminReorderCategories,
} from "@/components/admin/adminApi";
import { PageSpinner } from "@/components/ui/Spinner";
import EmptyState from "@/components/ui/EmptyState";
import Modal from "@/components/admin/Modal";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { buildCategoryTree } from "@/lib/categoryTree";
import { CATEGORY_THEMES } from "@/lib/categoryTheme";
import { DURATION, EASE_OUT } from "@/lib/motion";

const emptyForm = { name: "", description: "", image: "", parentId: "" };

const matches = (category, q) =>
  category.name.toLowerCase().includes(q) || (category.slug || "").includes(q);

const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

// The list's columns. Every row - the "All Categories" summary, each range and
// each subcategory - lays out on this one template, so names, focus, counts,
// status and actions line up down the whole page. Below `md` a row stacks.
const COLUMNS = "md:grid-cols-[minmax(0,1fr)_10rem_7.5rem_6.5rem_7.5rem]";
const ROW = clsx("flex flex-col gap-3 md:grid md:items-center md:gap-6", COLUMNS);

// A range's small identity mark: its own icon in its own colours (the same
// amber/ocean the public catalogue themes it with). A range without an entry
// gets a neutral folder.
const RANGE_ICONS = { avinova: Feather, blunova: Waves };

// The catalogue structure: top-level categories (ranges) as separate rows,
// each opening onto its subcategories. Products are filed under
// subcategories, so the list is the whole shape of the catalogue at a glance.
export default function CategoriesAdmin() {
  const [rows, setRows] = useState(null);
  const [query, setQuery] = useState("");
  // Ranges start closed, so the first view is the ranges themselves; each
  // opens onto its subcategories on click.
  const [expanded, setExpanded] = useState(() => new Set());
  const [modal, setModal] = useState(null); // { editing: category | null, form }
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [formError, setFormError] = useState("");

  const load = () =>
    adminGetCategories()
      .then(setRows)
      .catch((err) => setError(err.message || "Could not load categories."));

  useEffect(() => {
    load();
  }, []);

  const tree = useMemo(() => (rows ? buildCategoryTree(rows) : []), [rows]);
  const topLevel = tree;

  // While searching, a category stays visible if it or any of its
  // subcategories matches, and opens to show the matching ones.
  const q = query.trim().toLowerCase();
  const visible = useMemo(() => {
    if (!q) return tree.map((c) => ({ ...c, shownChildren: c.children }));
    return tree
      .map((c) => {
        const selfHit = matches(c, q);
        const hits = c.children.filter((s) => matches(s, q));
        if (!selfHit && !hits.length) return null;
        return { ...c, shownChildren: selfHit && !hits.length ? c.children : hits };
      })
      .filter(Boolean);
  }, [tree, q]);

  const totals = useMemo(() => {
    const subcategories = tree.reduce((n, c) => n + c.children.length, 0);
    const products = (rows || []).reduce((n, c) => n + (c.productCount || 0), 0);
    return { categories: tree.length, subcategories, products };
  }, [tree, rows]);

  const isOpen = (id) => Boolean(q) || expanded.has(id);
  const toggle = (id) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  const allExpanded = tree.length > 0 && tree.every((c) => expanded.has(c.id));

  const openCreate = (parentId = "") => {
    setFormError("");
    setModal({ editing: null, form: { ...emptyForm, parentId } });
  };

  const openEdit = (category) => {
    setFormError("");
    setModal({
      editing: category,
      form: {
        name: category.name,
        description: category.description || "",
        image: category.image || "",
        parentId: category.parentId || "",
      },
    });
  };

  const setForm = (patch) => setModal((m) => ({ ...m, form: { ...m.form, ...patch } }));

  const onSubmit = async (e) => {
    e.preventDefault();
    const { editing, form } = modal;
    setSaving(true);
    setFormError("");
    try {
      const payload = { ...form, parentId: form.parentId || null };
      if (editing) await adminUpdateCategory(editing.id, payload);
      else await adminCreateCategory(payload);
      // A new subcategory should be visible straight away.
      if (payload.parentId) setExpanded((prev) => new Set([...prev, payload.parentId]));
      setModal(null);
      await load();
    } catch (err) {
      setFormError(err.message || "Could not save the category.");
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (category) => {
    const kind = category.parentId ? "subcategory" : "category";
    if (!confirm(`Delete the ${kind} "${category.name}"? This cannot be undone.`)) return;
    setError("");
    try {
      await adminDeleteCategory(category.id);
      await load();
    } catch (err) {
      setError(err.message || `Could not delete the ${kind}.`);
    }
  };

  // Reorders one level: the top-level list or one category's subcategories.
  // Optimistic, so the arrows feel instant; a failure reloads the truth.
  const move = async (siblings, index, delta, parentId) => {
    const next = index + delta;
    if (next < 0 || next >= siblings.length) return;
    const reordered = siblings.slice();
    [reordered[index], reordered[next]] = [reordered[next], reordered[index]];
    const position = new Map(reordered.map((c, i) => [c.id, i]));
    setRows((prev) => prev.map((r) => (position.has(r.id) ? { ...r, sortOrder: position.get(r.id) } : r)));
    setError("");
    try {
      await adminReorderCategories(parentId, reordered.map((c) => c.id));
    } catch (err) {
      setError(err.message || "Could not reorder.");
      load();
    }
  };

  if (!rows && !error) return <PageSpinner />;

  const editing = modal?.editing;
  const isSub = Boolean(modal?.form.parentId);
  // A category that has subcategories cannot become one itself (two levels only).
  const canBeSub = !editing || editing.parentId || !(editing.childCount > 0);
  const parentOptions = topLevel.filter((c) => c.id !== editing?.id);

  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Categories</h1>
          <p className="mt-1 text-sm text-ink-soft">Manage product categories and organize products.</p>
        </div>
        <button onClick={() => openCreate()} className="btn-primary">
          <Plus size={16} /> Add Category
        </button>
      </div>

      {/* The first load failed: nothing to show but the error and a retry. */}
      {!rows ? (
        <div role="alert" className="mt-8 flex flex-col items-center rounded-2xl border border-red-100 bg-red-50/50 px-6 py-12 text-center">
          <AlertCircle size={28} className="text-red-500" />
          <h2 className="mt-3 font-display text-base font-semibold text-ink">Categories could not be loaded</h2>
          <p className="mt-1 max-w-sm text-sm text-ink-soft">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError("");
              load();
            }}
            className="btn-outline mt-5 text-sm"
          >
            <RotateCw size={14} /> Try again
          </button>
        </div>
      ) : (
        <>
          {tree.length > 0 && (
            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <div className="relative w-full sm:max-w-sm">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
                <input
                  className="input pl-9 pr-9"
                  placeholder="Search categories and subcategories..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search categories"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1 text-ink-soft hover:bg-mist-100"
                    aria-label="Clear search"
                  >
                    <X size={14} />
                  </button>
                )}
              </div>
              {!q && (
                <button
                  type="button"
                  onClick={() => setExpanded(allExpanded ? new Set() : new Set(tree.map((c) => c.id)))}
                  className="btn-ghost text-sm"
                >
                  {allExpanded ? "Collapse all" : "Expand all"}
                </button>
              )}
            </div>
          )}

          {error && (
            <p role="alert" className="mt-4 flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle size={16} className="shrink-0" /> {error}
            </p>
          )}

          <div className="mt-6">
            {tree.length === 0 ? (
              <>
                <EmptyState
                  icon={FolderTree}
                  title="No categories yet"
                  description="Create a range such as Poultry, then add subcategories to file products under."
                />
                <div className="mt-4 flex justify-center">
                  <button onClick={() => openCreate()} className="btn-outline text-sm">
                    <Plus size={15} /> Add your first category
                  </button>
                </div>
              </>
            ) : visible.length === 0 ? (
              <EmptyState icon={Search} title="Nothing matches" description={`No category or subcategory matches "${query}".`} />
            ) : (
              <>
                {/* Column headings, on the rows' own template. */}
                <div
                  aria-hidden="true"
                  className={clsx(
                    "hidden px-5 pb-3 text-[11px] font-semibold uppercase tracking-wider text-ink-soft md:grid md:gap-6",
                    COLUMNS
                  )}
                >
                  <span>Category</span>
                  <span>Type / Focus</span>
                  <span>Products</span>
                  <span>Status</span>
                  <span className="text-right">Actions</span>
                </div>

                <ul className="space-y-3">
                  {/* The whole catalogue, as a read-only summary row. */}
                  {!q && (
                    <li className="rounded-2xl border border-brand-100 bg-mist-50/60 px-5 py-4">
                      <div className={ROW}>
                        <div className="flex min-w-0 items-center gap-3.5">
                          <span className="hidden w-5 md:block" aria-hidden="true" />
                          <IdentityMark icon={LayoutGrid} />
                          <div className="min-w-0">
                            <p className="font-semibold text-ink">All Categories</p>
                            <p className="mt-0.5 text-xs text-ink-soft">
                              {plural(totals.categories, "range", "ranges")} ·{" "}
                              {plural(totals.subcategories, "subcategory", "subcategories")}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                          <Focus primary="All ranges" secondary="Catalogue" />
                          <CountChip count={totals.products} />
                          <span className="text-sm text-ink-soft">—</span>
                        </div>
                        <div className="flex justify-end">
                          <ActionLink href="/products" label="View catalogue on the site" tip="View on site">
                            <ExternalLink size={15} />
                          </ActionLink>
                        </div>
                      </div>
                    </li>
                  )}

                  {visible.map((category) => {
                    const index = topLevel.findIndex((c) => c.id === category.id);
                    const open = isOpen(category.id);
                    const theme = CATEGORY_THEMES[category.slug];
                    return (
                      <motion.li
                        key={category.id}
                        layout="position"
                        transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                        className="rounded-2xl border border-brand-100 bg-white transition-colors duration-200 hover:border-brand-200"
                      >
                        <div className={clsx(ROW, "px-5 py-4")}>
                          <div className="flex min-w-0 items-center gap-3.5">
                            {q ? (
                              <span className="hidden w-5 md:block" aria-hidden="true" />
                            ) : (
                              <ReorderArrows
                                label={category.name}
                                onUp={() => move(topLevel, index, -1, null)}
                                onDown={() => move(topLevel, index, 1, null)}
                                first={index === 0}
                                last={index === topLevel.length - 1}
                              />
                            )}
                            <IdentityMark
                              icon={RANGE_ICONS[category.slug] || Folder}
                              background={theme?.ui.soft}
                              color={theme?.ui.accent}
                            />
                            <button
                              type="button"
                              onClick={() => toggle(category.id)}
                              disabled={Boolean(q)}
                              aria-expanded={open}
                              className="group/name flex min-w-0 items-center gap-2 text-left"
                            >
                              <span className="min-w-0">
                                <span className="block truncate font-semibold text-ink group-hover/name:text-brand-700">
                                  {category.name}
                                </span>
                                <span className="mt-0.5 block text-xs text-ink-soft">
                                  {plural(category.children.length, "subcategory", "subcategories")}
                                </span>
                              </span>
                              {!q && (
                                <ChevronDown
                                  size={16}
                                  aria-hidden="true"
                                  className={clsx(
                                    "shrink-0 text-ink-soft/70 transition-transform duration-200",
                                    !open && "-rotate-90"
                                  )}
                                />
                              )}
                            </button>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                            <Focus primary={theme?.focus || "General"} secondary="Range" />
                            <CountChip count={category.productCount} />
                            <Status count={category.productCount} />
                          </div>
                          <div className="flex justify-end gap-0.5">
                            <ActionButton label={`Add a subcategory to ${category.name}`} tip="Add subcategory" onClick={() => openCreate(category.id)}>
                              <Plus size={16} />
                            </ActionButton>
                            <ActionButton label={`Edit ${category.name}`} tip="Edit" onClick={() => openEdit(category)}>
                              <Pencil size={15} />
                            </ActionButton>
                            <ActionButton label={`Delete ${category.name}`} tip="Delete" onClick={() => onDelete(category)} danger>
                              <Trash2 size={15} />
                            </ActionButton>
                          </div>
                        </div>

                        <AnimatePresence initial={false}>
                          {open && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                              className="overflow-hidden"
                            >
                              <div className="rounded-b-2xl border-t border-brand-100 bg-mist-50/40">
                                {category.shownChildren.length === 0 ? (
                                  <div className="flex flex-wrap items-center justify-between gap-3 px-5 py-4 text-sm text-ink-soft md:pl-[6.75rem]">
                                    <span>No subcategories yet. Products are filed under a subcategory.</span>
                                    <button type="button" onClick={() => openCreate(category.id)} className="btn-outline text-xs">
                                      <Plus size={14} /> Add the first
                                    </button>
                                  </div>
                                ) : (
                                  <ul className="divide-y divide-brand-100/70">
                                    {category.shownChildren.map((sub) => {
                                      const subIndex = category.children.findIndex((c) => c.id === sub.id);
                                      return (
                                        <motion.li
                                          key={sub.id}
                                          layout="position"
                                          transition={{ duration: DURATION.fast, ease: EASE_OUT }}
                                          className={clsx(ROW, "px-5 py-3 transition-colors duration-150 hover:bg-white")}
                                        >
                                          {/* Indented under the range's name, so the
                                              nesting reads without a tree of lines. */}
                                          <div className="flex min-w-0 items-center gap-3.5 md:pl-[3.375rem]">
                                            {q ? (
                                              <span className="hidden w-5 md:block" aria-hidden="true" />
                                            ) : (
                                              <ReorderArrows
                                                label={sub.name}
                                                onUp={() => move(category.children, subIndex, -1, category.id)}
                                                onDown={() => move(category.children, subIndex, 1, category.id)}
                                                first={subIndex === 0}
                                                last={subIndex === category.children.length - 1}
                                              />
                                            )}
                                            <Thumb image={sub.image} />
                                            <div className="min-w-0">
                                              <p className="truncate text-sm font-medium text-ink">{sub.name}</p>
                                              <p className="truncate text-xs text-ink-soft">/{sub.slug}</p>
                                            </div>
                                          </div>
                                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 md:contents">
                                            <Focus primary="Subcategory" secondary={`of ${category.name}`} quiet />
                                            <CountChip count={sub.productCount} href={`/admin/products?category=${sub.id}`} />
                                            <Status count={sub.productCount} />
                                          </div>
                                          <div className="flex justify-end gap-0.5">
                                            <ActionButton label={`Edit ${sub.name}`} tip="Edit" onClick={() => openEdit(sub)}>
                                              <Pencil size={15} />
                                            </ActionButton>
                                            <ActionButton label={`Delete ${sub.name}`} tip="Delete" onClick={() => onDelete(sub)} danger>
                                              <Trash2 size={15} />
                                            </ActionButton>
                                          </div>
                                        </motion.li>
                                      );
                                    })}
                                  </ul>
                                )}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.li>
                    );
                  })}
                </ul>
              </>
            )}
          </div>
        </>
      )}

      <Modal
        open={Boolean(modal)}
        onClose={() => setModal(null)}
        title={
          editing
            ? `Edit ${editing.parentId ? "Subcategory" : "Category"}`
            : isSub
              ? "Add Subcategory"
              : "Add Category"
        }
      >
        {modal && (
          <form onSubmit={onSubmit} className="space-y-6">
            <Field
              label="Category name"
              htmlFor="category-name"
              hint={isSub ? "The group products are filed under, e.g. Anticoccidials." : "The range as visitors see it, e.g. Avinova."}
            >
              <input
                id="category-name"
                required
                className="input"
                value={modal.form.name}
                onChange={(e) => setForm({ name: e.target.value })}
                placeholder={isSub ? "e.g. Anticoccidials" : "e.g. Avinova"}
              />
            </Field>

            <fieldset>
              <legend className="label">Type</legend>
              <div className="grid grid-cols-2 gap-2 rounded-xl bg-mist-50 p-1" role="radiogroup" aria-label="Type">
                <LevelOption
                  active={!isSub}
                  onClick={() => setForm({ parentId: "" })}
                  icon={FolderTree}
                  title="Range"
                  hint="Top level, e.g. Poultry"
                />
                <LevelOption
                  active={isSub}
                  disabled={!canBeSub || parentOptions.length === 0}
                  onClick={() => setForm({ parentId: parentOptions[0]?.id || "" })}
                  icon={Layers}
                  title="Subcategory"
                  hint="Holds products"
                />
              </div>
              {!canBeSub && (
                <p className="mt-2 text-xs text-ink-soft">This category has subcategories, so it stays at the top level.</p>
              )}

              {isSub && (
                <div className="mt-4">
                  <label className="label" htmlFor="category-parent">
                    Belongs to range
                  </label>
                  <select
                    id="category-parent"
                    required
                    className="input"
                    value={modal.form.parentId}
                    onChange={(e) => setForm({ parentId: e.target.value })}
                  >
                    {parentOptions.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </fieldset>

            <Field label="Description" htmlFor="category-description" hint="One or two sentences, shown in the catalogue." optional>
              <textarea
                id="category-description"
                rows={3}
                className="input resize-none"
                value={modal.form.description}
                onChange={(e) => setForm({ description: e.target.value })}
              />
            </Field>

            <Field label="Image" hint="Shown on the homepage and in the catalogue." optional>
              <ImagePicker value={modal.form.image} onChange={(image) => setForm({ image })} />
            </Field>

            {formError && (
              <p role="alert" className="flex items-center gap-2 rounded-xl bg-red-50 px-3.5 py-2.5 text-sm text-red-700">
                <AlertCircle size={15} className="shrink-0" /> {formError}
              </p>
            )}

            <div className="flex justify-end gap-2 border-t border-brand-100 pt-5">
              <button type="button" onClick={() => setModal(null)} className="btn-ghost">
                Cancel
              </button>
              <button type="submit" disabled={saving} className="btn-primary">
                {saving
                  ? "Saving..."
                  : editing
                    ? "Save Changes"
                    : isSub
                      ? "Create Subcategory"
                      : "Create Category"}
              </button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

// ---- row parts ------------------------------------------------------------

// A small tinted square holding a category's icon.
function IdentityMark({ icon: Icon, background, color }) {
  return (
    <span
      aria-hidden="true"
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-mist-100 text-ink-soft"
      style={background ? { backgroundColor: background, color } : undefined}
    >
      <Icon size={18} strokeWidth={1.75} />
    </span>
  );
}

// A subcategory's picture (usually one of its product labels), or a neutral
// placeholder.
function Thumb({ image }) {
  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white text-ink-soft ring-1 ring-brand-100">
      {image ? (
        // eslint-disable-next-line @next/next/no-img-element -- admin-uploaded/external URLs
        <img src={image} alt="" className="h-full w-full object-cover" />
      ) : (
        <Layers size={15} />
      )}
    </span>
  );
}

function Focus({ primary, secondary, quiet }) {
  return (
    <div className="min-w-0">
      <p className={clsx("truncate text-sm", quiet ? "text-ink-soft" : "font-medium text-ink")}>{primary}</p>
      <p className="truncate text-xs text-ink-soft">{secondary}</p>
    </div>
  );
}

// The product count as a chip; with `href`, a link to those products.
function CountChip({ count, href }) {
  const text = plural(count, "Product", "Products");
  const chip = "inline-flex w-fit items-center gap-1 rounded-full bg-mist-100 px-2.5 py-1 text-xs font-medium tabular-nums text-ink";
  if (!href) return <span className={chip}>{text}</span>;
  return (
    <Link href={href} className={clsx(chip, "transition-colors hover:bg-brand-50 hover:text-brand-700")} title="View these products">
      {text}
    </Link>
  );
}

// Categories have no stored status: one with products is live in the
// catalogue, one without shows nothing to visitors yet.
function Status({ count }) {
  const active = count > 0;
  return (
    <span className="inline-flex items-center gap-2 text-sm">
      <span aria-hidden="true" className={clsx("h-2 w-2 rounded-full", active ? "bg-emerald-500" : "bg-mist-300")} />
      <span className={active ? "text-ink" : "text-ink-soft"}>{active ? "Active" : "Empty"}</span>
    </span>
  );
}

function ReorderArrows({ label, onUp, onDown, first, last }) {
  return (
    <div className="flex w-5 shrink-0 flex-col items-center">
      <button
        type="button"
        onClick={onUp}
        disabled={first}
        className="rounded p-0.5 text-ink-soft/60 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label={`Move ${label} up`}
      >
        <ChevronUp size={14} />
      </button>
      <button
        type="button"
        onClick={onDown}
        disabled={last}
        className="rounded p-0.5 text-ink-soft/60 hover:bg-brand-50 hover:text-brand-700 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label={`Move ${label} down`}
      >
        <ChevronDown size={14} />
      </button>
    </div>
  );
}

// ---- actions ----------------------------------------------------------------

// A quiet icon action with a small tooltip on hover and keyboard focus.
// `label` is the full accessible name; `tip` the short visible one.
const actionClass = (danger) =>
  clsx(
    "flex h-8 w-8 items-center justify-center rounded-lg text-ink-soft/80 transition-colors",
    danger ? "hover:bg-red-50 hover:text-red-600" : "hover:bg-brand-50 hover:text-brand-700"
  );

function Tip({ children }) {
  return (
    <span
      role="tooltip"
      className="pointer-events-none absolute bottom-full left-1/2 z-10 mb-1.5 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-2 py-1 text-[11px] font-medium text-white opacity-0 transition-opacity duration-150 group-hover/tip:opacity-100 group-focus-within/tip:opacity-100"
    >
      {children}
    </span>
  );
}

function ActionButton({ label, tip, onClick, danger, children }) {
  return (
    <span className="group/tip relative inline-flex">
      <button type="button" onClick={onClick} aria-label={label} className={actionClass(danger)}>
        {children}
      </button>
      <Tip>{tip}</Tip>
    </span>
  );
}

function ActionLink({ href, label, tip, children }) {
  return (
    <span className="group/tip relative inline-flex">
      <Link href={href} target="_blank" aria-label={label} className={actionClass(false)}>
        {children}
      </Link>
      <Tip>{tip}</Tip>
    </span>
  );
}

// ---- form parts -------------------------------------------------------------

function Field({ label, htmlFor, hint, optional, children }) {
  return (
    <div>
      <div className="mb-1.5 flex items-baseline justify-between gap-3">
        {htmlFor ? (
          <label className="text-sm font-medium text-ink" htmlFor={htmlFor}>
            {label}
          </label>
        ) : (
          <span className="text-sm font-medium text-ink">{label}</span>
        )}
        {optional && <span className="text-xs text-ink-soft">Optional</span>}
      </div>
      {children}
      {hint && <p className="mt-1.5 text-xs text-ink-soft">{hint}</p>}
    </div>
  );
}

function LevelOption({ active, disabled, onClick, icon: Icon, title, hint }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      disabled={disabled}
      onClick={onClick}
      className={clsx(
        "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-left transition disabled:cursor-not-allowed disabled:opacity-40",
        active ? "bg-white shadow-soft ring-1 ring-brand-200" : "hover:bg-white/60"
      )}
    >
      <Icon size={16} className={active ? "text-brand-600" : "text-ink-soft"} />
      <span>
        <span className={clsx("block text-sm font-semibold", active ? "text-brand-700" : "text-ink")}>{title}</span>
        <span className="block text-[11px] text-ink-soft">{hint}</span>
      </span>
    </button>
  );
}
