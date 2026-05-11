import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || ''

export function withBase(path: string) {
  if (!path.startsWith('/')) path = '/' + path
  return BASE_PATH + path
}

export function formatIDR(value: number | null | undefined) {
  if (value == null) return '—'
  return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
}

export function formatIDRShort(value: number | null | undefined) {
  if (value == null) return '—'
  if (value >= 1_000_000_000) return `Rp ${(value/1_000_000_000).toFixed(1).replace('.0','')} M`
  if (value >= 1_000_000) return `Rp ${(value/1_000_000).toFixed(0)} Jt`
  return `Rp ${value.toLocaleString('id-ID')}`
}

export function priceRange(min?: number | null, max?: number | null) {
  if (min == null && max == null) return 'Harga konsultasi'
  if (min && max) return `${formatIDRShort(min)} – ${formatIDRShort(max)}`
  return formatIDRShort(min ?? max ?? 0)
}

export function safeJSON<T>(value: string | null | undefined, fallback: T): T {
  if (!value) return fallback
  try { return JSON.parse(value) as T } catch { return fallback }
}

export function slugify(s: string) {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')
}

export function formatDate(d: Date | string | null | undefined, opts: Intl.DateTimeFormatOptions = { year:'numeric', month:'long', day:'numeric' }) {
  if (!d) return '—'
  return new Intl.DateTimeFormat('id-ID', opts).format(new Date(d))
}

export function waLink(message: string, number = process.env.NEXT_PUBLIC_WA_NUMBER || '6281234567890') {
  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`
}
