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

const CATEGORIES = ['Patung Wajah','Patung Figur','Patung Abstrak','Patung Monumental','Relief','Patung Hewan']
const MATERIALS  = ['Marmer','Perunggu','Kayu','Resin','Granit','Mixed Media']
const STYLES     = ['Realis','Abstrak','Klasik','Modern','Tradisional']
const SIZES      = ['Miniatur','Meja','Manusia','Monumental']
const STATUSES   = [
  { v: 'AVAILABLE_PREORDER', l: 'Tersedia Pre-Order' },
  { v: 'GALLERY', l: 'Karya Galeri' },
  { v: 'SOLD', l: 'Terjual' },
]

export function ArtworkForm({ initial }: { initial?: any }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [f, setF] = useState({
    title: initial?.title || '',
    slug: initial?.slug || '',
    description: initial?.description || '',
    artist: initial?.artist || 'Pengrajin Arthomoro',
    material: initial?.material || 'Marmer',
    category: initial?.category || 'Patung Wajah',
    style: initial?.style || 'Realis',
    sizeLabel: initial?.sizeLabel || 'Meja',
    height: initial?.height || '',
    width: initial?.width || '',
    depth: initial?.depth || '',
    weight: initial?.weight || '',
    year: initial?.year || new Date().getFullYear(),
    status: initial?.status || 'AVAILABLE_PREORDER',
    priceRangeMin: initial?.priceRangeMin || '',
    priceRangeMax: initial?.priceRangeMax || '',
    productionWeeks: initial?.productionWeeks || 6,
    coverImage: initial?.coverImage || '',
    galleryImages: initial?.images ? safeJSON<string[]>(typeof initial.images === 'string' ? initial.images : JSON.stringify(initial.images), []) : [],
    featured: !!initial?.featured,
    published: initial?.published ?? true,
  })

  const update = (patch: Partial<typeof f>) => setF(s => ({ ...s, ...patch }))

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const slug = f.slug || slugify(f.title)
      const { galleryImages, ...rest } = f
      const payload = {
        ...rest,
        slug,
        year: f.year ? Number(f.year) : null,
        priceRangeMin: f.priceRangeMin ? Number(f.priceRangeMin) : null,
        priceRangeMax: f.priceRangeMax ? Number(f.priceRangeMax) : null,
        productionWeeks: f.productionWeeks ? Number(f.productionWeeks) : null,
        images: JSON.stringify(galleryImages),
      }
      if (!payload.coverImage) throw new Error('Cover foto wajib diunggah')
      const isEdit = !!initial?.id
      const url = `${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/artwork${isEdit ? `/${initial.id}` : ''}`
      const res = await fetch(url, { method: isEdit ? 'PATCH' : 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Gagal menyimpan')
      toast.success('Tersimpan')
      router.push('/admin/galeri')
      router.refresh()
    } catch (err: any) { toast.error(err.message) }
    finally { setLoading(false) }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[2fr,1fr]">
      <div className="space-y-4 rounded-lg border border-line bg-bg-card p-6">
        <div>
          <Label required>Judul Karya</Label>
          <Input value={f.title} onChange={e => update({ title: e.target.value, slug: f.slug || slugify(e.target.value) })} required />
        </div>
        <div>
          <Label hint={<HelpHint text="URL-friendly identifier. Otomatis dibuat dari judul. Hanya huruf kecil, angka, dan tanda strip." />}>Slug URL</Label>
          <Input value={f.slug} onChange={e => update({ slug: slugify(e.target.value) })} placeholder="otomatis-dari-judul" />
        </div>
        <div>
          <Label required>Deskripsi</Label>
          <Textarea value={f.description} onChange={e => update({ description: e.target.value })} required rows={5} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label>Kategori</Label>
            <Select value={f.category} onChange={e => update({ category: e.target.value })}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Material</Label>
            <Select value={f.material} onChange={e => update({ material: e.target.value })}>
              {MATERIALS.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Gaya</Label>
            <Select value={f.style} onChange={e => update({ style: e.target.value })}>
              {STYLES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div>
            <Label>Ukuran</Label>
            <Select value={f.sizeLabel} onChange={e => update({ sizeLabel: e.target.value })}>
              {SIZES.map(c => <option key={c} value={c}>{c}</option>)}
            </Select>
          </div>
          <div><Label>Tinggi</Label><Input value={f.height} onChange={e => update({ height: e.target.value })} placeholder="120 cm" /></div>
          <div><Label>Lebar</Label><Input value={f.width} onChange={e => update({ width: e.target.value })} placeholder="60 cm" /></div>
          <div><Label>Kedalaman</Label><Input value={f.depth} onChange={e => update({ depth: e.target.value })} placeholder="40 cm" /></div>
          <div><Label>Berat</Label><Input value={f.weight} onChange={e => update({ weight: e.target.value })} placeholder="35 kg" /></div>
          <div><Label>Tahun</Label><Input type="number" value={f.year} onChange={e => update({ year: Number(e.target.value) as any })} /></div>
          <div><Label>Pengrajin</Label><Input value={f.artist} onChange={e => update({ artist: e.target.value })} /></div>
        </div>
      </div>

      <aside className="space-y-4">
        <div className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-base">Status & Visibility</h3>
          <div className="mt-3 space-y-3">
            <div>
              <Label>Status</Label>
              <Select value={f.status} onChange={e => update({ status: e.target.value })}>
                {STATUSES.map(s => <option key={s.v} value={s.v}>{s.l}</option>)}
              </Select>
            </div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={f.featured} onChange={e => update({ featured: e.target.checked })} className="accent-[#C8A96E]" /> Tampilkan di Featured Home
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={f.published} onChange={e => update({ published: e.target.checked })} className="accent-[#C8A96E]" /> Published
            </label>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-base">Estimasi Pre-Order</h3>
          <div className="mt-3 space-y-3">
            <div>
              <Label hint={<HelpHint text="Estimasi minimum harga pesanan serupa (dalam Rupiah)." />}>Harga Min (Rp)</Label>
              <Input type="number" value={f.priceRangeMin} onChange={e => update({ priceRangeMin: e.target.value as any })} placeholder="15000000" />
            </div>
            <div>
              <Label>Harga Max (Rp)</Label>
              <Input type="number" value={f.priceRangeMax} onChange={e => update({ priceRangeMax: e.target.value as any })} placeholder="35000000" />
            </div>
            <div>
              <Label hint={<HelpHint text="Estimasi minggu produksi dari deal hingga karya siap kirim." />}>Durasi Produksi (minggu)</Label>
              <Input type="number" value={f.productionWeeks} onChange={e => update({ productionWeeks: Number(e.target.value) as any })} />
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-base">Foto Karya</h3>
          <div className="mt-3 space-y-4">
            <FileUploader
              kind="image"
              folder="artwork"
              value={f.coverImage}
              onChange={url => update({ coverImage: url })}
              label="Foto Cover"
              required
              hint={<HelpHint text="Foto utama yang muncul di kartu galeri dan halaman detail. JPG/PNG/WebP, maks 50 MB." />}
            />
            <MultiImageUploader
              folder="artwork"
              value={f.galleryImages}
              onChange={imgs => update({ galleryImages: imgs })}
              label="Galeri Foto Tambahan"
              hint={<HelpHint text="Hingga 8 foto sudut/tampak yang berbeda. Akan dipakai di slider detail karya." />}
            />
          </div>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={loading}>
          {loading && <Loader2 className="h-4 w-4 animate-spin" />} {initial?.id ? 'Simpan Perubahan' : 'Buat Karya'}
        </Button>
      </aside>
    </form>
  )
}
