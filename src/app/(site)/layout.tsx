import { SiteHeader } from '@/components/site/header'
import { SiteFooter } from '@/components/site/footer'
import { FloatingWa } from '@/components/site/floating-wa'
import { getSettings } from '@/lib/settings'

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings()
  return (
    <>
      <SiteHeader />
      <main className="bg-marble grain relative min-h-screen pt-24">
        {children}
      </main>
      <SiteFooter settings={settings} />
      <FloatingWa />
    </>
  )
}
