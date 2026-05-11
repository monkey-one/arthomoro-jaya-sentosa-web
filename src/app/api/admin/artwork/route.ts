import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function POST(req: Request) {
  const { error } = await requirePermissionApi('galeri:create')
  if (error) return error
  try {
    const body = await req.json()
    // ensure images string is valid JSON
    try { JSON.parse(body.images || '[]') } catch { body.images = '[]' }
    const created = await prisma.artwork.create({ data: body })
    return NextResponse.json({ ok: true, id: created.id })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 400 })
  }
}
