"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import Pagination from "@/components/ui/Pagination";

export default function ProductsPagination({ page, totalPages }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const onChange = (nextPage) => {
    const next = new URLSearchParams(searchParams);
    next.set("page", String(nextPage));
    router.push(`${pathname}?${next.toString()}`);
  };

  return <Pagination page={page} totalPages={totalPages} onChange={onChange} />;
}
