import { NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'
import { requireAdminSession } from '@/lib/auth-guard'

// Upload endpoint for admin. Accepts multipart/form-data with field "file".
// Optional "folder" field (e.g. "artwork", "article", "project", "video").
// Files are saved under <cwd>/public/uploads/<folder>/<hash>.<ext> and served
// either by Next.js (dev) or directly by nginx (prod, via alias).

const MAX_BYTES = 50 * 1024 * 1024 // 50 MB
const ALLOWED = new Set([
  'image/jpeg','image/jpg','image/png','image/webp','image/avif','image/gif',
  'video/mp4','video/webm','video/quicktime','video/x-m4v',
])

export async function POST(req: Request) {
  // Any logged-in admin can upload. Stricter perm check could be added per folder.
  await requireAdminSession()

  const form = await req.formData()
  const file = form.get('file')
  const folder = String(form.get('folder') || 'misc').replace(/[^a-z0-9_-]/gi, '').toLowerCase() || 'misc'
  if (!(file instanceof File)) return NextResponse.json({ ok: false, error: 'No file provided' }, { status: 400 })
  if (file.size > MAX_BYTES) return NextResponse.json({ ok: false, error: 'File too large (max 50 MB)' }, { status: 413 })
  if (file.type && !ALLOWED.has(file.type)) {
    return NextResponse.json({ ok: false, error: `Tipe file tidak didukung: ${file.type}` }, { status: 415 })
  }

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase().replace(/[^a-z0-9]/g, '').slice(0, 6) || 'bin'
  const hash = crypto.randomBytes(10).toString('hex')
  const stamp = Date.now().toString(36)
  const filename = `${stamp}-${hash}.${ext}`

  // In production the standalone server chdir's into .next/standalone, so we
  // can't rely on process.cwd(). Caller can set UPLOAD_DIR to an absolute path
  // (typically /var/www/<app>/public/uploads). Fallback to <cwd>/public/uploads.
  const baseDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'public', 'uploads')
  const uploadDir = path.join(baseDir, folder)
  await mkdir(uploadDir, { recursive: true })

  const buf = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, filename), buf)

  const base = process.env.NEXT_PUBLIC_BASE_PATH || ''
  const url = `${base}/uploads/${folder}/${filename}`

  return NextResponse.json({ ok: true, url, filename, size: file.size, type: file.type })
}
