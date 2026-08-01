'use client'

import { useState, useEffect } from 'react'
import { ZenSpaLogo } from '@/components/logo'
import { Menu, X } from 'lucide-react'
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
    const handle = () => setScrolled(window.scrollY > 80)
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
      <header
        className={cn(
          'fixed inset-x-0 top-0 z-50 transition-all duration-500',
          scrolled
            ? 'bg-background/96 backdrop-blur-lg border-b border-border/30 shadow-sm'
            : 'bg-transparent'
        )}
      >
        <div className="mx-auto flex h-24 max-w-[1400px] items-center justify-between px-5 md:px-10 lg:px-16">
          {/* Logo */}
          <a href="#" aria-label="Zen Spa home" className="shrink-0">
            <ZenSpaLogo
              className={cn(
                'h-10 w-auto transition-colors duration-500',
                scrolled ? 'text-foreground' : 'text-white'
              )}
            />
          </a>

          {/* Desktop nav */}
          <nav className="hidden items-center gap-10 text-[14px] tracking-wide lg:flex" aria-label="Primaire navigatie">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className={cn(
                  'transition-colors duration-300',
                  scrolled
                    ? 'text-muted-foreground hover:text-foreground'
                    : 'text-white/75 hover:text-white'
                )}
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className={cn(
                'hidden rounded-full px-9 py-4 text-[14px] font-medium transition-all duration-300 lg:block',
                scrolled
                  ? 'bg-accent text-white hover:bg-accent/90 hover:shadow-md hover:shadow-accent/20'
                  : 'border border-white/30 bg-white/10 text-white backdrop-blur-sm hover:bg-white/20'
              )}
            >
              Afspraak maken
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              aria-expanded={open}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-full transition-colors lg:hidden',
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
          open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Close bar */}
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

        {/* Nav links */}
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
