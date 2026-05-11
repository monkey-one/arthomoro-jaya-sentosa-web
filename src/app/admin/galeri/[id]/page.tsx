import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { ArtworkForm } from '@/components/admin/artwork-form'

export const dynamic = 'force-dynamic'

export default async function EditArtworkPage({ params }: { params: { id: string } }) {
  await requirePermissionPage('galeri:edit')
  const art = await prisma.artwork.findUnique({ where: { id: params.id } })
  if (!art) notFound()
  return (
    <div>
      <AdminPageHeader title={`Edit: ${art.title}`} subtitle="Perbarui informasi karya." />
      <ArtworkForm initial={art} />
    </div>
  )
}
