"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import clsx from "clsx";
import { Enter } from "@/components/sections/entrances";
import SiteImage from "@/components/ui/SiteImage";
import { useMotionEnv } from "@/components/motion/MotionProvider";

// The "Expanding image panels" style of an Image cards section, as a feature
// reel: one large photo card on the left showing the chosen item, and a
// numbered list on the right to choose from. Pointing at (or focusing, or
// tapping) a row switches the card with a crossfade; left alone, the reel
// moves on every few seconds, with a thin progress bar on the active row, and
// stops while the pointer is over it or when the visitor prefers reduced
// motion. The first item starts selected.
//
// Phones and tablets have no hover, so there the items are a simple stack of
// photo cards with every caption shown.
const REEL_MS = 6000;

export default function ImageAccordion({ section, items }) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  // Auto-advance only for people who haven't asked for less motion.
  const { reduced } = useMotionEnv();
  const autoplay = !reduced;
  useEffect(() => {
    if (!autoplay || paused || items.length < 2) return undefined;
    const id = setTimeout(() => setActive((i) => (i + 1) % items.length), REEL_MS);
    return () => clearTimeout(id);
  }, [autoplay, paused, active, items.length]);

  const current = items[active] || items[0];

  return (
    <div>
      {(section.title || section.body) && (
        <Enter preset="drop" className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          {section.title && (
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{section.title}</h2>
          )}
          <span aria-hidden="true" className="mx-auto mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          {section.body && <p className="mt-4 leading-relaxed text-ink-soft">{section.body}</p>}
        </Enter>
      )}

      {/* Wide screens: the feature card and its list. */}
      <Enter
        preset="blur"
        className="hidden gap-6 lg:grid lg:grid-cols-12"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
      >
        <div className="col-span-7">
          <Link
            href={current.href || "#"}
            aria-label={current.title}
            className="group relative block h-[26rem] overflow-hidden rounded-[1.75rem] bg-mist-100 shadow-card ring-1 ring-brand-100/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500"
          >
            {items.map((item, i) =>
              item.image ? (
                <SiteImage
                  key={i}
                  src={item.image}
                  alt=""
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className={clsx(
                    "absolute inset-0 h-full w-full object-cover transition-[opacity,transform] duration-[900ms] ease-out group-hover:scale-105",
                    i === active ? "scale-100 opacity-100" : "scale-110 opacity-0"
                  )}
                />
              ) : null
            )}
            {/* Frosted caption card over the photo. */}
            <div className="absolute inset-x-4 bottom-4 rounded-2xl bg-white/85 p-6 shadow-soft ring-1 ring-white/60 backdrop-blur-md">
              <div key={active} className="reel-caption" style={{ animation: "reel-caption 0.5s ease-out" }}>
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold tabular-nums tracking-[0.16em] text-accent-600">
                    {String(active + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-xl font-bold tracking-tight text-ink">{current.title}</h3>
                </div>
                {current.text && <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{current.text}</p>}
                {current.href && (
                  <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-accent-500">
                    Explore <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
                  </span>
                )}
              </div>
            </div>
          </Link>
        </div>

        <ul className="col-span-5 flex flex-col gap-3">
          {items.map((item, i) => {
            const isActive = i === active;
            return (
              <li key={i} className="flex-1">
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onFocus={() => setActive(i)}
                  onClick={() => setActive(i)}
                  aria-current={isActive ? "true" : undefined}
                  className={clsx(
                    "relative flex h-full w-full items-center gap-4 overflow-hidden rounded-2xl px-5 py-4 text-left ring-1 transition-all duration-300",
                    isActive ? "bg-white shadow-lift ring-accent-300" : "bg-white/60 ring-brand-100/70 hover:bg-white hover:ring-brand-200"
                  )}
                >
                  <span
                    className={clsx(
                      "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl font-display text-sm font-bold tabular-nums transition-colors duration-300",
                      isActive ? "bg-gradient-to-br from-brand-600 to-accent-500 text-white" : "bg-brand-50 text-brand-700"
                    )}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-display text-base font-bold tracking-tight text-ink">{item.title}</span>
                    {item.text && <span className="mt-0.5 line-clamp-1 text-sm text-ink-soft">{item.text}</span>}
                  </span>
                  <ArrowRight
                    size={18}
                    aria-hidden="true"
                    className={clsx("shrink-0 transition-all duration-300", isActive ? "translate-x-0 text-accent-600 opacity-100" : "-translate-x-2 opacity-0")}
                  />
                  {/* Time left before the reel moves on. */}
                  {isActive && autoplay && items.length > 1 && (
                    <span
                      key={active}
                      aria-hidden="true"
                      className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-accent-500"
                      style={{ animation: `reel-progress ${REEL_MS}ms linear forwards`, animationPlayState: paused ? "paused" : "running" }}
                    />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </Enter>

      {/* Phones and tablets: a stack of photo cards, every caption shown. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
        {items.map((item, i) => {
          const card = (
            <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-100/70">
              {item.image && (
                <div className="relative aspect-[16/10] bg-mist-100">
                  <SiteImage src={item.image} alt="" sizes="(min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold tabular-nums tracking-[0.16em] text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">{item.title}</h3>
                </div>
                {item.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                {item.href && (
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                    Explore <ArrowUpRight size={15} />
                  </span>
                )}
              </div>
            </div>
          );
          return item.href ? (
            <Link key={i} href={item.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
