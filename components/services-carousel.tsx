'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Image from 'next/image'
import { ArrowUpRight, ArrowLeft, ArrowRight } from 'lucide-react'
import type { ServiceCategory } from '@/lib/services-data'

const GAP     = 20
const AUTO_MS = 3000
const PEEK_SM = 36  // px of next card peeking on mobile
const PEEK_MD = 52  // px of next card peeking on tablet

function computeMetrics(vw: number) {
  const padding = vw >= 768 ? 24 : 16

  if (vw < 768) {
    // Mobile: card left-aligned with section padding (16px).
    // Right peek shows the next card so users know there's more.
    // While swiping right, prev card slides in from left (left gradient fades it).
    const partial    = 16          // matches section px-4 — card aligns with heading text
    const rightPeek  = 44          // next card peeking on the right (~24px visible after gradient)
    const cardW      = vw - partial - GAP - rightPeek
    const step       = cardW + GAP
    return { cardW, step, partial, gradW: 20 }
  }

  if (vw < 1024) {
    // Tablet: 2 full cards + a peek of the 3rd at the right edge
    const peek  = PEEK_MD
    const cardW = Math.floor((vw - padding - GAP - peek) / 2)
    const step  = cardW + GAP
    return { cardW, step, partial: padding, gradW: Math.max(peek - 4, 28) }
  }

  // Desktop: 4 cards centered
  const contentW = Math.min(vw - 2 * padding, 1792)
  const cardW    = Math.floor((contentW - 3 * GAP) / 4)
  const step     = cardW + GAP
  const partial  = Math.round((vw - (4 * cardW + 3 * GAP)) / 2)
  const gradW    = Math.max(80, Math.max(padding, partial) + Math.round(cardW * 0.12))
  return { cardW, step, partial: Math.max(padding, partial), gradW }
}

function useCarouselMetrics() {
  const [m, setM] = useState({ cardW: 333, step: 353, partial: 24, gradW: 80 })
  useEffect(() => {
    const update = () => setM(computeMetrics(window.innerWidth))
    update()
    window.addEventListener('resize', update, { passive: true })
    return () => window.removeEventListener('resize', update)
  }, [])
  return m
}

function treatmentNames(cat: ServiceCategory) {
  return cat.treatments.map((t) => t.name.split('–')[0].trim()).join(' · ')
}

const SHADOW_PY = 16

function Card({ service, cardW }: { service: ServiceCategory; cardW: number }) {
  const imgH = Math.round(cardW * 1.3)
  return (
    <a
      href="/behandelingen"
      className="group relative shrink-0 overflow-hidden rounded-3xl bg-secondary/30
                 transition-all duration-300 ease-out
                 hover:-translate-y-1.5
                 hover:shadow-[0_4px_20px_rgba(0,0,0,0.10)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
      style={{ width: `${cardW}px` }}
      aria-label={service.title}
    >
      <div className="relative overflow-hidden" style={{ height: `${imgH}px` }}>
        <Image
          src={service.image}
          alt=""
          fill
          aria-hidden
          className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${service.imgPos}`}
          sizes="(min-width: 1440px) 340px, (min-width: 1024px) 260px, (min-width: 768px) 360px, 200px"
        />
        {/* Bottom gradient for title legibility on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent
                        opacity-0 transition-opacity duration-500 lg:group-hover:opacity-100" />
      </div>

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
  const { cardW, step, partial, gradW } = useCarouselMetrics()
  const n     = services.length
  const items = [...services, ...services, ...services]
  const START = n

  const idxRef        = useRef(START)
  const busyRef       = useRef(false)
  const pointerStartX = useRef<number | null>(null)
  const didDrag       = useRef(false)
  const pausedRef     = useRef(false)
  const [idx,  setIdx]  = useState(START)
  const [anim, setAnim] = useState(true)
  const [, forceRender] = useState(0)

  const setPaused = useCallback((v: boolean) => {
    pausedRef.current = v
    forceRender(n => n + 1)
  }, [])

  const moveTo = useCallback((newIdx: number, animate = true) => {
    idxRef.current  = newIdx
    busyRef.current = animate
    setIdx(newIdx)
    setAnim(animate)
  }, [])

  const handleTransitionEnd = useCallback(() => {
    busyRef.current = false
    const cur = idxRef.current
    if (cur < n)         moveTo(cur + n, false)
    else if (cur >= 2*n) moveTo(cur - n, false)
  }, [moveTo, n])

  useEffect(() => {
    const tick = () => {
      if (!pausedRef.current) moveTo(idxRef.current + 1)
    }
    const id = setInterval(tick, AUTO_MS)
    return () => clearInterval(id)
  }, [moveTo])

  const prev = () => { if (!busyRef.current) moveTo(idxRef.current - 1) }
  const next = () => { if (!busyRef.current) moveTo(idxRef.current + 1) }

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    pointerStartX.current = e.clientX
    didDrag.current = false
    setPaused(true)
    e.currentTarget.setPointerCapture(e.pointerId)
  }
  const onPointerMove = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return
    if (Math.abs(e.clientX - pointerStartX.current) > 5) didDrag.current = true
  }
  const onPointerUp = (e: React.PointerEvent) => {
    if (pointerStartX.current === null) return
    const delta = e.clientX - pointerStartX.current
    pointerStartX.current = null
    setPaused(false)
    if (Math.abs(delta) < 40) return
    if (delta < 0) next()
    else prev()
  }
  const onPointerCancel = () => {
    pointerStartX.current = null
    setPaused(false)
  }
  // Prevent link clicks after a drag
  const onClickCapture = (e: React.MouseEvent) => {
    if (didDrag.current) { e.preventDefault(); e.stopPropagation(); didDrag.current = false }
  }

  const translateX = partial - idx * step

  return (
    <section
      id="services"
      aria-labelledby="services-heading"
      className="section-fade bg-card pt-16 pb-24 md:py-32"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="mx-auto mb-8 max-w-[1840px] px-5 md:px-6 md:mb-14">
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
            href="/behandelingen"
            className="hidden shrink-0 items-center gap-2 text-[17px] font-medium text-accent underline underline-offset-4 transition-all duration-200 hover:gap-3 md:flex"
          >
            Volledig overzicht <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      <div
        className="relative overflow-hidden"
        style={{ marginTop: -SHADOW_PY, marginBottom: -SHADOW_PY, touchAction: 'pan-y' }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 z-10 bg-gradient-to-r from-card via-card/60 to-transparent"
          style={{ width: `${gradW}px` }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden bg-gradient-to-l from-card via-card/60 to-transparent md:block"
          style={{ width: `${gradW}px` }}
        />

        <div
          className="flex cursor-grab active:cursor-grabbing"
          style={{
            gap:           `${GAP}px`,
            paddingTop:    SHADOW_PY,
            paddingBottom: SHADOW_PY,
            transform:     `translateX(${translateX}px)`,
            transition:    anim ? 'transform 0.55s cubic-bezier(0.25, 0.46, 0.45, 0.94)' : 'none',
            userSelect:    'none',
          }}
          onTransitionEnd={handleTransitionEnd}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerCancel={onPointerCancel}
          onClickCapture={onClickCapture}
        >
          {items.map((service, i) => (
            <Card key={`${service.slug}-${i}`} service={service} cardW={cardW} />
          ))}
        </div>
      </div>

      <div className="mx-auto mt-8 flex max-w-[1840px] gap-3 px-5 md:px-6">
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
