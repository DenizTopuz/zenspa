'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import { Clock, Sparkles, User, Pen, Scissors, ArrowUpRight } from 'lucide-react'
import { DATA, type TabKey, type Treatment } from '@/lib/behandelingen-data'

const TABS: { key: TabKey; label: string; labelMobile?: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'gezicht',  label: 'Gezicht',            icon: Sparkles },
  { key: 'lichaam',  label: 'Lichaam',            icon: User     },
  { key: 'pmu',      label: 'Permanente Make-up', labelMobile: 'PMU',          icon: Pen },
  { key: 'ontharen', label: 'Ontharen',           icon: Scissors },
]

function TreatmentCard({ t }: { t: Treatment }) {
  return (
    <Link
      href={`/behandelingen/${t.slug}`}
      className="group no-underline
                 flex w-full items-center overflow-hidden rounded-2xl border border-foreground/8 bg-secondary/20 transition-colors hover:bg-accent/4 active:bg-accent/8
                 md:w-auto md:overflow-visible md:rounded-none md:border-none md:bg-transparent
                 md:items-start md:gap-6 md:py-5 md:-mx-4 md:px-4 md:transition-all md:duration-200 md:hover:bg-accent/[0.06]"
    >
      {/* Mobile: square thumb with card margin */}
      <div className="relative m-[4px] h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl md:hidden">
        <Image
          src={t.image ?? '/hero.jpg'}
          alt=""
          fill
          aria-hidden
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          style={{ objectPosition: t.objectPosition ?? 'center' }}
          sizes="72px"
        />
      </div>

      {/* Desktop: oval portrait */}
      <div className="hidden shrink-0 self-start rounded-full border border-foreground/12 p-1.5 md:block">
        <div className="relative h-[152px] w-[96px] overflow-hidden rounded-full">
          <Image
            src={t.image ?? '/hero.jpg'}
            alt=""
            fill
            aria-hidden
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            style={{ objectPosition: t.objectPosition ?? 'center' }}
            sizes="96px"
          />
        </div>
      </div>

      {/* Mobile content */}
      <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-3.5 md:hidden">
        <div className="min-w-0 flex flex-col gap-0.5">
          {t.tag && (
            <span className="self-start rounded-full bg-accent px-2 py-0.5 text-[10px] font-semibold text-white">
              {t.tag}
            </span>
          )}
          <p className="min-w-0 truncate text-[15px] font-semibold leading-tight">{t.name}</p>
          <div className="flex items-center gap-3 text-[13px] text-foreground/60">
            {t.duration && (
              <span className="flex shrink-0 items-center gap-1">
                <Clock className="h-3 w-3" aria-hidden />{t.duration}
              </span>
            )}
            <span>{t.price}</span>
          </div>
        </div>
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-foreground/18">
          <ArrowUpRight className="h-3.5 w-3.5 text-foreground/50" aria-hidden />
        </div>
      </div>

      {/* Desktop content: full layout */}
      <div className="hidden min-w-0 flex-1 flex-col justify-start gap-3 md:flex">
        <div className="flex min-w-0 items-center gap-4">
          <p className="min-w-0 font-heading text-[25px] font-semibold leading-snug lg:text-[24px] xl:text-[27px]">
            {t.name}
          </p>
          <div className="h-px min-w-[12px] flex-1 shrink-0 bg-foreground/15" aria-hidden />
          <p className="shrink-0 font-heading text-[25px] font-semibold lg:text-[24px] xl:text-[27px]">
            {t.price}
          </p>
        </div>
        <p className="text-[15px] leading-[1.65] text-muted-foreground md:text-[16px] xl:text-[17px]">
          {t.description}
        </p>
        {(t.duration || t.tag) && (
          <div className="mt-1 flex flex-wrap gap-2">
            {t.duration && (
              <span className="inline-flex items-center gap-1.5 rounded-full border border-foreground/18 px-4 py-2 text-[14px] text-foreground/70">
                <Clock className="h-4 w-4" aria-hidden />
                {t.duration}
              </span>
            )}
            {t.tag && (
              <span className="inline-flex items-center rounded-full bg-accent px-4 py-2 text-[14px] font-semibold text-white">
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
  const tabWrapRef = useRef<HTMLDivElement>(null)
  const [stuck, setStuck] = useState(false)
  const [headerH, setHeaderH] = useState(65)
  const [tabH, setTabH] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    const update = () => {
      const h = document.querySelector('header')?.getBoundingClientRect().bottom ?? 65
      setHeaderH(Math.round(h))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => { window.removeEventListener('scroll', update); window.removeEventListener('resize', update) }
  }, [])

  useEffect(() => {
    if (tabWrapRef.current) setTabH(tabWrapRef.current.offsetHeight)
  })

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth >= 640) { setStuck(false); return }
        if (!entry.isIntersecting) {
          setStuck(entry.boundingClientRect.top < 0)
        } else {
          setStuck(false)
        }
      },
      { threshold: 0 },
    )
    obs.observe(el)
    const onResize = () => { if (window.innerWidth >= 640) setStuck(false) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { obs.disconnect(); window.removeEventListener('resize', onResize) }
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

        {/* Sentinel — triggers fixed when scrolled past nav (mobile only) */}
        <div ref={sentinelRef} className="h-px" aria-hidden />

        {/* Spacer so content doesn't jump when tab bar goes fixed */}
        {stuck && <div className="sm:hidden" style={{ height: tabH || 46 }} aria-hidden />}

        {/* Inline pill tab bar (mobile, not yet stuck) */}
        <div ref={tabWrapRef} className={cn('sm:hidden', stuck ? '' : 'mb-6')}>
          {!stuck && (
            <div className="flex w-full rounded-full bg-accent/10 p-1.5">
              {TABS.map(({ key, label, labelMobile }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active === key}
                  aria-controls={`tab-panel-${key}`}
                  onClick={() => setActive(key)}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center justify-center rounded-full py-3.5 text-[13px] font-semibold leading-none transition-all duration-200',
                    active === key ? 'bg-accent text-white shadow-sm' : 'text-foreground/45',
                  )}
                >
                  {labelMobile ?? label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Portaled fixed pill tab bar (mobile, sticky) — rendered at body to escape transform ancestor */}
        {mounted && stuck && createPortal(
          <div
            className="fixed left-0 right-0 z-40 bg-background/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] px-4 py-3 sm:hidden"
            style={{ top: headerH }}
          >
            <div className="flex w-full rounded-full bg-accent/10 p-1.5">
              {TABS.map(({ key, label, labelMobile }) => (
                <button
                  key={key}
                  role="tab"
                  aria-selected={active === key}
                  aria-controls={`tab-panel-${key}`}
                  onClick={() => setActive(key)}
                  className={cn(
                    'flex flex-1 cursor-pointer items-center justify-center rounded-full py-3.5 text-[13px] font-semibold leading-none transition-all duration-200',
                    active === key ? 'bg-accent text-white shadow-sm' : 'text-foreground/45',
                  )}
                >
                  {labelMobile ?? label}
                </button>
              ))}
            </div>
          </div>,
          document.body,
        )}

        {/* ── Desktop/tablet tabs (hidden sm:block) ── */}
        <div className="hidden sm:block mb-8 lg:mb-14">
          <div
            className="mx-auto w-full rounded-2xl bg-accent/[0.07] p-2 md:p-2.5 lg:w-fit lg:rounded-full lg:p-3"
            role="tablist"
            aria-label="Behandelcategorieën"
          >
            <div
              ref={gridRef}
              className="relative grid grid-cols-2 gap-1.5 md:grid-cols-4 md:gap-2 lg:flex lg:gap-2"
            >
              {ind && (
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
                    'relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-xl px-3 py-3 transition-colors duration-200 hover:text-foreground md:gap-2.5 md:rounded-full md:px-4 md:py-3.5 lg:gap-3 lg:px-5 lg:py-5',
                    active === key ? 'text-accent' : 'text-foreground/65 hover:bg-white/45',
                  )}
                >
                  <Icon className="h-5 w-5 shrink-0 md:h-6 md:w-6 lg:h-7 lg:w-7" aria-hidden />
                  <span className="font-heading font-semibold leading-none text-[15px] md:text-[18px] lg:text-[21px]">
                    <span className="md:hidden">{labelMobile ?? label}</span>
                    <span className="hidden md:inline">{label}</span>
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
              <div className="grid gap-y-2 lg:grid-cols-2 lg:gap-x-12 lg:gap-y-0 md:gap-y-0">
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
        <div className="mt-0 border-t border-foreground/10 pt-6 text-center md:mt-16 md:pt-10">
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
