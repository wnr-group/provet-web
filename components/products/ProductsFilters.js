"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { useCatalogueNavigation } from "@/components/catalogue/CatalogueNavigation";
import { Search, SlidersHorizontal, X, Check } from "lucide-react";
import clsx from "clsx";

// The search box searches as you type once this many letters are in, after a
// short pause - each search reloads the product grid, so it waits for the
// visitor to stop typing rather than firing on every key.
const TYPEAHEAD_MIN = 3;
const TYPEAHEAD_DELAY_MS = 350;

// `tree` is getCategoryTree's output: top-level categories, each with its
// subcategories as `children`. The active category opens to show them.
export default function ProductsFilters({ tree = [], activeCategoryId, activeSubcategoryId, category, search }) {
  const { navigate } = useCatalogueNavigation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // The search this box last sent. When the results for it arrive, `search`
  // changes to it - and must not overwrite the letters typed since.
  const sentSearch = useRef(search);

  // Keep the input in sync when `search` changes from elsewhere (the "Clear
  // filters" button, the back button), but not when it is our own echo.
  useEffect(() => {
    if (search === sentSearch.current) return;
    sentSearch.current = search;
    setSearchInput(search);
  }, [search]);

  const updateParams = (updates, { replace = false } = {}) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("page" in updates)) next.delete("page");
    const url = next.size ? `${pathname}?${next.toString()}` : pathname;
    // Type-ahead replaces the history entry (one Back undoes the whole
    // search, not one letter at a time) and keeps the scroll position.
    navigate(url, { replace });
  };

  const runSearch = (value, options) => {
    const query = value.trim();
    if (query === (sentSearch.current || "")) return;
    sentSearch.current = query;
    updateParams({ search: query }, options);
  };

  // Search as you type: three letters or more, or an emptied box (which shows
  // everything again). One or two letters wait for more.
  useEffect(() => {
    const query = searchInput.trim();
    if (query.length > 0 && query.length < TYPEAHEAD_MIN) return;
    const timer = setTimeout(() => runSearch(searchInput, { replace: true }), TYPEAHEAD_DELAY_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs on typing only; runSearch reads the latest params itself.
  }, [searchInput]);

  const typed = searchInput.trim();

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      <button
        className="btn-outline mb-4 w-full justify-between lg:hidden"
        onClick={() => setFiltersOpen((o) => !o)}
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </span>
        {filtersOpen ? <X size={16} /> : null}
      </button>

      <div className={clsx("panel p-5", !filtersOpen && "hidden lg:block")}>
        {/* Search */}
        <div className="flex items-center justify-between">
          <SectionLabel htmlFor="product-search">Search</SectionLabel>
          {(category || search) && (
            <button
              type="button"
              onClick={() => {
                setSearchInput("");
                sentSearch.current = "";
                navigate(pathname);
              }}
              className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 transition hover:text-accent-600"
            >
              <X size={12} /> Clear all
            </button>
          )}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // Enter searches straight away, even for one or two letters.
            runSearch(searchInput);
          }}
          className="relative mt-2"
        >
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            id="product-search"
            type="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Product name..."
            aria-label="Search products"
            aria-describedby="product-search-hint"
            className="input pl-9"
          />
        </form>
        <p id="product-search-hint" className="mt-1.5 text-[11px] text-ink-soft/80" aria-live="polite">
          {typed.length > 0 && typed.length < TYPEAHEAD_MIN
            ? `Type ${TYPEAHEAD_MIN - typed.length} more letter${TYPEAHEAD_MIN - typed.length === 1 ? "" : "s"} to search`
            : "Results update as you type"}
        </p>

        {/* Range. With up to three options (All plus two ranges) a compact
            switch; with more, the names no longer fit side by side ("Avi...",
            "Blu..."), so they become a list like the product groups below. */}
        <div className="mt-6 border-t border-brand-100/80 pt-5">
          <SectionLabel>Range</SectionLabel>
          {(() => {
            const options = [
              { key: "all", label: "All", active: !category, slug: "", count: tree.reduce((sum, c) => sum + (c.productCount || 0), 0) },
              ...tree.map((c) => ({ key: c.id, label: c.name, active: c.id === activeCategoryId, slug: c.slug, count: c.productCount })),
            ];
            if (options.length <= 3) {
              return (
                <div
                  className="mt-2.5 grid gap-1 rounded-xl bg-mist-100/70 p-1"
                  style={{ gridTemplateColumns: `repeat(${options.length}, minmax(0, 1fr))` }}
                  role="group"
                  aria-label="Range"
                >
                  {options.map((o) => (
                    <RangeButton key={o.key} active={o.active} onClick={() => updateParams({ category: o.slug })} label={o.label} count={o.count} />
                  ))}
                </div>
              );
            }
            return (
              <ul className="-mx-1 mt-2 space-y-0.5 px-1" role="group" aria-label="Range">
                {options.map((o) => (
                  <li key={o.key}>
                    <GroupButton active={o.active} onClick={() => updateParams({ category: o.slug })} count={o.count}>
                      {o.key === "all" ? "All ranges" : o.label}
                    </GroupButton>
                  </li>
                ))}
              </ul>
            );
          })()}
        </div>

        {/* Product groups of the chosen range. One line each, the count as
            quiet text; a long list scrolls inside the panel instead of
            stretching the sidebar down the page. With "All" chosen there is
            no range to list groups for - the ranges themselves are the Range
            list above - so the section is left out rather than repeat them. */}
        {(() => {
            const range = tree.find((c) => c.id === activeCategoryId);
            if (!range) return null;
            return (
        <div className="mt-6 border-t border-brand-100/80 pt-5">
          <SectionLabel>Product group</SectionLabel>
              <ul className="-mx-1 mt-2 max-h-[22rem] space-y-0.5 overflow-y-auto px-1 [scrollbar-width:thin]">
                <li>
                  <GroupButton active={!activeSubcategoryId} onClick={() => updateParams({ category: range.slug })} count={range.productCount}>
                    All {range.name}
                  </GroupButton>
                </li>
                {range.children.map((sub) => (
                  <li key={sub.id}>
                    <GroupButton
                      active={sub.id === activeSubcategoryId}
                      onClick={() => updateParams({ category: sub.slug })}
                      count={sub.productCount}
                    >
                      {sub.name}
                    </GroupButton>
                  </li>
                ))}
              </ul>
            </div>
          );
        })()}
      </div>
    </aside>
  );
}

function SectionLabel({ children, htmlFor }) {
  const Tag = htmlFor ? "label" : "p";
  return (
    <Tag htmlFor={htmlFor} className="text-[11px] font-semibold uppercase tracking-[0.14em] text-ink-soft">
      {children}
    </Tag>
  );
}

// One option of the range switch: the name, and its product count under it.
// The chosen one lifts out as a white tile in the range's own colour.
function RangeButton({ active, onClick, label, count }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "flex min-w-0 flex-col items-center rounded-lg px-1.5 py-2 text-center transition",
        active ? "bg-white text-(--range-text) shadow-soft ring-1 ring-brand-100" : "text-ink-soft hover:bg-white/60 hover:text-ink"
      )}
    >
      <span className="w-full truncate text-[13px] font-semibold">{label}</span>
      {typeof count === "number" && <span className="text-[11px] tabular-nums opacity-75">{count}</span>}
    </button>
  );
}

// One product group: its name on a single line (the full name on hover when
// it is cut short) and its count as quiet text at the end. The chosen group
// fills with the range's soft colour and gets a tick.
function GroupButton({ active, onClick, count, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      title={typeof children === "string" ? children : undefined}
      className={clsx(
        "flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-[13px] transition",
        active ? "bg-(--range-soft) font-semibold text-(--range-text)" : "text-ink-soft hover:bg-mist-50 hover:text-ink"
      )}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {active ? (
        <Check size={14} className="shrink-0" aria-hidden="true" />
      ) : (
        <span className="shrink-0 text-[11px] tabular-nums text-ink-soft/70">{count}</span>
      )}
    </button>
  );
}
