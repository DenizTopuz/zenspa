'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Clock, CheckCircle, XCircle, LayoutList, CalendarOff, List, LayoutGrid, CalendarDays, ChevronLeft, ChevronRight, BarChart2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingRow, BookingStatus } from '@/lib/supabase/types'

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'In afwachting',
  confirmed: 'Goedgekeurd',
  rejected: 'Afgewezen',
  cancelled: 'Geannuleerd',
}
const STATUS_COLOR: Record<BookingStatus, string> = {
  pending:   'bg-amber-100 text-amber-700',
  confirmed: 'bg-green-100 text-green-700',
  rejected:  'bg-red-100 text-red-600',
  cancelled: 'bg-gray-100 text-gray-400',
}
const STATUS_DOT: Record<BookingStatus, string> = {
  pending:   'bg-amber-400',
  confirmed: 'bg-green-500',
  rejected:  'bg-red-400',
  cancelled: 'bg-gray-300',
}

const TAB_ITEMS = [
  { key: 'pending',   label: 'Wachtend',  icon: Clock,        color: 'text-amber-600' },
  { key: 'confirmed', label: 'Bevestigd', icon: CheckCircle,  color: 'text-accent'    },
  { key: 'rejected',  label: 'Afgewezen', icon: XCircle,      color: 'text-red-500'   },
  { key: 'all',       label: 'Alles',     icon: LayoutList,   color: 'text-foreground'},
] as const

type ViewMode = 'cards' | 'list' | 'calendar'
type CalMode  = 'day' | 'week' | 'month'

function formatDT(iso: string) {
  return new Date(iso).toLocaleString('nl-NL', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam',
  })
}
function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('nl-NL', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam' })
}
function isSameDay(iso: string, date: Date) {
  return new Date(iso).toLocaleDateString('nl-NL', { timeZone: 'Europe/Amsterdam' }) ===
    date.toLocaleDateString('nl-NL', { timeZone: 'Europe/Amsterdam' })
}
function startOfWeek(d: Date) {
  const day = new Date(d)
  const dow = (day.getDay() + 6) % 7
  day.setDate(day.getDate() - dow)
  day.setHours(0, 0, 0, 0)
  return day
}
const DAY_LABELS = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MONTH_NL = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']

export default function AdminBoekingen() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BookingStatus | 'all'>('pending')
  const [updating, setUpdating] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [visibleCount, setVisibleCount] = useState(20)
  const [view, setView] = useState<ViewMode>('cards')
  const [calMode, setCalMode] = useState<CalMode>('month')
  const [calDate, setCalDate] = useState(new Date())
  const [selectedWeekDay, setSelectedWeekDay] = useState(new Date())
  const [compact, setCompact] = useState(false)
  const [pill, setPill] = useState<{ left: number; width: number } | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([null, null, null, null])
  const lastY = useRef(0)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/bookings')
    if (res.status === 401) { router.push('/admin'); return }
    const { bookings } = await res.json()
    setBookings(bookings ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  useEffect(() => {
    const activeIdx = TAB_ITEMS.findIndex(t => t.key === filter)
    const el = activeIdx >= 0 ? tabRefs.current[activeIdx] : null
    const container = containerRef.current
    if (!el || !container) { setPill(null); return }
    const update = () => {
      const cRect = container.getBoundingClientRect()
      const eRect = el.getBoundingClientRect()
      setPill({ left: eRect.left - cRect.left, width: eRect.width })
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [filter, compact])

  useEffect(() => {
    const handle = () => {
      const y = window.scrollY
      if (y < 20) setCompact(false)
      else if (y > lastY.current + 6) setCompact(true)
      else if (y < lastY.current - 6) setCompact(false)
      lastY.current = y
    }
    window.addEventListener('scroll', handle, { passive: true })
    return () => window.removeEventListener('scroll', handle)
  }, [])

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdating(id)
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await load()
    setUpdating(null)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const q = search.toLowerCase().trim()
  const filtered = (filter === 'all' ? bookings : bookings.filter(b => b.status === filter))
    .filter(b => !q || b.customer_name.toLowerCase().includes(q) || b.treatment_name.toLowerCase().includes(q) || b.customer_email.toLowerCase().includes(q))
  const shown = filtered.slice(0, visibleCount)
  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  }
  const totalFiltered = filtered.length

  // --- Card view ---
  function CardView() {
    if (shown.length === 0) return <p className="text-foreground/40 py-8">Geen boekingen gevonden.</p>
    return (
      <div className="space-y-3">
        {shown.map(b => (
          <div key={b.id} className="rounded-2xl border border-foreground/8 bg-white shadow-sm overflow-hidden">
            <div className="px-4 pt-4 pb-3 flex items-start justify-between gap-3">
              <div>
                <p className="font-semibold text-foreground leading-snug">{b.treatment_name}</p>
                <p className="mt-1 text-[13px] font-medium text-foreground/50">{formatDT(b.start_time)}</p>
              </div>
              <span className={`shrink-0 mt-0.5 rounded-full px-2.5 py-0.5 text-[11px] font-semibold tracking-wide ${STATUS_COLOR[b.status]}`}>
                {STATUS_LABEL[b.status]}
              </span>
            </div>
            <div className="mx-4 border-t border-foreground/6" />
            <div className="px-4 py-3 space-y-1">
              <p className="text-sm font-semibold text-foreground">{b.customer_name}</p>
              <p className="text-[13px] text-foreground/55">{b.customer_email}</p>
              <p className="text-[13px] text-foreground/55">{b.customer_phone}</p>
              {b.notes && <p className="pt-1 text-[13px] text-foreground/45 italic">"{b.notes}"</p>}
            </div>
            {b.status === 'pending' && (
              <div className="px-4 pb-4 flex gap-2">
                <button onClick={() => updateStatus(b.id, 'confirmed')} disabled={updating === b.id}
                  className="flex-1 rounded-xl bg-accent py-2 text-sm font-medium text-white hover:bg-accent/90 disabled:opacity-50 transition-colors">
                  Goedkeuren
                </button>
                <button onClick={() => updateStatus(b.id, 'rejected')} disabled={updating === b.id}
                  className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-medium text-red-600 hover:bg-red-100 disabled:opacity-50 transition-colors">
                  Afwijzen
                </button>
              </div>
            )}
            {b.status === 'confirmed' && (
              <div className="px-4 pb-4">
                <button onClick={() => updateStatus(b.id, 'cancelled')} disabled={updating === b.id}
                  className="rounded-xl border border-foreground/12 px-4 py-2 text-[13px] text-foreground/45 hover:bg-secondary/30 disabled:opacity-50 transition-colors">
                  Annuleren
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // --- List view ---
  function ListView() {
    if (shown.length === 0) return <p className="text-foreground/40 py-8">Geen boekingen gevonden.</p>
    return (
      <div className="rounded-2xl border border-foreground/8 bg-white shadow-sm overflow-hidden divide-y divide-foreground/6">
        {shown.map(b => (
          <div key={b.id} className="flex items-center gap-3 px-4 py-3">
            <span className={`shrink-0 h-2 w-2 rounded-full ${STATUS_DOT[b.status]}`} />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{b.treatment_name}</p>
              <p className="text-[11px] text-foreground/45 truncate">{formatDT(b.start_time)} · {b.customer_name}</p>
            </div>
            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[b.status]}`}>
              {STATUS_LABEL[b.status]}
            </span>
            {b.status === 'pending' && (
              <div className="flex gap-1 shrink-0">
                <button onClick={() => updateStatus(b.id, 'confirmed')} disabled={updating === b.id}
                  className="rounded-lg bg-accent px-2.5 py-1 text-[11px] font-medium text-white disabled:opacity-50">✓</button>
                <button onClick={() => updateStatus(b.id, 'rejected')} disabled={updating === b.id}
                  className="rounded-lg border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] text-red-600 disabled:opacity-50">✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  // --- Calendar helpers ---
  function bookingsOnDay(date: Date) {
    return shown.filter(b => isSameDay(b.start_time, date))
  }

  // --- Month view ---
  function MonthView() {
    const year = calDate.getFullYear()
    const month = calDate.getMonth()
    const firstDay = new Date(year, month, 1)
    const daysInMonth = new Date(year, month + 1, 0).getDate()
    let startDow = (firstDay.getDay() + 6) % 7
    const cells: (Date | null)[] = Array(startDow).fill(null)
    for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d))
    const today = new Date()

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => setCalDate(new Date(year, month - 1, 1))}
            className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
            <ChevronLeft className="h-4 w-4 text-foreground/60" />
          </button>
          <span className="text-sm font-semibold text-foreground capitalize">
            {MONTH_NL[month]} {year}
          </span>
          <button onClick={() => setCalDate(new Date(year, month + 1, 1))}
            className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
            <ChevronRight className="h-4 w-4 text-foreground/60" />
          </button>
        </div>
        <div className="rounded-2xl border border-foreground/8 bg-white shadow-sm overflow-hidden">
          <div className="grid grid-cols-7 border-b border-foreground/6">
            {DAY_LABELS.map(d => (
              <div key={d} className="py-2 text-center text-[10px] font-semibold text-foreground/40 uppercase tracking-wide">{d}</div>
            ))}
          </div>
          <div className="grid grid-cols-7">
            {cells.map((date, i) => {
              if (!date) return <div key={i} className="h-14 border-b border-r border-foreground/4 last:border-r-0" />
              const dayB = bookingsOnDay(date)
              const isToday = date.toDateString() === today.toDateString()
              const isSelected = date.toDateString() === calDate.toDateString()
              return (
                <div key={i}
                  onClick={() => { setCalDate(date); setCalMode('day') }}
                  className={cn(
                    'h-14 p-1 border-b border-r border-foreground/4 cursor-pointer transition-colors',
                    (i + 1) % 7 === 0 && 'border-r-0',
                    isSelected && !isToday ? 'bg-secondary/20' : '',
                    'hover:bg-secondary/15'
                  )}
                >
                  <span className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full text-[11px] font-medium',
                    isToday ? 'bg-accent text-white font-bold' : 'text-foreground/60'
                  )}>
                    {date.getDate()}
                  </span>
                  {dayB.length > 0 && (
                    <div className="mt-0.5 flex flex-wrap gap-0.5 px-0.5">
                      {dayB.slice(0, 3).map(b => (
                        <span key={b.id} className={cn('h-1.5 w-1.5 rounded-full', STATUS_DOT[b.status])} />
                      ))}
                      {dayB.length > 3 && <span className="text-[8px] text-foreground/35">+{dayB.length - 3}</span>}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // --- Week view ---
  function WeekView() {
    const weekStart = startOfWeek(calDate)
    const days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(weekStart)
      d.setDate(d.getDate() + i)
      return d
    })
    const today = new Date()
    const dayBookings = bookingsOnDay(selectedWeekDay)

    return (
      <div>
        <div className="flex items-center justify-between mb-3">
          <button onClick={() => { const d = new Date(calDate); d.setDate(d.getDate() - 7); setCalDate(d) }}
            className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
            <ChevronLeft className="h-4 w-4 text-foreground/60" />
          </button>
          <span className="text-sm font-semibold text-foreground">
            {days[0].getDate()} – {days[6].getDate()} {MONTH_NL[days[6].getMonth()]}
          </span>
          <button onClick={() => { const d = new Date(calDate); d.setDate(d.getDate() + 7); setCalDate(d) }}
            className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
            <ChevronRight className="h-4 w-4 text-foreground/60" />
          </button>
        </div>
        {/* Dag-strip */}
        <div className="rounded-2xl border border-foreground/8 bg-white shadow-sm overflow-hidden mb-4">
          <div className="grid grid-cols-7 divide-x divide-foreground/6">
            {days.map((d, i) => {
              const isToday = d.toDateString() === today.toDateString()
              const isSelected = d.toDateString() === selectedWeekDay.toDateString()
              const dayB = bookingsOnDay(d)
              return (
                <button key={i} onClick={() => setSelectedWeekDay(d)}
                  className={cn('py-3 flex flex-col items-center gap-1 transition-colors', isSelected ? 'bg-secondary/20' : 'hover:bg-secondary/10')}>
                  <span className="text-[10px] font-medium text-foreground/40">{DAY_LABELS[i]}</span>
                  <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold',
                    isToday ? 'bg-accent text-white' : isSelected ? 'text-accent' : 'text-foreground/70')}>
                    {d.getDate()}
                  </span>
                  {dayB.length > 0 && (
                    <span className={cn('h-1.5 w-1.5 rounded-full', isSelected ? 'bg-accent' : STATUS_DOT[dayB[0].status])} />
                  )}
                </button>
              )
            })}
          </div>
        </div>
        {/* Boekingen voor geselecteerde dag */}
        <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider mb-2">
          {selectedWeekDay.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        {dayBookings.length === 0
          ? <p className="text-sm text-foreground/40 py-4">Geen boekingen op deze dag.</p>
          : <div className="space-y-2">{dayBookings.map(b => <DayBookingRow key={b.id} b={b} />)}</div>}
      </div>
    )
  }

  // --- Day view ---
  function DayView() {
    const today = new Date()
    const isToday = calDate.toDateString() === today.toDateString()
    const dayBookings = bookingsOnDay(calDate)

    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => { const d = new Date(calDate); d.setDate(d.getDate() - 1); setCalDate(d) }}
            className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
            <ChevronLeft className="h-4 w-4 text-foreground/60" />
          </button>
          <div className="text-center">
            <p className="text-sm font-semibold text-foreground capitalize">
              {calDate.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {isToday && <p className="text-[10px] text-accent font-medium">Vandaag</p>}
          </div>
          <button onClick={() => { const d = new Date(calDate); d.setDate(d.getDate() + 1); setCalDate(d) }}
            className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
            <ChevronRight className="h-4 w-4 text-foreground/60" />
          </button>
        </div>
        {dayBookings.length === 0
          ? <p className="text-foreground/40 py-8">Geen boekingen op deze dag.</p>
          : <div className="space-y-2">{dayBookings.map(b => <DayBookingRow key={b.id} b={b} />)}</div>}
      </div>
    )
  }

  function DayBookingRow({ b }: { b: BookingRow }) {
    return (
      <div className="rounded-xl border border-foreground/8 bg-white px-4 py-3 shadow-sm flex items-start gap-3">
        <div className="flex flex-col items-center pt-0.5 shrink-0">
          <span className="text-sm font-bold text-foreground/70 tabular-nums">{formatTime(b.start_time)}</span>
          <span className={cn('mt-1 h-1.5 w-1.5 rounded-full', STATUS_DOT[b.status])} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-foreground">{b.treatment_name}</p>
          <p className="text-[12px] text-foreground/55">{b.customer_name} · {b.customer_phone}</p>
          <span className={`mt-1 inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${STATUS_COLOR[b.status]}`}>
            {STATUS_LABEL[b.status]}
          </span>
        </div>
        {b.status === 'pending' && (
          <div className="flex flex-col gap-1 shrink-0">
            <button onClick={() => updateStatus(b.id, 'confirmed')} disabled={updating === b.id}
              className="rounded-lg bg-accent px-3 py-1 text-[11px] font-medium text-white disabled:opacity-50">✓</button>
            <button onClick={() => updateStatus(b.id, 'rejected')} disabled={updating === b.id}
              className="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-[11px] text-red-600 disabled:opacity-50">✕</button>
          </div>
        )}
      </div>
    )
  }

  const sectionTitle = filter === 'all' ? 'Alle boekingen' : STATUS_LABEL[filter]
  const sectionCount = filter === 'all' ? counts.all : counts[filter as keyof typeof counts]

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-foreground/8 bg-white px-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between py-4">
          <Image src="/logo-green.svg" alt="Zen Spa" width={100} height={27} priority />
          <div className="flex items-center gap-2">
            <a href="/admin/inzichten" className="flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-1.5 text-sm text-foreground/70 hover:bg-secondary/30">
              <BarChart2 className="h-3.5 w-3.5" aria-hidden />
              Inzichten
            </a>
            <a href="/admin/blokkeren" className="flex items-center gap-1.5 rounded-full border border-foreground/15 px-4 py-1.5 text-sm text-foreground/70 hover:bg-secondary/30">
              <CalendarOff className="h-3.5 w-3.5" aria-hidden />
              Tijdslot
            </a>
            <button onClick={logout} className="text-sm text-foreground/40 hover:text-foreground">
              Uitloggen
            </button>
          </div>
        </div>
        {/* Desktop filter */}
        <div className="mx-auto hidden max-w-4xl gap-1 pb-3 lg:flex">
          {TAB_ITEMS.map(({ key, label }) => {
            const count = key === 'all' ? counts.all : counts[key as keyof typeof counts]
            return (
              <button key={key} onClick={() => setFilter(key)}
                className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                  filter === key ? 'bg-accent text-white' : 'border border-foreground/12 text-foreground/60 hover:bg-secondary/30'
                }`}>
                {label}{count > 0 && key !== 'all' ? ` · ${count}` : ''}
              </button>
            )
          })}
        </div>
      </header>

      {/* Zwevende navigatiebalk */}
      <nav className="fixed left-2 right-2 z-50 lg:hidden md:left-1/2 md:right-auto md:w-[480px] md:-translate-x-1/2"
        style={{ bottom: 'max(16px, env(safe-area-inset-bottom, 16px))' }}>
        <div ref={containerRef}
          className={cn('relative flex items-center justify-between rounded-full border border-foreground/10 bg-background/95 shadow-[0_8px_40px_rgba(0,0,0,0.14)] backdrop-blur-xl transition-all duration-300',
            compact ? 'px-1 py-1' : 'px-1 py-1.5')}>
          {pill && (
            <span aria-hidden className="pointer-events-none absolute top-1/2 -translate-y-1/2 rounded-full bg-accent/10"
              style={{ left: pill.left, width: pill.width - 1, height: 'calc(100% - 8px)',
                transition: 'left 0.48s cubic-bezier(0.22,1,0.36,1), width 0.56s cubic-bezier(0.22,1,0.36,1)' }} />
          )}
          {TAB_ITEMS.map(({ key, label, icon: Icon, color }, i) => {
            const count = key === 'all' ? 0 : counts[key as keyof typeof counts]
            const active = filter === key
            const badgeColor = key === 'pending' ? 'bg-amber-400' : key === 'confirmed' ? 'bg-green-500' : 'bg-red-400'
            return (
              <button key={key} ref={el => { tabRefs.current[i] = el }} onClick={() => setFilter(key)}
                className={cn('relative flex flex-1 flex-col items-center justify-center gap-0.5 rounded-full px-3 transition-all duration-300',
                  compact ? 'py-1' : 'py-1.5', active ? color : 'text-foreground/40')}>
                <div className="relative">
                  <Icon className={cn('transition-all duration-300', compact ? 'h-[16px] w-[16px]' : 'h-[19px] w-[19px]')}
                    strokeWidth={active ? 2.3 : 1.7} aria-hidden />
                  {count > 0 && key !== 'all' && (
                    <span className={cn('absolute -top-1.5 -right-2 flex items-center justify-center rounded-full text-white font-bold leading-none',
                      badgeColor, count > 9 ? 'min-w-[16px] px-0.5 h-[14px] text-[8px]' : 'h-[14px] w-[14px] text-[8px]')}>
                      {count > 99 ? '99+' : count}
                    </span>
                  )}
                </div>
                <span className={cn('whitespace-nowrap leading-none tracking-wide transition-all duration-300',
                  compact ? 'text-[8px]' : 'text-[10px]', active ? 'font-bold' : 'font-medium')}>
                  {label}
                </span>
              </button>
            )
          })}
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-4 py-6 pb-28 md:px-8">
        {/* Sectietitel + weergave-toggle */}
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">{sectionTitle}</h1>
            <p className="text-sm text-foreground/40">
              {sectionCount}{' '}{filter === 'pending' ? 'aanvragen' : filter === 'confirmed' ? 'afspraken' : 'boekingen'}
            </p>
          </div>
          {/* Weergave-toggle */}
          <div className="flex items-center gap-1 rounded-xl border border-foreground/10 bg-white p-1 shadow-sm shrink-0">
            {([
              { v: 'list' as ViewMode,     icon: List },
              { v: 'cards' as ViewMode,    icon: LayoutGrid },
              { v: 'calendar' as ViewMode, icon: CalendarDays },
            ]).map(({ v, icon: Icon }) => (
              <button key={v} onClick={() => setView(v)}
                className={cn('rounded-lg p-1.5 transition-colors',
                  view === v ? 'bg-accent text-white' : 'text-foreground/40 hover:text-foreground hover:bg-secondary/20')}>
                <Icon className="h-4 w-4" aria-hidden />
              </button>
            ))}
          </div>
        </div>

        {/* Zoekbalk */}
        {view !== 'calendar' && (
          <div className="mb-4 relative">
            <input
              type="search"
              value={search}
              onChange={e => { setSearch(e.target.value); setVisibleCount(20) }}
              placeholder="Zoek op naam, behandeling of e-mail…"
              className="w-full rounded-xl border border-foreground/12 bg-white px-4 py-2.5 pl-9 text-sm text-foreground placeholder:text-foreground/35 shadow-sm focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <svg className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground/35" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
            </svg>
          </div>
        )}

        {/* Kalender subnavigatie */}
        {view === 'calendar' && (
          <div className="mb-4 flex gap-1 rounded-xl border border-foreground/10 bg-white p-1 shadow-sm w-fit">
            {(['day', 'week', 'month'] as CalMode[]).map(m => (
              <button key={m} onClick={() => setCalMode(m)}
                className={cn('rounded-lg px-3 py-1 text-sm font-medium transition-colors',
                  calMode === m ? 'bg-accent text-white' : 'text-foreground/50 hover:text-foreground hover:bg-secondary/20')}>
                {m === 'day' ? 'Dag' : m === 'week' ? 'Week' : 'Maand'}
              </button>
            ))}
          </div>
        )}

        {loading ? (
          <p className="text-foreground/40 py-8">Laden…</p>
        ) : view === 'cards' ? (
          <>
            <CardView />
            {totalFiltered > visibleCount && (
              <button onClick={() => setVisibleCount(v => v + 20)}
                className="mt-4 w-full rounded-xl border border-foreground/12 bg-white py-2.5 text-sm font-medium text-foreground/55 hover:bg-secondary/20 transition-colors shadow-sm">
                Meer laden ({totalFiltered - visibleCount} resterend)
              </button>
            )}
          </>
        ) : view === 'list' ? (
          <>
            <ListView />
            {totalFiltered > visibleCount && (
              <button onClick={() => setVisibleCount(v => v + 20)}
                className="mt-4 w-full rounded-xl border border-foreground/12 bg-white py-2.5 text-sm font-medium text-foreground/55 hover:bg-secondary/20 transition-colors shadow-sm">
                Meer laden ({totalFiltered - visibleCount} resterend)
              </button>
            )}
          </>
        ) : calMode === 'month' ? (
          <MonthView />
        ) : calMode === 'week' ? (
          <WeekView />
        ) : (
          <DayView />
        )}
      </main>
    </div>
  )
}
