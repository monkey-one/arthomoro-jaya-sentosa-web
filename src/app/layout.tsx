import './globals.css'
import type { Metadata } from 'next'
import { Playfair_Display, Cormorant_Garamond, Cinzel, Lato } from 'next/font/google'
import { Providers } from '@/components/providers'

const playfair = Playfair_Display({ subsets: ['latin'], display: 'swap', variable: '--font-playfair' })
const cormorant = Cormorant_Garamond({ subsets: ['latin'], weight: ['300','400','500','600','700'], style: ['normal','italic'], display: 'swap', variable: '--font-cormorant' })
const cinzel = Cinzel({ subsets: ['latin'], weight: ['400','500','600','700'], display: 'swap', variable: '--font-cinzel' })
const lato = Lato({ subsets: ['latin'], weight: ['300','400','700','900'], display: 'swap', variable: '--font-lato' })

export const metadata: Metadata = {
  title: { default: 'Arthomoro Jaya Sentosa — Studio & Galeri Patung', template: '%s · Arthomoro Jaya Sentosa' },
  description: 'Studio dan galeri patung kelas premium yang melayani pre-order custom: patung wajah, figur, monumental, relief, hingga karya abstrak.',
  openGraph: {
    title: 'Arthomoro Jaya Sentosa — Studio & Galeri Patung',
    description: 'Setiap Patung adalah Jiwa yang Dibekukan dalam Waktu.',
    type: 'website',
  },
  metadataBase: new URL('https://yourmoonkey.com'),
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" className={`${playfair.variable} ${cormorant.variable} ${cinzel.variable} ${lato.variable}`}>
      <body className="min-h-screen bg-bg-primary text-ink-primary antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
