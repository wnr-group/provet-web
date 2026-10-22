// The Products page while it loads: the same shapes as the real page - the
// header, the range tiles, the filter panel and a grid of cards - so arriving
// from another page shows the layout at once instead of a frozen screen, and
// nothing moves when the content replaces it.

const shimmer = "animate-pulse rounded-md bg-brand-100/60";

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border border-brand-100 bg-white">
      <div className="aspect-[4/3] animate-pulse bg-mist-100" />
      <div className="space-y-2 p-3.5 sm:p-4">
        <div className={`${shimmer} h-2.5 w-1/3`} />
        <div className={`${shimmer} h-4 w-2/3`} />
        <div className={`${shimmer} h-3 w-full`} />
        <div className={`${shimmer} h-3 w-5/6`} />
        <div className="border-t border-brand-100/70 pt-3">
          <div className={`${shimmer} h-3 w-1/2`} />
        </div>
      </div>
    </div>
  );
}

export default function CatalogueSkeleton({ cards = 9 }) {
  return (
    <div aria-busy="true" aria-label="Loading products">
      {/* Header */}
      <div className="bg-mist-50">
        <div className="container-page space-y-3 pb-8 pt-7 sm:pb-10 sm:pt-9">
          <div className={`${shimmer} h-3 w-32`} />
          <div className={`${shimmer} mt-5 h-3 w-28`} />
          <div className={`${shimmer} h-9 w-64`} />
          <div className={`${shimmer} h-4 w-full max-w-3xl`} />
          <div className={`${shimmer} h-4 w-2/3 max-w-2xl`} />
        </div>
      </div>

      {/* Range tiles */}
      <div className="border-b border-brand-100">
        <div className="container-page flex gap-4 overflow-hidden py-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[4.5rem] min-w-[13.5rem] flex-1 animate-pulse rounded-xl border border-brand-100 bg-white" />
          ))}
        </div>
      </div>

      {/* Filters and grid */}
      <div className="container-page grid gap-5 pb-16 pt-6 sm:pt-8 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-10">
        <div className="h-12 animate-pulse rounded-xl border border-brand-100 bg-white lg:h-[28rem]" />
        <div>
          <div className="mb-5 flex items-center justify-between border-b border-brand-100 pb-4">
            <div className={`${shimmer} h-4 w-48`} />
            <div className={`${shimmer} h-9 w-48`} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:gap-5">
            {Array.from({ length: cards }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
