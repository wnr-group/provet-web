"use client";

import { ChevronUp, ChevronDown, ChevronRight, Trash2, Eye, EyeOff, Plus } from "lucide-react";
import clsx from "clsx";
import { ImagePicker } from "@/components/admin/ImagePicker";
import { SECTION_TYPES, SECTION_TYPE_KEYS } from "@/lib/sectionTypes";

// Editor for one configurable section. Which inputs appear is driven by the
// type's `fields` in lib/sectionTypes.js, so adding a type there is enough -
// this component needs no change.

const BODY_HINT = {
  richText: "Leave a blank line between paragraphs.",
  list: "One item per line.",
  cards: 'One card per line, written as "Heading: text".',
  imageCards: "Optional intro shown above the cards.",
  imageText: "Leave a blank line between paragraphs.",
  productGrid: "Optional intro shown above the grid.",
  categoryGrid: "Optional intro shown above the grid.",
  cta: "Optional supporting line under the heading.",
};

function ConfigFields({ section, categories, onConfig }) {
  const { type, config } = section;

  if (type === "imageText") {
    return (
      <div>
        <label className="label">Image position</label>
        <select
          className="input"
          value={config.imagePosition || "right"}
          onChange={(e) => onConfig({ imagePosition: e.target.value })}
        >
          <option value="right">Image on the right</option>
          <option value="left">Image on the left</option>
        </select>
      </div>
    );
  }

  if (type === "cards") {
    return (
      <div>
        <label className="label">Columns</label>
        <select
          className="input"
          value={config.columns || 3}
          onChange={(e) => onConfig({ columns: Number(e.target.value) })}
        >
          {[2, 3, 4].map((n) => (
            <option key={n} value={n}>
              {n} per row
            </option>
          ))}
        </select>
      </div>
    );
  }

  if (type === "imageCards") {
    const items = config.items || [];
    const setItem = (i, patch) =>
      onConfig({ items: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });

    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label">Columns</label>
            <select
              className="input"
              value={config.columns || 3}
              onChange={(e) => onConfig({ columns: Number(e.target.value) })}
            >
              {[2, 3, 4].map((n) => (
                <option key={n} value={n}>
                  {n} per row
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Image style</label>
            <select
              className="input"
              value={config.imageStyle || "cover"}
              onChange={(e) => onConfig({ imageStyle: e.target.value })}
            >
              <option value="cover">Large picture (covers, artwork)</option>
              <option value="avatar">Small circle (people, logos)</option>
            </select>
          </div>
        </div>

        {/* The crop only applies to the large style - an avatar is always a
            circle, so offering a shape there would do nothing. */}
        {(config.imageStyle || "cover") === "cover" && (
          <div className="sm:w-1/2">
            <label className="label">Image shape</label>
            <select
              className="input"
              value={config.aspect || "square"}
              onChange={(e) => onConfig({ aspect: e.target.value })}
            >
              <option value="square">Square</option>
              <option value="portrait">Portrait (covers, posters)</option>
              <option value="landscape">Landscape (photos)</option>
            </select>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between">
            <label className="label mb-0">Cards</label>
            {items.length < 12 && (
              <button
                type="button"
                className="btn-ghost text-xs"
                onClick={() => onConfig({ items: [...items, { image: "", title: "", text: "", href: "" }] })}
              >
                <Plus size={14} /> Add card
              </button>
            )}
          </div>
          <div className="mt-2 space-y-3">
            {items.map((item, i) => (
              <div key={i} className="rounded-xl border border-brand-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">
                    Card {i + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Move card up"
                      disabled={i === 0}
                      onClick={() => {
                        const next = [...items];
                        [next[i - 1], next[i]] = [next[i], next[i - 1]];
                        onConfig({ items: next });
                      }}
                      className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Move card down"
                      disabled={i === items.length - 1}
                      onClick={() => {
                        const next = [...items];
                        [next[i], next[i + 1]] = [next[i + 1], next[i]];
                        onConfig({ items: next });
                      }}
                      className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label="Remove card"
                      onClick={() => onConfig({ items: items.filter((_, idx) => idx !== i) })}
                      className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="space-y-3">
                  <ImagePicker value={item.image || ""} onChange={(image) => setItem(i, { image })} />
                  <input
                    className="input"
                    placeholder="Heading"
                    value={item.title || ""}
                    onChange={(e) => setItem(i, { title: e.target.value })}
                  />
                  <textarea
                    rows={2}
                    className="input resize-none"
                    placeholder="Text (optional)"
                    value={item.text || ""}
                    onChange={(e) => setItem(i, { text: e.target.value })}
                  />
                  <input
                    className="input"
                    placeholder="Link (optional) - /products or https://..."
                    value={item.href || ""}
                    onChange={(e) => setItem(i, { href: e.target.value })}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (type === "productGrid") {
    return (
      <div className="grid gap-4 sm:grid-cols-3">
        <div>
          <label className="label">Category</label>
          <select
            className="input"
            value={config.categorySlug || ""}
            onChange={(e) => onConfig({ categorySlug: e.target.value || null })}
          >
            <option value="">All categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.slug}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">How many</label>
          <input
            type="number"
            min={1}
            max={12}
            className="input"
            value={config.limit ?? 3}
            onChange={(e) => onConfig({ limit: Number(e.target.value) })}
          />
        </div>
        <label className="flex items-end gap-2 pb-2.5 text-sm text-ink">
          <input
            type="checkbox"
            checked={Boolean(config.featuredOnly)}
            onChange={(e) => onConfig({ featuredOnly: e.target.checked })}
          />
          Featured only
        </label>
      </div>
    );
  }

  if (type === "categoryGrid") {
    return (
      <div className="sm:w-40">
        <label className="label">How many</label>
        <input
          type="number"
          min={1}
          max={12}
          className="input"
          value={config.limit ?? 6}
          onChange={(e) => onConfig({ limit: Number(e.target.value) })}
        />
      </div>
    );
  }

  if (type === "cta") {
    const buttons = config.buttons || [];
    const setButton = (i, patch) =>
      onConfig({ buttons: buttons.map((b, idx) => (idx === i ? { ...b, ...patch } : b)) });

    return (
      <div>
        <div className="flex items-center justify-between">
          <label className="label mb-0">Buttons</label>
          {buttons.length < 3 && (
            <button
              type="button"
              className="btn-ghost text-xs"
              onClick={() => onConfig({ buttons: [...buttons, { label: "", href: "", style: "accent", newTab: false }] })}
            >
              <Plus size={14} /> Add button
            </button>
          )}
        </div>
        <div className="mt-2 space-y-2">
          {buttons.map((button, i) => (
            <div key={i} className="grid gap-2 sm:grid-cols-[1fr_1fr_auto_auto_auto] sm:items-center">
              <input
                className="input"
                placeholder="Label"
                value={button.label || ""}
                onChange={(e) => setButton(i, { label: e.target.value })}
              />
              <input
                className="input"
                placeholder="/products or https://..."
                value={button.href || ""}
                onChange={(e) => setButton(i, { href: e.target.value })}
              />
              <select
                className="input sm:w-28"
                value={button.style || "accent"}
                onChange={(e) => setButton(i, { style: e.target.value })}
              >
                <option value="accent">Accent</option>
                <option value="primary">Primary</option>
                <option value="outline">Outline</option>
              </select>
              <label className="flex items-center gap-1.5 whitespace-nowrap text-xs text-ink-soft">
                <input
                  type="checkbox"
                  checked={Boolean(button.newTab)}
                  onChange={(e) => setButton(i, { newTab: e.target.checked })}
                />
                New tab
              </label>
              <button
                type="button"
                aria-label="Remove button"
                onClick={() => onConfig({ buttons: buttons.filter((_, idx) => idx !== i) })}
                className="rounded-lg p-2 text-ink-soft hover:bg-red-50 hover:text-red-600"
              >
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return null;
}

export default function SectionEditor({
  section,
  index,
  total,
  categories,
  editable,
  open,
  onToggleOpen,
  onChange,
  onMove,
  onRemove,
}) {
  const definition = SECTION_TYPES[section.type] || SECTION_TYPES.richText;
  const fields = definition.fields;
  const set = (patch) => onChange({ ...section, ...patch });
  const onConfig = (patch) => set({ config: { ...section.config, ...patch } });

  return (
    <div className={clsx("card space-y-4 p-5", !section.isVisible && "opacity-60")}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Headed by what the section says and what it is, not by its
            database key - "management-team" told an editor nothing about
            which block on the page they were about to change. */}
        <button
          type="button"
          onClick={onToggleOpen}
          className="flex min-w-0 flex-1 items-center gap-2 text-left"
        >
          <ChevronRight size={15} className={clsx("shrink-0 text-ink-soft transition-transform", open && "rotate-90")} />
          <span className="truncate font-display font-semibold text-ink">
            {section.title || definition.label}
          </span>
          <span className="shrink-0 badge bg-brand-50 text-ink-soft">{definition.label}</span>
          {!section.isVisible && <span className="shrink-0 badge bg-brand-50 text-ink-soft">Hidden</span>}
        </button>
        <div className="flex items-center gap-1">
          <button
            type="button"
            aria-label="Move up"
            disabled={index === 0}
            onClick={() => onMove(index, -1)}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
          >
            <ChevronUp size={15} />
          </button>
          <button
            type="button"
            aria-label="Move down"
            disabled={index === total - 1}
            onClick={() => onMove(index, 1)}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
          >
            <ChevronDown size={15} />
          </button>
          <button
            type="button"
            aria-label={section.isVisible ? "Hide section" : "Show section"}
            onClick={() => set({ isVisible: !section.isVisible })}
            className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50"
          >
            {section.isVisible ? <Eye size={15} /> : <EyeOff size={15} />}
          </button>
          {/* Sections on the bespoke home/about layouts can't be deleted -
              their keys are what those pages render by. */}
          {editable && (
            <button
              type="button"
              aria-label="Delete section"
              onClick={() => onRemove(index)}
              className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 size={15} />
            </button>
          )}
        </div>
      </div>

      {!open ? null : (
        <>
      {editable && (
        <div>
          <label className="label">Section type</label>
          <select className="input" value={section.type} onChange={(e) => set({ type: e.target.value })}>
            {SECTION_TYPE_KEYS.map((key) => (
              <option key={key} value={key}>
                {SECTION_TYPES[key].label}
              </option>
            ))}
          </select>
          <p className="mt-1 text-xs text-ink-soft">{definition.description}</p>
        </div>
      )}

      {fields.includes("title") && (
        <div>
          <label className="label">Title</label>
          <input className="input" value={section.title || ""} onChange={(e) => set({ title: e.target.value })} />
        </div>
      )}

      {fields.includes("body") && (
        <div>
          <label className="label">Body</label>
          <textarea
            rows={4}
            className="input resize-none"
            value={section.body || ""}
            onChange={(e) => set({ body: e.target.value })}
          />
          <p className="mt-1 text-xs text-ink-soft">{BODY_HINT[section.type]}</p>
        </div>
      )}

      {fields.includes("image") && (
        <div>
          <label className="label">Image</label>
          <ImagePicker value={section.image || ""} onChange={(image) => set({ image })} />
        </div>
      )}

      <ConfigFields section={section} categories={categories} onConfig={onConfig} />
        </>
      )}
    </div>
  );
}
