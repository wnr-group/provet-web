"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { LayoutGrid, List, X } from "lucide-react";
import clsx from "clsx";
import { useCatalogueNavigation } from "@/components/catalogue/CatalogueNavigation";

const SORTS = [
  { value: "newest", label: "Newest first" },
  { value: "name", label: "Name (A–Z)" },
];

const VIEWS = [
  { value: "grid", label: "Grid", Icon: LayoutGrid },
  { value: "list", label: "List", Icon: List },
];

// The bar above the products: "Showing 1-12 of 95 results", the sort, the
// grid/list switch and, under it, the filters in force as removable chips.
//
// Sort and view live in the URL (`?sort=name`, `?view=list`), so a link to the
// catalogue keeps them; the defaults (newest, grid) are left out of it.
// `chips` is [{ key, label, clear }] - `clear` is the params to reset when the
// chip is removed (e.g. { search: "" }, or { category: rangeSlug } to step
// back from a product group to its range).
export default function ProductsToolbar({ shown, total, page, limit, sort, view, chips = [] }) {
  const { navigate } = useCatalogueNavigation();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const update = (updates, { resetPage = true } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => (value ? next.set(key, value) : next.delete(key)));
    if (resetPage) next.delete("page");
    navigate(next.size ? `${pathname}?${next.toString()}` : pathname, { scroll: false });
  };

  const from = total ? (page - 1) * limit + 1 : 0;
  const to = from ? from + shown - 1 : 0;

  return (
    <div className="mb-5">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-brand-100 pb-4">
        <p className="text-sm text-ink-soft" aria-live="polite">
          {total ? (
            <>
              Showing{" "}
              <span className="font-semibold tabular-nums text-ink">
                {from}–{to}
              </span>{" "}
              of <span className="font-semibold tabular-nums text-ink">{total}</span> {total === 1 ? "result" : "results"}
            </>
          ) : (
            "No results"
          )}
        </p>

        <div className="flex items-center gap-2">
          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <span className="hidden sm:inline">Sort</span>
            <select
              value={sort}
              onChange={(e) => update({ sort: e.target.value === "newest" ? "" : e.target.value })}
              aria-label="Sort products"
              className="h-9 cursor-pointer rounded-lg border border-brand-200 bg-white pl-3 pr-8 text-sm font-medium text-ink outline-none transition hover:border-brand-300 focus:border-brand-500 focus:ring-2 focus:ring-brand-100"
            >
              {SORTS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </label>

          {/* Grid or list. The page stays where it is. */}
          <div role="group" aria-label="View" className="flex h-9 rounded-lg border border-brand-200 bg-white p-0.5">
            {VIEWS.map(({ value, label, Icon }) => {
              const active = view === value;
              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => update({ view: value === "grid" ? "" : value }, { resetPage: false })}
                  aria-pressed={active}
                  title={`${label} view`}
                  className={clsx(
                    "flex items-center gap-1.5 rounded-md px-2.5 text-sm font-medium transition",
                    active ? "bg-(--range-accent) text-white" : "text-ink-soft hover:bg-mist-50 hover:text-ink"
                  )}
                >
                  <Icon size={15} aria-hidden="true" />
                  <span className="hidden sm:inline">{label}</span>
                  <span className="sr-only sm:hidden">{label} view</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {chips.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={() => update(chip.clear)}
              aria-label={`Remove filter: ${chip.label}`}
              className="group inline-flex max-w-full items-center gap-1.5 rounded-full border border-(--range-ring) bg-(--range-soft) py-1 pl-3 pr-2 text-xs font-semibold text-(--range-text) transition hover:bg-white"
            >
              <span className="truncate">{chip.label}</span>
              <X size={12} aria-hidden="true" className="shrink-0 opacity-60 transition group-hover:opacity-100" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
