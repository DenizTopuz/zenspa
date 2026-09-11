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
    icon: <Phone className="h-6 w-6 text-foreground/60" aria-hidden />,
    label: 'Telefoon',
    value: '06 53 20 77 29',
    href: 'tel:0653207729',
  },
  {
    icon: <Mail className="h-6 w-6 text-foreground/60" aria-hidden />,
    label: 'E-mail',
    value: 'info@zenspa.nl',
    href: 'mailto:info@zenspa.nl',
  },
  {
    icon: <MapPin className="h-6 w-6 text-foreground/60" aria-hidden />,
    label: 'Adres',
    value: 'Kretastraat 77\n1316 VT Almere',
    href: 'https://maps.google.com/?q=Kretastraat+77+Almere',
  },
  {
    icon: <Clock className="h-6 w-6 text-foreground/60" aria-hidden />,
    label: 'Openingstijden',
    value: 'Ma, Wo, Vr\n10:00 – 18:00',
    href: null,
  },
]

export default function ContactPage() {
  return (
    <>
      <SiteNav />
      <main>

        {/* ── Hero ──────────────────────────────────────────────────── */}
        <section className="relative flex min-h-[65vh] items-center overflow-hidden" aria-label="Contact">
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
          <div className="relative z-10 w-full pt-20 pb-44 text-center text-white md:pt-28 md:pb-56">
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
        <section className="relative z-10 -mt-32 overflow-hidden rounded-t-[40px] bg-background md:-mt-48 md:rounded-t-[112px]">
          <div className="mx-auto max-w-[1840px] px-5 md:px-6">
            <div className="grid grid-cols-2 gap-3 py-12 md:gap-10 md:grid-cols-4 md:py-16">
              {infoItems.map((item) => {
                const inner = (
                  <div className="group flex flex-col items-center gap-3 rounded-2xl p-4 text-center transition-colors duration-200 hover:bg-secondary/60 md:gap-4 md:p-6">
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full border border-foreground/12 bg-foreground/5 transition-colors duration-200 group-hover:bg-foreground/10 md:h-16 md:w-16">
                      {item.icon}
                    </span>
                    <div>
                      <p className="font-heading text-[18px] text-foreground/70 md:text-[22px]">{item.label}</p>
                      <p className="mt-1 whitespace-pre-line text-[13px] font-medium leading-snug text-foreground/85 md:mt-1.5 md:text-[17px]">{item.value}</p>
                    </div>
                  </div>
                )
                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={item.href.startsWith('http') ? '_blank' : undefined}
                    rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
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
        <ContactSection className="!pt-0" />

        {/* ── FAQ ───────────────────────────────────────────────────── */}
        <FaqSection />

        {/* ── Map ───────────────────────────────────────────────────── */}
        <section className="bg-background" style={{ height: '520px' }}>
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2441.7!2d5.2!3d52.37!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c609b1d1b4a6c9%3A0x0!2sKretastraat+77%2C+1316+VT+Almere!5e0!3m2!1snl!2snl!4v1!5m2!1snl!2snl&q=Kretastraat+77,+1316+VT+Almere,+Netherlands"
            width="100%"
            height="100%"
            style={{ border: 0, display: 'block' }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Locatie Zen Spa Almere"
          />
        </section>

        {/* ── Instagram feed ────────────────────────────────────────── */}
        <section className="section-fade bg-background py-24 md:py-36">
          <div className="mx-auto max-w-[1840px] px-5 md:px-6">
            <div className="mb-10 flex items-end justify-between gap-6">
              <div>
                <h2 className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px]">
                  Volg ons op Instagram
                </h2>
                <p className="mt-2 text-[17px] text-muted-foreground">@zenspa.almere</p>
              </div>
              <a
                href="https://instagram.com/zenspa.almere"
                target="_blank"
                rel="noopener noreferrer"
                className="hidden shrink-0 items-center gap-2 text-[16px] font-semibold text-foreground underline-offset-4 hover:underline sm:flex"
              >
                Volgen op Instagram ›
              </a>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-4">
              {[
                { src: '/hero.jpg',      objectPos: 'object-top' },
                { src: '/hero.jpg',      objectPos: 'object-center' },
                { src: '/bg-leaves.jpg', objectPos: 'object-center' },
                { src: '/hero.jpg',      objectPos: 'object-bottom' },
                { src: '/bg-leaves.jpg', objectPos: 'object-top' },
              ].map((img, i) => (
                <a
                  key={i}
                  href="https://instagram.com/zenspa.almere"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative aspect-square overflow-hidden rounded-3xl"
                >
                  <Image
                    src={img.src}
                    alt=""
                    fill
                    aria-hidden
                    className={`object-cover ${img.objectPos} transition-transform duration-700 group-hover:scale-[1.06]`}
                    sizes="(max-width: 768px) 50vw, 20vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/20" />
                </a>
              ))}
            </div>

            <a
              href="https://instagram.com/zenspa.almere"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 flex items-center gap-2 text-[16px] font-semibold text-foreground underline-offset-4 hover:underline sm:hidden"
            >
              Volgen op Instagram ›
            </a>
          </div>
        </section>

      </main>
      <SiteFooter bg="bg-background" />
    </>
  )
}
