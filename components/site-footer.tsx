import { ZenSpaLogo } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="bg-foreground px-5 py-24 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-14 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-6">
            <ZenSpaLogo className="h-9 w-auto text-white" />
            <p className="text-[14px] leading-[1.8] text-white/42">
              Een sanctuary voor de zintuigen.<br />House of Beauty since 2018.
            </p>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[11px] font-medium text-white/42 transition-colors hover:border-white/35 hover:text-white/70"
            >
              IG
            </a>
          </div>

          {/* Treatments */}
          <nav aria-label="Behandelingen" className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Behandelingen
            </p>
            {[
              { label: 'Gezichtsbehandelingen', slug: 'gezichtsbehandelingen' },
              { label: 'Massage & Ontspanning', slug: 'massage-ontspanning' },
              { label: 'Lichaamsbehandelingen', slug: 'lichaamsbehandelingen' },
              { label: 'Hydrotherapie', slug: 'hydrotherapie' },
              { label: 'Hand & Nagelzorg', slug: 'hand-nagelzorg' },
            ].map((s) => (
              <a
                key={s.slug}
                href={`/behandelingen/${s.slug}`}
                className="text-[14px] text-white/50 transition-colors hover:text-white"
              >
                {s.label}
              </a>
            ))}
          </nav>

          {/* Company */}
          <nav aria-label="Bedrijf" className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Bedrijf
            </p>
            {['Over ons', 'Onze filosofie', 'Cadeaubonnen', 'Vacatures', 'Pers'].map((s) => (
              <a
                key={s}
                href="#about"
                className="text-[14px] text-white/50 transition-colors hover:text-white"
              >
                {s}
              </a>
            ))}
          </nav>

          {/* Visit */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Bezoek ons
            </p>
            <address className="not-italic">
              <p className="text-[14px] text-white/50">Serenity Lane 12</p>
              <p className="text-[14px] text-white/50">Amsterdam</p>
              <p className="mt-3 text-[14px] text-white/50">Ma–zo: 9:00 – 21:00</p>
              <a
                href="tel:+31201234567"
                className="mt-1 block text-[14px] text-white/50 transition-colors hover:text-white"
              >
                +31 (0)20 123 4567
              </a>
            </address>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-10 text-[12px] text-white/22 sm:flex-row">
          <p>© 2025 Zen Spa. Alle rechten voorbehouden.</p>
          <nav aria-label="Juridisch" className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white/50">Privacybeleid</a>
            <a href="#" className="transition-colors hover:text-white/50">Algemene voorwaarden</a>
            <a href="#" className="transition-colors hover:text-white/50">Cookiebeleid</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
