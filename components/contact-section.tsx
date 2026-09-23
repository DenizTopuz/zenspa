'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Phone, MapPin, Clock } from 'lucide-react'

export function ContactSection({ className }: { className?: string }) {
  const [submitted, setSubmitted] = useState(false)

  const inputCls =
    'w-full rounded-2xl border border-foreground/12 bg-secondary/30 px-5 py-4 text-[16px] text-foreground placeholder:text-foreground/38 transition-colors duration-200 focus:border-accent/50 focus:bg-background focus:outline-none'

  return (
    <section
      id="contact"
      className={`section-fade bg-background pt-24 pb-24 md:pt-36 md:pb-36 ${className ?? ''}`}
      aria-labelledby="contact-heading"
    >
      <div className="mx-auto grid max-w-[1840px] items-center gap-14 px-5 md:px-6 lg:grid-cols-2 lg:gap-10 xl:gap-16">

        {/* Image — desktop only */}
        <div className="relative hidden aspect-square overflow-hidden rounded-3xl lg:block lg:rounded-[48px]">
          <Image
            src="/hero.jpg"
            alt=""
            fill
            aria-hidden
            className="object-cover object-center"
            sizes="(max-width: 1024px) 100vw, 50vw"
          />

          {/* Info overlay card */}
          <div className="absolute inset-x-5 bottom-5 rounded-[28px] bg-foreground/70 p-6 backdrop-blur-md md:inset-x-6 md:bottom-6 md:p-8">
            {/* Phone — prominent */}
            <div className="mb-5 flex items-center gap-4">
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/12">
                <Phone className="h-5 w-5 text-white" aria-hidden />
              </span>
              <a href="tel:0653207729" className="font-heading text-[22px] leading-none text-white md:text-[26px] hover:text-white/80 transition-colors">06 53 20 77 29</a>
            </div>

            <div className="h-px bg-white/12 mb-5" />

            {/* Address + hours grid */}
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 sm:gap-4">
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">Adres</p>
                </div>
                <p className="text-[14px] leading-[1.5] text-white/80">Kretastraat 77<br />1316 VT Almere</p>
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 shrink-0 text-white/50" aria-hidden />
                  <p className="text-[11px] font-semibold tracking-[0.14em] text-white/50 uppercase">Openingstijden</p>
                </div>
                <p className="text-[14px] leading-[1.5] text-white/80">Ma, Wo, Vr<br />10:00 – 18:00</p>
              </div>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="min-w-0">
          <p className="mb-3 text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">
            Afspraak maken
          </p>
          <h2
            id="contact-heading"
            className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[64px]"
          >
            Neem contact op
          </h2>
          <p className="mt-5 max-w-[480px] text-[17px] leading-[1.85] text-muted-foreground">
            Vul het formulier in en wij nemen zo snel mogelijk contact met je op om jouw afspraak in te plannen.
          </p>

          {submitted ? (
            <div className="mt-10 rounded-3xl bg-accent/10 px-8 py-10 text-center">
              <p className="font-heading text-[28px] tracking-tight text-accent">Bedankt!</p>
              <p className="mt-3 text-[16px] text-muted-foreground">
                We hebben je bericht ontvangen en nemen zo snel mogelijk contact op.
              </p>
            </div>
          ) : (
            <form
              onSubmit={(e) => { e.preventDefault(); setSubmitted(true) }}
              className="mt-10 flex flex-col gap-4"
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="text"  name="name"  placeholder="Voornaam" required className={inputCls} />
                <input type="text"  name="last"  placeholder="Achternaam"           className={inputCls} />
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input type="email" name="email" placeholder="E-mailadres" required className={inputCls} />
                <input type="tel"   name="phone" placeholder="Telefoonnummer"        className={inputCls} />
              </div>
              <label className="flex w-full min-w-0 flex-col gap-2">
                <span className="text-[13px] font-medium tracking-wide text-foreground/50 uppercase">Voorkeursdatum</span>
                <input type="date" name="date" className={`${inputCls} appearance-none block w-full text-foreground/70 cursor-pointer`} min={new Date().toISOString().split('T')[0]} onClick={(e) => (e.currentTarget as HTMLInputElement).showPicker?.()} />
              </label>
              <textarea
                name="message"
                placeholder="Vertel ons waarvoor je een afspraak wilt maken…"
                rows={5}
                className={`${inputCls} resize-none`}
              />
              <button
                type="submit"
                className="mt-2 w-full rounded-full bg-foreground py-5 text-[16px] font-semibold text-white transition-all duration-300 hover:bg-foreground/85"
              >
                Bericht versturen
              </button>
            </form>
          )}
        </div>

      </div>
    </section>
  )
}
