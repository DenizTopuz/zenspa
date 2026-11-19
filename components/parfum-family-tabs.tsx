'use client'

import { useEffect, useRef, useState } from 'react'
import { Citrus, Cookie, Flower2, LayoutGrid, TreePine } from 'lucide-react'
import { cn } from '@/lib/utils'
import { FAMILIES, type Family } from '@/lib/parfums-data'

type Key = Family | 'alle'

interface Props {
  value: Key
  onChange: (key: Key) => void
  total: number
  counts: Record<Family, number>
}

const ICONS: Record<Key, React.ComponentType<{ className?: string }>> = {
  alle: LayoutGrid,
  bloemig: Flower2,
  fris: Citrus,
  zoet: Cookie,
  oriental: TreePine,
}

/**
 * Zelfde look & feel als de behandeling-tabs op de homepage:
 * getinte pill-container met een wit schuivend vlak (desktop) en een groene gevulde pill (mobiel).
 */
export function ParfumFamilyTabs({ value, onChange, total, counts }: Props) {
  const tabs: Array<{ key: Key; label: string; short: string; count: number }> = [
    { key: 'alle', label: 'Alle geuren', short: 'Alle', count: total },
    ...FAMILIES.map((f) => ({ key: f.key, label: f.label, short: f.short, count: counts[f.key] })),
  ]
  const activeIdx = tabs.findIndex((t) => t.key === value)

  const btnRefs = useRef<(HTMLButtonElement | null)[]>([])
  const [ind, setInd] = useState<{ left: number; width: number; top: number; height: number } | null>(null)

  useEffect(() => {
    const measure = () => {
      const btn = btnRefs.current[activeIdx]
      if (!btn || btn.offsetWidth === 0) return
      setInd({ left: btn.offsetLeft, width: btn.offsetWidth, top: btn.offsetTop, height: btn.offsetHeight })
    }
    measure()
    window.addEventListener('resize', measure, { passive: true })
    return () => window.removeEventListener('resize', measure)
  }, [activeIdx])

  return (
    <>
      {/* Mobiel — zelfde pill-balk als de homepage */}
      <div className="flex w-full rounded-full bg-accent/10 p-1.5 sm:hidden" role="group" aria-label="Geurfamilie">
        {tabs.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onChange(t.key)}
            aria-pressed={value === t.key}
            disabled={t.count === 0 && value !== t.key}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center rounded-full py-4 text-[14px] font-semibold leading-none transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-40',
              value === t.key ? 'bg-accent text-white shadow-sm' : 'text-foreground/70'
            )}
          >
            {t.short}
          </button>
        ))}
      </div>

      {/* Desktop/tablet — getinte container met schuivend wit vlak */}
      <div
        className="mx-auto hidden w-fit max-w-full rounded-full bg-accent/[0.07] p-2.5 sm:block lg:p-3"
        role="group"
        aria-label="Geurfamilie"
      >
        <div className="relative flex gap-1 md:gap-2">
          {ind && (
            <div
              aria-hidden
              className="pointer-events-none absolute rounded-full bg-white shadow-md shadow-foreground/8 motion-reduce:!transition-none"
              style={{
                left: ind.left,
                width: ind.width,
                top: ind.top,
                height: ind.height,
                transition: 'left 0.38s cubic-bezier(0.4, 0, 0.2, 1), width 0.38s cubic-bezier(0.4, 0, 0.2, 1)',
              }}
            />
          )}
          {tabs.map((t, i) => {
            const Icon = ICONS[t.key]
            return (
              <button
                key={t.key}
                ref={(el) => {
                  btnRefs.current[i] = el
                }}
                type="button"
                aria-pressed={value === t.key}
                disabled={t.count === 0 && value !== t.key}
                onClick={() => onChange(t.key)}
                className={cn(
                  'relative z-10 flex cursor-pointer items-center justify-center gap-2 rounded-full px-3.5 py-3 transition-colors duration-200 hover:text-foreground disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent md:gap-2.5 md:px-4 md:py-3.5 lg:gap-3 lg:px-5',
                  value === t.key ? 'text-accent' : 'text-foreground/65 hover:bg-white/45'
                )}
              >
                <Icon className="h-5 w-5 shrink-0 md:h-6 md:w-6" aria-hidden />
                <span className="font-heading text-[16px] leading-none font-semibold whitespace-nowrap md:text-[18px] lg:text-[20px]">
                  <span className="lg:hidden">{t.short}</span>
                  <span className="hidden lg:inline">{t.label}</span>
                </span>
                <span className="hidden translate-y-[2px] text-[12px] leading-none font-normal text-foreground/70 md:inline">{t.count}</span>
              </button>
            )
          })}
        </div>
      </div>
    </>
  )
}
