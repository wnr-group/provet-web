import { notFound } from "next/navigation";
import { getManagedPage } from "@/lib/data";
import { MANAGED_PAGES } from "@/lib/navigation";
import PageSections from "@/components/sections/PageSections";
import PageBanner from "@/components/ui/PageBanner";

export const DEFAULT_HERO =
  "https://images.unsplash.com/photo-1594987057733-1fb3fe5707c9?auto=format&fit=crop&w=900&h=700&q=80";

const unsplash = (id, w = 1200, h = 900) =>
  `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&h=${h}&q=80`;

// Each menu page's banner composition (components/ui/PageBanner.js), by page
// key or by section; anything unlisted gets the asymmetric composition. The
// banner's title, intro and main photo stay the admin's (page settings); a
// composition that pairs two photos takes its second from here.
const BANNERS = {
  "about/who-we-are": { variant: "asymmetric", secondaryImage: unsplash("1582719471384-894fbb16e074", 800, 600) },
  "about/core-values": { variant: "editorial" },
  "about/why-provet": { variant: "oversized" },
  careers: { variant: "immersive" },
};
const BANNERS_BY_SECTION = {
  resources: { variant: "oversized" },
  media: { variant: "editorial" },
};
// Banner photos are stored wide (1920x600) for the wide compositions. The
// asymmetric one shows its photo in a tall frame, where a wide strip was
// zoomed and cropped into a blurry slice - so for it, ask Unsplash for a shape
// that fits the frame. Other URLs (uploads) are left as they are.
function framedImage(url, variant) {
  if (variant !== "asymmetric" || !/^https:\/\/images\.unsplash\.com\//.test(url || "")) return url;
  return url.replace(/([?&])w=\d+/, "$1w=1200").replace(/([?&])h=\d+/, "$1h=1000");
}

export function bannerFor(pageKey) {
  return BANNERS[pageKey] || BANNERS_BY_SECTION[pageKey.split("/")[0]] || { variant: "asymmetric" };
}

// Home / the menu the page hangs off / the page. Only About Us has a page of
// its own to link back to.
export function pageCrumbs(pageKey, title) {
  const group = MANAGED_PAGES.find((p) => p.key === pageKey)?.group;
  return [
    { label: "Home", href: "/" },
    ...(group && group !== title ? [{ label: group, href: group === "About Us" ? "/about" : undefined }] : []),
    { label: title },
  ];
}

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

  return (
    <div className="bg-white">
      {/* Everything in the banner is edited in Admin > Website Content > page
          settings (title, intro, hero image); the breadcrumb names the menu
          the page hangs off. */}
      <PageBanner
        {...bannerFor(pageKey)}
        crumbs={pageCrumbs(pageKey, page.title)}
        title={page.title}
        description={page.description}
        image={framedImage(page.heroImage || DEFAULT_HERO, bannerFor(pageKey).variant)}
      />

      <PageSections sections={sections} />
    </div>
  );
}
