'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname } from 'next/navigation'
import { Menu } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * Mobiel: één zwevende menuknop rechtsonder (binnen duimbereik).
 * Opent het schermvullende menu uit SiteNav via een event.
 *
 * Tijdens het scrollen glijdt de knop als een druppel naar rechts en blijft als een
 * klein randje zichtbaar (en aantikbaar). Pas na een rustmoment (IDLE_MS) of bovenaan
 * de pagina glijdt hij soepel terug.
 */
/** Rusttijd zonder scrollen voordat de knop weer verschijnt */
const IDLE_MS = 2200

export function MobileBottomNav() {
  const pathname = usePathname()
  const [tucked, setTucked] = useState(false)
  const lastY = useRef(0)
  const idleTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    lastY.current = window.scrollY
    setTucked(false)
  }, [pathname])

  useEffect(() => {
    lastY.current = window.scrollY

    const handle = () => {
      const y = window.scrollY
      const prev = lastY.current

      if (y < 80) {
        setTucked(false)
      } else if (Math.abs(y - prev) > 3) {
        // Tijdens het scrollen (omhoog én omlaag) blijft de knop opgeborgen
        setTucked(true)
      }
      lastY.current = y

      // Pas na een rustmoment weer tonen (lezers pauzeren vaak 1-2 seconden)
      if (idleTimer.current) clearTimeout(idleTimer.current)
      idleTimer.current = setTimeout(() => setTucked(false), IDLE_MS)
    }

    window.addEventListener('scroll', handle, { passive: true })
    return () => {
      window.removeEventListener('scroll', handle)
      if (idleTimer.current) clearTimeout(idleTimer.current)
    }
  }, [])

  // Pagina's zonder eigen menu (SiteNav) of met een eigen flow
  if (pathname.startsWith('/boeken') || pathname.startsWith('/admin') || pathname.startsWith('/annuleren')) return null

  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('zenspa:open-menu'))}
      aria-label="Open menu"
      aria-haspopup="dialog"
      className={cn(
        'fixed right-0 z-50 flex h-14 w-14 origin-right items-center justify-center rounded-full bg-primary text-primary-foreground ring-1 ring-white/20 lg:hidden',
        'transition-[transform,opacity,box-shadow] motion-reduce:transition-none',
        tucked
          ? 'duration-500 ease-[cubic-bezier(0.5,0,0.2,1)] opacity-80 shadow-[0_4px_14px_rgba(33,35,27,0.18)]'
          : 'duration-[650ms] ease-[cubic-bezier(0.22,1.2,0.36,1)] opacity-100 shadow-[0_8px_28px_rgba(33,35,27,0.28)] active:scale-95'
      )}
      style={{
        bottom: 'calc(env(safe-area-inset-bottom, 0px) + 16px)',
        // Tonen: 16px van de rand. Opgeborgen: smaller (druppel, 45px breed) met ~17px zichtbaar aan de rand.
        transform: tucked ? 'translateX(28px) scaleX(0.8)' : 'translateX(-16px)',
      }}
    >
      <Menu className="h-6 w-6" strokeWidth={1.7} aria-hidden />
    </button>
  )
}
