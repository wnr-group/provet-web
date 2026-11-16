"use client";

import { Children, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useMotionEnv } from "@/components/motion/MotionProvider";

// How long the slider rests on a set of tiles before moving on.
const AUTO_MS = 4500;

// The Top Brands slider: tiles in one scroll-snapping row, one, two or three
// to a view by screen width. It moves on by itself (a smooth scroll, back to
// the start at the end), pauses while hovered, focused or scrolled out of
// view, and has arrows and dots; a swipe or the trackpad works too. Tiles in
// view are full size and opaque, the ones at the edges sit slightly back, and
// the change eases as the row moves.
export default function BrandSlider({ children, label = "Top brands" }) {
  const items = Children.toArray(children);
  const trackRef = useRef(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(() => new Set([0]));
  const [paused, setPaused] = useState(false);
  const [inView, setInView] = useState(true);
  const { reduced } = useMotionEnv();

  // Which tiles are fully in view, for the depth effect and the dots.
  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const io = new IntersectionObserver(
      (entries) =>
        setVisible((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            const i = Number(e.target.dataset.index);
            if (e.intersectionRatio >= 0.7) next.add(i);
            else next.delete(i);
          }
          return next;
        }),
      { root: track, threshold: [0.3, 0.7, 0.95] }
    );
    track.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting));
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);

  const move = useCallback(
    (dir) => {
      const track = trackRef.current;
      if (!track) return;
      const tile = track.querySelector("[data-index]");
      const step = tile ? tile.getBoundingClientRect().width + parseFloat(getComputedStyle(track).columnGap || 0) : track.clientWidth;
      const atEnd = track.scrollLeft + track.clientWidth >= track.scrollWidth - 4;
      const atStart = track.scrollLeft <= 4;
      if (dir > 0 && atEnd) track.scrollTo({ left: 0, behavior: reduced ? "auto" : "smooth" });
      else if (dir < 0 && atStart) track.scrollTo({ left: track.scrollWidth, behavior: reduced ? "auto" : "smooth" });
      else track.scrollBy({ left: dir * step, behavior: reduced ? "auto" : "smooth" });
    },
    [reduced]
  );

  useEffect(() => {
    if (reduced || paused || !inView || items.length < 2) return;
    const t = setInterval(() => move(1), AUTO_MS);
    return () => clearInterval(t);
  }, [reduced, paused, inView, items.length, move]);

  const goTo = (i) => {
    const el = trackRef.current?.querySelector(`[data-index="${i}"]`);
    if (el) trackRef.current.scrollTo({ left: el.offsetLeft - trackRef.current.offsetLeft, behavior: reduced ? "auto" : "smooth" });
  };
  const first = Math.min(...visible);

  return (
    <div
      ref={sectionRef}
      role="region"
      aria-roledescription="carousel"
      aria-label={label}
      className="relative mt-8"
      // Paused only while a mouse rests on it: a tap or a click on an arrow
      // (which leaves focus behind) must not stop it for good.
      onPointerEnter={(e) => e.pointerType === "mouse" && setPaused(true)}
      onPointerLeave={() => setPaused(false)}
    >
      <ul
        ref={trackRef}
        className="-mx-4 flex snap-x snap-mandatory scroll-px-4 gap-5 overflow-x-auto px-4 pb-6 pt-2 [scrollbar-width:none] sm:mx-0 sm:scroll-px-0 sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {items.map((child, i) => (
          <li
            key={child.key ?? i}
            data-index={i}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${items.length}`}
            className={clsx(
              "w-[62%] shrink-0 snap-start transition-all duration-500 ease-out sm:w-[calc(50%-0.625rem)] md:w-[calc((100%-2.5rem)/3)] lg:w-[calc((100%-3.75rem)/4)]",
              visible.has(i) ? "scale-100 opacity-100" : "scale-[0.94] opacity-50"
            )}
          >
            {child}
          </li>
        ))}
      </ul>

      {items.length > 1 && (
        <div className="flex items-center justify-center gap-4">
          <ArrowButton label="Previous brands" onClick={() => move(-1)}>
            <ChevronLeft size={18} />
          </ArrowButton>
          <div className="flex items-center gap-2">
            {items.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => goTo(i)}
                aria-label={`Go to brand ${i + 1}`}
                aria-current={visible.has(i) ? "true" : undefined}
                className={clsx(
                  "h-2 rounded-full transition-all duration-300",
                  i === first ? "w-6 bg-accent-500" : visible.has(i) ? "w-2 bg-brand-600" : "w-2 bg-brand-200 hover:bg-brand-300"
                )}
              />
            ))}
          </div>
          <ArrowButton label="Next brands" onClick={() => move(1)}>
            <ChevronRight size={18} />
          </ArrowButton>
        </div>
      )}
    </div>
  );
}

function ArrowButton({ label, onClick, children }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-brand-700 shadow-soft ring-1 ring-brand-100 transition hover:bg-brand-600 hover:text-white hover:shadow-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500"
    >
      {children}
    </button>
  );
}
