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
      {/* Floating pill nav — always light/opaque, dark text (Lumiera style) */}
      <header className="fixed inset-x-0 top-0 z-50 px-4 pt-4 md:px-6 md:pt-5">
        <div
          className={cn(
            'mx-auto flex max-w-[1400px] items-center gap-4 rounded-[28px] bg-background/96 px-5 py-3 backdrop-blur-xl transition-all duration-500 md:px-8 md:py-4',
            scrolled
              ? 'border border-border/30 shadow-[0_4px_32px_rgba(0,0,0,0.10)]'
              : 'border border-border/20 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
          )}
        >
          {/* Left — nav links */}
          <nav className="hidden flex-1 items-center gap-7 lg:flex" aria-label="Primaire navigatie">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[13.5px] tracking-wide text-muted-foreground transition-colors duration-200 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Center — logo */}
          <div className="flex flex-1 justify-center lg:flex-none">
            <a href="#" aria-label="Zen Spa home">
              <ZenSpaLogo className="h-9 w-auto text-foreground" />
            </a>
          </div>

          {/* Right — phone + CTA + mobile button */}
          <div className="flex flex-1 items-center justify-end gap-3">
            <a
              href="tel:+31201234567"
              className="hidden items-center gap-1.5 text-[13px] text-muted-foreground transition-colors duration-200 hover:text-foreground xl:flex"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden />
              +31 (0)20 123 4567
            </a>

            <a
              href="#contact"
              className="hidden items-center gap-1.5 rounded-full border border-foreground/18 px-6 py-2.5 text-[13.5px] font-medium text-foreground transition-all duration-200 hover:bg-foreground hover:text-background lg:flex"
            >
              Afspraak maken
              <span className="text-[12px]">›</span>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              aria-expanded={open}
              className="flex h-9 w-9 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted lg:hidden"
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
