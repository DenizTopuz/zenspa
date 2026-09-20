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
  const [compact, setCompact] = useState(false)
  const lastY = useRef(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const linkRefs = useRef<(HTMLAnchorElement | null)[]>([null, null, null, null])
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  if (pathname.startsWith('/boeken') || pathname.startsWith('/admin')) return null

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Recompute sliding pill position when route or compact state changes
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
  }, [pathname, compact])

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY
      if (y < 20) {
        setCompact(false)
      } else if (y > lastY.current + 6) {
        setCompact(true)
      } else if (y < lastY.current - 6) {
        setCompact(false)
      }
      lastY.current = y
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  return (
    <nav
      aria-label="Paginanavigatie"
      className="fixed left-2 right-2 z-50 lg:hidden md:left-1/2 md:right-auto md:w-[520px] md:-translate-x-1/2"
      style={{ bottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
    >
      <div
        ref={containerRef}
        className={cn(
          'relative flex items-center justify-between rounded-full border border-foreground/12 bg-white shadow-[0_8px_48px_rgba(0,0,0,0.22)] backdrop-blur-xl transition-all duration-300',
          compact ? 'px-1 py-2 md:py-2.5' : 'px-1 py-3 md:py-4'
        )}
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
                'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-all duration-300 md:gap-1 md:px-5',
                compact ? 'py-2' : 'py-2.5',
                active ? 'text-accent' : 'text-foreground/55'
              )}
            >
              <Icon
                className={cn('transition-all duration-300',
                  compact ? 'h-[18px] w-[18px] md:h-[22px] md:w-[22px]' : 'h-[22px] w-[22px] md:h-[26px] md:w-[26px]'
                )}
                strokeWidth={active ? 2.3 : 1.7}
                aria-hidden
              />
              <span className={cn(
                'whitespace-nowrap leading-none tracking-wide transition-all duration-300',
                compact ? 'text-[9px] md:text-[11px]' : 'text-[11px] md:text-[13px]',
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
          className={cn(
            'relative flex flex-1 flex-col items-center gap-0.5 rounded-full px-3 transition-all duration-300 md:px-5',
            compact ? 'py-2' : 'py-2.5'
          )}
          aria-label="Afspraak maken"
        >
          {/* Invisible spacer — keeps layout height identical to other links */}
          <span
            className={cn('invisible shrink-0 transition-all duration-300',
              compact ? 'h-[18px] w-[18px] md:h-[22px] md:w-[22px]' : 'h-[22px] w-[22px] md:h-[26px] md:w-[26px]'
            )}
            aria-hidden
          />
          {/* Circle — absolutely positioned, floats above nav in normal state */}
          <span className={cn(
            'absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_20px_rgba(0,0,0,0.28)] transition-all duration-300',
            compact
              ? 'top-1/2 -translate-y-1/2 h-10 w-10 md:h-12 md:w-12'
              : '-top-5 h-12 w-12 md:-top-6 md:h-14 md:w-14'
          )}>
            <CalendarCheck
              className={cn('transition-all duration-300',
                compact ? 'h-[18px] w-[18px] md:h-[22px] md:w-[22px]' : 'h-[22px] w-[22px] md:h-[26px] md:w-[26px]'
              )}
              strokeWidth={2}
              aria-hidden
            />
          </span>
          <span className={cn(
            'leading-none tracking-wide font-semibold text-accent transition-all duration-300',
            compact ? 'text-[0px] opacity-0' : 'text-[11px] opacity-100 md:text-[13px]'
          )}>
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
                'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-all duration-300 md:gap-1 md:px-5',
                compact ? 'py-2' : 'py-2.5',
                active ? 'text-accent' : 'text-foreground/55'
              )}
            >
              <Icon
                className={cn('transition-all duration-300',
                  compact ? 'h-[18px] w-[18px] md:h-[22px] md:w-[22px]' : 'h-[22px] w-[22px] md:h-[26px] md:w-[26px]'
                )}
                strokeWidth={active ? 2.3 : 1.7}
                aria-hidden
              />
              <span className={cn(
                'whitespace-nowrap leading-none tracking-wide transition-all duration-300',
                compact ? 'text-[9px] md:text-[11px]' : 'text-[11px] md:text-[13px]',
                active ? 'font-bold' : 'font-medium'
              )}>
                {label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
