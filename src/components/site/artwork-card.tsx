'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Heart, ArrowUpRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { priceRange } from '@/lib/utils'

export interface ArtworkCardData {
  slug: string
  title: string
  category: string
  material: string
  coverImage: string
  status: string
  priceRangeMin?: number | null
  priceRangeMax?: number | null
  productionWeeks?: number | null
  likes?: number
}

export function ArtworkCard({ a, priority = false }: { a: ArtworkCardData; priority?: boolean }) {
  const available = a.status === 'AVAILABLE_PREORDER'
  return (
    <Link href={`/galeri/${a.slug}`} className="card-hover group block overflow-hidden rounded-lg border border-line bg-bg-card">
      <div className="relative aspect-[3/4] overflow-hidden bg-bg-secondary">
        <Image
          src={a.coverImage}
          alt={a.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          priority={priority}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/30 to-transparent opacity-90" />
        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <Badge variant="gold">{a.category}</Badge>
          <Badge variant="outline">{a.material}</Badge>
        </div>
        {available ? (
          <div className="absolute right-3 top-3">
            <Badge variant="green">Pre-Order</Badge>
          </div>
        ) : (
          <div className="absolute right-3 top-3">
            <Badge variant="red">Terjual</Badge>
          </div>
        )}
        <motion.div initial={false} whileHover={{ y: 0, opacity: 1 }} className="absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-accent-gold/90 text-bg-primary opacity-0 transition-opacity group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </motion.div>
      </div>
      <div className="px-4 py-4">
        <h3 className="font-display text-lg leading-tight">{a.title}</h3>
        <div className="mt-1 flex items-center justify-between text-xs text-ink-secondary">
          <span>{priceRange(a.priceRangeMin, a.priceRangeMax)}</span>
          <span className="flex items-center gap-1"><Heart className="h-3 w-3" />{a.likes ?? 0}</span>
        </div>
      </div>
    </Link>
  )
}
