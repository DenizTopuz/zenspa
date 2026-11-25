'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ZenSpaLogo } from '@/components/logo'
import { Phone, Menu, X, CalendarCheck, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',               label: 'Home' },
  { href: '/over-mij',       label: 'Zen Spa' },
  { href: '/behandelingen',  label: 'Behandelingen' },
  { href: '/parfums',        label: 'Parfums' },
  { href: '/contact',        label: 'Contact' },
]

export function SiteNav() {
  const pathname = usePathname()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const lightBg = pathname.startsWith('/boeken')
  const dark = scrolled || lightBg

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Menu sluit bij navigatie, Escape; achtergrond scrolt niet mee
  useEffect(() => {
    setOpen(false)
  }, [pathname])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    const prev = document.documentElement.style.overflow
    document.documentElement.style.overflow = 'hidden'
    return () => {
      window.removeEventListener('keydown', onKey)
      document.documentElement.style.overflow = prev
    }
  }, [open])

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
        'fixed inset-x-0 top-0 z-50 transition-all duration-500 lg:px-6 lg:pt-5',
        !dark && 'px-4 pt-4 md:px-6 md:pt-5'
      )}
    >
      <div
        className={cn(
          'mx-auto flex max-w-[1840px] items-center backdrop-blur-lg transition-all duration-500',
          dark
            ? 'border-b border-foreground/10 bg-background py-3 pl-5 pr-4 md:py-4 md:pl-7 md:pr-5 shadow-[0_2px_16px_rgba(0,0,0,0.08)] lg:rounded-[100px] lg:border lg:bg-white lg:py-4 lg:pl-10 lg:pr-4 lg:shadow-[0_4px_32px_rgba(0,0,0,0.10)]'
            : 'rounded-[100px] border border-white/30 bg-white/18 py-3 pl-3 pr-2 md:py-4 md:pl-6 md:pr-4 shadow-[0_2px_20px_rgba(0,0,0,0.06)] lg:pl-10'
        )}
      >
        {/* Left — nav links (desktop only) */}
        <nav className="hidden flex-1 items-center gap-10 lg:flex" aria-label="Primaire navigatie">
          {links.map((l) => (
            <Link
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
            </Link>
          ))}
        </nav>

        {/* Center — logo */}
        <div className="flex flex-1 justify-start lg:flex-none lg:justify-center">
          <Link href="/" aria-label="Zen Spa home">
            <ZenSpaLogo
              className={cn(
                'w-auto transition-all duration-500',
                'h-10 md:h-12 lg:h-16',
                dark ? 'text-accent' : 'text-white'
              )}
            />
          </Link>
        </div>

        {/* Right — CTA (desktop) + email + phone (mobile) */}
        <div className="flex flex-1 items-center justify-end gap-3 md:gap-4">
          {/* Desktop: afspraak CTA */}
          <Link
            href="/boeken"
            className={cn(
              'hidden items-center gap-2 whitespace-nowrap rounded-[84px] border px-8 py-4 text-[18px] font-medium transition-all duration-300 lg:flex',
              dark
                ? 'border-foreground/22 text-foreground hover:bg-foreground hover:text-white'
                : 'border-white/50 text-white hover:bg-white/20'
            )}
          >
            Afspraak maken
          </Link>

          {/* Mobile: WhatsApp icon */}
          <a
            href="https://wa.me/31653207729"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Stuur een WhatsApp bericht"
            className={cn(
              'flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 lg:hidden',
              dark
                ? 'text-foreground/70 hover:bg-accent/10 hover:text-accent'
                : 'text-white/80 hover:bg-white/25'
            )}
          >
            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
            </svg>
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

          {/* Mobile: hamburger */}
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
            aria-expanded={open}
            aria-controls="mobiel-menu"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-accent text-white shadow-[0_2px_12px_rgba(0,0,0,0.18)] transition-all duration-300 hover:bg-accent/85 lg:hidden"
          >
            <Menu className="h-5 w-5" aria-hidden />
          </button>
        </div>
      </div>

    </header>

    {/* Mobiel menu — schuift van onder naar boven, grote letters. Buiten de header i.v.m. backdrop-blur. */}
    <div
      id="mobiel-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      aria-hidden={!open}
      inert={!open}
      className={cn(
        'fixed inset-0 z-[70] flex flex-col overflow-y-auto bg-primary text-primary-foreground lg:hidden',
        'transition-transform duration-[650ms] ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
        open ? 'translate-y-0' : 'translate-y-full'
      )}
      style={{ paddingTop: 'env(safe-area-inset-top, 0px)', paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}
    >
      <div className="flex items-center px-5 py-4">
        <Link href="/" aria-label="Zen Spa home" onClick={() => setOpen(false)}>
          <ZenSpaLogo className="h-10 w-auto text-primary-foreground" />
        </Link>
      </div>

      <nav aria-label="Mobiel menu" className="flex flex-1 flex-col justify-center gap-1 px-7 py-6">
        {links.map((l, i) => (
          <Link
            key={l.label}
            href={l.href}
            onClick={() => setOpen(false)}
            aria-current={isActive(l.href) ? 'page' : undefined}
            className={cn(
              'font-heading block py-1.5 text-[44px] leading-[1.1] tracking-tight transition-[opacity,translate] duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] motion-reduce:transition-none',
              open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0',
              isActive(l.href) ? 'italic text-[#E6CF95]' : 'text-primary-foreground'
            )}
            style={{ transitionDelay: open ? `${200 + i * 70}ms` : '0ms' }}
          >
            {l.label}
          </Link>
        ))}
      </nav>

      <div
        className={cn(
          'flex flex-col gap-4 px-7 pb-8 transition-[opacity,translate] duration-700 ease-out motion-reduce:transition-none',
          open ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
        )}
        style={{ transitionDelay: open ? '650ms' : '0ms' }}
      >
        <Link
          href="/boeken"
          onClick={() => setOpen(false)}
          className="flex items-center justify-center gap-2 rounded-full bg-[#E6CF95] px-6 py-3.5 text-[16px] font-semibold text-[#21231B]"
        >
          <CalendarCheck className="h-5 w-5" aria-hidden />
          Afspraak maken
        </Link>
        <div className="flex items-center justify-center gap-6 text-[15px] text-primary-foreground/85">
          <a href="tel:0653207729" className="flex items-center gap-2"><Phone className="h-4 w-4" aria-hidden />Bel ons</a>
          <a href="https://wa.me/31653207729" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2"><MessageCircle className="h-4 w-4" aria-hidden />WhatsApp</a>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          aria-label="Sluit menu"
          className="mx-auto mt-1 flex h-14 w-14 items-center justify-center rounded-full border border-primary-foreground/30 text-primary-foreground transition-colors hover:bg-primary-foreground/10"
        >
          <X className="h-6 w-6" strokeWidth={1.4} aria-hidden />
        </button>
      </div>
    </div>
    </>
  )
}
