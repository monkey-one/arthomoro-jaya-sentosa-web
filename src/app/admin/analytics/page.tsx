import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { formatIDRShort } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export const dynamic = 'force-dynamic'

export default async function AdminAnalyticsPage() {
  await requirePermissionPage('analytics:view')

  const [topArtworks, topArticles, inquiriesByPurpose, ordersByStatus, totalPipeline] = await Promise.all([
    prisma.artwork.findMany({ orderBy: { views: 'desc' }, take: 5, select: { id: true, title: true, views: true, category: true, likes: true } }),
    prisma.article.findMany({ orderBy: { views: 'desc' }, take: 5, select: { id: true, title: true, views: true, category: true } }),
    prisma.inquiry.groupBy({ by: ['purpose'], _count: { purpose: true } }),
    prisma.preOrder.groupBy({ by: ['status'], _count: { status: true }, _sum: { estimateMax: true } }),
    prisma.preOrder.aggregate({ _sum: { estimateMax: true }, where: { status: { in: ['DEAL','PRODUCTION','FINISHING','READY','DONE'] } } }),
  ])

  return (
    <div>
      <AdminPageHeader title="Analitik" subtitle="Ringkasan performa konten dan funnel pre-order." />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-lg">Karya Paling Banyak Dilihat</h3>
          <ul className="mt-4 divide-y divide-line/40">
            {topArtworks.map((a, i) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div><span className="mr-2 text-ink-secondary">#{i+1}</span>{a.title}<span className="ml-2 text-xs text-ink-secondary">({a.category})</span></div>
                <div className="text-right"><span className="font-mono text-accent-highlight">{a.views}</span> <span className="text-xs text-ink-secondary">views · ♥ {a.likes}</span></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-lg">Artikel Terpopuler</h3>
          <ul className="mt-4 divide-y divide-line/40">
            {topArticles.map((a, i) => (
              <li key={a.id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                <div><span className="mr-2 text-ink-secondary">#{i+1}</span>{a.title}<span className="ml-2 text-xs text-ink-secondary">({a.category})</span></div>
                <div className="text-right text-accent-highlight"><span className="font-mono">{a.views}</span> <span className="text-xs text-ink-secondary">views</span></div>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-line bg-bg-card p-5">
          <h3 className="font-display text-lg">Inquiry per Keperluan</h3>
          <ul className="mt-4 space-y-2 text-sm">
            {inquiriesByPurpose.map((g: any) => (
              <li key={g.purpose} className="flex items-center justify-between">
                <span>{g.purpose}</span>
                <Badge variant="gold">{g._count.purpose}</Badge>
              </li>
            ))}
          </ul>
        </section>

        <section className="rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-5">
          <h3 className="font-display text-lg">Pipeline Nilai Pre-Order</h3>
          <p className="mt-2 font-display text-3xl text-accent-highlight">{formatIDRShort(totalPipeline._sum.estimateMax)}</p>
          <p className="text-xs text-ink-secondary">Total estimasi nilai dari pesanan deal &amp; produksi.</p>

          <ul className="mt-5 space-y-2 text-sm">
            {ordersByStatus.map((g: any) => (
              <li key={g.status} className="flex items-center justify-between border-b border-line/40 pb-1.5">
                <span>{g.status}</span>
                <span><span className="mr-2 text-ink-secondary">{g._count.status} order</span><span className="font-mono text-accent-highlight">{formatIDRShort(g._sum.estimateMax)}</span></span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}
