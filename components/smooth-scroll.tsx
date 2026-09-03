'use client'

import { useEffect, useRef } from 'react'
import { usePathname } from 'next/navigation'
import Lenis from 'lenis'

export function SmoothScroll() {
  const pathname = usePathname()
  const lenisRef = useRef<Lenis | null>(null)

  // Lenis smooth scroll — desktop only (mobile has native momentum scroll, Lenis can interfere)
  useEffect(() => {
    const isTouch = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    if (isTouch) return

    const lenis = new Lenis({
      duration: 1.8,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    })
    lenisRef.current = lenis

    let raf: number
    function loop(time: number) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    }
    raf = requestAnimationFrame(loop)

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
      lenisRef.current = null
      document.removeEventListener('click', handleClick)
    }
  }, [])

  // Scroll to top on route change
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true })
    } else {
      window.scrollTo(0, 0)
    }
  }, [pathname])

  // Section fade-in — re-run on every route change so newly mounted
  // sections are observed even after client-side navigation
  useEffect(() => {
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('section-visible')
            sectionObserver.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.06, rootMargin: '0px 0px -60px 0px' },
    )
    document.querySelectorAll<HTMLElement>('.section-fade').forEach((s) => {
      const rect = s.getBoundingClientRect()
      if (rect.top < window.innerHeight - 60 && rect.bottom > 0) {
        s.classList.add('section-visible')
      } else {
        sectionObserver.observe(s)
      }
    })
    return () => sectionObserver.disconnect()
  }, [pathname])

  return null
}
