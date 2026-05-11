'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HelpHint } from '@/components/ui/tooltip'
import { Loader2, Save } from 'lucide-react'
import { toast } from 'sonner'

type Item = { key: string; label: string; hint?: string; textarea?: boolean }
type Group = { title: string; items: Item[] }

export function SettingsForm({ groups, initial }: { groups: Group[]; initial: Record<string,string> }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<Record<string,string>>(initial)

  function update(key: string, val: string) { setData(d => ({ ...d, [key]: val })) }

  async function save() {
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/setting`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error()
      toast.success('Pengaturan tersimpan'); router.refresh()
    } catch { toast.error('Gagal menyimpan') } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      {groups.map(g => (
        <section key={g.title} className="rounded-lg border border-line bg-bg-card p-6">
          <h2 className="font-display text-xl">{g.title}</h2>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {g.items.map(it => (
              <div key={it.key} className={it.textarea ? 'sm:col-span-2' : ''}>
                <Label hint={it.hint ? <HelpHint text={it.hint} /> : undefined}>{it.label}</Label>
                {it.textarea
                  ? <Textarea value={data[it.key] || ''} onChange={e => update(it.key, e.target.value)} rows={3} />
                  : <Input value={data[it.key] || ''} onChange={e => update(it.key, e.target.value)} />}
              </div>
            ))}
          </div>
        </section>
      ))}

      <div className="sticky bottom-4 flex justify-end">
        <Button size="lg" onClick={save} disabled={loading}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />} Simpan Semua
        </Button>
      </div>
    </div>
  )
}
