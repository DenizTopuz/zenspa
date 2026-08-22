'use client'

import { useState, useRef, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Sparkles, User, Pen, Scissors } from 'lucide-react'
import { DATA, type TabKey, type Treatment } from '@/lib/behandelingen-data'

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'gezicht',  label: 'Gezicht',              icon: Sparkles },
  { key: 'lichaam',  label: 'Lichaam',              icon: User     },
  { key: 'pmu',      label: 'Permanente Make-up',   icon: Pen      },
  { key: 'ontharen', label: 'Ontharen',             icon: Scissors },
]

function TreatmentCard({ t }: { t: Treatment }) {
  return (
    <Link
      href={`/behandelingen/${t.slug}`}
      className="group -mx-4 flex gap-6 rounded-2xl px-4 py-5 no-underline transition-all duration-200 hover:bg-accent/[0.06] md:gap-8"
    >
      {/* Oval image — border ring + padding */}
      <div className="shrink-0 rounded-full border border-foreground/12 p-1.5">
        <div className="relative h-[152px] w-[96px] overflow-hidden rounded-full">
          <Image
            src={t.image ?? '/hero.jpg'}
            alt=""
            fill
            aria-hidden
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="96px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-start gap-3">
        {/* Name ── line ── Price */}
        <div className="flex min-w-0 items-center gap-4">
          <p className="min-w-0 font-heading text-[24px] font-semibold leading-snug md:text-[27px]">
            {t.name}
          </p>
          <div className="h-px min-w-[16px] flex-1 shrink-0 bg-foreground/15" aria-hidden />
          <p className="shrink-0 font-heading text-[24px] font-semibold md:text-[27px]">
            {t.price}
          </p>
        </div>

        {/* Description */}
        <p className="text-[16px] leading-[1.65] text-muted-foreground md:text-[17px]">
          {t.description}
        </p>

        {/* Pills */}
        {(t.duration || t.tag) && (
          <div className="flex flex-wrap gap-2">
            {t.duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/18 px-4 py-2 text-[14px] text-foreground/55">
                <Clock className="h-4 w-4" aria-hidden />
                {t.duration}
              </span>
            )}
            {t.tag && (
              <span className="inline-flex items-center rounded-full border border-accent/40 px-4 py-2 text-[14px] font-medium text-accent">
                {t.tag}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  )
}

export function Behandelingen() {
  const [active, setActive] = useState<TabKey>('gezicht')
  const tab = DATA[active]
  const activeIdx = TABS.findIndex(t => t.key === active)

  // Sliding white indicator
  const gridRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [ind, setInd] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    const measure = () => {
      const btn = btnRefs.current[activeIdx]
      const grid = gridRef.current
      if (!btn || !grid) return
      setInd({ left: btn.offsetLeft, width: btn.offsetWidth })
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [activeIdx])

  return (
    <section id="pricing" aria-labelledby="behandelingen-heading" className="section-fade py-24 md:py-36 lg:py-48">
      <div className="mx-auto max-w-[1840px] px-4 md:px-6">

        {/* Header — centered */}
        <div className="mb-14 flex flex-col items-center gap-5 text-center">
          <span className="text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">
            Ons aanbod
          </span>
          <h2
            id="behandelingen-heading"
            className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[68px] xl:text-[80px]"
          >
            Behandelingen
          </h2>
          <p className="max-w-[600px] text-[17px] leading-[1.85] text-muted-foreground">
            Professionele schoonheidsbehandelingen in Almere Buiten — van gezichtsverzorging en permanente make-up tot ontharing. Meer dan 20 jaar ervaring.
          </p>
        </div>

        {/* Tabs — sliding pill */}
        <div
          className="mx-auto mb-14 w-full rounded-full bg-accent/[0.07] p-3 sm:w-fit"
          role="tablist"
          aria-label="Behandelcategorieën"
        >
          <div ref={gridRef} className="relative grid grid-cols-2 gap-2 sm:flex sm:gap-2">
            {/* Sliding white indicator */}
            {ind && (
              <div
                aria-hidden
                className="pointer-events-none absolute inset-y-0 rounded-full bg-white shadow-md shadow-foreground/8"
                style={{
                  left:  ind.left,
                  width: ind.width,
                  transition: 'left 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
                }}
              />
            )}

            {TABS.map(({ key, label, icon: Icon }, idx) => (
              <button
                key={key}
                ref={(el) => { btnRefs.current[idx] = el }}
                role="tab"
                aria-selected={active === key}
                aria-controls={`tab-panel-${key}`}
                onClick={() => setActive(key)}
                className={`relative z-10 flex cursor-pointer items-center justify-center gap-3 whitespace-nowrap rounded-full px-4 py-5 transition-colors duration-200 hover:text-foreground sm:px-5 ${
                  active === key
                    ? 'text-accent'
                    : 'text-foreground/40 hover:bg-white/45'
                }`}
              >
                <Icon className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" aria-hidden />
                <span className="font-heading font-semibold text-[19px] leading-none sm:text-[21px]">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div
          id={`tab-panel-${active}`}
          role="tabpanel"
          key={active}
          className="animate-in fade-in duration-500 ease-out"
        >
          {tab.groups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-14' : ''}>
              {group.subtitle && (
                <p className="mb-3 text-[14px] font-semibold tracking-[0.18em] text-foreground/40 uppercase">
                  {group.subtitle}
                </p>
              )}
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-0">
                {group.items.map((t) => (
                  <TreatmentCard key={t.name} t={t} />
                ))}
              </div>
            </div>
          ))}

          {tab.footerNote && (
            <p className="mt-10 text-[13px] italic text-muted-foreground/60">
              * {tab.footerNote}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 border-t border-foreground/10 pt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-10 py-5 text-[17px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20"
          >
            Maak een afspraak
          </a>
        </div>
      </div>
    </section>
  )
}
