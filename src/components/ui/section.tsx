import { cn } from '@/lib/utils'

export function SectionTitle({ eyebrow, title, subtitle, align = 'left', className }: {
  eyebrow?: string
  title: string
  subtitle?: string
  align?: 'left' | 'center'
  className?: string
}) {
  return (
    <div className={cn('mb-10', align === 'center' && 'text-center', className)}>
      {eyebrow && (
        <div className={cn('mb-3 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.32em] text-accent-gold', align === 'center' && 'justify-center')}>
          <span className="h-px w-8 bg-accent-gold/50" />
          <span>{eyebrow}</span>
          <span className="h-px w-8 bg-accent-gold/50" />
        </div>
      )}
      <h2 className="font-display text-3xl leading-tight md:text-4xl lg:text-5xl">{title}</h2>
      {subtitle && <p className="mt-3 max-w-2xl text-base text-ink-secondary/90 leading-relaxed">{subtitle}</p>}
    </div>
  )
}
