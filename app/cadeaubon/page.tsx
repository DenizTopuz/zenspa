import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { BookingCTA } from '@/components/booking-cta'
import { Reveal } from '@/components/reveal'
import { BehandelingenHero } from '@/components/behandelingen-hero'
import { GiftVoucherPicker } from '@/components/gift-voucher-picker'

export const metadata: Metadata = {
  title: 'Cadeaubon | Zen Spa Almere Buiten',
  description:
    'Geef een cadeaubon van Zen Spa cadeau: voor een behandeling of een bedrag naar keuze. Bestel eenvoudig via WhatsApp.',
}

const STEPS = [
  { title: 'Kies je cadeau', text: 'Kies een behandeling of een bedrag naar keuze.' },
  { title: 'Stuur een bericht', text: 'Je opent WhatsApp met een ingevuld bericht aan Zen Spa.' },
  { title: 'Wij regelen de rest', text: 'We stemmen samen de details van de bon af.' },
]

export default function CadeaubonPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>
        <BehandelingenHero
          eyebrow="Cadeau"
          title="Cadeaubon"
          subtitle="Een moment van rust om te geven, voor iemand die jij graag ziet."
          label="Cadeaubon"
        />

        <div className="relative z-10 -mt-20 rounded-t-[40px] bg-card md:-mt-28 md:rounded-t-[112px]">
          <section className="pt-10 pb-16 md:pt-16 md:pb-28" aria-labelledby="cadeaubon-heading">
            <div className="mx-auto max-w-[1080px] px-5 md:px-6">
              <Reveal className="mb-10 flex flex-col items-center gap-3 text-center md:mb-14">
                <h2 id="cadeaubon-heading" className="font-heading text-[36px] leading-[1.05] tracking-tight md:text-[48px]">
                  Geef een cadeaubon cadeau
                </h2>
                <p className="max-w-[560px] text-[16px] leading-[1.7] text-muted-foreground">
                  Mooi voor de feestdagen, een verjaardag of gewoon omdat het kan. Vraag ook naar onze actuele kerstactie.
                </p>
              </Reveal>

              {/* Stappen links, keuzeblok rechts: één geheel */}
              <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)] lg:gap-16">
                <Reveal>
                  <ol className="mx-auto flex max-w-[460px] flex-col gap-8 lg:mx-0 lg:pt-4">
                    {STEPS.map((s, i) => (
                      <li key={s.title} className="flex gap-5">
                        <span className="grid size-11 shrink-0 place-items-center rounded-full bg-accent font-heading text-[22px] leading-none text-white">
                          {i + 1}
                        </span>
                        <div className="pt-0.5">
                          <h3 className="font-heading text-[26px] leading-tight">{s.title}</h3>
                          <p className="mt-1.5 text-[16px] leading-relaxed text-foreground/75">{s.text}</p>
                        </div>
                      </li>
                    ))}
                  </ol>
                </Reveal>

                <Reveal delay={90}>
                  <GiftVoucherPicker />
                </Reveal>
              </div>
            </div>
          </section>
        </div>

        <BookingCTA underFooter />
      </main>
      <SiteFooter overlap />
    </>
  )
}
