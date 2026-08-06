'use client'

import { useEffect, useRef, useState } from 'react'

interface CountUpProps {
  target: number
  suffix?: string
  duration?: number
}

export function CountUp({ target, suffix = '', duration = 2200 }: CountUpProps) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(target)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (rafRef.current !== null) {
          cancelAnimationFrame(rafRef.current)
          rafRef.current = null
        }

        if (entry.isIntersecting) {
          setCount(0)
          const start = performance.now()
          const step = (now: number) => {
            const progress = Math.min((now - start) / duration, 1)
            const eased = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(eased * target))
            if (progress < 1) {
              rafRef.current = requestAnimationFrame(step)
            } else {
              setCount(target)
              rafRef.current = null
            }
          }
          rafRef.current = requestAnimationFrame(step)
        } else {
          setCount(0)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => {
      observer.disconnect()
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current)
    }
  }, [target, duration])

  const formatted = count.toLocaleString('nl-NL')

  return (
    <span ref={ref}>
      {formatted}{suffix}
    </span>
  )
}
