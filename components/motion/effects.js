"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { DURATION, EASE, STAGGER, VIEWPORT, VIEWPORT_WIDE } from "@/lib/motion";
import { useMotionEnv } from "@/components/motion/MotionProvider";

/* ---------------------------------------------------------------------------
   SplitText - editorial word-by-word reveal.

   Each word rides up from behind its own overflow-hidden mask, so the line
   uncovers itself rather than fading in as a block. Used for statement copy
   (the mission heading), never for body paragraphs: a hundred separately
   animated spans is both ugly and slow.

   Accessibility: the spans are decorative duplicates as far as assistive tech
   is concerned, so the wrapper carries the real text as its label and the
   pieces are hidden. Screen readers read one clean string.
--------------------------------------------------------------------------- */
export function SplitText({ text, as: Tag = "span", className, delay = 0, stagger = STAGGER.tight }) {
  const { reduced } = useMotionEnv();
  const words = String(text).split(/\s+/).filter(Boolean);

  if (reduced) {
    return <Tag className={className}>{text}</Tag>;
  }

  const MotionTag = motion[Tag] || motion.span;

  return (
    <MotionTag
      data-motion=""
      className={className}
      aria-label={text}
      initial="hidden"
      whileInView="show"
      viewport={VIEWPORT}
      variants={{ hidden: {}, show: { transition: { staggerChildren: stagger, delayChildren: delay } } }}
    >
      {words.map((word, i) => (
        // The mask is inline-block so it wraps with the text; the inner span
        // is what actually moves.
        <span key={`${word}-${i}`} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
          {/* data-motion on the *inner* span too: this is the one nested mover
              whose hidden state makes content unreadable rather than merely
              unstyled - it sits at translateY(110%) inside an overflow-hidden
              mask, so without the stylesheet fallback reaching it the whole
              heading would be blank if the bundle never ran. */}
          <motion.span
            data-motion=""
            className="inline-block"
            variants={{
              hidden: { y: "110%" },
              show: { y: 0, transition: { duration: DURATION.base, ease: EASE } },
            }}
          >
            {word}
            {i < words.length - 1 ? " " : ""}
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}

/* ---------------------------------------------------------------------------
   MaskReveal - a photo uncovered by a travelling clip-path.

   Distinct from a fade or a slide: the frame stays put and the picture is
   wiped into view, while the image itself drifts back from a slight overscale.
   Two properties, both compositor-friendly.
--------------------------------------------------------------------------- */
export function MaskReveal({ children, className, direction = "up", delay = 0 }) {
  const { reduced } = useMotionEnv();
  // A clip-path clips every descendant, including absolutely-positioned ones
  // that are *meant* to overhang the frame. Once the wipe has finished the
  // clip has no job left to do, so it is dropped entirely - otherwise an
  // element sitting outside the box stays silently sliced off forever. Anything
  // that must overhang should still live outside this component; this just
  // stops the failure being invisible when it does not.
  const [settled, setSettled] = useState(false);

  const from = {
    up: "inset(100% 0 0 0)",
    down: "inset(0 0 100% 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
  }[direction] || "inset(100% 0 0 0)";

  if (reduced) return <div className={className}>{children}</div>;

  return (
    <motion.div
      data-motion=""
      className={className}
      initial={{ clipPath: from }}
      whileInView={{ clipPath: "inset(0% 0 0 0)" }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
      onAnimationComplete={() => setSettled(true)}
      style={settled ? { clipPath: "none" } : undefined}
    >
      <motion.div
        initial={{ scale: 1.14 }}
        whileInView={{ scale: 1 }}
        viewport={VIEWPORT}
        transition={{ duration: 1.1, ease: EASE, delay }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

/* ---------------------------------------------------------------------------
   Parallax - ties a child's Y offset to the page scroll.

   Deliberately small (`distance` is in px, and the default is 40). Anything
   larger on a full-bleed image starts to detach from the copy sitting over it.
   Disabled outright on mobile and under reduced motion: it is the one effect
   here that runs work on every scroll frame, and a phone is where that is
   least affordable.
--------------------------------------------------------------------------- */
export function Parallax({ children, className, distance = 40, offset = ["start end", "end start"] }) {
  const ref = useRef(null);
  const { isMobile, reduced } = useMotionEnv();
  const disabled = isMobile || reduced;

  const { scrollYProgress } = useScroll({ target: ref, offset });
  const y = useTransform(scrollYProgress, [0, 1], [-distance, distance]);

  return (
    <div ref={ref} className={className}>
      {disabled ? children : <motion.div style={{ y }} className="h-full w-full">{children}</motion.div>}
    </div>
  );
}

/* ---------------------------------------------------------------------------
   DrawLine - a rule that draws itself outward from its centre.

   Used as a section divider / underline accent. scaleX on a 1px element is
   free; animating `width` would not be.
--------------------------------------------------------------------------- */
export function DrawLine({ className, delay = 0, origin = "center" }) {
  return (
    <motion.span
      aria-hidden="true"
      data-motion=""
      className={className}
      style={{ transformOrigin: origin }}
      initial={{ scaleX: 0 }}
      whileInView={{ scaleX: 1 }}
      viewport={VIEWPORT}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
    />
  );
}

/* ---------------------------------------------------------------------------
   CenterReveal - a band whose contents expand out of the middle.

   The CTA's identity: the panel scales up from 96% while its contents rise,
   so the whole block arrives as one object instead of a list of parts.
--------------------------------------------------------------------------- */
export function CenterReveal({ children, className, delay = 0 }) {
  return (
    <motion.div
      data-motion=""
      className={className}
      initial={{ opacity: 0, scale: 0.96 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={VIEWPORT_WIDE}
      transition={{ duration: DURATION.slow, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
}
