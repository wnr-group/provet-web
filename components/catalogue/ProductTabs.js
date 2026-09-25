"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { FlaskConical, ListChecks, PackageCheck, Stethoscope } from "lucide-react";

// The product's long-form fields as one tabbed card, instead of four stacked
// blocks of text: the reader picks Composition / Uses / Dosage and reads one
// at a time. A pill slides under the active tab (layoutId). Proper tablist
// semantics - arrow keys move between tabs, each panel is labelled by its tab.
const ICONS = { composition: FlaskConical, uses: Stethoscope, dosage: ListChecks, applications: PackageCheck };

export default function ProductTabs({ fields }) {
  const [active, setActive] = useState(fields[0]?.key);
  const tabRefs = useRef([]);
  if (!fields.length) return null;

  const current = fields.find((f) => f.key === active) || fields[0];

  const onKeyDown = (e, i) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (i + delta + fields.length) % fields.length;
    setActive(fields[next].key);
    tabRefs.current[next]?.focus();
  };

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-soft ring-1 ring-brand-100">
      <div
        role="tablist"
        aria-label="Product information"
        className="flex gap-1 overflow-x-auto border-b border-brand-100 bg-mist-50/70 p-1.5 [scrollbar-width:none]"
      >
        {fields.map((field, i) => {
          const Icon = ICONS[field.key] || ListChecks;
          const selected = field.key === current.key;
          return (
            <button
              key={field.key}
              ref={(el) => (tabRefs.current[i] = el)}
              type="button"
              role="tab"
              id={`tab-${field.key}`}
              aria-selected={selected}
              aria-controls={`panel-${field.key}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(field.key)}
              onKeyDown={(e) => onKeyDown(e, i)}
              className={clsx(
                "relative flex shrink-0 items-center gap-2 rounded-2xl px-4 py-2.5 text-sm font-semibold transition-colors",
                selected ? "text-brand-700" : "text-ink-soft hover:text-ink"
              )}
            >
              {selected && (
                <motion.span
                  layoutId="product-tab-pill"
                  className="absolute inset-0 rounded-2xl bg-white shadow-soft ring-1 ring-brand-100"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
              <Icon size={15} className="relative" />
              <span className="relative">{field.title}</span>
            </button>
          );
        })}
      </div>

      <motion.div
        key={current.key}
        data-motion=""
        role="tabpanel"
        id={`panel-${current.key}`}
        aria-labelledby={`tab-${current.key}`}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="whitespace-pre-line p-6 text-[15px] leading-relaxed text-ink-soft sm:p-8"
      >
        {current.value}
      </motion.div>
    </div>
  );
}
