"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { parseYouTubeUrl, youTubeEmbedUrl, youTubeThumbnailUrl } from "@/lib/youtube";

// A YouTube video, embedded with YouTube's own player - nothing is downloaded
// or hosted here.
//
// It starts as a poster (YouTube's thumbnail and a play button in the site's
// accent colour) and only swaps in the real player when the visitor clicks.
// A page with six embedded iframes would pull in YouTube's player scripts six
// times before anyone pressed play; the poster costs one image each. The
// player comes from youtube-nocookie.com, which sets no cookies until the
// video is actually played.
//
// Always 16:9 and full width of its container, so it scales from phone to
// desktop with no fixed sizes.
//
// `title` labels the player for screen readers; `showTitle` also prints it
// over the poster, for places with no caption beneath.
export default function YouTubePlayer({ url, title, showTitle = false }) {
  const [playing, setPlaying] = useState(false);
  const video = parseYouTubeUrl(url);
  if (!video) return null;

  const label = title || "YouTube video";

  return (
    <div className="relative aspect-video overflow-hidden rounded-2xl bg-brand-900 shadow-card ring-1 ring-brand-100/70">
      {playing ? (
        <iframe
          src={youTubeEmbedUrl(video.id, { start: video.start, autoplay: true })}
          title={label}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
          className="absolute inset-0 h-full w-full border-0"
        />
      ) : (
        <button
          type="button"
          onClick={() => setPlaying(true)}
          aria-label={`Play video: ${label}`}
          className="group absolute inset-0 block h-full w-full text-left"
        >
          {/* eslint-disable-next-line @next/next/no-img-element -- YouTube's thumbnail CDN */}
          <img
            src={youTubeThumbnailUrl(video.id)}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/10 to-brand-900/20" />
          <span
            aria-hidden="true"
            className="absolute left-1/2 top-1/2 flex h-14 w-14 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-accent-500 text-white shadow-[0_12px_30px_-8px_rgba(229,9,127,0.6)] ring-4 ring-white/25 transition duration-300 group-hover:scale-110 group-hover:bg-accent-600 sm:h-16 sm:w-16"
          >
            <Play size={26} className="translate-x-0.5 fill-current" />
          </span>
          {title && showTitle && (
            <span className="absolute inset-x-0 bottom-0 line-clamp-2 p-4 font-display text-sm font-semibold text-white sm:text-base">
              {title}
            </span>
          )}
        </button>
      )}
      {/* Without JavaScript the poster button cannot play; link out instead. */}
      <noscript>
        <a
          href={video.url}
          className="absolute inset-0 flex items-end p-4 text-sm font-semibold text-white underline"
          target="_blank"
          rel="noreferrer"
        >
          Watch on YouTube
        </a>
      </noscript>
    </div>
  );
}
