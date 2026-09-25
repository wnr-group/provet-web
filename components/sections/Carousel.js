"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import clsx from "clsx";
import { EASE } from "@/lib/motion";

// A slide carousel for image-led content - testimonials on the old Provet
// site are designed graphics rather than quotable text, so the slide is the
// picture and any caption sits underneath it.
//
// Autoplay pauses on hover, on focus, and while the tab is hidden, and is
// skipped entirely for visitors who ask for reduced motion.

const ASPECT = { square: "aspect-square", portrait: "aspect-[3/4]", landscape: "aspect-[4/3]", wide: "aspect-[16/9]" };

// Slide width per breakpoint, keyed by the most slides a carousel shows at
// once. A full-bleed rail can take a fourth column on wide screens; one
// inside the page column stays at three so its slides don't shrink.
const SLIDE_WIDTH = {
  3: "w-full sm:w-1/2 lg:w-1/3",
  4: "w-full sm:w-1/2 lg:w-1/3 xl:w-1/4",
};

// How many slides fit side by side. The breakpoints must match SLIDE_WIDTH,
// since the step size is derived from this count.
function useVisibleCount(max) {
  const [count, setCount] = useState(max);
  useEffect(() => {
    const queries = [
      [window.matchMedia("(min-width: 1280px)"), 4],
      [window.matchMedia("(min-width: 1024px)"), 3],
      [window.matchMedia("(min-width: 640px)"), 2],
    ];
    const update = () => setCount(Math.min(max, queries.find(([q]) => q.matches)?.[1] ?? 1));
    update();
    queries.forEach(([q]) => q.addEventListener("change", update));
    return () => queries.forEach(([q]) => q.removeEventListener("change", update));
  }, [max]);
  return count;
}

export default function Carousel({ items = [], aspect = "square", autoplay = true, interval = 6000, perView = 3 }) {
  const [index, setIndex] = useState(0);
  // True for a move that must not animate: the swap between a trailing copy
  // and the original slide it duplicates, which looks identical.
  const [instant, setInstant] = useState(false);
  const [paused, setPaused] = useState(false);
  const total = items.length;
  const visible = useVisibleCount(perView);
  const loop = total > 1;
  // The track loops: copies of the first slides trail the last one, so it
  // can keep stepping forward - even when every slide already fits on screen -
  // without ever sliding into empty space. Reaching the copy of slide 1 then
  // snaps back to the real slide 1 unseen.
  const slides = loop ? [...items, ...Array.from({ length: visible }, (_, k) => items[k % total])] : items;
  const trackRef = useRef(null);
  // Set while the track is being dragged, so letting go of a swipe over a
  // linked slide doesn't also follow the link.
  const dragged = useRef(false);

  const go = useCallback((i) => {
    setInstant(false);
    setIndex(i);
  }, []);

  const next = useCallback(() => {
    setInstant(false);
    setIndex((i) => Math.min(i + 1, total));
  }, [total]);

  const prev = useCallback(() => {
    if (index > 0) return go(index - 1);
    // Stepping back from slide 1: jump unseen to its trailing copy, then
    // animate one step back from there onto the last slide.
    setInstant(true);
    setIndex(total);
    requestAnimationFrame(() => requestAnimationFrame(() => go(total - 1)));
  }, [go, index, total]);

  useEffect(() => {
    if (!autoplay || paused || !loop) return;
    // Honour the OS "reduce motion" setting: an unbidden moving carousel is
    // exactly what that preference is meant to stop.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(next, Math.max(2000, interval));
    return () => clearInterval(id);
  }, [autoplay, paused, loop, interval, next]);

  // A carousel advancing in a tab nobody is looking at just burns cycles and
  // lands the visitor somewhere unexpected when they come back.
  useEffect(() => {
    const onVisibility = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const onKeyDown = (e) => {
    if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    }
  };

  if (!total) return null;

  const frame = ASPECT[aspect] || ASPECT.square;
  // How far to slide: one slide's width as a percentage of the track.
  const step = 100 / visible;

  return (
    <div
      // The side padding is the arrows' gutter, so they sit beside the
      // slides rather than on top of the graphics' text.
      className="relative sm:px-12"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div
        ref={trackRef}
        className="overflow-hidden"
        role="region"
        aria-roledescription="carousel"
        aria-label="Testimonials"
        tabIndex={0}
        onKeyDown={onKeyDown}
      >
        {/* The track is dragged rather than only stepped: on touch, flicking a
            carousel is the expected gesture, and the same handler gives the
            pointer a grab affordance on desktop. A drag that clears a tenth of
            the track, or is thrown hard enough, commits to the next slide;
            anything smaller springs back to where it started.

            `x` is animated, never `left`, so the whole gesture stays on the
            compositor. */}
        <motion.div
          className="flex cursor-grab active:cursor-grabbing"
          drag={loop ? "x" : false}
          dragElastic={0.12}
          dragMomentum={false}
          dragConstraints={{ left: 0, right: 0 }}
          onPointerDownCapture={() => {
            dragged.current = false;
          }}
          onDragStart={() => {
            setPaused(true);
            dragged.current = true;
          }}
          onDragEnd={(_, info) => {
            setPaused(false);
            const threshold = (trackRef.current?.offsetWidth ?? 0) / 10;
            const thrown = Math.abs(info.velocity.x) > 500;
            if (info.offset.x < -threshold || (thrown && info.velocity.x < 0)) next();
            else if (info.offset.x > threshold || (thrown && info.velocity.x > 0)) prev();
          }}
          animate={{ x: `${-index * step}%` }}
          transition={instant ? { duration: 0 } : { duration: 0.5, ease: EASE }}
          onAnimationComplete={() => {
            // Landed on the copy of slide 1: swap to the real one unseen.
            if (!instant && index === total) {
              setInstant(true);
              setIndex(0);
            }
          }}
        >
          {slides.map((item, i) => {
            const figure = (
              <figure className="overflow-hidden rounded-2xl border border-brand-100/70 bg-white shadow-soft">
                <div className={clsx("overflow-hidden bg-mist-100", frame)}>
                  {/* eslint-disable-next-line @next/next/no-img-element -- uploaded/external URLs, not a fixed set of remote hosts */}
                  <img
                    src={item.image}
                    // These graphics carry their text inside the image, so the
                    // alt is the only thing a screen reader gets. It is the
                    // admin's caption where there is one.
                    alt={item.title || "Customer testimonial"}
                    loading="lazy"
                    // The browser's native image drag would otherwise fight
                    // the track's drag gesture and leave a ghost image.
                    draggable={false}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out hover:scale-105"
                  />
                </div>
                {(item.title || item.text) && (
                  <figcaption className="p-4">
                    {item.title && <p className="font-display font-semibold text-ink">{item.title}</p>}
                    {item.text && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                  </figcaption>
                )}
              </figure>
            );
            const hidden = i < index || i >= index + visible;
            // A testimonial link usually points off-site (a review, a video),
            // so an absolute URL opens in a new tab with noopener.
            const external = /^https?:\/\//i.test(item.href || "");

            return (
              <div
                key={i}
                className={clsx("shrink-0 px-2 sm:px-3 lg:px-4", SLIDE_WIDTH[perView] || SLIDE_WIDTH[3])}
                role="group"
                aria-roledescription="slide"
                aria-label={`${(i % total) + 1} of ${total}`}
                aria-hidden={hidden}
              >
                {item.href ? (
                  <Link
                    href={item.href}
                    className="block rounded-2xl"
                    draggable={false}
                    tabIndex={hidden ? -1 : undefined}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    onClickCapture={(e) => {
                      if (dragged.current) e.preventDefault();
                    }}
                  >
                    {figure}
                  </Link>
                ) : (
                  figure
                )}
              </div>
            );
          })}
        </motion.div>
      </div>

      {loop && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="group absolute -left-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-soft transition duration-200 hover:-translate-x-0.5 hover:bg-brand-50 hover:shadow-card sm:left-0"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="group absolute -right-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-soft transition duration-200 hover:translate-x-0.5 hover:bg-brand-50 hover:shadow-card sm:right-0"
          >
            <ChevronRight size={18} />
          </button>

          <div className="mt-6 flex justify-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => go(i)}
                aria-label={`Go to testimonial ${i + 1}`}
                aria-current={i === index % total}
                className={clsx(
                  "h-2 rounded-full transition-all",
                  i === index % total ? "w-6 bg-accent-500" : "w-2 bg-brand-200 hover:bg-brand-300"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
