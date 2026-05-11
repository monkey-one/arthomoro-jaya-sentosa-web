'use client'

import Image from 'next/image'
import { useState } from 'react'
import { cn } from '@/lib/utils'

export function ArtworkGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0)
  return (
    <div>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border border-line bg-bg-card">
        <Image src={images[active]} alt={`${title} — gambar ${active+1}`} fill priority sizes="(max-width: 1024px) 100vw, 50vw" className="object-cover" />
      </div>
      {images.length > 1 && (
        <div className="mt-3 grid grid-cols-5 gap-2">
          {images.slice(0,5).map((src, i) => (
            <button key={i} onClick={() => setActive(i)} className={cn('relative aspect-square overflow-hidden rounded-md border', i === active ? 'border-accent-gold' : 'border-line opacity-70 hover:opacity-100')}>
              <Image src={src} alt={`thumb ${i+1}`} fill sizes="120px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
