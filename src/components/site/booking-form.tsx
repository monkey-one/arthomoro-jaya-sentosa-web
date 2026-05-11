'use client'

import { useState } from 'react'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HelpHint } from '@/components/ui/tooltip'
import { Loader2, CalendarCheck } from 'lucide-react'
import { toast } from 'sonner'

const SLOTS = ['09:00','10:00','11:00','13:00','14:00','15:00','16:00']

function minDate() {
  const d = new Date()
  d.setDate(d.getDate() + 1)
  return d.toISOString().slice(0,10)
}

export function BookingForm() {
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    const fd = new FormData(e.currentTarget)
    const payload = Object.fromEntries(fd.entries())
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/booking`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal booking')
      setDone(`${payload.date} jam ${payload.timeSlot}`)
      toast.success('Booking terkirim! Tim kami akan konfirmasi via WhatsApp.')
    } catch (err: any) {
      toast.error(err.message || 'Terjadi kesalahan')
    } finally {
      setLoading(false)
    }
  }

  if (done) {
    return (
      <div className="rounded-lg border border-accent-gold/40 bg-bg-card p-10 text-center">
        <CalendarCheck className="mx-auto h-12 w-12 text-accent-highlight" />
        <h3 className="mt-4 font-display text-2xl">Booking Tercatat!</h3>
        <p className="mt-2 text-sm text-ink-secondary">Konsultasi dijadwalkan pada <span className="text-accent-highlight">{done} WIB</span>. Tim kami akan mengirim konfirmasi dan link meeting via WhatsApp dalam beberapa jam.</p>
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
          <Label required>WhatsApp</Label>
          <Input name="whatsapp" required placeholder="08xxxxxxxxxx" inputMode="numeric" />
        </div>
        <div className="sm:col-span-2">
          <Label required>Email</Label>
          <Input type="email" name="email" required placeholder="nama@email.com" />
        </div>

        <div>
          <Label required hint={<HelpHint text="Pilih tanggal yang nyaman. Konsultasi tersedia Senin–Sabtu. Pemilihan tanggal merah otomatis tidak tersedia." />}>Tanggal Konsultasi</Label>
          <Input type="date" name="date" required min={minDate()} />
        </div>
        <div>
          <Label required hint={<HelpHint text="Pilih slot 30 menit. Tim kami akan konfirmasi ketersediaan." />}>Jam</Label>
          <Select name="timeSlot" required defaultValue="">
            <option value="" disabled>Pilih jam…</option>
            {SLOTS.map(s => <option key={s} value={s}>{s} WIB</option>)}
          </Select>
        </div>
        <div className="sm:col-span-2">
          <Label required hint={<HelpHint text="Ceritakan singkat tujuan konsultasi: pesan custom, kunjungan studio, atau diskusi proyek tertentu." />}>Keperluan Konsultasi</Label>
          <Textarea name="purpose" required placeholder="Misal: ingin konsultasi pesan patung wajah untuk hadiah pernikahan…" />
        </div>
      </div>

      <div className="flex justify-end pt-2">
        <Button type="submit" size="lg" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} Konfirmasi Booking
        </Button>
      </div>
      <p className="text-xs text-ink-secondary">Booking gratis. Konfirmasi akhir akan dikirim via WhatsApp.</p>
    </form>
  )
}
