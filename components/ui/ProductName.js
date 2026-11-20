import Image from "next/image";
import clsx from "clsx";
import wordmarks from "@/lib/wordmarks.json";

// A product's name as its brand writes it. The wordmark (the lettering and
// colour from the product's label, cut out by scripts/build-wordmarks.js)
// stands in for the name wherever the name is a heading; the name stays the
// image's alt text, so it is still what a screen reader hears. A product with
// no wordmark yet (a newly added one) falls back to its name as plain text.
// Set the height with a class (`h-6`); the width follows from the artwork's
// proportions, and a name wider than its space scales down to fit.
export default function ProductName({ name, slug, className, sizes = "260px", eager = false }) {
  const size = slug && wordmarks[slug];
  if (!size) return name;
  return (
    <Image
      src={`/content/wordmarks/${slug}.png`}
      width={size[0]}
      height={size[1]}
      alt={name}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={clsx("block w-auto max-w-full object-contain object-left mix-blend-multiply", className)}
    />
  );
}
