'use client'

import { useState } from 'react'
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
    location: 'Almere',
    quote: 'Zen Spa voelde als een andere wereld. De Classic Gezichtsbehandeling liet mijn huid stralen en mijn geest volledig tot rust komen. Ik heb jaren niet zo goed geslapen.',
    stars: 5,
    image: '/hero.jpg',
  },
  {
    name: 'Marcus T.',
    location: 'Amsterdam',
    quote: 'De therapeuten zijn van wereldklasse en de ambiance is ongeëvenaard. Al meer dan twee jaar kom ik hier maandelijks — het is mijn favoriete moment van de maand.',
    stars: 5,
    image: '/bg-leaves.jpg',
  },
  {
    name: 'Lena M.',
    location: 'Utrecht',
    quote: 'Elk detail is doordacht — van de persoonlijke aandacht tot de warme sfeer. De meest luxueuze twee uur die ik ooit aan mezelf heb besteed.',
    stars: 5,
    image: '/hero.jpg',
  },
]

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} van 5 sterren`}>
      {Array.from({ length: count }).map((_, i) => (
        <span key={i} className="text-[22px] leading-none text-foreground" aria-hidden>★</span>
      ))}
    </div>
  )
}

export function ReviewsCarousel() {
  const [idx, setIdx] = useState(0)
  const t = testimonials[idx]

  const prev = () => setIdx((i) => (i - 1 + testimonials.length) % testimonials.length)
  const next = () => setIdx((i) => (i + 1) % testimonials.length)

  return (
    <section id="stories" className="py-24 md:py-36 lg:py-48" aria-labelledby="reviews-heading">
      <div className="mx-auto max-w-[1840px] px-4 md:px-6">

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

        {/* Card */}
        <div className="mx-auto max-w-[1280px] overflow-hidden rounded-3xl">
          <div className="grid md:grid-cols-[2fr_3fr]">

            {/* Left — image */}
            <div className="relative min-h-[280px] md:min-h-[560px]">
              <Image
                key={idx}
                src={t.image}
                alt=""
                fill
                aria-hidden
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 500px"
              />
            </div>

            {/* Right — quote panel */}
            <div className="flex flex-col justify-between gap-10 bg-foreground/[0.04] p-10 md:p-14 lg:p-16">

              <div className="flex flex-col gap-7">
                {/* Opening quote mark */}
                <span
                  className="font-heading text-[88px] leading-[0.8] text-foreground/20 md:text-[104px]"
                  aria-hidden
                >
                  &ldquo;
                </span>

                {/* Quote */}
                <p className="font-heading text-[24px] leading-[1.35] tracking-tight md:text-[28px] lg:text-[32px]">
                  {t.quote}
                </p>

                {/* Stars */}
                <Stars count={t.stars} />

                {/* Attribution */}
                <p className="text-[16px] text-foreground/50">
                  — {t.name}, {t.location}
                </p>
              </div>

              {/* Navigation row */}
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-2" aria-hidden>
                  {testimonials.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setIdx(i)}
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
