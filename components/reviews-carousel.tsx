'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { ArrowLeft, ArrowRight } from 'lucide-react'

type Testimonial = {
  name: string
  location: string
  quote: string
  stars: number
  image: string
}

const testimonials: Testimonial[] = [
  {
    name: 'Sophia R.',
    location: 'Almere Buiten',
    quote: 'Zen Spa is mijn vaste plek om bij te komen. De Classic Gezichtsbehandeling liet mijn huid stralen én mijn hoofd leegmaken — precies wat ik nodig had na weken van drukte thuis en op werk.',
    stars: 5,
    image: '/hero.jpg',
  },
  {
    name: 'Yasmine K.',
    location: 'Almere Buiten',
    quote: 'Als drukke moeder van twee kinderen is Zen Spa mijn enige moment voor mezelf. Çigdem luistert écht en stemt elke behandeling op je af. Ik ga altijd een stuk lichter de deur uit.',
    stars: 5,
    image: '/bg-leaves.jpg',
  },
  {
    name: 'Fatima A.',
    location: 'Almere',
    quote: 'Na mijn Deluxe Gezichtsbehandeling en de Microneedling zie ik mijn huid écht verbeteren. Zo fijn dat dit gewoon om de hoek in Almere Buiten is — geen gedoe met reizen naar Amsterdam.',
    stars: 5,
    image: '/hero.jpg',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div role="img" className="flex gap-1" aria-label={`${count} van 5 sterren`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[22px] leading-none text-foreground" aria-hidden>★</span>
      ))}
    </div>
  )
}

export function ReviewsCarousel() {
  const [idx, setIdx] = useState(0)
  const t = testimonials[idx]
  const touchStartX = useRef<number | null>(null)

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIdx((i) => (i + 1) % testimonials.length)

  const onTouchStart = (e: React.TouchEvent) => { touchStartX.current = e.touches[0].clientX }
  const onTouchEnd   = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - touchStartX.current
    touchStartX.current = null
    if (delta < -40) next()
    else if (delta > 40) prev()
  }

  return (
    <section id="stories" className="section-fade py-24 md:py-36 lg:py-48" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-[1840px] px-5 md:px-6">

        {/* Header */}
        <div className="mb-14 flex flex-col items-center gap-5 text-center">
          <span className="text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">
            Gastervaringen
          </span>
          <h2
            id="reviews-heading"
            className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[68px] xl:text-[80px]"
          >
            Woorden van onze gasten
          </h2>
          <p className="max-w-[560px] text-[17px] leading-[1.85] text-muted-foreground">
            Echte ervaringen van mensen die kwamen ontspannen — en vertrokken als herboren.
          </p>
        </div>

        {/* Card — full section width, fixed height so slides never jump */}
        <div
          className="overflow-hidden rounded-3xl"
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        >
          <div className="grid lg:h-[680px] lg:grid-cols-[2fr_3fr]">

            {/* Left — image, fills fixed height */}
            <div className="relative min-h-[300px] md:min-h-[380px] lg:min-h-0">
              <Image
                key={idx}
                src={t.image}
                alt=""
                fill
                aria-hidden
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 700px"
              />
            </div>

            {/* Right — quote panel */}
            <div className="flex flex-col justify-between bg-foreground/[0.04] p-10 lg:p-20">

              <div className="flex flex-col gap-2 md:gap-3 lg:gap-8">
                {/* Opening quote mark */}
                <span
                  className="font-heading text-[64px] leading-[0.75] text-foreground/18 md:text-[120px]"
                  aria-hidden
                >
                  &ldquo;
                </span>

                {/* Quote — fixed min-height keeps card stable across slides */}
                <p className="min-h-[40px] font-heading text-[26px] leading-[1.35] tracking-tight md:text-[30px] lg:min-h-[160px] lg:text-[36px]">
                  {t.quote}
                </p>

                {/* Stars */}
                <Stars count={t.stars} />

                {/* Attribution */}
                <p className="text-[17px] text-foreground/68">
                  — {t.name}, {t.location}
                </p>
              </div>

              {/* Navigation row */}
              <div className="mt-6 flex items-center justify-between md:mt-10 lg:mt-0">
                <div className="flex gap-3">
                  <button
                    onClick={prev}
                    aria-label="Vorige review"
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <ArrowLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={next}
                    aria-label="Volgende review"
                    className="flex h-14 w-14 cursor-pointer items-center justify-center rounded-full border border-foreground/20 text-foreground transition-all duration-300 hover:border-foreground hover:bg-foreground hover:text-background"
                  >
                    <ArrowRight className="h-6 w-6" />
                  </button>
                </div>

                {/* Dot indicator */}
                <div className="flex items-center gap-2" aria-hidden="true">
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
                      tabIndex={-1}
                      className={`h-[5px] rounded-full transition-all duration-400 ${
                        i === idx
                          ? 'w-6 bg-foreground'
                          : 'w-[5px] bg-foreground/25 hover:bg-foreground/40'
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
