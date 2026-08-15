'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Plus, Minus } from 'lucide-react'

const faqs = [
  {
    q: 'Moet ik vooraf reserveren?',
    a: 'Ja — wij adviseren minimaal 48 uur van tevoren te boeken om jouw voorkeurstijd en therapeut zeker te stellen. Same-day afspraken zijn soms beschikbaar; check de beschikbaarheid online of bel ons. Inlopen is welkom maar kan niet worden gegarandeerd.',
  },
  {
    q: 'Wat moet ik dragen tijdens mijn behandeling?',
    a: 'Comfortabele kleding die je gemakkelijk kunt uitdoen. Wij zorgen voor badjassen, handdoeken en disposables. Voor de meeste gezichtsbehandelingen blijf je volledig gekleed.',
  },
  {
    q: 'Hoe vroeg moet ik aanwezig zijn?',
    a: 'Wij vragen je om 10 tot 15 minuten voor je afspraak aanwezig te zijn, zodat je rustig kunt aankomen, een welkomstdrankje kunt nemen en de sfeer tot je door kunt laten dringen.',
  },
  {
    q: 'Wat is jullie annuleringsbeleid?',
    a: 'Annuleringen tot 24 uur voor aanvang zijn kosteloos. Bij latere annulering of no-show brengen wij 50% van de behandelkosten in rekening.',
  },
  {
    q: 'Wanneer voel ik de resultaten?',
    a: 'Veel klanten merken direct na de behandeling een verschil in huid en welbevinden. Voor behandelingen zoals Microneedling of Permanente Make-up zijn meerdere sessies aanbevolen voor het beste en meest duurzame resultaat.',
  },
]

function AccordionItem({
  q, a, open, onToggle,
}: { q: string; a: string; open: boolean; onToggle: () => void }) {
  return (
    <div className="border-b border-foreground/10">
      <button
        onClick={onToggle}
        aria-expanded={open}
        className="flex w-full items-center justify-between gap-6 py-7 text-left transition-colors duration-200 hover:text-accent"
      >
        <span className="font-heading text-[22px] font-semibold leading-snug tracking-tight md:text-[26px]">
          {q}
        </span>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/18 text-foreground/60 transition-all duration-300">
          {open
            ? <Minus className="h-4 w-4" aria-hidden />
            : <Plus  className="h-4 w-4" aria-hidden />
          }
        </span>
      </button>

      {/* Answer — height-animated via grid trick */}
      <div
        className="grid transition-all duration-400 ease-out"
        style={{ gridTemplateRows: open ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <p className="pb-7 text-[16px] leading-[1.8] text-muted-foreground md:text-[17px]">
            {a}
          </p>
        </div>
      </div>
    </div>
  )
}

export function FaqSection() {
  const [openIdx, setOpenIdx] = useState<number | null>(0)

  const toggle = (i: number) => setOpenIdx(openIdx === i ? null : i)

  return (
    <section id="faq" className="py-24 md:py-36 lg:py-48" aria-labelledby="faq-heading">
      <div className="mx-auto max-w-[1840px] px-4 md:px-6">

        {/* Heading — above the grid so the card aligns with the first question */}
        <div className="mb-12">
          <span className="mb-5 block text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">
            Veelgestelde vragen
          </span>
          <h2
            id="faq-heading"
            className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[64px]"
          >
            Alles wat je wilt weten.
          </h2>
          <p className="mt-5 max-w-[520px] text-[17px] leading-[1.85] text-muted-foreground">
            Alles wat je wilt weten voor je eerste bezoek — en een paar dingen waar je nog niet aan had gedacht.
          </p>
        </div>

        {/* Grid: accordion | card — both start at the first divider line */}
        <div className="grid items-stretch gap-12 lg:grid-cols-[3fr_2fr] lg:gap-16">

          {/* Left — accordion */}
          <div className="border-t border-foreground/10">
            {faqs.map((f, i) => (
              <AccordionItem
                key={f.q}
                q={f.q}
                a={f.a}
                open={openIdx === i}
                onToggle={() => toggle(i)}
              />
            ))}
          </div>

          {/* Right — card stretches to accordion height */}
          <div className="relative overflow-hidden rounded-3xl">
            <Image
              src="/hero.jpg"
              alt=""
              aria-hidden
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 600px"
            />
            <div className="absolute inset-0 bg-foreground/58" />

            <div className="relative flex h-full flex-col items-center justify-center gap-8 px-10 py-16 text-center text-white md:px-14">
              <p className="text-[13px] font-medium tracking-wide text-white/65">
                +31 (0)20 123 4567 · Ma–Za, 9:00–18:00
              </p>

              <h3 className="font-heading text-[36px] leading-[1.1] tracking-tight md:text-[44px]">
                Weet je niet waar<br />te beginnen?
              </h3>

              <p className="max-w-[300px] text-[16px] leading-[1.75] text-white/70">
                Ons team helpt je de juiste behandeling te vinden voor jouw huid, doelen en planning.
              </p>

              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[15px] font-medium text-foreground transition-all duration-300 hover:bg-white/90 hover:shadow-lg"
              >
                Spreek met ons team ›
              </a>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}
