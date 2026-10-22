import Link from "next/link";
import clsx from "clsx";
import { Check } from "lucide-react";
import SiteImage from "@/components/ui/SiteImage";
import { categoryTheme, rangeThemeVars } from "@/lib/categoryTheme";

// The ranges as a row of photo tiles across the top of the catalogue - the
// way the animal-health catalogues it is modelled on lead with the species
// (Intas's Ruminant / Poultry / Aquatic tiles): pick the sector first, then
// browse its products. "All products", then each range from the admin, in
// its admin order.
//
// The range's photo (Admin > Categories) fills the tile and stays clearly
// visible: only a short fade at the foot darkens it, enough for the name,
// label and product count written over it there. The chosen tile is outlined
// in its range's colour with a tick.
//
// Every range in the admin gets a tile - a new one shows up here as soon as
// it is added, before it has products (its tile reads "0 products" and opens
// the range's page, which says so). A range without a photo yet takes the
// brand's colours instead.

// "All products" has its own photo, unlike any one range's: feed pellets
// poured from a bowl - the products side of animal health rather than a
// species. Pexels #7781984 (free to use under the Pexels licence), cropped to
// 1200x800 in public/content/catalogue/.
const ALL_PRODUCTS_IMAGE = "/content/catalogue/all-products.jpg";

export default function RangeTabs({ ranges, activeId }) {
  const total = ranges.reduce((sum, r) => sum + (r.productCount || 0), 0);
  const tiles = [
    { id: null, name: "All products", label: "Every range", count: total, href: "/products", image: ALL_PRODUCTS_IMAGE, theme: categoryTheme(null) },
    ...ranges.map((r) => {
      const theme = categoryTheme(r);
      return {
        id: r.id,
        name: r.name,
        label: theme.label,
        count: r.productCount,
        href: `/products?category=${r.slug}`,
        image: r.image,
        theme,
      };
    }),
  ];

  return (
    <nav aria-label="Product ranges" className="border-b border-brand-100 bg-white">
      <ul className="container-page flex gap-3 overflow-x-auto py-5 [scrollbar-width:none] sm:gap-4 [&::-webkit-scrollbar]:hidden">
        {tiles.map(({ id, name, label, count, href, image, theme }) => {
          const active = id === (activeId || null);
          return (
            <li key={id || "all"} className="min-w-[14rem] flex-1 sm:min-w-0">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                style={rangeThemeVars(theme)}
                className={clsx(
                  "group relative isolate flex h-28 flex-col justify-end overflow-hidden rounded-xl p-4 text-white transition-shadow duration-300 sm:h-32",
                  active
                    ? "ring-2 ring-(--range-accent) ring-offset-2"
                    : "hover:shadow-[0_16px_32px_-18px_rgba(32,27,75,0.55)]"
                )}
              >
                {/* The tile's photo, or - for a range without one yet - the
                    brand's colours. */}
                {image ? (
                  <>
                    <SiteImage
                      src={image}
                      alt=""
                      sizes="(min-width: 640px) 25vw, 14rem"
                      className="absolute inset-0 -z-20 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* A short fade at the foot only, under the text. */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -z-10 bg-[linear-gradient(to_top,rgba(21,18,48,0.85)_0%,rgba(21,18,48,0.45)_38%,transparent_70%)]"
                    />
                  </>
                ) : (
                  <span aria-hidden="true" className="absolute inset-0 -z-20 bg-[linear-gradient(120deg,#2b2565_0%,#483ea8_55%,#b60765_130%)]" />
                )}

                <span className="flex items-center gap-1.5">
                  <span className="truncate font-display text-lg font-bold leading-tight [text-shadow:0_1px_8px_rgba(10,8,30,0.5)]">
                    {name}
                  </span>
                  {active && <Check size={16} aria-label="Selected" className="shrink-0" />}
                </span>
                <span className="mt-0.5 block truncate text-xs text-white/85 [text-shadow:0_1px_6px_rgba(10,8,30,0.5)]">
                  {label && <>{label} · </>}
                  <span className="font-semibold tabular-nums text-white">{count}</span> {count === 1 ? "product" : "products"}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
