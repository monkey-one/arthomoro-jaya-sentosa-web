import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/site/page-header'
import { Badge } from '@/components/ui/badge'
import { formatDate, isUploadedAsset } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function ArtikelPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const where: any = { published: true }
  if (searchParams.kategori) where.category = searchParams.kategori
  if (searchParams.q) where.OR = [{ title: { contains: searchParams.q } }, { excerpt: { contains: searchParams.q } }]
  const articles = await prisma.article.findMany({ where, orderBy: { publishedAt: 'desc' }, take: 30 })
  const categories = Array.from(new Set(articles.map(a => a.category)))

  return (
    <>
      <PageHeader title="Artikel & Inspirasi" subtitle="Panduan, tips, dan cerita di balik dunia seni patung — disusun oleh tim pengrajin Arthomoro." breadcrumb={[{ label: 'Artikel' }]} />

      <section className="py-10">
        <div className="container grid gap-8 lg:grid-cols-[1fr,280px]">
          <div>
            <form className="mb-6 flex gap-2" action="/artikel">
              <input name="q" defaultValue={searchParams.q || ''} placeholder="Cari artikel…" className="h-11 w-full rounded-md border border-line bg-bg-card px-3 text-sm" />
              <button type="submit" className="h-11 rounded-md bg-accent-gold px-5 text-sm font-medium text-bg-primary hover:brightness-110">Cari</button>
            </form>

            <div className="grid gap-6 md:grid-cols-2">
              {articles.map(a => (
                <Link key={a.id} href={`/artikel/${a.slug}`} className="card-hover overflow-hidden rounded-lg border border-line bg-bg-card">
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <Image src={a.coverImage} alt={a.title} fill className="object-cover transition-transform duration-700 group-hover:scale-105" unoptimized={isUploadedAsset(a.coverImage)} />
                  </div>
                  <div className="p-5">
                    <Badge variant="gold">{a.category}</Badge>
                    <h3 className="mt-3 font-display text-xl leading-tight line-clamp-2">{a.title}</h3>
                    <p className="mt-2 text-sm text-ink-secondary line-clamp-3">{a.excerpt}</p>
                    <div className="mt-4 flex items-center gap-3 text-xs text-ink-secondary">
                      <span>{a.author}</span><span>·</span>
                      <span>{formatDate(a.publishedAt, { day:'numeric', month:'short', year:'numeric' })}</span>
                      <span>·</span><span>{a.readMinutes} mnt baca</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="rounded-lg border border-line bg-bg-card p-5">
              <h4 className="font-cinzel text-xs tracking-[0.28em] text-accent-gold">KATEGORI</h4>
              <ul className="mt-3 space-y-1.5 text-sm">
                <li><Link href="/artikel" className="text-ink-secondary hover:text-accent-highlight">Semua</Link></li>
                {categories.map(c => (
                  <li key={c}><Link href={`/artikel?kategori=${encodeURIComponent(c)}`} className="text-ink-secondary hover:text-accent-highlight">{c}</Link></li>
                ))}
              </ul>
            </div>

            <div className="mt-6 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-5">
              <h4 className="font-display text-lg">Konsultasi Pre-Order</h4>
              <p className="mt-2 text-sm text-ink-secondary">Diskusikan visi karya Anda dengan tim pengrajin kami — gratis.</p>
              <Link href="/pre-order" className="mt-4 inline-flex h-10 items-center justify-center rounded-md bg-accent-gold px-5 text-sm font-medium text-bg-primary hover:brightness-110">Mulai Sekarang →</Link>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
