'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
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
      className="fixed left-2 right-2 z-50 lg:hidden"
      style={{ bottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}
    >
      <div
        ref={containerRef}
        className={cn(
          'relative flex items-center justify-between rounded-full border border-foreground/10 bg-background/95 shadow-[0_8px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-300',
          compact ? 'px-1 py-0.5 md:py-1' : 'px-1 py-1 md:py-2'
        )}
      >
        {/* Sliding active pill */}
        {pill && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-accent/10 transition-all duration-300"
            style={{ left: pill.left, width: pill.width, height: 'calc(100% - 8px)' }}
          />
        )}

        {/* Left two links */}
        {links.slice(0, 2).map(({ href, label, icon: Icon }, i) => {
          const active = isActive(href)
          return (
            <a
              key={href}
              href={href}
              ref={el => { linkRefs.current[i] = el }}
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-full px-3 transition-all duration-300 md:gap-1 md:px-5',
                compact ? 'py-0.5' : 'py-1',
                active ? 'text-accent' : 'text-foreground/40'
              )}
            >
              <Icon
                className={cn('transition-all duration-300',
                  compact ? 'h-[16px] w-[16px] md:h-[20px] md:w-[20px]' : 'h-[19px] w-[19px] md:h-[24px] md:w-[24px]'
                )}
                strokeWidth={active ? 2.3 : 1.7}
                aria-hidden
              />
              <span className={cn(
                'whitespace-nowrap leading-none tracking-wide transition-all duration-300',
                compact ? 'text-[8px] md:text-[10px]' : 'text-[10px] md:text-[12px]',
                active ? 'font-bold' : 'font-medium'
              )}>
                {label}
              </span>
            </a>
          )
        })}

        {/* Center — Afspraak CTA */}
        <a
          href="/boeken"
          className={cn(
            'relative flex flex-col items-center gap-0.5 rounded-full px-3 transition-all duration-300 md:px-5',
            compact ? 'py-0.5' : 'py-1'
          )}
          aria-label="Afspraak maken"
        >
          {/* Invisible spacer — keeps layout height identical to other links */}
          <span
            className={cn('invisible shrink-0 transition-all duration-300',
              compact ? 'h-[16px] w-[16px] md:h-[20px] md:w-[20px]' : 'h-[19px] w-[19px] md:h-[24px] md:w-[24px]'
            )}
            aria-hidden
          />
          {/* Circle — absolutely positioned, floats above nav in normal state */}
          <span className={cn(
            'absolute left-1/2 -translate-x-1/2 flex items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_18px_rgba(0,0,0,0.22)] transition-all duration-300',
            compact
              ? 'top-1/2 -translate-y-1/2 h-8 w-8 md:h-10 md:w-10'
              : '-top-4 h-10 w-10 md:-top-5 md:h-13 md:w-13'
          )}>
            <CalendarCheck
              className={cn('transition-all duration-300',
                compact ? 'h-[16px] w-[16px] md:h-[20px] md:w-[20px]' : 'h-[19px] w-[19px] md:h-[24px] md:w-[24px]'
              )}
              strokeWidth={2}
              aria-hidden
            />
          </span>
          <span className={cn(
            'leading-none tracking-wide font-semibold text-accent transition-all duration-300',
            compact ? 'text-[0px] opacity-0' : 'text-[10px] opacity-100 md:text-[12px]'
          )}>
            Afspraak
          </span>
        </a>

        {/* Right two links */}
        {links.slice(2).map(({ href, label, icon: Icon }, i) => {
          const active = isActive(href)
          const refIdx = i + 2
          return (
            <a
              key={href}
              href={href}
              ref={el => { linkRefs.current[refIdx] = el }}
              className={cn(
                'relative flex flex-col items-center gap-0.5 rounded-full px-3 transition-all duration-300 md:gap-1 md:px-5',
                compact ? 'py-0.5' : 'py-1',
                active ? 'text-accent' : 'text-foreground/40'
              )}
            >
              <Icon
                className={cn('transition-all duration-300',
                  compact ? 'h-[16px] w-[16px] md:h-[20px] md:w-[20px]' : 'h-[19px] w-[19px] md:h-[24px] md:w-[24px]'
                )}
                strokeWidth={active ? 2.3 : 1.7}
                aria-hidden
              />
              <span className={cn(
                'whitespace-nowrap leading-none tracking-wide transition-all duration-300',
                compact ? 'text-[8px] md:text-[10px]' : 'text-[10px] md:text-[12px]',
                active ? 'font-bold' : 'font-medium'
              )}>
                {label}
              </span>
            </a>
          )
        })}
      </div>
    </nav>
  )
}
