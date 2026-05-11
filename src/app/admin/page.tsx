import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { formatIDRShort, formatDate } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Image as ImageIcon, ShoppingBag, MessageSquare, Calendar, AlertTriangle, ArrowRight } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminDashboardPage() {
  const [artworkCount, activePreOrders, newInquiries, todayBookings, latestInquiries, activeOrders] = await Promise.all([
    prisma.artwork.count({ where: { published: true } }),
    prisma.preOrder.count({ where: { status: { notIn: ['DONE', 'CANCELLED'] } } }),
    prisma.inquiry.count({ where: { status: 'NEW' } }),
    prisma.booking.count({ where: { date: { gte: new Date(new Date().setHours(0,0,0,0)) }, status: { in: ['PENDING','CONFIRMED'] } } }),
    prisma.inquiry.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.preOrder.findMany({ where: { status: { notIn: ['DONE','CANCELLED'] } }, orderBy: { createdAt: 'desc' }, take: 5 }),
  ])

  const totalRevenue = await prisma.preOrder.aggregate({
    _sum: { estimateMax: true },
    where: { status: { in: ['DEAL','PRODUCTION','FINISHING','READY','DONE'] } },
  })

  return (
    <div>
      <header className="mb-6">
        <h1 className="font-display text-3xl">Dashboard</h1>
        <p className="mt-1 text-sm text-ink-secondary">Ringkasan aktivitas Arthomoro Jaya Sentosa hari ini.</p>
      </header>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Karya Galeri" value={String(artworkCount)} icon={ImageIcon} href="/admin/galeri" />
        <StatCard label="Pre-Order Aktif" value={String(activePreOrders)} icon={ShoppingBag} href="/admin/preorder" highlight />
        <StatCard label="Pesan Baru" value={String(newInquiries)} icon={MessageSquare} href="/admin/pesan" highlight={newInquiries > 0} />
        <StatCard label="Booking Hari Ini" value={String(todayBookings)} icon={Calendar} href="/admin/booking" />
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <div className="rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-accent-highlight">Estimasi Nilai Pipeline</p>
          <p className="mt-2 font-display text-3xl text-accent-highlight">{formatIDRShort(totalRevenue._sum.estimateMax)}</p>
          <p className="mt-1 text-xs text-ink-secondary">Total estimasi nilai pre-order yang sudah deal &amp; dalam produksi</p>
        </div>
        <div className="rounded-lg border border-line bg-bg-card p-5">
          <p className="text-xs uppercase tracking-[0.28em] text-ink-secondary">Cepat Akses</p>
          <div className="mt-3 flex flex-wrap gap-2">
            <Link href="/admin/galeri/new" className="rounded-md border border-line bg-bg-secondary px-3 py-1.5 text-xs hover:border-accent-gold">+ Upload Karya</Link>
            <Link href="/admin/artikel/new" className="rounded-md border border-line bg-bg-secondary px-3 py-1.5 text-xs hover:border-accent-gold">+ Tulis Artikel</Link>
            <Link href="/admin/preorder" className="rounded-md border border-line bg-bg-secondary px-3 py-1.5 text-xs hover:border-accent-gold">Lihat Pipeline</Link>
            <Link href="/admin/setting" className="rounded-md border border-line bg-bg-secondary px-3 py-1.5 text-xs hover:border-accent-gold">Pengaturan</Link>
          </div>
        </div>
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        {/* Latest inquiries */}
        <section className="rounded-lg border border-line bg-bg-card">
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-display text-lg">Pesan Terbaru</h2>
            <Link href="/admin/pesan" className="text-xs text-ink-secondary hover:text-accent-highlight">Lihat semua <ArrowRight className="inline h-3 w-3" /></Link>
          </header>
          {latestInquiries.length === 0 ? (
            <p className="p-5 text-sm text-ink-secondary">Belum ada pesan.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {latestInquiries.map(i => (
                <li key={i.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{i.name}</p>
                    <p className="text-xs text-ink-secondary">{i.purpose} · {formatDate(i.createdAt, { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</p>
                  </div>
                  <StatusBadge status={i.status} />
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Active orders */}
        <section className="rounded-lg border border-line bg-bg-card">
          <header className="flex items-center justify-between border-b border-line px-5 py-3">
            <h2 className="font-display text-lg">Pre-Order Aktif</h2>
            <Link href="/admin/preorder" className="text-xs text-ink-secondary hover:text-accent-highlight">Lihat semua <ArrowRight className="inline h-3 w-3" /></Link>
          </header>
          {activeOrders.length === 0 ? (
            <p className="p-5 text-sm text-ink-secondary">Belum ada pre-order aktif.</p>
          ) : (
            <ul className="divide-y divide-line/60">
              {activeOrders.map(o => (
                <li key={o.id} className="flex items-center justify-between gap-3 px-5 py-3">
                  <div>
                    <p className="text-sm font-medium">{o.code} · {o.customerName}</p>
                    <p className="text-xs text-ink-secondary">{o.sculptureType} · {o.material} · {formatIDRShort(o.estimateMax)}</p>
                  </div>
                  <StatusBadge status={o.status} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  )
}

function StatCard({ label, value, icon: Icon, href, highlight }: { label: string; value: string; icon: any; href: string; highlight?: boolean }) {
  return (
    <Link href={href} className={`group rounded-lg border bg-bg-card p-5 transition-colors ${highlight ? 'border-accent-gold/40' : 'border-line hover:border-accent-gold/40'}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.22em] text-ink-secondary">{label}</span>
        <Icon className={`h-4 w-4 ${highlight ? 'text-accent-highlight' : 'text-ink-secondary group-hover:text-accent-gold'}`} />
      </div>
      <p className="mt-2 font-display text-3xl">{value}</p>
    </Link>
  )
}

function StatusBadge({ status }: { status: string }) {
  const map: Record<string, any> = {
    NEW: 'red', READ: 'blue', IN_PROGRESS: 'gold', DONE: 'green', REJECTED: 'default',
    INQUIRY: 'blue', CONSULT: 'blue', QUOTED: 'gold', NEGOTIATE: 'gold', DEAL: 'green',
    PRODUCTION: 'gold', FINISHING: 'gold', READY: 'green', CANCELLED: 'red',
  }
  return <Badge variant={map[status] || 'default'}>{status}</Badge>
}
