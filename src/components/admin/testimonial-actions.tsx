'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { toast } from 'sonner'
import { Check, X, Star, ShieldCheck, Trash2, Loader2 } from 'lucide-react'

export function TestimonialActions({ id, status, featured, verified }: { id: string; status: string; featured: boolean; verified: boolean }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  async function update(patch: any) {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/testimonial/${id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(patch),
      })
      if (!res.ok) throw new Error()
      toast.success('Tersimpan'); router.refresh()
    } catch { toast.error('Gagal') }
    finally { setLoading(false) }
  }

  async function del() {
    if (!confirm('Hapus testimoni ini?')) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/testimonial/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error()
      toast.success('Dihapus'); router.refresh()
    } catch { toast.error('Gagal') } finally { setLoading(false) }
  }

  return (
    <div className="flex gap-1">
      {status !== 'APPROVED' && <button onClick={() => update({ status: 'APPROVED' })} disabled={loading} title="Approve" className="rounded-md border border-emerald-700/40 p-1.5 text-emerald-300 hover:bg-emerald-700/10"><Check className="h-3 w-3" /></button>}
      {status !== 'REJECTED' && <button onClick={() => update({ status: 'REJECTED' })} disabled={loading} title="Reject" className="rounded-md border border-red-700/40 p-1.5 text-red-300 hover:bg-red-700/10"><X className="h-3 w-3" /></button>}
      <button onClick={() => update({ featured: !featured })} disabled={loading} title={featured ? 'Unfeature' : 'Feature'} className={`rounded-md border p-1.5 ${featured ? 'border-accent-gold text-accent-highlight' : 'border-line text-ink-secondary hover:border-accent-gold'}`}><Star className="h-3 w-3" /></button>
      <button onClick={() => update({ verifiedOrder: !verified })} disabled={loading} title={verified ? 'Unverify' : 'Verify Order'} className={`rounded-md border p-1.5 ${verified ? 'border-emerald-700 text-emerald-300' : 'border-line text-ink-secondary hover:border-emerald-700'}`}><ShieldCheck className="h-3 w-3" /></button>
      <button onClick={del} disabled={loading} title="Hapus" className="rounded-md border border-red-700/40 p-1.5 text-red-300 hover:bg-red-700/10">{loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}</button>
    </div>
  )
}
