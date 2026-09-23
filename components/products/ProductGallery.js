"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import clsx from "clsx";

export default function ProductGallery({ images, name }) {
  const [activeImg, setActiveImg] = useState(0);
  // Tracked per-index so one broken URL does not blank out the whole gallery -
  // uploaded and external image URLs both end up here and either can rot.
  const [failed, setFailed] = useState({});

  const markFailed = (i) => setFailed((f) => (f[i] ? f : { ...f, [i]: true }));
  const hasMultiple = images.length > 1;

  // Arrow keys move between thumbnails, which is what makes the row behave
  // like the tablist it is announced as.
  const onThumbKeyDown = (e) => {
    const delta = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!delta) return;
    e.preventDefault();
    const next = (activeImg + delta + images.length) % images.length;
    setActiveImg(next);
    e.currentTarget.parentElement?.children[next]?.focus();
  };

  return (
    <div className="lg:sticky lg:top-24">
      {/* The glow sits behind the frame rather than on it, so the product
          image reads as lifted off the page instead of boxed in by a border. */}
      <div className="relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-4 -z-10 rounded-[2.5rem] bg-[radial-gradient(60%_60%_at_50%_40%,rgba(229,9,127,0.14),transparent_70%)] blur-xl"
        />
        <div className="group relative aspect-square overflow-hidden rounded-3xl bg-mist-100 shadow-[0_1px_2px_rgba(57,49,133,0.06),0_24px_48px_-20px_rgba(57,49,133,0.35)] ring-1 ring-white/60">
        {failed[activeImg] ? (
          <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-ink-soft">
            <ImageOff size={28} />
            <span className="text-sm">Image unavailable</span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/uploaded URLs, not a fixed set of remote hosts */
          <img
            src={images[activeImg]}
            alt={`${name}${hasMultiple ? ` - view ${activeImg + 1} of ${images.length}` : ""}`}
            onError={() => markFailed(activeImg)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}

        {hasMultiple && (
          <span className="absolute bottom-4 right-4 rounded-full bg-white/20 px-3 py-1.5 text-xs font-semibold tabular-nums text-white ring-1 ring-white/30 backdrop-blur-md">
            {activeImg + 1} / {images.length}
          </span>
        )}
        </div>
      </div>

      {hasMultiple && (
        <div className="mt-3 flex flex-wrap gap-3" role="tablist" aria-label={`${name} images`}>
          {images.map((img, i) => (
            <button
              key={img + i}
              type="button"
              role="tab"
              aria-selected={i === activeImg}
              aria-label={`View image ${i + 1} of ${images.length}`}
              tabIndex={i === activeImg ? 0 : -1}
              onClick={() => setActiveImg(i)}
              onKeyDown={onThumbKeyDown}
              className={clsx(
                "h-16 w-16 overflow-hidden rounded-2xl transition duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                i === activeImg
                  ? "scale-105 opacity-100 ring-2 ring-accent-500 ring-offset-2"
                  : "opacity-60 ring-1 ring-brand-100 hover:opacity-100 hover:ring-brand-300"
              )}
            >
              {failed[i] ? (
                <span className="flex h-full w-full items-center justify-center bg-mist-100 text-ink-soft">
                  <ImageOff size={14} />
                </span>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element -- see above */
                <img
                  src={img}
                  alt=""
                  loading="lazy"
                  onError={() => markFailed(i)}
                  className="h-full w-full object-cover"
                />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
