import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { Badge } from '@/components/ui/badge'
import { formatDate, waLink } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'
import { BookingStatusSelect } from '@/components/admin/booking-status-select'

export const dynamic = 'force-dynamic'

export default async function AdminBookingPage() {
  await requirePermissionPage('booking:view')
  const items = await prisma.booking.findMany({ orderBy: { date: 'desc' } })
  return (
    <div>
      <AdminPageHeader title="Booking Konsultasi" subtitle={`${items.length} booking total`} />
      <Table>
        <THead><Tr><Th>Klien</Th><Th>Jadwal</Th><Th>Keperluan</Th><Th>Status</Th><Th>Aksi</Th></Tr></THead>
        <tbody>
          {items.map(b => (
            <Tr key={b.id}>
              <Td><p className="font-medium">{b.name}</p><p className="text-xs text-ink-secondary">{b.email}</p><p className="text-xs text-ink-secondary">{b.whatsapp}</p></Td>
              <Td><p>{formatDate(b.date, { weekday:'short', day:'numeric', month:'long' })}</p><p className="text-xs text-accent-highlight">{b.timeSlot} WIB</p></Td>
              <Td className="max-w-md text-sm text-ink-secondary">{b.purpose}</Td>
              <Td><BookingStatusSelect id={b.id} value={b.status} /></Td>
              <Td>
                <a href={waLink(`Halo ${b.name}, konfirmasi konsultasi pada ${formatDate(b.date)} jam ${b.timeSlot} WIB.`, b.whatsapp)} target="_blank" rel="noreferrer" className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-line text-emerald-400 hover:border-accent-gold"><MessageCircle className="h-3 w-3" /></a>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
