import { geoNaturalEarth1, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import { countryKey, MICRO_STATES } from "./countries";
import { MAP_WIDTH, MAP_HEIGHT } from "./mapSize";

// Every country's outline as an SVG path, computed once on the server and
// kept for the life of the process. Antarctica is left off: it is a big white
// slab that only shrinks the rest of the map.
let cached;
function geometry() {
  if (cached) return cached;
  const countries = feature(world, world.objects.countries).features.filter((f) => f.properties.name !== "Antarctica");
  const projection = geoNaturalEarth1().fitExtent([[4, 4], [MAP_WIDTH - 4, MAP_HEIGHT - 4]], {
    type: "FeatureCollection",
    features: countries,
  });
  const path = geoPath(projection);
  cached = {
    projection,
    shapes: countries.map((f) => ({ key: countryKey(f.properties.name), name: f.properties.name, d: path(f) })).filter((s) => s.d),
  };
  return cached;
}

// `regions` is [{ name, countries: [string] }]. Returns every outline tagged
// with the region that exports to it (or null), and the dots for countries
// too small to draw.
export function buildExportMap(regions) {
  const { shapes, projection } = geometry();
  const regionOf = new Map();
  for (const region of regions) for (const c of region.countries) regionOf.set(countryKey(c), region.name);

  const matched = new Set();
  const outlines = shapes.map((s) => {
    const region = regionOf.get(s.key) || null;
    if (region) matched.add(s.key);
    return { name: s.name, key: s.key, d: s.d, region };
  });

  const dots = [];
  for (const [key, region] of regionOf) {
    if (matched.has(key) || !MICRO_STATES[key]) continue;
    const [x, y] = projection(MICRO_STATES[key]);
    dots.push({ key, x: Math.round(x), y: Math.round(y), region });
  }

  return { outlines, dots };
}
