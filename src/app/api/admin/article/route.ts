import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function POST(req: Request) {
  const { error } = await requirePermissionApi('artikel:create')
  if (error) return error
  try {
    const data = await req.json()
    if (data.publishedAt) data.publishedAt = new Date(data.publishedAt)
    const created = await prisma.article.create({ data })
    return NextResponse.json({ ok: true, id: created.id })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
