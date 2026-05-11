import { prisma } from '@/lib/prisma'
import { requirePermissionPage } from '@/lib/auth-guard'
import { AdminPageHeader } from '@/components/admin/page-header'
import { Table, THead, Th, Tr, Td } from '@/components/admin/table'
import { Badge } from '@/components/ui/badge'
import { DeleteButton } from '@/components/admin/delete-button'
import { UserForm } from '@/components/admin/user-form'
import { formatDate } from '@/lib/utils'

export const dynamic = 'force-dynamic'

export default async function AdminUsersPage() {
  await requirePermissionPage('user:view')
  const [users, roles] = await Promise.all([
    prisma.user.findMany({ include: { role: true }, orderBy: { createdAt: 'desc' } }),
    prisma.role.findMany({ orderBy: { name: 'asc' } }),
  ])

  return (
    <div>
      <AdminPageHeader title="Pengguna Sistem" subtitle={`${users.length} pengguna terdaftar`} />

      <div className="grid gap-6 lg:grid-cols-[1fr,420px]">
        <Table>
          <THead><Tr><Th>Nama</Th><Th>Email</Th><Th>Role</Th><Th>Status</Th><Th>Login Terakhir</Th><Th>Aksi</Th></Tr></THead>
          <tbody>
            {users.map(u => (
              <Tr key={u.id}>
                <Td><p className="font-medium">{u.name}</p></Td>
                <Td className="text-sm">{u.email}</Td>
                <Td><Badge variant="gold">{u.role.name}</Badge></Td>
                <Td><Badge variant={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Aktif' : 'Nonaktif'}</Badge></Td>
                <Td className="text-xs text-ink-secondary">{u.lastLogin ? formatDate(u.lastLogin, { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' }) : '—'}</Td>
                <Td>
                  {u.role.name !== 'Super Admin' && <DeleteButton url={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/user/${u.id}`} />}
                </Td>
              </Tr>
            ))}
          </tbody>
        </Table>

        <aside>
          <div className="rounded-lg border border-line bg-bg-card p-5">
            <h3 className="font-display text-lg">Tambah Pengguna</h3>
            <p className="mt-1 text-xs text-ink-secondary">Buat akun untuk tim admin, editor, atau CS.</p>
            <UserForm roles={roles} />
          </div>
        </aside>
      </div>
    </div>
  )
}
