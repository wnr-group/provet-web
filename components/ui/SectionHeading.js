import clsx from 'clsx'
import { SplitText, DrawLine } from '@/components/motion/effects'

// `animated`: the title's words rise into place one by one and the accent
// rule draws itself, as the heading scrolls into view (the homepage uses it).
export default function SectionHeading({ eyebrow, title, description, align = 'left', className, animated = false, tone = 'dark' }) {
  const center = align === 'center'
  const light = tone === 'light'
  return (
    <div className={clsx(center && 'text-center mx-auto max-w-2xl', className)}>
      {eyebrow && (
        <span className={clsx('badge', light ? 'bg-white/10 text-accent-200' : 'bg-accent-100 text-accent-700')}>
          <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent-500" />
          {eyebrow}
        </span>
      )}
      <h2 className={clsx('mt-3 text-2xl font-extrabold tracking-tight sm:text-3xl lg:text-[2.125rem]', light ? 'text-white' : 'text-ink')}>
        {animated ? <SplitText text={title} /> : title}
      </h2>
      {animated ? (
        <DrawLine
          className={clsx('mt-4 block h-1 w-12 rounded-full bg-accent-500', center && 'mx-auto')}
          origin={center ? 'center' : 'left'}
          delay={0.25}
        />
      ) : (
        <span
          aria-hidden="true"
          className={clsx('mt-4 block h-1 w-12 rounded-full bg-accent-500', center && 'mx-auto')}
        />
      )}
      {description && <p className={clsx('mt-4 max-w-xl leading-relaxed', light ? 'text-brand-100' : 'text-ink-soft', center && 'mx-auto')}>{description}</p>}
    </div>
  )
}
