"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "framer-motion";
import clsx from "clsx";
import Counter from "@/components/motion/Counter";
import { useMotionEnv } from "@/components/motion/MotionProvider";
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
// the right). Arbitrary values rather than `bg-gradient-to-*` so the
// direction switch is explicit and version-proof.
const OVERLAY_GRADIENT =
  "bg-[linear-gradient(to_bottom,rgba(21,18,48,0.88),rgba(21,18,48,0.72)_55%,rgba(21,18,48,0.82))] " +
  "sm:bg-[linear-gradient(to_right,rgba(21,18,48,0.94),rgba(21,18,48,0.78)_45%,rgba(21,18,48,0.30))]";

// The badge and figures come from the "hero-stats" block in Admin > Website
// Content > Homepage (lib/homeContent.js), passed in by the page; these are
// the fallbacks. `badge` null or `stats` empty leaves that part out.
const STATS = [
  { value: "250+", label: "Products" },
  { value: "15+", label: "Years Experience" },
  { value: "1,200+", label: "Clinics Served" },
];

// The browser's data-saver flag (Chrome/Android). Read once; it rarely
// changes while the page is open.
const subscribeNever = () => () => {};
const readSaveData = () => Boolean(navigator.connection?.saveData);

export default function Hero({ banners = [], badge = "Trusted by veterinarians nationwide", stats = STATS }) {
  const slides = banners.length
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
      ];

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
  const slideKey = slide.id ?? slide.image;

  // A slide is a photo or a video (Admin > Banners). A video slide plays its
  // video, muted, behind the copy - unless the visitor asked for reduced
  // motion or to save data, or the video fails to load: then its image (the
  // poster) shows, exactly like a photo slide.
  const saveData = useSyncExternalStore(subscribeNever, readSaveData, () => false);
  const [failed, setFailed] = useState(() => new Set());
  const playsVideo = Boolean(slide.video) && !reduced && !saveData && !failed.has(slide.video);
  // Slides that share one video (every slide set to the same Provet video)
  // play it as one continuous background: it keeps running, looping, while
  // the headline, text and button change over it on the usual timer.
  const continues = playsVideo && slides.length > 1 && slides[(active + 1) % slides.length].video === slide.video;
  const videoRef = useRef(null);
  const [videoPaused, setVideoPaused] = useState(false);

  // Rotation: a photo slide holds for six seconds; a video slide holds until
  // its video ends - unless the next slide shares the video, when the words
  // change on the six-second timer over the still-playing video (a lone
  // slide's video simply loops). Choosing a slide from the dots gives it a
  // full hold of its own.
  useEffect(() => {
    if (slides.length <= 1) return;
    if (reduced) return; // an unbidden rotating banner is what the preference is for
    if (playsVideo && !continues) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % slides.length), 6000);
    return () => clearTimeout(t);
  }, [active, slides.length, reduced, playsVideo, continues]);

  // React sets `muted` as a property, not an attribute, so the server HTML's
  // <video> isn't muted when the browser decides on autoplay - and browsers
  // only autoplay muted video. Mute it and start it once it's in the page.
  useEffect(() => {
    const el = videoRef.current;
    if (!el) return;
    el.muted = true;
    el.play().catch(() => setVideoPaused(true));
  }, [playsVideo, slide.video]);

  const nextSlide = () => setActive((a) => (a + 1) % slides.length);
  const toggleVideo = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) el.play().catch(() => {});
    else el.pause();
  };

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden bg-brand-900">
      {/* Full-bleed banner: the image covers the whole section rather than
          sitting in a card, so it spans the viewport edge to edge. */}
      <motion.div
        className="absolute inset-0 -z-10"
        style={flat ? undefined : { y: parallaxY, scale: parallaxScale }}
      >
        <AnimatePresence mode="sync">
          {playsVideo ? (
            <motion.video
              // Keyed by the video, not the slide: slides sharing it keep
              // the same element, so it plays on without restarting.
              key={`video-${slide.video}`}
              ref={videoRef}
              src={slide.video}
              poster={slide.image || HERO_FALLBACK}
              autoPlay
              muted
              playsInline
              disablePictureInPicture
              loop={slides.length <= 1 || continues}
              preload="auto"
              aria-hidden="true"
              tabIndex={-1}
              onEnded={nextSlide}
              onPlay={() => setVideoPaused(false)}
              onPause={(e) => !e.currentTarget.ended && setVideoPaused(true)}
              onError={() => setFailed((f) => new Set(f).add(slide.video))}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 1.1, ease: EASE }}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : (
          <motion.img
            key={slide.id ?? slide.image}
            src={slide.image || HERO_FALLBACK}
            alt=""
            aria-hidden="true"
            fetchPriority="high"
            // The photo fades in, then keeps easing back from a slight zoom
            // for the whole time the slide holds (a slow "Ken Burns" push),
            // so the hero is never a still image.
            initial={{ opacity: 0, scale: 1.12 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ opacity: { duration: 1.1, ease: EASE }, scale: { duration: 7.5, ease: "linear" } }}
            className="absolute inset-0 h-full w-full object-cover"
          />
          )}
        </AnimatePresence>
      </motion.div>
      <div className={clsx("pointer-events-none absolute inset-0 -z-10", OVERLAY_GRADIENT)} />
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(229,9,127,0.22),transparent_55%)]" />

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
              className="mt-5 line-clamp-3 min-h-[7.425rem] max-w-xl font-display text-4xl font-extrabold leading-[1.1] text-white sm:min-h-[9.9rem] sm:text-5xl"
            >
              {slide.title}
            </motion.h1>
          </AnimatePresence>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            // Two lines reserved (leading-relaxed x 2) for the same reason.
            className="mt-5 line-clamp-2 min-h-[3.25rem] max-w-lg leading-relaxed text-brand-100"
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

      {/* Moving content that plays on its own needs a way to stop it
          (WCAG 2.2.2), so a video slide has one quiet pause button - the
          video itself shows no controls. Pausing also holds the slide, since
          the next one follows the video's end. */}
      {playsVideo && (
        <div className="pointer-events-none absolute inset-x-0 bottom-16 z-10 sm:bottom-20">
          <div className="container-page flex justify-end">
            <button
              type="button"
              onClick={toggleVideo}
              aria-label={videoPaused ? "Play background video" : "Pause background video"}
              className="pointer-events-auto flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white/80 backdrop-blur-sm transition hover:bg-white/20 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-400"
            >
              {videoPaused ? <Play size={14} /> : <Pause size={14} />}
            </button>
          </div>
        </div>
      )}

      {slides.length > 1 && (
        // Raised clear of the feature strip, which overlaps the hero's foot.
        <div className="absolute inset-x-0 bottom-16 z-10 sm:bottom-20">
          <div className="container-page flex gap-2">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => setActive(i)}
                aria-label={`Show slide ${i + 1}`}
                aria-current={i === active}
                className={clsx(
                  "h-2 rounded-full transition-all",
                  i === active ? "w-6 bg-accent-400" : "w-2 bg-white/40 hover:bg-white/60"
                )}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
