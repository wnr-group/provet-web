import ContentPage, { buildPageMetadata } from "@/components/sections/ContentPage";

// Menu pages under /media. The segment names are fixed by
// lib/navigation.js; everything rendered inside comes from the database.
// Rendered on every request: this page is built from admin-edited data, and
// without this Next.js would serve a cached copy in production, so changes
// saved in the admin would not show up on the live site.
export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { section } = await params;
  return buildPageMetadata(`media/${section}`);
}

export default async function MediaSectionPage({ params }) {
  const { section } = await params;
  return <ContentPage pageKey={`media/${section}`} />;
}
