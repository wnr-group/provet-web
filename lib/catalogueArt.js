// The catalogue backdrop's line art - one "ribbon" of fine contour lines per
// range - as standalone SVG files.
//
// It used to be drawn inline: about 150 KB of path data that went out twice
// on every Products page view, once as HTML and again in the React payload,
// for a purely decorative background. As files under public/catalogue the
// browser fetches each ribbon once, caches it, and the page carries only an
// <img> tag. Generate them with `npm run art:catalogue` after changing
// anything here; lib/catalogueArt.test.js fails if the files are out of date.

const W = 1600;
const H = 900;

// Each range's ribbon: its gradient and the shape of its waves (rolling field
// rows for Avinova, layered water lines for Blunova, a rising lattice sweep
// for the whole catalogue). Keys match the range themes in lib/categoryTheme.js.
const RIBBONS = {
  all: { from: "#483ea8", to: "#e5097f", lines: 26, top: 300, spread: 10, amp: 70, freq: 0.0032, tilt: -0.1, twist: 1.6, seed: 0.6 },
  avinova: { from: "#e39a2d", to: "#e5097f", lines: 34, top: 120, spread: 8, amp: 46, freq: 0.0026, tilt: 0.06, twist: 1.2, seed: 2.1 },
  blunova: { from: "#3aa0d8", to: "#483ea8", lines: 26, top: 170, spread: 10, amp: 30, freq: 0.0085, tilt: 0, twist: 3.2, seed: 1.3 },
};

// Bump when the art changes, so browsers holding the old file fetch the new.
const ART_VERSION = 1;

// `lines` contour lines, each a sum of two sine waves whose phase shifts line
// by line, so the ribbon twists as it crosses the page.
function ribbonPaths({ lines, top, spread, amp, freq, tilt, twist, seed }) {
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

function ribbonSvg(key) {
  const r = RIBBONS[key];
  const paths = ribbonPaths(r);
  const body = paths
    .map((d, i) => {
      const width = i % 7 === 3 ? 2 : 1.1;
      const opacity = (0.45 + 0.55 * Math.sin((Math.PI * i) / (paths.length - 1))).toFixed(3);
      return `<path d="${d}" stroke-width="${width}" stroke-opacity="${opacity}"/>`;
    })
    .join("");
  return (
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice">` +
    `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="0">` +
    `<stop offset="0%" stop-color="${r.from}" stop-opacity="0"/>` +
    `<stop offset="22%" stop-color="${r.from}"/>` +
    `<stop offset="70%" stop-color="${r.to}"/>` +
    `<stop offset="100%" stop-color="${r.to}" stop-opacity="0"/>` +
    `</linearGradient></defs>` +
    `<g fill="none" stroke="url(#g)" vector-effect="non-scaling-stroke">${body}</g>` +
    `</svg>\n`
  );
}

const ribbonFile = (key) => `public/catalogue/ribbon-${key}.svg`;
const ribbonSrc = (key) => `/catalogue/ribbon-${RIBBONS[key] ? key : "all"}.svg?v=${ART_VERSION}`;

module.exports = { RIBBONS, ribbonSvg, ribbonFile, ribbonSrc };
