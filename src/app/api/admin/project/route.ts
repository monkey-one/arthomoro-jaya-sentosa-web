import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function POST(req: Request) {
  const { error } = await requirePermissionApi('portofolio:create'); if (error) return error
  try { const data = await req.json(); const c = await prisma.project.create({ data }); return NextResponse.json({ ok: true, id: c.id }) }
  catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
