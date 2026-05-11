import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { ArticleForm } from '@/components/admin/article-form'

export const dynamic = 'force-dynamic'
export default async function NewArticlePage() {
  await requirePermissionPage('artikel:create')
  return <div><AdminPageHeader title="Tulis Artikel Baru" /><ArticleForm /></div>
}
