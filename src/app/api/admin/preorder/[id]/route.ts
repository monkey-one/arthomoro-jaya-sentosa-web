import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('order:edit_status'); if (error) return error
  try { await prisma.preOrder.update({ where: { id: params.id }, data: await req.json() }); return NextResponse.json({ ok: true }) }
  catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('order:delete'); if (error) return error
  try { await prisma.preOrder.delete({ where: { id: params.id } }); return NextResponse.json({ ok: true }) }
  catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
