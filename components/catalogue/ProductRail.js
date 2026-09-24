"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { useMotionEnv } from "@/components/motion/MotionProvider";

// A sideways row (related products, cover shelves) that a mouse user can
// actually move: arrow buttons page it along, each disabled at its end.
// Touch and trackpads scroll it natively, snapping item by item.
//
// `autoplay` (ms) advances one item at a time and wraps to the start after
// the last. It stands down whenever it would fight the visitor: while the
// pointer is over the rail or it has keyboard focus, for a while after an
// arrow press or a touch, while the rail is off-screen or the tab is hidden -
// and never runs under reduced motion.
export default function ProductRail({ title, children, autoplay = 0 }) {
  const ref = useRef(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [focused, setFocused] = useState(false);
  const [inView, setInView] = useState(false);
  const holdUntil = useRef(0);
  const { reduced } = useMotionEnv();

  // A visitor who just took control gets a breather before autoplay resumes.
  const hold = (ms = 8000) => {
    holdUntil.current = Date.now() + ms;
  };

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, [update]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !autoplay) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), { threshold: 0.4 });
    io.observe(el);
    return () => io.disconnect();
  }, [autoplay]);

  const paused = !autoplay || reduced || hovered || focused || !inView;

  useEffect(() => {
    if (paused) return;
    const t = setInterval(() => {
      const el = ref.current;
      if (!el || document.hidden || Date.now() < holdUntil.current) return;
      if (el.scrollWidth <= el.clientWidth + 4) return; // everything fits
      // Positions are measured from the first item, not the rail's edge, so
      // the rail's own padding can't make item 1 look like "the next one".
      const items = Array.from(el.children);
      if (!items.length) return;
      const origin = items[0].offsetLeft;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 4;
      const next = items.find((item) => item.offsetLeft - origin > el.scrollLeft + 8);
      el.scrollTo({ left: atEnd || !next ? 0 : next.offsetLeft - origin, behavior: "smooth" });
    }, autoplay);
    return () => clearInterval(t);
  }, [paused, autoplay]);

  const page = (dir) => {
    hold();
    ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.8, behavior: "smooth" });
  };

  const arrow =
    "flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-700 ring-1 ring-brand-200 transition hover:bg-brand-50 disabled:pointer-events-none disabled:opacity-30";

  return (
    <div
      onPointerEnter={(e) => e.pointerType === "mouse" && setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onFocus={() => setFocused(true)}
      onBlur={(e) => !e.currentTarget.contains(e.relatedTarget) && setFocused(false)}
      onTouchStart={() => hold()}
    >
      <div className="flex items-end justify-between gap-4">
        {title}
        <div className="hidden gap-2 sm:flex">
          <button type="button" onClick={() => page(-1)} disabled={!canPrev} aria-label="Scroll left" className={arrow}>
            <ChevronLeft size={17} />
          </button>
          <button type="button" onClick={() => page(1)} disabled={!canNext} aria-label="Scroll right" className={arrow}>
            <ChevronRight size={17} />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        className={clsx(
          "-mx-4 mt-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-4 pb-6 pt-2 sm:-mx-6 sm:gap-5 sm:px-6",
          "[scrollbar-width:thin]"
        )}
      >
        {children}
      </div>
    </div>
  );
}
