"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal, X } from "lucide-react";
import clsx from "clsx";

export default function ProductsFilters({ categories, category, search }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: keep the input in sync when `search` changes externally (e.g. the "Clear filters" button).
  useEffect(() => setSearchInput(search), [search]);

  const updateParams = (updates) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([key, value]) => {
      if (value) next.set(key, value);
      else next.delete(key);
    });
    if (!("page" in updates)) next.delete("page");
    router.push(next.size ? `${pathname}?${next.toString()}` : pathname);
  };

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
              updateParams({ search: searchInput });
            }}
            className="relative"
          >
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search products..."
              className="input pl-9"
            />
          </form>
        </div>

        <div>
          <p className="label">Category</p>
          <div className="space-y-1">
            <CategoryOption active={!category} onClick={() => updateParams({ category: "" })}>
              All Categories
            </CategoryOption>
            {categories.map((c) => (
              <CategoryOption
                key={c.id}
                active={category === c.slug}
                count={c.productCount}
                onClick={() => updateParams({ category: c.slug })}
              >
                {c.name}
              </CategoryOption>
            ))}
          </div>
        </div>

        {(category || search) && (
          <button
            onClick={() => {
              setSearchInput("");
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
function CategoryOption({ active, count, onClick, children }) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={clsx(
        "group relative flex w-full items-center justify-between gap-2 rounded-xl px-3 py-2 text-left text-sm transition",
        active ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-soft hover:bg-mist-50 hover:text-ink"
      )}
    >
      <span
        aria-hidden="true"
        className={clsx(
          "absolute inset-y-2 left-0 w-1 rounded-full bg-gradient-to-b from-brand-500 to-accent-500 transition-transform duration-300",
          active ? "scale-y-100" : "scale-y-0"
        )}
      />
      <span className="transition-transform duration-200 group-hover:translate-x-0.5">{children}</span>
      {typeof count === "number" && (
        <span
          className={clsx(
            "rounded-full px-2 py-0.5 text-[11px] font-medium tabular-nums transition-colors",
            active ? "bg-brand-600 text-white" : "bg-mist-100 text-ink-soft"
          )}
        >
          {count}
        </span>
      )}
    </button>
  );
}
