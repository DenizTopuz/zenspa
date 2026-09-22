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
      className="relative flex min-h-[72vh] items-center overflow-hidden pb-20"
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
      <div className="relative z-10 w-full px-8 text-center text-white md:px-0">

        {/* Price */}
        <p className="mb-4 text-[28px] font-semibold tracking-[0.04em] text-white/75">
          {t.price}
        </p>

        {/* Title */}
        <h1 className="font-heading text-[clamp(28px,8vw,52px)] leading-[1.04] tracking-tight md:text-[72px] lg:text-[88px]">
          {t.name}
        </h1>

        {/* Description */}
        <p className="mx-auto mt-3 max-w-[520px] text-[17px] leading-[1.75] text-white/68">
          {t.description}
        </p>

        {/* CTA */}
        <div className="mt-5">
          <a
            href={`/boeken?behandeling=${t.slug}`}
            className="inline-flex items-center rounded-full bg-white px-10 py-4.5 text-[16px] font-semibold text-stone-900 transition-all duration-300 hover:bg-white/90"
          >
            Afspraak maken
          </a>
        </div>

        {/* Social proof */}
        <div className="mt-5 flex flex-col items-center justify-center gap-2 text-white/55 sm:flex-row sm:gap-3">
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
