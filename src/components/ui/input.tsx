import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type = 'text', ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      'flex h-11 w-full rounded-md border border-line bg-bg-card px-3.5 py-2 text-sm text-ink-primary placeholder:text-ink-secondary/60',
      'transition-colors focus:border-accent-gold/70 focus:outline-none focus:ring-1 focus:ring-accent-gold/40',
      'disabled:cursor-not-allowed disabled:opacity-60',
      className,
    )}
    {...props}
  />
))
Input.displayName = 'Input'

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        'flex min-h-[110px] w-full rounded-md border border-line bg-bg-card px-3.5 py-2.5 text-sm text-ink-primary placeholder:text-ink-secondary/60',
        'transition-colors focus:border-accent-gold/70 focus:outline-none focus:ring-1 focus:ring-accent-gold/40',
        className,
      )}
      {...props}
    />
  ),
)
Textarea.displayName = 'Textarea'

export const Select = React.forwardRef<HTMLSelectElement, React.SelectHTMLAttributes<HTMLSelectElement>>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        'flex h-11 w-full rounded-md border border-line bg-bg-card px-3 py-2 text-sm text-ink-primary',
        'transition-colors focus:border-accent-gold/70 focus:outline-none focus:ring-1 focus:ring-accent-gold/40',
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
)
Select.displayName = 'Select'

export function Label({ children, htmlFor, required, hint, className }: { children: React.ReactNode; htmlFor?: string; required?: boolean; hint?: React.ReactNode; className?: string }) {
  return (
    <label htmlFor={htmlFor} className={cn('mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink-secondary', className)}>
      <span>{children}{required && <span className="ml-1 text-accent-highlight">*</span>}</span>
      {hint}
    </label>
  )
}
