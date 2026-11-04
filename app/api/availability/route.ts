import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getTreatmentBySlug, getTotalSlotMinutes } from '@/lib/behandelingen-data'

const TZ = 'Europe/Amsterdam'
const MIN_LEAD_MS = 2 * 60 * 60 * 1000
const MAX_DAYS_AHEAD = 60

type Window = { openH: number; openM: number; closeH: number; closeM: number }

// Ma: 09:30–14:30 en 17:30–22:00 | Di: 09:00–14:30 | Vr: 09:00–14:30
const SCHEDULE: Record<number, Window[]> = {
  1: [ // Maandag
    { openH: 9,  openM: 30, closeH: 14, closeM: 30 },
    { openH: 17, openM: 30, closeH: 22, closeM: 0  },
  ],
  2: [ // Dinsdag
    { openH: 9, openM: 0, closeH: 14, closeM: 30 },
  ],
  5: [ // Vrijdag
    { openH: 9, openM: 0, closeH: 14, closeM: 30 },
  ],
}

function amsterdamDow(dateStr: string): number {
  const date = new Date(`${dateStr}T12:00:00Z`)
  const label = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(label)
}

function toUTC(dateStr: string, hour: number, minute: number): Date {
  const probe = new Date(Date.UTC(
    +dateStr.slice(0, 4),
    +dateStr.slice(5, 7) - 1,
    +dateStr.slice(8, 10),
    hour, minute, 0,
  ))
  const fmt = new Intl.DateTimeFormat('en-US', {
    timeZone: TZ,
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  }).formatToParts(probe)
  const amsH = +(fmt.find(p => p.type === 'hour')?.value ?? hour)
  const amsM = +(fmt.find(p => p.type === 'minute')?.value ?? minute)
  const offsetMs = ((amsH - hour) * 60 + (amsM - minute)) * 60_000
  return new Date(probe.getTime() - offsetMs)
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const slug = sp.get('slug')
  const dateStr = sp.get('date')

  if (!slug || !dateStr || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return NextResponse.json({ error: 'slug en date (YYYY-MM-DD) zijn verplicht' }, { status: 400 })
  }

  const treatment = getTreatmentBySlug(slug)
  if (!treatment?.bookable) {
    return NextResponse.json({ error: 'Behandeling niet gevonden' }, { status: 404 })
  }

  const dow = amsterdamDow(dateStr)
  const windows = SCHEDULE[dow]
  if (!windows) return NextResponse.json({ slots: [] })

  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: TZ })
  const maxDate = new Date(Date.now() + MAX_DAYS_AHEAD * 86_400_000)
    .toLocaleDateString('en-CA', { timeZone: TZ })
  if (dateStr < todayStr || dateStr > maxDate) {
    return NextResponse.json({ slots: [] })
  }

  const totalMin = getTotalSlotMinutes(treatment)
  const supabase = createServiceClient()

  const dayStart = toUTC(dateStr, 0, 0).toISOString()
  const dayEnd = toUTC(dateStr, 23, 59).toISOString()

  type Slot = { start_time: string; end_time: string }

  const [{ data: bookings }, { data: blocked }] = await Promise.all([
    supabase
      .from('bookings')
      .select('start_time, end_time')
      .gte('start_time', dayStart)
      .lte('start_time', dayEnd)
      .in('status', ['pending', 'confirmed']),
    supabase
      .from('blocked_times')
      .select('start_time, end_time')
      .gte('start_time', dayStart)
      .lte('start_time', dayEnd),
  ])

  const occupied: Slot[] = [...(bookings ?? []), ...(blocked ?? [])] as Slot[]
  const now = Date.now()
  const slots: string[] = []

  for (const win of windows) {
    const openMin  = win.openH  * 60 + win.openM
    const closeMin = win.closeH * 60 + win.closeM
    const closeUTC = toUTC(dateStr, win.closeH, win.closeM)

    for (let m = openMin; m < closeMin; m += totalMin) {
      const slotStart = toUTC(dateStr, Math.floor(m / 60), m % 60)
      const slotEnd   = new Date(slotStart.getTime() + totalMin * 60_000)

      if (slotEnd > closeUTC) break
      if (slotStart.getTime() < now + MIN_LEAD_MS) continue

      const conflict = occupied.some(b => {
        const s = new Date(b.start_time).getTime()
        const e = new Date(b.end_time).getTime()
        return slotStart.getTime() < e && slotEnd.getTime() > s
      })

      if (!conflict) slots.push(slotStart.toISOString())
    }
  }

  return NextResponse.json({ slots })
}
