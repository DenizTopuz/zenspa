'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutList, BarChart2, CalendarOff, CalendarDays } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'boekingen', label: 'Boekingen', icon: LayoutList,   href: '/admin/boekingen' },
  { key: 'agenda',    label: 'Agenda',    icon: CalendarDays,  href: '/admin/agenda'    },
  { key: 'inzichten', label: 'Inzichten', icon: BarChart2,    href: '/admin/inzichten' },
  { key: 'tijdslot',  label: 'Tijdslot',  icon: CalendarOff,  href: '/admin/blokkeren' },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const isLogin   = pathname === '/admin'

  const activeTab = pathname.startsWith('/admin/inzichten') ? 'inzichten'
    : pathname.startsWith('/admin/blokkeren')  ? 'tijdslot'
    : pathname.startsWith('/admin/agenda')     ? 'agenda'
    : 'boekingen'

  const [pendingCount, setPendingCount] = useState(0)

  useEffect(() => {
    if (isLogin) return
    const load = async () => {
      try {
        const res = await fetch('/api/admin/insights')
        if (res.ok) {
          const d = await res.json()
          setPendingCount(d.stats?.pending ?? 0)
        }
      } catch {}
    }
    load()
    const t = setInterval(load, 60_000)
    return () => clearInterval(t)
  }, [isLogin])

  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs      = useRef<(HTMLButtonElement | null)[]>([null, null, null, null])
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)

  useEffect(() => {
    if (isLogin) return
    const idx = activeTab === 'boekingen' ? 0 : activeTab === 'agenda' ? 1 : activeTab === 'inzichten' ? 2 : 3
    const btn = tabRefs.current[idx]
    if (!btn || !containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    setPill({ left: b.left - r.left, width: b.width })
  }, [activeTab, isLogin])

  if (isLogin) return <>{children}</>

  return (
    <div className="flex flex-col h-dvh bg-background">
      {/* Page content — fills remaining height on mobile, natural height on desktop */}
      <div className="flex-1 flex flex-col min-h-0">
        {children}
      </div>

      {/* Shared bottom nav */}
      <div className="shrink-0 border-t border-foreground/10 bg-background"
        style={{ paddingBottom: 'env(safe-area-inset-bottom, 0px)' }}>
        <div ref={containerRef} className="relative flex items-stretch mx-auto max-w-4xl">

          {/* Sliding accent top-line */}
          {pill && (
            <span
              aria-hidden
              className="pointer-events-none absolute top-0 bg-accent"
              style={{
                left: pill.left, width: pill.width,
                height: 2,
                transition: 'left 0.42s cubic-bezier(0.22,1,0.36,1), width 0.42s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          )}

          {/* Sliding fill */}
          {pill && (
            <span
              aria-hidden
              className="pointer-events-none absolute inset-y-0 bg-accent/8"
              style={{
                left: pill.left, width: pill.width,
                transition: 'left 0.42s cubic-bezier(0.22,1,0.36,1), width 0.42s cubic-bezier(0.22,1,0.36,1)',
              }}
            />
          )}

          {TABS.map(({ key, label, icon: Icon, href }, i) => {
            const active = key === activeTab
            const badge  = key === 'boekingen' ? pendingCount : 0
            return (
              <button
                key={key}
                ref={el => { tabRefs.current[i] = el }}
                onClick={() => router.push(href)}
                className={cn(
                  'relative flex flex-1 flex-col items-center justify-center gap-1 py-4 transition-colors duration-200',
                  active ? 'text-accent' : 'text-foreground/45',
                )}>
                <div className="relative">
                  <Icon
                    className="h-[22px] w-[22px] transition-all duration-200"
                    strokeWidth={active ? 2.3 : 1.7}
                    aria-hidden
                  />
                  {badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 flex h-[14px] w-[14px] items-center justify-center rounded-full bg-red-500 text-[8px] font-bold leading-none text-white">
                      {badge > 99 ? '99+' : badge}
                    </span>
                  )}
                </div>
                <span className={cn(
                  'whitespace-nowrap text-[10px] leading-none tracking-wide',
                  active ? 'font-bold' : 'font-medium',
                )}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
