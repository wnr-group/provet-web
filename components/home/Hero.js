"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Pause, Play } from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import Counter from "@/components/motion/Counter";
import { useMotionEnv } from "@/components/motion/MotionProvider";
import SiteImage from "@/components/ui/SiteImage";
import { EASE } from "@/lib/motion";

// Requested at full-bleed width now that the image spans the viewport rather
// than sitting in a ~450px card.
const HERO_FALLBACK =
  "https://images.unsplash.com/photo-1589922583749-6b8473a85048?auto=format&fit=crop&w=1920&h=1080&q=80";

// The banner is admin-uploaded, so it can be any photo - light, busy, or
// low-contrast. These two layers guarantee the white text stays readable over
// whatever is behind it: a vertical wash on narrow screens (where the text
// sits over the middle of the image) and a left-weighted one from `sm` up
// (where the text occupies the left half and the photo should stay visible on
// the right). From `sm` the shade covers only the text column and fades out
// by the middle, so the right half shows the photo at full strength; a soft
// text shadow on the headline and intro carries legibility where it thins.
// Arbitrary values rather than `bg-gradient-to-*` so the direction switch is
// explicit and version-proof.
const OVERLAY_GRADIENT =
  "bg-[linear-gradient(to_bottom,rgba(21,18,48,0.62),rgba(21,18,48,0.45)_50%,rgba(21,18,48,0.72))] " +
  "sm:bg-[linear-gradient(to_right,rgba(21,18,48,0.86),rgba(21,18,48,0.6)_32%,rgba(21,18,48,0.15)_58%,transparent_78%)]";

// The badge and figures come from the "hero-stats" block in Admin > Website
// Content > Homepage (lib/homeContent.js), passed in by the page; these are
// the fallbacks. `badge` null or `stats` empty leaves that part out.
const STATS = [
  { value: "250+", label: "Products" },
  { value: "15+", label: "Years Experience" },
  { value: "1,200+", label: "Clinics Served" },
];

// How long a photo slide holds. A video slide holds until its video ends, but
// no longer than VIDEO_MAX_HOLD, so a long upload can't take the banner over.
const PHOTO_HOLD = 6000;
const VIDEO_MAX_HOLD = 30000;
// A video that hasn't started (or has stalled) for this long - a slow
// connection, a blocked autoplay - gives up and its slide carries on as a
// photo slide on its poster, so the slider never hangs on a black frame.
const VIDEO_START_TIMEOUT = 5000;

// A connection to spare: the data-saver flag (Chrome/Android) or a 2G/3G
// link. Read once; it rarely changes while the page is open.
const subscribeNever = () => () => {};
const readLiteConnection = () => {
  const c = navigator.connection;
  return Boolean(c?.saveData) || /2g|3g/.test(c?.effectiveType || "");
};

// The video waits for the page's own load to finish, so the poster (the
// largest paint) and the rest of the page never queue behind a few MB of it.
const subscribeLoad = (onChange) => {
  window.addEventListener("load", onChange);
  return () => window.removeEventListener("load", onChange);
};
const readLoaded = () => document.readyState === "complete";

const subscribeVisibility = (onChange) => {
  document.addEventListener("visibilitychange", onChange);
  return () => document.removeEventListener("visibilitychange", onChange);
};
const readVisible = () => document.visibilityState === "visible";

export default function Hero({ banners = [], badge = "Trusted by veterinarians nationwide", stats = STATS }) {
  const slides = useMemo(
    () =>
      banners.length
        ? banners
        : [
            {
              id: "default",
              title: "Quality Veterinary Medicine You Can Trust",
              subtitle:
                "Antibiotics, vaccines, supplements and therapeutic solutions formulated for better animal health outcomes.",
              image: HERO_FALLBACK,
              ctaText: "Explore Products",
              ctaLink: "/products",
            },
          ],
    [banners]
  );

  const [active, setActive] = useState(0);
  const sectionRef = useRef(null);
  const { isMobile, reduced } = useMotionEnv();

  // Hero identity: the banner drifts and fades against the scroll while the
  // copy stays put, so the section has depth as you leave it. Off on mobile
  // and under reduced motion - it is the only per-frame scroll work on the
  // page, and a phone is where that costs most.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const parallaxScale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);
  const copyFade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const flat = isMobile || reduced;

  const slide = slides[active];
  const next = slides[(active + 1) % slides.length];

  // Nothing plays or counts down while the hero is scrolled away or the tab
  // is in the background: the visitor comes back to the slide they left.
  const [inView, setInView] = useState(true);
  useEffect(() => {
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(sectionRef.current);
    return () => io.disconnect();
  }, []);
  const pageVisible = useSyncExternalStore(subscribeVisibility, readVisible, () => true);
  const onScreen = inView && pageVisible;
  // The visitor's pause button: holds the slide and its video.
  const [paused, setPaused] = useState(false);

  // A slide is a photo or a video (Admin > Banners). A video slide shows its
  // image (the poster) at once and fades its video in over it once playing -
  // unless the visitor asked for reduced motion or to save data, or the video
  // fails, is blocked or is too slow to start: then the poster stays and the
  // slide behaves exactly like a photo slide.
  const lite = useSyncExternalStore(subscribeNever, readLiteConnection, () => false);
  const loaded = useSyncExternalStore(subscribeLoad, readLoaded, () => false);
  const [failed, setFailed] = useState(() => new Set());
  const fail = useCallback((src) => setFailed((f) => (f.has(src) ? f : new Set(f).add(src))), []);
  const wantsVideo = Boolean(slide.video) && !reduced && !lite && !failed.has(slide.video);
  const mountsVideo = wantsVideo && loaded;
  // The video now showing (it fades in on its first frame) and whether it is
  // waiting on the network mid-play.
  const [playingSrc, setPlayingSrc] = useState(null);
  const [stalled, setStalled] = useState(false);
  const videoPlaying = mountsVideo && playingSrc === slide.video;

  // Slides that share one video (every slide set to the same Provet video)
  // play it as one continuous background: it keeps running, looping, while
  // the headline, text and button change over it on the photo timer.
  const continues = wantsVideo && slides.length > 1 && next.video === slide.video;
  // Who moves the slider on: the video's own end, or the photo clock.
  const videoTimed = wantsVideo && !continues;
  const rotates = slides.length > 1 && !reduced && !paused && onScreen;

  // Every slide change goes through here, so the clock, the progress bar and
  // the video handlers below always agree on which slide is current.
  const activeRef = useRef(0);
  const elapsed = useRef(0);
  const barRef = useRef(null);
  const paintBar = (p) => {
    if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
  };
  const goTo = useCallback(
    (i) => {
      // Arriving at a different video starts it fresh: the last pass's
      // playing/stalled state doesn't carry over, and a video that gave up
      // last time (a stall, a blocked play, a slow start) gets another try,
      // so every pass of the slider plays it again. Slides sharing one video
      // keep it running, so they skip this.
      if (slides[i].video && slides[i].video !== slides[activeRef.current].video) {
        setPlayingSrc(null);
        setStalled(false);
        setFailed((f) => (f.has(slides[i].video) ? new Set([...f].filter((s) => s !== slides[i].video)) : f));
      }
      activeRef.current = i;
      elapsed.current = 0;
      setActive(i);
    },
    [slides]
  );
  const goNext = useCallback(() => goTo((activeRef.current + 1) % slides.length), [goTo, slides.length]);

  // The photo clock: six seconds of time actually on screen and unpaused (it
  // stops and resumes rather than restarting), drawn into the active dot.
  useEffect(() => {
    if (!rotates || videoTimed) return;
    let frame;
    let last = performance.now();
    const tick = (now) => {
      elapsed.current += now - last;
      last = now;
      const p = Math.min(elapsed.current / PHOTO_HOLD, 1);
      if (barRef.current) barRef.current.style.transform = `scaleX(${p})`;
      if (p >= 1) return goNext();
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [active, rotates, videoTimed, goNext]);

  // The watchdog: a video that hasn't shown a frame, or has stalled, within
  // VIDEO_START_TIMEOUT of the slide being on screen gives way to its poster.
  useEffect(() => {
    if (!wantsVideo || paused || !onScreen || (videoPlaying && !stalled)) return;
    const src = slide.video;
    const t = setTimeout(() => fail(src), VIDEO_START_TIMEOUT);
    return () => clearTimeout(t);
  }, [wantsVideo, paused, onScreen, videoPlaying, stalled, slide.video, fail]);

  // The current slide's video element. A callback ref with a cleanup, not a
  // plain ref: a slide fading out still holds its own <video> for a moment,
  // and its unmount mustn't clear the ref the incoming slide just set.
  const videoRef = useRef(null);
  const attachVideo = useCallback((el) => {
    videoRef.current = el;
    return () => {
      if (videoRef.current === el) videoRef.current = null;
    };
  }, []);

  // React sets `muted` as a property, not an attribute, so the <video> isn't
  // muted when the browser decides on autoplay - and browsers only autoplay
  // muted video. Mute it, then play or pause it to match the hero's state. A
  // refused play() (autoplay blocked, low-power mode) falls back to the
  // poster; an AbortError is just a pause() overtaking it. On a slide without
  // a video the ref may still hold the outgoing slide's, fading out - left
  // alone, not restarted from its first frame.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !mountsVideo) return;
    el.muted = true;
    if (paused || !onScreen) {
      el.pause();
      return;
    }
    const src = slide.video;
    el.play().catch((err) => err?.name !== "AbortError" && fail(src));
  }, [mountsVideo, slide.video, paused, onScreen, fail]);

  // Handlers for the current slide's video only: a fading-out slide's video
  // (whose handlers still carry its old index) must not move the slider on.
  const own = active;
  const isCurrent = () => activeRef.current === own;
  const onVideoTime = (e) => {
    if (!isCurrent() || !videoTimed) return;
    const el = e.currentTarget;
    const hold = Math.min(el.duration || Infinity, VIDEO_MAX_HOLD / 1000);
    if (Number.isFinite(hold) && hold > 0) paintBar(Math.min(el.currentTime / hold, 1));
    if (slides.length > 1 && el.currentTime * 1000 >= VIDEO_MAX_HOLD) goNext();
  };

  // The background layer is keyed by the slide - or by the video for a video
  // slide, so slides sharing one keep the same element and it plays on
  // without restarting. A video that fails mid-slide changes the key, and
  // its layer crossfades to the poster-only one.
  const layerKey = wantsVideo ? `video:${slide.video}` : slide.id ?? slide.image;
  const loopsVideo = slides.length <= 1 || continues;
  const showsToggle = !reduced && (slides.length > 1 || mountsVideo);

  return (
    <section
      ref={sectionRef}
      aria-roledescription="carousel"
      aria-label="Highlights"
      className="relative isolate overflow-hidden bg-brand-900"
    >
      {/* Full-bleed banner: the image covers the whole section rather than
          sitting in a card, so it spans the viewport edge to edge. */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={flat ? undefined : { y: parallaxY, scale: parallaxScale }}
      >
        <AnimatePresence mode="sync">
          <motion.div
            key={layerKey}
            aria-hidden="true"
            // The photo fades in, then keeps easing back from a slight zoom
            // for the whole time the slide holds (a slow "Ken Burns" push),
            // so the hero is never a still image. A video slide brings its
            // own movement, so it only fades.
            initial={{ opacity: 0, scale: wantsVideo ? 1 : 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1, ease: EASE }, scale: { duration: 7.5, ease: "linear" } }}
            className="absolute inset-0"
          >
            {/* Site-hosted photos (/content/hero/...) go through Next's image
                optimizer, so each screen gets a WebP at its own width rather
                than the 2400px master; external URLs stay plain images. On a
                video slide this is the poster, under the video. */}
            <HeroPhoto src={slide.image || HERO_FALLBACK} eager />
            {mountsVideo && (
              <video
                ref={attachVideo}
                src={slide.video}
                muted
                playsInline
                disablePictureInPicture
                loop={loopsVideo}
                preload="auto"
                tabIndex={-1}
                onLoadStart={() => isCurrent() && setPlayingSrc(null)}
                onPlaying={(e) => {
                  if (!isCurrent()) return;
                  setPlayingSrc(e.currentTarget.getAttribute("src"));
                  setStalled(false);
                }}
                onWaiting={() => isCurrent() && setStalled(true)}
                onTimeUpdate={onVideoTime}
                onEnded={() => isCurrent() && slides.length > 1 && goNext()}
                onError={(e) => fail(e.currentTarget.getAttribute("src"))}
                // Hidden until its first frame plays, so the poster never
                // flashes black while the video buffers.
                className={clsx(
                  "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
                  videoPlaying ? "opacity-100" : "opacity-0"
                )}
              />
            )}
          </motion.div>
        </AnimatePresence>
        {/* The next slide's photo (a video slide's poster), loaded ahead out
            of sight - the same size as the visible one, so when it fades in
            it comes from the cache instead of popping in half-way through
            the crossfade. */}
        {slides.length > 1 && (
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 opacity-0">
            <HeroPhoto key={next.id ?? next.image} src={next.image || HERO_FALLBACK} />
          </div>
        )}
      </motion.div>
      <div className={clsx("pointer-events-none absolute inset-0 -z-10", OVERLAY_GRADIENT)} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(229,9,127,0.12),transparent_45%)]" />

      {/* A fixed height, not min-height: the banners have titles of 30-47
          characters, so with min-height the whole hero (and the image with
          it) grew or shrank as the slides rotated. The content is centred
          inside it and each text block below reserves its maximum number of
          lines, so nothing shifts between slides either. */}
      <div className="container-page relative flex h-[600px] flex-col justify-center pb-20 sm:h-[620px] sm:pb-24 lg:h-[680px]">
        {/* The copy holds still against the drifting image, then fades as the
            section leaves - the parallax reads as depth rather than the text
            sliding off on its own. */}
        <motion.div className="max-w-2xl" style={flat ? undefined : { opacity: copyFade }}>
          {badge && (
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, ease: EASE }}
              className="badge bg-white/10 text-accent-200 backdrop-blur-sm"
            >
              <ShieldCheck size={14} /> {badge}
            </motion.span>
          )}

          <AnimatePresence mode="wait">
            <motion.h1
              key={slide.id ?? slide.title}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
              // Three lines reserved (leading-[1.1] x 3), clamped to the
              // same, so a 30-character title and a 47-character one occupy
              // identical space and an over-long one can't stretch the hero.
              className="mt-5 line-clamp-3 min-h-[7.425rem] max-w-xl font-display text-4xl font-extrabold leading-[1.1] text-white [text-shadow:0_2px_16px_rgba(10,8,30,0.45)] sm:min-h-[9.9rem] sm:text-5xl"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            // Two lines reserved (leading-relaxed x 2) for the same reason.
            className="mt-5 line-clamp-2 min-h-[3.25rem] max-w-lg leading-relaxed text-white/90 [text-shadow:0_1px_10px_rgba(10,8,30,0.5)]"
          >
            {slide.subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link href={slide.ctaLink || "/products"} className="btn-accent">
              {slide.ctaText || "Explore Products"} <ArrowRight size={16} />
            </Link>
            <Link href="/contact" className="btn bg-white/10 text-white backdrop-blur-sm hover:bg-white/20">
              Talk to Our Team
            </Link>
          </motion.div>

          {stats.length > 0 && (
            <motion.dl
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.28 }}
              // A wrapping row, so two, three or four admin figures all sit
              // evenly rather than into a fixed three-column grid.
              className="mt-10 flex max-w-lg flex-wrap gap-x-10 gap-y-4 border-t border-white/10 pt-6"
            >
              {stats.map(({ value, label }) => (
                <div key={`${value}-${label}`}>
                  <dt className="font-display text-2xl font-extrabold text-white">
                    {value ? <Counter value={value} /> : null}
                  </dt>
                  <dd className="text-xs text-brand-200">{label}</dd>
                </div>
              ))}
            </motion.dl>
          )}
        </motion.div>

      </div>

      {(showsToggle || slides.length > 1) && (
        // Raised clear of the feature strip, which overlaps the hero's foot.
        // One row of controls for photos and videos alike: a pause button -
        // anything that moves on its own needs a way to stop it (WCAG
        // 2.2.2), and it holds both the rotation and the video - then a dot
        // per slide, the current one filling as its photo time or its video
        // runs.
        <div className="absolute inset-x-0 bottom-16 z-10 sm:bottom-20">
          <div className="container-page flex items-center gap-3">
            {showsToggle && (
              <button
                type="button"
                onClick={() => setPaused((p) => !p)}
                aria-label={
                  slides.length > 1
                    ? paused ? "Play slideshow" : "Pause slideshow"
                    : paused ? "Play background video" : "Pause background video"
                }
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
              >
                {paused ? <Play size={14} /> : <Pause size={14} />}
              </button>
            )}
            {slides.length > 1 && (
              <div role="group" aria-label="Choose a slide" className="flex items-center gap-2">
                {slides.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Show slide ${i + 1}${s.video ? " (video)" : ""}`}
                    aria-current={i === active ? "true" : undefined}
                    className={clsx(
                      "relative h-2 overflow-hidden rounded-full transition-all",
                      i === active ? "w-8 bg-white/30" : "w-2 bg-white/40 hover:bg-white/60"
                    )}
                  >
                    {i === active && (
                      // Written to directly by the clock and the video, not
                      // through state - a re-render a frame would be waste.
                      <span
                        ref={barRef}
                        className="absolute inset-0 origin-left rounded-full bg-accent-400"
                        style={{ transform: reduced ? "scaleX(1)" : "scaleX(0)" }}
                      />
                    )}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// One banner photo, filling the hero. `sizes="100vw"` because it spans the
// viewport; the visible one loads first and at high priority (it is the
// page's largest paint), the one loaded ahead for the next slide at low.
function HeroPhoto({ src, eager = false }) {
  return (
    <SiteImage
      src={src}
      alt=""
      sizes="100vw"
      eager
      fetchPriority={eager ? "high" : "low"}
      className="absolute inset-0 h-full w-full object-cover"
    />
  );
}
