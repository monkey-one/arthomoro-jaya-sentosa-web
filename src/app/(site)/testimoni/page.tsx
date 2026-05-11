import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/site/page-header'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Quote, Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function TestimoniPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  const where: any = { status: 'APPROVED' }
  if (searchParams.kategori) where.category = searchParams.kategori
  const items = await prisma.testimonial.findMany({ where, orderBy: { createdAt: 'desc' }, take: 50 })
  const categories = Array.from(new Set(items.map(t => t.category).filter(Boolean) as string[]))

  return (
    <>
      <PageHeader title="Testimoni Klien" subtitle="Cerita nyata dari kolektor, instansi, dan keluarga yang telah mempercayakan karya kepada kami." breadcrumb={[{ label: 'Testimoni' }]} />

      <section className="py-10">
        <div className="container">
          <div className="mb-8 flex flex-wrap items-center gap-2">
            <Link href="/testimoni" className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider ${!searchParams.kategori ? 'border-accent-gold text-accent-highlight' : 'border-line text-ink-secondary hover:text-accent-highlight'}`}>Semua</Link>
            {categories.map(c => (
              <Link key={c} href={`/testimoni?kategori=${encodeURIComponent(c)}`} className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider ${searchParams.kategori === c ? 'border-accent-gold text-accent-highlight' : 'border-line text-ink-secondary hover:text-accent-highlight'}`}>{c}</Link>
            ))}
          </div>

          <div className="columns-1 gap-6 md:columns-2 lg:columns-3">
            {items.map(t => (
              <article key={t.id} className="mb-6 break-inside-avoid rounded-lg border border-line bg-bg-card p-6">
                <Quote className="h-7 w-7 text-accent-gold/40" />
                <div className="mt-2 flex gap-0.5">{[...Array(t.rating)].map((_,i)=> <Star key={i} className="h-4 w-4 fill-accent-gold text-accent-gold" />)}</div>
                <p className="mt-3 font-serif text-lg italic leading-relaxed">"{t.message}"</p>
                <div className="mt-5 flex items-center justify-between gap-3">
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-xs text-ink-secondary">{t.position}{t.city ? ` · ${t.city}` : ''}</p>
                  </div>
                  {t.verifiedOrder && <Badge variant="green">✓ Verified</Badge>}
                </div>
                {t.category && <div className="mt-3"><Badge variant="outline">{t.category}</Badge></div>}
              </article>
            ))}
          </div>

          <div className="mt-12 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-8 text-center">
            <h3 className="font-display text-2xl">Jadilah Klien Kami Berikutnya</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-secondary">Bergabunglah dengan ratusan kolektor & institusi yang sudah mempercayakan karya patung kepada kami.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild><Link href="/pre-order">Mulai Pre-Order</Link></Button>
              <Button asChild variant="outline"><Link href="/galeri">Lihat Galeri</Link></Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
