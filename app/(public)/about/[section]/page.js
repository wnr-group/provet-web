import ContentPage, { buildPageMetadata } from "@/components/sections/ContentPage";

// Menu pages under /about. The segment names are fixed by
// lib/navigation.js; everything rendered inside comes from the database.
export async function generateMetadata({ params }) {
  const { section } = await params;
  return buildPageMetadata(`about/${section}`);
}

export default async function AboutSectionPage({ params }) {
  const { section } = await params;
  return <ContentPage pageKey={`about/${section}`} />;
}
