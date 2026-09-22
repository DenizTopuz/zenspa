'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ZenSpaIcon } from '@/components/logo'

export function OverMijHero() {
  const imgRef  = useRef<HTMLDivElement>(null)
  const logoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const img  = imgRef.current
    const logo = logoRef.current
    if (!img || !logo) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const handle = () => {
      const progress = window.scrollY / window.innerHeight
      img.style.transform  = `translateY(${progress * 120}px)`
      logo.style.transform = `translateY(${progress * 60}px)`
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <section className="relative flex min-h-[72vh] items-center overflow-hidden" aria-label="Over mij">
      {/* Parallax photo */}
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
          className="object-cover object-[75%_center]"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/52 to-black/80" />

      {/* Parallax logo watermark */}
      <div
        ref={logoRef}
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
        style={{ willChange: 'transform' }}
      >
        <ZenSpaIcon className="w-[50vw] max-w-[560px] text-white opacity-[0.08]" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-8 py-36 text-center text-white md:px-0 md:py-32">
        <h1 className="font-heading text-[52px] leading-[1.04] tracking-tight md:text-[72px] lg:text-[88px]">
          Zen Spa
        </h1>
        <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.85] text-white/68">
          Gedreven door passie voor huidverzorging en welzijn — meer dan 20 jaar toewijding aan jouw schoonheid.
        </p>
        <div className="mt-9">
          <a
            href="/boeken"
            className="inline-flex items-center rounded-full bg-white px-10 py-4.5 text-[16px] font-semibold text-stone-900 transition-all duration-300 hover:bg-white/90"
          >
            Maak een afspraak
          </a>
        </div>
        <div className="mt-8 pb-4 flex items-center justify-center gap-3 text-white/55">
          <span className="text-center text-[12px] font-semibold tracking-[0.14em] uppercase leading-relaxed">
            Gecertificeerd · 1000+ tevreden klanten · 20+ jaar ervaring
          </span>
        </div>
      </div>
    </section>
  )
}
