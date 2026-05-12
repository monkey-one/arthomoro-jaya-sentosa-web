'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Input, Label, Select, Textarea } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { HelpHint } from '@/components/ui/tooltip'
import { FileUploader, MultiImageUploader } from '@/components/admin/file-uploader'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { slugify, safeJSON } from '@/lib/utils'

export function ProjectForm({ initial }: { initial?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [f, setF] = useState({
    title: initial?.title || '', slug: initial?.slug || '',
    client: initial?.client || '', clientType: initial?.clientType || 'Swasta',
    location: initial?.location || '', year: initial?.year || new Date().getFullYear(),
    category: initial?.category || 'Monumental', material: initial?.material || 'Perunggu',
    dimensions: initial?.dimensions || '', description: initial?.description || '',
    challenge: initial?.challenge || '', solution: initial?.solution || '',
    duration: initial?.duration || '', coverImage: initial?.coverImage || '',
    galleryImages: initial?.images ? safeJSON<string[]>(typeof initial.images === 'string' ? initial.images : JSON.stringify(initial.images), []) : [],
    featured: !!initial?.featured, published: initial?.published ?? true,
  })
  const update = (p: Partial<typeof f>) => setF(s => ({ ...s, ...p }))

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true)
    try {
      const slug = f.slug || slugify(f.title)
      const { galleryImages, ...rest } = f
      const payload = { ...rest, slug, year: Number(f.year), images: JSON.stringify(galleryImages) }
      if (!payload.coverImage) throw new Error('Cover foto wajib diunggah')
      const isEdit = !!initial?.id
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/project${isEdit ? `/${initial.id}` : ''}`, {
        method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal menyimpan')
      toast.success('Tersimpan')
      router.push('/admin/portofolio'); router.refresh()
    } catch (e: any) { toast.error(e.message) } finally { setLoading(false) }
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4 rounded-lg border border-line bg-bg-card p-6">
        <div><Label required>Judul Proyek</Label><Input value={f.title} onChange={e => update({ title: e.target.value, slug: f.slug || slugify(e.target.value) })} required /></div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div><Label required>Klien</Label><Input value={f.client} onChange={e => update({ client: e.target.value })} required /></div>
          <div><Label>Tipe Klien</Label>
            <Select value={f.clientType} onChange={e => update({ clientType: e.target.value })}>
              <option>Pemerintah</option><option>Swasta</option><option>Personal</option>
            </Select>
          </div>
          <div><Label required>Lokasi</Label><Input value={f.location} onChange={e => update({ location: e.target.value })} required /></div>
          <div><Label required>Tahun</Label><Input type="number" value={f.year} onChange={e => update({ year: Number(e.target.value) as any })} required /></div>
          <div><Label>Kategori</Label><Input value={f.category} onChange={e => update({ category: e.target.value })} /></div>
          <div><Label>Material</Label><Input value={f.material} onChange={e => update({ material: e.target.value })} /></div>
          <div><Label>Dimensi</Label><Input value={f.dimensions} onChange={e => update({ dimensions: e.target.value })} placeholder="T 3.5m × L 1.8m" /></div>
          <div><Label>Durasi</Label><Input value={f.duration} onChange={e => update({ duration: e.target.value })} placeholder="6 bulan" /></div>
        </div>
        <div><Label required>Deskripsi Proyek</Label><Textarea value={f.description} onChange={e => update({ description: e.target.value })} rows={4} required /></div>
        <div><Label hint={<HelpHint text="Tantangan teknis atau konseptual proyek ini." />}>Tantangan</Label><Textarea value={f.challenge} onChange={e => update({ challenge: e.target.value })} rows={3} /></div>
        <div><Label hint={<HelpHint text="Cara tim Arthomoro mengatasi tantangan tersebut." />}>Solusi</Label><Textarea value={f.solution} onChange={e => update({ solution: e.target.value })} rows={3} /></div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-base">Status</h3>
          <div className="mt-3 space-y-3">
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.featured} onChange={e => update({ featured: e.target.checked })} className="accent-[#C8A96E]" /> Featured</label>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={f.published} onChange={e => update({ published: e.target.checked })} className="accent-[#C8A96E]" /> Published</label>
          </div>
        </div>
        <div className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-base">Foto Proyek</h3>
          <div className="mt-3 space-y-4">
            <FileUploader kind="image" folder="project" value={f.coverImage} onChange={url => update({ coverImage: url })} label="Foto Cover" required />
            <MultiImageUploader folder="project" value={f.galleryImages} onChange={imgs => update({ galleryImages: imgs })} label="Galeri Foto Proyek" hint={<HelpHint text="Foto proses, hasil akhir, instalasi. Hingga 8 foto." />} />
          </div>
        </div>
        <Button type="submit" size="lg" className="w-full" disabled={loading}>{loading && <Loader2 className="h-4 w-4 animate-spin" />} {initial?.id ? 'Simpan' : 'Buat Proyek'}</Button>
      </aside>
    </form>
  )
}
