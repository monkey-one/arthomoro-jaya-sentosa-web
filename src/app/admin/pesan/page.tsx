import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { Badge } from '@/components/ui/badge'
import { formatDate, waLink } from '@/lib/utils'
import { ExternalLink, MessageCircle, Eye } from 'lucide-react'
import { InquiryStatusSelect } from '@/components/admin/inquiry-status-select'

export const dynamic = 'force-dynamic'

export default async function AdminInquiriesPage({ searchParams }: { searchParams: Record<string,string|undefined> }) {
  await requirePermissionPage('pesan:view')
  const where: any = {}
  if (searchParams.status) where.status = searchParams.status
  const items = await prisma.inquiry.findMany({ where, orderBy: { createdAt: 'desc' } })

  const counts = {
    all: await prisma.inquiry.count(),
    NEW: await prisma.inquiry.count({ where: { status: 'NEW' } }),
    IN_PROGRESS: await prisma.inquiry.count({ where: { status: 'IN_PROGRESS' } }),
    DONE: await prisma.inquiry.count({ where: { status: 'DONE' } }),
  }

  return (
    <div>
      <AdminPageHeader title="Pesan Masuk" subtitle={`${counts.all} pesan total · ${counts.NEW} baru`} />

      <div className="mb-4 flex flex-wrap gap-2">
        <FilterPill href="/admin/pesan" active={!searchParams.status} label={`Semua (${counts.all})`} />
        <FilterPill href="/admin/pesan?status=NEW" active={searchParams.status === 'NEW'} label={`Baru (${counts.NEW})`} />
        <FilterPill href="/admin/pesan?status=IN_PROGRESS" active={searchParams.status === 'IN_PROGRESS'} label={`Diproses (${counts.IN_PROGRESS})`} />
        <FilterPill href="/admin/pesan?status=DONE" active={searchParams.status === 'DONE'} label={`Selesai (${counts.DONE})`} />
      </div>

      <Table>
        <THead><Tr><Th>Dari</Th><Th>Keperluan</Th><Th>Pesan</Th><Th>Status</Th><Th>Waktu</Th><Th>Aksi</Th></Tr></THead>
        <tbody>
          {items.map(i => (
            <Tr key={i.id}>
              <Td>
                <p className="font-medium">{i.name}</p>
                <p className="text-xs text-ink-secondary">{i.email}</p>
                <p className="text-xs text-ink-secondary">{i.whatsapp}</p>
              </Td>
              <Td>
                <p>{i.purpose}</p>
                {i.interest && <p className="text-xs text-ink-secondary">{i.interest}</p>}
                {i.budget && <p className="text-xs text-ink-secondary">Budget: {i.budget}</p>}
              </Td>
              <Td className="max-w-md"><p className="line-clamp-3 text-sm text-ink-secondary">{i.message}</p></Td>
              <Td><InquiryStatusSelect id={i.id} value={i.status} /></Td>
              <Td className="whitespace-nowrap text-xs text-ink-secondary">{formatDate(i.createdAt, { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</Td>
              <Td>
                <div className="flex gap-2">
                  <a href={waLink(`Halo ${i.name}, terima kasih telah menghubungi Arthomoro Jaya Sentosa terkait ${i.purpose}.`, i.whatsapp)} target="_blank" rel="noreferrer" className="rounded-md border border-line p-1.5 hover:border-accent-gold" title="Reply WA"><MessageCircle className="h-3 w-3 text-emerald-400" /></a>
                  <a href={`mailto:${i.email}`} className="rounded-md border border-line p-1.5 hover:border-accent-gold" title="Reply Email"><ExternalLink className="h-3 w-3" /></a>
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}

function FilterPill({ href, active, label }: { href: string; active: boolean; label: string }) {
  return <Link href={href} className={`rounded-full border px-4 py-1.5 text-xs uppercase tracking-wider ${active ? 'border-accent-gold text-accent-highlight' : 'border-line text-ink-secondary hover:text-accent-highlight'}`}>{label}</Link>
}
