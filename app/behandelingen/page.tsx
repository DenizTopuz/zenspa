import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { FaqSection } from '@/components/faq-section'
import { BookingCTA } from '@/components/booking-cta'
import { Reveal } from '@/components/reveal'
import { BehandelingenHero } from '@/components/behandelingen-hero'
import { BehandelingenPageTabs } from '@/components/behandelingen-page-tabs'
import { DATA, type TabKey, type Treatment } from '@/lib/behandelingen-data'


const CATS: Array<{ key: TabKey; title: string; mobileTitle?: string; desc: string }> = [
  {
    key: 'gezicht',
    title: 'Gezichtsbehandelingen',
    mobileTitle: 'Gezicht',
    desc: 'Van een snelle opfrisser tot intensieve huidverzorging — elk ritueel op maat voor jouw huid.',
  },
  {
    key: 'lichaam',
    title: 'Lichaamsbehandelingen',
    mobileTitle: 'Lichaam',
    desc: 'Verwennende behandelingen voor een zijdezachte huid en diepgaande ontspanning.',
  },
  {
    key: 'pmu',
    title: 'Permanente Make-up',
    desc: 'Subtiele, tijdloze pigmentatie door gecertificeerde specialisten — wenkbrauwen, ogen en lippen.',
  },
  {
    key: 'ontharen',
    title: 'Ontharen',
    desc: 'Snel en professioneel ontharen met oog voor detail en comfort.',
  },
]

// Mobile-only compact card — matches the /boeken treatment selection style
function MobileRow({ t }: { t: Treatment }) {
  return (
    <Link
      href={`/behandelingen/${t.slug}`}
      className="flex w-full items-center overflow-hidden rounded-2xl border border-foreground/8 bg-secondary/20 transition-colors hover:bg-accent/4 active:bg-accent/8"
    >
      <div className="relative m-[4px] h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
        <Image
          src={t.image || '/hero.jpg'}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center"
          sizes="72px"
        />
      </div>
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-3.5">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-2">
            <p className="min-w-0 truncate text-[15px] font-semibold leading-tight">{t.name}</p>
            {t.tag && (
              <span className="shrink-0 rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-semibold text-accent">
                {t.tag}
              </span>
            )}
          </div>
          <div className="mt-0.5 flex items-center gap-3 text-[13px] text-foreground/60">
            {t.duration && (
              <span className="flex items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />{t.duration}
              </span>
            )}
            <span>{t.price}</span>
          </div>
        </div>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-foreground/18">
          <ArrowUpRight className="h-3.5 w-3.5 text-foreground/50" />
        </div>
      </div>
    </Link>
  )
}

// Desktop/tablet card
function TreatmentCard({ t }: { t: Treatment }) {
  return (
    <Link
      href={`/behandelingen/${t.slug}`}
      className="group relative overflow-hidden rounded-3xl bg-card
                 ring-1 ring-inset ring-foreground/12
                 shadow-[0_2px_10px_rgba(0,0,0,0.07)]
                 transition-all duration-300 ease-out
                 hover:-translate-y-4 hover:ring-foreground/20
                 hover:shadow-[0_12px_36px_rgba(0,0,0,0.13)]
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-t-3xl">
        <Image
          src={t.image || '/hero.jpg'}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/68 via-black/26 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        {t.tag && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-white shadow-md">
            {t.tag}
          </span>
        )}
      </div>
      <div className="flex items-center justify-between gap-3 rounded-b-3xl bg-secondary/50 p-5">
        <div className="min-w-0">
          <p className="truncate text-[17px] font-semibold leading-tight">{t.name}</p>
          <p className="mt-1 text-[16px] font-bold text-accent">{t.price}</p>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground">
          <ArrowUpRight className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-background" />
        </div>
      </div>
    </Link>
  )
}

export default function BehandelingenPage() {
  return (
    <>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <BehandelingenHero />

        {/* ── Category sections (rounded pullup over hero) ──────────── */}
        <div className="relative z-10 -mt-20 rounded-t-[40px] bg-card md:-mt-28 md:rounded-t-[112px]">

        {/* Sticky tab nav — mobile only, rendered as direct card children for correct sticky scope */}
        <BehandelingenPageTabs />

        {CATS.map((cat, catIdx) => {
          const tabData = DATA[cat.key]
          return (
            <section
              key={cat.key}
              id={cat.key}
              className={`section-fade scroll-mt-[155px] sm:scroll-mt-24 lg:scroll-mt-0 ${catIdx === 0 ? 'pt-6 pb-10 md:pt-12 md:pb-24 lg:pt-28' : 'py-8 md:py-24 lg:py-32'}`}
              aria-labelledby={`${cat.key}-heading`}
            >
              <div className="mx-auto max-w-[1840px] px-5 md:px-6">

                {/* Section heading */}
                <Reveal className="mb-6 flex flex-col items-start gap-4 text-left sm:items-center sm:text-center sm:mb-12 lg:mb-16">
                  <h2
                    id={`${cat.key}-heading`}
                    className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[58px] lg:text-[72px]"
                  >
                    <span className="sm:hidden">{cat.mobileTitle ?? cat.title}</span>
                    <span className="hidden sm:inline">{cat.title}</span>
                  </h2>
                  <p className="hidden sm:block max-w-[520px] text-[17px] leading-[1.85] text-muted-foreground">
                    {cat.desc}
                  </p>
                </Reveal>

                {/* Groups (PMU has Wenkbrauwen / Ogen / Lippen sub-headings) */}
                {tabData.groups.map((group, gi) => (
                  <div key={gi} className={gi > 0 ? 'mt-8 sm:mt-20' : ''}>
                    {group.subtitle && (
                      <Reveal>
                        <h3 className="mb-6 font-heading text-[24px] tracking-tight text-foreground/70 sm:mb-8 sm:text-[28px] md:text-[36px]">
                          {group.subtitle}
                        </h3>
                      </Reveal>
                    )}

                    {/* Mobile: individual cards without Reveal (avoids ghost borders from opacity:0) */}
                    <div className="flex flex-col gap-2 sm:hidden">
                      {group.items.map((t) => (
                        <MobileRow key={t.slug} t={t} />
                      ))}
                    </div>

                    {/* Desktop/tablet: grid with Reveal animation */}
                    <div className="hidden sm:grid sm:grid-cols-2 sm:gap-4 lg:grid-cols-4 lg:gap-6">
                      {group.items.map((t, ti) => (
                        <Reveal key={t.slug} delay={ti * 55}>
                          <TreatmentCard t={t} />
                        </Reveal>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Footer note (e.g. mondkapje bij ontharen) */}
                {tabData.footerNote && (
                  <p className="mt-10 text-[14px] italic text-muted-foreground">
                    * {tabData.footerNote}
                  </p>
                )}
              </div>
            </section>
          )
        })}
        </div>

        <BookingCTA />
        <FaqSection />
      </main>
      <SiteFooter />
    </>
  )
}
