import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/site/page-header'
import { ArtworkCard } from '@/components/site/artwork-card'
import { Badge } from '@/components/ui/badge'
import { HelpHint } from '@/components/ui/tooltip'

export const dynamic = 'force-dynamic'

const CATEGORIES = ['Patung Wajah','Patung Figur','Patung Abstrak','Patung Monumental','Relief','Patung Hewan']
const MATERIALS  = ['Marmer','Perunggu','Kayu','Resin','Granit','Mixed Media']
const SIZES      = ['Miniatur','Meja','Manusia','Monumental']

export default async function GaleriPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const where: any = { published: true }
  if (searchParams.kategori) where.category = searchParams.kategori
  if (searchParams.material) where.material = searchParams.material
  if (searchParams.ukuran) where.sizeLabel = searchParams.ukuran
  if (searchParams.q) where.OR = [
    { title: { contains: searchParams.q } },
    { description: { contains: searchParams.q } },
  ]

  let orderBy: any = { createdAt: 'desc' }
  if (searchParams.sort === 'popular') orderBy = { views: 'desc' }
  if (searchParams.sort === 'az') orderBy = { title: 'asc' }

  const items = await prisma.artwork.findMany({ where, orderBy, take: 60 })

  return (
    <>
      <PageHeader title="Galeri Karya" subtitle="Setiap karya di galeri ini dapat dipesan dengan dimensi & material serupa. Klik untuk melihat detail dan estimasi harga." breadcrumb={[{ label: 'Galeri' }]} />

      <section className="py-10">
        <div className="container">
          {/* Filter bar */}
          <div className="mb-8 rounded-lg border border-line bg-bg-card p-4">
            <form className="grid gap-3 sm:grid-cols-2 md:grid-cols-5" action="/galeri">
              <FilterSelect name="kategori" label="Kategori" value={searchParams.kategori} options={CATEGORIES} hint="Saring berdasarkan jenis patung. Tip: 'Wajah' untuk bust personal, 'Monumental' untuk ruang publik." />
              <FilterSelect name="material" label="Material" value={searchParams.material} options={MATERIALS} hint="Marmer = elegan klasik · Perunggu = monumental tahan lama · Resin = ringan dan terjangkau." />
              <FilterSelect name="ukuran" label="Ukuran" value={searchParams.ukuran} options={SIZES} hint="Miniatur (≤40cm) · Meja (40-90cm) · Manusia (90-200cm) · Monumental (≥200cm)." />
              <FilterSelect name="sort" label="Urutkan" value={searchParams.sort} options={[{label:'Terbaru',value:'new'},{label:'Terpopuler',value:'popular'},{label:'A–Z',value:'az'}]} />
              <div className="flex items-end gap-2">
                <input name="q" defaultValue={searchParams.q || ''} placeholder="Cari karya…" className="h-11 w-full rounded-md border border-line bg-bg-secondary px-3 text-sm" />
                <button type="submit" className="h-11 rounded-md bg-accent-gold px-4 text-sm font-medium text-bg-primary hover:brightness-110">Cari</button>
              </div>
            </form>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <Badge variant="outline">{items.length} karya ditemukan</Badge>
              {searchParams.kategori && <Link href="/galeri" className="rounded-full border border-line px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-ink-secondary hover:text-accent-highlight">✕ Reset filter</Link>}
            </div>
          </div>

          {items.length === 0 ? (
            <div className="rounded-lg border border-dashed border-line bg-bg-card/50 p-12 text-center">
              <p className="text-ink-secondary">Tidak ada karya yang cocok. Coba reset filter atau <Link href="/pre-order" className="text-accent-highlight underline">pesan custom</Link>.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {items.map((a, i) => <ArtworkCard key={a.id} a={a as any} priority={i < 4} />)}
            </div>
          )}
        </div>
      </section>
    </>
  )
}

function FilterSelect({ name, label, value, options, hint }: { name: string; label: string; value?: string; options: (string | { label: string; value: string })[]; hint?: string }) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1.5 text-[10px] font-medium uppercase tracking-[0.22em] text-ink-secondary">
        {label}
        {hint && <HelpHint text={hint} />}
      </span>
      <select name={name} defaultValue={value || ''} className="h-11 w-full rounded-md border border-line bg-bg-secondary px-3 text-sm">
        <option value="">Semua</option>
        {options.map(o => {
          const v = typeof o === 'string' ? o : o.value
          const l = typeof o === 'string' ? o : o.label
          return <option key={v} value={v}>{l}</option>
        })}
      </select>
    </label>
  )
}
