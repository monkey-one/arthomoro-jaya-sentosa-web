'use client'

import { MessageCircle } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { waLink } from '@/lib/utils'

export function FloatingWa() {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={waLink('Halo Arthomoro Jaya Sentosa, saya ingin bertanya tentang pemesanan patung.')}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat WhatsApp"
          className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-soft transition-transform hover:scale-110"
        >
          <MessageCircle className="h-6 w-6" />
          <span className="absolute -top-1 -right-1 h-3 w-3 animate-ping rounded-full bg-emerald-300" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-400" />
        </a>
      </TooltipTrigger>
      <TooltipContent side="left">Chat langsung dengan tim kami via WhatsApp untuk konsultasi gratis.</TooltipContent>
    </Tooltip>
  )
}
