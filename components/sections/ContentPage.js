import { notFound } from "next/navigation";
import { getManagedPage } from "@/lib/data";
import { MANAGED_PAGES } from "@/lib/navigation";
import PageSections from "@/components/sections/PageSections";
import Reveal from "@/components/motion/Reveal";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=1920&h=500&q=80";

// Builds the <head> for a managed page. Exported so each route can hand it
// its own key - the fallbacks (SEO title -> page title) already live in the
// serializer, so this stays a lookup.
export async function buildPageMetadata(key) {
  const data = await getManagedPage(key);
  if (!data) return { title: "Page Not Found" };
  return {
    title: data.page.seoTitle,
    description: data.page.seoDescription || undefined,
  };
}

// The one renderer behind every menu page. The route supplies the key; the
// hero, the copy and every section below it come from the database, so a new
// page needs a row rather than a component.
export default async function ContentPage({ pageKey }) {
  const data = await getManagedPage(pageKey);
  // No row yet means the admin hasn't set the page up - a 404 is honest,
  // where an empty shell would look like a broken page.
  if (!data) notFound();

  const { page, sections } = data;
  const group = MANAGED_PAGES.find((p) => p.key === pageKey)?.group;

  return (
    <div className="bg-white">
      <div className="relative isolate overflow-hidden bg-brand-900 py-12 text-white sm:py-16">
        {/* eslint-disable-next-line @next/next/no-img-element -- admin-uploaded or fixed fallback, not a dynamic host */}
        <img
          src={page.heroImage || DEFAULT_HERO}
          alt=""
          aria-hidden="true"
          className="absolute inset-0 -z-10 h-full w-full object-cover"
        />
        <div className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_bottom,rgba(21,18,48,0.92),rgba(21,18,48,0.8)_55%,rgba(21,18,48,0.9))]" />
        <Reveal mode="mount" className="container-page">
          {/* Which menu the page hangs off, so a visitor who arrived from a
              search result still knows where they are in the site. */}
          {group && <span className="badge bg-white/10 text-accent-200">{group}</span>}
          <h1 className="mt-4 font-display text-3xl font-extrabold tracking-tight sm:text-5xl">{page.title}</h1>
          <span aria-hidden="true" className="mt-5 block h-1 w-16 rounded-full bg-accent-400" />
          {page.description && (
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-brand-100">{page.description}</p>
          )}
        </Reveal>
      </div>

      <PageSections sections={sections} />
    </div>
  );
}
