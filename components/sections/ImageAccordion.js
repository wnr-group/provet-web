"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import clsx from "clsx";
import { Enter } from "@/components/sections/entrances";
import SiteImage from "@/components/ui/SiteImage";

// The "Expanding image panels" style of an Image cards section: tall photo
// panels side by side on a light background. The panel under the pointer (or
// with keyboard focus) opens out to show its text and a button, the rest
// narrow to a strip of photograph and a title - the row is browsed with the
// mouse rather than read as a grid. The first panel starts open. Captions sit
// on a frosted white card, so the photos stay bright: no dark overlays.
//
// Phones have no hover, so there the panels are a simple stack of photo cards
// with every caption shown.
export default function ImageAccordion({ section, items }) {
  const [open, setOpen] = useState(0);

  return (
    <div>
      {(section.title || section.body) && (
        <Enter preset="drop" className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">
          {section.title && (
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-ink sm:text-4xl">{section.title}</h2>
          )}
          <span aria-hidden="true" className="mx-auto mt-4 block h-1 w-14 rounded-full bg-gradient-to-r from-brand-500 to-accent-500" />
          {section.body && <p className="mt-4 leading-relaxed text-ink-soft">{section.body}</p>}
        </Enter>
      )}

      {/* Wide screens: the opening row. */}
      <Enter preset="blur" className="hidden h-[28rem] gap-4 lg:flex">
        {items.map((item, i) => {
          const isOpen = i === open;
          const panel = (
            <div className="relative h-full w-full overflow-hidden rounded-[1.75rem] bg-mist-100 shadow-card ring-1 ring-brand-100/70">
              {item.image && (
                <SiteImage
                  src={item.image}
                  alt=""
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  className={clsx(
                    "h-full w-full object-cover transition-transform duration-[1.2s] ease-out",
                    isOpen ? "scale-100" : "scale-110"
                  )}
                />
              )}
              {/* Frosted caption card. */}
              <div className="absolute inset-x-3 bottom-3 rounded-2xl bg-white/85 p-5 shadow-soft ring-1 ring-white/60 backdrop-blur-md">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold tabular-nums tracking-[0.16em] text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="min-w-0 truncate font-display text-lg font-bold tracking-tight text-ink">{item.title}</h3>
                </div>
                {/* The text and button only take room in the open panel. */}
                <div
                  className={clsx(
                    "grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"
                  )}
                >
                  <div className="overflow-hidden">
                    {item.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                    {item.href && (
                      <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-brand-600 px-4 py-2 text-sm font-semibold text-white transition group-hover:bg-accent-500">
                        Explore <ArrowUpRight size={15} className="transition-transform duration-300 group-hover:rotate-45" />
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
          return (
            <div
              key={i}
              onMouseEnter={() => setOpen(i)}
              onFocus={() => setOpen(i)}
              className={clsx(
                "group min-w-0 transition-[flex-grow] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]",
                isOpen ? "flex-[3]" : "flex-1"
              )}
            >
              {item.href ? (
                <Link href={item.href} className="block h-full rounded-[1.75rem] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500">
                  {panel}
                </Link>
              ) : (
                panel
              )}
            </div>
          );
        })}
      </Enter>

      {/* Phones and tablets: a stack of photo cards, every caption shown. */}
      <div className="grid gap-5 sm:grid-cols-2 lg:hidden">
        {items.map((item, i) => {
          const card = (
            <div className="overflow-hidden rounded-3xl bg-white shadow-card ring-1 ring-brand-100/70">
              {item.image && (
                <div className="relative aspect-[16/10] bg-mist-100">
                  <SiteImage src={item.image} alt="" sizes="(min-width: 640px) 50vw, 100vw" className="h-full w-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-3">
                  <span className="font-display text-sm font-bold tabular-nums tracking-[0.16em] text-accent-600">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-display text-lg font-bold tracking-tight text-ink">{item.title}</h3>
                </div>
                {item.text && <p className="mt-2 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                {item.href && (
                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-600">
                    Explore <ArrowUpRight size={15} />
                  </span>
                )}
              </div>
            </div>
          );
          return item.href ? (
            <Link key={i} href={item.href} className="block">
              {card}
            </Link>
          ) : (
            <div key={i}>{card}</div>
          );
        })}
      </div>
    </div>
  );
}
