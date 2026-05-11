import { getSettings } from '@/lib/settings'
import { PageHeader } from '@/components/site/page-header'
import { ContactForm } from '@/components/site/contact-form'
import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Facebook, Youtube } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { waLink } from '@/lib/utils'

export default async function KontakPage() {
  const s = await getSettings()
  const wa = s['wa_number'] || '6281234567890'

  return (
    <>
      <PageHeader title="Hubungi Kami" subtitle="Tim kami siap membantu konsultasi pesanan, kunjungan studio, atau kerjasama. Respon cepat via WhatsApp." breadcrumb={[{ label: 'Kontak' }]} />

      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-[1.3fr,1fr]">
          <div>
            <div className="mb-6 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-6 text-center">
              <p className="text-xs uppercase tracking-[0.28em] text-accent-highlight">Respon Tercepat</p>
              <p className="mt-2 font-display text-xl">Chat Langsung via WhatsApp</p>
              <Button asChild size="lg" variant="wa" className="mt-4">
                <a href={waLink('Halo Arthomoro Jaya Sentosa, saya ingin bertanya.')} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="h-5 w-5" /> Chat WhatsApp Sekarang
                </a>
              </Button>
            </div>

            <h2 className="mb-4 font-display text-2xl">Atau kirim pesan via form</h2>
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <div className="rounded-lg border border-line bg-bg-card p-6">
              <h3 className="font-cinzel text-xs tracking-[0.28em] text-accent-gold">INFORMASI KONTAK</h3>
              <ul className="mt-4 space-y-4 text-sm">
                <li className="flex gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><span>{s['address'] || 'Jl. Seni Patung No. 88, Yogyakarta'}</span></li>
                <li className="flex gap-3"><Phone className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><a href={`tel:${s['phone']}`} className="hover:text-accent-highlight">{s['phone'] || '+62 812 3456 7890'}</a></li>
                <li className="flex gap-3"><Mail className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><a href={`mailto:${s['email']}`} className="hover:text-accent-highlight">{s['email'] || 'hello@arthomoro.id'}</a></li>
                <li className="flex gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><span>{s['hours'] || 'Senin–Sabtu 09.00–17.00 WIB'}</span></li>
              </ul>

              <div className="mt-6">
                <p className="mb-3 font-cinzel text-xs tracking-[0.28em] text-accent-gold">SOSIAL MEDIA</p>
                <div className="flex gap-3">
                  {s['instagram'] && <a href={s['instagram']} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full border border-line p-2.5 hover:border-accent-gold hover:text-accent-highlight"><Instagram className="h-4 w-4" /></a>}
                  {s['facebook'] && <a href={s['facebook']} target="_blank" rel="noreferrer" aria-label="Facebook" className="rounded-full border border-line p-2.5 hover:border-accent-gold hover:text-accent-highlight"><Facebook className="h-4 w-4" /></a>}
                  {s['youtube'] && <a href={s['youtube']} target="_blank" rel="noreferrer" aria-label="YouTube" className="rounded-full border border-line p-2.5 hover:border-accent-gold hover:text-accent-highlight"><Youtube className="h-4 w-4" /></a>}
                </div>
              </div>
            </div>

            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
              <iframe src={`https://www.google.com/maps?q=${s['maps_query'] || 'Yogyakarta+Indonesia'}&output=embed`} className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
