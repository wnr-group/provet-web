import clsx from "clsx";
import { CATEGORY_THEMES, DEFAULT_THEME } from "@/lib/categoryTheme";

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

const W = 1600;
const H = 900;

// A ribbon of `lines` contour lines, each a sum of two sine waves whose phase
// shifts line by line, so the ribbon twists as it crosses the page.
function ribbon({ lines, top, spread, amp, freq, tilt, twist, seed }) {
  return Array.from({ length: lines }, (_, i) => {
    const t = i / (lines - 1);
    let d = "";
    for (let x = -40; x <= W + 40; x += 20) {
      const y =
        top +
        i * spread +
        tilt * x +
        amp * (1 - 0.35 * t) * Math.sin(x * freq + t * twist + seed) +
        amp * 0.4 * Math.sin(x * freq * 2.3 - t * twist * 1.4 + seed * 1.7);
      d += `${d ? "L" : "M"}${x} ${y.toFixed(1)}`;
    }
    return d;
  });
}

const THEMES = [
  {
    ...DEFAULT_THEME,
    from: "#483ea8",
    to: "#e5097f",
    ribbon: { lines: 26, top: 300, spread: 10, amp: 70, freq: 0.0032, tilt: -0.1, twist: 1.6, seed: 0.6 },
    texture: "lattice",
    textureOpacity: 0.1,
  },
  {
    ...CATEGORY_THEMES.avinova,
    from: "#e39a2d",
    to: "#e5097f",
    ribbon: { lines: 34, top: 120, spread: 8, amp: 46, freq: 0.0026, tilt: 0.06, twist: 1.2, seed: 2.1 },
    texture: "speckle",
    textureOpacity: 0.3,
  },
  {
    ...CATEGORY_THEMES.blunova,
    from: "#3aa0d8",
    to: "#483ea8",
    ribbon: { lines: 26, top: 170, spread: 10, amp: 30, freq: 0.0085, tilt: 0, twist: 3.2, seed: 1.3 },
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

function Ribbon({ theme, gradientId, className, opacity }) {
  const paths = ribbon(theme.ribbon);
  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      preserveAspectRatio="xMidYMid slice"
      className={clsx("absolute left-[-4%] w-[112%] motion-safe:animate-ribbon-drift", className)}
      style={{ opacity }}
    >
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={theme.from} stopOpacity="0" />
          <stop offset="22%" stopColor={theme.from} />
          <stop offset="70%" stopColor={theme.to} />
          <stop offset="100%" stopColor={theme.to} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g fill="none" stroke={`url(#${gradientId})`} vectorEffect="non-scaling-stroke">
        {paths.map((d, i) => (
          <path
            key={i}
            d={d}
            strokeWidth={i % 7 === 3 ? 2 : 1.1}
            strokeOpacity={0.45 + 0.55 * Math.sin((Math.PI * i) / (paths.length - 1))}
            vectorEffect="non-scaling-stroke"
          />
        ))}
      </g>
    </svg>
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
              gradientId={`catalogue-ribbon-${theme.key}`}
              className="top-0 h-[56rem] [mask-image:linear-gradient(to_bottom,black_55%,transparent)]"
              opacity={0.85}
            />
            <Ribbon
              theme={theme}
              gradientId={`catalogue-ribbon-low-${theme.key}`}
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
