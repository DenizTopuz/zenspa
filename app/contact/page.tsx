import Image from 'next/image'
import { Phone, MapPin, Clock, Mail } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { ContactSection } from '@/components/contact-section'
import { FaqSection } from '@/components/faq-section'

export const metadata = {
  title: 'Contact — Zen Spa',
  description: 'Neem contact op met Zen Spa Almere. Maak een afspraak voor een behandeling of stel je vraag via het contactformulier.',
}

const infoItems = [
  {
    icon: <Phone className="h-5 w-5 text-accent" aria-hidden />,
    label: 'Telefoon',
    value: '06 53 20 77 29',
    href: 'tel:0653207729',
  },
  {
    icon: <Mail className="h-5 w-5 text-accent" aria-hidden />,
    label: 'E-mail',
    value: 'info@zenspa.nl',
    href: 'mailto:info@zenspa.nl',
  },
  {
    icon: <MapPin className="h-5 w-5 text-accent" aria-hidden />,
    label: 'Adres',
    value: 'Kretastraat 77\n1316 VT Almere',
    href: 'https://maps.google.com/?q=Kretastraat+77+Almere',
  },
  {
    icon: <Clock className="h-5 w-5 text-accent" aria-hidden />,
    label: 'Openingstijden',
    value: 'Ma, Wo, Vr · 10:00–18:00',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <main>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[52vh] items-center overflow-hidden" aria-label="Contact">
          <div className="absolute inset-x-0 -bottom-[15%] -top-[15%]">
            <Image
              src="/hero.jpg"
              alt=""
              fill
              aria-hidden
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/52 to-black/80" />
          <div className="relative z-10 w-full py-24 text-center text-white md:py-32">
            <p className="mb-4 text-[16px] font-semibold tracking-[0.22em] text-white/60 uppercase">
              Zen Spa · Almere
            </p>
            <h1 className="font-heading text-[52px] leading-[1.04] tracking-tight md:text-[72px] lg:text-[88px]">
              Contact
            </h1>
            <p className="mx-auto mt-5 max-w-[480px] text-[17px] leading-[1.85] text-white/68">
              Maak een afspraak of stel een vraag — wij reageren binnen één werkdag.
            </p>
          </div>
        </section>

        {/* ── Info bar ──────────────────────────────────────────────── */}
        <section className="bg-background">
          <div className="mx-auto max-w-[1840px] px-4 md:px-6">
            <div className="grid grid-cols-2 divide-foreground/8 border-b border-foreground/8 md:grid-cols-4 md:divide-x">
              {infoItems.map((item) => {
                const inner = (
                  <div className="flex flex-col items-center gap-2 px-6 py-8 text-center">
                    <span className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/8">
                      {item.icon}
                    </span>
                    <p className="text-[11px] font-semibold tracking-[0.14em] text-foreground/40 uppercase">
                      {item.label}
                    </p>
                    <p className="whitespace-pre-line text-[15px] font-medium leading-snug text-foreground">
                      {item.value}
                    </p>
                  </div>
                )
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                    className="transition-colors hover:bg-secondary/50"
                  >
                    {inner}
                  </a>
                ) : (
                  <div key={item.label}>{inner}</div>
                )
              })}
            </div>
          </div>
        </section>

        {/* ── Contact form ──────────────────────────────────────────── */}
        <ContactSection />

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <FaqSection />

      </main>
      <SiteFooter bg="bg-background" />
    </>
  )
}
