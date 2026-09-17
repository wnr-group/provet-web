"use client";

import { useState } from "react";
import clsx from "clsx";

export default function ProductGallery({ images, name }) {
  const [activeImg, setActiveImg] = useState(0);

  return (
    <>
      <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-mist-100">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={images[activeImg]} alt={name} className="h-full w-full object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 flex gap-3">
          {images.map((img, i) => (
            <button
              key={img + i}
              onClick={() => setActiveImg(i)}
              className={clsx(
                "h-16 w-16 overflow-hidden rounded-xl border-2",
                i === activeImg ? "border-brand-600" : "border-transparent"
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </>
  );
}
