import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getTreatmentBySlug, getTotalSlotMinutes } from '@/lib/behandelingen-data'

const TZ = 'Europe/Amsterdam'
const BUSINESS_DAYS = new Set([1, 3, 5]) // Mon=1, Wed=3, Fri=5
const OPEN_HOUR = 10
const CLOSE_HOUR = 18
const SLOT_INTERVAL = 15 // minutes
const MIN_LEAD_MS = 2 * 60 * 60 * 1000 // 2 hours
const MAX_DAYS_AHEAD = 60

/** Returns the Amsterdam day-of-week (0=Sun … 6=Sat) for a YYYY-MM-DD string */
function amsterdamDow(dateStr: string): number {
  const date = new Date(`${dateStr}T12:00:00Z`)
  const label = new Intl.DateTimeFormat('en-US', { timeZone: TZ, weekday: 'short' }).format(date)
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].indexOf(label)
}

/**
 * Converts a clock time (hour, minute) on a given date (YYYY-MM-DD) in Amsterdam
 * to its UTC Date equivalent.
 */
function toUTC(dateStr: string, hour: number, minute: number): Date {
  // Treat the desired time as UTC to measure the Amsterdam offset at that moment
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
  const amsH = +( fmt.find(p => p.type === 'hour')?.value ?? hour)
  const amsM = +( fmt.find(p => p.type === 'minute')?.value ?? minute)
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

  // Business day check
  if (!BUSINESS_DAYS.has(amsterdamDow(dateStr))) {
    return NextResponse.json({ slots: [] })
  }

  // Date range check
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
  const closeUTC = toUTC(dateStr, CLOSE_HOUR, 0)
  const now = Date.now()
  const slots: string[] = []

  for (let m = OPEN_HOUR * 60; m < CLOSE_HOUR * 60; m += SLOT_INTERVAL) {
    const slotStart = toUTC(dateStr, Math.floor(m / 60), m % 60)
    const slotEnd = new Date(slotStart.getTime() + totalMin * 60_000)

    if (slotEnd > closeUTC) break
    if (slotStart.getTime() < now + MIN_LEAD_MS) continue

    const conflict = occupied.some(b => {
      const s = new Date(b.start_time).getTime()
      const e = new Date(b.end_time).getTime()
      return slotStart.getTime() < e && slotEnd.getTime() > s
    })

    if (!conflict) slots.push(slotStart.toISOString())
  }

  return NextResponse.json({ slots })
}
