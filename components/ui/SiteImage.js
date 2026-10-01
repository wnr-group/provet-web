import Image from "next/image";

// An image that fills its (positioned, fixed-ratio) container.
//
// Pictures stored on this site - /content and admin uploads under /uploads -
// go through Next's image optimizer: resized to the width the layout actually
// shows (`sizes`), converted to WebP/AVIF and lazy-loaded. That matters most
// for admin uploads, which can be multi-megabyte photos shown in a small card,
// and for the testimonial graphics (1024px, ~200 KB each, shown at ~300px).
//
// Everything else stays a plain <img>: external URLs (the Unsplash photos are
// already sized by their URL, and next/image would need every host listed in
// next.config), SVGs (the optimizer refuses them) and URLs with a query string
// (not allowed by the default localPatterns).
// `eager`: above the fold (Next 16 deprecates `priority` for `loading="eager"`).
export default function SiteImage({ src, alt = "", sizes, className, eager = false, ...rest }) {
  if (optimizable(src)) {
    return <Image src={src} alt={alt} fill sizes={sizes} loading={eager ? "eager" : "lazy"} className={className} {...rest} />;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element -- external/SVG/query URLs, see above
    <img
      src={src}
      alt={alt}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      className={className}
      {...rest}
    />
  );
}

function optimizable(src) {
  return (
    typeof src === "string" &&
    src.startsWith("/") &&
    !src.startsWith("//") &&
    !src.includes("?") &&
    !/\.(svg|gif)$/i.test(src)
  );
}
