import Link from 'next/link'
import { ChevronRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function AdminPageHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: { href: string; label: string } }) {
  return (
    <header className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-ink-secondary">{subtitle}</p>}
      </div>
      {action && (
        <Button asChild><Link href={action.href}><Plus className="h-4 w-4" /> {action.label}</Link></Button>
      )}
    </header>
  )
}
