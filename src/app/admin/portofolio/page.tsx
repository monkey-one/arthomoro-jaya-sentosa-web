import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { DeleteButton } from '@/components/admin/delete-button'
import { Badge } from '@/components/ui/badge'
import { Edit3, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminPortofolioPage() {
  await requirePermissionPage('portofolio:view')
  const items = await prisma.project.findMany({ orderBy: { year: 'desc' } })
  return (
    <div>
      <AdminPageHeader title="Portofolio Proyek" subtitle={`${items.length} proyek`} action={{ href: '/admin/portofolio/new', label: 'Tambah Proyek' }} />
      <Table>
        <THead><Tr><Th>Proyek</Th><Th>Klien</Th><Th>Lokasi</Th><Th>Tahun</Th><Th>Status</Th><Th>Aksi</Th></Tr></THead>
        <tbody>
          {items.map(p => (
            <Tr key={p.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-line"><Image src={p.coverImage} alt={p.title} fill sizes="64px" className="object-cover" /></div>
                  <p className="font-medium">{p.title}</p>
                </div>
              </Td>
              <Td>{p.client} <Badge variant="outline" className="ml-1">{p.clientType}</Badge></Td>
              <Td>{p.location}</Td><Td>{p.year}</Td>
              <Td><Badge variant={p.published ? 'green' : 'default'}>{p.published ? 'Published' : 'Draft'}</Badge>{p.featured && <Badge variant="gold" className="ml-1">★</Badge>}</Td>
              <Td>
                <div className="flex gap-2">
                  <Link href={`/portofolio/${p.slug}`} target="_blank" className="rounded-md border border-line p-1.5 hover:border-accent-gold"><Eye className="h-3 w-3" /></Link>
                  <Link href={`/admin/portofolio/${p.id}`} className="rounded-md border border-line p-1.5 hover:border-accent-gold"><Edit3 className="h-3 w-3" /></Link>
                  <DeleteButton url={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/project/${p.id}`} />
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
