import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, CalendarDays, Sparkles, Check, ArrowUpRight } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { ReviewsCarousel } from '@/components/reviews-carousel'
import { CountUp } from '@/components/count-up'
import { BookingCTA } from '@/components/booking-cta'
import { TreatmentHero } from '@/components/treatment-hero'
import { TrustPillars } from '@/components/trust-pillars'
import { FaqSection } from '@/components/faq-section'
import { ContactSection } from '@/components/contact-section'
import { getTreatmentBySlug, getAllTreatments, getRelatedTreatments } from '@/lib/behandelingen-data'

// ─── Per-category default content ────────────────────────────────────────────
const CAT: Record<string, {
  frequency: string
  benefits: string[]
  idealFor: string[]
  pullQuote: string
  heading: string
  body: string
  steps: Array<{ title: string; description: string }>
  marquee?: string
}> = {
  Gezicht: {
    frequency: 'Elke 4–6 weken',
    benefits: ['Stralende huid', 'Diepe hydratatie', 'Verfijnde poriën'],
    idealFor: ['Droge of gecombineerde huid', 'Zichtbaar vermoeid uiterlijk', 'Eerste huidverzorgingsritueel'],
    pullQuote: 'Ideaal voor wie dagelijks de belasting van stress, zonlicht en omgeving voelt — en eindelijk een huid wil die straalt van binnenuit.',
    heading: 'Zichtbaar Resultaat voor Langdurige Straling',
    body: 'Onze gezichtsbehandelingen zijn zorgvuldig samengesteld om jouw huid op diepte te verzorgen. Met professionele producten en gerichte technieken werken onze specialisten aan een stralende, gezonde huid.',
    steps: [
      { title: 'Huidanalyse', description: 'Grondige analyse van jouw huidtype en eventuele aandachtspunten.' },
      { title: 'Reiniging & Peeling', description: 'Diepe reiniging verwijdert onzuiverheden en dode huidcellen voor een heldere basis.' },
      { title: 'Gerichte Behandeling', description: 'Masker en serum op maat voor jouw specifieke huidbehoefte en -doelen.' },
      { title: 'Afsluiting & Advies', description: 'Intensieve hydratatie en persoonlijk thuisverzorgingsadvies voor langdurig resultaat.' },
    ],
  },
  Lichaam: {
    frequency: 'Naar wens',
    benefits: ['Zijdezachte huid', 'Diepe ontspanning', 'Verbeterde doorbloeding'],
    idealFor: ['Vermoeid of gespannen lichaam', 'Ruwe of droge huid', 'Verwenmoment voor jezelf'],
    pullQuote: 'Jouw lichaam draagt alles wat jij draagt — het verdient de beste zorg en de diepste ontspanning.',
    heading: 'Echte Ontspanning voor Lichaam en Geest',
    body: 'Onze lichaamsbehandelingen combineren verwennerij met diepgaande verzorging. Elke sessie is een moment van echte rust, speciaal voor jou samengesteld.',
    steps: [
      { title: 'Intake & Voorbereiding', description: 'Kort intakegesprek over jouw wensen en eventuele gevoeligheden.' },
      { title: 'Reiniging & Exfoliatie', description: 'Zachte scrub bereidt de huid voor op optimale verzorging.' },
      { title: 'Behandeling', description: 'Gerichte behandeling met professionele producten op maat.' },
      { title: 'Afsluiting', description: 'Kalmerende hydratatie voor een zijdezacht gevoel dat de hele dag aanhoudt.' },
    ],
    marquee: 'Op maat · Kwalitatieve producten · Privé behandelkamer · Gecertificeerde specialisten · Op maat · Kwalitatieve producten · Privé behandelkamer · Gecertificeerde specialisten',
  },
  PMU: {
    frequency: '6–8 weken na touchup',
    benefits: ['Tijdloos resultaat', 'Subtiel & watervast', 'Bespaar tijd dagelijks'],
    idealFor: ['Wenkbrauwen die nagroeien', 'Gespaard opstaan', 'Subtiele, tijdloze look'],
    pullQuote: 'Tijdloze schoonheid begint met de details die je elke dag draagt — subtiel, verfijnd en altijd raak.',
    heading: 'Subtiel Resultaat dat de Tand des Tijds Doorstaat',
    body: 'Permanente make-up door gecertificeerde PMU-specialisten: subtiel, tijdloos en perfect afgestemd op jouw gezichtskenmerken en kleurtype. Huidveilige pigmenten voor een natuurlijk resultaat.',
    steps: [
      { title: 'Consultatie & Ontwerp', description: 'Uitgebreid gesprek over jouw wensen, gezichtsanalyse en kleuradvies.' },
      { title: 'Verdoving', description: 'Topicale verdoving zorgt voor een zo comfortabel mogelijke sessie.' },
      { title: 'Pigmentatie', description: 'Nauwkeurige techniek voor subtiele, natuurlijk ogende resultaten.' },
      { title: 'Nazorg & Touchup', description: 'Genezingsinstructies en gratis touchup na 6–8 weken inbegrepen.' },
    ],
  },
  Ontharen: {
    frequency: 'Elke 4–6 weken',
    benefits: ['Gladde huid', 'Snel & effectief resultaat', 'Professioneel & hygiënisch'],
    idealFor: ['Fijn of grof haar', 'Gevoelige huid', 'Alle lichaamszones'],
    pullQuote: 'Professioneel ontharen — snel, effectief en met oog voor elk detail en jouw comfort.',
    heading: 'Snel Klaar, Lang Glad',
    body: 'Professionele ontharing door ervaren specialisten, met oog voor detail en comfort. Wij werken snel en hygiënisch voor een optimaal resultaat.',
    steps: [
      { title: 'Intake', description: 'Korte controle op huidgevoeligheid en eventuele contra-indicaties.' },
      { title: 'Reiniging', description: 'De huid wordt voorbereid voor optimaal resultaat en minimale irritatie.' },
      { title: 'Ontharing', description: 'Nauwkeurige behandeling van de gewenste zones, snel en effectief.' },
      { title: 'Aftercare', description: 'Kalmerende verzorging voor een comfortabel gevoel na de behandeling.' },
    ],
  },
}

function getContent(category?: string) {
  return (category && CAT[category]) ? CAT[category] : CAT.Gezicht
}

// ─── Static params ────────────────────────────────────────────────────────────
export function generateStaticParams() {
  return getAllTreatments().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getTreatmentBySlug(slug)
  if (!t) return {}
  return { title: `${t.name} — Zen Spa`, description: t.description }
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getTreatmentBySlug(slug)
  if (!t) notFound()

  const content  = getContent(t.category)
  const related  = getRelatedTreatments(slug, 4)

  return (
    <>
      <SiteNav />
      <main>

        {/* ── 1. Hero ───────────────────────────────────────────────── */}
        <TreatmentHero t={t} />

        {/* ── 2. Trust pillars (same as homepage) ─────────────────── */}
        <TrustPillars />

        {/* ── 3. Pull quote ────────────────────────────────────────── */}
        <section className="bg-background py-10 md:py-14">
          <div className="mx-auto max-w-5xl px-5 md:px-6 text-center">
            <Reveal>
              <p className="font-heading text-[32px] leading-[1.2] tracking-tight text-foreground/80 md:text-[44px] lg:text-[54px]">
                {content.pullQuote}
              </p>
            </Reveal>
          </div>
        </section>

        {/* ── 4. Three-column info ─────────────────────────────────── */}
        <section className="bg-background py-8 md:py-10">
          <div className="mx-auto max-w-[1840px] px-5 md:px-6">
            <Reveal>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">

                {/* Duur */}
                <div className="flex flex-1 flex-col items-center gap-2 border-b border-foreground/8 px-8 py-6 text-center md:border-b-0">
                  <Clock className="h-6 w-6 text-accent" aria-hidden />
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-foreground/40 uppercase">Duur</p>
                  <p className="font-heading text-[28px] font-semibold leading-tight">
                    {t.duration ?? '—'}
                  </p>
                </div>

                <div className="hidden h-20 w-px shrink-0 bg-foreground/8 md:block" aria-hidden />

                {/* Frequentie */}
                <div className="flex flex-1 flex-col items-center gap-2 border-b border-foreground/8 px-8 py-6 text-center md:border-b-0">
                  <CalendarDays className="h-6 w-6 text-accent" aria-hidden />
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-foreground/40 uppercase">Aanbevolen frequentie</p>
                  <p className="font-heading text-[28px] font-semibold leading-tight">
                    {content.frequency}
                  </p>
                </div>

                <div className="hidden h-20 w-px shrink-0 bg-foreground/8 md:block" aria-hidden />

                {/* Voordelen */}
                <div className="flex flex-1 flex-col items-center gap-2 px-8 py-6 text-center">
                  <Sparkles className="h-6 w-6 text-accent" aria-hidden />
                  <p className="text-[11px] font-semibold tracking-[0.18em] text-foreground/40 uppercase">Voordelen</p>
                  <p className="font-heading text-[22px] font-semibold leading-snug">
                    {content.benefits.join(' · ')}
                  </p>
                </div>

              </div>
            </Reveal>
          </div>
        </section>

        {/* ── 5. Image + text ──────────────────────────────────────── */}
        <section className="bg-background pt-20 pb-16 md:pt-28 md:pb-20 lg:pt-36 lg:pb-24">
          <div className="mx-auto grid max-w-[1840px] items-center gap-14 px-5 md:px-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">

            {/* Image with stamp badge */}
            <Reveal>
              <div className="relative">
                <div className="relative aspect-square overflow-hidden rounded-[48px]">
                  <Image
                    src={t.image ?? '/hero.jpg'}
                    alt={t.name}
                    fill
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  {/* Frosted caption */}
                  <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-black/42 px-6 py-5 backdrop-blur-md md:px-8 md:py-6">
                    <Sparkles className="h-6 w-6 shrink-0 text-white/70 md:h-7 md:w-7" aria-hidden />
                    <p className="text-[15px] font-medium leading-snug text-white md:text-[17px]">
                      {content.pullQuote.split('—')[0].trim()}.
                    </p>
                  </div>
                </div>

                {/* Spinning stamp badge — right side */}
                <div className="absolute right-3 top-4 lg:-right-14 lg:top-8">
                  <div className="relative flex h-[120px] w-[120px] items-center justify-center rounded-full border border-foreground/12 bg-background shadow-xl md:h-[152px] md:w-[152px]">
                    <svg className="absolute inset-0 h-full w-full stamp-rotate" viewBox="0 0 128 128" aria-hidden>
                      <defs>
                        <path id="badge-arc" d="M 64,64 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0" />
                      </defs>
                      <text fill="currentColor" className="text-foreground/40"
                        style={{ fontSize: '8px', fontWeight: 600, letterSpacing: '0.32em' }}>
                        <textPath href="#badge-arc" startOffset="0%">ZEN SPA · RITUEEL ·</textPath>
                        <textPath href="#badge-arc" startOffset="50%">ZEN SPA · RITUEEL ·</textPath>
                      </text>
                    </svg>
                    <div className="flex flex-col items-center leading-none">
                      <span className="font-heading text-[13px] font-semibold tracking-wider text-accent uppercase">Beste</span>
                      <span className="font-heading text-[13px] font-semibold tracking-wider text-accent uppercase">keuze</span>
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>

            {/* Text */}
            <div className="flex flex-col gap-8">
              <Reveal delay={60}>
                <h2 className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[68px] xl:text-[80px]">
                  {content.heading}
                </h2>
              </Reveal>
              <Reveal delay={100}>
                <p className="text-[17px] leading-[1.85] text-muted-foreground md:text-[18px]">
                  {content.body}
                </p>
              </Reveal>
              <Reveal delay={140}>
                <ul className="flex flex-col gap-4">
                  {content.benefits.map((b, i) => (
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
                  <p className="mb-3 text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">Ideaal voor</p>
                  <p className="text-[17px] leading-[1.85] text-muted-foreground">
                    {content.idealFor.join(' · ')}
                  </p>
                </div>
              </Reveal>
            </div>

          </div>
        </section>

        {/* ── 6. Stats ─────────────────────────────────────────────── */}
        <section className="bg-background pt-10 pb-20 md:pt-12 md:pb-28">
          <div className="mx-auto max-w-[1840px] px-5 md:px-6">
            <div className="grid grid-cols-2 gap-10 md:flex md:items-start md:justify-between">
              {([
                { target: 2400, suffix: '+', label: 'Tevreden klanten' },
                { target: 98,   suffix: '%', label: 'Klanttevredenheid' },
                { target: 24,   suffix: '+', label: 'Gecertificeerde specialisten' },
                { target: 14,   suffix: '+', label: 'Jaar ervaring' },
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

        {/* ── 7. Process steps ─────────────────────────────────────── */}
        <section className="section-fade bg-secondary/25 py-24 md:py-36">
          <div className="mx-auto grid max-w-[1840px] items-center gap-14 px-5 md:px-6 lg:grid-cols-2 lg:gap-10 xl:gap-14">

            {/* Steps */}
            <div>
              <Reveal>
                <p className="mb-3 text-[11px] font-semibold tracking-[0.22em] text-accent uppercase">Ons Proces</p>
                <h2 className="font-heading text-[36px] leading-[1.1] tracking-tight md:text-[48px]">
                  Hoe Het Ritueel Werkt
                </h2>
              </Reveal>
              <div className="mt-10 flex flex-col">
                {content.steps.map((step, i) => (
                  <Reveal key={i} delay={i * 60}>
                    <div className={`flex gap-6 py-6 ${i < content.steps.length - 1 ? 'border-b border-foreground/10' : ''}`}>
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

            {/* Image */}
            <Reveal delay={80}>
              <div className="relative aspect-square overflow-hidden rounded-[48px]">
                <Image
                  src={t.image === '/hero.jpg' ? '/bg-leaves.jpg' : '/hero.jpg'}
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

        {/* ── 10. Related treatments ───────────────────────────────── */}
        <section className="section-fade bg-card py-24 md:py-32">
          <div className="mx-auto max-w-[1840px] px-5 md:px-6">
            <Reveal>
              <div className="mb-12">
                <h2 className="font-heading text-[40px] tracking-tight md:text-[54px] lg:text-[68px]">Ontdek ook</h2>
                <p className="mt-3 text-[17px] text-muted-foreground md:text-[18px]">Meer behandelingen die bij jou passen.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {related.map((r, i) => (
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

        {/* ── 13. Ontdek ook (reprise) ─────────────────────────────── */}
        <section className="section-fade bg-card py-24 md:py-32">
          <div className="mx-auto max-w-[1840px] px-5 md:px-6">
            <Reveal>
              <div className="mb-12">
                <h2 className="font-heading text-[40px] tracking-tight md:text-[54px] lg:text-[68px]">Ontdek ook</h2>
                <p className="mt-3 text-[17px] text-muted-foreground md:text-[18px]">Meer behandelingen die bij jou passen.</p>
              </div>
            </Reveal>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
              {related.map((r, i) => (
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

      </main>
      <SiteFooter bg="bg-card" />
    </>
  )
}
