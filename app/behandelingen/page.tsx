import Image from 'next/image'
import Link from 'next/link'
import {
  ArrowUpRight, BadgeCheck, Clock, Leaf, Lock, Sparkles, Users,
} from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { FaqSection } from '@/components/faq-section'
import { Reveal } from '@/components/reveal'
import { DATA, type TabKey, type Treatment } from '@/lib/behandelingen-data'

const marqueeItems = [
  { icon: BadgeCheck, label: 'Gecertificeerd' },
  { icon: Leaf,       label: 'Natuurlijke producten' },
  { icon: Lock,       label: 'Privacy' },
  { icon: Sparkles,   label: '25+ behandelingen' },
  { icon: Clock,      label: '20+ jaar ervaring' },
  { icon: Users,      label: '1000+ tevreden klanten' },
]

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
      className="group overflow-hidden rounded-2xl border border-foreground/8 bg-card transition-all duration-300 hover:-translate-y-1.5 hover:border-foreground/18 hover:shadow-[0_8px_32px_rgba(0,0,0,0.10)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
    >
      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary/30">
        <Image
          src={t.image || '/hero.jpg'}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        />
        {t.tag && (
          <span className="absolute left-3 top-3 rounded-full bg-accent px-3 py-1 text-[12px] font-medium text-white shadow-sm">
            {t.tag}
          </span>
        )}
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="truncate font-heading text-[18px] leading-snug">{t.name}</p>
          <p className="mt-0.5 text-[13px] text-muted-foreground">{t.price}</p>
        </div>
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-foreground/15 text-foreground transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground">
          <ArrowUpRight className="h-4 w-4 transition-colors duration-300 group-hover:text-background" />
        </span>
      </div>
    </Link>
  )
}

export default function BehandelingenPage() {
  return (
    <>
      <SiteNav />
      <main>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[58vh] items-end overflow-hidden" aria-label="Behandelingen overzicht">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            aria-hidden
            priority
            className="object-cover object-center"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-black/38 to-black/78" />

          <div className="relative z-10 w-full pb-28 text-center text-white md:pb-40">
            <span className="mb-5 block text-[13px] font-semibold tracking-[0.20em] text-white/55 uppercase">
              Ons aanbod
            </span>
            <h1 className="font-heading text-[52px] leading-[1.04] tracking-tight md:text-[76px] lg:text-[92px]">
              Onze Behandelingen
            </h1>
            <p className="mx-auto mt-5 max-w-[460px] text-[17px] leading-[1.85] text-white/62">
              Elk ritueel zorgvuldig samengesteld voor jou.
            </p>
          </div>
        </section>

        {/* ── Marquee pullup ────────────────────────────────────────── */}
        <section
          aria-hidden
          className="relative z-10 -mt-20 overflow-hidden rounded-t-[80px] bg-background pb-2 md:-mt-28 md:rounded-t-[112px] md:pb-4"
        >
          <div className="relative py-12 md:py-16">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-background to-transparent md:w-72" aria-hidden />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-background to-transparent md:w-72" aria-hidden />
            <div className="marquee-track">
              {[...marqueeItems, ...marqueeItems].map((item, i) => {
                const Icon = item.icon
                return (
                  <span
                    key={i}
                    className="inline-flex shrink-0 items-center gap-5 px-10 font-heading text-[22px] text-foreground/65 md:px-16 md:text-[28px]"
                  >
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 md:h-16 md:w-16">
                      <Icon className="h-7 w-7 text-accent md:h-8 md:w-8" aria-hidden />
                    </span>
                    {item.label}
                  </span>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Category sections ─────────────────────────────────────── */}
        {CATS.map((cat, catIdx) => {
          const tabData = DATA[cat.key]
          const bg = catIdx % 2 === 1 ? 'bg-card' : ''
          return (
            <section
              key={cat.key}
              id={cat.key}
              className={`section-fade py-24 md:py-36 lg:py-44 ${bg}`}
              aria-labelledby={`${cat.key}-heading`}
            >
              <div className="mx-auto max-w-[1840px] px-4 md:px-6">

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
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:gap-5 lg:grid-cols-4">
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

        <FaqSection />
      </main>
      <SiteFooter />
    </>
  )
}
