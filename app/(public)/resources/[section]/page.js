import ContentPage, { buildPageMetadata } from "@/components/sections/ContentPage";

// Menu pages under /resources. The segment names are fixed by
// lib/navigation.js; everything rendered inside comes from the database.
export async function generateMetadata({ params }) {
  const { section } = await params;
  return buildPageMetadata(`resources/${section}`);
}

export default async function ResourcesSectionPage({ params }) {
  const { section } = await params;
  return <ContentPage pageKey={`resources/${section}`} />;
}
