'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const STATUSES = [
  { v: 'NEW', l: 'Baru' },
  { v: 'READ', l: 'Dibaca' },
  { v: 'IN_PROGRESS', l: 'Diproses' },
  { v: 'DONE', l: 'Selesai' },
  { v: 'REJECTED', l: 'Ditolak' },
]

export function InquiryStatusSelect({ id, value }: { id: string; value: string }) {
  const router = useRouter()
  const [v, setV] = useState(value)
  async function update(newVal: string) {
    setV(newVal)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/inquiry/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status: newVal }),
      })
      if (!res.ok) throw new Error('Gagal update')
      toast.success('Status diperbarui')
      router.refresh()
    } catch (e: any) { setV(value); toast.error(e.message) }
  }
  return (
    <select value={v} onChange={e => update(e.target.value)} className="rounded-md border border-line bg-bg-secondary px-2 py-1 text-xs">
      {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
    </select>
  )
}
