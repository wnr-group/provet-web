import { SearchX } from 'lucide-react'

export default function EmptyState({ icon: Icon = SearchX, title, description }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-brand-200 bg-mist-50/60 px-6 py-16 text-center">
      <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-brand-400 shadow-soft ring-1 ring-brand-100">
        <Icon size={30} />
      </span>
      <h3 className="mt-5 font-display text-lg font-semibold text-ink">{title}</h3>
      {description && <p className="mt-1.5 max-w-sm text-sm text-ink-soft">{description}</p>}
    </div>
  )
}
