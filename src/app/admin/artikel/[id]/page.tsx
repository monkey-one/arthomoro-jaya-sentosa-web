import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { ArticleForm } from '@/components/admin/article-form'

export const dynamic = 'force-dynamic'
export default async function EditArticlePage({ params }: { params: { id: string } }) {
  await requirePermissionPage('artikel:edit')
  const a = await prisma.article.findUnique({ where: { id: params.id } })
  if (!a) notFound()
  return <div><AdminPageHeader title={`Edit: ${a.title}`} /><ArticleForm initial={a} /></div>
}
