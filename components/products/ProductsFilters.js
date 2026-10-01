"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X, ChevronDown } from "lucide-react";
import clsx from "clsx";

// Past this many subcategories, a category's list gets its own filter box.
const SUBCATEGORY_FILTER_THRESHOLD = 8;

// The search box searches as you type once this many letters are in, after a
// short pause - each search reloads the product grid, so it waits for the
// visitor to stop typing rather than firing on every key.
const TYPEAHEAD_MIN = 3;
const TYPEAHEAD_DELAY_MS = 350;

// `tree` is getCategoryTree's output: top-level categories, each with its
// subcategories as `children`. The active category opens to show them.
export default function ProductsFilters({ tree = [], activeCategoryId, activeSubcategoryId, category, search }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [subQuery, setSubQuery] = useState("");

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
    if (replace) router.replace(url, { scroll: false });
    else router.push(url);
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

      <div className={clsx("panel space-y-6 p-5", !filtersOpen && "hidden lg:block")}>
        <div>
          <label className="label">Search</label>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Enter searches straight away, even for one or two letters.
              runSearch(searchInput);
            }}
            className="relative"
          >
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              aria-label="Search products"
              aria-describedby="product-search-hint"
              className="input pl-9"
            />
          </form>
          <p id="product-search-hint" className="mt-1.5 text-xs text-ink-soft" aria-live="polite">
            {typed.length > 0 && typed.length < TYPEAHEAD_MIN
              ? `Type ${TYPEAHEAD_MIN - typed.length} more letter${TYPEAHEAD_MIN - typed.length === 1 ? "" : "s"} to search`
              : "Results update as you type"}
          </p>
        </div>

        <div>
          <p className="label">Category</p>
          <div className="space-y-1">
            <CategoryOption active={!category} onClick={() => updateParams({ category: "" })}>
              All Categories
            </CategoryOption>
            {tree.map((c) => {
              const open = c.id === activeCategoryId;
              const q = subQuery.trim().toLowerCase();
              const children =
                open && q ? c.children.filter((sub) => sub.name.toLowerCase().includes(q)) : c.children;
              return (
                <div key={c.id}>
                  <CategoryOption
                    active={open && !activeSubcategoryId}
                    count={c.productCount}
                    expandable={c.children.length > 0}
                    expanded={open}
                    onClick={() => {
                      setSubQuery("");
                      updateParams({ category: c.slug });
                    }}
                  >
                    {c.name}
                  </CategoryOption>
                  {open && c.children.length > 0 && (
                    <div className="mb-2 ml-3 mt-1 space-y-0.5 border-l-2 border-brand-100 pl-2">
                      {c.children.length > SUBCATEGORY_FILTER_THRESHOLD && (
                        <div className="relative mb-1.5">
                          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft" />
                          <input
                            value={subQuery}
                            onChange={(e) => setSubQuery(e.target.value)}
                            placeholder={`Filter ${c.name.toLowerCase()}...`}
                            aria-label={`Filter ${c.name} subcategories`}
                            className="input py-1.5 pl-8 text-xs"
                          />
                        </div>
                      )}
                      {children.map((sub) => (
                        <CategoryOption
                          key={sub.id}
                          nested
                          active={sub.id === activeSubcategoryId}
                          count={sub.productCount}
                          onClick={() => updateParams({ category: sub.slug })}
                        >
                          {sub.name}
                        </CategoryOption>
                      ))}
                      {children.length === 0 && <p className="px-3 py-1.5 text-xs text-ink-soft">No match.</p>}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {(category || search) && (
          <button
            onClick={() => {
              setSearchInput("");
              sentSearch.current = "";
              router.push(pathname);
            }}
            className="btn-ghost w-full justify-center text-sm"
          >
            <X size={14} /> Clear filters
          </button>
        )}
      </div>
    </aside>
  );
}

// One row in the category list. The active row carries an accent bar on its
// leading edge and a filled count pill, so the current filter is obvious at a
// glance rather than only a shade darker than its neighbours.
// Top-level rows can expand (a chevron shows which way); nested rows are the
// subcategories, a step smaller and indented under their category.
function CategoryOption({ active, count, onClick, children, nested = false, expandable = false, expanded = false }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      aria-expanded={expandable ? expanded : undefined}
      className={clsx(
        "group relative flex w-full items-center justify-between gap-2 rounded-xl text-left transition",
        nested ? "px-2.5 py-1.5 text-[13px]" : "px-3 py-2 text-sm",
        active
          ? "bg-(--range-soft) font-semibold text-(--range-text)"
          : expanded
            ? "font-semibold text-ink hover:bg-mist-50"
            : "text-ink-soft hover:bg-mist-50 hover:text-ink"
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "absolute inset-y-2 left-0 w-1 rounded-full bg-gradient-to-b from-(--range-bar-from) to-(--range-bar-to) transition-transform duration-300",
          active ? "scale-y-100" : "scale-y-0"
        )}
      />
      <span className="flex min-w-0 items-center gap-1.5 transition-transform duration-200 group-hover:translate-x-0.5">
        {expandable && (
          <ChevronDown
            size={14}
            aria-hidden="true"
            className={clsx("shrink-0 transition-transform duration-200", !expanded && "-rotate-90")}
          />
        )}
        <span className="min-w-0">{children}</span>
      </span>
      {typeof count === "number" && (
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums transition-colors",
            active ? "bg-(--range-accent) text-white" : "bg-mist-100 text-ink-soft"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
