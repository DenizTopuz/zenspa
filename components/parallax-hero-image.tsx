'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export function ParallaxHeroImage() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handle = () => {
      el.style.transform = `translateY(${window.scrollY * 0.3}px)`
    }

    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <div
      ref={ref}
      className="absolute inset-x-0 -bottom-[20%] -top-[20%]"
      style={{ willChange: 'transform' }}
    >
      <Image
        src="/hero.jpeg"
        alt="Zen Spa — luxe wellnessbehandelingen"
        fill
        priority
        quality={90}
        className="object-cover object-[70%_center] brightness-95 saturate-[1.15] sepia-[0.18]"
        sizes="100vw"
      />
    </div>
  )
}
