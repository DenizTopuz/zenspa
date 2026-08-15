'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
import type { ServiceCategory } from '@/lib/services-data'

const GAP     = 20
const AUTO_MS = 3000

// 4 full cards fill the content area (px-6 = 24px padding each side at md).
// PARTIAL = padding → first card starts at the content left edge.
// Adjacent card (pre/post clone) is 4px visible = nearly offscreen, hinting more exists.
// At large viewports (≥ 1840px) cards stay capped; remaining viewport becomes partial.
function computeMetrics(vw: number) {
  const padding  = vw >= 768 ? 24 : 16
  const contentW = Math.min(vw - 2 * padding, 1792) // max-w-[1840px] minus padding
  const cardW    = Math.floor((contentW - 3 * GAP) / 4)
  const step     = cardW + GAP
  // Center 4 cards in the viewport; excess becomes partial on each side
  const partial  = Math.round((vw - (4 * cardW + 3 * GAP)) / 2)
  return { cardW, step, partial: Math.max(padding, partial) }
}

function useCarouselMetrics() {
  const [m, setM] = useState({ cardW: 333, step: 353, partial: 24 })
  useEffect(() => {
    const update = () => setM(computeMetrics(window.innerWidth))
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])
  return m
}

function minEuro(cat: ServiceCategory) {
  return Math.min(...cat.treatments.map((t) => parseInt(t.price.replace('€', ''))))
}
function treatmentNames(cat: ServiceCategory) {
  return cat.treatments.map((t) => t.name.split('–')[0].trim()).join(' · ')
}

// SHADOW_PY: vertical padding inside overflow-hidden so shadow isn't clipped.
// Shadow extends offset(4px) + blur(12px) = 16px below card; lift = 6px.
// Net extra space needed below: 16 - 6 = 10px → py-4 (16px) is enough.
const SHADOW_PY = 16 // px — matches Tailwind py-4

function Card({ service, cardW }: { service: ServiceCategory; cardW: number }) {
  const imgH = Math.round(cardW * 1.3)
  return (
    <a
      href={`/behandelingen/${service.slug}`}
      className="group relative shrink-0 overflow-hidden rounded-3xl bg-secondary/30
                 border border-foreground/8
                 transition-all duration-300 ease-out
                 hover:-translate-y-1.5
                 hover:border-foreground/18
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      style={{ width: `${cardW}px` }}
      aria-label={service.title}
    >
      {/* Image */}
      <div className="relative overflow-hidden" style={{ height: `${imgH}px` }}>
        <Image
          src={service.image}
          alt=""
          fill
          aria-hidden
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${service.imgPos}`}
          sizes="(min-width: 1440px) 340px, (min-width: 768px) 260px, 200px"
        />
        {/* Hover: dark top-to-bottom gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/68 via-black/26 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {/* Hover: price — fades in while falling from above into final position */}
        <div className="absolute left-5 top-5 -translate-y-5 opacity-0 transition-all duration-500 ease-out group-hover:translate-y-0 group-hover:opacity-100">
          <p className="font-heading text-[28px] font-semibold leading-none text-white drop-shadow">
            Vanaf €{minEuro(service)}
          </p>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="flex items-center justify-between gap-3 p-5">
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold leading-tight text-foreground">
            {service.title}
          </p>
          <p className="mt-1 truncate text-[13px] leading-snug text-muted-foreground">
            {treatmentNames(service)}
          </p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground">
          <ArrowUpRight className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-background" />
        </div>
      </div>
    </a>
  )
}

export function ServicesCarousel({ services }: { services: ServiceCategory[] }) {
  const { cardW, step, partial } = useCarouselMetrics()
  const n     = services.length
  const items = [...services, ...services, ...services] // triple for seamless looping
  const START = n

  const idxRef  = useRef(START)
  const busyRef = useRef(false)
  const [idx,    setIdx]    = useState(START)
  const [anim,   setAnim]   = useState(true)
  const [paused, setPaused] = useState(false)

  const moveTo = useCallback((newIdx: number, animate = true) => {
    idxRef.current  = newIdx
    busyRef.current = animate
    setIdx(newIdx)
    setAnim(animate)
  }, [])

  const handleTransitionEnd = useCallback(() => {
    busyRef.current = false
    const cur = idxRef.current
    if (cur < n)          moveTo(cur + n, false)
    else if (cur >= 2*n)  moveTo(cur - n, false)
  }, [moveTo, n])

  useEffect(() => {
    if (paused) return
    const id = setInterval(() => moveTo(idxRef.current + 1), AUTO_MS)
    return () => clearInterval(id)
  }, [paused, moveTo])

  const prev = () => { if (!busyRef.current) moveTo(idxRef.current - 1) }
  const next = () => { if (!busyRef.current) moveTo(idxRef.current + 1) }

  const translateX = partial - idx * step

  // Gradient width: partial + a bit into the first card for a smooth fade
  const gradW = Math.max(80, partial + Math.round(cardW * 0.12))

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-fade bg-card py-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Header */}
      <div className="mx-auto mb-14 max-w-[1840px] px-4 md:px-6">
        <div className="flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">
              Wat we aanbieden
            </span>
            <h2
              id="services-heading"
              className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[68px] xl:text-[80px]"
            >
              Zorgvuldige rituelen voor{' '}
              <em className="not-italic text-accent">elk verlangen.</em>
            </h2>
          </div>
          <a
            href="#pricing"
            className="hidden shrink-0 items-center gap-2 text-[17px] font-medium text-accent underline underline-offset-4 transition-all duration-200 hover:gap-3 md:flex"
          >
            Volledig overzicht <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      {/* Carousel
          The overflow wrapper only clips HORIZONTALLY via a negative-margin/padding trick
          so vertical shadows aren't cut off.
          -my → pulls the box edges inward (negative margin)
          py  → expands inner space to match, giving shadow room
      */}
      <div
        className="relative overflow-hidden"
        style={{ marginTop: -SHADOW_PY, marginBottom: -SHADOW_PY }}
      >
        {/* Left fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 bg-gradient-to-r from-card via-card/60 to-transparent"
          style={{ width: `${gradW}px` }}
        />
        {/* Right fade */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 bg-gradient-to-l from-card via-card/60 to-transparent"
          style={{ width: `${gradW}px` }}
        />

        {/* Track — py gives vertical room for shadow inside overflow-hidden */}
        <div
          className="flex"
          style={{
            gap:       `${GAP}px`,
            paddingTop:    SHADOW_PY,
            paddingBottom: SHADOW_PY,
            transform:     `translateX(${translateX}px)`,
            transition:    anim
              ? 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'none',
          }}
          onTransitionEnd={handleTransitionEnd}
        >
          {items.map((service, i) => (
            <Card key={`${service.slug}-${i}`} service={service} cardW={cardW} />
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="mx-auto mt-8 flex max-w-[1840px] gap-3 px-4 md:px-6">
        <button
          onClick={prev}
          aria-label="Vorige behandeling"
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
        >
          <ArrowLeft className="h-6 w-6" />
        </button>
        <button
          onClick={next}
          aria-label="Volgende behandeling"
          className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
        >
          <ArrowRight className="h-6 w-6" />
        </button>
      </div>
    </section>
  )
}
