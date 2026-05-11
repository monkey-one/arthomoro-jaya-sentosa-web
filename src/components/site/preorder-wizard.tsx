'use client'

import { useMemo, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { HelpHint } from '@/components/ui/tooltip'
import { Check, ChevronLeft, ChevronRight, MessageCircle, Loader2 } from 'lucide-react'
import { cn, formatIDRShort, waLink } from '@/lib/utils'
import { toast } from 'sonner'

const CATEGORIES = ['Patung Wajah','Patung Figur','Patung Abstrak','Patung Monumental','Relief','Patung Hewan']
const MATERIALS  = ['Marmer','Perunggu','Kayu','Resin','Granit','Mixed Media']
const SIZES      = [
  { v: 'Miniatur',    h: 30,  label: 'Miniatur · ≤40cm' },
  { v: 'Meja',        h: 65,  label: 'Meja · 40–90cm' },
  { v: 'Manusia',     h: 160, label: 'Skala Manusia · 90–200cm' },
  { v: 'Monumental',  h: 300, label: 'Monumental · ≥200cm' },
]
const FINISHINGS = ['Matte','Gloss','Patina','Gold-leaf','Natural Stone','Antique']

// Base price formula (rough estimate, IDR)
const CAT_BASE: Record<string, number> = {
  'Patung Wajah': 8_000_000,
  'Patung Figur': 15_000_000,
  'Patung Abstrak': 12_000_000,
  'Patung Monumental': 180_000_000,
  'Relief': 9_500_000,
  'Patung Hewan': 11_000_000,
}
const MAT_MULT: Record<string, number> = {
  'Marmer': 1.8, 'Perunggu': 2.2, 'Kayu': 1.2, 'Resin': 1.0, 'Granit': 1.7, 'Mixed Media': 1.5,
}
const SIZE_MULT: Record<string, number> = { 'Miniatur': 0.7, 'Meja': 1.0, 'Manusia': 2.4, 'Monumental': 8.0 }
const SIZE_WEEKS: Record<string, [number, number]> = { 'Miniatur': [3,5], 'Meja': [4,8], 'Manusia': [10,16], 'Monumental': [24,40] }

const STEPS = ['Jenis', 'Material', 'Ukuran', 'Finishing', 'Pengiriman', 'Data']

export function PreOrderWizard({ defaults }: { defaults?: { category?: string; material?: string } }) {
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState<null | { code: string; wa: string }>(null)

  const [form, setForm] = useState({
    category: defaults?.category || '',
    material: defaults?.material || '',
    size: '',
    height: 65,
    finishing: '',
    installation: false,
    installAddress: '',
    deadline: '',
    name: '',
    email: '',
    whatsapp: '',
    notes: '',
  })

  const estimate = useMemo(() => {
    if (!form.category || !form.material || !form.size) return null
    const base = CAT_BASE[form.category] || 10_000_000
    const mat = MAT_MULT[form.material] || 1
    const sz = SIZE_MULT[form.size] || 1
    const min = Math.round((base * mat * sz) * 0.85)
    const max = Math.round((base * mat * sz) * 1.35)
    const [wMin, wMax] = SIZE_WEEKS[form.size] || [4,8]
    return { min, max, weeks: [wMin, wMax] }
  }, [form])

  const update = (patch: Partial<typeof form>) => setForm(f => ({ ...f, ...patch }))

  const canNext = () => {
    if (step === 0) return !!form.category
    if (step === 1) return !!form.material
    if (step === 2) return !!form.size
    if (step === 3) return !!form.finishing
    if (step === 4) return !form.installation || form.installAddress.trim().length > 5
    return form.name.trim() && form.whatsapp.trim() && form.email.trim()
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/preorder`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name, customerEmail: form.email, customerWa: form.whatsapp,
          sculptureType: form.category, material: form.material, sizeLabel: form.size,
          heightCm: form.height, finishing: form.finishing,
          installation: form.installation, installAddress: form.installation ? form.installAddress : null,
          deadline: form.deadline || null,
          estimateMin: estimate?.min, estimateMax: estimate?.max, estimateWeeks: estimate ? estimate.weeks[1] : null,
          notes: form.notes,
        }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal mengirim')
      const wa = waLink([
        `Halo Arthomoro Jaya Sentosa, saya ingin pre-order patung:`,
        `Kode: ${data.code}`,
        `Jenis: ${form.category}`,
        `Material: ${form.material}`,
        `Ukuran: ${form.size} (${form.height}cm)`,
        `Finishing: ${form.finishing}`,
        form.installation ? `Instalasi: Ya (${form.installAddress})` : 'Instalasi: Tidak',
        estimate ? `Estimasi: ${formatIDRShort(estimate.min)} – ${formatIDRShort(estimate.max)}` : '',
        `Nama: ${form.name}`,
        `Email: ${form.email}`,
        form.notes ? `Catatan: ${form.notes}` : '',
        '',
        'Mohon dibantu untuk konsultasi lanjutan.',
      ].filter(Boolean).join('\n'))
      setSubmitted({ code: data.code, wa })
      toast.success('Pesanan terkirim! Lanjutkan ke WhatsApp untuk konsultasi cepat.')
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan')
    } finally {
      setSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-lg border border-accent-gold/40 bg-bg-card p-10 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-gold/15 text-accent-highlight">
          <Check className="h-7 w-7" />
        </div>
        <h3 className="font-display text-3xl">Terima Kasih!</h3>
        <p className="mt-3 text-ink-secondary">Pesanan Anda tercatat dengan kode <span className="font-mono text-accent-highlight">{submitted.code}</span>. Tim kami akan menghubungi Anda dalam 1×24 jam.</p>
        <p className="mt-2 text-sm text-ink-secondary">Untuk respons lebih cepat, lanjutkan ke WhatsApp.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild variant="wa" size="lg"><a href={submitted.wa} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-5 w-5" /> Lanjut ke WhatsApp</a></Button>
          <Button variant="outline" size="lg" onClick={() => { setSubmitted(null); setStep(0) }}>Buat Pesanan Baru</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Stepper */}
      <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
        {STEPS.map((s, i) => (
          <div key={s} className="flex items-center gap-2">
            <span className={cn('step-dot', i === step && 'active', i < step && 'done')}>{i < step ? <Check className="h-3.5 w-3.5" /> : i+1}</span>
            <span className={cn('text-xs uppercase tracking-wider', i === step ? 'text-accent-highlight' : 'text-ink-secondary')}>{s}</span>
            {i < STEPS.length - 1 && <span className="h-px w-6 bg-line/60" />}
          </div>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-[2fr,1fr]">
        <div className="rounded-lg border border-line bg-bg-card p-6 md:p-8">
          {step === 0 && (
            <div>
              <h3 className="font-display text-2xl">Pilih Jenis Patung</h3>
              <p className="mt-1 text-sm text-ink-secondary">Pilih kategori yang paling sesuai. Anda bisa mengubahnya saat konsultasi.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {CATEGORIES.map(c => (
                  <button key={c} type="button" onClick={() => update({ category: c })}
                    className={cn('rounded-md border p-4 text-left transition', form.category === c ? 'border-accent-gold bg-accent-gold/5' : 'border-line bg-bg-secondary/40 hover:border-accent-gold/40')}>
                    <p className="font-display text-base">{c}</p>
                    <p className="mt-0.5 text-xs text-ink-secondary">Mulai {formatIDRShort(CAT_BASE[c])}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 1 && (
            <div>
              <h3 className="font-display text-2xl">Pilih Material</h3>
              <p className="mt-1 text-sm text-ink-secondary">Setiap material memiliki karakter dan ketahanan berbeda — kami bantu pilih yang tepat.</p>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {MATERIALS.map(m => (
                  <button key={m} type="button" onClick={() => update({ material: m })}
                    className={cn('rounded-md border p-4 text-left transition', form.material === m ? 'border-accent-gold bg-accent-gold/5' : 'border-line bg-bg-secondary/40 hover:border-accent-gold/40')}>
                    <p className="font-display text-base">{m}</p>
                    <p className="mt-0.5 text-xs text-ink-secondary">
                      {m === 'Marmer' && 'Elegan klasik, tahan ratusan tahun.'}
                      {m === 'Perunggu' && 'Monumental, tahan cuaca ekstrem.'}
                      {m === 'Kayu' && 'Hangat, organik, ringan.'}
                      {m === 'Resin' && 'Ekonomis, ringan, detail tinggi.'}
                      {m === 'Granit' && 'Sangat keras, ideal relief publik.'}
                      {m === 'Mixed Media' && 'Kombinasi inovatif beberapa material.'}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h3 className="flex items-center gap-2 font-display text-2xl">Tentukan Ukuran <HelpHint text="Skala ukuran membantu menghitung estimasi harga. Saat konsultasi, dimensi presisi akan disepakati." /></h3>
              <p className="mt-1 text-sm text-ink-secondary">Pilih skala terlebih dahulu, lalu sesuaikan tinggi yang diinginkan.</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-4">
                {SIZES.map(s => (
                  <button key={s.v} type="button" onClick={() => update({ size: s.v, height: s.h })}
                    className={cn('rounded-md border p-4 text-left transition', form.size === s.v ? 'border-accent-gold bg-accent-gold/5' : 'border-line bg-bg-secondary/40 hover:border-accent-gold/40')}>
                    <p className="font-display text-base">{s.v}</p>
                    <p className="mt-0.5 text-xs text-ink-secondary">{s.label}</p>
                  </button>
                ))}
              </div>

              {form.size && (
                <div className="mt-6 rounded-md border border-line bg-bg-secondary/40 p-5">
                  <Label hint={<HelpHint text="Geser untuk mengubah perkiraan tinggi karya. Ukuran final ditentukan saat desain bersama tim kami." />}>Tinggi (cm)</Label>
                  <div className="flex items-center gap-4">
                    <input type="range" min={20} max={500} step={5} value={form.height} onChange={e => update({ height: Number(e.target.value) })} className="w-full accent-[#C8A96E]" />
                    <span className="w-20 text-right font-display text-xl text-accent-highlight">{form.height}cm</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 3 && (
            <div>
              <h3 className="flex items-center gap-2 font-display text-2xl">Pilih Finishing <HelpHint text="Finishing menentukan tampilan akhir: matte (halus tidak mengkilap), gloss (mengkilap), patina (oksidasi artistik), gold-leaf (lapisan emas)." /></h3>
              <div className="mt-6 grid gap-3 sm:grid-cols-2 md:grid-cols-3">
                {FINISHINGS.map(f => (
                  <button key={f} type="button" onClick={() => update({ finishing: f })}
                    className={cn('rounded-md border p-4 text-left transition', form.finishing === f ? 'border-accent-gold bg-accent-gold/5' : 'border-line bg-bg-secondary/40 hover:border-accent-gold/40')}>
                    <p className="font-display text-base">{f}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 4 && (
            <div>
              <h3 className="font-display text-2xl">Pengiriman & Instalasi</h3>
              <p className="mt-1 text-sm text-ink-secondary">Apakah karya perlu dipasang on-site oleh tim kami?</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <button type="button" onClick={() => update({ installation: false, installAddress: '' })} className={cn('rounded-md border p-4 text-left transition', !form.installation ? 'border-accent-gold bg-accent-gold/5' : 'border-line bg-bg-secondary/40 hover:border-accent-gold/40')}>
                  <p className="font-display text-base">Tanpa Instalasi</p>
                  <p className="mt-1 text-xs text-ink-secondary">Karya dikirim siap pakai, Anda atur sendiri pemasangan.</p>
                </button>
                <button type="button" onClick={() => update({ installation: true })} className={cn('rounded-md border p-4 text-left transition', form.installation ? 'border-accent-gold bg-accent-gold/5' : 'border-line bg-bg-secondary/40 hover:border-accent-gold/40')}>
                  <p className="font-display text-base">Instalasi On-Site</p>
                  <p className="mt-1 text-xs text-ink-secondary">Tim kami datang, instalasi profesional di lokasi Anda.</p>
                </button>
              </div>

              {form.installation && (
                <div className="mt-5">
                  <Label hint={<HelpHint text="Alamat lengkap lokasi instalasi membantu kami menghitung biaya logistik & survei." />}>Alamat Instalasi</Label>
                  <Textarea value={form.installAddress} onChange={e => update({ installAddress: e.target.value })} placeholder="Jl. ……, Kota, Provinsi, Kode Pos" />
                </div>
              )}

              <div className="mt-5">
                <Label hint={<HelpHint text="Opsional. Jika Anda butuh karya selesai pada tanggal tertentu, beri tahu kami." />}>Deadline (opsional)</Label>
                <Input type="date" value={form.deadline} onChange={e => update({ deadline: e.target.value })} />
              </div>
            </div>
          )}

          {step === 5 && (
            <div>
              <h3 className="font-display text-2xl">Data Kontak Anda</h3>
              <p className="mt-1 text-sm text-ink-secondary">Kami akan menghubungi Anda untuk konsultasi lanjutan.</p>

              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div>
                  <Label required>Nama Lengkap</Label>
                  <Input value={form.name} onChange={e => update({ name: e.target.value })} placeholder="Nama Anda" />
                </div>
                <div>
                  <Label required hint={<HelpHint text="WhatsApp aktif untuk konfirmasi pesanan & update progress." />}>WhatsApp</Label>
                  <Input value={form.whatsapp} onChange={e => update({ whatsapp: e.target.value })} placeholder="08xxxxxxxxxx" inputMode="numeric" />
                </div>
                <div className="sm:col-span-2">
                  <Label required>Email</Label>
                  <Input type="email" value={form.email} onChange={e => update({ email: e.target.value })} placeholder="nama@email.com" />
                </div>
                <div className="sm:col-span-2">
                  <Label hint={<HelpHint text="Ceritakan singkat visi, inspirasi, atau detail khusus karya yang Anda inginkan." />}>Catatan / Detail Tambahan</Label>
                  <Textarea value={form.notes} onChange={e => update({ notes: e.target.value })} placeholder="Misal: patung wajah ayah saya berdasarkan 5 foto referensi, untuk hadiah 70 tahun…" />
                </div>
              </div>
            </div>
          )}

          {/* Nav */}
          <div className="mt-8 flex items-center justify-between gap-3">
            <Button variant="ghost" size="sm" disabled={step === 0 || submitting} onClick={() => setStep(s => Math.max(0, s-1))}>
              <ChevronLeft className="h-4 w-4" /> Kembali
            </Button>
            <div className="text-xs text-ink-secondary">Langkah {step+1} / {STEPS.length}</div>
            {step < STEPS.length - 1 ? (
              <Button size="md" disabled={!canNext()} onClick={() => setStep(s => Math.min(STEPS.length-1, s+1))}>
                Lanjut <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button size="md" disabled={!canNext() || submitting} onClick={handleSubmit}>
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null} Kirim Pesanan
              </Button>
            )}
          </div>
        </div>

        {/* Summary panel */}
        <aside className="rounded-lg border border-line bg-bg-card p-6">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-gold">Ringkasan</p>
          <h4 className="mt-1 font-display text-xl">Pesanan Anda</h4>
          <dl className="mt-4 space-y-2 text-sm">
            <SummaryRow label="Jenis"     value={form.category} />
            <SummaryRow label="Material"  value={form.material} />
            <SummaryRow label="Ukuran"    value={form.size ? `${form.size} (${form.height}cm)` : ''} />
            <SummaryRow label="Finishing" value={form.finishing} />
            <SummaryRow label="Instalasi" value={form.installation ? 'Ya' : (form.size ? 'Tidak' : '')} />
            {form.deadline && <SummaryRow label="Deadline" value={form.deadline} />}
          </dl>

          {estimate && (
            <div className="mt-5 rounded-md border border-accent-gold/40 bg-accent-gold/5 p-4">
              <p className="text-xs uppercase tracking-wider text-accent-highlight">Estimasi Harga</p>
              <p className="mt-1 font-display text-xl text-accent-highlight">{formatIDRShort(estimate.min)} – {formatIDRShort(estimate.max)}</p>
              <p className="mt-1 text-xs text-ink-secondary">Durasi produksi {estimate.weeks[0]}–{estimate.weeks[1]} minggu</p>
              <p className="mt-3 text-[11px] leading-relaxed text-ink-secondary">Estimasi awal, harga final ditentukan saat konsultasi setelah review desain & spek detail.</p>
            </div>
          )}

          <div className="mt-6 space-y-2 text-xs text-ink-secondary">
            <div className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent-gold" /> Konsultasi gratis tanpa komitmen</div>
            <div className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent-gold" /> Foto progress per milestone</div>
            <div className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent-gold" /> Sertifikat keaslian QR</div>
            <div className="flex items-center gap-2"><Check className="h-3.5 w-3.5 text-accent-gold" /> Garansi material 1–5 tahun</div>
          </div>
        </aside>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line/40 pb-1.5">
      <dt className="text-ink-secondary">{label}</dt>
      <dd className="text-right text-ink-primary">{value || <span className="text-ink-secondary/60">—</span>}</dd>
    </div>
  )
}
