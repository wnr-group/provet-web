"use client";

import { motion } from "framer-motion";
import clsx from "clsx";
import { useMotionEnv } from "@/components/motion/MotionProvider";

// Entrance travel is capped hard on small screens. A 40px slide is a tenth of
// a desktop column but a tenth of the whole viewport on a phone, where it both
// reads as a lurch and pushes the element past the right edge before it
// animates in - which is how the homepage picked up a 9px horizontal scroll.
const MOBILE_MAX_DISTANCE = 14;
const DEFAULT_DISTANCE = 28;

function useTravel(distance = DEFAULT_DISTANCE) {
  const { isMobile, reduced } = useMotionEnv();
  if (reduced) return 0;
  return isMobile ? Math.min(distance, MOBILE_MAX_DISTANCE) : distance;
}

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

function offsetFor(direction, distance = DEFAULT_DISTANCE) {
  const unit = DIRECTIONS[direction] ?? DIRECTIONS.up;
  return { x: unit.x * distance, y: unit.y * distance };
}

// Fades + slides children into place. Use mode="mount" for anything above the
// fold (hero content, a detail page's main column) so it animates in
// immediately and deterministically rather than waiting on an
// IntersectionObserver callback that may lag on first paint; reserve the
// default mode="inView" scroll-reveal for content further down the page.
//
// mount mode is a CSS animation (.reveal-mount in globals.css), not a framer
// one. A framer entrance is server-rendered at opacity:0 and only revealed once
// the script has downloaded and hydrated, so the page's headline - usually its
// largest paint - could not appear until all of that JavaScript had run (on a
// phone, seconds). A CSS animation starts at first paint with the same travel,
// delay, duration and easing. The travel is clamped on small screens in CSS, so
// nothing depends on a JavaScript media query either.
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
  const offset = offsetFor(direction, useTravel(distance));
  const settled = { opacity: 1, x: 0, y: 0, ...(scale ? { scale: 1 } : {}) };

  if (mode === "mount") {
    const travel = offsetFor(direction, distance ?? DEFAULT_DISTANCE);
    const { style, ...rest } = props;
    return (
      <Component
        className={clsx("reveal-mount", className)}
        style={{
          "--rx": `${travel.x}px`,
          "--ry": `${travel.y}px`,
          "--rs": scale ?? 1,
          "--rd": `${duration}s`,
          "--rdelay": `${delay}s`,
          ...style,
        }}
        // Already in its settled state: the CSS animation does the entrance, so
        // framer must neither hide it before hydration nor replay it after.
        initial={false}
        animate={settled}
        {...rest}
      >
        {children}
      </Component>
    );
  }

  return (
    <Component
      data-motion=""
      className={className}
      initial={{ opacity: 0, ...offset, ...(scale ? { scale } : {}) }}
      transition={{ duration, delay, ease: [0.22, 1, 0.36, 1] }}
      whileInView={settled}
      viewport={{ once: true, margin: "-60px" }}
      {...props}
    >
      {children}
    </Component>
  );
}

// Wraps a grid/list of children, staggering each direct child's reveal.
// mode="mount" (above-the-fold content) animates immediately; the default
// mode="inView" waits for the group to scroll into the viewport.
// `as` lets a group wrap a real <ul>/<dl> instead of always a <div>, so a
// staggered list keeps its list semantics rather than having a div spliced
// between the list and its items. `delay` holds the whole group back, which is
// how a list is made to follow the heading that introduces it.
export function RevealGroup({
  children,
  className,
  stagger = 0.08,
  delay = 0,
  mode = "inView",
  as: Component = motion.div,
  ...props
}) {
  const Tag = typeof Component === "string" ? motion[Component] || motion.div : Component;
  const trigger =
    mode === "mount" ? { animate: "show" } : { whileInView: "show", viewport: { once: true, margin: "-60px" } };

  return (
    <Tag
      data-motion=""
      className={className}
      initial="hidden"
      variants={{
        hidden: {},
        show: { transition: { staggerChildren: stagger, delayChildren: delay } },
      }}
      {...trigger}
      {...props}
    >
      {children}
    </Tag>
  );
}

export function RevealItem({
  children,
  className,
  direction = "up",
  duration = 0.5,
  distance,
  scale,
  as: Component = motion.div,
}) {
  const Tag = typeof Component === "string" ? motion[Component] || motion.div : Component;
  const offset = offsetFor(direction, useTravel(distance));
  return (
    <Tag
      data-motion=""
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
    </Tag>
  );
}
