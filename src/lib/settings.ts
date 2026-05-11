import { prisma } from './prisma'

export async function getSettings(): Promise<Record<string, string>> {
  try {
    const rows = await prisma.setting.findMany()
    return Object.fromEntries(rows.map(r => [r.key, r.value]))
  } catch {
    return {}
  }
}
