"use client";

import { useState } from "react";
import clsx from "clsx";
import { ChevronDown, Mail, MapPin, Phone } from "lucide-react";
import { MAP_WIDTH, MAP_HEIGHT } from "@/lib/mapSize";
import { RevealGroup, RevealItem } from "@/components/motion/Reveal";

// The world map with the countries we export to filled in, and a card per
// region naming them. Hovering a region (its button or its card) lights it on
// the map. A country that has a distributor contact opens when clicked, showing
// the distributor's name, address, phone and email, and is marked on the map.
export default function ExportMap({ outlines, dots, regions }) {
  const [active, setActive] = useState(null);
  // The first card's first country with a contact starts open, so the page
  // shows what clicking a country does.
  const [open, setOpen] = useState(() => regions[0]?.countries.find((c) => c.contact)?.key ?? null);
  const lit = (region) => region && (!active || active === region);
  const total = regions.reduce((n, r) => n + r.countries.length, 0);

  return (
    <div>
      <svg viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`} role="img" aria-label={`World map highlighting ${total} export countries`} className="w-full">
        {outlines.map((o) => (
          <path
            key={o.name}
            d={o.d}
            className={clsx(
              "stroke-white transition-colors duration-300",
              o.key === open ? "fill-accent-500" : o.region ? (lit(o.region) ? "fill-brand-500" : "fill-brand-200") : "fill-brand-100/80"
            )}
            strokeWidth={0.5}
          >
            {o.region && <title>{`${o.name} - ${o.region}`}</title>}
          </path>
        ))}
        {dots.map((d) => (
          <circle
            key={d.key}
            cx={d.x}
            cy={d.y}
            r={d.key === open ? 6.5 : 4.5}
            className={clsx("stroke-white transition-all duration-300", d.key === open || lit(d.region) ? "fill-accent-500" : "fill-brand-200")}
            strokeWidth={1.2}
          />
        ))}
      </svg>

      <div className="mt-6 flex flex-wrap justify-center gap-2" onMouseLeave={() => setActive(null)}>
        {regions.map((r) => (
          <button
            key={r.name}
            type="button"
            onMouseEnter={() => setActive(r.name)}
            onFocus={() => setActive(r.name)}
            onBlur={() => setActive(null)}
            onClick={() => setActive(active === r.name ? null : r.name)}
            aria-pressed={active === r.name}
            className={clsx(
              "rounded-full px-4 py-1.5 text-sm font-semibold ring-1 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-500",
              active === r.name ? "bg-brand-600 text-white ring-brand-600" : "bg-white text-ink ring-brand-200 hover:bg-mist-50"
            )}
          >
            {r.name} <span className="opacity-70">· {r.countries.length}</span>
          </button>
        ))}
      </div>

      <RevealGroup className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4" stagger={0.1}>
        {regions.map((r, i) => (
          <RevealItem key={r.name} direction="up" distance={26} className="h-full">
            <article
              onMouseEnter={() => setActive(r.name)}
              onMouseLeave={() => setActive(null)}
              className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white p-6 shadow-soft ring-1 ring-brand-100/70 transition duration-300 ease-out hover:-translate-y-1.5 hover:shadow-hover hover:ring-brand-300"
            >
              <span
                aria-hidden="true"
                className="absolute inset-x-0 top-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-brand-500 to-accent-500 transition-transform duration-300 group-hover:scale-x-100"
              />
              <div className="flex items-start justify-between gap-3">
                <span className="font-display text-3xl font-extrabold leading-none text-brand-200 transition-colors duration-300 group-hover:text-accent-500">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="rounded-full bg-accent-100 px-2.5 py-0.5 text-xs font-semibold text-accent-700">
                  {r.countries.length} {r.countries.length === 1 ? "country" : "countries"}
                </span>
              </div>
              <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink transition-colors duration-300 group-hover:text-brand-600">
                {r.name}
              </h3>
              <ul className="mt-3 space-y-1 border-t border-brand-100 pt-3">
                {r.countries.map((country) => (
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
            </article>
          </RevealItem>
        ))}
      </RevealGroup>
    </div>
  );
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
