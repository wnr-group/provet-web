import { ChevronLeft, ChevronRight } from 'lucide-react'
import clsx from 'clsx'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1).filter(
    (p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1,
  )

  const items = []
  let prev = 0
  for (const p of pages) {
    if (p - prev > 1) items.push('ellipsis-' + p)
    items.push(p)
    prev = p
  }

  return (
    <div className="mt-10 flex items-center justify-center gap-1.5">
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-700 disabled:opacity-40"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
        aria-label="Previous page"
      >
        <ChevronLeft size={16} />
      </button>
      {items.map((it) =>
        typeof it === 'number' ? (
          <button
            key={it}
            onClick={() => onChange(it)}
            className={clsx(
              'flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition',
              it === page ? 'bg-brand-600 text-white' : 'text-ink-soft hover:bg-brand-50',
            )}
          >
            {it}
          </button>
        ) : (
          <span key={it} className="px-1 text-ink-soft">
            &hellip;
          </span>
        ),
      )}
      <button
        className="flex h-9 w-9 items-center justify-center rounded-full border border-brand-200 text-brand-700 disabled:opacity-40"
        disabled={page >= totalPages}
        onClick={() => onChange(page + 1)}
        aria-label="Next page"
      >
        <ChevronRight size={16} />
      </button>
    </div>
  )
}
