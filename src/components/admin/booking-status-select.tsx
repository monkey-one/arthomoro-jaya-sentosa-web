'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const STATUSES = ['PENDING','CONFIRMED','DONE','CANCELLED','NOSHOW']

export function BookingStatusSelect({ id, value }: { id: string; value: string }) {
  const router = useRouter()
  const [v, setV] = useState(value)
  async function update(newVal: string) {
    setV(newVal)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/booking/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newVal }) })
      if (!res.ok) throw new Error()
      toast.success('Status diperbarui'); router.refresh()
    } catch { setV(value); toast.error('Gagal') }
  }
  return (
    <select value={v} onChange={e => update(e.target.value)} className="rounded-md border border-line bg-bg-secondary px-2 py-1 text-xs">
      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  )
}
