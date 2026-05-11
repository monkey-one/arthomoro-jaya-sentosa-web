import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { safeJSON } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { ShieldCheck } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function AdminRolesPage() {
  await requirePermissionPage('role:manage')
  const roles = await prisma.role.findMany({ include: { _count: { select: { users: true } } }, orderBy: { name: 'asc' } })

  return (
    <div>
      <AdminPageHeader title="Role & Hak Akses" subtitle="Kelola role pengguna dan hak akses (permission)." />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {roles.map(r => {
          const perms = safeJSON<string[]>(r.permissions, [])
          return (
            <div key={r.id} className="rounded-lg border border-line bg-bg-card p-5">
              <div className="flex items-start justify-between">
                <div>
                  <ShieldCheck className="h-6 w-6 text-accent-gold" />
                  <h3 className="mt-2 font-display text-lg">{r.name}</h3>
                  <p className="mt-1 text-xs text-ink-secondary">{r.description}</p>
                </div>
                <Badge variant="outline">{r._count.users} pengguna</Badge>
              </div>
              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wider text-ink-secondary">{perms.length} permission diberikan</p>
                <div className="mt-2 flex flex-wrap gap-1">
                  {perms.slice(0,8).map(p => <span key={p} className="rounded-md border border-line bg-bg-secondary/50 px-1.5 py-0.5 text-[10px] text-ink-secondary">{p}</span>)}
                  {perms.length > 8 && <span className="text-[10px] text-ink-secondary">+{perms.length - 8} lainnya</span>}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-8 rounded-lg border border-line bg-bg-card p-5">
        <h3 className="font-display text-lg">Catatan</h3>
        <p className="mt-2 text-sm text-ink-secondary">Role default yang tersedia: Super Admin, Admin, Editor, Marketing, CS, Photographer, Viewer. Manajemen role lanjutan (custom permission per role, duplikasi, edit) dapat dikembangkan pada fase berikutnya.</p>
      </div>
    </div>
  )
}
