import clsx from "clsx";
import { CATEGORY_THEMES, DEFAULT_THEME } from "@/lib/categoryTheme";
import { ribbonSrc } from "@/lib/catalogueArt";

// The catalogue's per-range backdrop, behind the spotlight, filters and
// product grid (colours in lib/categoryTheme.js). No clip-art: each range is
// drawn as generative line art -
//
//   * a ribbon of fine contour lines sweeping across the top of the page and a
//     fainter one lower down, shaped for the range: rolling field rows for
//     Avinova (poultry), layered water lines for Blunova (aquaculture), a
//     rising lattice sweep for the whole catalogue;
//   * a close texture in the gaps: eggshell speckle for Avinova, rising
//     bubbles for Blunova, a molecular lattice for the whole catalogue;
//   * soft glows in the range's tone with the brand's blue and pink, and a
//     faint grain over everything so the colour reads as a surface.
//
// All of it is faint and fades down the page, so the white cards stay the
// focus. Every theme is rendered, stacked, and only the active one shows:
// changing category is a soft navigation, so the layers stay mounted and
// cross-fade with a plain CSS transition. The ribbons drift very slowly
// (flattened by the reduced-motion rule in globals.css).

const THEMES = [
  {
    ...DEFAULT_THEME,
    texture: "lattice",
    textureOpacity: 0.1,
  },
  {
    ...CATEGORY_THEMES.avinova,
    texture: "speckle",
    textureOpacity: 0.3,
  },
  {
    ...CATEGORY_THEMES.blunova,
    texture: "bubbles",
    textureOpacity: 0.3,
  },
];

// The close textures, one pattern tile each. Positions are scattered by hand
// so the repeat is hard to spot.
function Texture({ kind, id }) {
  if (kind === "speckle") {
    const dots = [
      [14, 22, 2.2], [58, 9, 1.4], [96, 40, 3], [132, 18, 1.6], [30, 70, 1.5], [74, 88, 2.4],
      [118, 76, 1.4], [150, 110, 2.2], [12, 128, 2.8], [60, 140, 1.6], [104, 150, 2], [140, 158, 1.4],
    ];
    return (
      <pattern id={id} width="168" height="168" patternUnits="userSpaceOnUse">
        {dots.map(([cx, cy, r], i) => (
          <ellipse key={i} cx={cx} cy={cy} rx={r} ry={r * 0.8} fill="currentColor" />
        ))}
      </pattern>
    );
  }
  if (kind === "bubbles") {
    // Small columns of rising bubbles, a few strays between them.
    const bubbles = [
      [30, 280, 4], [36, 252, 2.6], [31, 230, 1.6], [34, 214, 1],
      [210, 120, 5], [204, 88, 3], [209, 64, 2], [205, 48, 1.2],
      [300, 330, 3], [306, 308, 1.8], [128, 190, 1.6], [262, 250, 1.2], [96, 40, 2.4], [352, 150, 1.4],
    ];
    return (
      <pattern id={id} width="380" height="360" patternUnits="userSpaceOnUse">
        {bubbles.map(([cx, cy, r], i) => (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeWidth="1.3" />
        ))}
      </pattern>
    );
  }
  // A hexagonal lattice: atoms joined by fine bonds.
  return (
    <pattern id={id} width="52" height="90" patternUnits="userSpaceOnUse">
      <path d="M26 0 L52 15 L52 45 L26 60 L0 45 L0 15 Z M26 60 L26 90" fill="none" stroke="currentColor" strokeWidth="0.9" />
      {[[26, 0], [52, 15], [52, 45], [26, 60], [0, 45], [0, 15], [26, 90]].map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="2.2" fill="currentColor" />
      ))}
    </pattern>
  );
}

// One ribbon: the range's line art (public/catalogue, see lib/catalogueArt.js)
// as an image - fetched once and cached by the browser, instead of ~25 KB of
// path data inlined into every page. Decorative, so it never competes with
// the content for bandwidth: decoded off the main thread and fetched at low
// priority.
function Ribbon({ theme, className, opacity }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- a static SVG; nothing for next/image to optimise
    <img
      src={ribbonSrc(theme.key)}
      alt=""
      aria-hidden="true"
      decoding="async"
      fetchPriority="low"
      draggable={false}
      className={clsx("absolute left-[-4%] w-[112%] max-w-none select-none motion-safe:animate-ribbon-drift", className)}
      style={{ opacity }}
    />
  );
}

export default function CategoryBackdrop({ themeKey = DEFAULT_THEME.key }) {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      {THEMES.map((theme) => {
        const active = theme.key === themeKey;
        return (
          <div
            key={theme.key}
            data-theme-layer={theme.key}
            className={clsx(
              "absolute inset-0 transition-opacity duration-700 ease-out",
              active ? "opacity-100" : "opacity-0"
            )}
            style={{
              color: theme.pattern,
              backgroundColor: theme.base,
              backgroundImage: [
                `radial-gradient(56rem 34rem at 100% 0%, ${theme.glow}, transparent 70%)`,
                `radial-gradient(40rem 28rem at 0% 38%, ${theme.glowSoft}, transparent 70%)`,
                "radial-gradient(36rem 26rem at 85% 70%, rgba(229, 9, 127, 0.05), transparent 70%)",
                "radial-gradient(40rem 30rem at 10% 95%, rgba(72, 62, 168, 0.06), transparent 70%)",
              ].join(", "),
            }}
          >
            {/* The close texture, strongest near the top and in the margins. */}
            <svg
              className={clsx(
                "absolute inset-0 h-full w-full transition-transform duration-1000 ease-out",
                "[mask-image:radial-gradient(120%_70%_at_50%_0%,black_20%,rgba(0,0,0,0.35)_70%,rgba(0,0,0,0.15)_100%)]",
                active ? "translate-y-0" : "translate-y-3"
              )}
              style={{ opacity: theme.textureOpacity }}
            >
              <defs>
                <Texture kind={theme.texture} id={`catalogue-texture-${theme.key}`} />
              </defs>
              <rect width="100%" height="100%" fill={`url(#catalogue-texture-${theme.key})`} />
            </svg>

            {/* The ribbons: one sweeping across the top, a fainter echo
                behind the lower rows of the grid. */}
            <Ribbon
              theme={theme}
              className="top-0 h-[56rem] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
              opacity={0.85}
            />
            <Ribbon
              theme={theme}
              className="top-[62rem] h-[52rem] -scale-x-100 [mask-image:linear-gradient(to_bottom,transparent,black_30%,black_60%,transparent)]"
              opacity={0.6}
            />
          </div>
        );
      })}

      {/* A faint grain over every theme, so the colour reads as a surface. */}
      <svg className="absolute inset-0 h-full w-full opacity-[0.05] mix-blend-multiply">
        <filter id="catalogue-grain">
          <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="2" stitchTiles="stitch" />
          <feColorMatrix type="saturate" values="0" />
        </filter>
        <rect width="100%" height="100%" filter="url(#catalogue-grain)" />
      </svg>
    </div>
  );
}
