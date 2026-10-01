"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Mail, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Tilt } from "@/components/motion/effects";
import { useMotionEnv } from "@/components/motion/MotionProvider";
import { EASE } from "@/lib/motion";
import SiteImage from "@/components/ui/SiteImage";

// The catalogue's featured product, one at a time, in a light card - a lead
// item presented properly instead of as the first cell of the grid.
//
// Left: the product on a pedestal inside a Tilt, floating in front of its
// backdrop. Right: the copy and actions. Products change with a crossfade
// and lift, every 7s or from the arrows / thumbnails; it pauses while the
// pointer or focus is inside, and never auto-advances under reduced motion.
export default function FeaturedSpotlight({ products }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const { reduced } = useMotionEnv();
  const count = products.length;
  const product = products[index];

  useEffect(() => {
    if (count < 2 || paused || reduced) return;
    const t = setInterval(() => setIndex((i) => (i + 1) % count), 7000);
    return () => clearInterval(t);
  }, [count, paused, reduced]);

  if (!product) return null;
  const go = (delta) => setIndex((i) => (i + delta + count) % count);

  return (
    <section
      aria-roledescription="carousel"
      aria-label="Featured products"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-accent-50 p-4 shadow-soft ring-1 ring-brand-100 sm:p-6"
    >
      {/* Kept compact: it introduces the catalogue rather than competing with
          it, so the product grid stays close to the top of the page. */}
      <div className="grid items-center gap-5 sm:grid-cols-[8.5rem_1fr] md:grid-cols-[10rem_1fr] md:gap-8">
        {/* The stage */}
        <Tilt max={14} lift={1.05} shadow className="mx-auto w-full max-w-[9rem] sm:max-w-none">
          {/* Idle sway, so the stage reads as 3D before it is touched. */}
          <div className="animate-sway3d">
          {/* The label artwork fills the square, zoomed just enough
              (scale-106) to trim the thin frame line at its edge - the same
              treatment as the catalogue cards. */}
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-white shadow-card ring-1 ring-brand-100">
            <AnimatePresence mode="wait">
              <motion.div
                key={product.id}
                data-motion=""
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.5, ease: EASE }}
                className="relative h-full w-full"
              >
                <SiteImage
                  src={product.images?.[0]}
                  alt={product.name}
                  sizes="(min-width: 768px) 160px, 144px"
                  className="h-full w-full scale-106 object-cover"
                />
              </motion.div>
            </AnimatePresence>
          </div>
          </div>
        </Tilt>

        {/* The copy */}
        <div className="min-w-0">
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent-600">
            <Sparkles size={13} /> Featured product
            <span className="ml-auto font-display tabular-nums tracking-normal text-ink-soft">
              {index + 1} / {count}
            </span>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={product.id}
              data-motion=""
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -12 }}
              transition={{ duration: 0.4, ease: EASE }}
            >
              {product.category?.name && (
                <p className="mt-2 text-sm font-medium text-brand-600">
                  {[product.category.name, product.subcategory?.name].filter(Boolean).join(" · ")}
                </p>
              )}
              <h2 className="mt-0.5 font-display text-xl font-extrabold tracking-tight text-ink sm:text-2xl">
                {product.name}
              </h2>
              {product.shortDescription && (
                <p className="mt-2 line-clamp-2 max-w-2xl text-sm leading-relaxed text-ink-soft">
                  {product.shortDescription}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          {/* Actions, pack size and the slide controls share one row. */}
          <div className="mt-4 flex flex-wrap items-center gap-2.5">
            <Link href={`/products/${product.slug}`} className="btn-primary group py-2">
              View product <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-outline py-2">
              <Mail size={16} /> Enquire
            </Link>
            {product.packSize && (
              <span className="rounded-full bg-white px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-brand-100">
                {product.packSize}
              </span>
            )}

          {count > 1 && (
            <div className="flex items-center gap-2 sm:ml-auto">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous featured product"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50"
              >
                <ChevronLeft size={17} />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next featured product"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50"
              >
                <ChevronRight size={17} />
              </button>
              <div className="ml-1 flex min-w-0 gap-2 overflow-x-auto p-1 [scrollbar-width:none]">
                {products.map((p, i) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-label={`Show ${p.name}`}
                    aria-current={i === index}
                    className={clsx(
                      "relative h-9 w-9 shrink-0 overflow-hidden rounded-lg bg-white transition",
                      i === index ? "ring-2 ring-accent-500" : "opacity-60 ring-1 ring-brand-100 hover:opacity-100"
                    )}
                  >
                    <SiteImage src={p.images?.[0]} sizes="36px" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}
          </div>
        </div>
      </div>
    </section>
  );
}
