'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Label, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HelpHint } from '@/components/ui/tooltip'
import { FileUploader } from '@/components/admin/file-uploader'
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
      {/* Hero media — uploaded video + image */}
      <section className="rounded-lg border border-accent-gold/40 bg-bg-card p-6">
        <h2 className="font-display text-xl">Media Beranda (Hero)</h2>
        <p className="mt-1 text-sm text-ink-secondary">Unggah video atau foto yang akan tampil sebagai background hero di halaman beranda. Jika video diisi, video akan diprioritaskan dan diputar secara otomatis (tanpa suara, looping). Jika kosong, gunakan foto.</p>

        <div className="mt-5 grid gap-6 md:grid-cols-2">
          <div>
            <FileUploader
              kind="video"
              folder="hero"
              value={data['hero_video_url'] || ''}
              onChange={url => update('hero_video_url', url)}
              label="Video Hero (opsional)"
              hint={<HelpHint text="Format MP4 atau WebM, maks 50 MB. Direkomendasikan rasio 16:9 atau 16:10, 1080p, durasi 10–25 detik, tanpa audio." />}
            />
          </div>
          <div>
            <FileUploader
              kind="image"
              folder="hero"
              value={data['hero_image_url'] || ''}
              onChange={url => update('hero_image_url', url)}
              label="Foto Hero (fallback)"
              hint={<HelpHint text="Foto yang dipakai jika video belum diunggah, atau sebagai poster sebelum video memuat. Ideal 2400×1400px." />}
            />
          </div>
        </div>
      </section>

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
