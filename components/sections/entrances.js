"use client";

import { motion } from "framer-motion";

// Entrance animations for the page sections.
//
// The point of this file is that the entrances are different *kinds* of
// motion, not the same one at different sizes. An earlier version varied
// direction, distance and scale between sections and every band still read
// the same while scrolling, because they were all "fade in and move a bit".
// Blurring, wiping, flipping and springing are told apart at a glance;
// 28px versus 80px is not.
//
// Each preset is a framer-motion variant pair, so a group can stagger its
// children by driving the same names.

const EASE = [0.22, 1, 0.36, 1];

export const ENTRANCES = {
  // Comes into focus without moving. Nothing else on the page holds still.
  blur: {
    hidden: { opacity: 0, filter: "blur(12px)" },
    show: { opacity: 1, filter: "blur(0px)", transition: { duration: 0.85, ease: EASE } },
  },

  // Uncovers left to right, like a line being drawn.
  wipe: {
    hidden: { opacity: 0, clipPath: "inset(0 100% 0 0)" },
    show: { opacity: 1, clipPath: "inset(0 0% 0 0)", transition: { duration: 0.6, ease: EASE } },
  },

  // Tips upright from lying back. Needs perspective on the container, which
  // <Enter>/<EnterGroup> set.
  flip: {
    hidden: { opacity: 0, rotateX: -65, y: 24 },
    show: { opacity: 1, rotateX: 0, y: 0, transition: { duration: 0.55, ease: EASE } },
  },

  // Starts overscaled and settles back, so the picture itself moves rather
  // than the box around it.
  zoom: {
    hidden: { opacity: 0, scale: 1.18 },
    show: { opacity: 1, scale: 1, transition: { duration: 0.75, ease: EASE } },
  },

  // Overshoots and settles - the only bouncy entrance on the page.
  spring: {
    hidden: { opacity: 0, y: 70 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 110, damping: 13 } },
  },

  // Snaps in from almost nothing, with a harder bounce than `spring`.
  pop: {
    hidden: { opacity: 0, scale: 0.4 },
    show: { opacity: 1, scale: 1, transition: { type: "spring", stiffness: 300, damping: 16 } },
  },

  // Travels in from the side, far enough to read as travel.
  slideLeft: {
    hidden: { opacity: 0, x: -90 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
  },
  slideRight: {
    hidden: { opacity: 0, x: 90 },
    show: { opacity: 1, x: 0, transition: { duration: 0.55, ease: EASE } },
  },

  // Drops from above; used for headings so they lead their content in.
  drop: {
    hidden: { opacity: 0, y: -34 },
    show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: EASE } },
  },
};

// `rotateX` collapses to nothing without a perspective on the parent, so any
// container that might hold a flip gets one. It is harmless otherwise.
const PERSPECTIVE = { perspective: 1000 };

// A single element entering on scroll.
export function Enter({ children, as: Component = motion.div, preset = "blur", delay = 0, className, ...props }) {
  const variants = ENTRANCES[preset] || ENTRANCES.blur;
  return (
    <Component
      data-motion=""
      className={className}
      style={PERSPECTIVE}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={variants}
      transition={{ delay }}
      {...props}
    >
      {children}
    </Component>
  );
}

// A grid or list whose children enter one after another. The children are
// <EnterItem>, which inherit the named variants from here.
export function EnterGroup({ children, className, stagger = 0.09, delay = 0, ...props }) {
  return (
    <motion.div
      data-motion=""
      className={className}
      style={PERSPECTIVE}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function EnterItem({ children, className, preset = "spring" }) {
  return (
    <motion.div data-motion="" className={className} variants={ENTRANCES[preset] || ENTRANCES.spring}>
      {children}
    </motion.div>
  );
}
