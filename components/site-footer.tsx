'use client'

import { MapPin, Clock, Phone, Mail, ArrowRight } from 'lucide-react'
import { ZenSpaLogo } from '@/components/logo'

const contactBar = [
  { icon: MapPin, label: 'Adres',          value: 'Kretastraat 77, 1316 VT Almere', href: 'https://maps.google.com/?q=Kretastraat+77,+1316+VT+Almere', external: true },
  { icon: Clock,  label: 'Openingstijden', value: 'Ma, Wo, Vr · 10:00–18:00',       href: '/contact' },
  { icon: Phone,  label: 'Bel ons',        value: '06 53 20 77 29',                  href: 'tel:0653207729' },
  { icon: Mail,   label: 'E-mail',         value: 'info@zenspa.nl',                  href: 'mailto:info@zenspa.nl' },
]

const navCols = [
  {
    heading: 'Ontdekken',
    links: [
      { label: 'Home',          href: '/' },
      { label: 'Behandelingen', href: '/behandelingen' },
      { label: 'Over ons',      href: '/over-mij' },
      { label: 'Prijzen',       href: '/behandelingen' },
      { label: 'Reviews',       href: '/#stories' },
    ],
  },
  {
    heading: 'Salon',
    links: [
      { label: "FAQ's",                href: '/#faq' },
      { label: 'Cadeaubonnen',         href: '/contact' },
      { label: 'Privacybeleid',        href: '/privacybeleid' },
      { label: 'Algemene voorwaarden', href: '/algemene-voorwaarden' },
    ],
  },
  {
    heading: 'Behandelingen',
    links: [
      { label: 'Gezicht',            href: '/behandelingen' },
      { label: 'Lichaam',            href: '/behandelingen' },
      { label: 'Permanente Make-up', href: '/behandelingen' },
      { label: 'Ontharen',           href: '/behandelingen' },
    ],
  },
]

export function SiteFooter({ bg = 'bg-background' }: { bg?: string }) {
  return (
    <div className={bg}>
    <footer className="rounded-t-[40px] bg-foreground text-white md:rounded-t-[64px] lg:rounded-t-[112px]">
      <div className="mx-auto max-w-[1840px] px-5 md:px-6">

        {/* Contact bar */}
        <div className="grid grid-cols-1 gap-4 py-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4 lg:gap-10 lg:py-16">
          {contactBar.map(({ icon: Icon, label, value, href, external }) => (
            <a
              key={label}
              href={href}
              target={external ? '_blank' : undefined}
              rel={external ? 'noopener noreferrer' : undefined}
              className="group flex items-start gap-5 rounded-2xl p-4 -m-4 transition-colors duration-200 hover:bg-white/8"
            >
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-white/12 bg-white/6 transition-colors duration-200 group-hover:bg-white/14 md:h-16 md:w-16">
                <Icon className="h-[22px] w-[22px] text-white/55 md:h-7 md:w-7" aria-hidden />
              </span>
              <div>
                <p className="font-heading text-[18px] text-white/70 md:text-[22px]">{label}</p>
                <p className="mt-1.5 text-[15px] font-medium text-white/85 md:text-[18px]">{value}</p>
              </div>
            </a>
          ))}
        </div>

        <div className="border-t border-white/10" />

        {/* Main grid */}
        <div className="grid gap-14 py-16 md:grid-cols-[5fr_3fr_3fr_3fr] md:gap-10 lg:py-20">

          {/* Newsletter */}
          <div className="flex flex-col gap-6">
            <ZenSpaLogo className="h-14 w-auto self-start text-white" />
            <p className="text-[15px] leading-[1.75] text-white/55">
              Maandelijkse wellness tips en exclusieve aanbiedingen.<br />
              Join 1.000+ tevreden klanten.
            </p>
            <form
              onSubmit={(e) => e.preventDefault()}
              className="flex max-w-[400px] items-center gap-2 rounded-full border border-white/15 bg-white/6 px-5 py-3.5"
            >
              <input
                type="email"
                name="email"
                aria-label="Jouw e-mailadres"
                placeholder="Jouw e-mailadres"
                className="flex-1 bg-transparent text-[14px] text-white placeholder:text-white/30 focus:outline-none"
              />
              <button
                type="submit"
                aria-label="Aanmelden voor nieuwsbrief"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/12 text-white transition-colors hover:bg-white/22"
              >
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Nav columns */}
          {navCols.map((col) => (
            <nav key={col.heading} aria-label={col.heading} className="flex flex-col gap-5">
              <p className="text-[15px] font-semibold text-white">{col.heading}</p>
              <div className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <a
                    key={link.label}
                    href={link.href}
                    className="text-[14px] text-white/48 transition-colors hover:text-white"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </nav>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-4 border-t border-white/10 py-8 text-[12px] text-white/55 sm:flex-row">
          <p>© 2026 Zen Spa · KvK 57713464 · Alle rechten voorbehouden</p>

          {/* Social icons */}
          <div className="flex items-center gap-3">
            <a
              href="https://instagram.com/cigdemzenspa"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/38 transition-colors hover:border-white/35 hover:text-white/75"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
                <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" stroke="none" />
              </svg>
            </a>
            <a
              href="https://facebook.com/zenspa.almerebuiten"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-white/38 transition-colors hover:border-white/35 hover:text-white/75"
            >
              <svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor" aria-hidden>
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
              </svg>
            </a>
          </div>
        </div>

      </div>
    </footer>
    </div>
  )
}
