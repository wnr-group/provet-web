import clsx from 'clsx'

export default function Spinner({ className, size = 24 }) {
  return (
    <div
      className={clsx('animate-spin rounded-full border-2 border-brand-200 border-t-brand-600', className)}
      style={{ width: size, height: size }}
    />
  )
}

export function PageSpinner() {
  return (
    <div className="flex min-h-[40vh] items-center justify-center">
      <Spinner size={32} />
    </div>
  )
}
