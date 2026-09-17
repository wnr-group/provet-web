"use client";

import { motion } from "framer-motion";

// template.js remounts on every top-level navigation (unlike layout.js, which
// persists), so this is the natural place for an entrance transition.
// Deliberately entrance-only, no exit animation: an earlier version wrapped
// this in AnimatePresence with an exit fade, which faded the outgoing page
// out, then flashed the incoming page's own loading spinner before its data
// arrived, then faded in - a visible flicker. Animating only the mount
// avoids that entirely.
export default function Template({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
