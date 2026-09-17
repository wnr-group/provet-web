"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "framer-motion";

// Animates "250+", "1,200", "98%" etc. by extracting the leading number and
// counting up to it once the element scrolls into view, preserving any
// prefix/suffix text (currency symbols, "+", "%", commas).
export default function Counter({ value, duration = 1.4, className }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const match = String(value).match(/^(\D*)([\d,]+)(\D*)$/);
  const prefix = match?.[1] ?? "";
  const target = match ? Number(match[2].replace(/,/g, "")) : 0;
  const suffix = match?.[3] ?? "";
  const hasCommas = match?.[2]?.includes(",");

  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (!isInView || !match) return;
    const controls = animate(0, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setDisplay(Math.round(v)),
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView, target, duration]);

  if (!match) {
    return (
      <span ref={ref} className={className}>
        {value}
      </span>
    );
  }

  return (
    <span ref={ref} className={className}>
      {prefix}
      {hasCommas ? display.toLocaleString("en-IN") : display}
      {suffix}
    </span>
  );
}
