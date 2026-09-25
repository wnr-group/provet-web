import { notFound } from "next/navigation";
import { getManagedPage } from "@/lib/data";
import { MANAGED_PAGES } from "@/lib/navigation";
import PageSections from "@/components/sections/PageSections";
import PageBanner from "@/components/ui/PageBanner";

const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1579165466949-3180a3d056d5?auto=format&fit=crop&w=900&h=700&q=80";

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
      {/* Everything in the banner is edited in Admin > Website Content > page
          settings (title, intro, hero image); the breadcrumb names the menu
          the page hangs off. */}
      <PageBanner
        eyebrow={group}
        title={page.title}
        description={page.description}
        image={page.heroImage || DEFAULT_HERO}
      />

      <PageSections sections={sections} />
    </div>
  );
}
