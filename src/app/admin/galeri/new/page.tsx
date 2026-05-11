import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { ArtworkForm } from '@/components/admin/artwork-form'

export const dynamic = 'force-dynamic'

export default async function NewArtworkPage() {
  await requirePermissionPage('galeri:create')
  return (
    <div>
      <AdminPageHeader title="Tambah Karya Baru" subtitle="Unggah karya untuk galeri publik." />
      <ArtworkForm />
    </div>
  )
}
