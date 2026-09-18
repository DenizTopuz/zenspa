'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'

export function BehandelingenHero() {
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = imgRef.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handle = () => {
      const progress = window.scrollY / window.innerHeight
      el.style.transform = `translateY(${progress * 120}px)`
    }

    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <section
      className="relative flex min-h-[58vh] items-center overflow-hidden"
      aria-label="Behandelingen overzicht"
    >
      {/* Parallax image */}
      <div
        ref={imgRef}
        className="absolute inset-x-0 -bottom-[15%] -top-[15%]"
        style={{ willChange: 'transform' }}
      >
        <Image
          src="/hero.jpg"
          alt=""
          fill
          aria-hidden
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/38 to-black/78" />

      <div className="relative z-10 w-full pb-16 pt-32 text-center text-white md:pb-20 md:pt-36">
        <span className="mb-5 block text-[13px] font-semibold tracking-[0.20em] text-white/55 uppercase">
          Ons aanbod
        </span>
        <h1 className="font-heading text-[52px] leading-[1.04] tracking-tight md:text-[76px] lg:text-[92px]">
          Onze Behandelingen
        </h1>
        <p className="mx-auto mt-4 mb-14 max-w-[460px] text-[17px] leading-[1.85] text-white/62 md:mt-5 md:mb-0">
          Elk ritueel zorgvuldig samengesteld voor jou.
        </p>
      </div>
    </section>
  )
}
