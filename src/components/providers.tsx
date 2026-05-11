'use client'

import { SessionProvider } from 'next-auth/react'
import { TooltipProvider } from '@/components/ui/tooltip'
import { Toaster } from 'sonner'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider basePath={`${process.env.NEXT_PUBLIC_BASE_PATH || ''}/api/auth`}>
      <TooltipProvider delayDuration={150} skipDelayDuration={300}>
        {children}
        <Toaster
          theme="dark"
          position="top-right"
          toastOptions={{
            style: { background: '#1A1814', border: '1px solid #3A3530', color: '#F2EDE6' },
          }}
        />
      </TooltipProvider>
    </SessionProvider>
  )
}
