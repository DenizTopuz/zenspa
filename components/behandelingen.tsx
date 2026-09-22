'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Sparkles, User, Pen, Scissors } from 'lucide-react'
import { DATA, type TabKey, type Treatment } from '@/lib/behandelingen-data'

const TABS: { key: TabKey; label: string; labelMobile?: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'gezicht',  label: 'Gezicht',            icon: Sparkles },
  { key: 'lichaam',  label: 'Lichaam',            icon: User     },
  { key: 'pmu',      label: 'Permanente Make-up', labelMobile: 'Perm. Make-up', icon: Pen },
  { key: 'ontharen', label: 'Ontharen',           icon: Scissors },
]

function TreatmentCard({ t }: { t: Treatment }) {
  return (
    <Link
      href={`/behandelingen/${t.slug}`}
      className="group flex flex-col border-b border-foreground/[0.08] py-6 no-underline last:border-0
                 md:-mx-4 md:flex-row md:items-start md:gap-6 md:rounded-2xl md:border-b-0
                 md:px-4 md:py-5 md:transition-all md:duration-200 md:hover:bg-accent/[0.06] lg:gap-8"
    >
      {/* Mobile/tablet: short landscape banner with border ring */}
      <div className="mb-5 rounded-2xl border border-foreground/12 p-1.5 md:hidden">
        <div className="relative h-[100px] w-full overflow-hidden rounded-xl md:h-[118px]">
          <Image
            src={t.image ?? '/hero.jpg'}
            alt=""
            fill
            aria-hidden
            className="object-cover object-center transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 1024px) 100vw, 0px"
          />
        </div>
      </div>

      {/* Desktop: original oval portrait */}
      <div className="hidden shrink-0 rounded-full border border-foreground/12 p-1.5 md:block">
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
        <div className="flex min-w-0 items-center gap-4">
          <p className="min-w-0 font-heading text-[22px] font-semibold leading-snug md:text-[25px] lg:text-[24px] xl:text-[27px]">
            {t.name}
          </p>
          <div className="h-px min-w-[12px] flex-1 shrink-0 bg-foreground/15" aria-hidden />
          <p className="shrink-0 font-heading text-[22px] font-semibold md:text-[25px] lg:text-[24px] xl:text-[27px]">
            {t.price}
          </p>
        </div>
        <p className="text-[15px] leading-[1.65] text-muted-foreground md:text-[16px] xl:text-[17px]">
          {t.description}
        </p>
        {(t.duration || t.tag) && (
          <div className="mt-1 flex flex-wrap gap-2">
            {t.duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/18 px-3.5 py-1.5 text-[13px] text-foreground/70 md:px-4 md:py-2 md:text-[14px]">
                <Clock className="h-3.5 w-3.5 md:h-4 md:w-4" aria-hidden />
                {t.duration}
              </span>
            )}
            {t.tag && (
              <span className="inline-flex items-center rounded-full bg-accent px-3.5 py-1.5 text-[13px] font-semibold text-white md:px-4 md:py-2 md:text-[14px]">
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

  const panelTouchStartX = useRef<number | null>(null)
  const onPanelTouchStart = (e: React.TouchEvent) => { panelTouchStartX.current = e.touches[0].clientX }
  const onPanelTouchEnd = useCallback((e: React.TouchEvent) => {
    if (panelTouchStartX.current === null) return
    const delta = e.changedTouches[0].clientX - panelTouchStartX.current
    panelTouchStartX.current = null
    if (Math.abs(delta) < 40) return
    const dir = delta < 0 ? 1 : -1
    const newIdx = (activeIdx + dir + TABS.length) % TABS.length
    setActive(TABS[newIdx].key)
  }, [activeIdx])

  // Sticky tab bar detection
  const sentinelRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => setStuck(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  // Sliding white indicator
  const gridRef = useRef<HTMLDivElement>(null)
  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [ind, setInd] = useState<{ left: number; width: number; top: number; height: number } | null>(null)

  useEffect(() => {
    const measure = () => {
      const btn = btnRefs.current[activeIdx]
      if (!btn) return
      setInd({ left: btn.offsetLeft, width: btn.offsetWidth, top: btn.offsetTop, height: btn.offsetHeight })
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [activeIdx, stuck])

  return (
    <section id="pricing" aria-labelledby="behandelingen-heading" className="section-fade py-24 md:py-36 lg:py-48">
      <div className="mx-auto max-w-[1840px] px-5 md:px-6">

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

        {/* Sentinel — triggers sticky when scrolled past nav */}
        <div ref={sentinelRef} className="h-px" aria-hidden />

        {/* Tabs — sticky under nav on mobile/tablet when scrolled past */}
        <div
          className={cn(
            'sticky top-[64px] z-40 transition-all duration-200 lg:relative lg:top-auto lg:z-auto',
            stuck
              ? '-mx-5 bg-background/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.07)] mb-4 md:-mx-6 lg:mx-0 lg:bg-transparent lg:shadow-none lg:backdrop-blur-none lg:mb-14'
              : 'mb-8 lg:mb-14',
          )}
        >
          <div
            className={cn(
              stuck
                ? 'w-full'
                : 'mx-auto w-full rounded-2xl bg-accent/[0.07] p-2 md:p-2.5 lg:w-fit lg:rounded-full lg:p-3',
            )}
            role="tablist"
            aria-label="Behandelcategorieën"
          >
            <div
              ref={gridRef}
              className={cn(
                'relative',
                stuck
                  ? 'flex flex-row'
                  : 'grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2 lg:flex lg:gap-2',
              )}
            >
              {!stuck && ind && (
                <div
                  aria-hidden
                  className="pointer-events-none absolute rounded-xl bg-white shadow-md shadow-foreground/8 lg:rounded-full"
                  style={{
                    left:   ind.left,
                    width:  ind.width,
                    top:    ind.top,
                    height: ind.height,
                    transition: 'left 0.38s cubic-bezier(0.4, 0, 0.2, 1), top 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />
              )}

              {TABS.map(({ key, label, labelMobile, icon: Icon }, idx) => (
                <button
                  key={key}
                  ref={(el) => { btnRefs.current[idx] = el }}
                  role="tab"
                  aria-selected={active === key}
                  aria-controls={`tab-panel-${key}`}
                  onClick={() => setActive(key)}
                  className={cn(
                    'relative z-10 flex cursor-pointer items-center justify-center transition-colors duration-200',
                    stuck
                      ? 'flex-1 gap-1.5 py-3.5'
                      : 'gap-2 rounded-xl px-3 py-3 hover:text-foreground md:gap-2.5 md:rounded-full md:px-4 md:py-3.5 lg:gap-3 lg:px-5 lg:py-5',
                    active === key ? 'text-accent' : 'text-foreground/65 hover:bg-white/45',
                  )}
                >
                  <Icon
                    className={cn('shrink-0', stuck ? 'h-4 w-4' : 'h-5 w-5 md:h-6 md:w-6 lg:h-7 lg:w-7')}
                    aria-hidden
                  />
                  <span
                    className={cn(
                      'font-heading font-semibold leading-none',
                      stuck ? 'text-[12px]' : 'text-[15px] md:text-[18px] lg:text-[21px]',
                    )}
                  >
                    {stuck ? (labelMobile ?? label) : (
                      <>
                        <span className="md:hidden">{labelMobile ?? label}</span>
                        <span className="hidden md:inline">{label}</span>
                      </>
                    )}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Panel — swipeable on mobile to switch categories */}
        <div
          id={`tab-panel-${active}`}
          role="tabpanel"
          key={active}
          className="animate-in fade-in duration-500 ease-out"
          onTouchStart={onPanelTouchStart}
          onTouchEnd={onPanelTouchEnd}
        >
          {tab.groups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-14' : ''}>
              {group.subtitle && (
                <p className="mb-3 mt-6 text-[14px] font-semibold tracking-[0.18em] text-foreground/60 uppercase lg:mt-0">
                  {group.subtitle}
                </p>
              )}
              <div className="grid lg:grid-cols-2 gap-x-12">
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
            href="/boeken"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-10 py-5 text-[17px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20"
          >
            Maak een afspraak
          </a>
        </div>
      </div>
    </section>
  )
}
