"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";

// A slide carousel for image-led content - testimonials on the old Provet
// site are designed graphics rather than quotable text, so the slide is the
// picture and any caption sits underneath it.
//
// Autoplay pauses on hover, on focus, and while the tab is hidden, and is
// skipped entirely for visitors who ask for reduced motion.

const ASPECT = { square: "aspect-square", portrait: "aspect-[3/4]", landscape: "aspect-[4/3]", wide: "aspect-[16/9]" };

export default function Carousel({ items = [], aspect = "square", autoplay = true, interval = 6000, perView = 3 }) {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const total = items.length;
  const trackRef = useRef(null);

  const go = useCallback(
    (next) => {
      if (!total) return;
      setIndex(((next % total) + total) % total);
    },
    [total]
  );

  const next = useCallback(() => go(index + 1), [go, index]);
  const prev = useCallback(() => go(index - 1), [go, index]);

  useEffect(() => {
    if (!autoplay || paused || total <= 1) return;
    // Honour the OS "reduce motion" setting: an unbidden moving carousel is
    // exactly what that preference is meant to stop.
    if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

    const id = setInterval(() => setIndex((i) => (i + 1) % total), Math.max(2000, interval));
    return () => clearInterval(id);
  }, [autoplay, paused, total, interval]);

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
  const step = 100 / Math.min(perView, total);

  return (
    <div
      className="relative"
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
        <div
          className="flex transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          style={{ transform: `translateX(-${index * step}%)` }}
        >
          {items.map((item, i) => (
            <div
              key={i}
              className="w-full shrink-0 px-2 sm:w-1/2 lg:w-1/3"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} of ${total}`}
              aria-hidden={i < index || i >= index + perView}
            >
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
                    className="h-full w-full object-cover"
                  />
                </div>
                {(item.title || item.text) && (
                  <figcaption className="p-4">
                    {item.title && <p className="font-display font-semibold text-ink">{item.title}</p>}
                    {item.text && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                  </figcaption>
                )}
              </figure>
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            type="button"
            onClick={prev}
            aria-label="Previous testimonial"
            className="absolute -left-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-soft transition hover:bg-brand-50 sm:-left-4"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next testimonial"
            className="absolute -right-2 top-1/3 flex h-10 w-10 items-center justify-center rounded-full border border-brand-200 bg-white text-brand-700 shadow-soft transition hover:bg-brand-50 sm:-right-4"
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
                aria-current={i === index}
                className={clsx(
                  "h-2 rounded-full transition-all",
                  i === index ? "w-6 bg-accent-500" : "w-2 bg-brand-200 hover:bg-brand-300"
                )}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
