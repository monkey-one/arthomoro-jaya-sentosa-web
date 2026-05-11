'use client'

import Link from 'next/link'
import { signOut } from 'next-auth/react'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard, Image as ImageIcon, FileText, Hammer, MessageSquare, Star, ShoppingBag,
  Calendar, Users, ShieldCheck, Settings, LogOut, Menu, X, ExternalLink, BarChart3, Mail,
} from 'lucide-react'

const NAV = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, perm: null },
  { href: '/admin/galeri', label: 'Galeri', icon: ImageIcon, perm: 'galeri:view' },
  { href: '/admin/artikel', label: 'Artikel', icon: FileText, perm: 'artikel:view' },
  { href: '/admin/portofolio', label: 'Portofolio', icon: Hammer, perm: 'portofolio:view' },
  { href: '/admin/pesan', label: 'Pesan', icon: MessageSquare, perm: 'pesan:view' },
  { href: '/admin/testimoni', label: 'Testimoni', icon: Star, perm: 'testimoni:view' },
  { href: '/admin/preorder', label: 'Pre-Order', icon: ShoppingBag, perm: 'order:view' },
  { href: '/admin/booking', label: 'Booking', icon: Calendar, perm: 'booking:view' },
  { href: '/admin/users', label: 'Pengguna', icon: Users, perm: 'user:view' },
  { href: '/admin/roles', label: 'Role & Hak', icon: ShieldCheck, perm: 'role:manage' },
  { href: '/admin/newsletter', label: 'Newsletter', icon: Mail, perm: null },
  { href: '/admin/analytics', label: 'Analitik', icon: BarChart3, perm: 'analytics:view' },
  { href: '/admin/setting', label: 'Pengaturan', icon: Settings, perm: 'setting:view' },
]

export function AdminShell({ user, children }: { user: { name?: string; email?: string; roleName?: string; permissions?: string[] }; children: React.ReactNode }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const perms = new Set(user.permissions || [])
  const isAllowed = (perm: string | null) => !perm || perms.has(perm) || user.roleName === 'Super Admin'

  return (
    <div className="min-h-screen bg-bg-primary">
      {/* Top bar mobile */}
      <header className="sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg-secondary px-4 py-3 lg:hidden">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-sm border border-accent-gold/40 bg-bg-card"><span className="font-cinzel text-xs text-accent-gold">A</span></div>
          <span className="font-cinzel text-xs tracking-[0.28em] text-accent-gold">ADMIN</span>
        </Link>
        <button onClick={() => setOpen(o => !o)} className="rounded-md border border-line p-2"><Menu className="h-4 w-4" /></button>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={cn('fixed inset-y-0 left-0 z-40 w-64 transform border-r border-line bg-bg-secondary transition-transform duration-300 lg:relative lg:translate-x-0', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
          <div className="flex items-center justify-between border-b border-line px-5 py-5">
            <Link href="/admin" className="flex items-center gap-3" onClick={() => setOpen(false)}>
              <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-accent-gold/40 bg-bg-card"><span className="font-cinzel text-sm text-accent-gold">A</span></div>
              <div className="leading-tight">
                <p className="font-cinzel text-[10px] tracking-[0.32em] text-accent-gold">ARTHOMORO</p>
                <p className="font-cinzel text-[9px] tracking-[0.3em] text-ink-secondary">ADMIN PANEL</p>
              </div>
            </Link>
            <button onClick={() => setOpen(false)} className="rounded-md border border-line p-1.5 lg:hidden"><X className="h-4 w-4" /></button>
          </div>

          <nav className="space-y-0.5 px-3 py-4">
            {NAV.filter(n => isAllowed(n.perm)).map(n => {
              const active = pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href))
              return (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                  className={cn('flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors', active ? 'bg-accent-gold/10 text-accent-highlight' : 'text-ink-secondary hover:bg-bg-card hover:text-ink-primary')}>
                  <n.icon className="h-4 w-4" /> {n.label}
                </Link>
              )
            })}
          </nav>

          <div className="absolute bottom-0 left-0 right-0 border-t border-line px-5 py-4">
            <p className="text-xs font-medium text-ink-primary">{user.name}</p>
            <p className="text-[11px] text-ink-secondary">{user.roleName}</p>
            <div className="mt-3 flex items-center gap-2">
              <Link href="/" target="_blank" className="flex items-center gap-1 text-[11px] text-ink-secondary hover:text-accent-highlight"><ExternalLink className="h-3 w-3" /> Lihat Website</Link>
              <button onClick={() => signOut({ callbackUrl: `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/admin/login` })} className="ml-auto flex items-center gap-1 text-[11px] text-ink-secondary hover:text-red-400"><LogOut className="h-3 w-3" /> Keluar</button>
            </div>
          </div>
        </aside>

        {open && <div className="fixed inset-0 z-30 bg-black/50 lg:hidden" onClick={() => setOpen(false)} />}

        <main className="min-h-screen flex-1 px-5 py-6 lg:px-8 lg:py-8">
          {children}
        </main>
      </div>
    </div>
  )
}
