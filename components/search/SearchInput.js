"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

// The refine box on /search. Submitting navigates rather than fetching, so
// the results stay server-rendered and the URL is always shareable.
export default function SearchInput({ query = "" }) {
  const router = useRouter();
  const [value, setValue] = useState(query);

  // eslint-disable-next-line react-hooks/set-state-in-effect -- intentional: follow the URL when it changes from outside (back button, a result link, the header search box).
  useEffect(() => setValue(query), [query]);

  const submit = (e) => {
    e.preventDefault();
    const next = value.trim();
    router.push(next ? `/search?q=${encodeURIComponent(next)}` : "/search");
  };

  return (
    <form onSubmit={submit} className="relative w-full max-w-xl">
      <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-soft" />
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Search products, categories and pages..."
        aria-label="Search query"
        className="input h-12 pl-11 pr-11 text-base"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Clear search"
          className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-ink-soft hover:bg-brand-50"
        >
          <X size={16} />
        </button>
      )}
    </form>
  );
}
