import ContentPage, { buildPageMetadata } from "@/components/sections/ContentPage";
import CoreValuesPage from "@/components/about/CoreValuesPage";

// Menu pages under /about. The segment names are fixed by
// lib/navigation.js; everything rendered inside comes from the database.
// Core Values lays its blocks out in code (components/about/
// CoreValuesPage.js); every other page renders generically.
// Rendered on every request: this page is built from admin-edited data, and
// without this Next.js would serve a cached copy in production, so changes
// saved in the admin would not show up on the live site.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { section } = await params;
  return buildPageMetadata(`about/${section}`);
}

export default async function AboutSectionPage({ params }) {
  const { section } = await params;
  if (section === "core-values") return <CoreValuesPage />;
  return <ContentPage pageKey={`about/${section}`} />;
}
