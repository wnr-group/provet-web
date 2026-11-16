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
    shapes: countries
      .map((f) => {
        // Where a country scales from when it pops out on hover, and by how
        // much: small ones grow most so they are readable, big ones barely.
        const [[x0, y0], [x1, y1]] = path.bounds(f);
        const [cx, cy] = path.centroid(f);
        const size = Math.max(x1 - x0, y1 - y0);
        return {
          key: countryKey(f.properties.name),
          name: f.properties.name,
          d: path(f),
          cx: Math.round(cx),
          cy: Math.round(cy),
          pop: Number.isFinite(size) && size > 0 ? Math.round(Math.min(2.4, Math.max(1.08, 1 + 45 / size)) * 100) / 100 : 1.15,
        };
      })
      .filter((s) => s.d),
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
    return { name: s.name, key: s.key, d: s.d, region, cx: s.cx, cy: s.cy, pop: s.pop };
  });

  const dots = [];
  for (const [key, region] of regionOf) {
    if (matched.has(key) || !MICRO_STATES[key]) continue;
    const [x, y] = projection(MICRO_STATES[key]);
    dots.push({ key, x: Math.round(x), y: Math.round(y), region });
  }

  return { outlines, dots };
}
