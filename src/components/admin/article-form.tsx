'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HelpHint } from '@/components/ui/tooltip'
import { FileUploader } from '@/components/admin/file-uploader'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { slugify } from '@/lib/utils'

const CATEGORIES = [
  'Tips Merawat','Material Patung','Sejarah Seni','Behind the Scenes','Inspirasi Dekorasi','Panduan Pre-Order','Panduan Hadiah','Berita & Event',
]

export function ArticleForm({ initial }: { initial?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [f, setF] = useState({
    title: initial?.title || '',
    slug: initial?.slug || '',
    excerpt: initial?.excerpt || '',
    content: initial?.content || '<p>Tulis konten artikel di sini…</p>',
    category: initial?.category || CATEGORIES[0],
    author: initial?.author || 'Tim Arthomoro',
    readMinutes: initial?.readMinutes || 5,
    coverImage: initial?.coverImage || '',
    published: initial?.published ?? true,
  })

  const update = (p: Partial<typeof f>) => setF(s => ({ ...s, ...p }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const slug = f.slug || slugify(f.title)
      const payload = { ...f, slug, publishedAt: f.published ? new Date().toISOString() : null }
      const isEdit = !!initial?.id
      const url = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/article${isEdit ? `/${initial.id}` : ''}`
      const res = await fetch(url, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal menyimpan')
      toast.success('Tersimpan')
      router.push('/admin/artikel'); router.refresh()
    } catch (e: any) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4 rounded-lg border border-line bg-bg-card p-6">
        <div><Label required>Judul</Label><Input value={f.title} onChange={e => update({ title: e.target.value, slug: f.slug || slugify(e.target.value) })} required /></div>
        <div><Label hint={<HelpHint text="URL-friendly. Auto dari judul." />}>Slug</Label><Input value={f.slug} onChange={e => update({ slug: slugify(e.target.value) })} /></div>
        <div><Label required hint={<HelpHint text="Ringkasan 1–2 kalimat untuk preview di kartu artikel." />}>Excerpt</Label><Textarea value={f.excerpt} onChange={e => update({ excerpt: e.target.value })} rows={2} required /></div>
        <div><Label required hint={<HelpHint text="Konten artikel dalam format HTML. Anda bisa menggunakan tag <h2>, <p>, <ul>, <blockquote>, dll." />}>Konten (HTML)</Label><Textarea value={f.content} onChange={e => update({ content: e.target.value })} rows={18} required className="font-mono text-xs" /></div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-base">Pengaturan</h3>
          <div className="mt-3 space-y-3">
            <div><Label>Kategori</Label>
              <Select value={f.category} onChange={e => update({ category: e.target.value })}>{CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}</Select>
            </div>
            <div><Label>Author</Label><Input value={f.author} onChange={e => update({ author: e.target.value })} /></div>
            <div><Label hint={<HelpHint text="Estimasi waktu baca dalam menit." />}>Estimasi Baca (menit)</Label><Input type="number" value={f.readMinutes} onChange={e => update({ readMinutes: Number(e.target.value) as any })} /></div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={f.published} onChange={e => update({ published: e.target.checked })} className="accent-[#C8A96E]" /> Published
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-base">Cover Artikel</h3>
          <div className="mt-3">
            <FileUploader
              kind="image"
              folder="article"
              value={f.coverImage}
              onChange={url => update({ coverImage: url })}
              required
              hint={<HelpHint text="Foto cover artikel. Ideal 16:9 atau 16:10." />}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} {initial?.id ? 'Simpan Perubahan' : 'Publish'}</Button>
      </aside>
    </form>
  )
}
