import Link from "next/link";
import clsx from "clsx";
import { ArrowRight, FileText } from "lucide-react";
import { EnterGroup, EnterItem } from "@/components/sections/entrances";

// Technical booklets, presented as the printed reference brochures they are -
// deliberately not like the magazine rack (components/sections/MagazineRack).
// A magazine is a glossy periodical; a booklet is a matte, stapled reference
// volume on one topic:
//
//   * Matte paper cover: no gloss, a faint paper grain, two staples on the
//     spine and a coloured index tab on the fore-edge.
//   * Numbered volumes ("No. 01") with "Technical booklet" and the topic,
//     rather than an issue month and cover lines.
//   * Every booklet is an equal volume with its own request link - no
//     "latest" featured, because a reference set has no latest.
//   * On hover the cover opens on its staples to show the inside page.
//
// Like the magazine covers, the images Provet has are landscape crops of the
// top of each cover, so the cover is composed: that crop at its own shape,
// then the printed lower half. Opening is motion-safe only.

const TABS = ["bg-accent-500", "bg-brand-500", "bg-[#1d7a4f]", "bg-orange-500"];

function Booklet({ item, index }) {
  const number = String(index + 1).padStart(2, "0");
  return (
    <div className="relative mx-auto w-full max-w-[17rem] [perspective:1600px]">
      {/* Shadow on the desk */}
      <span
        aria-hidden="true"
        className="absolute -bottom-3 left-[6%] h-5 w-[88%] rounded-[50%] bg-brand-900/20 blur-md"
      />

      {/* Inside page, revealed when the cover opens */}
      <div
        aria-hidden="true"
        className="absolute inset-0 flex flex-col rounded-[2px_8px_8px_2px] bg-[#fbfaf6] p-5 ring-1 ring-black/5"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-accent-600">Inside this booklet</p>
        <p className="mt-2 font-display text-sm font-bold leading-snug text-brand-900">{item.title}</p>
        <div className="mt-4 space-y-2">
          {[92, 80, 88, 64, 84, 72].map((w, i) => (
            <span key={i} className="block h-1.5 rounded-full bg-brand-900/10" style={{ width: `${w}%` }} />
          ))}
        </div>
        <p className="mt-auto text-[11px] leading-snug text-ink-soft">
          Request a copy from the Provet team.
        </p>
      </div>

      {/* Cover, hinged on the staples */}
      <div className="relative origin-left transition-transform duration-700 ease-out [transform-style:preserve-3d] motion-safe:group-hover:[transform:rotateY(-58deg)]">
        <div className="relative flex aspect-[3/4] flex-col overflow-hidden rounded-[2px_8px_8px_2px] bg-[#fbfaf6] shadow-[0_18px_34px_-18px_rgba(21,18,48,0.5)] ring-1 ring-black/10">
          {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded cover */}
          <img src={item.image} alt={item.title || ""} loading="lazy" className="aspect-[4/3] w-full object-cover object-top" />
          <div className="relative flex flex-1 flex-col justify-between border-t border-black/5 bg-[#fbfaf6] p-4">
            {/* Faint paper grain */}
            <span aria-hidden="true" className="bg-dots pointer-events-none absolute inset-0 text-brand-900/[0.04]" />
            <div className="relative">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-ink-soft">Technical booklet</p>
              <p className="mt-1 font-display text-base font-extrabold leading-tight text-brand-900">{item.title}</p>
            </div>
            <div className="relative flex items-end justify-between">
              <span className="font-display text-2xl font-extrabold leading-none text-brand-900/15">No. {number}</span>
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-brand-700">Provet</span>
            </div>
          </div>
          {/* Staples on the spine */}
          <span aria-hidden="true" className="absolute left-1 top-[22%] h-5 w-0.5 rounded-full bg-gradient-to-b from-slate-300 via-slate-500 to-slate-300" />
          <span aria-hidden="true" className="absolute bottom-[22%] left-1 h-5 w-0.5 rounded-full bg-gradient-to-b from-slate-300 via-slate-500 to-slate-300" />
          {/* Fold shading along the spine */}
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 left-0 w-3 bg-gradient-to-r from-black/10 to-transparent" />
        </div>
        {/* Index tab on the fore-edge */}
        <span
          aria-hidden="true"
          className={clsx("absolute -right-2 top-[58%] h-10 w-3 rounded-r-md shadow-sm", TABS[index % TABS.length])}
        />
      </div>
    </div>
  );
}

// Where a booklet's request goes: its own link if the admin gave it one,
// otherwise the contact page.
const requestHref = (item) => item.href || "/contact";

// Booklets per row on wide screens - the admin's "Columns" setting.
const COLUMNS = { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4" };

export default function BookletShelf({ section, items, columns = 3 }) {
  return (
    <div>
      {section.title && (
        <div className="mb-12 flex items-end justify-between gap-4 border-b border-brand-900/10 pb-3">
          <h2 className="font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">{section.title}</h2>
          <span className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-soft">
            {items.length} {items.length === 1 ? "volume" : "volumes"}
          </span>
        </div>
      )}
      {section.body && <p className="-mt-6 mb-12 max-w-2xl leading-relaxed text-ink-soft">{section.body}</p>}

      <EnterGroup className={clsx("grid gap-x-8 gap-y-14 sm:grid-cols-2", COLUMNS[columns] || COLUMNS[3])} stagger={0.1}>
        {items.map((item, i) => (
          <EnterItem key={`${item.title}-${i}`} preset="spring">
            <Link href={requestHref(item)} className="group block">
              <Booklet item={item} index={i} />
              <div className="mx-auto mt-7 max-w-[17rem]">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-[0.18em] text-accent-600">
                  <FileText size={12} /> Volume {String(i + 1).padStart(2, "0")}
                </p>
                <p className="mt-1 font-display text-lg font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
                  {item.title}
                </p>
                {item.text && <p className="mt-1 text-sm leading-relaxed text-ink-soft">{item.text}</p>}
                <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-semibold text-brand-700">
                  Request this booklet
                  <ArrowRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          </EnterItem>
        ))}
      </EnterGroup>
    </div>
  );
}
