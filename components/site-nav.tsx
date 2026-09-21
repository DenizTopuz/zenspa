'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ZenSpaLogo } from '@/components/logo'
import { Phone, Mail, CalendarCheck } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',               label: 'Home' },
  { href: '/over-mij',       label: 'Zen Spa' },
  { href: '/behandelingen',  label: 'Behandelingen' },
  { href: '/contact',        label: 'Contact' },
]

export function SiteNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const lightBg = pathname.startsWith('/boeken')
  const dark = scrolled || lightBg

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    const sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;'
    document.body.prepend(sentinel)

    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinel)

    const handle = () => {
      const y = window.scrollY || document.documentElement.scrollTop
      setScrolled(y > 60)
    }
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    window.addEventListener('touchmove', handle, { passive: true })
    window.addEventListener('touchend', handle, { passive: true })

    return () => {
      obs.disconnect()
      sentinel.remove()
      window.removeEventListener('scroll', handle)
      window.removeEventListener('touchmove', handle)
      window.removeEventListener('touchend', handle)
    }
  }, [])

  return (
    <>
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 md:px-6 md:pt-5',
        !dark && 'px-4 pt-4'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1840px] items-center backdrop-blur-lg transition-all duration-500',
          dark
            ? 'border-b border-foreground/10 bg-background py-3 pl-5 pr-4 shadow-[0_2px_16px_rgba(0,0,0,0.08)] md:rounded-[100px] md:border md:bg-white md:py-4 md:pl-10 md:pr-4 md:shadow-[0_4px_32px_rgba(0,0,0,0.10)]'
            : 'rounded-[100px] border border-white/30 bg-white/18 py-3 pl-3 pr-2 shadow-[0_2px_20px_rgba(0,0,0,0.06)] md:py-4 md:pl-10 md:pr-4'
        )}
      >
        {/* Left — nav links (desktop only) */}
        <nav className="hidden flex-1 items-center gap-10 lg:flex" aria-label="Primaire navigatie">
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              className={cn(
                'relative whitespace-nowrap text-[19px] transition-colors duration-300',
                'after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-[650ms] after:ease-out hover:after:w-full',
                isActive(l.href)
                  ? cn('font-bold', dark ? 'text-foreground' : 'text-white')
                  : cn('font-medium', dark ? 'text-foreground/65 hover:text-foreground' : 'text-white/85 hover:text-white')
              )}
              aria-current={isActive(l.href) ? 'page' : undefined}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Center — logo */}
        <div className="flex flex-1 justify-start lg:flex-none lg:justify-center">
          <a href="/" aria-label="Zen Spa home">
            <ZenSpaLogo
              className={cn(
                'w-auto transition-all duration-500',
                dark ? 'h-10 md:h-16' : 'h-10 md:h-16',
                dark ? 'text-foreground' : 'text-white'
              )}
            />
          </a>
        </div>

        {/* Right — CTA (desktop) + email + phone (mobile) */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          {/* Desktop: afspraak CTA */}
          <a
            href="/boeken"
            className={cn(
              'hidden items-center gap-2 whitespace-nowrap rounded-[84px] border px-8 py-4 text-[18px] font-medium transition-all duration-300 lg:flex',
              dark
                ? 'border-foreground/22 text-foreground hover:bg-foreground hover:text-white'
                : 'border-white/50 text-white hover:bg-white/20'
            )}
          >
            Afspraak maken
          </a>

          {/* Mobile: email icon */}
          <a
            href="mailto:info@zenspa.nl"
            aria-label="Stuur een e-mail"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 lg:hidden',
              dark
                ? 'text-foreground/70 hover:bg-accent/10 hover:text-accent'
                : 'text-white/80 hover:bg-white/25'
            )}
          >
            <Mail className="h-5 w-5" aria-hidden />
          </a>

          {/* Mobile: phone icon */}
          <a
            href="tel:0653207729"
            aria-label="Bel ons"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 lg:hidden',
              dark
                ? 'text-foreground/70 hover:bg-accent/10 hover:text-accent'
                : 'text-white/80 hover:bg-white/25'
            )}
          >
            <Phone className="h-5 w-5" aria-hidden />
          </a>

          {/* Mobile: appointment icon with accent background */}
          <a
            href="/boeken"
            aria-label="Afspraak maken"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-accent/85 lg:hidden"
          >
            <CalendarCheck className="h-5 w-5" aria-hidden />
          </a>
        </div>
      </div>

    </header>
    </>
  )
}
