'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { BookingRow } from '@/lib/supabase/types'

const GEZICHT_SLUGS = new Set([
  'mini-zen-moment','basis-gezichtsbehandeling','classic-gezichtsbehandeling',
  'deluxe-gezichtsbehandeling','herenbehandeling','65-plus-behandeling',
  'tienerbehandeling','microneedling','galvanic-spa',
])
const LICHAAM_SLUGS  = new Set(['rugbehandeling','pedicure'])
const PMU_SLUGS      = new Set([
  'hairstroke-microblading','powder-ombre-brows','combi-brows','ontbrekende-stukjes',
  'infralash-deepliner','deepliner-boven-en-onder','lipliner','full-lips',
])
const ONTHAREN_SLUGS = new Set([
  'ontharen-1-zone','bovenlip-kin','bovenlip-kin-kaaklijn','extra-zone',
])

function treatmentColor(slug: string) {
  if (GEZICHT_SLUGS.has(slug))  return { bg: '#fce7ef', border: '#f48fb1', text: '#880e4f' }
  if (LICHAAM_SLUGS.has(slug))  return { bg: '#e3f2fd', border: '#90caf9', text: '#0d47a1' }
  if (PMU_SLUGS.has(slug))      return { bg: '#ede7f6', border: '#b39ddb', text: '#311b92' }
  if (ONTHAREN_SLUGS.has(slug)) return { bg: '#fff8e1', border: '#ffe082', text: '#e65100' }
  return { bg: '#f3f4f6', border: '#d1d5db', text: '#374151' }
}

const HOUR_PX  = 88
const TL_START = 8
const TL_END   = 22

function amsMinutes(iso: string) {
  const d = new Date(iso)
  const parts = new Intl.DateTimeFormat('nl-NL', {
    hour: 'numeric', minute: 'numeric', hour12: false,
    timeZone: 'Europe/Amsterdam',
  }).formatToParts(d)
  const h = Number(parts.find(p => p.type === 'hour')?.value ?? 0)
  const m = Number(parts.find(p => p.type === 'minute')?.value ?? 0)
  return h * 60 + m
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

const DAY_LABELS  = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
const MONTH_NL    = ['januari','februari','maart','april','mei','juni','juli','augustus','september','oktober','november','december']

function TimelineLegend() {
  const items = [
    { label: 'Gezicht',            color: treatmentColor('basis-gezichtsbehandeling') },
    { label: 'Lichaam',            color: treatmentColor('pedicure') },
    { label: 'Permanente make-up', color: treatmentColor('combi-brows') },
    { label: 'Ontharen',           color: treatmentColor('ontharen-1-zone') },
  ]
  return (
    <div className="flex flex-wrap gap-3 mb-3">
      {items.map(({ label, color }) => (
        <span key={label} className="flex items-center gap-1.5 text-[11px] text-foreground/55">
          <span className="inline-block h-2.5 w-2.5 rounded-sm" style={{ backgroundColor: color.border }} />
          {label}
        </span>
      ))}
    </div>
  )
}

function TimelineGrid({ dayBookings }: { dayBookings: BookingRow[] }) {
  const hours  = Array.from({ length: TL_END - TL_START }, (_, i) => TL_START + i)
  const totalH = (TL_END - TL_START) * HOUR_PX

  return (
    <div className="rounded-2xl border border-foreground/8 bg-white shadow-sm overflow-y-auto"
      style={{ maxHeight: '65vh' }}>
      <div className="relative" style={{ height: totalH, minHeight: totalH }}>
        {hours.map(h => (
          <div key={h} className="absolute left-0 right-0 flex items-start"
            style={{ top: (h - TL_START) * HOUR_PX }}>
            <span className="w-14 shrink-0 pl-3 text-[11px] font-medium text-foreground/40 tabular-nums leading-none -mt-[7px]">
              {String(h).padStart(2,'0')}:00
            </span>
            <div className="flex-1 border-t border-foreground/8" />
          </div>
        ))}
        <div className="absolute left-16 right-2 top-0 bottom-0">
          {dayBookings.map(b => {
            const startMin = amsMinutes(b.start_time)
            const endMin   = amsMinutes(b.end_time)
            const top      = Math.max(0, (startMin - TL_START * 60) / 60 * HOUR_PX)
            const height   = Math.max(28, (endMin - startMin) / 60 * HOUR_PX - 3)
            const col      = treatmentColor(b.treatment_slug)
            const compact  = height < 52
            return (
              <div key={b.id}
                style={{
                  position: 'absolute',
                  top, left: 0, right: 0, height,
                  backgroundColor: col.bg,
                  borderLeft: `3px solid ${col.border}`,
                  borderRadius: 8,
                  padding: compact ? '4px 8px' : '7px 10px',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}>
                <p style={{ color: col.text, fontSize: 12, fontWeight: 700, lineHeight: '1.2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {b.customer_name}
                </p>
                {!compact && (
                  <p style={{ color: col.text, fontSize: 11, lineHeight: '1.25', opacity: 0.75, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {b.treatment_name}
                  </p>
                )}
                {!compact && (
                  <p style={{ color: col.text, fontSize: 11, opacity: 0.6, marginTop: 2, fontVariantNumeric: 'tabular-nums' }}>
                    {formatTime(b.start_time)}–{formatTime(b.end_time)}
                  </p>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default function AdminAgenda() {
  const router  = useRouter()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading]  = useState(true)
  const [mode, setMode]        = useState<'day' | 'week'>('week')
  const [date, setDate]        = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(new Date())

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/bookings')
    if (res.status === 401) { router.push('/admin'); return }
    const { bookings } = await res.json()
    setBookings((bookings ?? []).filter((b: BookingRow) => b.status === 'confirmed' || b.status === 'pending'))
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  function bookingsOnDay(d: Date) {
    return bookings.filter(b => isSameDay(b.start_time, d))
      .sort((a, b) => new Date(a.start_time).getTime() - new Date(b.start_time).getTime())
  }

  const today    = new Date()
  const weekStart = startOfWeek(date)
  const weekDays  = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart)
    d.setDate(d.getDate() + i)
    return d
  })

  const activeDay      = mode === 'day' ? date : selectedDay
  const activeDayBooks = bookingsOnDay(activeDay)

  return (
    <>
      <header className="shrink-0 sticky top-0 z-10 border-b border-foreground/8 bg-white px-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between py-4">
          <Image src="/logo-green.svg" alt="Zen Spa" width={100} height={27} priority />
          <button onClick={logout} className="text-sm text-foreground/40 hover:text-foreground transition-colors">
            Uitloggen
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto min-h-0 lg:flex-none lg:overflow-visible mx-auto w-full max-w-4xl px-4 py-6 md:px-8 lg:px-0 space-y-4">
        {/* Titel + dag/week toggle */}
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-foreground">Agenda</h1>
          <div className="flex items-center gap-0.5 rounded-xl border border-foreground/10 bg-secondary/10 p-1 shrink-0">
            {(['day', 'week'] as const).map(m => (
              <button key={m} onClick={() => setMode(m)}
                className={cn('rounded-lg px-3 py-1.5 text-xs font-medium transition-colors',
                  mode === m ? 'bg-white text-foreground shadow-sm' : 'text-foreground/45 hover:text-foreground')}>
                {m === 'day' ? 'Dag' : 'Week'}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => <div key={i} className="h-28 rounded-2xl border border-foreground/8 bg-white animate-pulse" />)}
          </div>
        ) : mode === 'day' ? (
          /* Day view */
          <>
            <div className="flex items-center justify-between">
              <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() - 1); setDate(d) }}
                className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
                <ChevronLeft className="h-4 w-4 text-foreground/60" />
              </button>
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground capitalize">
                  {date.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
                </p>
                {date.toDateString() === today.toDateString() && (
                  <p className="text-[10px] text-accent font-medium">Vandaag</p>
                )}
              </div>
              <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() + 1); setDate(d) }}
                className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
                <ChevronRight className="h-4 w-4 text-foreground/60" />
              </button>
            </div>
            {activeDayBooks.length === 0
              ? <p className="text-sm text-foreground/40 py-8 text-center">Geen afspraken op deze dag.</p>
              : <><TimelineLegend /><TimelineGrid dayBookings={activeDayBooks} /></>}
          </>
        ) : (
          /* Week view */
          <>
            <div className="flex items-center justify-between">
              <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() - 7); setDate(d) }}
                className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
                <ChevronLeft className="h-4 w-4 text-foreground/60" />
              </button>
              <span className="text-sm font-semibold text-foreground">
                {weekDays[0].getDate()} – {weekDays[6].getDate()} {MONTH_NL[weekDays[6].getMonth()]}
              </span>
              <button onClick={() => { const d = new Date(date); d.setDate(d.getDate() + 7); setDate(d) }}
                className="rounded-full p-1.5 hover:bg-secondary/30 transition-colors">
                <ChevronRight className="h-4 w-4 text-foreground/60" />
              </button>
            </div>

            {/* Dag-strip */}
            <div className="rounded-2xl border border-foreground/8 bg-white shadow-sm overflow-hidden">
              <div className="grid grid-cols-7 divide-x divide-foreground/6">
                {weekDays.map((d, i) => {
                  const isToday    = d.toDateString() === today.toDateString()
                  const isSelected = d.toDateString() === selectedDay.toDateString()
                  const dayB       = bookingsOnDay(d)
                  return (
                    <button key={i} onClick={() => setSelectedDay(d)}
                      className={cn('py-3 flex flex-col items-center gap-1 transition-colors',
                        isSelected ? 'bg-secondary/20' : 'hover:bg-secondary/10')}>
                      <span className="text-[10px] font-medium text-foreground/40">{DAY_LABELS[i]}</span>
                      <span className={cn('inline-flex h-6 w-6 items-center justify-center rounded-full text-[12px] font-semibold',
                        isToday ? 'bg-accent text-white' : isSelected ? 'text-accent' : 'text-foreground/70')}>
                        {d.getDate()}
                      </span>
                      {dayB.length > 0 && (
                        <span className="inline-flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-accent/15 text-[9px] font-bold text-accent tabular-nums">
                          {dayB.length}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Tijdlijn voor geselecteerde dag */}
            <p className="text-xs font-semibold text-foreground/40 uppercase tracking-wider">
              {selectedDay.toLocaleDateString('nl-NL', { weekday: 'long', day: 'numeric', month: 'long' })}
            </p>
            {activeDayBooks.length === 0
              ? <p className="text-sm text-foreground/40 py-4">Geen afspraken op deze dag.</p>
              : <><TimelineLegend /><TimelineGrid dayBookings={activeDayBooks} /></>}
          </>
        )}
      </main>
    </>
  )
}
