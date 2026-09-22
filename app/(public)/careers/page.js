import ContentPage, { buildPageMetadata } from "@/components/sections/ContentPage";

// Without this Next prerenders the page once at build time: it reads no
// params, cookies or searchParams, so nothing marks it dynamic automatically
// and admin edits would never show up without a rebuild. The /about, /media
// and /resources pages are dynamic already because they read a route param.
// Same reason (public)/page.js and (public)/about/page.js set it.
export const dynamic = "force-dynamic";

export async function generateMetadata() {
  return buildPageMetadata("careers");
}

export default function CareersPage() {
  return <ContentPage pageKey="careers" />;
}
