"use client";

import { motion } from "framer-motion";

const DIRECTIONS = {
  up: { y: 28, x: 0 },
  down: { y: -28, x: 0 },
  left: { y: 0, x: 28 },
  right: { y: 0, x: -28 },
  none: { y: 0, x: 0 },
};

// Fades + slides children into place. Use mode="mount" for anything above the
// fold (hero content, a detail page's main column) so it animates in
// immediately and deterministically rather than waiting on an
// IntersectionObserver callback that may lag on first paint; reserve the
// default mode="inView" scroll-reveal for content further down the page.
export default function Reveal({
  children,
  as: Component = motion.div,
  direction = "up",
  delay = 0,
  duration = 0.55,
  mode = "inView",
  className,
  ...props
}) {
  const offset = DIRECTIONS[direction] ?? DIRECTIONS.up;
  const trigger =
    mode === "mount"
      ? { animate: { opacity: 1, x: 0, y: 0 } }
      : { whileInView: { opacity: 1, x: 0, y: 0 }, viewport: { once: true, margin: "-60px" } };

  return (
    <Component
      className={className}
      initial={{ opacity: 0, ...offset }}
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

export function RevealItem({ children, className, direction = "up", duration = 0.5 }) {
  const offset = DIRECTIONS[direction] ?? DIRECTIONS.up;
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, ...offset },
        show: { opacity: 1, x: 0, y: 0, transition: { duration, ease: [0.22, 1, 0.36, 1] } },
      }}
    >
      {children}
    </motion.div>
  );
}
