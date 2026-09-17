import ProductForm from "@/components/admin/ProductForm";

export const metadata = { title: "Edit Product" };

export default async function EditProductPage({ params }) {
  const { id } = await params;
  return <ProductForm id={id} />;
}
