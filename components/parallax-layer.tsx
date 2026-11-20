'use client'

import { useEffect, useRef } from 'react'

/**
 * Verschuift zijn inhoud verticaal terwijl de pagina scrolt.
 * `speed` in pixels: positief blijft achter bij de pagina, negatief schuift er sneller doorheen.
 * Het effect is gebaseerd op de afstand van de bovenliggende sectie tot het midden van het scherm.
 */
export function ParallaxLayer({
  speed,
  className,
  children,
}: {
  speed: number
  className?: string
  children: React.ReactNode
}) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const section = el.closest('section')
    if (!section) return

    let raf = 0
    const update = () => {
      raf = 0
      const rect = section.getBoundingClientRect()
      const offset = (rect.top + rect.height / 2 - window.innerHeight / 2) / window.innerHeight
      // Beperk tot het bereik waarin de sectie zichtbaar is, zodat de cadeautjes niet wegdrijven
      const clamped = Math.max(-1.2, Math.min(1.2, offset))
      el.style.transform = `translate3d(0, ${(clamped * speed).toFixed(1)}px, 0)`
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [speed])

  return (
    <div ref={ref} className={className} style={{ willChange: 'transform' }}>
      {children}
    </div>
  )
}
