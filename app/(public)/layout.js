import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { getCategories } from "@/lib/data";

// The Products submenu is filled from the real catalogue, so the categories
// are read once here in the layout rather than by the navbar on every page.
export default async function PublicLayout({ children }) {
  const categories = await getCategories();

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar categories={categories} />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
