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
      className="absolute inset-x-0 -bottom-[40%] -top-[40%]"
      style={{ willChange: 'transform' }}
    >
      <Image
        src="/hero.jpg"
        alt="Zen Spa — luxe wellnessbehandelingen"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
    </div>
  )
}
