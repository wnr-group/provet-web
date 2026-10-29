import Image from "next/image";
import clsx from "clsx";

// A product range's wordmark (Avinova, Blunova) from its theme's `logo`
// (lib/categoryTheme.js). Set the height with a class (`h-9`); the width
// follows from the logo's own proportions. `alt` is the range's name, so the
// logo can stand in for it as a heading. Nothing when the range has no logo.
// `sizes` is the widest the logo is shown, so the optimizer sends a file
// sized for it rather than the 800px original.
export default function RangeLogo({ logo, alt, sizes = "240px", eager = false, className }) {
  if (!logo) return null;
  return (
    <Image
      src={logo.src}
      width={logo.width}
      height={logo.height}
      alt={alt}
      sizes={sizes}
      loading={eager ? "eager" : "lazy"}
      className={clsx("block w-auto max-w-full", className)}
    />
  );
}
