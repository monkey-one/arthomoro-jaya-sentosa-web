import Link from 'next/link'
import { ChevronRight } from 'lucide-react'

export function PageHeader({ title, subtitle, breadcrumb }: { title: string; subtitle?: string; breadcrumb?: { label: string; href?: string }[] }) {
  return (
    <section className="border-b border-line/60 bg-bg-secondary/60 py-14">
      <div className="container">
        {breadcrumb && (
          <nav className="mb-3 flex flex-wrap items-center gap-1 text-xs uppercase tracking-wider text-ink-secondary">
            <Link href="/" className="hover:text-accent-highlight">Beranda</Link>
            {breadcrumb.map((b, i) => (
              <span key={i} className="flex items-center gap-1">
                <ChevronRight className="h-3 w-3" />
                {b.href ? <Link href={b.href} className="hover:text-accent-highlight">{b.label}</Link> : <span className="text-accent-highlight">{b.label}</span>}
              </span>
            ))}
          </nav>
        )}
        <h1 className="font-display text-4xl md:text-5xl">{title}</h1>
        {subtitle && <p className="mt-3 max-w-2xl text-base text-ink-secondary md:text-lg">{subtitle}</p>}
      </div>
    </section>
  )
}
