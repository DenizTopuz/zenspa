'use client'

import { useState, useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, Sparkles, Leaf, FlaskConical, Phone, CalendarCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',              label: 'Home',     icon: Home },
  { href: '/over-mij',      label: 'Zen Spa',  icon: Sparkles },
  { href: '/behandelingen', label: 'Diensten', icon: Leaf },
  { href: '/parfums',       label: 'Parfums',  icon: FlaskConical },
  { href: '/contact',       label: 'Contact',  icon: Phone },
]

export function MobileBottomNav() {
  const pathname = usePathname()
  const [visible, setVisible] = useState(false)
  const lastY = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  if (pathname.startsWith('/boeken') || pathname.startsWith('/admin')) return null

  const isActive = (href: string) =>
    href === '/' ? pathname === '/' : pathname.startsWith(href)

  // 6 equal slots: 5 pages + the floating Afspraak CTA as the last item
  const SLOT = 100 / 6
  const slot = (i: number) => ({ left: i * SLOT, width: SLOT })
  const activePillIndex = links.findIndex(l => isActive(l.href))

  // Reset scroll reference on navigation so the nav stays visible after a page change
  useEffect(() => {
    lastY.current = window.scrollY
  }, [pathname])

  // Show on scroll up, hide on scroll down, fade in again after idle
  useEffect(() => {
    lastY.current = window.scrollY

    const handle = () => {
      const y = window.scrollY
      const prev = lastY.current

      if (y > prev + 8) {
        setVisible(false)
      } else if (y < prev - 6) {
        setVisible(true)
      }

      lastY.current = y

      // Fade in after 700ms of no scrolling
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setVisible(true), 700)
    }

    window.addEventListener('scroll', handle, { passive: true })
    return () => {
      window.removeEventListener('scroll', handle)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  return (
    <nav
      aria-label="Paginanavigatie"
      className={cn(
        'fixed bottom-0 left-0 right-0 z-50 bg-background lg:hidden',
        'border-t border-foreground/10',
        'transition-all duration-300 ease-out',
        visible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
      )}
      style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="relative flex items-stretch">

        {/* Top accent line */}
        {activePillIndex >= 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute top-0 bg-accent"
            style={{
              width: `${slot(activePillIndex).width}%`,
              height: '2px',
              left: `${slot(activePillIndex).left}%`,
              transition: 'left 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        )}

        {/* Sliding active fill */}
        {activePillIndex >= 0 && (
          <span
            aria-hidden
            className="pointer-events-none absolute inset-y-0 bg-accent/10"
            style={{
              width: `${slot(activePillIndex).width}%`,
              left: `${slot(activePillIndex).left}%`,
              transition: 'left 0.42s cubic-bezier(0.22, 1, 0.36, 1)',
            }}
          />
        )}

        {links.map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative flex flex-1 flex-col items-center justify-center gap-1 py-4 transition-colors duration-200',
                active ? 'text-accent' : 'text-foreground/70'
              )}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={active ? 2.3 : 1.7} aria-hidden />
              <span className={cn('text-[10px] leading-none tracking-wide', active ? 'font-bold' : 'font-medium')}>
                {label}
              </span>
            </Link>
          )
        })}

        {/* Laatste slot — zwevende Afspraak-knop boven de balk */}
        <a
          href="/boeken"
          aria-label="Afspraak maken"
          className="relative flex flex-1 flex-col items-center justify-end gap-1 py-4"
        >
          <span className="absolute left-1/2 -top-5 flex h-12 w-12 -translate-x-1/2 items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_20px_rgba(0,0,0,0.25)] transition-transform duration-200 active:scale-95">
            <CalendarCheck className="h-[22px] w-[22px]" strokeWidth={2} aria-hidden />
          </span>
          <span className="invisible block h-[22px] w-[22px]" aria-hidden />
          <span className="text-[10px] font-semibold leading-none tracking-wide text-accent">Afspraak</span>
        </a>

      </div>
    </nav>
  )
}
