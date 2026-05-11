import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { ProjectForm } from '@/components/admin/project-form'

export const dynamic = 'force-dynamic'
export default async function EditProjectPage({ params }: { params: { id: string } }) {
  await requirePermissionPage('portofolio:edit')
  const p = await prisma.project.findUnique({ where: { id: params.id } })
  if (!p) notFound()
  return <div><AdminPageHeader title={`Edit: ${p.title}`} /><ProjectForm initial={p} /></div>
}
