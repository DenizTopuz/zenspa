'use client'

import { useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutList, BarChart2, CalendarOff } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { key: 'boekingen', label: 'Boekingen', icon: LayoutList,  href: '/admin/boekingen' },
  { key: 'inzichten', label: 'Inzichten', icon: BarChart2,   href: '/admin/inzichten' },
  { key: 'tijdslot',  label: 'Tijdslot',  icon: CalendarOff, href: '/admin/blokkeren' },
] as const

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname  = usePathname()
  const router    = useRouter()
  const isLogin   = pathname === '/admin'

  const activeTab = pathname.startsWith('/admin/inzichten') ? 'inzichten'
    : pathname.startsWith('/admin/blokkeren')  ? 'tijdslot'
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
  const tabRefs      = useRef<(HTMLButtonElement | null)[]>([null, null, null])
  const [pill, setPill]       = useState<{ left: number; width: number } | null>(null)
  const [compact, setCompact] = useState(false)

  // Animate pill to the active tab whenever the route changes
  useEffect(() => {
    if (isLogin) return
    const idx = activeTab === 'boekingen' ? 0 : activeTab === 'inzichten' ? 1 : 2
    const btn = tabRefs.current[idx]
    if (!btn || !containerRef.current) return
    const r = containerRef.current.getBoundingClientRect()
    const b = btn.getBoundingClientRect()
    setPill({ left: b.left - r.left, width: b.width })
  }, [activeTab, isLogin])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const obs = new ResizeObserver(([e]) => setCompact(e.contentRect.width < 300))
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  if (isLogin) return <>{children}</>

  return (
    <div className="flex flex-col h-dvh lg:h-auto lg:min-h-screen bg-background">
      {/* Page content — fills remaining height on mobile, natural height on desktop */}
      <div className="flex-1 flex flex-col min-h-0 lg:flex-none lg:min-h-0">
        {children}
      </div>

      {/* Shared bottom nav — never unmounts, so the pill slides smoothly between pages */}
      <div className="shrink-0 lg:hidden bg-background/80 backdrop-blur-sm px-4 md:px-8"
        style={{ paddingBottom: 'max(12px, env(safe-area-inset-bottom, 12px))', paddingTop: '8px' }}>
        <div className="mx-auto max-w-4xl">
          <div ref={containerRef}
            className={cn(
              'relative flex items-center justify-between rounded-full border border-foreground/10 bg-background/95 shadow-[0_8px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-300',
              compact ? 'px-1 py-1' : 'px-1 py-1.5',
            )}>
            {pill && (
              <span
                aria-hidden
                className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-accent/10"
                style={{
                  left: pill.left, width: pill.width - 1, height: 'calc(100% - 8px)',
                  transition: 'left 0.48s cubic-bezier(0.22,1,0.36,1), width 0.56s cubic-bezier(0.22,1,0.36,1)',
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
                    'relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-all duration-300',
                    compact ? 'py-1' : 'py-1.5',
                    active ? 'text-accent' : 'text-foreground/40',
                  )}>
                  <div className="relative">
                    <Icon
                      className={cn('transition-all duration-300', compact ? 'h-[16px] w-[16px]' : 'h-[19px] w-[19px]')}
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
                    'whitespace-nowrap leading-none tracking-wide transition-all duration-300',
                    compact ? 'text-[8px]' : 'text-[10px]',
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
    </div>
  )
}
