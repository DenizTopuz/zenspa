'use client'

import { useState, useEffect } from 'react'
import { ZenSpaLogo } from '@/components/logo'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '#services', label: 'Behandelingen' },
  { href: '#about',    label: 'Over ons' },
  { href: '#pricing',  label: 'Prijzen' },
  { href: '#stories',  label: 'Reviews' },
]

export function SiteNav() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const handle = () => setScrolled(window.scrollY > 60)
    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  const close = () => setOpen(false)

  return (
    <>
      {/* Floating pill nav */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
        <div
          className={cn(
            'mx-auto flex max-w-[1400px] items-center gap-4 rounded-2xl px-5 py-3 transition-all duration-500 md:px-7 md:py-3.5',
            scrolled
              ? 'bg-background/96 shadow-[0_2px_28px_rgba(0,0,0,0.07)] backdrop-blur-xl border border-border/20'
              : 'border border-white/14 bg-white/8 backdrop-blur-md shadow-[0_4px_24px_rgba(0,0,0,0.12)]'
          )}
        >
          {/* Left — nav links */}
          <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Primaire navigatie">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  'text-[13.5px] tracking-wide transition-colors duration-300',
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/78 hover:text-white'
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Center — logo */}
          <div className="flex flex-1 justify-center lg:flex-none">
            <a href="#" aria-label="Zen Spa home">
              <ZenSpaLogo
                className={cn(
                  'h-9 w-auto transition-colors duration-500',
                  scrolled ? 'text-foreground' : 'text-white'
                )}
              />
            </a>
          </div>

          {/* Right — phone + CTA + mobile button */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <a
              href="tel:+31201234567"
              className={cn(
                'hidden items-center gap-2 text-[13px] transition-colors duration-300 xl:flex',
                scrolled
                  ? 'text-muted-foreground hover:text-foreground'
                  : 'text-white/62 hover:text-white'
              )}
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
              +31 (0)20 123 4567
            </a>

            <a
              href="#contact"
              className={cn(
                'hidden items-center gap-2 rounded-full px-6 py-3 text-[13.5px] font-medium transition-all duration-300 lg:flex',
                scrolled
                  ? 'bg-accent text-white hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20'
                  : 'border border-white/26 bg-white/12 text-white hover:bg-white/22'
              )}
            >
              Afspraak maken
              <span className="text-[11px] opacity-70">›</span>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              aria-expanded={open}
              className={cn(
                'flex h-9 w-9 items-center justify-center rounded-full transition-colors lg:hidden',
                scrolled
                  ? 'text-foreground hover:bg-muted'
                  : 'text-white hover:bg-white/10'
              )}
            >
              <Menu className="h-5 w-5" />
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
          'fixed inset-0 z-[100] flex flex-col bg-background transition-opacity duration-400 lg:hidden',
          open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex h-20 shrink-0 items-center justify-between px-5">
          <ZenSpaLogo className="h-8 w-auto text-foreground" />
          <button
            onClick={close}
            aria-label="Menu sluiten"
            className="flex h-10 w-10 items-center justify-center rounded-full text-foreground hover:bg-muted"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex flex-1 flex-col items-center justify-center gap-8" aria-label="Mobiele navigatie">
          {links.map((l, i) => (
            <a
              key={l.href}
              href={l.href}
              onClick={close}
              className="font-heading text-4xl text-foreground transition-colors hover:text-accent"
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
            className="mt-6 rounded-full bg-accent px-10 py-4 text-[14px] font-medium text-white transition-all hover:bg-accent/90"
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
