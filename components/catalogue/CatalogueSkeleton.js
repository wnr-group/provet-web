// The Products page while it loads: the same shapes as the real page - the
// banner, the filter panel and a grid of cards - so arriving from another page
// shows the layout at once instead of a frozen screen, and nothing moves when
// the content replaces it.

const shimmer = "animate-pulse rounded-lg bg-brand-100/60";

export function ProductCardSkeleton() {
  return (
    <div className="flex h-full flex-col rounded-2xl bg-white p-2 shadow-soft ring-1 ring-brand-100/80 sm:p-3">
      <div className="aspect-square animate-pulse rounded-xl bg-mist-100" />
      <div className="mt-3 space-y-2 px-1 sm:px-1.5">
        <div className={`${shimmer} h-2.5 w-1/3`} />
        <div className={`${shimmer} h-4 w-2/3`} />
        <div className={`${shimmer} h-3 w-full`} />
        <div className={`${shimmer} h-3 w-5/6`} />
      </div>
    </div>
  );
}

export default function CatalogueSkeleton({ cards = 9 }) {
  return (
    <div aria-busy="true" aria-label="Loading products">
      {/* Banner */}
      <div className="bg-mist-50">
        <div className="container-page grid items-center gap-10 py-14 lg:grid-cols-2 lg:py-20">
          <div className="space-y-4">
            <div className={`${shimmer} h-3 w-32`} />
            <div className={`${shimmer} h-12 w-3/4`} />
            <div className={`${shimmer} h-4 w-full max-w-lg`} />
            <div className={`${shimmer} h-4 w-5/6 max-w-lg`} />
            <div className={`${shimmer} h-4 w-2/3 max-w-lg`} />
            <div className="h-10 w-44 animate-pulse rounded-full bg-accent-100" />
          </div>
          <div className="hidden aspect-[4/3] animate-pulse rounded-3xl bg-brand-100/50 lg:block" />
        </div>
      </div>

      {/* Filters and grid */}
      <div className="container-page grid gap-8 py-10 sm:py-14 lg:grid-cols-[260px_1fr]">
        <div className="hidden h-[28rem] animate-pulse rounded-3xl bg-white shadow-soft ring-1 ring-brand-100 lg:block" />
        <div>
          <div className={`${shimmer} mb-5 h-4 w-48`} />
          <div className="grid grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3">
            {Array.from({ length: cards }, (_, i) => (
              <ProductCardSkeleton key={i} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
