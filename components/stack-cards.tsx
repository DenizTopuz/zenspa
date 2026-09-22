'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import type { ServiceCategory } from '@/lib/services-data'

const NAV_H = 96          // h-24
const STICKY_BASE = NAV_H + 40  // first card sticks 40px below nav
const CARD_OFFSET = 22    // each subsequent card sticks 22px lower (fan effect)
const SCROLL_PER_CARD = 300 // px of scroll before next card starts entering
const SCALE_STEP = 0.028  // scale reduction per stacked-above card

export function StackCards({ services }: { services: ServiceCategory[] }) {
  const cardRefs = useRef<HTMLElement[]>([])

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const cards = cardRefs.current.filter(Boolean)

    const update = () => {
      cards.forEach((card, i) => {
        const mySticky = STICKY_BASE + i * CARD_OFFSET
        let depth = 0

        for (let j = i + 1; j < cards.length; j++) {
          const nextCard = cards[j]
          const nextRect = nextCard.getBoundingClientRect()
          const nextSticky = STICKY_BASE + j * CARD_OFFSET
          if (nextRect.top <= nextSticky + 4) depth++
        }

        const scale = Math.max(0.86, 1 - depth * SCALE_STEP)
        const brightness = Math.max(0.72, 1 - depth * 0.07)
        ;(card as HTMLElement).style.transform = `scale(${scale.toFixed(4)})`
        ;(card as HTMLElement).style.filter = `brightness(${brightness.toFixed(4)})`
        ;(card as HTMLElement).style.transformOrigin = 'top center'
      })
    }

    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const containerH = (services.length - 1) * SCROLL_PER_CARD + 680

  return (
    <div className="flex-1" style={{ height: `${containerH}px` }}>
      {services.map((s, i) => (
        <a
          key={s.slug}
          ref={(el) => { if (el) cardRefs.current[i] = el }}
          href={`/behandelingen/${s.slug}`}
          className="group flex overflow-hidden rounded-2xl border border-border/40 bg-card focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          style={{
            position: 'sticky',
            top: `${STICKY_BASE + i * CARD_OFFSET}px`,
            zIndex: i + 1,
            willChange: 'transform, filter',
          }}
          aria-label={s.title}
        >
          {/* Portrait image */}
          <div className="relative h-48 w-[155px] shrink-0 overflow-hidden md:h-56 md:w-[190px]">
            <Image
              src={s.image}
              alt=""
              fill
              aria-hidden
              className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
              style={{ objectPosition: s.imgPos }}
              sizes="190px"
            />
          </div>

          {/* Content */}
          <div className="flex flex-1 flex-col justify-center gap-3 p-7 md:p-9">
            {s.popular && (
              <span className="inline-flex w-fit rounded-full bg-secondary px-4 py-1.5 text-[12px] font-semibold tracking-wide text-foreground/70">
                Meest populair
              </span>
            )}
            <p className="font-heading text-[26px] leading-snug tracking-tight text-foreground md:text-[30px]">
              {s.title}
            </p>
            <p className="text-[15px] leading-[1.75] text-muted-foreground">
              {s.tagline}
            </p>
            <span className="mt-1 inline-flex items-center gap-2 text-[13px] font-medium text-accent underline underline-offset-4 decoration-accent/40 transition-all duration-200 group-hover:gap-3 group-hover:decoration-accent">
              Verken behandeling <ArrowRight className="h-3.5 w-3.5" aria-hidden />
            </span>
          </div>
        </a>
      ))}
    </div>
  )
}
