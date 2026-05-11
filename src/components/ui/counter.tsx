'use client'

import { animate, useInView } from 'framer-motion'
import { useEffect, useRef, useState } from 'react'

export function Counter({ to, duration = 1.8, suffix = '', prefix = '' }: { to: number; duration?: number; suffix?: string; prefix?: string }) {
  const ref = useRef<HTMLSpanElement>(null)
  const inView = useInView(ref, { once: true, margin: '-30px' })
  const [val, setVal] = useState(0)

  useEffect(() => {
    if (!inView) return
    const controls = animate(0, to, {
      duration,
      ease: [0.22, 1, 0.36, 1],
      onUpdate(v) { setVal(Math.round(v)) },
    })
    return () => controls.stop()
  }, [inView, to, duration])

  return <span ref={ref}>{prefix}{val.toLocaleString('id-ID')}{suffix}</span>
}
