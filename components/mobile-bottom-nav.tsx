'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Sparkles, Leaf, Phone, CalendarCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',              label: 'Home',     icon: Home },
  { href: '/over-mij',      label: 'Zen Spa',  icon: Sparkles },
  { href: '/behandelingen', label: 'Diensten', icon: Leaf },
  { href: '/contact',       label: 'Contact',  icon: Phone },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const lastY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([null, null, null, null])
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  if (pathname.startsWith('/boeken') || pathname.startsWith('/admin')) return null

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Sliding pill position
  useEffect(() => {
    const activeIdx = links.findIndex(l => isActive(l.href))
    const el = activeIdx >= 0 ? linkRefs.current[activeIdx] : null
    const container = containerRef.current
    if (!el || !container) { setPill(null); return }

    const update = () => {
      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      setPill({ left: eRect.left - cRect.left, width: eRect.width })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [pathname, visible])

  // Show on scroll up, hide on scroll down / near top
  useEffect(() => {
    lastY.current = window.scrollY

    const handle = () => {
      const y = window.scrollY
      const prev = lastY.current

      if (y < 80) {
        setVisible(false)
      } else if (y > prev + 6) {
        setVisible(false)
      } else if (y < prev - 6) {
        setVisible(true)
      }

      lastY.current = y
    }

    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <>
      {/* Safe-area fill — same white as the nav, only visible with the nav */}
      <div
        aria-hidden
        className={cn(
          'fixed inset-x-0 bottom-0 z-[49] bg-white lg:hidden',
          'transition-opacity duration-300',
          visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
        )}
        style={{ height: 'env(safe-area-inset-bottom, 0px)' }}
      />

      <nav
        aria-label="Paginanavigatie"
        className={cn(
          'fixed left-2 right-2 z-50 lg:hidden md:left-1/2 md:right-auto md:w-[520px] md:-translate-x-1/2',
          'transition-all duration-300 ease-out',
          visible
            ? 'translate-y-0 opacity-100'
            : 'translate-y-[calc(100%+32px)] opacity-0 pointer-events-none'
        )}
        style={{ bottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
      >
        <div
          ref={containerRef}
          className="relative flex items-center justify-between rounded-full border border-foreground/12 bg-white px-1 py-3 shadow-[0_8px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl md:py-4"
        >
          {/* Sliding active pill */}
          {pill && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-accent/10"
              style={{
                left: pill.left,
                width: pill.width - 1,
                height: 'calc(100% - 8px)',
                transition: 'left 0.48s cubic-bezier(0.22,1,0.36,1), width 0.56s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          )}

          {/* Left two links */}
          {links.slice(0, 2).map(({ href, label, icon: Icon }, i) => {
            const active = isActive(href)
            return (
              <Link
                key={href}
                href={href}
                ref={el => { linkRefs.current[i] = el }}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-3 py-2.5 transition-colors duration-200 md:px-5',
                  active ? 'text-accent' : 'text-foreground/55'
                )}
              >
                <Icon
                  className="h-[22px] w-[22px] md:h-[26px] md:w-[26px]"
                  strokeWidth={active ? 2.3 : 1.7}
                  aria-hidden
                />
                <span className={cn(
                  'whitespace-nowrap text-[11px] leading-none tracking-wide md:text-[13px]',
                  active ? 'font-bold' : 'font-medium'
                )}>
                  {label}
                </span>
              </Link>
            )
          })}

          {/* Center — Afspraak CTA */}
          <a
            href="/boeken"
            className="relative flex flex-1 flex-col items-center gap-1 rounded-full px-3 py-2.5 transition-colors duration-200 md:px-5"
            aria-label="Afspraak maken"
          >
            {/* Spacer keeps layout height equal to other links */}
            <span className="invisible h-[22px] w-[22px] shrink-0 md:h-[26px] md:w-[26px]" aria-hidden />
            {/* Floating circle — rises above nav bar */}
            <span className="absolute left-1/2 -top-5 -translate-x-1/2 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_20px_rgba(0,0,0,0.28)] md:-top-6 md:h-14 md:w-14">
              <CalendarCheck className="h-[22px] w-[22px] md:h-[26px] md:w-[26px]" strokeWidth={2} aria-hidden />
            </span>
            <span className="text-[11px] font-semibold leading-none tracking-wide text-accent md:text-[13px]">
              Afspraak
            </span>
          </a>

          {/* Right two links */}
          {links.slice(2).map(({ href, label, icon: Icon }, i) => {
            const active = isActive(href)
            const refIdx = i + 2
            return (
              <Link
                key={href}
                href={href}
                ref={el => { linkRefs.current[refIdx] = el }}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-1 rounded-full px-3 py-2.5 transition-colors duration-200 md:px-5',
                  active ? 'text-accent' : 'text-foreground/55'
                )}
              >
                <Icon
                  className="h-[22px] w-[22px] md:h-[26px] md:w-[26px]"
                  strokeWidth={active ? 2.3 : 1.7}
                  aria-hidden
                />
                <span className={cn(
                  'whitespace-nowrap text-[11px] leading-none tracking-wide md:text-[13px]',
                  active ? 'font-bold' : 'font-medium'
                )}>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
