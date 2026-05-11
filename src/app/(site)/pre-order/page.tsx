import Link from 'next/link'
import Image from 'next/image'
import { PageHeader } from '@/components/site/page-header'
import { PreOrderWizard } from '@/components/site/preorder-wizard'
import { Reveal } from '@/components/ui/reveal'
import { SectionTitle } from '@/components/ui/section'
import { Button } from '@/components/ui/button'
import { ShieldCheck, Award, Clock, ChevronDown, MessagesSquare, Palette, Hammer, Layers3, Truck, FileCheck } from 'lucide-react'

const FAQS = [
  { q: 'Berapa minimal DP untuk memulai pesanan?', a: 'Minimal DP 30% dari nilai pesanan untuk memulai produksi. Tergantung kompleksitas, DP bisa fleksibel 30%, 50%, atau 70%. Sisanya dibayarkan bertahap atau lunas saat serah terima.' },
  { q: 'Berapa kali revisi yang diperbolehkan?', a: 'Standar 3 kali revisi gratis pada tahap desain. Revisi tambahan dikenakan biaya tergantung kompleksitas. Pada tahap pemahatan, revisi mayor tidak memungkinkan namun penyesuaian minor tetap dapat dikomunikasikan.' },
  { q: 'Bagaimana jika hasilnya tidak sesuai?', a: 'Setiap milestone (sketsa, modeling, finishing) memerlukan persetujuan klien sebelum lanjut ke tahap berikutnya. Sistem ini memastikan hasil akhir sesuai harapan. Jika ada ketidaksesuaian, kami akan menyesuaikan sesuai kontrak.' },
  { q: 'Apakah bisa pengiriman ke luar pulau / luar negeri?', a: 'Ya, kami melayani pengiriman ke seluruh Indonesia dan internasional. Pengiriman menggunakan ekspedisi khusus karya seni dengan asuransi penuh. Untuk monumental, tim kami melakukan instalasi on-site.' },
  { q: 'Bagaimana garansi materialnya?', a: 'Setiap karya memiliki garansi material & finishing 1–5 tahun tergantung material (marmer 5th, perunggu 3th, kayu 2th, resin 1th). Perawatan dan touch-up minor dilakukan gratis selama masa garansi.' },
  { q: 'Bisakah konsultasi tanpa komitmen?', a: 'Ya, konsultasi awal 30 menit GRATIS via WhatsApp, video call, atau kunjungan studio. Tidak ada komitmen pembelian — kami senang membantu Anda memahami pilihan dan kemungkinan yang ada.' },
]

const TIMELINE = [
  { cat: 'Patung Wajah Marmer', weeks: '4–6 minggu' },
  { cat: 'Patung Figur Perunggu', weeks: '8–12 minggu' },
  { cat: 'Patung Abstrak Resin', weeks: '3–5 minggu' },
  { cat: 'Patung Monumental', weeks: '4–10 bulan' },
  { cat: 'Relief Granit/Marmer', weeks: '6–10 minggu' },
  { cat: 'Patung Hewan Kayu', weeks: '5–8 minggu' },
]

const PROCESS = [
  { icon: MessagesSquare, title: 'Konsultasi Gratis', desc: 'Diskusi visi, anggaran, dan teknis. Tidak ada komitmen.' },
  { icon: Palette,        title: 'Desain & Maket',   desc: 'Sketsa dan maket digital untuk persetujuan.' },
  { icon: Layers3,        title: 'DP & Material',     desc: 'Pemilihan material premium setelah DP.' },
  { icon: Hammer,         title: 'Pemahatan',        desc: 'Foto progress dikirim per milestone.' },
  { icon: FileCheck,      title: 'Finishing & Sertifikat', desc: 'Finishing presisi + sertifikat keaslian QR.' },
  { icon: Truck,          title: 'Pengiriman & Instalasi', desc: 'Aman terkirim, dengan instalasi profesional.' },
]

export default function PreOrderPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  return (
    <>
      <PageHeader title="Pre-Order Patung Custom" subtitle="Lima langkah mudah mewujudkan visi seni Anda menjadi karya patung yang abadi." breadcrumb={[{ label: 'Pre-Order' }]} />

      {/* Process strip */}
      <section className="py-12">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="ALUR PEMESANAN" title="Cara Memesan Patung Custom — 6 Langkah" />
          </Reveal>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6">
            {PROCESS.map((s, i) => (
              <div key={i} className="rounded-lg border border-line bg-bg-card p-5">
                <div className="flex items-center gap-2">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-accent-gold/15 text-xs font-bold text-accent-highlight">{i+1}</div>
                  <s.icon className="h-5 w-5 text-accent-gold" />
                </div>
                <h3 className="mt-3 font-display text-base">{s.title}</h3>
                <p className="mt-1 text-xs text-ink-secondary leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Wizard */}
      <section className="border-y border-line/60 bg-bg-secondary py-14">
        <div className="container">
          <Reveal>
            <SectionTitle eyebrow="KONFIGURATOR" title="Bangun Pesanan Anda" subtitle="Isi langkah demi langkah. Anda akan mendapat estimasi harga, durasi, dan ringkasan yang dapat langsung dikirim via WhatsApp." />
          </Reveal>
          <PreOrderWizard defaults={{ category: searchParams.kategori, material: searchParams.material }} />
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16">
        <div className="container">
          <Reveal><SectionTitle eyebrow="DURASI PRODUKSI" title="Estimasi Waktu Produksi per Kategori" subtitle="Durasi dapat bervariasi tergantung kompleksitas, ukuran, dan antrian. Selalu kami informasikan transparan saat konsultasi." /></Reveal>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {TIMELINE.map(t => (
              <div key={t.cat} className="flex items-center justify-between rounded-md border border-line bg-bg-card px-5 py-4">
                <div>
                  <p className="font-display text-base">{t.cat}</p>
                </div>
                <div className="flex items-center gap-1.5 text-accent-highlight">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">{t.weeks}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust builders */}
      <section className="border-y border-line/60 bg-bg-secondary py-16">
        <div className="container grid gap-6 md:grid-cols-3">
          {[
            { icon: ShieldCheck, t: 'Garansi 1–5 Tahun', d: 'Material & finishing dijamin tahan lama dengan perawatan minor selama masa garansi.' },
            { icon: Award,       t: 'Sertifikat Keaslian Digital', d: 'Setiap karya custom mendapat sertifikat ber-QR code untuk verifikasi keaslian.' },
            { icon: Clock,       t: 'Tracking Progress Real-time', d: 'Klien menerima foto progress per milestone via WhatsApp/dashboard.' },
          ].map((c,i) => (
            <Reveal key={i} delay={i*0.08}>
              <div className="rounded-lg border border-accent-gold/30 bg-bg-card p-6">
                <c.icon className="h-7 w-7 text-accent-gold" />
                <h3 className="mt-3 font-display text-xl">{c.t}</h3>
                <p className="mt-2 text-sm text-ink-secondary leading-relaxed">{c.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <Reveal><SectionTitle eyebrow="FAQ PRE-ORDER" title="Pertanyaan yang Sering Diajukan" align="center" /></Reveal>
          <div className="space-y-3">
            {FAQS.map((f,i) => (
              <details key={i} className="group rounded-lg border border-line bg-bg-card p-5">
                <summary className="flex cursor-pointer items-center justify-between text-base font-medium">
                  <span>{f.q}</span>
                  <ChevronDown className="h-5 w-5 text-accent-gold transition-transform group-open:rotate-180" />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-secondary">{f.a}</p>
              </details>
            ))}
          </div>

          <div className="mt-10 rounded-lg border border-accent-gold/30 bg-gradient-to-r from-bg-card to-bg-card/60 p-8 text-center">
            <h3 className="font-display text-2xl">Masih ragu? Konsultasi Gratis Dulu</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-secondary">Diskusi 30 menit tanpa komitmen dengan tim pengrajin kami. Kami bantu pilih material, ukuran, dan finishing yang tepat.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild size="lg"><Link href="/booking">Booking Konsultasi</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/kontak">Form Kontak</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
