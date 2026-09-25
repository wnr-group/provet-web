"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ChevronLeft, ChevronRight, Mail, Sparkles } from "lucide-react";
import clsx from "clsx";
import { Tilt } from "@/components/motion/effects";
import { useMotionEnv } from "@/components/motion/MotionProvider";
import { EASE } from "@/lib/motion";

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
      className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-brand-50 via-white to-accent-50 p-5 shadow-soft ring-1 ring-brand-100 sm:p-8"
    >
      <div className="grid items-center gap-6 md:grid-cols-[0.75fr_1.25fr] md:gap-10">
        {/* The stage */}
        <Tilt max={14} lift={1.05} shadow className="mx-auto w-full max-w-[16rem]">
          {/* Idle sway, so the stage reads as 3D before it is touched. */}
          <div className="animate-sway3d">
          <div className="relative aspect-square rounded-2xl bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,var(--color-mist-100)_60%,var(--color-brand-100)_100%)] ring-1 ring-white [transform-style:preserve-3d]">
            <span aria-hidden="true" className="absolute inset-[12%] rounded-full border border-brand-200/60" />
            <span
              aria-hidden="true"
              className="absolute bottom-[8%] left-1/2 h-4 w-1/2 -translate-x-1/2 rounded-full bg-brand-900/20 blur-lg"
            />
            {/* Depth on a static wrapper: the motion.div inside writes its own
                transform for the change animation. */}
            <div className="absolute inset-[16%] [transform:translateZ(80px)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={product.id}
                  data-motion=""
                  initial={{ opacity: 0, y: 18, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.97 }}
                  transition={{ duration: 0.5, ease: EASE }}
                  className="flex h-full w-full items-center justify-center"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs */}
                  <img
                    src={product.images?.[0]}
                    alt={product.name}
                    className="max-h-full max-w-full rounded-xl object-contain shadow-[0_18px_30px_-14px_rgba(21,18,48,0.45)]"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
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
                <p className="mt-4 text-sm font-medium text-brand-600">{product.category.name}</p>
              )}
              <h2 className="mt-1 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
                {product.name}
              </h2>
              {product.shortDescription && (
                <p className="mt-3 line-clamp-3 max-w-xl text-sm leading-relaxed text-ink-soft">
                  {product.shortDescription}
                </p>
              )}
              {product.packSize && (
                <p className="mt-3 inline-flex rounded-full bg-white px-3 py-1 text-xs font-medium text-ink-soft ring-1 ring-brand-100">
                  {product.packSize}
                </p>
              )}
            </motion.div>
          </AnimatePresence>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link href={`/products/${product.slug}`} className="btn-primary group">
              View product <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <Link href={`/contact?product=${encodeURIComponent(product.name)}`} className="btn-outline">
              <Mail size={16} /> Enquire
            </Link>
          </div>

          {count > 1 && (
            <div className="mt-6 flex items-center gap-2">
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
                      "h-10 w-10 shrink-0 overflow-hidden rounded-lg bg-white transition",
                      i === index ? "ring-2 ring-accent-500" : "opacity-60 ring-1 ring-brand-100 hover:opacity-100"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs */}
                    <img src={p.images?.[0]} alt="" className="h-full w-full object-contain" />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
