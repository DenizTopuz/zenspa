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

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

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
      <div className={cn(
        'flex items-center justify-evenly rounded-full border border-foreground/10 bg-background/95 shadow-[0_8px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-300',
        compact ? 'px-2 py-0.5 md:py-1' : 'px-3 py-1 md:py-2'
      )}>

        {/* Left two links */}
        {links.slice(0, 2).map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <a
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center rounded-full px-3 transition-all duration-300 md:gap-1 md:px-5',
                compact ? 'gap-0.5 py-0.5' : 'gap-0.5 py-1',
                active ? 'bg-accent/10 text-accent' : 'text-foreground/40'
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
          href="/#contact"
          className={cn('flex flex-col items-center transition-all duration-300', compact ? 'gap-0' : 'gap-1')}
          aria-label="Afspraak maken"
        >
          <span className={cn(
            'flex items-center justify-center rounded-full bg-accent text-white shadow-[0_4px_18px_rgba(0,0,0,0.22)] transition-all duration-300',
            compact ? 'h-8 w-8 md:h-10 md:w-10' : 'h-10 w-10 -mt-6 md:h-13 md:w-13 md:-mt-7'
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
            compact ? 'text-[0px] opacity-0 h-0' : 'text-[10px] opacity-100 md:text-[12px]'
          )}>
            Afspraak
          </span>
        </a>

        {/* Right two links */}
        {links.slice(2).map(({ href, label, icon: Icon }) => {
          const active = isActive(href)
          return (
            <a
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center rounded-full px-3 transition-all duration-300 md:gap-1 md:px-5',
                compact ? 'gap-0.5 py-0.5' : 'gap-0.5 py-1',
                active ? 'bg-accent/10 text-accent' : 'text-foreground/40'
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
