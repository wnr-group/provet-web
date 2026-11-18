// A plain <img> that is served through Next's image optimizer.
//
// Most pictures on the site are shown inside layouts that already fix their
// size with CSS (aspect-ratio boxes, absolute-positioned fills), so a plain
// <img> is right - but a bare <img> downloads the original file: a 1920px,
// 400 KB photo for a 300px card. This keeps the markup and the layout exactly
// as they were and only changes where the bytes come from: a srcset of resized
// WebP copies, so each device downloads the width it will actually draw.
//
// Pictures that cannot be optimised (SVG and GIF, other websites' photos such
// as the Unsplash ones - already sized by their own URL - and anything with a
// query string) are rendered as before.
const SUPABASE_PUBLIC = /^https:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1\/object\/public\//i;

// Widths the optimizer is configured to produce (Next's default device and
// image sizes - next.config.mjs does not change them).
const DEFAULT_WIDTHS = [256, 384, 640, 750, 828, 1080, 1200, 1920];

export function canOptimize(src) {
  if (typeof src !== "string" || !src) return false;
  if (/\.(svg|gif)(\?|$)/i.test(src)) return false;
  if (src.startsWith("/")) return !src.startsWith("//") && !src.includes("?");
  return SUPABASE_PUBLIC.test(src);
}

const optimizedUrl = (src, width) => `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=75`;

// `sizes` says how wide the picture is drawn ("(min-width: 1024px) 33vw,
// 100vw") - it is what lets the browser pick the smallest adequate copy.
// `widths` narrows the candidates for small pictures (a 40px thumbnail never
// needs the 1920px copy). `priority` is for the one picture that is the
// largest thing on screen at load: fetched at high priority, never lazy.
export default function Pic({ src, sizes = "100vw", widths = DEFAULT_WIDTHS, priority = false, loading, alt = "", ...rest }) {
  const shared = {
    decoding: "async",
    loading: loading || (priority ? "eager" : "lazy"),
    ...(priority ? { fetchPriority: "high" } : {}),
    ...rest,
  };
  if (!canOptimize(src)) {
    // eslint-disable-next-line @next/next/no-img-element -- not optimisable, see above
    return <img src={src} alt={alt} {...shared} />;
  }
  const fallback = widths[Math.min(widths.length - 1, Math.ceil(widths.length / 2))];
  return (
    // eslint-disable-next-line @next/next/no-img-element -- optimised through srcSet below
    <img
      src={optimizedUrl(src, fallback)}
      srcSet={widths.map((w) => `${optimizedUrl(src, w)} ${w}w`).join(", ")}
      sizes={sizes}
      alt={alt}
      {...shared}
    />
  );
}
