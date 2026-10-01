"use client";

import { useRef, useState } from "react";
import {
  motion,
  useInView,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import clsx from "clsx";
import { DURATION, EASE, STAGGER, TILT, VIEWPORT, VIEWPORT_WIDE } from "@/lib/motion";
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
        // is what actually moves. It reaches a little below the line box
        // (padding, taken back with an equal negative margin so the line
        // spacing is unchanged): with tight display leading, a mask exactly
        // one line tall sliced off the descenders of g, y, p, q and j.
        <span
          key={`${word}-${i}`}
          aria-hidden="true"
          className="-mb-[0.2em] inline-block overflow-hidden pb-[0.2em] align-bottom"
        >
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
export function MaskReveal({ children, className, wrapperClassName, direction = "up", delay = 0 }) {
  const { reduced } = useMotionEnv();
  // Visibility is watched on an unclipped wrapper, never on the masked
  // element itself. At rest that element is clipped to nothing, and browsers
  // disagree on whether a zero-area target counts as "in view" - on mobile
  // Safari it didn't, so the wipe never started and the photo stayed hidden
  // for good. The inner zoom had the same problem one level down (its
  // ancestor's clip made it invisible too), so both are driven from this one
  // signal instead of each running its own observer.
  const ref = useRef(null);
  const inView = useInView(ref, VIEWPORT);
  // A clip-path clips every descendant, including absolutely-positioned ones
  // that are *meant* to overhang the frame. Once the wipe has finished the
  // clip has no job left to do, so it is dropped entirely - otherwise an
  // element sitting outside the box stays silently sliced off forever. Anything
  // that must overhang should still live outside this component; this just
  // stops the failure being invisible when it does not.
  const [settled, setSettled] = useState(false);

  // `circle` opens the picture from its centre - an organic reveal for
  // secondary photos, where a straight wipe would repeat the main one.
  const from = {
    up: "inset(100% 0 0 0)",
    down: "inset(0 0 100% 0)",
    left: "inset(0 100% 0 0)",
    right: "inset(0 0 0 100%)",
    circle: "circle(0% at 50% 50%)",
  }[direction] || "inset(100% 0 0 0)";
  const to = direction === "circle" ? "circle(75% at 50% 50%)" : "inset(0% 0 0 0)";

  if (reduced) {
    return (
      <div className={wrapperClassName}>
        <div className={className}>{children}</div>
      </div>
    );
  }

  // `wrapperClassName` sizes the observed wrapper - e.g. h-full when the
  // reveal has to fill an absolutely positioned frame.
  return (
    <div ref={ref} className={wrapperClassName}>
      <motion.div
        data-motion=""
        className={className}
        initial={{ clipPath: from }}
        animate={inView ? { clipPath: to } : undefined}
        transition={{ duration: DURATION.slow, ease: EASE, delay }}
        onAnimationComplete={() => setSettled(true)}
        style={settled ? { clipPath: "none" } : undefined}
      >
        <motion.div
          initial={{ scale: 1.14 }}
          animate={inView ? { scale: 1 } : undefined}
          transition={{ duration: 1.1, ease: EASE, delay }}
          className="h-full w-full"
        >
          {children}
        </motion.div>
      </motion.div>
    </div>
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
   ScrollDrift - content that moves at its own speed as the page scrolls past.

   Ties a small Y offset (and optionally a slight scale and fade) to how far
   the element has scrolled up out of view, so text leaves a banner at a
   different speed from the photo behind it, or a large headline eases back as
   you move on. Only transform and opacity. The range is short on purpose:
   `y` is the travel in px across the element's whole exit.

   Disabled on mobile and under reduced motion, like Parallax - it runs on
   every scroll frame.
--------------------------------------------------------------------------- */
export function ScrollDrift({ children, className, y = -60, scale = 1, fade = 1 }) {
  const ref = useRef(null);
  const { isMobile, reduced } = useMotionEnv();
  const disabled = isMobile || reduced;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const ty = useTransform(scrollYProgress, [0, 1], [0, y]);
  const s = useTransform(scrollYProgress, [0, 1], [1, scale]);
  const o = useTransform(scrollYProgress, [0, 0.8], [1, fade]);

  return (
    <motion.div ref={ref} className={className} style={disabled ? undefined : { y: ty, scale: s, opacity: o }}>
      {children}
    </motion.div>
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

/* ---------------------------------------------------------------------------
   Tilt - a surface that leans toward the cursor in 3D.

   The pointer's position maps to rotateX/rotateY (`max` degrees at the
   edges), eased through the shared TILT spring. On hover the surface also
   lifts (`lift` scale) and, with `shadow`, a soft shadow beneath it slides
   the opposite way to the tilt - the cue that makes the lean read as a real
   object in light rather than a skewed rectangle. `glare` adds a highlight
   that follows the pointer. Children can float above the surface with
   translateZ: the rotating layer keeps `preserve-3d` (anything between it and
   them must too, and `overflow: hidden` in between flattens it).

   Flat, with no work done, under reduced motion and on touch devices. The
   element structure is the same either way, so switching on after hydration
   remounts nothing (no image reloads).
--------------------------------------------------------------------------- */
export function Tilt({
  children,
  className,
  max = 12,
  lift = 1.03,
  glare = false,
  shadow = false,
  glareClassName,
  shadowClassName,
}) {
  const { reduced, canHover } = useMotionEnv();
  const enabled = canHover && !reduced;

  const px = useMotionValue(0.5);
  const py = useMotionValue(0.5);
  const rotateX = useSpring(useTransform(py, [0, 1], [max, -max]), TILT.spring);
  const rotateY = useSpring(useTransform(px, [0, 1], [-max, max]), TILT.spring);
  const scale = useSpring(1, TILT.spring);
  const active = useSpring(0, TILT.spring);
  const glareX = useTransform(px, (v) => `${v * 100}%`);
  const glareY = useTransform(py, (v) => `${v * 100}%`);
  const glareBackground = useMotionTemplate`radial-gradient(circle at ${glareX} ${glareY}, rgba(255,255,255,0.5), transparent 55%)`;
  // The shadow moves against the tilt and grows as the surface lifts.
  const shadowX = useSpring(useTransform(px, [0, 1], [22, -22]), TILT.spring);
  const shadowY = useSpring(useTransform(py, [0, 1], [30, 6]), TILT.spring);
  const shadowScale = useTransform(active, [0, 1], [0.92, 1]);
  const shadowOpacity = useTransform(active, [0, 1], [0, 1]);

  const onPointerEnter = (e) => {
    if (!enabled || e.pointerType !== "mouse") return;
    scale.set(lift);
    active.set(1);
  };
  const onPointerMove = (e) => {
    if (!enabled || e.pointerType !== "mouse") return;
    const rect = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - rect.left) / rect.width);
    py.set((e.clientY - rect.top) / rect.height);
    scale.set(lift);
    active.set(1);
  };
  const onPointerLeave = () => {
    px.set(0.5);
    py.set(0.5);
    scale.set(1);
    active.set(0);
  };

  return (
    <div
      className={clsx("relative", className)}
      style={enabled ? { perspective: TILT.perspective } : undefined}
      onPointerEnter={onPointerEnter}
      onPointerMove={onPointerMove}
      onPointerLeave={onPointerLeave}
    >
      {shadow && enabled && (
        <motion.span
          aria-hidden="true"
          className={clsx(
            "pointer-events-none absolute inset-x-[8%] bottom-0 top-[12%] -z-10 rounded-3xl bg-brand-900/35 blur-2xl",
            shadowClassName
          )}
          style={{ x: shadowX, y: shadowY, scale: shadowScale, opacity: shadowOpacity }}
        />
      )}
      <motion.div
        className="relative h-full"
        style={enabled ? { rotateX, rotateY, scale, transformStyle: "preserve-3d" } : undefined}
      >
        {children}
        {glare && enabled && (
          <motion.span
            aria-hidden="true"
            className={clsx("pointer-events-none absolute inset-0 z-20 mix-blend-overlay", glareClassName)}
            style={{ background: glareBackground, opacity: active }}
          />
        )}
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ScrollTilt - 3D you see without touching anything.

   As the block scrolls up into view it swings from lying back (rotateX
   `amount` degrees, slightly scaled down) to flat, pivoting on its bottom
   edge - like a board being stood up. It is tied to scroll position, not a
   one-off animation, so it tracks the reader's own movement. Content is
   never hidden (no opacity), so nothing depends on it running.

   Off under reduced motion, and on phones: there the block is usually a
   tall single column, and a column that tall leaning back in 3D reads as
   skewed rather than as depth. Don't wrap anything position:sticky - a
   transformed ancestor breaks sticky positioning.
--------------------------------------------------------------------------- */
export function ScrollTilt({ children, className, amount = 16 }) {
  const ref = useRef(null);
  const { isMobile, reduced: reducedMotion } = useMotionEnv();
  const reduced = reducedMotion || isMobile;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 45%"] });
  const rotateX = useTransform(scrollYProgress, [0, 1], [amount, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);
  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);

  return (
    <div ref={ref} className={className} style={reduced ? undefined : { perspective: 1400 }}>
      <motion.div style={reduced ? undefined : { rotateX, scale, y, transformOrigin: "50% 100%" }}>
        {children}
      </motion.div>
    </div>
  );
}

/* ---------------------------------------------------------------------------
   ScrollExpand - a band that opens out to full width as it arrives.

   Starts as a slightly inset, rounded panel (scale `from`, corners `radius`)
   and grows to a full-bleed band with square corners by the time its top
   reaches the upper part of the viewport. Tied to scroll position, so it
   tracks the reader. Only transform and border-radius change - never layout.

   Off under reduced motion: the band is simply full width.
--------------------------------------------------------------------------- */
export function ScrollExpand({ children, className, from = 0.94, radius = 40 }) {
  const ref = useRef(null);
  const { reduced } = useMotionEnv();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 30%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const borderRadius = useTransform(scrollYProgress, [0, 1], [radius, 0]);

  // Same element either way, so the preference switching on after hydration
  // restyles the band instead of remounting it (and reloading its images).
  return (
    <motion.div
      ref={ref}
      style={reduced ? { scale: 1, borderRadius: 0 } : { scale, borderRadius }}
      className={clsx(!reduced && "overflow-hidden", className)}
    >
      {children}
    </motion.div>
  );
}
