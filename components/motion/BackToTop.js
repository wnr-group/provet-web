"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp } from "lucide-react";
import { useMotionEnv } from "@/components/motion/MotionProvider";

// A round button that rises into the bottom-right corner once the page has
// been scrolled a screenful, and takes you back to the top. Lifts on hover,
// presses in on click. Under reduced motion it appears without the travel and
// jumps instead of gliding.
export default function BackToTop() {
  const { reduced } = useMotionEnv();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" })}
          initial={{ opacity: 0, y: reduced ? 0 : 16, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: reduced ? 0 : 16, scale: 0.9 }}
          whileHover={reduced ? undefined : { y: -3 }}
          whileTap={reduced ? undefined : { scale: 0.92 }}
          transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-5 right-5 z-40 flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-brand-600 to-accent-500 text-white shadow-hover ring-1 ring-white/30 sm:bottom-8 sm:right-8"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </AnimatePresence>
  );
}
