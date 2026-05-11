import { PageHeader } from '@/components/site/page-header'
import { BookingForm } from '@/components/site/booking-form'
import { Reveal } from '@/components/ui/reveal'
import { Calendar, Clock, Video, MapPin, Sparkles } from 'lucide-react'

export default function BookingPage() {
  return (
    <>
      <PageHeader title="Booking Konsultasi" subtitle="Pilih waktu yang nyaman untuk konsultasi 30 menit — gratis, tanpa komitmen pembelian." breadcrumb={[{ label: 'Booking' }]} />

      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-[1.3fr,1fr]">
          <BookingForm />

          <aside className="space-y-6">
            <Reveal>
              <div className="rounded-lg border border-line bg-bg-card p-6">
                <h3 className="font-cinzel text-xs tracking-[0.28em] text-accent-gold">YANG AKAN ANDA DAPATKAN</h3>
                <ul className="mt-4 space-y-3 text-sm text-ink-secondary">
                  <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Diskusi visi, kebutuhan, dan referensi visual</li>
                  <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Rekomendasi material dan ukuran yang tepat</li>
                  <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Estimasi harga, durasi produksi, dan timeline</li>
                  <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Jawaban semua pertanyaan tanpa terburu-buru</li>
                  <li className="flex gap-3"><Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" />Penawaran resmi via email setelah konsultasi</li>
                </ul>
              </div>
            </Reveal>

            <div className="rounded-lg border border-line bg-bg-card p-6">
              <h3 className="font-cinzel text-xs tracking-[0.28em] text-accent-gold">FORMAT KONSULTASI</h3>
              <ul className="mt-4 space-y-3 text-sm">
                <li className="flex items-start gap-3"><Video className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><div><p className="font-medium">Video Call</p><p className="text-xs text-ink-secondary">Google Meet / Zoom — 30 menit</p></div></li>
                <li className="flex items-start gap-3"><MapPin className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><div><p className="font-medium">Kunjungan Studio</p><p className="text-xs text-ink-secondary">Yogyakarta — dengan janji temu</p></div></li>
                <li className="flex items-start gap-3"><Clock className="mt-0.5 h-4 w-4 shrink-0 text-accent-gold" /><div><p className="font-medium">Jadwal Konsultasi</p><p className="text-xs text-ink-secondary">Senin–Sabtu, 09.00–16.00 WIB</p></div></li>
              </ul>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
