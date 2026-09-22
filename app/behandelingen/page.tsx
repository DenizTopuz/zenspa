import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight, Clock } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { FaqSection } from '@/components/faq-section'
import { BookingCTA } from '@/components/booking-cta'
import { Reveal } from '@/components/reveal'
import { BehandelingenHero } from '@/components/behandelingen-hero'
import { DATA, type TabKey, type Treatment } from '@/lib/behandelingen-data'


const CATS: Array<{ key: TabKey; title: string; desc: string }> = [
  {
    key: 'gezicht',
    title: 'Gezichtsbehandelingen',
    desc: 'Van een snelle opfrisser tot intensieve huidverzorging — elk ritueel op maat voor jouw huid.',
  },
  {
    key: 'lichaam',
    title: 'Lichaamsbehandelingen',
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

function TreatmentCard({ t }: { t: Treatment }) {
  return (
    <Link
      href={`/behandelingen/${t.slug}`}
      className="group relative overflow-hidden transition-all duration-300 ease-out
                 focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent
                 rounded-2xl border border-foreground/8 bg-secondary/20 hover:border-accent/40 hover:bg-accent/4
                 sm:rounded-3xl sm:border-0 sm:bg-card sm:ring-1 sm:ring-inset sm:ring-foreground/12
                 sm:shadow-[0_2px_10px_rgba(0,0,0,0.07)]
                 sm:hover:-translate-y-4 sm:hover:ring-foreground/20
                 sm:hover:shadow-[0_12px_36px_rgba(0,0,0,0.13)]"
    >
      {/* Mobile: booking-style compact row */}
      <div className="flex w-full items-center sm:hidden">
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
              <p className="min-w-0 text-[15px] font-semibold leading-tight">{t.name}</p>
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
      </div>

      {/* Tablet/desktop: full card */}
      <div className="hidden sm:block">
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
            <p className="line-clamp-2 text-[17px] font-semibold leading-tight">{t.name}</p>
            <p className="mt-1 text-[16px] font-bold text-accent">{t.price}</p>
          </div>
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-foreground/20 transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground">
            <ArrowUpRight className="h-4 w-4 text-foreground transition-colors duration-300 group-hover:text-background" />
          </div>
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
        {CATS.map((cat, catIdx) => {
          const tabData = DATA[cat.key]
          return (
            <section
              key={cat.key}
              id={cat.key}
              className={`section-fade ${catIdx === 0 ? 'pt-20 pb-16 md:pt-28 md:pb-24' : 'py-16 md:py-24 lg:py-32'}`}
              aria-labelledby={`${cat.key}-heading`}
            >
              <div className="mx-auto max-w-[1840px] px-5 md:px-6">

                {/* Section heading */}
                <Reveal className="mb-16 flex flex-col items-center gap-4 text-center">
                  <h2
                    id={`${cat.key}-heading`}
                    className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[58px] lg:text-[72px]"
                  >
                    {cat.title}
                  </h2>
                  <p className="max-w-[520px] text-[17px] leading-[1.85] text-muted-foreground">
                    {cat.desc}
                  </p>
                </Reveal>

                {/* Groups (PMU has Wenkbrauwen / Ogen / Lippen sub-headings) */}
                {tabData.groups.map((group, gi) => (
                  <div key={gi} className={gi > 0 ? 'mt-20' : ''}>
                    {group.subtitle && (
                      <Reveal>
                        <h3 className="mb-8 font-heading text-[28px] tracking-tight text-foreground/70 md:text-[36px]">
                          {group.subtitle}
                        </h3>
                      </Reveal>
                    )}
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
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
