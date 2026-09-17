import clsx from 'clsx'

export default function SectionHeading({ eyebrow, title, description, align = 'left', className }) {
  return (
    <div className={clsx(align === 'center' && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && (
        <span className="badge bg-accent-100 text-accent-700">{eyebrow}</span>
      )}
      <h2 className="mt-3 text-2xl font-bold sm:text-3xl">{title}</h2>
      {description && <p className="mt-3 text-ink-soft leading-relaxed">{description}</p>}
    </div>
  )
}
