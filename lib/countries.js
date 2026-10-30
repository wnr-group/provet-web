// Matching the country names the admin types ("UAE", "USA", "Vietnam") to the
// names in the world-atlas map data, which uses its own spellings.
const ALIASES = {
  uae: "united arab emirates",
  usa: "united states of america",
  us: "united states of america",
  "united states": "united states of america",
  uk: "united kingdom",
  england: "united kingdom",
  "viet nam": "vietnam",
  "south korea": "south korea",
  korea: "south korea",
  "republic of korea": "south korea",
  burma: "myanmar",
  czechia: "czechia",
  "czech republic": "czechia",
  "ivory coast": "côte d'ivoire",
  "cote d'ivoire": "côte d'ivoire",
  drc: "dem. rep. congo",
  "dr congo": "dem. rep. congo",
  "democratic republic of the congo": "dem. rep. congo",
  congo: "congo",
  "republic of the congo": "congo",
  swaziland: "eswatini",
  turkey: "turkey",
  turkiye: "turkey",
  "türkiye": "turkey",
  russia: "russia",
  "russian federation": "russia",
  "bosnia and herzegovina": "bosnia and herz.",
  "dominican republic": "dominican rep.",
  "central african republic": "central african rep.",
  "south sudan": "s. sudan",
  "western sahara": "w. sahara",
  "falkland islands": "falkland is.",
  "equatorial guinea": "eq. guinea",
  "solomon islands": "solomon is.",
  "north macedonia": "macedonia",
  "timor-leste": "timor-leste",
  "east timor": "timor-leste",
};

// Countries too small to be drawn in the 110m map data: shown as a dot at
// [longitude, latitude] instead.
const MICRO_STATES = {
  singapore: [103.82, 1.35],
  maldives: [73.5, 3.2],
  bahrain: [50.55, 26.07],
  mauritius: [57.55, -20.25],
  "hong kong": [114.17, 22.32],
  malta: [14.4, 35.9],
  seychelles: [55.45, -4.68],
  barbados: [-59.55, 13.19],
};

function countryKey(name) {
  const key = String(name || "").trim().toLowerCase().replace(/\s+/g, " ");
  return ALIASES[key] || key;
}

module.exports = { countryKey, MICRO_STATES };
