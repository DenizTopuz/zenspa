'use client'

import { useState, useEffect, useRef } from 'react'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'gezicht',  label: 'Gezicht'  },
  { key: 'lichaam',  label: 'Lichaam'  },
  { key: 'pmu',      label: 'PMU'      },
  { key: 'ontharen', label: 'Ontharen' },
]

export function BehandelingenPageTabs() {
  const [active, setActive] = useState('gezicht')
  const [stuck, setStuck] = useState(false)
  const [headerH, setHeaderH] = useState(65)
  const [tabH, setTabH] = useState(0)
  const sentinelRef = useRef<HTMLDivElement>(null)
  const tabRef = useRef<HTMLDivElement>(null)
  // Prevents observer from overriding active state right after a tap
  const clickLock = useRef(false)

  // Track header bottom (shrinks on scroll)
  useEffect(() => {
    const update = () => {
      const h = document.querySelector('header')?.getBoundingClientRect().bottom ?? 65
      setHeaderH(Math.round(h))
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update, { passive: true })
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [])

  // Measure tab bar height for spacer
  useEffect(() => {
    if (tabRef.current) setTabH(tabRef.current.offsetHeight)
  })

  // Highlight section in view
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        if (clickLock.current) return
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id)
        }
      },
      { rootMargin: '-80px 0px -50% 0px', threshold: 0 },
    )
    TABS.forEach(({ key }) => {
      const el = document.getElementById(key)
      if (el) obs.observe(el)
    })
    return () => obs.disconnect()
  }, [])

  // Switch to fixed only when sentinel scrolls past top (not when below fold)
  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (window.innerWidth >= 640) { setStuck(false); return }
        if (!entry.isIntersecting) {
          setStuck(entry.boundingClientRect.top < 0)
        } else {
          setStuck(false)
        }
      },
      { threshold: 0 },
    )
    obs.observe(el)
    const onResize = () => { if (window.innerWidth >= 640) setStuck(false) }
    window.addEventListener('resize', onResize, { passive: true })
    return () => { obs.disconnect(); window.removeEventListener('resize', onResize) }
  }, [])

  const handleClick = (key: string) => {
    setActive(key)
    clickLock.current = true
    setTimeout(() => { clickLock.current = false }, 1200)
  }

  const bar = (
    <div className="flex w-full rounded-full bg-accent/10 p-1.5">
      {TABS.map(({ key, label }) => (
        <a
          key={key}
          href={`#${key}`}
          onClick={() => handleClick(key)}
          className={cn(
            'flex flex-1 items-center justify-center rounded-full py-4.5 text-[14px] font-semibold leading-none transition-all duration-200',
            active === key
              ? 'bg-accent text-white shadow-sm'
              : 'text-foreground/45',
          )}
        >
          {label}
        </a>
      ))}
    </div>
  )

  return (
    <>
      <div ref={sentinelRef} className="h-px sm:hidden" aria-hidden />

      {/* Spacer so content doesn't jump when bar becomes fixed */}
      {stuck && (
        <div className="sm:hidden" style={{ height: tabH || 54 }} aria-hidden />
      )}

      <div
        ref={tabRef}
        className={cn(
          'sm:hidden z-40',
          stuck
            ? 'fixed left-0 right-0 bg-background/95 backdrop-blur-md shadow-[0_1px_0_rgba(0,0,0,0.06)] px-4 py-4'
            : 'px-5 pt-6 pb-5',
        )}
        style={stuck ? { top: headerH } : undefined}
      >
        {bar}
      </div>
    </>
  )
}
