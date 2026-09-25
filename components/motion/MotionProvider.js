"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { MotionConfig, useReducedMotion } from "framer-motion";
import { DISTANCE } from "@/lib/motion";

// Tracks whether we are on a small screen, so entrances can shorten their
// travel there rather than using one distance everywhere. Read through
// context so a page full of animated sections shares a single matchMedia
// listener instead of registering one per component.
const MotionEnvContext = createContext({ isMobile: false, reduced: false, canHover: false });

const MOBILE_QUERY = "(max-width: 767px)";
// A real mouse or trackpad. Pointer-driven effects (card tilt) only make
// sense here: a touchscreen has no hover position to follow, and a tap would
// leave a card stuck mid-tilt.
const HOVER_QUERY = "(hover: hover) and (pointer: fine)";

export function MotionProvider({ children }) {
  const reduced = useReducedMotion();
  // Starts false so server and first client render agree; the effect corrects
  // it before anything below the fold can animate.
  const [isMobile, setIsMobile] = useState(false);
  // Also starts false, so the server render and first paint are flat.
  const [canHover, setCanHover] = useState(false);

  // Tells the stylesheet the motion runtime is alive, which switches off the
  // "reveal everything" fallback in globals.css. Runs on hydration, so a build
  // whose JS never executes never gets here and the fallback stands.
  useEffect(() => {
    document.documentElement.classList.add("motion-ready");
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(MOBILE_QUERY);
    const hq = window.matchMedia(HOVER_QUERY);
    const sync = () => {
      setIsMobile(mq.matches);
      setCanHover(hq.matches);
    };
    sync();
    mq.addEventListener("change", sync);
    hq.addEventListener("change", sync);
    return () => {
      mq.removeEventListener("change", sync);
      hq.removeEventListener("change", sync);
    };
  }, []);

  return (
    // reducedMotion="user" makes framer-motion drop transforms for anyone with
    // the OS preference set, while still applying the final state - content
    // lands visible rather than being stuck at opacity 0.
    <MotionConfig reducedMotion="user" transition={{ ease: [0.22, 1, 0.36, 1] }}>
      <MotionEnvContext.Provider value={{ isMobile, reduced: Boolean(reduced), canHover }}>
        {children}
      </MotionEnvContext.Provider>
    </MotionConfig>
  );
}

export function useMotionEnv() {
  return useContext(MotionEnvContext);
}

// Returns the travel distance for a named size, already adjusted for screen
// size and for the reduced-motion preference (which gets zero travel).
export function useDistance(size = "md") {
  const { isMobile, reduced } = useMotionEnv();
  if (reduced) return 0;
  const pair = DISTANCE[size] || DISTANCE.md;
  return isMobile ? pair.mobile : pair.desktop;
}
