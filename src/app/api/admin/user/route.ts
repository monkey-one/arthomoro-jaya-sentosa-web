import { NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function POST(req: Request) {
  const { error } = await requirePermissionApi('user:create'); if (error) return error
  try {
    const { name, email, password, roleId } = await req.json()
    if (!name || !email || !password || !roleId) throw new Error('Field tidak lengkap')
    const hashed = await bcrypt.hash(password, 10)
    const u = await prisma.user.create({ data: { name, email, password: hashed, roleId } })
    return NextResponse.json({ ok: true, id: u.id })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
