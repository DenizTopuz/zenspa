'use client'

import { useState, useEffect } from 'react'
import { ZenSpaLogo } from '@/components/logo'
import { Menu, X, Phone } from 'lucide-react'
import { cn } from '@/lib/utils'

const links = [
  { href: '/',         label: 'Home' },
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
      <header className="fixed inset-x-0 top-0 z-50 px-5 pt-5 md:px-8 md:pt-6">
        <div
          className={cn(
            'mx-auto flex max-w-[1480px] items-center rounded-[100px] border border-white/30 px-8 py-4 backdrop-blur-lg transition-all duration-500 md:px-12 md:py-5',
            scrolled
              ? 'bg-white/82 shadow-[0_6px_48px_rgba(0,0,0,0.11)]'
              : 'bg-white/18 shadow-[0_2px_20px_rgba(0,0,0,0.06)]'
          )}
        >
          {/* Left — nav links */}
          <nav className="hidden flex-1 items-center gap-9 lg:flex" aria-label="Primaire navigatie">
            {links.map((l) => (
              <a
                key={l.label}
                href={l.href}
                className="text-[15px] text-foreground/65 transition-colors duration-200 hover:text-foreground"
              >
                {l.label}
              </a>
            ))}
          </nav>

          {/* Center — logo (kept larger to match Lumiera proportions) */}
          <div className="flex flex-1 justify-center lg:flex-none">
            <a href="/" aria-label="Zen Spa home">
              <ZenSpaLogo className="h-12 w-auto text-foreground" />
            </a>
          </div>

          {/* Right — phone + CTA + mobile button */}
          <div className="flex flex-1 items-center justify-end gap-4">
            <a
              href="tel:+31201234567"
              className="hidden items-center gap-2 text-[14px] text-foreground/55 transition-colors duration-200 hover:text-foreground xl:flex"
            >
              <Phone className="h-4 w-4 shrink-0" aria-hidden />
              +31 (0)20 123 4567
            </a>

            <a
              href="#contact"
              className="hidden items-center gap-2 rounded-full border border-foreground/22 px-7 py-3 text-[15px] font-medium text-foreground transition-all duration-200 hover:bg-foreground hover:text-white lg:flex"
            >
              Afspraak maken
              <span aria-hidden>›</span>
            </a>

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(true)}
              aria-label="Menu openen"
              aria-expanded={open}
              className="flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-colors hover:bg-gray-100 lg:hidden"
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
