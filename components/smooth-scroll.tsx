'use client'

import { useEffect } from 'react'
import Lenis from 'lenis'

export function SmoothScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })

    let raf: number

    function loop(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }

    raf = requestAnimationFrame(loop)

    // Keep anchor-link clicks going through Lenis with the same slow pace
    function handleClick(e: MouseEvent) {
      const anchor = (e.target as Element).closest('a[href^="#"]')
      if (!anchor) return
      const href = anchor.getAttribute('href')!
      const target = document.querySelector(href) as HTMLElement | null
      if (!target) return
      e.preventDefault()
      lenis.scrollTo(target, { offset: -80 })
    }

    document.addEventListener('click', handleClick)

    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      document.removeEventListener('click', handleClick)
    }
  }, [])

  return null
}
