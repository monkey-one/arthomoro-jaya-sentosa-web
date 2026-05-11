import Link from 'next/link'
import Image from 'next/image'
import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { DeleteButton } from '@/components/admin/delete-button'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'
import { Edit3, Eye } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminArtikelPage() {
  await requirePermissionPage('artikel:view')
  const items = await prisma.article.findMany({ orderBy: { createdAt: 'desc' } })
  return (
    <div>
      <AdminPageHeader title="Artikel" subtitle={`${items.length} artikel total`} action={{ href: '/admin/artikel/new', label: 'Tulis Artikel' }} />
      <Table>
        <THead><Tr><Th>Artikel</Th><Th>Kategori</Th><Th>Author</Th><Th>Status</Th><Th>Tanggal</Th><Th>Dilihat</Th><Th>Aksi</Th></Tr></THead>
        <tbody>
          {items.map(a => (
            <Tr key={a.id}>
              <Td>
                <div className="flex items-center gap-3">
                  <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border border-line"><Image src={a.coverImage} alt={a.title} fill sizes="64px" className="object-cover" /></div>
                  <p className="font-medium">{a.title}</p>
                </div>
              </Td>
              <Td>{a.category}</Td><Td>{a.author}</Td>
              <Td><Badge variant={a.published ? 'green' : 'default'}>{a.published ? 'Published' : 'Draft'}</Badge></Td>
              <Td className="text-xs text-ink-secondary">{formatDate(a.publishedAt || a.createdAt)}</Td>
              <Td>{a.views}</Td>
              <Td>
                <div className="flex gap-2">
                  <Link href={`/artikel/${a.slug}`} target="_blank" className="rounded-md border border-line p-1.5 hover:border-accent-gold"><Eye className="h-3 w-3" /></Link>
                  <Link href={`/admin/artikel/${a.id}`} className="rounded-md border border-line p-1.5 hover:border-accent-gold"><Edit3 className="h-3 w-3" /></Link>
                  <DeleteButton url={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/article/${a.id}`} />
                </div>
              </Td>
            </Tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
