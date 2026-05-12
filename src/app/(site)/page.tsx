import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { getSettings } from '@/lib/settings'
import { waLink, priceRange, isUploadedAsset } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Counter } from '@/components/ui/counter'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/reveal'
import { SectionTitle } from '@/components/ui/section'
import { ArtworkCard } from '@/components/site/artwork-card'
import { Badge } from '@/components/ui/badge'
import { HelpHint } from '@/components/ui/tooltip'
import {
  Award, ShieldCheck, Sparkles, Hammer, Truck, MessagesSquare,
  ArrowDown, ArrowRight, ChevronRight, MessageCircle, Star, Quote,
  Palette, Layers3, Clock, Scale, Mountain, Calendar
} from 'lucide-react'

const PROCESS_STEPS = [
  { icon: MessagesSquare, title: 'Konsultasi', desc: 'Diskusi kebutuhan, ide, dan referensi visi karya Anda.', duration: '1–3 hari' },
  { icon: Palette,        title: 'Desain 3D',  desc: 'Sketsa & maket 3D digital untuk visualisasi sebelum produksi.', duration: '5–10 hari' },
  { icon: Layers3,        title: 'Pilih Material', desc: 'Pilihan marmer, perunggu, kayu, granit, hingga mixed media.', duration: '2–5 hari' },
  { icon: Hammer,         title: 'Pemahatan', desc: 'Modeling, casting, dan pemahatan tangan oleh pengrajin senior.', duration: '4–16 minggu' },
  { icon: Truck,          title: 'Finishing & Instalasi', desc: 'Finishing presisi & pengiriman / instalasi profesional on-site.', duration: '1–3 minggu' },
]

const CATEGORIES = [
  { name: 'Patung Wajah', desc: 'Realistis dari foto.', minPrice: 8_500_000, image: 'https://picsum.photos/seed/arthomoro-cat-wajah/1200/1500' },
  { name: 'Patung Figur', desc: 'Figur penuh berkarakter.', minPrice: 15_000_000, image: 'https://picsum.photos/seed/arthomoro-cat-figur/1200/1500' },
  { name: 'Patung Abstrak', desc: 'Bentuk ekspresif modern.', minPrice: 12_000_000, image: 'https://picsum.photos/seed/arthomoro-cat-abstrak/1200/1500' },
  { name: 'Patung Monumental', desc: 'Untuk ruang publik.', minPrice: 180_000_000, image: 'https://picsum.photos/seed/arthomoro-cat-monumental/1200/1500' },
  { name: 'Relief', desc: 'Karya dinding 3D.', minPrice: 9_500_000, image: 'https://picsum.photos/seed/arthomoro-cat-relief/1200/1500' },
  { name: 'Patung Hewan', desc: 'Anatomi presisi.', minPrice: 11_000_000, image: 'https://picsum.photos/seed/arthomoro-cat-hewan/1200/1500' },
]

const ADVANTAGES = [
  { icon: Award,        title: 'Pengrajin 15+ Tahun', desc: 'Tim seniman bersertifikat dengan pengalaman puluhan proyek besar.' },
  { icon: Mountain,     title: 'Material Bersertifikat', desc: 'Marmer Italia, perunggu murni, kayu jati pilihan.' },
  { icon: Sparkles,     title: 'Custom 100%', desc: 'Setiap karya dirancang sesuai visi Anda — bukan replika massal.' },
  { icon: ShieldCheck,  title: 'Garansi Kualitas', desc: 'Garansi material & finishing hingga 5 tahun.' },
  { icon: Truck,        title: 'Instalasi Profesional', desc: 'Pengiriman aman + tim instalasi on-site se-Indonesia.' },
  { icon: MessagesSquare, title: 'Konsultasi Gratis', desc: 'Diskusi tanpa komitmen, kami bantu hingga visi jelas.' },
]

export default async function HomePage() {
  const settings = await getSettings()
  const [featured, latestArticles, testimonials, featuredProjects] = await Promise.all([
    prisma.artwork.findMany({ where: { published: true, featured: true }, orderBy: { createdAt: 'desc' }, take: 6 }),
    prisma.article.findMany({ where: { published: true }, orderBy: { publishedAt: 'desc' }, take: 3 }),
    prisma.testimonial.findMany({ where: { status: 'APPROVED', featured: true }, orderBy: { createdAt: 'desc' }, take: 4 }),
    prisma.project.findMany({ where: { published: true, featured: true }, orderBy: { year: 'desc' }, take: 5 }),
  ])

  const stats = {
    works: Number(settings['stat_works'] || 500),
    years: Number(settings['stat_years'] || 15),
    cities: Number(settings['stat_cities'] || 12),
    sat: Number(settings['stat_satisfaction'] || 98),
  }

  return (
    <>
      {/* ===== HERO ===== */}
      <section className="relative -mt-24 flex min-h-screen items-center overflow-hidden">
        <div className="absolute inset-0">
          {settings['hero_video_url'] ? (
            <video
              src={settings['hero_video_url']}
              poster={settings['hero_image_url'] || undefined}
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              className="absolute inset-0 h-full w-full object-cover opacity-55"
            />
          ) : (
            <Image
              src={settings['hero_image_url'] || 'https://picsum.photos/seed/arthomoro-hero/2400/1400'}
              alt="Patung marmer karya Arthomoro"
              fill priority
              className="object-cover opacity-50"
              unoptimized={!!settings['hero_image_url']}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary/30 via-bg-primary/60 to-bg-primary" />
          <div className="absolute inset-0 bg-gold-radial" />
        </div>

        {/* Floating gold particles */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          {[...Array(20)].map((_,i) => (
            <span key={i} className="absolute h-1 w-1 rounded-full bg-accent-gold/60" style={{
              left: `${(i*53)%100}%`,
              top: `${(i*37)%100}%`,
              animation: `fade-up ${4+i%6}s ease-in-out ${i*0.3}s infinite alternate`,
            }} />
          ))}
        </div>

        <div className="container relative z-10 py-20">
          <Reveal>
            <Badge variant="gold" className="mb-6">★ Pre-Order Custom · Sejak 2010 · Garansi Kualitas</Badge>
          </Reveal>
          <Reveal delay={0.1}>
            <h1 className="font-cinzel text-3xl leading-tight text-ink-primary md:text-5xl lg:text-6xl">
              ARTHOMORO<br /><span className="text-accent-gold">JAYA SENTOSA</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl font-serif text-xl italic leading-relaxed text-ink-secondary md:text-2xl">
              "Setiap Patung adalah Jiwa yang Dibekukan dalam Waktu"
            </p>
          </Reveal>
          <Reveal delay={0.3}>
            <p className="mt-4 max-w-xl text-base text-ink-secondary md:text-lg">
              Studio &amp; galeri patung premium yang melayani pre-order custom — dari patung wajah personal hingga karya monumental untuk ruang publik.
            </p>
          </Reveal>
          <Reveal delay={0.4}>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="xl"><Link href="/galeri">Jelajahi Galeri <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="xl" variant="outline"><Link href="/pre-order">Pesan Custom Patung →</Link></Button>
            </div>
          </Reveal>
          <Reveal delay={0.5}>
            <div className="mt-12 flex items-center gap-3 text-xs uppercase tracking-[0.32em] text-ink-secondary">
              <ArrowDown className="h-4 w-4 animate-bounce text-accent-gold" /> Gulir untuk menjelajahi karya
            </div>
          </Reveal>
        </div>
      </section>

      {/* ===== STATS ===== */}
      <section className="border-y border-line/60 bg-bg-secondary/60 py-14">
        <div className="container grid grid-cols-2 gap-8 md:grid-cols-4">
          {[
            { val: stats.works, suf: '+', label: 'Karya Tercipta' },
            { val: stats.years, suf: '', label: 'Tahun Pengalaman' },
            { val: stats.cities, suf: '', label: 'Kota Terinstalasi' },
            { val: stats.sat, suf: '%', label: 'Klien Puas' },
          ].map((s,i) => (
            <Reveal key={i} delay={i*0.08} className="text-center">
              <div className="font-display text-4xl text-accent-highlight md:text-5xl"><Counter to={s.val} suffix={s.suf} /></div>
              <div className="mt-2 text-xs uppercase tracking-[0.28em] text-ink-secondary"><span className="gold-underline">{s.label}</span></div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ===== FEATURED GALLERY ===== */}
      <section className="py-20">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="GALERI UNGGULAN" title="Karya Terpilih dari Studio Kami" subtitle="Setiap karya adalah hasil keahlian tangan yang dipoles selama berminggu-minggu. Pesan serupa untuk koleksi Anda." />
          </Reveal>

          <Stagger className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((a, idx) => (
              <StaggerItem key={a.id}>
                <ArtworkCard a={a as any} priority={idx < 3} />
              </StaggerItem>
            ))}
          </Stagger>

          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg"><Link href="/galeri">Lihat Semua Karya <ArrowRight className="h-4 w-4" /></Link></Button>
          </div>
        </div>
      </section>

      {/* ===== PROCESS ===== */}
      <section className="border-y border-line/60 bg-bg-secondary py-20">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="PROSES PEMBUATAN" title="Lima Tahap dari Ide ke Karya"
              subtitle="Transparansi proses adalah komitmen kami. Anda mengetahui setiap tahap sejak konsultasi hingga karya terpasang." />
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3 lg:grid-cols-5">
            {PROCESS_STEPS.map((step, i) => (
              <StaggerItem key={i}>
                <div className="relative h-full rounded-lg border border-line bg-bg-card p-6">
                  <div className="absolute -top-3 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-accent-gold text-xs font-bold text-bg-primary">{i+1}</div>
                  <step.icon className="mt-2 h-7 w-7 text-accent-gold" />
                  <h3 className="mt-4 font-display text-lg">{step.title}</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-ink-secondary">{step.desc}</p>
                  <div className="mt-4 flex items-center gap-2 text-xs text-accent-highlight">
                    <Clock className="h-3.5 w-3.5" /> {step.duration}
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ===== CATEGORIES ===== */}
      <section className="py-20">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="KATEGORI" title="Jenis Patung yang Kami Buat"
              subtitle="Mulai dari yang intim hingga monumental — pilih kategori yang paling sesuai dengan visi Anda." />
          </Reveal>
          <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c, i) => (
              <StaggerItem key={c.name}>
                <Link href={`/galeri?kategori=${encodeURIComponent(c.name)}`} className="group relative block aspect-[4/5] overflow-hidden rounded-lg border border-line">
                  <Image src={c.image} alt={c.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/40 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-6">
                    <h3 className="font-display text-2xl">{c.name}</h3>
                    <p className="mt-1 text-sm text-ink-secondary">{c.desc}</p>
                    <div className="mt-3 flex items-center justify-between">
                      <span className="text-sm text-accent-highlight">Mulai {priceRange(c.minPrice)}</span>
                      <span className="inline-flex items-center gap-1 text-xs uppercase tracking-wider text-ink-primary opacity-80 transition-transform group-hover:translate-x-1">
                        Lihat <ChevronRight className="h-3.5 w-3.5" />
                      </span>
                    </div>
                  </div>
                  <div className="absolute inset-0 ring-1 ring-inset ring-line transition-colors group-hover:ring-accent-gold/60" />
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ===== FEATURED PROJECTS ===== */}
      <section className="border-y border-line/60 bg-bg-secondary py-20">
        <div className="container">
          <Reveal><SectionTitle eyebrow="PORTOFOLIO" title="Proyek Unggulan" subtitle="Karya yang telah terpasang di ruang publik, institusi, dan koleksi pribadi terkemuka." /></Reveal>

          <div className="-mx-5 overflow-x-auto px-5 scrollbar-none">
            <div className="flex snap-x snap-mandatory gap-5 pb-2">
              {featuredProjects.map(p => (
                <Link key={p.id} href={`/portofolio/${p.slug}`} className="group relative w-[88vw] shrink-0 snap-start overflow-hidden rounded-lg border border-line bg-bg-card sm:w-[520px]">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={p.coverImage} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={isUploadedAsset(p.coverImage)} />
                    <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 to-transparent" />
                  </div>
                  <div className="p-5">
                    <Badge variant="gold">{p.clientType}</Badge>
                    <h3 className="mt-2 font-display text-xl">{p.title}</h3>
                    <p className="mt-1 text-sm text-ink-secondary">{p.client} · {p.location} · {p.year}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ADVANTAGES ===== */}
      <section className="py-20">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line">
              <Image src="https://picsum.photos/seed/arthomoro-artisan/1200/1500" alt="Pengrajin Arthomoro" fill className="object-cover" />
            </div>
          </Reveal>
          <div>
            <Reveal>
              <SectionTitle eyebrow="MENGAPA KAMI" title="Keunggulan yang Membedakan" />
            </Reveal>
            <Stagger className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              {ADVANTAGES.map((adv,i) => (
                <StaggerItem key={i}>
                  <div className="rounded-md border border-line bg-bg-card p-5">
                    <adv.icon className="h-6 w-6 text-accent-gold" />
                    <h4 className="mt-3 font-display text-lg">{adv.title}</h4>
                    <p className="mt-1 text-sm text-ink-secondary leading-relaxed">{adv.desc}</p>
                  </div>
                </StaggerItem>
              ))}
            </Stagger>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="border-y border-line/60 bg-bg-secondary py-20">
        <div className="container">
          <Reveal><SectionTitle eyebrow="TESTIMONI KLIEN" title="Apa Kata Mereka" align="center" /></Reveal>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
            {testimonials.map(t => (
              <StaggerItem key={t.id}>
                <article className="relative h-full rounded-lg border border-line bg-bg-card p-6 md:p-8">
                  <Quote className="absolute right-5 top-5 h-8 w-8 text-accent-gold/30" />
                  <div className="flex gap-0.5">
                    {[...Array(t.rating)].map((_,i) => <Star key={i} className="h-4 w-4 fill-accent-gold text-accent-gold" />)}
                  </div>
                  <p className="mt-4 font-serif text-lg italic leading-relaxed text-ink-primary md:text-xl">"{t.message}"</p>
                  <div className="mt-5 flex items-center justify-between gap-3">
                    <div>
                      <p className="font-medium text-ink-primary">{t.name}</p>
                      <p className="text-xs text-ink-secondary">{t.position}{t.city ? ` · ${t.city}` : ''}</p>
                    </div>
                    {t.verifiedOrder && <Badge variant="green">✓ Verified Pre-Order</Badge>}
                  </div>
                </article>
              </StaggerItem>
            ))}
          </Stagger>
          <div className="mt-10 text-center">
            <Button asChild variant="outline" size="lg"><Link href="/testimoni">Lihat Semua Testimoni</Link></Button>
          </div>
        </div>
      </section>

      {/* ===== ARTICLES ===== */}
      <section className="py-20">
        <div className="container">
          <Reveal><SectionTitle eyebrow="ARTIKEL" title="Inspirasi & Panduan" subtitle="Belajar memilih, merawat, dan memahami seni patung — langsung dari pengrajin kami." /></Reveal>
          <Stagger className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {latestArticles.map(art => (
              <StaggerItem key={art.id}>
                <Link href={`/artikel/${art.slug}`} className="card-hover block overflow-hidden rounded-lg border border-line bg-bg-card">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={art.coverImage} alt={art.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={isUploadedAsset(art.coverImage)} />
                  </div>
                  <div className="p-5">
                    <Badge variant="gold">{art.category}</Badge>
                    <h3 className="mt-3 font-display text-lg leading-tight line-clamp-2">{art.title}</h3>
                    <p className="mt-2 text-sm text-ink-secondary line-clamp-2">{art.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-secondary">
                      <span>{art.author}</span>
                      <span>·</span>
                      <span>{art.readMinutes} menit baca</span>
                    </div>
                  </div>
                </Link>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image src="https://picsum.photos/seed/arthomoro-cta/2000/1200" alt="" fill className="object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-primary/85 to-bg-primary" />
        </div>
        <div className="container relative z-10 py-24 text-center">
          <Reveal>
            <h2 className="font-display text-4xl md:text-5xl lg:text-6xl">Wujudkan Visi Anda<br /><span className="text-accent-gold">Menjadi Karya Abadi</span></h2>
          </Reveal>
          <Reveal delay={0.15}>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-ink-secondary">
              Konsultasi gratis tanpa komitmen. Tim kami siap membantu Anda merancang patung yang tepat sesuai visi, ruang, dan anggaran.
            </p>
          </Reveal>
          <Reveal delay={0.25}>
            <div className="mt-10 flex flex-wrap justify-center gap-4">
              <Button asChild size="xl" variant="wa"><a href={waLink('Halo Arthomoro, saya ingin konsultasi gratis terkait pemesanan patung custom.')} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" /> Konsultasi via WhatsApp</a></Button>
              <Button asChild size="xl"><Link href="/pre-order">Mulai Pre-Order <ArrowRight className="h-4 w-4" /></Link></Button>
              <Button asChild size="xl" variant="outline"><Link href="/booking"><Calendar className="h-4 w-4" /> Booking Konsultasi</Link></Button>
            </div>
          </Reveal>
          <Reveal delay={0.35}>
            <div className="mt-12 flex flex-wrap justify-center gap-6 text-xs uppercase tracking-[0.28em] text-ink-secondary">
              <span className="flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-accent-gold" /> Garansi Material 5 Tahun</span>
              <span className="flex items-center gap-2"><Award className="h-4 w-4 text-accent-gold" /> Sertifikat Keaslian Digital</span>
              <span className="flex items-center gap-2"><Scale className="h-4 w-4 text-accent-gold" /> Konsultasi Gratis</span>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
