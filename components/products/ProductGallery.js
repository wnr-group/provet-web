"use client";

import { useState } from "react";
import { ImageOff } from "lucide-react";
import clsx from "clsx";
import { Tilt } from "@/components/motion/effects";

// The product page's image, presented on a 3D stage: a white card holding a
// soft pedestal, with the product image floating 90px in front of it. Tilt
// leans the stage toward the pointer so the image slides against its
// backdrop. The image is contained, never cropped (the shots are label
// artwork with the name printed on them). No clipping on the tilting layers -
// overflow would flatten the 3D - so each layer rounds its own corners.
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
      <Tilt max={12} lift={1.03} glare shadow glareClassName="rounded-3xl">
        <div className="relative rounded-3xl bg-white p-4 shadow-[0_30px_60px_-30px_rgba(21,18,48,0.55)] ring-1 ring-brand-100 [transform-style:preserve-3d]">
          <div className="relative aspect-square rounded-2xl bg-[radial-gradient(circle_at_50%_35%,#ffffff_0%,var(--color-mist-100)_60%,var(--color-brand-100)_100%)] [transform-style:preserve-3d]">
            <span aria-hidden="true" className="absolute inset-[10%] rounded-full border border-brand-200/60 [transform:translateZ(-30px)]" />
            <span aria-hidden="true" className="absolute inset-[22%] rounded-full border border-dashed border-accent-300/60 [transform:translateZ(30px)]" />
            <span
              aria-hidden="true"
              className="absolute bottom-[8%] left-1/2 h-5 w-1/2 -translate-x-1/2 rounded-full bg-brand-900/20 blur-lg"
            />
            <div className="absolute inset-[14%] flex items-center justify-center [transform:translateZ(90px)]">
              {failed[activeImg] ? (
                <div className="flex flex-col items-center justify-center gap-2 text-ink-soft">
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
                  className="max-h-full max-w-full rounded-xl object-contain shadow-[0_20px_36px_-16px_rgba(21,18,48,0.45)]"
                />
              )}
            </div>
            {hasMultiple && (
              <span className="absolute bottom-3 right-3 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold tabular-nums text-ink ring-1 ring-brand-100">
                {activeImg + 1} / {images.length}
              </span>
            )}
          </div>
        </div>
      </Tilt>

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
