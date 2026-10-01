"use client";

import { motion, useScroll, useSpring } from "framer-motion";
import { useMotionEnv } from "@/components/motion/MotionProvider";

// A thin brand-gradient bar across the very top of the window that fills as
// the page is scrolled - a quiet sense of where you are on a long page. Eased
// through a spring so it glides rather than jitters with the scroll wheel.
// Under reduced motion it still tracks the scroll, just without the easing.
export default function ScrollProgress() {
  const { reduced } = useMotionEnv();
  const { scrollYProgress } = useScroll();
  const eased = useSpring(scrollYProgress, { stiffness: 140, damping: 26, restDelta: 0.001 });

  return (
    <motion.div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[3px] origin-left bg-gradient-to-r from-brand-500 via-brand-400 to-accent-500"
      style={{ scaleX: reduced ? scrollYProgress : eased }}
    />
  );
}
