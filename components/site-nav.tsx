'use client'

import { useState, useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { ZenSpaLogo } from '@/components/logo'
import { Menu, X, Phone } from 'lucide-react'
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
  const [open, setOpen] = useState(false)

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  useEffect(() => {
    // IntersectionObserver is more reliable than scroll events on iOS Safari
    const sentinel = document.createElement('div')
    sentinel.setAttribute('aria-hidden', 'true')
    sentinel.style.cssText = 'position:absolute;top:80px;left:0;width:1px;height:1px;pointer-events:none;'
    document.body.prepend(sentinel)

    const obs = new IntersectionObserver(
      ([entry]) => setScrolled(!entry.isIntersecting),
      { threshold: 0 }
    )
    obs.observe(sentinel)

    // Scroll + touch events as extra triggers (covers momentum scrolling gaps)
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

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
        <div
          className={cn(
            'mx-auto flex max-w-[1840px] items-center rounded-[100px] border py-3 pl-8 pr-3 backdrop-blur-lg transition-all duration-500 md:py-4 md:pl-10 md:pr-4',
            scrolled
              ? 'border-foreground/10 bg-white shadow-[0_4px_32px_rgba(0,0,0,0.10)]'
              : 'border-white/30 bg-white/18 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
          )}
        >
          {/* Left — nav links */}
          <nav className="hidden flex-1 items-center gap-10 lg:flex" aria-label="Primaire navigatie">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className={cn(
                  'relative whitespace-nowrap text-[19px] transition-colors duration-300',
                  'after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-current after:transition-[width] after:duration-[650ms] after:ease-out hover:after:w-full',
                  isActive(l.href)
                    ? cn('font-bold', scrolled ? 'text-foreground' : 'text-white')
                    : cn('font-medium', scrolled ? 'text-foreground/65 hover:text-foreground' : 'text-white/85 hover:text-white')
                )}
                aria-current={isActive(l.href) ? 'page' : undefined}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Center — logo */}
          <div className="flex flex-1 justify-center lg:flex-none">
            <a href="/" aria-label="Zen Spa home">
              <ZenSpaLogo
                className={cn(
                  'h-16 w-auto transition-colors duration-300',
                  scrolled ? 'text-foreground' : 'text-white'
                )}
              />
            </a>
          </div>

          {/* Right — phone + CTA + mobile button */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <a
              href="tel:+31201234567"
              className={cn(
                'hidden items-center gap-2 whitespace-nowrap text-[17px] transition-colors duration-300 xl:flex',
                scrolled
                  ? 'text-foreground/55 hover:text-foreground'
                  : 'text-white/75 hover:text-white'
              )}
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              +31 (0)20 123 4567
            </a>

            <a
              href="#contact"
              className={cn(
                'hidden items-center gap-2 whitespace-nowrap rounded-[84px] border px-8 py-4 text-[18px] font-medium transition-all duration-300 lg:flex',
                scrolled
                  ? 'border-foreground/22 text-foreground hover:bg-foreground hover:text-white'
                  : 'border-white/50 text-white hover:bg-white/20'
              )}
            >
              Afspraak maken
            </a>

            {/* Mobile hamburger — always dark/visible on mobile */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              aria-expanded={open}
              style={{ touchAction: 'manipulation' }}
              className={cn(
                'relative z-10 flex h-12 w-12 cursor-pointer items-center justify-center rounded-full transition-colors lg:hidden',
                scrolled
                  ? 'text-foreground hover:bg-gray-100'
                  : 'bg-white/20 text-white hover:bg-white/30'
              )}
            >
              <Menu className="h-6 w-6" />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile overlay */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Navigatiemenu"
        className={cn(
          'fixed inset-0 z-[100] flex flex-col bg-white transition-opacity duration-400 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex h-24 shrink-0 items-center justify-between px-8">
          <ZenSpaLogo className="h-12 w-auto text-foreground" />
          <button
            onClick={close}
            aria-label="Menu sluiten"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-gray-100"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-10" aria-label="Mobiele navigatie">
          {links.map((l, i) => (
            <a
              key={l.label}
              href={l.href}
              onClick={close}
              aria-current={isActive(l.href) ? 'page' : undefined}
              className={cn('font-heading text-4xl transition-colors hover:text-accent', isActive(l.href) ? 'font-bold text-accent' : 'text-foreground')}
              style={{
                opacity: open ? 1 : 0,
                transform: open ? 'none' : 'translateY(10px)',
                transition: `opacity 0.35s ease ${i * 55}ms, transform 0.35s ease ${i * 55}ms`,
              }}
            >
              {l.label}
            </a>
          ))}
          <a
            href="#contact"
            onClick={close}
            className="mt-4 rounded-full border border-foreground/25 px-10 py-4 text-[16px] font-medium text-foreground transition-all hover:bg-foreground hover:text-white"
            style={{
              opacity: open ? 1 : 0,
              transition: `opacity 0.35s ease ${links.length * 55 + 40}ms`,
            }}
          >
            Afspraak maken
          </a>
        </nav>
      </div>
    </>
  )
}
