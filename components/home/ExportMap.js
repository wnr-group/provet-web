"use client";

import { useRef, useState, useSyncExternalStore } from "react";
import clsx from "clsx";
import { ChevronDown, Mail, MapPin, Phone, Globe2 } from "lucide-react";
import { MAP_WIDTH, MAP_HEIGHT } from "@/lib/mapSize";

// The world map with the countries we export to filled in, and a plain list of
// their names (no regions). A country that has a distributor contact opens when
// clicked, showing the distributor's name, address, phone and email, and is
// marked on the map.
export default function ExportMap({ outlines, dots, regions }) {
  // The regions are only how the admin groups the countries; visitors see one
  // list, each country once.
  const countries = [...new Map(regions.flatMap((r) => r.countries).map((c) => [c.key, c])).values()];
  // The first country with a contact starts open, so the page shows what
  // clicking a country does.
  const [open, setOpen] = useState(() => countries.find((c) => c.contact)?.key ?? null);
  const total = countries.length;
  const columnCount = useSyncExternalStore(watchColumns, currentColumns, () => 4);

  // The country under the pointer (any country, not only the ones we export
  // to): it grows out of the map and a label with its name follows the cursor.
  // Mouse hover, and tap on touch screens. The label's text comes from the
  // admin's spelling for our countries, the map's own name for the rest.
  const wrapRef = useRef(null);
  const [hover, setHover] = useState(null);
  const names = new Map(countries.map((c) => [c.key, c.name]));
  const track = (e, key, name, region) => {
    const box = wrapRef.current?.getBoundingClientRect();
    if (!box) return;
    setHover({ key, region, name: names.get(key) || name, x: e.clientX - box.left, y: e.clientY - box.top, w: box.width });
  };
  const hoverHandlers = (key, name, region) => ({
    onPointerEnter: (e) => track(e, key, name, region),
    onPointerMove: (e) => track(e, key, name, region),
    onPointerLeave: () => setHover(null),
    onClick: (e) => track(e, key, name, region),
  });
  const popped = hover && outlines.find((o) => o.key === hover.key);


  return (
    <div>
      <div ref={wrapRef} className="relative overflow-hidden rounded-3xl bg-white p-2 shadow-card ring-1 ring-brand-100 sm:p-4">
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label={`World map highlighting ${total} export countries`} className="w-full">
        {outlines.map((o) => (
          <path
            key={o.name}
            d={o.d}
            className={clsx(
              "transition-colors duration-300",
              o.region ? "cursor-pointer stroke-white" : "stroke-white",
              o.region ? "fill-accent-500" : "fill-brand-600"
            )}
            strokeWidth={0.6}
            {...(o.region ? hoverHandlers(o.key, o.name, o.region) : {})}
          />
        ))}
        {/* The hovered country again, on top and bigger, in the logo magenta
            with a white outline and a shadow, growing from its own centre.
            Only countries we export to pop. It ignores the pointer, so
            moving between neighbours never flickers. */}
        {popped && (
          <path
            key={popped.key}
            d={popped.d}
            pointerEvents="none"
            className="fill-accent-500 stroke-white"
            strokeWidth={1.6}
            style={{
              transformOrigin: `${popped.cx}px ${popped.cy}px`,
              "--pop": popped.pop,
              animation: "country-pop 220ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
              filter: "drop-shadow(0 8px 10px rgba(57,49,133,0.55))",
            }}
          />
        )}
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={d.x}
            cy={d.y}
            r={hover?.key === d.key ? 9 : d.key === open ? 6.5 : 4.5}
            className={clsx("cursor-pointer stroke-white transition-all duration-300", "fill-accent-500")}
            strokeWidth={1.2}
            {...hoverHandlers(d.key, names.get(d.key) || d.key, d.region)}
          />
        ))}
      </svg>

      {hover && (
        // Kept inside the map: clamped sideways, and flipped below the
        // pointer when there is no room above it.
        <div
          role="status"
          className={clsx(
            "pointer-events-none absolute z-10 -translate-x-1/2 whitespace-nowrap rounded-xl bg-white px-3 py-1.5 text-sm font-semibold text-brand-700 shadow-lift ring-2 ring-accent-500",
            hover.y < 64 ? "translate-y-5" : "-translate-y-full"
          )}
          style={{ left: Math.min(Math.max(hover.x, 70), hover.w - 70), top: hover.y < 64 ? hover.y : hover.y - 18 }}
        >
          <span className="flex items-center gap-1.5">
            <Globe2 size={14} className="text-accent-500" />
            {hover.name}
          </span>
        </div>
      )}
      </div>

      {/* Each column is its own list, so an open country pushes down only the
          names under it. In one shared grid it stretched its whole row, leaving
          a blank block beside it. Names still read left to right. */}
      <div className="mx-auto mt-8 grid max-w-5xl items-start gap-x-6 gap-y-1 rounded-2xl bg-white p-5 shadow-soft ring-1 ring-brand-100/70 sm:grid-cols-2 sm:p-6 lg:grid-cols-4">
        {Array.from({ length: columnCount }, (_, column) => (
          <ul key={column} className="flex min-w-0 flex-col gap-1">
            {countries
              .filter((_, i) => i % columnCount === column)
              .map((country) => (
                <li key={country.key}>
                  {country.contact ? (
                    <CountryContact
                      country={country}
                      isOpen={open === country.key}
                      onToggle={() => setOpen(open === country.key ? null : country.key)}
                    />
                  ) : (
                    <span className="flex items-center gap-2 py-1 text-sm text-ink-soft">
                      <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
                      {country.name}
                    </span>
                  )}
                </li>
              ))}
          </ul>
        ))}
      </div>
    </div>
  );
}

// How many columns the country list has at this width: 1, 2 from `sm`, 4 from
// `lg` (matching the grid classes above). The server renders four.
const COLUMN_QUERIES = ["(min-width: 64rem)", "(min-width: 40rem)"];

function watchColumns(onChange) {
  const queries = COLUMN_QUERIES.map((q) => window.matchMedia(q));
  queries.forEach((q) => q.addEventListener("change", onChange));
  return () => queries.forEach((q) => q.removeEventListener("change", onChange));
}

function currentColumns() {
  const [large, small] = COLUMN_QUERIES.map((q) => window.matchMedia(q).matches);
  return large ? 4 : small ? 2 : 1;
}

// A country row that opens to its distributor's details.
function CountryContact({ country, isOpen, onToggle }) {
  const { name, address, phone, email } = country.contact;
  const panelId = `export-contact-${country.key.replace(/\W+/g, "-")}`;

  return (
    <div className={clsx("rounded-lg transition-colors duration-300", isOpen && "bg-mist-50")}>
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        aria-controls={panelId}
        className="group/row flex w-full items-center gap-2 rounded-lg px-1 py-1 text-left text-sm text-ink-soft transition-colors duration-200 hover:text-brand-600"
      >
        <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-500" />
        <span className={clsx("flex-1 transition-transform duration-200 group-hover/row:translate-x-0.5", isOpen && "font-semibold text-brand-700")}>
          {country.name}
        </span>
        <ChevronDown size={15} className={clsx("shrink-0 transition-transform duration-300", isOpen && "rotate-180 text-accent-500")} />
      </button>

      {/* Grid-rows trick: animates the panel's height without measuring it. */}
      <div
        id={panelId}
        role="region"
        aria-label={`${country.name} distributor`}
        className={clsx("grid transition-[grid-template-rows] duration-300 ease-out", isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}
      >
        <div className="overflow-hidden">
          <dl className="space-y-2.5 px-3 pb-3 pt-1 text-sm">
            {name && <dt className="font-display font-bold text-ink">{name}</dt>}
            {address && (
              <dd className="flex gap-2 text-ink-soft">
                <MapPin size={15} className="mt-0.5 shrink-0 text-accent-500" />
                <span className="whitespace-pre-line">{address}</span>
              </dd>
            )}
            {phone && (
              <dd className="flex gap-2">
                <Phone size={15} className="mt-0.5 shrink-0 text-accent-500" />
                <a href={`tel:${phone.replace(/[^\d+]/g, "")}`} tabIndex={isOpen ? 0 : -1} className="text-ink-soft transition-colors hover:text-accent-600">
                  {phone}
                </a>
              </dd>
            )}
            {email && (
              <dd className="flex gap-2">
                <Mail size={15} className="mt-0.5 shrink-0 text-accent-500" />
                <a href={`mailto:${email}`} tabIndex={isOpen ? 0 : -1} className="break-all text-ink-soft transition-colors hover:text-accent-600">
                  {email}
                </a>
              </dd>
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}
