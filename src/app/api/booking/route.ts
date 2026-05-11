import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  whatsapp: z.string().min(8),
  purpose: z.string().min(3),
  date: z.string(),
  timeSlot: z.string(),
  notes: z.string().optional().nullable(),
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const created = await prisma.booking.create({
      data: {
        name: data.name, email: data.email, whatsapp: data.whatsapp, purpose: data.purpose,
        date: new Date(data.date), timeSlot: data.timeSlot, notes: data.notes ?? null,
      },
    })
    return NextResponse.json({ ok: true, id: created.id })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Invalid request' }, { status: 400 })
  }
}
