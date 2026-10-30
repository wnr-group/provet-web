import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollProgress from "@/components/motion/ScrollProgress";
import BackToTop from "@/components/motion/BackToTop";
import { getCategoryTree } from "@/lib/data";
import { navCategoryTree } from "@/lib/categoryTree";

// The Products submenu is filled from the real catalogue, so the categories
// are read once here in the layout rather than by the navbar on every page.
// It lists the top-level categories; their subcategories are one click in.
export default async function PublicLayout({ children }) {
  const categories = await getCategoryTree();

  return (
    <div className="flex min-h-screen flex-col">
      <ScrollProgress />
      <Navbar categories={navCategoryTree(categories)} />
      <main className="flex-1">{children}</main>
      <Footer />
      <BackToTop />
    </div>
  );
}
