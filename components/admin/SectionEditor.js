"use client";

import { useState } from "react";
import { ChevronUp, ChevronDown, Trash2, Plus, CheckCircle2, AlertCircle, PlayCircle } from "lucide-react";
import clsx from "clsx";
import { ImagePicker } from "@/components/admin/ImagePicker";
import RowsTable from "@/components/admin/RowsTable";
import { bodyToRows, rowsToBody } from "@/lib/contentFormat";
import { SECTION_TYPES, SECTION_TYPE_KEYS } from "@/lib/sectionTypes";
import { buildCategoryTree } from "@/lib/categoryTree";
import { parseYouTubeUrl, youTubeThumbnailUrl } from "@/lib/youtube";

// The fields for one configurable section, shown in the Website Content
// admin's edit dialog (see SectionFields below).

const BODY_HINT = {
  richText: "Leave a blank line between paragraphs.",
  imageCards: "Optional intro shown under the heading.",
  carousel: "Optional intro shown above the slider.",
  locations: "Optional intro shown above the address cards.",
  imageText: "Leave a blank line between paragraphs.",
  productGrid: "Optional intro shown above the grid.",
  categoryGrid: "Optional intro shown above the grid.",
  videos: "Optional intro shown above the videos.",
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

  if (type === "imageCards" || type === "carousel") {
    const items = config.items || [];
    const setItem = (i, patch) =>
      onConfig({ items: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });

    return (
      <div className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          {type === "carousel" ? (
            <>
              <div>
                <label className="label">Image shape</label>
                <select
                  className="input"
                  value={config.aspect || "square"}
                  onChange={(e) => onConfig({ aspect: e.target.value })}
                >
                  <option value="square">Square</option>
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                  <option value="wide">Wide (16:9)</option>
                </select>
              </div>
              <div>
                <label className="label">Advance every</label>
                <select
                  className="input"
                  value={config.autoplay === false ? "off" : String(config.interval || 6000)}
                  onChange={(e) =>
                    e.target.value === "off"
                      ? onConfig({ autoplay: false })
                      : onConfig({ autoplay: true, interval: Number(e.target.value) })
                  }
                >
                  <option value="off">Do not advance on its own</option>
                  <option value="4000">4 seconds</option>
                  <option value="6000">6 seconds</option>
                  <option value="9000">9 seconds</option>
                </select>
              </div>
            </>
          ) : (
          <>
          <div>
            {/* What "Columns" means depends on the style: cards per row for
                photo and portrait cards, covers visible across the shelf. */}
            <label className="label">
              {(config.imageStyle || "cover") === "cover"
                ? "Covers visible across the shelf"
                : config.imageStyle === "magazine"
                  ? "Back issues per row on the rack"
                  : config.imageStyle === "booklet"
                    ? "Booklets per row"
                    : "Cards per row"}
            </label>
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
              <option value="cover">Covers on a 3D shelf (booklets, magazines)</option>
              <option value="magazine">Magazine issues (latest featured, rest on a rack)</option>
              <option value="booklet">Technical booklets (numbered volumes that open)</option>
              <option value="card">Photo cards in a grid (events, news)</option>
              <option value="avatar">Portrait cards (people)</option>
              <option value="accordion">Expanding image panels (open on hover)</option>
            </select>
          </div>
          </>
          )}
        </div>

        {/* The crop only applies to the large image-card style - an avatar is
            always a circle, and a carousel sets its shape above. */}
        {type === "imageCards" && config.imageStyle !== "avatar" && (
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
          <label className="label">{type === "carousel" ? "Slides" : "Cards"}</label>
          <RowsTable
            columns={[
              { key: "image", label: "Image", type: "image", width: "5.5rem" },
              { key: "title", label: "Heading", placeholder: "Heading", width: "24%" },
              { key: "text", label: "Text", type: "textarea", placeholder: "Text (optional)" },
              { key: "href", label: "Link", placeholder: "/products or https://...", width: "22%" },
            ]}
            rows={items}
            onChange={(next) => onConfig({ items: next })}
            newRow={{ image: "", title: "", text: "", href: "" }}
            addLabel={type === "carousel" ? "Add slide" : "Add card"}
            itemLabel={type === "carousel" ? "slide" : "card"}
            max={12}
            emptyText={type === "carousel" ? "No slides yet." : "No cards yet."}
          />
        </div>
      </div>
    );
  }

  if (type === "locations") {
    const items = config.items || [];
    const setItem = (i, patch) =>
      onConfig({ items: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
    const move = (i, delta) => {
      const next = [...items];
      [next[i], next[i + delta]] = [next[i + delta], next[i]];
      onConfig({ items: next });
    };

    return (
      <div className="space-y-4">
        <div className="sm:w-1/2">
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
          <label className="label">Locations</label>
          <RowsTable
            columns={[
              { key: "title", label: "Name", placeholder: "Kolkata (Branch)", width: "18%" },
              { key: "subtitle", label: "Company", placeholder: "Optional", width: "16%" },
              { key: "address", label: "Address", type: "textarea", placeholder: "One line per row" },
              { key: "contact", label: "Contact person", placeholder: "Optional", width: "15%" },
              { key: "phone", label: "Phone", placeholder: "Optional", width: "14%" },
            ]}
            rows={items}
            onChange={(next) => onConfig({ items: next })}
            newRow={{ title: "", subtitle: "", address: "", contact: "", phone: "" }}
            addLabel="Add location"
            itemLabel="location"
            max={24}
            emptyText="No locations yet."
          />
        </div>
      </div>
    );
  }

  if (type === "videos") {
    return <VideoItemsEditor config={config} onConfig={onConfig} />;
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
            {/* A category shows its subcategories' products too. */}
            {buildCategoryTree(categories).map((c) => (
              <optgroup key={c.id} label={c.name}>
                <option value={c.slug}>All {c.name}</option>
                {c.children.map((sub) => (
                  <option key={sub.id} value={sub.slug}>
                    {sub.name}
                  </option>
                ))}
              </optgroup>
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
    return (
      <div>
        <label className="label">Buttons</label>
        <RowsTable
          columns={[
            { key: "label", label: "Label", placeholder: "Contact Us", width: "26%" },
            { key: "href", label: "Link", placeholder: "/contact or https://..." },
            {
              key: "style",
              label: "Style",
              type: "select",
              width: "8.5rem",
              options: [
                { value: "accent", label: "Accent" },
                { value: "primary", label: "Primary" },
                { value: "outline", label: "Outline" },
              ],
            },
            { key: "newTab", label: "New tab", type: "checkbox", width: "5rem" },
          ]}
          rows={config.buttons || []}
          onChange={(next) => onConfig({ buttons: next })}
          newRow={{ label: "", href: "", style: "accent", newTab: false }}
          addLabel="Add button"
          itemLabel="button"
          max={3}
          emptyText="No buttons."
        />
      </div>
    );
  }

  return null;
}

// List-shaped bodies are edited as a table (components/admin/RowsTable),
// one row per item. A fixed block can name its own format (the homepage's
// figures are "stats"); otherwise the section type decides.
const BODY_FORMAT_BY_TYPE = { list: "lines", cards: "headed", numberedRows: "headed" };

const BODY_COLUMNS = {
  lines: [{ key: "text", label: "Item", placeholder: "One point" }],
  headed: [
    { key: "heading", label: "Heading", placeholder: "Heading", width: "32%" },
    { key: "text", label: "Text", type: "textarea", placeholder: "Text" },
  ],
  stats: [
    { key: "value", label: "Figure", placeholder: "250+", width: "8rem" },
    { key: "label", label: "Caption", placeholder: "Products - or a note, with the figure left empty" },
  ],
};

const NEW_ROW = { lines: { text: "" }, headed: { heading: "", text: "" }, stats: { value: "", label: "" } };

// The rows live in their own state while the dialog is open, and the body
// text is written from them on every change. Deriving the rows back from the
// body on each keystroke would trim a space typed at the end of a cell and
// drop a just-added empty row, since the saved text keeps neither.
function BodyRows({ format, body, onBody }) {
  const [rows, setRows] = useState(() => bodyToRows(format, body));
  return (
    <RowsTable
      columns={BODY_COLUMNS[format]}
      rows={rows}
      onChange={(next) => {
        setRows(next);
        onBody(rowsToBody(format, next));
      }}
      newRow={NEW_ROW[format]}
      addLabel={format === "stats" ? "Add figure" : "Add row"}
      itemLabel={format === "stats" ? "figure" : "row"}
      emptyText="No rows yet - add the first one."
    />
  );
}

export function bodyFormatFor(section, override) {
  return override || BODY_FORMAT_BY_TYPE[section.type] || null;
}

// The fields of one section, laid out for the edit dialog: type, title, body,
// image and the type's own settings. Which appear is driven by the type's
// `fields` in lib/sectionTypes.js, so adding a type there is enough.
//
// `hint` / `hideConfig` / `bodyFormat` are per-block overrides from a fixed
// page (FIXED_PAGE_DEFAULTS in the content admin): what the block does on its
// page, type settings its layout ignores, and how its body is structured.
export function SectionFields({ section, categories, editable, hint, hideConfig = false, bodyFormat, onChange }) {
  const definition = SECTION_TYPES[section.type] || SECTION_TYPES.richText;
  const fields = definition.fields;
  const set = (patch) => onChange({ ...section, ...patch });
  const onConfig = (patch) => set({ config: { ...section.config, ...patch } });
  const format = bodyFormatFor(section, bodyFormat);

  return (
    <div className="space-y-5">
      {hint && <p className="rounded-xl bg-brand-50/70 px-4 py-3 text-sm leading-relaxed text-brand-800">{hint}</p>}

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

      {fields.includes("body") &&
        (format ? (
          <div>
            <label className="label">{format === "stats" ? "Figures" : format === "lines" ? "Items" : "Rows"}</label>
            <BodyRows key={`${section.key}-${format}`} format={format} body={section.body} onBody={(body) => set({ body })} />
          </div>
        ) : (
          <div>
            <label className="label">Body</label>
            <textarea
              rows={5}
              className="input resize-y"
              value={section.body || ""}
              onChange={(e) => set({ body: e.target.value })}
            />
            {!hint && BODY_HINT[section.type] && <p className="mt-1 text-xs text-ink-soft">{BODY_HINT[section.type]}</p>}
          </div>
        ))}

      {fields.includes("image") && (
        <div>
          <label className="label">Image</label>
          <ImagePicker value={section.image || ""} onChange={(image) => set({ image })} />
        </div>
      )}

      {!hideConfig && <ConfigFields section={section} categories={categories} onConfig={onConfig} />}
    </div>
  );
}

const MAX_VIDEOS = 12;

// The Videos section's list. Each link is checked as it is typed with the same
// parser the server validates with (lib/youtube.js), so a bad link is flagged
// here - with the reason - before Save refuses it.
function VideoItemsEditor({ config, onConfig }) {
  const items = config.items || [];
  const setItem = (i, patch) => onConfig({ items: items.map((it, idx) => (idx === i ? { ...it, ...patch } : it)) });
  const move = (from, to) => {
    const next = [...items];
    [next[from], next[to]] = [next[to], next[from]];
    onConfig({ items: next });
  };
  const addVideo = () => onConfig({ items: [...items, { url: "", title: "", text: "" }] });

  return (
    <div className="space-y-4">
      <div className="sm:w-64">
        <label className="label">Layout</label>
        <select className="input" value={config.layout || "grid"} onChange={(e) => onConfig({ layout: e.target.value })}>
          <option value="grid">Grid of equal videos</option>
          <option value="featured">First video large, the rest below</option>
        </select>
      </div>

      <div>
        <div className="flex items-center justify-between">
          <label className="label mb-0">
            Videos <span className="font-normal text-ink-soft">({items.length}/{MAX_VIDEOS})</span>
          </label>
          {items.length > 0 && items.length < MAX_VIDEOS && (
            <button type="button" className="btn-ghost text-xs" onClick={addVideo}>
              <Plus size={14} /> Add video
            </button>
          )}
        </div>
        <p className="mt-1 text-xs text-ink-soft">
          Paste the link from YouTube&apos;s Share button or the address bar. Videos play from YouTube; nothing is uploaded here.
        </p>

        {items.length === 0 && (
          <button
            type="button"
            onClick={addVideo}
            className="mt-3 flex w-full flex-col items-center gap-1.5 rounded-xl border-2 border-dashed border-brand-200 px-4 py-6 text-sm text-ink-soft transition hover:border-brand-300 hover:bg-brand-50/50"
          >
            <PlayCircle size={22} className="text-brand-400" />
            Add the first video
          </button>
        )}

        <div className="mt-3 space-y-3">
          {items.map((item, i) => {
            const video = parseYouTubeUrl(item.url);
            const typed = Boolean(item.url?.trim());
            return (
              <div key={i} className="rounded-xl border border-brand-100 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">Video {i + 1}</span>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label={`Move video ${i + 1} up`}
                      disabled={i === 0}
                      onClick={() => move(i, i - 1)}
                      className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
                    >
                      <ChevronUp size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Move video ${i + 1} down`}
                      disabled={i === items.length - 1}
                      onClick={() => move(i, i + 1)}
                      className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50 disabled:opacity-30"
                    >
                      <ChevronDown size={14} />
                    </button>
                    <button
                      type="button"
                      aria-label={`Remove video ${i + 1}`}
                      onClick={() => onConfig({ items: items.filter((_, idx) => idx !== i) })}
                      className="rounded-lg p-1.5 text-ink-soft hover:bg-red-50 hover:text-red-600"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-[160px_minmax(0,1fr)]">
                  {/* The thumbnail confirms it is the right video. */}
                  <div className="relative aspect-video overflow-hidden rounded-lg bg-mist-100">
                    {video ? (
                      // eslint-disable-next-line @next/next/no-img-element -- YouTube's thumbnail CDN
                      <img src={youTubeThumbnailUrl(video.id)} alt="" className="h-full w-full object-cover" />
                    ) : (
                      <span className="flex h-full w-full items-center justify-center text-brand-300">
                        <PlayCircle size={24} />
                      </span>
                    )}
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <input
                        className={clsx(
                          "input",
                          typed && !video && "border-red-300 ring-2 ring-red-100",
                          video && "border-accent-300"
                        )}
                        placeholder="https://www.youtube.com/watch?v=..."
                        value={item.url || ""}
                        onChange={(e) => setItem(i, { url: e.target.value })}
                        aria-label={`Video ${i + 1} YouTube link`}
                        aria-invalid={typed && !video}
                        inputMode="url"
                      />
                      {typed &&
                        (video ? (
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-accent-700">
                            <CheckCircle2 size={12} /> YouTube video found
                            {video.start ? `, starts at ${formatStart(video.start)}` : ""}
                          </p>
                        ) : (
                          <p className="mt-1 flex items-center gap-1 text-xs font-medium text-red-600">
                            <AlertCircle size={12} className="shrink-0" /> This isn&apos;t a link to one video. Open the
                            video on YouTube and copy its link (Share → Copy), e.g. youtube.com/watch?v=… or youtu.be/….
                          </p>
                        ))}
                    </div>
                    <input
                      className="input"
                      placeholder="Title (optional)"
                      value={item.title || ""}
                      onChange={(e) => setItem(i, { title: e.target.value })}
                      aria-label={`Video ${i + 1} title`}
                    />
                    <textarea
                      rows={2}
                      className="input resize-none"
                      placeholder="Caption (optional)"
                      value={item.text || ""}
                      onChange={(e) => setItem(i, { text: e.target.value })}
                      aria-label={`Video ${i + 1} caption`}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function formatStart(seconds) {
  const m = Math.floor(seconds / 60);
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}
