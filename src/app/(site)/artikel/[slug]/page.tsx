import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/site/page-header'
import { Badge } from '@/components/ui/badge'
import { formatDate, isUploadedAsset } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { ChevronRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function ArticleDetailPage({ params }: { params: { slug: string } }) {
  const article = await prisma.article.findUnique({ where: { slug: params.slug } })
  if (!article) notFound()
  prisma.article.update({ where: { id: article.id }, data: { views: { increment: 1 } } }).catch(()=>{})
  const related = await prisma.article.findMany({ where: { published: true, id: { not: article.id }, category: article.category }, take: 3 })

  return (
    <>
      <PageHeader title={article.title} breadcrumb={[{ label: 'Artikel', href: '/artikel' }, { label: article.title }]} />

      <article className="py-12">
        <div className="container max-w-3xl">
          <div className="mb-6 flex flex-wrap items-center gap-3 text-sm text-ink-secondary">
            <Badge variant="gold">{article.category}</Badge>
            <span>{article.author}</span><span>·</span>
            <span>{formatDate(article.publishedAt, { day:'numeric', month:'long', year:'numeric' })}</span>
            <span>·</span><span>{article.readMinutes} menit baca</span>
          </div>

          <div className="relative mb-8 aspect-[16/9] overflow-hidden rounded-lg border border-line">
            <Image src={article.coverImage} alt={article.title} fill priority className="object-cover" unoptimized={isUploadedAsset(article.coverImage)} />
          </div>

          <div className="prose-art" dangerouslySetInnerHTML={{ __html: article.content }} />

          <div className="mt-12 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-8 text-center">
            <h3 className="font-display text-2xl">Tertarik dengan Karya Custom?</h3>
            <p className="mx-auto mt-2 max-w-xl text-sm text-ink-secondary">Konsultasi gratis dengan tim pengrajin kami. Wujudkan visi seni Anda menjadi karya yang abadi.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <Button asChild><Link href="/pre-order">Pesan Custom <ChevronRight className="h-4 w-4" /></Link></Button>
              <Button asChild variant="outline"><Link href="/booking">Booking Konsultasi</Link></Button>
            </div>
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-line/60 bg-bg-secondary py-12">
          <div className="container">
            <h2 className="mb-6 font-display text-2xl">Artikel Terkait</h2>
            <div className="grid gap-5 md:grid-cols-3">
              {related.map(r => (
                <Link key={r.id} href={`/artikel/${r.slug}`} className="card-hover overflow-hidden rounded-lg border border-line bg-bg-card">
                  <div className="relative aspect-[16/10]"><Image src={r.coverImage} alt={r.title} fill className="object-cover" unoptimized={isUploadedAsset(r.coverImage)} /></div>
                  <div className="p-4">
                    <p className="font-display text-base leading-tight line-clamp-2">{r.title}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  )
}
