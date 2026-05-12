import Image from 'next/image'
import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PageHeader } from '@/components/site/page-header'
import { Badge } from '@/components/ui/badge'
import { safeJSON, isUploadedAsset } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const p = await prisma.project.findUnique({ where: { slug: params.slug } })
  if (!p) notFound()
  const images: string[] = safeJSON(p.images, []) as string[]
  if (!images.includes(p.coverImage)) images.unshift(p.coverImage)

  return (
    <>
      <PageHeader title={p.title} subtitle={`${p.client} · ${p.location} · ${p.year}`} breadcrumb={[{ label: 'Portofolio', href: '/portofolio' }, { label: p.title }]} />

      <section className="py-12">
        <div className="container grid gap-10 lg:grid-cols-[1.5fr,1fr]">
          <div>
            <div className="relative aspect-[16/10] overflow-hidden rounded-lg border border-line">
              <Image src={images[0]} alt={p.title} fill priority className="object-cover" unoptimized={isUploadedAsset(images[0])} />
            </div>
            {images.length > 1 && (
              <div className="mt-3 grid grid-cols-3 gap-3 md:grid-cols-4">
                {images.slice(1).map((src,i) => (
                  <div key={i} className="relative aspect-[4/3] overflow-hidden rounded-md border border-line">
                    <Image src={src} alt={`Galeri ${i+2}`} fill sizes="240px" className="object-cover" unoptimized={isUploadedAsset(src)} />
                  </div>
                ))}
              </div>
            )}

            <div className="prose-art mt-10 max-w-none">
              <h2>Deskripsi Proyek</h2>
              <p>{p.description}</p>
              {p.challenge && <><h3>Tantangan</h3><p>{p.challenge}</p></>}
              {p.solution && <><h3>Solusi</h3><p>{p.solution}</p></>}
            </div>
          </div>

          <aside>
            <div className="rounded-lg border border-line bg-bg-card p-6">
              <h3 className="font-display text-xl">Detail Proyek</h3>
              <dl className="mt-4 space-y-2 text-sm">
                <Row label="Klien" value={p.client} />
                <Row label="Tipe Klien" value={p.clientType} />
                <Row label="Lokasi" value={p.location} />
                <Row label="Tahun" value={String(p.year)} />
                <Row label="Kategori" value={p.category} />
                <Row label="Material" value={p.material} />
                {p.dimensions && <Row label="Dimensi" value={p.dimensions} />}
                {p.duration && <Row label="Durasi" value={p.duration} />}
              </dl>
            </div>

            <div className="mt-6 rounded-lg border border-accent-gold/30 bg-accent-gold/5 p-6">
              <h3 className="font-display text-lg">Ingin Proyek Serupa?</h3>
              <p className="mt-1 text-sm text-ink-secondary">Konsultasikan kebutuhan Anda dengan tim kami. Konsultasi awal gratis.</p>
              <div className="mt-4 flex flex-col gap-2">
                <Button asChild><Link href="/pre-order">Mulai Pre-Order</Link></Button>
                <Button asChild variant="outline"><Link href="/booking">Booking Konsultasi</Link></Button>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3 border-b border-line/40 pb-1.5">
      <dt className="text-ink-secondary">{label}</dt><dd className="text-right text-ink-primary">{value}</dd>
    </div>
  )
}
