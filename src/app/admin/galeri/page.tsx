import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { DeleteButton } from '@/components/admin/delete-button'
import { Badge } from '@/components/ui/badge'
import { priceRange } from '@/lib/utils'
import { Edit3, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminGaleriPage() {
  await requirePermissionPage('galeri:view')
  const items = await prisma.artwork.findMany({ orderBy: { createdAt: 'desc' } })

  return (
    <div>
      <AdminPageHeader title="Galeri Karya" subtitle={`${items.length} karya total`} action={{ href: '/admin/galeri/new', label: 'Tambah Karya' }} />

      <Table>
        <THead>
          <Tr>
            <Th>Karya</Th><Th>Kategori</Th><Th>Material</Th><Th>Estimasi</Th>
            <Th>Status</Th><Th>Dilihat</Th><Th>Aksi</Th>
          </Tr>
        </THead>
        <tbody>
          {items.map(a => (
            <Tr key={a.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-md border border-line">
                    <Image src={a.coverImage} alt={a.title} fill sizes="48px" className="object-cover" />
                  </div>
                  <div>
                    <p className="font-medium text-ink-primary">{a.title}</p>
                    <p className="text-xs text-ink-secondary">{a.slug}</p>
                  </div>
                </div>
              </Td>
              <Td>{a.category}</Td>
              <Td>{a.material}</Td>
              <Td className="whitespace-nowrap">{priceRange(a.priceRangeMin, a.priceRangeMax)}</Td>
              <Td>
                <div className="flex flex-col gap-1">
                  <Badge variant={a.published ? 'green' : 'default'}>{a.published ? 'Published' : 'Draft'}</Badge>
                  {a.featured && <Badge variant="gold">★ Featured</Badge>}
                </div>
              </Td>
              <Td>{a.views}</Td>
              <Td>
                <div className="flex gap-2">
                  <Link href={`/galeri/${a.slug}`} target="_blank" className="rounded-md border border-line p-1.5 hover:border-accent-gold" title="Lihat"><Eye className="h-3 w-3" /></Link>
                  <Link href={`/admin/galeri/${a.id}`} className="rounded-md border border-line p-1.5 hover:border-accent-gold" title="Edit"><Edit3 className="h-3 w-3" /></Link>
                  <DeleteButton url={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/artwork/${a.id}`} />
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
