import * as React from 'react'
import { cn } from '@/lib/utils'

const variants: Record<string,string> = {
  default: 'bg-bg-card border-line text-ink-secondary',
  gold:    'bg-accent-gold/15 border-accent-gold/40 text-accent-highlight',
  green:   'bg-emerald-700/15 border-emerald-700/40 text-emerald-300',
  red:     'bg-red-700/15 border-red-700/40 text-red-300',
  blue:    'bg-blue-700/15 border-blue-700/40 text-blue-300',
  outline: 'bg-transparent border-line text-ink-secondary',
}

export function Badge({ children, variant = 'default', className }: { children: React.ReactNode; variant?: keyof typeof variants; className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wider', variants[variant], className)}>
      {children}
    </span>
  )
}
