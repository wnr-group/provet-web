// A product page while it loads: its own shape (gallery beside the details),
// so opening a product doesn't flash the catalogue's skeleton from the
// loading state one level up.
const shimmer = "animate-pulse rounded-lg bg-brand-100/60";

export default function Loading() {
  return (
    <div aria-busy="true" aria-label="Loading product" className="container-page py-10 sm:py-14">
      <div className={`${shimmer} h-3 w-56`} />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square animate-pulse rounded-3xl bg-mist-100" />
        <div className="space-y-4">
          <div className={`${shimmer} h-3 w-40`} />
          <div className={`${shimmer} h-10 w-3/4`} />
          <div className={`${shimmer} h-4 w-full`} />
          <div className={`${shimmer} h-4 w-11/12`} />
          <div className={`${shimmer} h-4 w-2/3`} />
          <div className="flex gap-3 pt-4">
            <div className="h-11 w-40 animate-pulse rounded-full bg-brand-100" />
            <div className="h-11 w-36 animate-pulse rounded-full bg-mist-100" />
          </div>
        </div>
      </div>
    </div>
  );
}
