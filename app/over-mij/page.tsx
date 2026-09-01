import Image from 'next/image'
import Link from 'next/link'
import { Clock, CalendarDays, Sparkles, Check, ArrowUpRight } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { ReviewsCarousel } from '@/components/reviews-carousel'
import { CountUp } from '@/components/count-up'
import { BookingCTA } from '@/components/booking-cta'
import { TrustPillars } from '@/components/trust-pillars'
import { FaqSection } from '@/components/faq-section'
import { ContactSection } from '@/components/contact-section'
import { OverMijHero } from '@/components/over-mij-hero'
import { getAllTreatments } from '@/lib/behandelingen-data'

export const metadata = {
  title: 'Over mij — Zen Spa',
  description: 'Maak kennis met de gedreven specialist achter Zen Spa. Meer dan 20 jaar ervaring in huidverzorging, permanente make-up en wellness.',
}

const steps = [
  { title: 'Persoonlijke intake', description: 'Elk bezoek begint met een gesprek. Jouw huid, doelen en wensen staan centraal.' },
  { title: 'Op maat samengesteld', description: 'Geen standaard protocol — elk ritueel wordt afgestemd op jou, dat moment, die huid.' },
  { title: 'Vakkundige uitvoering', description: 'Met gecertificeerde technieken en hoogwaardige producten voor zichtbaar resultaat.' },
  { title: 'Nazorg & advies', description: 'Na elke behandeling krijg je persoonlijk advies om het resultaat thuis te onderhouden.' },
]

export default function OverMijPage() {
  const treatments = getAllTreatments().slice(0, 4)

  return (
    <>
      <SiteNav />
      <main>

        {/* ── 1. Hero ───────────────────────────────────────────────── */}
        <OverMijHero />

        {/* ── 2. Trust pillars ─────────────────────────────────────── */}
        <TrustPillars />

        {/* ── 3. Pull quote ────────────────────────────────────────── */}
        <section className="section-fade bg-background py-10 md:py-14">
          <div className="mx-auto max-w-5xl px-4 md:px-6 text-center">
            <Reveal>
              <p className="font-heading text-[32px] leading-[1.2] tracking-tight text-foreground/80 md:text-[44px] lg:text-[54px]">
                Schoonheid is geen masker — het is de zorg die je jezelf gunt, dag na dag.
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 4. Three-column info ─────────────────────────────────── */}
        <section className="section-fade bg-background py-8 md:py-10">
          <div className="mx-auto max-w-[1840px] px-4 md:px-6">
            <div className="grid grid-cols-1 gap-0 divide-y divide-foreground/8 md:grid-cols-3 md:divide-x md:divide-y-0">
              {[
                {
                  icon: <Clock className="h-7 w-7 text-accent" aria-hidden />,
                  title: 'Rituelen sinds 2004',
                  body: 'Meer dan 20 jaar toewijding aan huidverzorging, welzijn en het herstel van balans.',
                },
                {
                  icon: <CalendarDays className="h-7 w-7 text-accent" aria-hidden />,
                  title: 'Vertrouwd door 1000+ klanten',
                  body: 'Gecertificeerde specialisten die elke sessie persoonlijk afstemmen op jouw doelen.',
                },
                {
                  icon: <Sparkles className="h-7 w-7 text-accent" aria-hidden />,
                  title: 'Jouw welzijn, mijn roeping',
                  body: 'Elk ritueel is ontworpen vanuit één intentie — jou volledig in balans brengen.',
                },
              ].map((col, i) => (
                <Reveal key={i} delay={i * 60}>
                  <div className="flex flex-col items-center gap-3 px-8 py-6 text-center">
                    <div className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/20 bg-accent/6">
                      {col.icon}
                    </div>
                    <p className="font-heading text-[20px] font-semibold leading-snug tracking-tight md:text-[22px]">{col.title}</p>
                    <p className="max-w-[280px] text-[15px] leading-[1.75] text-muted-foreground">{col.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. Image + text ──────────────────────────────────────── */}
        <section className="section-fade bg-background pt-20 pb-16 md:pt-28 md:pb-20 lg:pt-36 lg:pb-24">
          <div className="mx-auto grid max-w-[1840px] items-center gap-14 px-4 md:px-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">

            <Reveal>
              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-[48px]">
                  <Image
                    src="/hero.jpg"
                    alt="Zen Spa specialist"
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-black/42 px-6 py-5 backdrop-blur-md md:px-8 md:py-6">
                    <Sparkles className="h-6 w-6 shrink-0 text-white/70 md:h-7 md:w-7" aria-hidden />
                    <p className="text-[15px] font-medium leading-snug text-white md:text-[17px]">
                      Gecertificeerd in huidverzorging, PMU en wellness.
                    </p>
                  </div>
                </div>
                <div className="absolute right-3 top-4 lg:-right-14 lg:top-8">
                  <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full border border-foreground/12 bg-background shadow-xl md:h-[152px] md:w-[152px]">
                    <svg className="absolute inset-0 h-full w-full stamp-rotate" viewBox="0 0 128 128" aria-hidden>
                      <defs>
                        <path id="about-arc" d="M 64,64 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                      </defs>
                      <text fill="currentColor" className="text-foreground/40"
                        style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.32em' }}>
                        <textPath href="#about-arc" startOffset="0%">ZEN SPA · ALMERE ·</textPath>
                        <textPath href="#about-arc" startOffset="50%">ZEN SPA · ALMERE ·</textPath>
                      </text>
                    </svg>
                    <div className="flex flex-col items-center leading-none">
                      <span className="font-heading text-[20px] font-black tracking-wide text-accent">20+</span>
                      <span className="font-heading text-[13px] font-black tracking-widest text-accent uppercase">jaar</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            <div className="flex flex-col gap-8">
              <Reveal delay={60}>
                <h2 className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[68px] xl:text-[80px]">
                  Passie voor huidverzorging en welzijn
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-[17px] leading-[1.85] text-muted-foreground md:text-[18px]">
                  Zen Spa is opgericht vanuit een diepe passie voor schoonheid en welzijn. Met meer dan 20 jaar ervaring in de schoonheidsbranche combineer ik vakmanschap met een persoonlijke aanpak — zodat jij je écht gezien en verzorgd voelt.
                </p>
              </Reveal>
              <Reveal delay={140}>
                <ul className="flex flex-col gap-4">
                  {['Gecertificeerd huidtherapeut', 'Specialist permanente make-up', 'Erkend wellness-specialist'].map((b, i) => (
                    <li key={i} className="flex items-center gap-4 text-[17px]">
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent">
                        <Check className="h-3.5 w-3.5" aria-hidden />
                      </span>
                      {b}
                    </li>
                  ))}
                </ul>
              </Reveal>
              <Reveal delay={190}>
                <div className="border-t border-foreground/10 pt-6">
                  <p className="mb-3 text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">Mijn missie</p>
                  <p className="text-[17px] leading-[1.85] text-muted-foreground">
                    Elke klant verdient persoonlijke aandacht en een behandeling die écht bij haar of hem past. Dat is de kern van Zen Spa.
                  </p>
                </div>
              </Reveal>
            </div>

          </div>
        </section>

        {/* ── 6. Stats ─────────────────────────────────────────────── */}
        <section className="section-fade bg-background pt-10 pb-20 md:pt-12 md:pb-28">
          <div className="mx-auto max-w-[1840px] px-4 md:px-6">
            <div className="grid grid-cols-2 gap-10 md:flex md:items-start md:justify-between">
              {([
                { target: 2400, suffix: '+', label: 'Tevreden klanten' },
                { target: 98,   suffix: '%', label: 'Klanttevredenheid' },
                { target: 25,   suffix: '+', label: 'Behandelingen' },
                { target: 20,   suffix: '+', label: 'Jaar ervaring' },
              ] as const).map(({ target, suffix, label }, i) => (
                <Reveal key={label} delay={i * 90}>
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-3">
                      <span className="font-heading text-[52px] leading-none tracking-tight md:text-[64px] lg:text-[76px]">
                        <CountUp target={target} suffix={suffix} />
                      </span>
                      <span className="text-[28px] text-accent md:text-[34px]" aria-hidden>↑</span>
                    </div>
                    <p className="text-[16px] text-muted-foreground md:text-[18px]">{label}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. Werkwijze ─────────────────────────────────────────── */}
        <section className="section-fade bg-secondary/25 py-24 md:py-36">
          <div className="mx-auto grid max-w-[1840px] items-center gap-14 px-4 md:px-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">
            <div>
              <Reveal>
                <p className="mb-3 text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">Mijn werkwijze</p>
                <h2 className="font-heading text-[36px] leading-[1.1] tracking-tight md:text-[48px]">
                  Zo werk ik met jou
                </h2>
              </Reveal>
              <div className="mt-10 flex flex-col">
                {steps.map((step, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className={`flex gap-6 py-6 ${i < steps.length - 1 ? 'border-b border-foreground/10' : ''}`}>
                      <span className="shrink-0 font-heading text-[17px] font-semibold text-foreground/30 md:text-[19px]">
                        0{i + 1}
                      </span>
                      <div>
                        <p className="font-heading text-[24px] font-semibold leading-snug md:text-[28px]">{step.title}</p>
                        <p className="mt-2 text-[17px] leading-[1.75] text-muted-foreground md:text-[18px]">{step.description}</p>
                      </div>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <Reveal delay={80}>
              <div className="relative aspect-square overflow-hidden rounded-[48px]">
                <Image
                  src="/bg-leaves.jpg"
                  alt=""
                  fill
                  aria-hidden
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 8. Reviews ───────────────────────────────────────────── */}
        <ReviewsCarousel />

        {/* ── 9. Booking CTA ───────────────────────────────────────── */}
        <BookingCTA />

        {/* ── 10. Behandelingen ────────────────────────────────────── */}
        <section className="section-fade bg-card py-24 md:py-32">
          <div className="mx-auto max-w-[1840px] px-4 md:px-6">
            <Reveal>
              <div className="mb-12">
                <h2 className="font-heading text-[40px] tracking-tight md:text-[54px] lg:text-[68px]">Ontdek ook</h2>
                <p className="mt-3 text-[17px] text-muted-foreground md:text-[18px]">Meer behandelingen die bij jou passen.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {treatments.map((r, i) => (
                <Reveal key={r.slug} delay={i * 55}>
                  <Link
                    href={`/behandelingen/${r.slug}`}
                    className="group relative overflow-hidden rounded-3xl bg-card
                               ring-1 ring-inset ring-foreground/12
                               shadow-[0_2px_10px_rgba(0,0,0,0.07)]
                               transition-all duration-300 ease-out
                               hover:-translate-y-4 hover:ring-foreground/20
                               hover:shadow-[0_12px_36px_rgba(0,0,0,0.13)]
                               focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  >
                    <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
                      <Image src={r.image || '/hero.jpg'} alt="" fill aria-hidden
                        className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                      <div className="absolute inset-0 bg-gradient-to-b from-black/68 via-black/26 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                      {r.tag && (
                        <span className="absolute left-3 top-3 z-10 rounded-full bg-accent px-3 py-1 text-[12px] font-semibold text-white shadow-md">
                          {r.tag}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center justify-between gap-3 bg-secondary/50 p-4 rounded-b-3xl">
                      <div className="min-w-0">
                        <p className="line-clamp-2 text-[15px] font-semibold leading-tight">{r.name}</p>
                        <p className="mt-0.5 text-[14px] font-bold text-accent">{r.price}</p>
                      </div>
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground">
                        <ArrowUpRight className="h-3.5 w-3.5 text-foreground transition-colors duration-300 group-hover:text-background" />
                      </div>
                    </div>
                  </Link>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── 11. FAQ ──────────────────────────────────────────────── */}
        <FaqSection />

        {/* ── 12. Contact form ─────────────────────────────────────── */}
        <ContactSection />

      </main>
      <SiteFooter bg="bg-background" />
    </>
  )
}
