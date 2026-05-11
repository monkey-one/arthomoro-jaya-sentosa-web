import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('galeri:edit')
  if (error) return error
  try {
    const body = await req.json()
    try { JSON.parse(body.images || '[]') } catch { body.images = '[]' }
    await prisma.artwork.update({ where: { id: params.id }, data: body })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('galeri:delete')
  if (error) return error
  try {
    await prisma.artwork.delete({ where: { id: params.id } })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
