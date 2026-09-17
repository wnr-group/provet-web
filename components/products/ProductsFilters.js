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

      <div className={clsx("card space-y-6 p-5", !filtersOpen && "hidden lg:block")}>
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
            <button
              onClick={() => updateParams({ category: "" })}
              className={clsx(
                "block w-full rounded-lg px-3 py-2 text-left text-sm transition",
                !category ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-soft hover:bg-brand-50"
              )}
            >
              All Categories
            </button>
            {categories.map((c) => (
              <button
                key={c.id}
                onClick={() => updateParams({ category: c.slug })}
                className={clsx(
                  "flex w-full items-center justify-between rounded-lg px-3 py-2 text-left text-sm transition",
                  category === c.slug ? "bg-brand-50 font-semibold text-brand-700" : "text-ink-soft hover:bg-brand-50"
                )}
              >
                <span>{c.name}</span>
                {typeof c.productCount === "number" && <span className="text-xs text-ink-soft">{c.productCount}</span>}
              </button>
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
