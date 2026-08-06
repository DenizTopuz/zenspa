import { ZenSpaLogo } from '@/components/logo'

export function SiteFooter() {
  return (
    <footer className="bg-foreground px-5 py-24 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-14 md:grid-cols-4">

          {/* Brand */}
          <div className="flex flex-col gap-6">
            <ZenSpaLogo className="h-16 w-auto text-white md:h-20" />
            <p className="text-[14px] leading-[1.8] text-white/42">
              Schoonheidssalon in Almere Buiten.<br />
              Gediplomeerd specialist sinds 2003.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/cigdemzenspa"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[11px] font-semibold text-white/42 transition-colors hover:border-white/35 hover:text-white/70"
              >
                IG
              </a>
              <a
                href="https://facebook.com/zenspa.almerebuiten"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-[11px] font-semibold text-white/42 transition-colors hover:border-white/35 hover:text-white/70"
              >
                FB
              </a>
            </div>
          </div>

          {/* Treatments */}
          <nav aria-label="Behandelingen" className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Behandelingen
            </p>
            {[
              'Gezichtsbehandelingen',
              'Lichaamsbehandelingen',
              'PMU',
              'Ontharen',
              'Wimpers & Wenkbrauwen',
            ].map((label) => (
              <a
                key={label}
                href="#pricing"
                className="text-[14px] text-white/50 transition-colors hover:text-white"
              >
                {label}
              </a>
            ))}
          </nav>

          {/* Company */}
          <nav aria-label="Bedrijf" className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Bedrijf
            </p>
            {['Over ons', 'Onze filosofie', 'Cadeaubonnen'].map((s) => (
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
              <p className="text-[14px] text-white/50">Kretastraat 77</p>
              <p className="text-[14px] text-white/50">1339 VT Almere</p>
              <p className="mt-3 text-[14px] text-white/50">Ma, Wo, Vr: 10:00 – 18:00</p>
              <a
                href="tel:0653207729"
                className="mt-1 block text-[14px] text-white/50 transition-colors hover:text-white"
              >
                06 53 20 77 29
              </a>
            </address>
            <p className="text-[12px] italic text-white/28">Alleen contant betalen</p>
          </div>
        </div>

        <div className="mt-20 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-10 text-[12px] text-white/22 sm:flex-row">
          <p>© 2025 Zen Spa · KvK 57713464 · Alle rechten voorbehouden</p>
          <nav aria-label="Juridisch" className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white/50">Privacybeleid</a>
            <a href="#" className="transition-colors hover:text-white/50">Algemene voorwaarden</a>
          </nav>
        </div>
      </div>
    </footer>
  )
}
