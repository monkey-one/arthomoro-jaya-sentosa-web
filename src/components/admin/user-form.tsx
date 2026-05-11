'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Label, Select } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HelpHint } from '@/components/ui/tooltip'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

export function UserForm({ roles }: { roles: { id: string; name: string }[] }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [f, setF] = useState({ name: '', email: '', password: '', roleId: roles[0]?.id || '' })

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/user`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal')
      toast.success('User dibuat')
      setF({ name: '', email: '', password: '', roleId: roles[0]?.id || '' })
      router.refresh()
    } catch (e: any) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={onSubmit} className="mt-4 space-y-3">
      <div><Label required>Nama</Label><Input value={f.name} onChange={e => setF(s => ({ ...s, name: e.target.value }))} required /></div>
      <div><Label required>Email</Label><Input type="email" value={f.email} onChange={e => setF(s => ({ ...s, email: e.target.value }))} required /></div>
      <div><Label required hint={<HelpHint text="Minimal 8 karakter. User dapat mengubah password setelah login." />}>Password</Label><Input type="password" value={f.password} onChange={e => setF(s => ({ ...s, password: e.target.value }))} required minLength={8} /></div>
      <div><Label required>Role</Label>
        <Select value={f.roleId} onChange={e => setF(s => ({ ...s, roleId: e.target.value }))} required>
          {roles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
        </Select>
      </div>
      <Button type="submit" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} Tambah Pengguna</Button>
    </form>
  )
}
