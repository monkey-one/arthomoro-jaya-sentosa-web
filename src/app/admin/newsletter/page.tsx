import { prisma } from '@/lib/prisma'
import { requireAdminSession } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminNewsletterPage() {
  await requireAdminSession()
  const subs = await prisma.subscriber.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <AdminPageHeader title="Newsletter Subscriber" subtitle={`${subs.length} subscriber terdaftar`} />
      <Table>
        <THead><Tr><Th>Email</Th><Th>Status</Th><Th>Tanggal Daftar</Th></Tr></THead>
        <tbody>
          {subs.map(s => (
            <Tr key={s.id}>
              <Td className="font-mono text-sm">{s.email}</Td>
              <Td><Badge variant={s.active ? 'green' : 'default'}>{s.active ? 'Aktif' : 'Nonaktif'}</Badge></Td>
              <Td className="text-xs text-ink-secondary">{formatDate(s.createdAt)}</Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
