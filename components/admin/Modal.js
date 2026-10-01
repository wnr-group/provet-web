"use client";

import { useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// True only in the browser, without a hydration mismatch: the server (and the
// hydrating first render) report false, then the client flips to true.
const noopSubscribe = () => () => {};
const useIsClient = () =>
  useSyncExternalStore(
    noopSubscribe,
    () => true,
    () => false
  );

// Rendered through a portal into <body>. A `position: fixed` overlay inside an
// ancestor that has a transform (every entrance animation, the 3D tilts) is
// positioned and clipped by that ancestor instead of the viewport - which is
// how the brochure form ended up trapped inside the catalogue banner, behind
// the product cards. At the top of <body> nothing can contain it.
// `size`: "md" (default) for short forms, "xl" for wide editors with tables.
// `footer`: actions pinned under the scrolling body, so Save stays in reach
// however long the form gets.
const WIDTHS = { md: "max-w-lg", xl: "max-w-5xl" };

export default function Modal({ open, onClose, title, subtitle, size = "md", footer, children }) {
  const isClient = useIsClient();
  if (!isClient) return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          onClick={onClose}
        >
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label={title}
            className={`flex max-h-[90vh] w-full ${WIDTHS[size] || WIDTHS.md} flex-col overflow-hidden rounded-2xl bg-white text-ink shadow-lift`}
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-4 px-6 pb-4 pt-6">
              <div className="min-w-0">
                <h2 className="font-display text-lg font-semibold text-ink">{title}</h2>
                {subtitle && <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>}
              </div>
              <button onClick={onClose} aria-label="Close" className="rounded-lg p-1.5 text-ink-soft hover:bg-brand-50">
                <X size={18} />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">{children}</div>
            {footer && (
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-brand-100 bg-mist-50/60 px-6 py-3">
                {footer}
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  );
}
