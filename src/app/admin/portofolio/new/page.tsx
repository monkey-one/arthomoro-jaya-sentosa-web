import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { ProjectForm } from '@/components/admin/project-form'

export const dynamic = 'force-dynamic'
export default async function NewProjectPage() {
  await requirePermissionPage('portofolio:create')
  return <div><AdminPageHeader title="Tambah Proyek Portofolio" /><ProjectForm /></div>
}
