// The site's illustrated mark: a main line icon in a fine navy stroke over a
// soft magenta-to-lavender disc (the theme's accent-50 and brand-100) set up
// and to the left, with a smaller companion icon tucked against its
// lower-right corner. The disc grows a touch when a surrounding `group` is
// hovered. Used by the homepage trust strip and the Core Values page.
//
// `backdrop` is the colour behind the mark, used to knock out the main icon's
// lines where the companion overlaps them.
export default function LineMark({ icon: Icon, companion: Companion, backdrop = "var(--color-mist-50)" }) {
  return (
    <span aria-hidden="true" className="relative block h-16 w-20">
      <span
        className="absolute left-0 top-2 h-12 w-12 rounded-full transition-transform duration-500 ease-out group-hover:scale-110"
        style={{ background: "radial-gradient(circle at 35% 35%, var(--color-accent-50), var(--color-brand-100) 75%)" }}
      />
      <Icon size={48} strokeWidth={1} absoluteStrokeWidth className="absolute left-3 top-0 text-brand-800" />
      {Companion && (
        <Companion
          size={26}
          strokeWidth={1}
          absoluteStrokeWidth
          className="absolute left-12 top-7 rounded-full text-brand-800"
          style={{ backgroundColor: backdrop }}
        />
      )}
    </span>
  );
}
