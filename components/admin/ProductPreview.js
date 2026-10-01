"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronRight, EyeOff, LayoutGrid, FileText, Sparkles, CheckCircle2, Circle } from "lucide-react";
import CatalogueCard from "@/components/catalogue/CatalogueCard";
import ProductSpecs from "@/components/products/ProductSpecs";
import ProductTabs from "@/components/catalogue/ProductTabs";

// The long-form fields as the product page shows them - same order and titles
// as DETAIL_FIELDS in app/(public)/products/[slug]/page.js.
const DETAIL_FIELDS = [
  { key: "composition", title: "Composition" },
  { key: "uses", title: "Uses" },
  { key: "dosage", title: "Dosage & Administration" },
  { key: "applications", title: "Target Species" },
];

const VIEWS = [
  { key: "card", label: "Card", icon: LayoutGrid },
  { key: "page", label: "Page", icon: FileText },
];

// Live preview for the product form, built from the site's own components
// (CatalogueCard, ProductSpecs, ProductTabs) so what the admin sees is what
// visitors get, not an approximation of it. `product` is the form's current
// state in the public product shape.
export default function ProductPreview({ product }) {
  const [view, setView] = useState("card");

  return (
    <div className="card overflow-hidden p-0">
      <div className="flex items-center justify-between gap-2 border-b border-brand-100 px-4 py-3">
        <p className="whitespace-nowrap text-sm font-semibold text-ink">Live preview</p>
        <div className="flex rounded-full bg-mist-100 p-0.5" role="tablist" aria-label="Preview">
          {VIEWS.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              role="tab"
              aria-selected={view === key}
              onClick={() => setView(key)}
              className={clsx(
                "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium transition",
                view === key ? "bg-white text-brand-700 shadow-soft" : "text-ink-soft hover:text-ink"
              )}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>
      </div>

      {!product.isActive && (
        <p className="flex items-center gap-2 bg-orange-50 px-4 py-2 text-xs font-medium text-orange-700">
          <EyeOff size={14} /> Inactive: this product is hidden from the website.
        </p>
      )}

      {/* Links inside the preview go nowhere: it is a picture of the page. */}
      <div
        onClickCapture={(e) => {
          if (e.target.closest("a")) e.preventDefault();
        }}
        className="bg-mist-50/60"
      >
        {view === "card" ? <CardView product={product} /> : <PageView product={product} />}
      </div>
    </div>
  );
}

function CardView({ product }) {
  return (
    <div className="p-5">
      <div className="mx-auto max-w-[260px]">
        <CatalogueCard product={product} />
      </div>
      <p className="mt-4 text-center text-xs text-ink-soft">
        As it appears in the catalogue{product.subcategory ? ` under ${product.subcategory.name}` : ""}.
      </p>
    </div>
  );
}

function PageView({ product }) {
  const details = DETAIL_FIELDS.filter((f) => product[f.key]).map((f) => ({ ...f, value: product[f.key] }));
  const image = product.images?.[0];

  return (
    <div className="max-h-[70vh] overflow-y-auto">
      <div className="relative isolate overflow-hidden bg-banner px-5 pb-6 pt-5 text-white">
        <ol className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-brand-200">
          <li>Products</li>
          {[product.category, product.subcategory].filter(Boolean).map((level) => (
            <li key={level.id || level.name} className="flex items-center gap-1">
              <ChevronRight size={10} aria-hidden="true" /> {level.name}
            </li>
          ))}
        </ol>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {product.category && (
            <span className="rounded-full bg-white/10 px-2.5 py-0.5 text-[11px] font-semibold text-accent-200 ring-1 ring-white/15">
              {product.category.name}
            </span>
          )}
          {product.subcategory && (
            <span className="rounded-full bg-white/5 px-2.5 py-0.5 text-[11px] font-semibold text-white ring-1 ring-white/15">
              {product.subcategory.name}
            </span>
          )}
          {product.isFeatured && (
            <span className="inline-flex items-center gap-1 rounded-full bg-accent-500 px-2.5 py-0.5 text-[11px] font-semibold text-white">
              <Sparkles size={10} /> Featured
            </span>
          )}
        </div>
        <h3 className="mt-3 break-words font-display text-xl font-extrabold tracking-tight">{product.name}</h3>
        <span aria-hidden="true" className="mt-3 block h-1 w-10 rounded-full bg-accent-400" />
        {product.shortDescription && (
          <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-brand-100">{product.shortDescription}</p>
        )}
        <div className="mt-4 flex aspect-[4/3] items-center justify-center rounded-2xl bg-white p-4">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs
            <img src={image} alt="" className="max-h-full max-w-full object-contain" />
          ) : (
            <span className="text-xs text-ink-soft">No image yet</span>
          )}
        </div>
      </div>

      <div className="space-y-4 p-4">
        {details.length > 0 ? (
          <ProductTabs fields={details} />
        ) : (
          <p className="rounded-xl border border-dashed border-brand-200 p-4 text-center text-xs text-ink-soft">
            Composition, uses, dosage and target species appear here as tabs.
          </p>
        )}
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-ink-soft">Key details</p>
          <ProductSpecs product={product} className="mt-2 grid-cols-1!" />
        </div>
      </div>
    </div>
  );
}

// What a complete listing has. Advisory only - just name and subcategory are
// required to save.
export function ListingChecklist({ product }) {
  const checks = [
    { label: "Name", done: Boolean(product.name?.trim() && product.name !== PLACEHOLDER_NAME), required: true },
    { label: "Category & subcategory", done: Boolean(product.subcategory), required: true },
    { label: "At least one image", done: Boolean(product.images?.length) },
    { label: "Short description", done: Boolean(product.shortDescription?.trim()) },
    {
      label: "Composition, uses or dosage",
      done: DETAIL_FIELDS.some((f) => product[f.key]?.trim()),
    },
    { label: "Pack size", done: Boolean(product.packSize?.trim()) },
  ];
  const done = checks.filter((c) => c.done).length;
  const pct = Math.round((done / checks.length) * 100);

  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Listing completeness</p>
        <span className="text-xs font-semibold tabular-nums text-brand-700">{pct}%</span>
      </div>
      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-mist-100">
        <div
          className="h-full rounded-full bg-gradient-to-r from-brand-500 to-accent-500 transition-[width] duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <ul className="mt-3 space-y-1.5">
        {checks.map((c) => (
          <li key={c.label} className="flex items-center gap-2 text-xs">
            {c.done ? (
              <CheckCircle2 size={14} className="shrink-0 text-accent-600" />
            ) : (
              <Circle size={14} className="shrink-0 text-ink-soft/40" />
            )}
            <span className={c.done ? "text-ink" : "text-ink-soft"}>{c.label}</span>
            {c.required && !c.done && <span className="ml-auto text-[10px] font-semibold text-red-600">Required</span>}
          </li>
        ))}
      </ul>
    </div>
  );
}

export const PLACEHOLDER_NAME = "Product name";
