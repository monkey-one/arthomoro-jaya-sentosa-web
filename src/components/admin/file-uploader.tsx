'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { Upload, Loader2, X, FileVideo, ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

interface Props {
  value?: string
  onChange: (url: string) => void
  folder: string
  accept?: string
  kind?: 'image' | 'video'
  label?: string
  hint?: React.ReactNode
  required?: boolean
  className?: string
}

export function FileUploader({ value, onChange, folder, accept, kind = 'image', label, hint, required, className }: Props) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function handleFile(file: File) {
    setLoading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      fd.append('folder', folder)
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/upload`, { method: 'POST', body: fd })
      const data = await res.json()
      if (!res.ok) throw new Error(data?.error || 'Upload gagal')
      onChange(data.url)
      toast.success('Berhasil diunggah')
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false); if (inputRef.current) inputRef.current.value = '' }
  }

  return (
    <div className={cn('space-y-2', className)}>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink-secondary">
          <span>{label}{required && <span className="ml-1 text-accent-highlight">*</span>}</span>
          {hint}
        </label>
      )}

      {value ? (
        <div className="group relative overflow-hidden rounded-md border border-line bg-bg-secondary/40">
          {kind === 'video' ? (
            <video src={value} className="aspect-video w-full bg-black object-cover" muted controls />
          ) : (
            <div className="relative aspect-[4/3] w-full">
              <Image src={value} alt="Preview" fill sizes="320px" className="object-cover" unoptimized />
            </div>
          )}
          <div className="flex items-center justify-between gap-2 border-t border-line px-3 py-2">
            <span className="truncate text-xs text-ink-secondary">{value.split('/').pop()}</span>
            <div className="flex gap-2">
              <button type="button" onClick={() => inputRef.current?.click()} className="rounded-md border border-line px-2 py-1 text-[11px] hover:border-accent-gold">Ganti</button>
              <button type="button" onClick={() => onChange('')} className="rounded-md border border-red-700/40 px-2 py-1 text-[11px] text-red-300 hover:bg-red-700/10">
                <X className="h-3 w-3" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="flex w-full flex-col items-center justify-center gap-2 rounded-md border border-dashed border-line bg-bg-secondary/30 px-4 py-8 text-sm text-ink-secondary transition hover:border-accent-gold/60 hover:text-accent-highlight"
        >
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-accent-gold" />
          ) : kind === 'video' ? (
            <FileVideo className="h-6 w-6 text-accent-gold" />
          ) : (
            <ImageIcon className="h-6 w-6 text-accent-gold" />
          )}
          <span>{loading ? 'Mengunggah…' : kind === 'video' ? 'Klik untuk unggah video' : 'Klik untuk unggah foto'}</span>
          <span className="text-[10px] uppercase tracking-wider text-ink-secondary/70">{kind === 'video' ? 'MP4 / WebM · maks 50 MB' : 'JPG · PNG · WebP · maks 50 MB'}</span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={accept || (kind === 'video' ? 'video/mp4,video/webm,video/quicktime' : 'image/*')}
        onChange={e => { const f = e.target.files?.[0]; if (f) handleFile(f) }}
        className="hidden"
      />
    </div>
  )
}

interface MultiProps {
  value: string[]
  onChange: (urls: string[]) => void
  folder: string
  label?: string
  hint?: React.ReactNode
  max?: number
}

export function MultiImageUploader({ value, onChange, folder, label, hint, max = 8 }: MultiProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [loading, setLoading] = useState(false)

  async function handleFiles(files: FileList) {
    setLoading(true)
    const newUrls: string[] = []
    try {
      for (const f of Array.from(files)) {
        if (value.length + newUrls.length >= max) {
          toast.warning(`Maksimum ${max} gambar`); break
        }
        const fd = new FormData()
        fd.append('file', f); fd.append('folder', folder)
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/admin/upload`, { method: 'POST', body: fd })
        const data = await res.json()
        if (!res.ok) throw new Error(data?.error || 'Upload gagal')
        newUrls.push(data.url)
      }
      if (newUrls.length > 0) {
        onChange([...value, ...newUrls])
        toast.success(`${newUrls.length} foto terunggah`)
      }
    } catch (e: any) { toast.error(e.message) }
    finally { setLoading(false); if (inputRef.current) inputRef.current.value = '' }
  }

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i))

  return (
    <div>
      {label && (
        <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wider text-ink-secondary">
          <span>{label}</span>{hint}
        </label>
      )}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {value.map((url, i) => (
          <div key={i} className="group relative aspect-square overflow-hidden rounded-md border border-line">
            <Image src={url} alt={`Image ${i+1}`} fill sizes="200px" className="object-cover" unoptimized />
            <button type="button" onClick={() => removeAt(i)} className="absolute right-1 top-1 hidden h-7 w-7 items-center justify-center rounded-full bg-bg-primary/80 text-red-300 group-hover:flex">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
        {value.length < max && (
          <button type="button" onClick={() => inputRef.current?.click()} disabled={loading} className="flex aspect-square items-center justify-center rounded-md border border-dashed border-line bg-bg-secondary/30 text-xs text-ink-secondary hover:border-accent-gold/60 hover:text-accent-highlight">
            {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
              <div className="flex flex-col items-center gap-1">
                <Upload className="h-5 w-5" />
                <span>Tambah Foto</span>
              </div>
            )}
          </button>
        )}
      </div>
      <input ref={inputRef} type="file" accept="image/*" multiple onChange={e => e.target.files && handleFiles(e.target.files)} className="hidden" />
    </div>
  )
}
