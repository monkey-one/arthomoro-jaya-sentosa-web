import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { Badge } from '@/components/ui/badge'
import { formatIDRShort, formatDate, waLink } from '@/lib/utils'
import { PreOrderStatusSelect } from '@/components/admin/preorder-status-select'
import { MessageCircle } from 'lucide-react'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { l: string; v: any }> = {
  INQUIRY:    { l: 'Inquiry',     v: 'blue' },
  CONSULT:    { l: 'Konsultasi',  v: 'blue' },
  QUOTED:     { l: 'Quoted',      v: 'gold' },
  NEGOTIATE:  { l: 'Negosiasi',   v: 'gold' },
  DEAL:       { l: 'Deal/DP',     v: 'green' },
  PRODUCTION: { l: 'Produksi',    v: 'gold' },
  FINISHING:  { l: 'Finishing',   v: 'gold' },
  READY:      { l: 'Siap Kirim',  v: 'green' },
  DONE:       { l: 'Selesai',     v: 'green' },
  CANCELLED:  { l: 'Dibatalkan',  v: 'red' },
}

export default async function AdminPreOrderPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  await requirePermissionPage('order:view')
  const where: any = {}
  if (searchParams.status) where.status = searchParams.status
  const items = await prisma.preOrder.findMany({ where, orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <AdminPageHeader title="Pipeline Pre-Order" subtitle={`${items.length} pesanan${searchParams.status ? ` · status ${searchParams.status}` : ''}`} />

      <div className="mb-4 flex flex-wrap gap-2 overflow-x-auto">
        {Object.entries(STATUS_LABELS).map(([key, val]) => (
          <a key={key} href={`?status=${key}`} className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-wider ${searchParams.status === key ? 'border-accent-gold text-accent-highlight' : 'border-line text-ink-secondary hover:text-accent-highlight'}`}>{val.l}</a>
        ))}
        <a href="/admin/preorder" className={`whitespace-nowrap rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-wider ${!searchParams.status ? 'border-accent-gold text-accent-highlight' : 'border-line text-ink-secondary hover:text-accent-highlight'}`}>Semua</a>
      </div>

      <Table>
        <THead><Tr><Th>Kode</Th><Th>Klien</Th><Th>Spesifikasi</Th><Th>Estimasi</Th><Th>Pembayaran</Th><Th>Status</Th><Th>Tanggal</Th><Th>Aksi</Th></Tr></THead>
        <tbody>
          {items.map(o => (
            <Tr key={o.id}>
              <Td className="font-mono text-xs text-accent-highlight">{o.code}</Td>
              <Td>
                <p className="font-medium">{o.customerName}</p>
                <p className="text-xs text-ink-secondary">{o.customerWa}</p>
              </Td>
              <Td>
                <p className="text-sm">{o.sculptureType}</p>
                <p className="text-xs text-ink-secondary">{o.material} · {o.sizeLabel}{o.heightCm ? ` (${o.heightCm}cm)` : ''}</p>
                {o.finishing && <p className="text-xs text-ink-secondary">Finishing: {o.finishing}</p>}
              </Td>
              <Td className="whitespace-nowrap">{formatIDRShort(o.estimateMin)} – {formatIDRShort(o.estimateMax)}</Td>
              <Td>
                <Badge variant={o.paymentStatus === 'PAID' ? 'green' : o.paymentStatus === 'DP_PAID' ? 'gold' : 'default'}>{o.paymentStatus}</Badge>
                {o.dpPercent ? <p className="mt-1 text-xs text-ink-secondary">DP {o.dpPercent}%</p> : null}
              </Td>
              <Td><PreOrderStatusSelect id={o.id} value={o.status} /></Td>
              <Td className="whitespace-nowrap text-xs text-ink-secondary">{formatDate(o.createdAt, { day:'numeric', month:'short', year:'numeric' })}</Td>
              <Td>
                <a href={waLink(`Halo ${o.customerName}, terima kasih atas pesanan ${o.code} (${o.sculptureType} ${o.material}). Tim Arthomoro akan menghubungi Anda untuk lanjutan.`, o.customerWa)} target="_blank" rel="noreferrer" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-emerald-400 hover:border-accent-gold"><MessageCircle className="h-3 w-3" /></a>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
