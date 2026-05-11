import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('artikel:edit')
  if (error) return error
  try {
    const data = await req.json()
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt)
    await prisma.article.update({ where: { id: params.id }, data })
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}

export async function DELETE(_: Request, { params }: { params: { id: string } }) {
  const { error } = await requirePermissionApi('artikel:delete')
  if (error) return error
  try { await prisma.article.delete({ where: { id: params.id } }); return NextResponse.json({ ok: true }) }
  catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
