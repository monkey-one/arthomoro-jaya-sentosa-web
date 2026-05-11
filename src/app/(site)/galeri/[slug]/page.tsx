import Link from 'next/link'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageHeader } from '@/components/site/page-header'
import { ArtworkCard } from '@/components/site/artwork-card'
import { safeJSON, priceRange, waLink } from '@/lib/utils'
import { ShieldCheck, Clock, Hammer, Award, MessageCircle, Heart, Share2 } from 'lucide-react'
import { ArtworkGallery } from '@/components/site/artwork-gallery'

export const dynamic = 'force-dynamic'

export default async function ArtworkDetailPage({ params }: { params: { slug: string } }) {
  const artwork = await prisma.artwork.findUnique({ where: { slug: params.slug } })
  if (!artwork) notFound()

  // increment views (fire-and-forget)
  prisma.artwork.update({ where: { id: artwork.id }, data: { views: { increment: 1 } } }).catch(()=>{})

  const images: string[] = safeJSON(artwork.images, []) as string[]
  if (images.length === 0) images.push(artwork.coverImage)
  if (!images.includes(artwork.coverImage)) images.unshift(artwork.coverImage)

  const related = await prisma.artwork.findMany({
    where: { published: true, id: { not: artwork.id }, OR: [{ category: artwork.category }, { material: artwork.material }] },
    take: 4, orderBy: { createdAt: 'desc' },
  })

  const wa = waLink(`Halo Arthomoro Jaya Sentosa, saya tertarik dengan karya "${artwork.title}" (kategori ${artwork.category}, material ${artwork.material}). Mohon info pre-order serupa.`)

  return (
    <>
      <PageHeader title={artwork.title} breadcrumb={[{ label: 'Galeri', href: '/galeri' }, { label: artwork.title }]} />

      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-2">
          <ArtworkGallery images={images} title={artwork.title} />

          <div>
            <div className="mb-3 flex flex-wrap gap-2">
              <Badge variant="gold">{artwork.category}</Badge>
              <Badge variant="outline">{artwork.material}</Badge>
              {artwork.style && <Badge variant="outline">{artwork.style}</Badge>}
              {artwork.status === 'AVAILABLE_PREORDER' && <Badge variant="green">Tersedia Pre-Order Serupa</Badge>}
              {artwork.status === 'SOLD' && <Badge variant="red">Karya Telah Terjual</Badge>}
            </div>

            <h1 className="font-display text-3xl md:text-4xl">{artwork.title}</h1>
            {artwork.artist && <p className="mt-1 text-sm text-ink-secondary">oleh {artwork.artist}</p>}

            <div className="my-6 h-px bg-line/60" />

            <dl className="grid grid-cols-2 gap-y-3 text-sm">
              <Row label="Material"   value={artwork.material} />
              <Row label="Kategori"   value={artwork.category} />
              {artwork.style       && <Row label="Gaya"        value={artwork.style} />}
              {artwork.sizeLabel   && <Row label="Skala"       value={artwork.sizeLabel} />}
              {artwork.height      && <Row label="Tinggi"      value={artwork.height} />}
              {artwork.width       && <Row label="Lebar"       value={artwork.width} />}
              {artwork.depth       && <Row label="Kedalaman"   value={artwork.depth} />}
              {artwork.weight      && <Row label="Berat"       value={artwork.weight} />}
              {artwork.year        && <Row label="Tahun"       value={String(artwork.year)} />}
            </dl>

            <div className="mt-6 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-accent-highlight">Estimasi Pre-Order Serupa</p>
              <p className="mt-2 font-display text-2xl text-accent-highlight">{priceRange(artwork.priceRangeMin, artwork.priceRangeMax)}</p>
              <div className="mt-3 flex flex-wrap gap-4 text-xs text-ink-secondary">
                <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5 text-accent-gold" /> {artwork.productionWeeks ?? 6} minggu produksi</span>
                <span className="flex items-center gap-1.5"><ShieldCheck className="h-3.5 w-3.5 text-accent-gold" /> Garansi material</span>
                <span className="flex items-center gap-1.5"><Award className="h-3.5 w-3.5 text-accent-gold" /> Sertifikat keaslian</span>
              </div>
              <p className="mt-3 text-xs text-ink-secondary">Harga final ditentukan setelah konsultasi desain dan ukuran spesifik.</p>
            </div>

            <p className="mt-6 leading-relaxed text-ink-secondary">{artwork.description}</p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" variant="wa"><a href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle className="h-4 w-4" /> Pesan Serupa via WhatsApp</a></Button>
              <Button asChild size="lg"><Link href={`/pre-order?kategori=${encodeURIComponent(artwork.category)}&material=${encodeURIComponent(artwork.material)}`}>Konsultasi Custom</Link></Button>
              <Button asChild size="lg" variant="outline"><Link href="/kontak">Form Lengkap</Link></Button>
            </div>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section className="border-t border-line/60 bg-bg-secondary py-16">
          <div className="container">
            <h2 className="mb-8 font-display text-2xl">Karya Terkait</h2>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map(r => <ArtworkCard key={r.id} a={r as any} />)}
            </div>
          </div>
        </section>
      )}
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-ink-secondary">{label}</dt>
      <dd className="text-ink-primary">{value}</dd>
    </>
  )
}
