import Image from 'next/image'
import Link from 'next/link'
import { PageHeader } from '@/components/site/page-header'
import { Reveal, Stagger, StaggerItem } from '@/components/ui/reveal'
import { SectionTitle } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { Award, Sparkles, Target, Eye, Heart, Hammer, MapPin } from 'lucide-react'

const TIMELINE = [
  { year: '2010', title: 'Studio Didirikan', desc: 'Berawal dari workshop kecil di Yogyakarta dengan 3 pengrajin.' },
  { year: '2013', title: 'Pesanan Korporat Pertama', desc: 'Patung bust eksekutif untuk klien korporat di Jakarta.' },
  { year: '2016', title: 'Ekspansi Studio', desc: 'Workshop diperluas menjadi 800m² dengan area showroom.' },
  { year: '2019', title: 'Proyek Monumental Publik', desc: 'Monumen pahlawan setinggi 6m untuk Pemkot Yogyakarta.' },
  { year: '2022', title: 'Galeri Digital', desc: 'Peluncuran platform pre-order online & tracking klien.' },
  { year: '2025', title: 'Generasi Baru', desc: 'Memasuki 15 tahun dengan 500+ karya dan klien lintas pulau.' },
]

const VALUES = [
  { icon: Heart, t: 'Ketulusan', d: 'Setiap karya dibuat dengan dedikasi penuh, bukan sekedar transaksi.' },
  { icon: Hammer, t: 'Keahlian', d: 'Diasah dari generasi ke generasi, dipoles dengan teknik modern.' },
  { icon: Sparkles, t: 'Originalitas', d: 'Setiap karya unik — tidak ada replika massal di studio kami.' },
  { icon: Award, t: 'Kualitas', d: 'Material premium dan finishing tanpa kompromi.' },
]

const TEAM = [
  { name: 'Pak Bambang', role: 'Founder & Kepala Pengrajin', bio: '30+ tahun pengalaman pemahatan marmer dan perunggu, pendiri studio.', photo: 'https://images.unsplash.com/photo-1463453091185-61582044d556?auto=format&fit=crop&w=600&q=80' },
  { name: 'Ibu Sari',    role: 'Kepala Desain',           bio: 'Spesialis sculpting digital, 12 tahun pengalaman concept art.',     photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80' },
  { name: 'Andi',         role: 'Pengrajin Senior',         bio: 'Ahli ukiran kayu dan relief tradisional, 18 tahun di studio kami.', photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80' },
  { name: 'Putri',        role: 'Manajer Proyek',           bio: 'Koordinator pre-order & komunikasi klien.',                         photo: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=600&q=80' },
]

const AWARDS = [
  { name: 'Sculptor of the Year', org: 'Indonesia Art Awards', year: 2022 },
  { name: 'Best Public Monument', org: 'Yogyakarta Art Council', year: 2020 },
  { name: 'Heritage Craft Recognition', org: 'Dekranasda', year: 2018 },
]

const CLIENTS = ['PT Bumi Sejahtera', 'Hotel Krakatau', 'Pemkot Yogyakarta', 'Universitas Gadjah Mada', 'Plaza Senayan', 'Bank Mandiri Art Gallery']

export default function TentangPage() {
  return (
    <>
      <PageHeader title="Tentang Arthomoro Jaya Sentosa" subtitle="Studio dan galeri patung yang lahir dari kecintaan terhadap kerajinan tangan dan seni rupa Indonesia." breadcrumb={[{ label: 'Tentang Kami' }]} />

      {/* Story */}
      <section className="py-16">
        <div className="container grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line">
              <Image src="https://images.unsplash.com/photo-1582461683670-69b2c1ef5e89?auto=format&fit=crop&w=1200&q=80" alt="Studio Arthomoro" fill className="object-cover" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <SectionTitle eyebrow="CERITA KAMI" title="Setiap Karya Punya Jiwa" />
            <div className="space-y-4 text-base leading-relaxed text-ink-secondary">
              <p>Arthomoro Jaya Sentosa lahir di tahun 2010 dari sebuah workshop kecil di Yogyakarta. Pak Bambang — pendiri dan kepala pengrajin kami — memulai dengan satu keyakinan: bahwa patung bukan sekedar bentuk, melainkan jiwa yang dibekukan dalam waktu.</p>
              <p>Selama 15 tahun, kami berkembang dari studio rumahan menjadi salah satu studio patung premium di Indonesia. Lebih dari 500 karya telah terlahir dari tangan-tangan pengrajin kami — beberapa berdiri di plaza kota, beberapa di ruang tamu kolektor, beberapa lainnya dalam ingatan keluarga sebagai memorial yang abadi.</p>
              <p>Namun yang tidak pernah berubah adalah filosofi kami: <em className="text-accent-highlight">setiap karya dibuat dengan tangan, dengan hati, dan dengan ketulusan</em>.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Timeline */}
      <section className="border-y border-line/60 bg-bg-secondary py-16">
        <div className="container">
          <Reveal><SectionTitle eyebrow="PERJALANAN" title="15 Tahun Kerajinan Tangan" align="center" /></Reveal>
          <div className="relative mx-auto max-w-3xl">
            <div className="absolute left-4 top-0 h-full w-px bg-line md:left-1/2" />
            {TIMELINE.map((t, i) => (
              <Reveal key={i} delay={i*0.05}>
                <div className={`relative mb-10 flex flex-col gap-6 md:flex-row ${i % 2 === 0 ? '' : 'md:flex-row-reverse'}`}>
                  <div className="absolute left-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-accent-gold bg-bg-primary md:left-1/2" />
                  <div className="ml-10 flex-1 rounded-lg border border-line bg-bg-card p-5 md:ml-0">
                    <p className="font-cinzel text-sm tracking-widest text-accent-gold">{t.year}</p>
                    <h3 className="mt-1 font-display text-xl">{t.title}</h3>
                    <p className="mt-1 text-sm text-ink-secondary">{t.desc}</p>
                  </div>
                  <div className="hidden md:block md:flex-1" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-16">
        <div className="container grid gap-10 md:grid-cols-2">
          <Reveal>
            <div className="rounded-lg border border-line bg-bg-card p-8">
              <Eye className="h-7 w-7 text-accent-gold" />
              <h3 className="mt-4 font-cinzel text-xs tracking-[0.32em] text-accent-gold">VISI</h3>
              <p className="mt-3 font-serif text-2xl italic leading-relaxed text-ink-primary">"Menjadi studio patung terdepan di Asia Tenggara yang mempertahankan tradisi kerajinan tangan sembari merangkul inovasi modern."</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="rounded-lg border border-line bg-bg-card p-8">
              <Target className="h-7 w-7 text-accent-gold" />
              <h3 className="mt-4 font-cinzel text-xs tracking-[0.32em] text-accent-gold">MISI</h3>
              <ul className="mt-3 space-y-3 text-base text-ink-secondary">
                <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Menghadirkan karya patung berkualitas museum untuk setiap klien.</li>
                <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Mempertahankan dan mewariskan keahlian kerajinan tangan.</li>
                <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Mengangkat seni patung Indonesia ke panggung internasional.</li>
                <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Memberikan pengalaman pre-order yang transparan dan terpercaya.</li>
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Values */}
      <section className="border-y border-line/60 bg-bg-secondary py-16">
        <div className="container">
          <Reveal><SectionTitle eyebrow="NILAI KAMI" title="Empat Pilar yang Kami Pegang" align="center" /></Reveal>
          <Stagger className="grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v,i) => (
              <StaggerItem key={i}>
                <div className="rounded-lg border border-line bg-bg-card p-6 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/10">
                    <v.icon className="h-6 w-6 text-accent-gold" />
                  </div>
                  <h4 className="mt-4 font-display text-lg">{v.t}</h4>
                  <p className="mt-2 text-sm text-ink-secondary leading-relaxed">{v.d}</p>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Team */}
      <section className="py-16">
        <div className="container">
          <Reveal><SectionTitle eyebrow="TIM KAMI" title="Tangan-Tangan di Balik Karya" /></Reveal>
          <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {TEAM.map(t => (
              <StaggerItem key={t.name}>
                <div className="card-hover group overflow-hidden rounded-lg border border-line bg-bg-card">
                  <div className="relative aspect-[4/5] overflow-hidden">
                    <Image src={t.photo} alt={t.name} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  </div>
                  <div className="p-5">
                    <h4 className="font-display text-lg">{t.name}</h4>
                    <p className="mt-0.5 text-xs uppercase tracking-wider text-accent-highlight">{t.role}</p>
                    <p className="mt-2 text-sm text-ink-secondary leading-relaxed">{t.bio}</p>
                  </div>
                </div>
              </StaggerItem>
            ))}
          </Stagger>
        </div>
      </section>

      {/* Awards & Clients */}
      <section className="border-y border-line/60 bg-bg-secondary py-16">
        <div className="container grid gap-12 lg:grid-cols-2">
          <div>
            <Reveal><SectionTitle eyebrow="PENGHARGAAN" title="Pengakuan Industri" /></Reveal>
            <ul className="space-y-3">
              {AWARDS.map((a,i) => (
                <li key={i} className="flex items-start gap-4 rounded-md border border-line bg-bg-card p-4">
                  <Award className="mt-1 h-5 w-5 text-accent-gold" />
                  <div>
                    <p className="font-display text-base">{a.name}</p>
                    <p className="text-xs text-ink-secondary">{a.org} · {a.year}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <Reveal><SectionTitle eyebrow="KLIEN" title="Dipercaya Oleh" /></Reveal>
            <div className="grid grid-cols-2 gap-3">
              {CLIENTS.map(c => (
                <div key={c} className="rounded-md border border-line bg-bg-card px-4 py-5 text-center text-sm text-ink-secondary">{c}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Workshop / location */}
      <section className="py-16">
        <div className="container grid items-center gap-10 lg:grid-cols-2">
          <Reveal>
            <SectionTitle eyebrow="WORKSHOP & STUDIO" title="Kunjungi Studio Kami" subtitle="Workshop seluas 800m² di Yogyakarta, dengan area produksi, finishing, dan showroom yang terbuka untuk kunjungan dengan janji temu." />
            <div className="space-y-3 text-base text-ink-secondary">
              <p className="flex gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-accent-gold" />Jl. Seni Patung No. 88, Yogyakarta, Indonesia</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <Button asChild><Link href="/booking">Booking Kunjungan</Link></Button>
              <Button asChild variant="outline"><Link href="/kontak">Kontak</Link></Button>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-line">
              <iframe src="https://www.google.com/maps?q=Yogyakarta+Indonesia&output=embed" className="absolute inset-0 h-full w-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  )
}
