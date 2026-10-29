"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import clsx from "clsx";

// The product page's image on a single square stage, contained and never
// cropped (the shots are label artwork with the name printed on them), with a
// row of equal thumbnails beneath when there are several. The page already
// puts the gallery on a white card that leans toward the pointer, so nothing
// here is a second card or a second tilt.
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
    <div>
      {/* The image is centred and contained at the same padding whatever its
          proportions. */}
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[radial-gradient(circle_at_50%_40%,#ffffff_0%,var(--color-mist-100)_70%,var(--color-brand-100)_100%)]">
        {failed[activeImg] ? (
          <div className="flex h-full flex-col items-center justify-center gap-2 text-ink-soft">
            <ImageOff size={28} />
            <span className="text-sm">Image unavailable</span>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element -- arbitrary external/uploaded URLs, not a fixed set of remote hosts */
          <img
            key={images[activeImg]}
            src={images[activeImg]}
            alt={`${name}${hasMultiple ? ` - view ${activeImg + 1} of ${images.length}` : ""}`}
            onError={() => markFailed(activeImg)}
            className="absolute inset-0 h-full w-full object-contain p-[3%]"
          />
        )}
        {hasMultiple && (
          <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold tabular-nums text-ink ring-1 ring-brand-100">
            {activeImg + 1} / {images.length}
          </span>
        )}
      </div>

      {hasMultiple && (
        <div className="mt-4 flex flex-wrap justify-center gap-3" role="tablist" aria-label={`${name} images`}>
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
                "h-16 w-16 overflow-hidden rounded-2xl bg-white transition duration-300",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2",
                i === activeImg
                  ? "ring-2 ring-accent-500 ring-offset-2"
                  : "opacity-60 ring-1 ring-brand-100 hover:opacity-100 hover:ring-brand-300"
              )}
            >
              {failed[i] ? (
                <span className="flex h-full w-full items-center justify-center bg-mist-100 text-ink-soft">
                  <ImageOff size={14} />
                </span>
              ) : (
                /* eslint-disable-next-line @next/next/no-img-element -- see above */
                <img src={img} alt="" loading="lazy" onError={() => markFailed(i)} className="h-full w-full object-contain" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
