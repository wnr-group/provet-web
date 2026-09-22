"use client";

import { motion } from "framer-motion";

// Unit vectors; `distance` scales them. Keeping the travel adjustable is what
// lets one section drift a few pixels and another sweep in from off to the
// side - with a single fixed offset every section animates near enough
// identically however the directions are varied.
const DIRECTIONS = {
  up: { y: 1, x: 0 },
  down: { y: -1, x: 0 },
  left: { y: 0, x: 1 },
  right: { y: 0, x: -1 },
  none: { y: 0, x: 0 },
};

const DEFAULT_DISTANCE = 28;

function offsetFor(direction, distance = DEFAULT_DISTANCE) {
  const unit = DIRECTIONS[direction] ?? DIRECTIONS.up;
  return { x: unit.x * distance, y: unit.y * distance };
}

// Fades + slides children into place. Use mode="mount" for anything above the
// fold (hero content, a detail page's main column) so it animates in
// immediately and deterministically rather than waiting on an
// IntersectionObserver callback that may lag on first paint; reserve the
// default mode="inView" scroll-reveal for content further down the page.
// `scale` is optional and off by default: passing e.g. 0.96 makes the child
// grow into place as well as fade, which is what distinguishes a panel that
// arrives as one piece from the plain slide every other section uses. Left
// unset the animation is byte-for-byte what it was before.
export default function Reveal({
  children,
  as: Component = motion.div,
  direction = "up",
  delay = 0,
  duration = 0.55,
  distance,
  scale,
  mode = "inView",
  className,
  ...props
}) {
  const offset = offsetFor(direction, distance);
  const settled = { opacity: 1, x: 0, y: 0, ...(scale ? { scale: 1 } : {}) };
  const trigger =
    mode === "mount"
      ? { animate: settled }
      : { whileInView: settled, viewport: { once: true, margin: "-60px" } };

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset, ...(scale ? { scale } : {}) }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      {...trigger}
      {...props}
    >
      {children}
    </Component>
  );
}

// Wraps a grid/list of children, staggering each direct child's reveal.
// mode="mount" (above-the-fold content) animates immediately; the default
// mode="inView" waits for the group to scroll into the viewport.
export function RevealGroup({ children, className, stagger = 0.08, mode = "inView", ...props }) {
  const trigger =
    mode === "mount" ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } };

  return (
    <motion.div
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger } },
      }}
      {...trigger}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function RevealItem({ children, className, direction = "up", duration = 0.5, distance, scale }) {
  const offset = offsetFor(direction, distance);
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset, ...(scale ? { scale } : {}) },
        show: {
          opacity: 1,
          x: 0,
          y: 0,
          ...(scale ? { scale: 1 } : {}),
          transition: { duration, ease: [0.22, 1, 0.36, 1] },
        },
      }}
    >
      {children}
    </motion.div>
  );
}
