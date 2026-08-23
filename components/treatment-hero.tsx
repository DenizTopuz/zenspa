'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { Star } from 'lucide-react'
import type { Treatment } from '@/lib/behandelingen-data'

export function TreatmentHero({ t }: { t: Treatment }) {
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
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      aria-label={t.name}
    >
      {/* Parallax image */}
      <div
        ref={imgRef}
        className="absolute inset-x-0 -bottom-[15%] -top-[15%]"
        style={{ willChange: 'transform' }}
      >
        <Image
          src={t.image ?? '/hero.jpg'}
          alt=""
          fill
          aria-hidden
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/52 to-black/80" />

      {/* Content */}
      <div className="relative z-10 mx-auto w-full max-w-4xl px-6 pb-20 pt-36 text-center text-white md:pb-28 md:pt-44">

        {/* Price */}
        <div className="mb-6 inline-flex items-center rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[14px] font-semibold text-white/90 backdrop-blur-sm">
          Vanaf {t.price}
        </div>

        {/* Title */}
        <h1 className="font-heading text-[52px] leading-[1.04] tracking-tight md:text-[72px] lg:text-[88px]">
          {t.name}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-5 max-w-[520px] text-[17px] leading-[1.85] text-white/68">
          {t.description}
        </p>

        {/* CTA */}
        <div className="mt-9">
          <a
            href="/contact"
            className="inline-flex items-center gap-2.5 rounded-full bg-white px-10 py-4.5 text-[16px] font-semibold text-stone-900 transition-all duration-300 hover:bg-white/90 hover:gap-4"
          >
            Afspraak maken ›
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-8 flex items-center justify-center gap-3 text-white/55">
          <div className="flex items-center gap-0.5">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="h-4 w-4 fill-white/80 text-white/80" aria-hidden />
            ))}
          </div>
          <span className="text-[12px] font-semibold tracking-[0.14em] uppercase">
            Vertrouwd door 1000+ klanten
          </span>
        </div>
      </div>
    </section>
  )
}
