import { NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/prisma'

const schema = z.object({
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerWa: z.string().min(8),
  sculptureType: z.string(),
  material: z.string(),
  sizeLabel: z.string(),
  heightCm: z.number().optional().nullable(),
  finishing: z.string().optional().nullable(),
  installation: z.boolean().optional().default(false),
  installAddress: z.string().optional().nullable(),
  deadline: z.string().optional().nullable(),
  estimateMin: z.number().optional().nullable(),
  estimateMax: z.number().optional().nullable(),
  estimateWeeks: z.number().optional().nullable(),
  notes: z.string().optional().nullable(),
})

function genCode() {
  const n = Math.floor(Math.random() * 9000) + 1000
  return `AJS-PO-${new Date().getFullYear()}${n}`
}

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = schema.parse(body)
    const code = genCode()
    const created = await prisma.preOrder.create({
      data: {
        code,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerWa: data.customerWa,
        sculptureType: data.sculptureType,
        material: data.material,
        sizeLabel: data.sizeLabel,
        heightCm: data.heightCm ?? null,
        finishing: data.finishing ?? null,
        installation: !!data.installation,
        installAddress: data.installAddress ?? null,
        deadline: data.deadline ? new Date(data.deadline) : null,
        estimateMin: data.estimateMin ?? null,
        estimateMax: data.estimateMax ?? null,
        estimateWeeks: data.estimateWeeks ?? null,
        notes: data.notes ?? null,
        status: 'INQUIRY',
      },
    })
    return NextResponse.json({ ok: true, id: created.id, code })
  } catch (err: any) {
    return NextResponse.json({ ok: false, error: err.message || 'Invalid request' }, { status: 400 })
  }
}
