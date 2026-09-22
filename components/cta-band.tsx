'use client'

import { useEffect, useRef } from 'react'
import Image from 'next/image'
import { MapPin, Clock, Phone } from 'lucide-react'

function useParallax(speed: number) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const section = el.closest('section')
    const handle = () => {
      if (!section) return
      const rect = section.getBoundingClientRect()
      const progress = -rect.top / window.innerHeight
      el.style.transform = `translateY(${progress * speed}px)`
    }

    handle()
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [speed])

  return ref
}

export function CtaBand() {
  const bgRef    = useParallax(120)  // photo moves faster
  const logoRef  = useParallax(48)   // logo drifts slower — second layer feel

  return (
    <section
      id="contact"
      className="section-fade relative overflow-hidden py-28 lg:py-56"
      aria-labelledby="cta-heading"
    >
      {/* Parallax background photo */}
      <div
        ref={bgRef}
        className="absolute inset-x-0 -bottom-[20%] -top-[20%]"
        style={{ willChange: 'transform' }}
      >
        <Image
          src="/hero.jpg"
          alt=""
          fill
          aria-hidden
          className="object-cover object-center"
          sizes="100vw"
        />
      </div>

      {/* Dark overlay — lighter on mobile for readability */}
      <div className="absolute inset-0 hidden lg:block lg:bg-black/58" />

      {/* Beeldlogo watermark — slower parallax layer */}
      <div
        ref={logoRef}
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-[0.055]"
        style={{ willChange: 'transform' }}
      >
        <svg
          viewBox="0 0 151.15 89.22"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[700px] max-w-[85vw] text-white"
          fill="currentColor"
        >
          <path d="M92.62,36.13c.31-2.41.33-5.21-.37-8.08-3.4-14.02-14.47-24.79-16.6-26.76-.2-.19-.51-.19-.71,0-2.13,1.97-13.2,12.74-16.6,26.76-.7,2.88-.68,5.67-.37,8.08.42,3.23,1.5,6.34,3.06,9.2,2.94,5.38,11.56,21.63,13.75,30.93.13.54.9.54,1.02,0,2.19-9.29,10.82-25.55,13.75-30.93,1.56-2.86,2.64-5.96,3.06-9.2Z"/>
          <path d="M19.52,31.65c-.39-.02-.7.3-.7.68.11,17.17,4.15,21.27,5.06,21.98.11.08.24.13.37.13,24.79,1.14,38.86,17.47,43.6,24.14.42.6,1.36.18,1.21-.54C60.21,35.13,24.95,31.89,19.52,31.65Z"/>
          <path d="M126.71,54.45c.14,0,.27-.05.37-.13.91-.71,4.95-4.81,5.06-21.98,0-.39-.32-.7-.7-.68-5.43.24-40.69,3.48-49.54,46.4-.15.72.78,1.13,1.21.54,4.74-6.67,18.81-23,43.6-24.14Z"/>
          <path d="M51.41,86.73c-22.7-7.56-28.85-24.31-29.76-27.22-.08-.26-.32-.45-.59-.47-8.89-.72-16.58.77-19,1.32-.41.09-.64.54-.47.93,12.02,27.99,40.31,27.68,49.68,26.75.72-.07.83-1.08.15-1.31Z"/>
          <path d="M149.31,60.35c-2.42-.54-10.11-2.03-19-1.32-.28.02-.51.21-.59.47-.91,2.91-7.06,19.66-29.76,27.22-.69.23-.57,1.24.15,1.31,9.37.93,37.66,1.23,49.68-26.75.17-.39-.06-.84-.47-.93Z"/>
          <path d="M28.07,59.75c-.5-.04-.87.47-.67.94,1.94,4.6,11.56,23.57,38.42,24.12.53.01.87-.58.58-1.03-2.81-4.54-15.25-22.37-38.33-24.02Z"/>
          <path d="M123.96,60.69c.19-.46-.17-.97-.67-.94-23.09,1.65-35.53,19.48-38.33,24.02-.28.45.05,1.04.58,1.03,26.86-.55,36.48-19.51,38.42-24.12Z"/>
          <path d="M45.45,35.1c3.48,2.25,6.44,3.22,7.91,3.59.46.12.9-.26.84-.73-.42-3.27-.31-6.45-1.48-8.84-2.52-5.16-8.42-7.13-10.47-7.68-.39-.1-.78.15-.84.55-.91,6.35,1.07,11.19,4.04,13.12Z"/>
          <path d="M97.24,38.69c1.46-.37,4.43-1.34,7.91-3.59,2.97-1.93,4.95-6.77,4.04-13.12-.06-.4-.45-.65-.84-.55-2.05.55-7.95,2.52-10.47,7.68-1.17,2.39-1.06,5.57-1.48,8.84-.06.47.38.85.84.73Z"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-8 px-5 text-center">
        <div className="flex flex-col gap-5">
          <span className="text-[12px] font-semibold tracking-[0.22em] text-white/70 uppercase">
            Reserveer je sessie
          </span>
          <h2
            id="cta-heading"
            className="font-heading text-[52px] leading-[1.05] tracking-tight text-white md:text-[68px] lg:text-[80px]"
          >
            De rest van je dag<br />
            begint hier.
          </h2>
        </div>
        <p className="max-w-[440px] text-[17px] leading-[1.8] text-white/80">
          Jouw therapeut staat klaar. Jouw kamer wacht.<br className="hidden sm:block" />{' '}
          Het enige wat ontbreekt, ben jij.
        </p>
        <div className="flex flex-col items-center gap-4 text-[13px] text-white/65 sm:flex-row sm:gap-6">
          <span className="flex items-center gap-2">
            <MapPin className="h-3.5 w-3.5" aria-hidden /> Kretastraat 77, Almere
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden />
          <span className="flex items-center gap-2">
            <Clock className="h-3.5 w-3.5" aria-hidden /> Ma, Wo, Vr: 10:00 – 18:00
          </span>
          <span className="hidden h-3 w-px bg-white/20 sm:block" aria-hidden />
          <a href="tel:0653207729" className="flex items-center gap-2 transition-colors hover:text-white/70">
            <Phone className="h-3.5 w-3.5" aria-hidden /> 06 53 20 77 29
          </a>
        </div>
      </div>
    </section>
  )
}
