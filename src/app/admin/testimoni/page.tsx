import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { DeleteButton } from '@/components/admin/delete-button'
import { Badge } from '@/components/ui/badge'
import { TestimonialActions } from '@/components/admin/testimonial-actions'
import { Star } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminTestimoniPage() {
  await requirePermissionPage('testimoni:view')
  const items = await prisma.testimonial.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <AdminPageHeader title="Testimoni Klien" subtitle={`${items.length} testimoni total`} />
      <Table>
        <THead><Tr><Th>Klien</Th><Th>Rating</Th><Th>Pesan</Th><Th>Kategori</Th><Th>Status</Th><Th>Aksi</Th></Tr></THead>
        <tbody>
          {items.map(t => (
            <Tr key={t.id}>
              <Td>
                <p className="font-medium">{t.name}</p>
                <p className="text-xs text-ink-secondary">{t.position}{t.city ? ` · ${t.city}` : ''}</p>
              </Td>
              <Td><div className="flex gap-0.5">{[...Array(t.rating)].map((_,i)=> <Star key={i} className="h-3 w-3 fill-accent-gold text-accent-gold" />)}</div></Td>
              <Td className="max-w-md"><p className="line-clamp-3 text-sm text-ink-secondary">{t.message}</p></Td>
              <Td>{t.category}</Td>
              <Td>
                <div className="flex flex-col gap-1">
                  <Badge variant={t.status === 'APPROVED' ? 'green' : t.status === 'REJECTED' ? 'red' : 'default'}>{t.status}</Badge>
                  {t.featured && <Badge variant="gold">★</Badge>}
                  {t.verifiedOrder && <Badge variant="green">✓ Verified</Badge>}
                </div>
              </Td>
              <Td><TestimonialActions id={t.id} status={t.status} featured={!!t.featured} verified={!!t.verifiedOrder} /></Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
