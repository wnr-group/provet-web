import clsx from 'clsx'

export default function SectionHeading({ eyebrow, title, description, align = 'left', className }) {
  const center = align === 'center'
  return (
    <div className={clsx(center && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && (
        <span className="badge bg-accent-100 text-accent-700">
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          {eyebrow}
        </span>
      )}
      <h2 className="mt-3 text-2xl font-extrabold tracking-tight text-ink sm:text-3xl lg:text-[2.125rem]">{title}</h2>
      <span
        aria-hidden="true"
        className={clsx('mt-4 block h-1 w-12 rounded-full bg-gradient-to-r from-brand-500 to-accent-500', center && 'mx-auto')}
      />
      {description && <p className={clsx('mt-4 max-w-xl leading-relaxed text-ink-soft', center && 'mx-auto')}>{description}</p>}
    </div>
  )
}
