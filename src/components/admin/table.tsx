import { cn } from '@/lib/utils'

export function Table({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={cn('overflow-x-auto rounded-lg border border-line bg-bg-card', className)}>
      <table className="w-full text-sm">{children}</table>
    </div>
  )
}
export function THead({ children }: { children: React.ReactNode }) {
  return <thead className="border-b border-line text-left text-[11px] uppercase tracking-wider text-ink-secondary">{children}</thead>
}
export function Th({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <th className={cn('px-4 py-3 font-medium', className)}>{children}</th>
}
export function Td({ children, className }: { children?: React.ReactNode; className?: string }) {
  return <td className={cn('px-4 py-3 align-middle', className)}>{children}</td>
}
export function Tr({ children, className }: { children: React.ReactNode; className?: string }) {
  return <tr className={cn('border-b border-line/40 last:border-0 hover:bg-bg-secondary/40', className)}>{children}</tr>
}
