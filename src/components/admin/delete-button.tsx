'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Trash2, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function DeleteButton({ url, label = 'Hapus', confirm = 'Yakin ingin menghapus?', onDone }: { url: string; label?: string; confirm?: string; onDone?: () => void }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  async function handle() {
    if (!window.confirm(confirm)) return
    setLoading(true)
    try {
      const res = await fetch(url, { method: 'DELETE' })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal menghapus')
      toast.success('Berhasil dihapus')
      onDone?.()
      router.refresh()
    } catch (e: any) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }
  return (
    <button onClick={handle} disabled={loading} className="inline-flex items-center gap-1 rounded-md border border-red-700/40 px-2.5 py-1 text-xs text-red-300 hover:bg-red-700/10">
      {loading ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />} {label}
    </button>
  )
}
