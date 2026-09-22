import ContentPage, { buildPageMetadata } from "@/components/sections/ContentPage";

// Menu pages under /media. The segment names are fixed by
// lib/navigation.js; everything rendered inside comes from the database.
export async function generateMetadata({ params }) {
  const { section } = await params;
  return buildPageMetadata(`media/${section}`);
}

export default async function MediaSectionPage({ params }) {
  const { section } = await params;
  return <ContentPage pageKey={`media/${section}`} />;
}
