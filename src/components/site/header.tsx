'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { Menu, X, MessageCircle } from 'lucide-react'
import { cn, waLink } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navItems = [
  { href: '/', label: 'Beranda' },
  { href: '/galeri', label: 'Galeri' },
  { href: '/pre-order', label: 'Pre-Order' },
  { href: '/portofolio', label: 'Portofolio' },
  { href: '/tentang-kami', label: 'Tentang' },
  { href: '/artikel', label: 'Artikel' },
  { href: '/testimoni', label: 'Testimoni' },
  { href: '/kontak', label: 'Kontak' },
]

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <header className={cn(
      'fixed inset-x-0 top-0 z-40 transition-all duration-500',
      scrolled ? 'bg-bg-primary/85 backdrop-blur-md border-b border-line/60 py-3' : 'bg-transparent py-5',
    )}>
      <div className="container flex items-center justify-between">
        <Link href="/" className="group relative flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-sm border border-accent-gold/40 bg-bg-card/60">
            <span className="font-cinzel text-sm tracking-widest text-accent-gold">A</span>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="font-cinzel text-[10px] tracking-[0.32em] text-accent-gold">ARTHOMORO</span>
            <span className="font-cinzel text-[9px] tracking-[0.3em] text-ink-secondary">JAYA SENTOSA</span>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map(n => (
            <Link key={n.href} href={n.href} className="relative px-3 py-2 text-[13px] uppercase tracking-wider text-ink-secondary transition-colors hover:text-accent-highlight">
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <a href={waLink('Halo Arthomoro Jaya Sentosa, saya ingin konsultasi pesan patung custom.')} target="_blank" rel="noopener noreferrer">
              <MessageCircle className="h-4 w-4" /> Konsultasi
            </a>
          </Button>
          <Button asChild variant="primary" size="sm">
            <Link href="/pre-order">Pesan Custom</Link>
          </Button>
        </div>

        <button onClick={() => setOpen(o => !o)} className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-md border border-line text-ink-primary" aria-label="Buka menu">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden fixed inset-0 top-[var(--header-h,60px)] bg-bg-primary/98 backdrop-blur-xl pt-20 px-6 overflow-y-auto">
          <nav className="flex flex-col">
            {navItems.map((n, i) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="border-b border-line/60 py-4 font-display text-2xl text-ink-primary hover:text-accent-highlight">
                <span className="mr-3 font-mono text-xs text-accent-gold">{String(i+1).padStart(2,'0')}</span>{n.label}
              </Link>
            ))}
          </nav>
          <div className="mt-8 flex flex-col gap-3">
            <Button asChild variant="primary" size="lg" onClick={() => setOpen(false)}>
              <Link href="/pre-order">Pesan Patung Custom →</Link>
            </Button>
            <Button asChild variant="wa" size="lg">
              <a href={waLink('Halo Arthomoro Jaya Sentosa, saya ingin konsultasi.')} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="h-5 w-5" /> Chat WhatsApp
              </a>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
