import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/site/page-header'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function PortofolioPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const where: any = { published: true }
  if (searchParams.kategori) where.category = searchParams.kategori
  if (searchParams.tahun) where.year = Number(searchParams.tahun)
  if (searchParams.tipe) where.clientType = searchParams.tipe

  const projects = await prisma.project.findMany({ where, orderBy: { year: 'desc' }, take: 60 })
  const years = Array.from(new Set(projects.map(p => p.year))).sort((a,b) => b-a)
  const categories = Array.from(new Set(projects.map(p => p.category)))
  const types = ['Pemerintah','Swasta','Personal']

  return (
    <>
      <PageHeader title="Portofolio Proyek" subtitle="Proyek-proyek yang telah kami selesaikan untuk institusi, korporat, dan kolektor pribadi." breadcrumb={[{ label: 'Portofolio' }]} />

      <section className="py-10">
        <div className="container">
          <form className="mb-8 grid gap-3 rounded-lg border border-line bg-bg-card p-4 sm:grid-cols-3" action="/portofolio">
            <Filter name="tahun" label="Tahun" value={searchParams.tahun} options={years.map(String)} />
            <Filter name="kategori" label="Kategori" value={searchParams.kategori} options={categories} />
            <Filter name="tipe" label="Tipe Klien" value={searchParams.tipe} options={types} />
          </form>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {projects.map(p => (
              <Link key={p.id} href={`/portofolio/${p.slug}`} className="card-hover group overflow-hidden rounded-lg border border-line bg-bg-card">
                <div className="relative aspect-[16/10] overflow-hidden">
                  <Image src={p.coverImage} alt={p.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 to-transparent" />
                  <div className="absolute left-3 top-3"><Badge variant="gold">{p.clientType}</Badge></div>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg leading-tight">{p.title}</h3>
                  <p className="mt-1 text-xs text-ink-secondary">{p.client} · {p.location} · {p.year}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-[10px] uppercase tracking-wider text-ink-secondary">
                    <Badge variant="outline">{p.category}</Badge>
                    <Badge variant="outline">{p.material}</Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}

function Filter({ name, label, value, options }: { name: string; label: string; value?: string; options: string[] }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[10px] font-medium uppercase tracking-[0.22em] text-ink-secondary">{label}</span>
      <select name={name} defaultValue={value || ''} className="h-11 w-full rounded-md border border-line bg-bg-secondary px-3 text-sm">
        <option value="">Semua</option>
        {options.map(o => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
