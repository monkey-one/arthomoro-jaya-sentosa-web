import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import { authOptions } from './auth'
import { NextResponse } from 'next/server'

export async function requireAdminSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user) redirect(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/admin/login`)
  return session
}

export async function requirePermissionPage(perm: string) {
  const session = await requireAdminSession()
  const u = session.user as any
  if (u.roleName === 'Super Admin') return session
  if (!(u.permissions || []).includes(perm)) redirect(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/admin`)
  return session
}

export async function requirePermissionApi(perm: string) {
  const session = await getServerSession(authOptions)
  const u = session?.user as any
  if (!u) return { error: NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 }), session: null }
  if (u.roleName === 'Super Admin' || (u.permissions || []).includes(perm)) return { error: null, session }
  return { error: NextResponse.json({ ok: false, error: 'Forbidden' }, { status: 403 }), session }
}
