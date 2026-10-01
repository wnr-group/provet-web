"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCatalogueNavigation } from "@/components/catalogue/CatalogueNavigation";
import Pagination from "@/components/ui/Pagination";

export default function ProductsPagination({ page, totalPages }) {
  const { navigate } = useCatalogueNavigation();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    navigate(`${pathname}?${next.toString()}`);
  };

  return <Pagination page={page} totalPages={totalPages} onChange={onChange} />;
}
