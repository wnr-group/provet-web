"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Search, X, Package, LayoutGrid, FileText, CornerDownLeft, Loader2 } from "lucide-react";
import clsx from "clsx";
import Highlight from "@/components/search/Highlight";
import { MIN_QUERY_LENGTH } from "@/lib/search";

const DEBOUNCE_MS = 220;
const PREVIEW_LIMIT = 5;

const PRODUCT_FALLBACK_IMG =
  "https://images.unsplash.com/photo-1664216294580-079bc527ae49?auto=format&fit=crop&w=120&h=120&q=60";

const EMPTY_RESULT = {
  query: "",
  total: 0,
  products: { items: [], total: 0 },
  categories: { items: [], total: 0 },
  pages: { items: [], total: 0 },
};

const GROUPS = [
  { key: "products", label: "Products", icon: Package },
  { key: "categories", label: "Categories", icon: LayoutGrid },
  { key: "pages", label: "Pages", icon: FileText },
];

// One flat list drives both the rendering order and the arrow keys, so the
// highlighted row and the row Enter opens can never disagree.
function flattenResults(result) {
  return [
    ...result.products.items.map((p) => ({
      id: `product-${p.id}`,
      group: "products",
      href: `/products/${p.slug}`,
      title: p.name,
      subtitle: p.shortDescription || p.category?.name || "",
      meta: p.category?.name,
      image: p.images?.[0] || PRODUCT_FALLBACK_IMG,
    })),
    ...result.categories.items.map((c) => ({
      id: `category-${c.id}`,
      group: "categories",
      href: `/products?category=${c.slug}`,
      title: c.name,
      subtitle: c.description || "",
      meta: typeof c.productCount === "number" ? `${c.productCount} products` : null,
    })),
    ...result.pages.items.map((p) => ({
      id: `page-${p.key}`,
      group: "pages",
      href: p.href,
      title: p.title,
      subtitle: p.excerpt || "",
      meta: null,
    })),
  ];
}

// `onOpen` lets the header fold its mobile menu away before the overlay
// covers it, so the two never sit on top of each other.
export default function GlobalSearch({ onOpen }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  // The last response *and the query it answers*, so both the results on
  // screen and the spinner can be derived rather than tracked: anything for a
  // query other than the one in the box is stale by definition, which is also
  // what makes a deleted character clear the list instantly.
  const [loaded, setLoaded] = useState({ query: "", data: EMPTY_RESULT });
  const [activeIndex, setActiveIndex] = useState(0);
  const listRef = useRef(null);

  const trimmed = query.trim();
  const isSearchable = trimmed.length >= MIN_QUERY_LENGTH;
  const fresh = isSearchable && loaded.query === trimmed;
  const result = fresh ? loaded.data : EMPTY_RESULT;
  const loading = isSearchable && !fresh;
  const items = useMemo(() => flattenResults(result), [result]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setLoaded({ query: "", data: EMPTY_RESULT });
  }, []);

  const go = useCallback(
    (href) => {
      close();
      router.push(href);
    },
    [close, router]
  );

  const openSearch = useCallback(() => {
    onOpen?.();
    setOpen(true);
  }, [onOpen]);

  // The page behind the overlay must not scroll with it.
  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [open]);

  // Debounced lookup. The abort matters as much as the delay: without it a
  // slow response for "amo" can land after the one for "amoxil" and overwrite
  // the newer results.
  useEffect(() => {
    if (!open || !isSearchable) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(trimmed)}&limit=${PREVIEW_LIMIT}`, {
          signal: controller.signal,
        });
        if (!res.ok) throw new Error("Search failed");
        setLoaded({ query: trimmed, data: await res.json() });
        setActiveIndex(0);
      } catch (err) {
        // A failed lookup settles on "no results" rather than spinning
        // forever; an aborted one is a newer keystroke taking over.
        if (err.name !== "AbortError") setLoaded({ query: trimmed, data: EMPTY_RESULT });
      }
    }, DEBOUNCE_MS);

    return () => {
      controller.abort();
      clearTimeout(timer);
    };
  }, [open, trimmed, isSearchable]);

  // Keep the highlighted row in view when the arrows walk past the fold.
  useEffect(() => {
    const node = listRef.current?.querySelector('[data-active="true"]');
    if (node) node.scrollIntoView({ block: "nearest" });
  }, [activeIndex, items]);

  // Keyboard handling is a native listener on `document`, not an onKeyDown
  // prop on the panel.
  //
  // The panel is portalled into <body>, outside the React root container, and
  // React's synthetic onKeyDown never fired there - Escape and the arrow keys
  // both did nothing while the input's own onChange kept working, which made
  // it look like the dialog was fine. A native listener sidesteps the
  // delegation question entirely, and also catches keys pressed when focus
  // has drifted off the input.
  useEffect(() => {
    if (!open) return;

    const handler = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
        return;
      }
      if (e.key === "ArrowDown" || e.key === "ArrowUp") {
        if (!items.length) return;
        e.preventDefault();
        setActiveIndex((i) => {
          const next = e.key === "ArrowDown" ? i + 1 : i - 1;
          return (next + items.length) % items.length;
        });
        return;
      }
      if (e.key === "Enter") {
        e.preventDefault();
        // Enter on a highlighted row opens it; Enter with nothing highlighted
        // (no results yet, or still typing) falls through to the full page.
        const active = items[activeIndex];
        if (active) go(active.href);
        else if (isSearchable) go(`/search?q=${encodeURIComponent(trimmed)}`);
      }
    };

    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, items, activeIndex, isSearchable, trimmed, go, close]);

  const triggerLabel = "Search products, categories and pages";

  // The overlay is rendered into <body> through a portal, NOT inline here.
  //
  // This component sits inside <header>, which carries `backdrop-blur`. A
  // backdrop-filter ancestor becomes the containing block for its
  // position:fixed descendants (same as transform or filter), so `inset-0`
  // resolved to the 80px header strip instead of the viewport and the panel
  // collapsed to zero height - the dialog was in the DOM but invisible.
  //
  // Portalling to <body> escapes that containing block. Don't inline it back.
  // No AnimatePresence here, deliberately. Its exiting child was never
  // removed from a portalled subtree: after closing, the overlay stayed in
  // the DOM at opacity 0 but with pointer-events:auto, and swallowed every
  // click on the page underneath. Unmounting the portal outright costs the
  // 150ms fade-out and cannot leave an invisible sheet over the site.
  const overlay = (
          <motion.div
            className="fixed inset-0 z-[60] flex justify-center bg-brand-900/40 p-4 backdrop-blur-sm sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.15 }}
            onClick={close}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={triggerLabel}
              className="mt-[6vh] flex max-h-[80vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-lift"
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center gap-3 border-b border-brand-100 px-4 py-3">
                <Search size={18} className="shrink-0 text-ink-soft" />
                <input
                  autoFocus
                  value={query}
                  onChange={(e) => {
                    setQuery(e.target.value);
                    setActiveIndex(0);
                  }}
                  placeholder="Search products, categories and pages..."
                  aria-label="Search query"
                  className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-ink-soft/60 sm:text-base"
                />
                {loading && <Loader2 size={16} className="shrink-0 animate-spin text-brand-400" />}
                <button
                  type="button"
                  onClick={close}
                  aria-label="Close search"
                  className="shrink-0 rounded-lg p-1.5 text-ink-soft hover:bg-brand-50"
                >
                  <X size={16} />
                </button>
              </div>

              <div ref={listRef} className="flex-1 overflow-y-auto">
                {!isSearchable ? (
                  <p className="px-4 py-10 text-center text-sm text-ink-soft">
                    Type at least {MIN_QUERY_LENGTH} characters to search the site.
                  </p>
                ) : !items.length ? (
                  <div className="px-4 py-10 text-center">
                    <p className="text-sm font-medium text-ink">
                      {loading ? "Searching..." : `No results for "${trimmed}"`}
                    </p>
                    {!loading && (
                      <p className="mt-1 text-sm text-ink-soft">Try a product name, a SKU or a category.</p>
                    )}
                  </div>
                ) : (
                  GROUPS.map(({ key, label, icon: Icon }) => {
                    const groupItems = items.filter((it) => it.group === key);
                    if (!groupItems.length) return null;
                    const total = result[key].total;

                    return (
                      <div key={key} className="border-b border-brand-50 last:border-b-0">
                        <div className="flex items-center justify-between px-4 pb-1 pt-3">
                          <span className="text-xs font-semibold uppercase tracking-wide text-ink-soft">{label}</span>
                          {total > groupItems.length && <span className="text-xs text-ink-soft">{total} matches</span>}
                        </div>
                        <ul className="pb-2">
                          {groupItems.map((item) => {
                            const index = items.indexOf(item);
                            const active = index === activeIndex;
                            return (
                              <li key={item.id}>
                                <button
                                  type="button"
                                  data-active={active}
                                  onMouseEnter={() => setActiveIndex(index)}
                                  onClick={() => go(item.href)}
                                  className={clsx(
                                    "flex w-full items-center gap-3 px-4 py-2.5 text-left transition",
                                    active ? "bg-brand-50" : "hover:bg-mist-50"
                                  )}
                                >
                                  {item.image ? (
                                    // eslint-disable-next-line @next/next/no-img-element -- uploaded/external product URLs, not a fixed set of remote hosts
                                    <img
                                      src={item.image}
                                      alt=""
                                      loading="lazy"
                                      className="h-10 w-10 shrink-0 rounded-lg object-cover"
                                    />
                                  ) : (
                                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-mist-100 text-brand-500">
                                      <Icon size={16} />
                                    </span>
                                  )}
                                  <span className="min-w-0 flex-1">
                                    <span className="block truncate text-sm font-medium text-ink">
                                      <Highlight text={item.title} query={trimmed} />
                                    </span>
                                    {item.subtitle && (
                                      <span className="block truncate text-xs text-ink-soft">
                                        <Highlight text={item.subtitle} query={trimmed} />
                                      </span>
                                    )}
                                  </span>
                                  {item.meta && (
                                    <span className="hidden shrink-0 text-xs text-ink-soft sm:block">{item.meta}</span>
                                  )}
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      </div>
                    );
                  })
                )}
              </div>

              {isSearchable && (
                <button
                  type="button"
                  onClick={() => go(`/search?q=${encodeURIComponent(trimmed)}`)}
                  className="flex items-center justify-between border-t border-brand-100 bg-mist-50/60 px-4 py-3 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
                >
                  <span>{result.total ? `View all ${result.total} results` : "View all results"}</span>
                  <span className="flex items-center gap-1.5 text-xs font-medium text-ink-soft">
                    <CornerDownLeft size={13} /> Enter
                  </span>
                </button>
              )}
            </motion.div>
          </motion.div>
  );

  return (
    <>
      <button
        type="button"
        onClick={openSearch}
        aria-label={triggerLabel}
        className="hidden items-center gap-2 rounded-full border border-brand-200 bg-white px-3 py-2 text-sm text-ink-soft transition hover:border-brand-300 hover:text-brand-700 lg:flex"
      >
        <Search size={16} />
        <span className="hidden xl:inline">Search...</span>
      </button>

      <button
        type="button"
        onClick={openSearch}
        aria-label={triggerLabel}
        className="rounded-lg p-2 text-brand-700 lg:hidden"
      >
        <Search size={22} />
      </button>

      {/* No document during SSR, and nothing rendered until it is opened. */}
      {open && typeof document !== "undefined" ? createPortal(overlay, document.body) : null}
    </>
  );
}
