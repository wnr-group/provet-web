import CatalogueSkeleton from "@/components/catalogue/CatalogueSkeleton";

// Shown while the Products page renders on arrival from another page. Filter,
// search and page changes on the page itself keep the current results on
// screen instead, dimmed (components/catalogue/CatalogueNavigation.js).
export default function Loading() {
  return <CatalogueSkeleton />;
}
