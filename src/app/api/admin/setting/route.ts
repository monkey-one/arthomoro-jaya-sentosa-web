import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requirePermissionApi } from '@/lib/auth-guard'

export async function POST(req: Request) {
  const { error } = await requirePermissionApi('setting:edit_general'); if (error) return error
  try {
    const data = await req.json() as Record<string,string>
    for (const [key, value] of Object.entries(data)) {
      await prisma.setting.upsert({ where: { key }, update: { value: String(value ?? '') }, create: { key, value: String(value ?? '') } })
    }
    return NextResponse.json({ ok: true })
  } catch (e: any) { return NextResponse.json({ ok: false, error: e.message }, { status: 400 }) }
}
