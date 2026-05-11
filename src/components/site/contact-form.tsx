'use client'

import { useState } from 'react'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HelpHint } from '@/components/ui/tooltip'
import { Loader2, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'

const PURPOSES = ['Pesan Patung Custom', 'Tanya Harga', 'Kunjungan Galeri', 'Kerjasama/Partnership', 'Lainnya']
const INTERESTS = ['Patung Wajah','Patung Figur','Patung Abstrak','Patung Monumental','Relief','Patung Hewan']
const BUDGETS = ['< 20 juta', '20-50 juta', '50-100 juta', '100-500 juta', '> 500 juta']

export function ContactForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/inquiry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal mengirim pesan')
      setDone(true)
      toast.success('Pesan terkirim! Tim kami akan menghubungi Anda secepatnya.')
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-accent-gold/40 bg-bg-card p-10 text-center">
        <CheckCircle2 className="mx-auto h-12 w-12 text-accent-highlight" />
        <h3 className="mt-4 font-display text-2xl">Pesan Terkirim!</h3>
        <p className="mt-2 text-sm text-ink-secondary">Terima kasih telah menghubungi Arthomoro Jaya Sentosa. Kami akan merespons dalam 1×24 jam pada hari kerja.</p>
      </div>
    )
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-lg border border-line bg-bg-card p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <Label required>Nama Lengkap</Label>
          <Input name="name" required placeholder="Nama Anda" />
        </div>
        <div>
          <Label required hint={<HelpHint text="Email digunakan untuk konfirmasi dan korespondensi resmi." />}>Email</Label>
          <Input type="email" name="email" required placeholder="nama@email.com" />
        </div>
        <div>
          <Label required hint={<HelpHint text="WhatsApp aktif untuk respons cepat. Kami akan menghubungi Anda di sini." />}>WhatsApp</Label>
          <Input name="whatsapp" required placeholder="08xxxxxxxxxx" inputMode="numeric" />
        </div>
        <div>
          <Label required>Jenis Keperluan</Label>
          <Select name="purpose" required defaultValue="">
            <option value="" disabled>Pilih keperluan…</option>
            {PURPOSES.map(p => <option key={p} value={p}>{p}</option>)}
          </Select>
        </div>
        <div>
          <Label hint={<HelpHint text="Jenis patung yang Anda minati. Opsional — jika belum pasti, biarkan kosong." />}>Jenis Patung</Label>
          <Select name="interest" defaultValue="">
            <option value="">Belum tentukan</option>
            {INTERESTS.map(i => <option key={i} value={i}>{i}</option>)}
          </Select>
        </div>
        <div>
          <Label hint={<HelpHint text="Estimasi anggaran membantu kami menyiapkan rekomendasi yang sesuai." />}>Estimasi Budget</Label>
          <Select name="budget" defaultValue="">
            <option value="">Belum tentukan</option>
            {BUDGETS.map(b => <option key={b} value={b}>{b}</option>)}
          </Select>
        </div>
      </div>

      <div>
        <Label required hint={<HelpHint text="Ceritakan visi Anda — semakin detail, semakin akurat respons kami." />}>Pesan / Detail Kebutuhan</Label>
        <Textarea name="message" required placeholder="Ceritakan kebutuhan, visi, ukuran, deadline, atau pertanyaan Anda…" />
      </div>

      <div className="flex items-center justify-end gap-3 pt-2">
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Kirim Pesan
        </Button>
      </div>
    </form>
  )
}
