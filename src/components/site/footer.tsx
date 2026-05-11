import Link from 'next/link'
import { Instagram, Facebook, Youtube, MapPin, Phone, Mail, Clock } from 'lucide-react'

export function SiteFooter({ settings = {} as Record<string,string> }) {
  const wa = settings['wa_number'] || '6281234567890'
  return (
    <footer className="relative mt-24 border-t border-line/60 bg-bg-secondary">
      <div className="container py-14">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-sm border border-accent-gold/40 bg-bg-card/60">
                <span className="font-cinzel text-base text-accent-gold">A</span>
              </div>
              <div className="leading-tight">
                <p className="font-cinzel text-xs tracking-[0.32em] text-accent-gold">ARTHOMORO</p>
                <p className="font-cinzel text-[10px] tracking-[0.3em] text-ink-secondary">JAYA SENTOSA</p>
              </div>
            </div>
            <p className="font-serif italic text-base text-ink-secondary leading-relaxed">
              {settings['tagline'] || '"Setiap Patung adalah Jiwa yang Dibekukan dalam Waktu"'}
            </p>
            <div className="mt-5 flex gap-3">
              {settings['instagram'] && <a aria-label="Instagram" href={settings['instagram']} target="_blank" rel="noreferrer" className="rounded-full border border-line p-2 text-ink-secondary hover:border-accent-gold hover:text-accent-highlight"><Instagram className="h-4 w-4" /></a>}
              {settings['facebook'] && <a aria-label="Facebook" href={settings['facebook']} target="_blank" rel="noreferrer" className="rounded-full border border-line p-2 text-ink-secondary hover:border-accent-gold hover:text-accent-highlight"><Facebook className="h-4 w-4" /></a>}
              {settings['youtube'] && <a aria-label="YouTube" href={settings['youtube']} target="_blank" rel="noreferrer" className="rounded-full border border-line p-2 text-ink-secondary hover:border-accent-gold hover:text-accent-highlight"><Youtube className="h-4 w-4" /></a>}
            </div>
          </div>

          <div>
            <h4 className="mb-4 font-cinzel text-xs tracking-[0.28em] text-accent-gold">PERUSAHAAN</h4>
            <ul className="space-y-2.5 text-sm text-ink-secondary">
              <li><Link href="/tentang-kami" className="hover:text-accent-highlight">Tentang Kami</Link></li>
              <li><Link href="/portofolio" className="hover:text-accent-highlight">Portofolio</Link></li>
              <li><Link href="/artikel" className="hover:text-accent-highlight">Artikel</Link></li>
              <li><Link href="/testimoni" className="hover:text-accent-highlight">Testimoni</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-cinzel text-xs tracking-[0.28em] text-accent-gold">LAYANAN</h4>
            <ul className="space-y-2.5 text-sm text-ink-secondary">
              <li><Link href="/galeri" className="hover:text-accent-highlight">Galeri Karya</Link></li>
              <li><Link href="/pre-order" className="hover:text-accent-highlight">Pre-Order Custom</Link></li>
              <li><Link href="/booking" className="hover:text-accent-highlight">Booking Konsultasi</Link></li>
              <li><Link href="/kontak" className="hover:text-accent-highlight">Kontak</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="mb-4 font-cinzel text-xs tracking-[0.28em] text-accent-gold">KONTAK</h4>
            <ul className="space-y-3 text-sm text-ink-secondary">
              <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><span>{settings['address'] || 'Jl. Seni Patung No. 88, Yogyakarta'}</span></li>
              <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><a href={`https://wa.me/${wa}`} className="hover:text-accent-highlight">{settings['phone'] || '+62 812 3456 7890'}</a></li>
              <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><a href={`mailto:${settings['email'] || 'hello@arthomoro.id'}`} className="hover:text-accent-highlight">{settings['email'] || 'hello@arthomoro.id'}</a></li>
              <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><span>{settings['hours'] || 'Senin–Sabtu 09.00–17.00'}</span></li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t border-line/60 py-5">
        <div className="container flex flex-col items-center justify-between gap-2 text-xs text-ink-secondary md:flex-row">
          <p>© {new Date().getFullYear()} Arthomoro Jaya Sentosa. Hak cipta dilindungi.</p>
          <p>Dipersembahkan oleh <span className="text-accent-highlight">Moonkey Global Vision</span></p>
        </div>
      </div>
    </footer>
  )
}
