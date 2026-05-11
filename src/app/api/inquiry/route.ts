import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2).max(80),
  email: z.string().email(),
  whatsapp: z.string().min(8).max(20),
  purpose: z.string().min(2),
  interest: z.string().optional().nullable(),
  budget: z.string().optional().nullable(),
  message: z.string().min(5).max(2000),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const created = await prisma.inquiry.create({ data })
    return NextResponse.json({ ok: true, id: created.id })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Invalid request' }, { status: 400 })
  }
}
