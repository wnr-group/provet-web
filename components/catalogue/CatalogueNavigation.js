"use client";

import { createContext, useCallback, useContext, useMemo, useTransition } from "react";
import { useRouter } from "next/navigation";
import clsx from "clsx";

// The catalogue's filter, search and pagination changes, run as one React
// transition so the page knows a new result set is on its way. Without it the
// old products just sat there until the new ones arrived, and a click on a
// filter looked like it had done nothing.
const CatalogueNavigationContext = createContext(null);

export function CatalogueNavigationProvider({ children }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // `replace` (type-ahead): one history entry for the whole search, and the
  // scroll position kept. Otherwise a normal push.
  const navigate = useCallback(
    (url, { replace = false } = {}) =>
      startTransition(() => (replace ? router.replace(url, { scroll: false }) : router.push(url))),
    [router]
  );

  const value = useMemo(() => ({ navigate, isPending }), [navigate, isPending]);
  return <CatalogueNavigationContext.Provider value={value}>{children}</CatalogueNavigationContext.Provider>;
}

// Outside a provider it still navigates, just without the pending state.
export function useCatalogueNavigation() {
  const context = useContext(CatalogueNavigationContext);
  const router = useRouter();
  if (context) return context;
  return {
    isPending: false,
    navigate: (url, { replace = false } = {}) => (replace ? router.replace(url, { scroll: false }) : router.push(url)),
  };
}

// Wraps the results. While new ones load the current grid stays in place,
// dimmed, with a progress bar sweeping along its top - no blank space, and
// nothing jumps when the new cards arrive.
export function PendingResults({ children }) {
  const { isPending } = useCatalogueNavigation();
  return (
    <div aria-busy={isPending} className="relative">
      <div
        aria-hidden="true"
        className={clsx(
          "pointer-events-none absolute inset-x-0 -top-3 h-0.5 overflow-hidden rounded-full transition-opacity duration-200",
          isPending ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="h-full w-1/3 animate-[catalogue-progress_1.1s_ease-in-out_infinite] rounded-full bg-(--range-accent)" />
      </div>
      <div className={clsx("transition-opacity duration-200", isPending && "pointer-events-none opacity-55")}>{children}</div>
    </div>
  );
}
