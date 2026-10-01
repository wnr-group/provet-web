// Each product range has its own quiet colour theme, keyed by the top-level
// category's slug (a subcategory takes its range's theme):
//
//   * Avinova, the poultry range: warm - eggshell, straw and amber.
//   * Blunova, the aquaculture range: cool - clear water, sky and teal.
//   * The whole catalogue (no range chosen): the site's own lavender and navy.
//
// `label` names a range for visitors ("Poultry health"), `focus` for the
// admin's category list ("Poultry").
//
// These theme the products page around the product cards, never the cards'
// own content:
//
//   * `banner`, `bannerGlow`, `bannerAccent` - the dark catalogue banner (its
//     gradient, the soft glow in its corner, the rule under the title). Kept
//     dark so its white copy stays readable.
//   * `base`, `glow`, `glowSoft`, `pattern` - the light backdrop behind the
//     grid and the colour of its line-art pattern.
//   * `ui` - the interface accents (selected chip, sidebar marker, pagination,
//     card hover ring, range label), set as CSS variables by rangeThemeVars.
//     `ui.accent` carries white text, so it stays at 4.5:1 or better.
const CATEGORY_THEMES = {
  avinova: {
    key: "avinova",
    label: "Poultry health",
    focus: "Poultry",
    banner: "linear-gradient(120deg, #322b75 0%, #4a3176 45%, #7a3f1c 100%)",
    bannerGlow: "rgba(245, 166, 35, 0.28)",
    bannerAccent: "#f5a623",
    base: "#fffbf4",
    glow: "rgba(245, 166, 35, 0.16)",
    glowSoft: "rgba(234, 120, 60, 0.07)",
    pattern: "#b4610c",
    ui: { accent: "#a0540a", text: "#8a4708", soft: "#fdf0dc", ring: "#f3cf98", barFrom: "#e39a2d", barTo: "#a0540a" },
  },
  blunova: {
    key: "blunova",
    label: "Aquaculture",
    focus: "Aquaculture",
    banner: "linear-gradient(120deg, #2b2a72 0%, #1f4690 50%, #0b5f73 100%)",
    bannerGlow: "rgba(56, 189, 248, 0.26)",
    bannerAccent: "#38bdf8",
    base: "#f5fafe",
    glow: "rgba(56, 152, 222, 0.16)",
    glowSoft: "rgba(20, 170, 160, 0.08)",
    pattern: "#11679f",
    ui: { accent: "#11679f", text: "#0d5585", soft: "#e2f0fb", ring: "#a9d3f0", barFrom: "#3aa0d8", barTo: "#0e7d7a" },
  },
};

// The site's own brand colours - what the page looked like before ranges had
// themes, and the initial values of the CSS variables in globals.css.
const DEFAULT_THEME = {
  key: "all",
  label: null,
  focus: null,
  banner: "linear-gradient(120deg, #322b75 0%, #413897 60%, #5a2f88 100%)",
  bannerGlow: "rgba(229, 9, 127, 0.2)",
  bannerAccent: "#f7319b",
  base: "#fbfaff",
  glow: "rgba(97, 87, 193, 0.1)",
  glowSoft: "rgba(229, 9, 127, 0.04)",
  pattern: "#393185",
  ui: { accent: "#393185", text: "#2b2565", soft: "#f3f2fa", ring: "#c0bce6", barFrom: "#483ea8", barTo: "#e5097f" },
};

// The theme for a top-level category ({ slug }), or the catalogue default.
function categoryTheme(category) {
  return CATEGORY_THEMES[category?.slug] || DEFAULT_THEME;
}

// A theme's interface accents as CSS variables, for a wrapper's `style`.
// Registered with @property in globals.css, so a change animates.
function rangeThemeVars(theme) {
  return {
    "--range-accent": theme.ui.accent,
    "--range-text": theme.ui.text,
    "--range-soft": theme.ui.soft,
    "--range-ring": theme.ui.ring,
    "--range-bar-from": theme.ui.barFrom,
    "--range-bar-to": theme.ui.barTo,
  };
}

module.exports = { CATEGORY_THEMES, DEFAULT_THEME, categoryTheme, rangeThemeVars };
