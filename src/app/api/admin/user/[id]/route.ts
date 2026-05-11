import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('user:edit'); if (error) return error
  try {
    const data = await req.json()
    if (data.password) data.password = await bcrypt.hash(data.password, 10)
    await prisma.user.update({ where: { id: params.id }, data })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('user:delete'); if (error) return error
  try {
    const u = await prisma.user.findUnique({ where: { id: params.id }, include: { role: true } })
    if (u?.role.name === 'Super Admin') return NextResponse.json({ ok: false, error: 'Tidak dapat menghapus Super Admin' }, { status: 400 })
    await prisma.user.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
