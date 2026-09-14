'use client'

import { useEffect, useRef } from 'react'

export function BookingCTA() {
  const sectionRef = useRef<HTMLElement>(null)
  const bgRef     = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      if (!sectionRef.current || !bgRef.current) return
      const rect  = sectionRef.current.getBoundingClientRect()
      // visibleRatio goes 0→1 as section enters→leaves the viewport
      const ratio = (window.innerHeight - rect.top) / (window.innerHeight + rect.height)
      // shift ±80px so edges never show (background overshoots by 160px total)
      bgRef.current.style.transform = `translateY(${(ratio - 0.5) * -160}px)`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <section ref={sectionRef} className="relative isolate overflow-hidden">
      {/* Background — oversized vertically to give the parallax room to move */}
      <div
        ref={bgRef}
        className="-z-10 bg-cover bg-center will-change-transform"
        style={{
          backgroundImage: "url('/hero.jpg')",
          position: 'absolute',
          inset: '-100px 0',
        }}
      />

      {/* Warm amber overlay */}
      <div className="absolute inset-0 -z-10 bg-stone-950/58" />

      {/* Logo-mark watermark */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 150 90"
          xmlns="http://www.w3.org/2000/svg"
          className="h-[640px] w-[640px] opacity-[0.07]"
          aria-hidden
        >
          <path fill="white" d="M91.49,35.28c.31-2.41.33-5.21-.37-8.08-3.4-14.02-14.47-24.79-16.6-26.76-.2-.19-.51-.19-.71,0-2.13,1.97-13.2,12.74-16.6,26.76-.7,2.88-.68,5.67-.37,8.08.42,3.23,1.5,6.34,3.06,9.2,2.94,5.38,11.56,21.63,13.75,30.93.13.54.9.54,1.02,0,2.19-9.29,10.82-25.55,13.75-30.93,1.56-2.86,2.64-5.96,3.06-9.2Z"/>
          <path fill="white" d="M18.39,30.8c-.39-.02-.7.3-.7.68.11,17.17,4.15,21.27,5.06,21.98.11.08.24.13.37.13,24.79,1.14,38.86,17.47,43.6,24.14.42.6,1.36.18,1.21-.54C59.08,34.29,23.82,31.05,18.39,30.8Z"/>
          <path fill="white" d="M125.58,53.6c.14,0,.27-.05.37-.13.91-.71,4.95-4.81,5.06-21.98,0-.39-.32-.7-.7-.68-5.43.24-40.69,3.48-49.54,46.4-.15.72.78,1.13,1.21.54,4.74-6.67,18.81-23,43.6-24.14Z"/>
          <path fill="white" d="M50.28,85.88c-22.7-7.56-28.85-24.31-29.76-27.22-.08-.26-.32-.45-.59-.47-8.89-.72-16.58.77-19,1.32-.41.09-.64.54-.47.93,12.02,27.99,40.31,27.68,49.68,26.75.72-.07.83-1.08.15-1.31Z"/>
          <path fill="white" d="M148.18,59.51c-2.42-.54-10.11-2.03-19-1.32-.28.02-.51.21-.59.47-.91,2.91-7.06,19.66-29.76,27.22-.69.23-.57,1.24.15,1.31,9.37.93,37.66,1.23,49.68-26.75.17-.39-.06-.84-.47-.93Z"/>
          <path fill="white" d="M26.94,58.9c-.5-.04-.87.47-.67.94,1.94,4.6,11.56,23.57,38.42,24.12.53.01.87-.58.58-1.03-2.81-4.54-15.25-22.37-38.33-24.02Z"/>
          <path fill="white" d="M122.83,59.84c.19-.46-.17-.97-.67-.94-23.09,1.65-35.53,19.48-38.33,24.02-.28.45.05,1.04.58,1.03,26.86-.55,36.48-19.51,38.42-24.12Z"/>
          <path fill="white" d="M44.32,34.25c3.48,2.25,6.44,3.22,7.91,3.59.46.12.9-.26.84-.73-.42-3.27-.31-6.45-1.48-8.84-2.52-5.16-8.42-7.13-10.47-7.68-.39-.1-.78.15-.84.55-.91,6.35,1.07,11.19,4.04,13.12Z"/>
          <path fill="white" d="M96.11,37.84c1.46-.37,4.43-1.34,7.91-3.59,2.97-1.93,4.95-6.77,4.04-13.12-.06-.4-.45-.65-.84-.55-2.05.55-7.95,2.52-10.47,7.68-1.17,2.39-1.06,5.57-1.48,8.84-.06.47.38.85.84.73Z"/>
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-44 text-center text-white md:py-56">
        <p className="text-[13px] font-semibold tracking-[0.22em] text-white/60 uppercase">
          Klaar om te boeken?
        </p>
        <h2 className="mt-5 font-heading text-[48px] leading-[1.08] tracking-tight md:text-[64px] lg:text-[76px]">
          Jouw Behandeling Wacht.
        </h2>
        <p className="mx-auto mt-6 max-w-[480px] text-[17px] leading-[1.8] text-white/70">
          Soms zijn er nog dezelfde dag afspraken beschikbaar. Reserveer jouw moment en laat de rest aan ons over.
        </p>
        <a
          href="/boeken"
          className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-4 text-[16px] font-semibold text-stone-900 transition-all duration-300 hover:bg-white/90 hover:gap-3"
        >
          Maak een Afspraak
          <span aria-hidden>›</span>
        </a>
      </div>
    </section>
  )
}
