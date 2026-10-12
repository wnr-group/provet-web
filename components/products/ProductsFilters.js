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

// The catalogue's filters: search, and the product groups - every range's
// groups under the range's name while all ranges are shown (the therapeutic
// segments, as the reference catalogues list them), or just the chosen
// range's. The ranges themselves are the tiles above (RangeTabs).
//
// One panel, two presentations: the sticky left column from lg, and below lg
// a drawer that slides in from the left over the dimmed page, opened from the
// "Filters" button. Choices apply as they are made; "Show N products" closes
// it.
//
// `tree` is navCategoryTree's output: ranges, each with its groups as
// `children` (names, slugs and counts only).
export default function ProductsFilters({ tree = [], activeCategoryId, activeSubcategoryId, category, search, total }) {
  const { navigate, isPending } = useCatalogueNavigation();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(search);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const closeRef = useRef(null);
  const triggerRef = useRef(null);

  // The search this box last sent. When the results for it arrive, `search`
  // changes to it - and must not overwrite the letters typed since.
  const sentSearch = useRef(search);

  // Keep the input in sync when `search` changes from elsewhere (a filter
  // chip, the back button), but not when it is our own echo.
  useEffect(() => {
    if (search === sentSearch.current) return;
    sentSearch.current = search;
    setSearchInput(search);
  }, [search]);

  // The drawer: Escape closes it, the page behind does not scroll while it is
  // open, focus moves into it and back to the button after, and it closes by
  // itself if the window widens to the desktop layout.
  useEffect(() => {
    if (!drawerOpen) return;
    const trigger = triggerRef.current;
    const onKey = (e) => e.key === "Escape" && setDrawerOpen(false);
    const desktop = window.matchMedia("(min-width: 1024px)");
    const onWiden = (e) => e.matches && setDrawerOpen(false);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", onKey);
    desktop.addEventListener("change", onWiden);
    closeRef.current?.focus();
    return () => {
      document.body.style.overflow = overflow;
      document.removeEventListener("keydown", onKey);
      desktop.removeEventListener("change", onWiden);
      if (!desktop.matches) trigger?.focus();
    };
  }, [drawerOpen]);

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
  const activeCount = (category ? 1 : 0) + (search ? 1 : 0);
  const range = tree.find((c) => c.id === activeCategoryId);
  const activeGroup = range?.children.find((s) => s.id === activeSubcategoryId);
  // While all ranges are shown, every range lists its groups - including one
  // just added in the admin, before it has groups or products.
  const sections = range ? [range] : tree;

  const clearAll = () => {
    setSearchInput("");
    sentSearch.current = "";
    updateParams({ search: "", category: "" });
  };

  return (
    <aside className="lg:sticky lg:top-24 lg:h-fit">
      {/* Below lg: the button that opens the drawer. */}
      <button
        ref={triggerRef}
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-expanded={drawerOpen}
        aria-controls="catalogue-filters"
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-brand-200 bg-white px-4 py-3 text-sm font-semibold text-ink transition hover:border-brand-300 lg:hidden"
      >
        <span className="flex items-center gap-2">
          <SlidersHorizontal size={16} aria-hidden="true" className="text-(--range-accent)" /> Search &amp; filter
          {activeCount > 0 && (
            <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-(--range-accent) px-1.5 text-[11px] font-bold text-white">
              {activeCount}
            </span>
          )}
        </span>
        <span className="min-w-0 truncate text-xs font-medium text-ink-soft">
          {[activeGroup?.name, search && `“${search}”`].filter(Boolean).join(" · ") || "Product groups"}
        </span>
      </button>

      {/* Below lg: the dimmed page behind the open drawer. */}
      <div
        aria-hidden="true"
        onClick={() => setDrawerOpen(false)}
        className={clsx(
          "fixed inset-0 z-[60] bg-brand-900/40 backdrop-blur-[2px] transition-opacity duration-300 lg:hidden",
          drawerOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      {/* The panel: a drawer below lg (hidden - and out of the tab order -
          while closed), the sticky sidebar from lg. */}
      <div
        id="catalogue-filters"
        role={drawerOpen ? "dialog" : undefined}
        aria-modal={drawerOpen || undefined}
        aria-label="Search and filter products"
        className={clsx(
          "flex flex-col bg-white",
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:z-[61] max-lg:w-[min(22rem,88vw)] max-lg:shadow-2xl max-lg:transition-[transform,visibility] max-lg:duration-300 max-lg:ease-out",
          drawerOpen ? "max-lg:visible max-lg:translate-x-0" : "max-lg:invisible max-lg:-translate-x-full",
          "lg:rounded-xl lg:border lg:border-brand-100"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between gap-3 border-b border-brand-100 px-5 py-4">
          <p className="font-display text-base font-bold text-ink">Filter products</p>
          <div className="flex items-center gap-1">
            {activeCount > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="rounded-md px-2 py-1 text-xs font-semibold text-(--range-text) transition hover:bg-(--range-soft)"
              >
                Clear all
              </button>
            )}
            <button
              ref={closeRef}
              type="button"
              onClick={() => setDrawerOpen(false)}
              aria-label="Close filters"
              className="flex h-8 w-8 items-center justify-center rounded-full text-ink-soft transition hover:bg-mist-100 hover:text-ink lg:hidden"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 pb-5 pt-4 lg:max-h-[calc(100vh-11rem)] lg:[scrollbar-width:thin]">
          {/* Search */}
          <SectionLabel htmlFor="product-search">Search</SectionLabel>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              // Enter searches straight away, even for one or two letters.
              runSearch(searchInput);
            }}
            className="relative mt-2"
          >
            <Search size={16} aria-hidden="true" className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              id="product-search"
              type="search"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Product name"
              aria-label="Search products"
              aria-describedby="product-search-hint"
              className="input pl-9"
            />
          </form>
          {/* Only speaks up while it has something to say: the letters still
              needed before the type-ahead starts. */}
          <p id="product-search-hint" className="mt-1.5 min-h-4 text-[11px] text-ink-soft/80" aria-live="polite">
            {typed.length > 0 && typed.length < TYPEAHEAD_MIN
              ? `Type ${TYPEAHEAD_MIN - typed.length} more letter${TYPEAHEAD_MIN - typed.length === 1 ? "" : "s"} to search`
              : ""}
          </p>

          {/* Product groups, under their range. */}
          {sections.map((r) => (
            <div key={r.id} className="mt-3 border-t border-brand-100/80 pt-4">
              <SectionLabel>{range ? "Product group" : r.name}</SectionLabel>
              <ul className="mt-2 space-y-0.5">
                {range && (
                  <li>
                    <OptionButton active={!activeSubcategoryId} onClick={() => updateParams({ category: r.slug })} count={r.productCount}>
                      All {r.name}
                    </OptionButton>
                  </li>
                )}
                {/* Every group, a new empty one too (its count reads 0). */}
                {r.children.map((sub) => (
                  <li key={sub.id}>
                    <OptionButton
                      active={sub.id === activeSubcategoryId}
                      onClick={() => updateParams({ category: sub.slug })}
                      count={sub.productCount}
                    >
                      {sub.name}
                    </OptionButton>
                  </li>
                ))}
                {!range && r.children.length === 0 && (
                  <li>
                    <OptionButton active={false} onClick={() => updateParams({ category: r.slug })} count={r.productCount}>
                      All {r.name}
                    </OptionButton>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>

        {/* Drawer footer: back to the results. */}
        <div className="border-t border-brand-100 p-4 lg:hidden">
          <button type="button" onClick={() => setDrawerOpen(false)} className="btn-primary w-full">
            {isPending ? "Updating…" : `Show ${total} ${total === 1 ? "product" : "products"}`}
          </button>
        </div>
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

// One product group: its name on one line (the full name on hover when cut
// short) and its count at the end. The chosen one fills with the range's soft
// colour, with an accent bar on its left edge and a tick.
function OptionButton({ active, onClick, count, disabled = false, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      title={typeof children === "string" ? children : undefined}
      className={clsx(
        "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition disabled:cursor-not-allowed disabled:opacity-40 lg:py-1.5 lg:text-[13px]",
        active
          ? "bg-(--range-soft) font-semibold text-(--range-text) shadow-[inset_3px_0_0_var(--range-accent)]"
          : "text-ink-soft enabled:hover:bg-mist-50 enabled:hover:text-ink"
      )}
    >
      <span className="min-w-0 flex-1 truncate">{children}</span>
      {active ? (
        <Check size={14} className="shrink-0" aria-hidden="true" />
      ) : (
        typeof count === "number" && <span className="shrink-0 text-[11px] tabular-nums text-ink-soft/70">{count}</span>
      )}
    </button>
  );
}
