import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getTreatmentBySlug, getTotalSlotMinutes } from '@/lib/behandelingen-data'

const TZ = 'Europe/Amsterdam'
const BUSINESS_DAYS = new Set([1, 3, 5]) // Mon Wed Fri
const OPEN_HOUR = 10
const CLOSE_HOUR = 18
const MIN_LEAD_MS = 2 * 60 * 60 * 1000
const MAX_DAYS_AHEAD = 60

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
    timeZone: TZ, hour: 'numeric', minute: 'numeric', hour12: false,
  }).formatToParts(probe)
  const amsH = +(fmt.find(p => p.type === 'hour')?.value ?? hour)
  const amsM = +(fmt.find(p => p.type === 'minute')?.value ?? minute)
  return new Date(probe.getTime() - ((amsH - hour) * 60 + (amsM - minute)) * 60_000)
}

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const slug = sp.get('slug')
  const month = sp.get('month') // YYYY-MM

  if (!slug || !month || !/^\d{4}-\d{2}$/.test(month)) {
    return NextResponse.json({ error: 'slug en month (YYYY-MM) zijn verplicht' }, { status: 400 })
  }

  const treatment = getTreatmentBySlug(slug)
  if (!treatment?.bookable) {
    return NextResponse.json({ error: 'Behandeling niet gevonden' }, { status: 404 })
  }

  const totalMin = getTotalSlotMinutes(treatment)
  const maxSlotsPerDay = Math.floor((CLOSE_HOUR - OPEN_HOUR) * 60 / totalMin)
  const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: TZ })
  const maxDateStr = new Date(Date.now() + MAX_DAYS_AHEAD * 86_400_000)
    .toLocaleDateString('en-CA', { timeZone: TZ })
  const now = Date.now()

  const [year, mon] = month.split('-').map(Number)
  const daysInMonth = new Date(year, mon, 0).getDate()
  const pad = (n: number) => String(n).padStart(2, '0')

  const businessDays: string[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${pad(mon)}-${pad(d)}`
    if (dateStr < todayStr || dateStr > maxDateStr) continue
    if (!BUSINESS_DAYS.has(amsterdamDow(dateStr))) continue
    businessDays.push(dateStr)
  }

  if (businessDays.length === 0) {
    return NextResponse.json({ availability: {} })
  }

  const monthStart = toUTC(`${year}-${pad(mon)}-01`, 0, 0).toISOString()
  const monthEnd = toUTC(`${year}-${pad(mon)}-${pad(daysInMonth)}`, 23, 59).toISOString()

  const supabase = createServiceClient()
  type Slot = { start_time: string; end_time: string }

  const [{ data: bookings }, { data: blocked }] = await Promise.all([
    supabase.from('bookings').select('start_time, end_time')
      .gte('start_time', monthStart).lte('start_time', monthEnd)
      .in('status', ['pending', 'confirmed']),
    supabase.from('blocked_times').select('start_time, end_time')
      .gte('start_time', monthStart).lte('start_time', monthEnd),
  ])
  const occupied: Slot[] = [...(bookings ?? []), ...(blocked ?? [])] as Slot[]

  const availability: Record<string, string> = {}

  for (const dateStr of businessDays) {
    const closeUTC = toUTC(dateStr, CLOSE_HOUR, 0)
    let count = 0

    for (let m = OPEN_HOUR * 60; m < CLOSE_HOUR * 60; m += totalMin) {
      const slotStart = toUTC(dateStr, Math.floor(m / 60), m % 60)
      const slotEnd = new Date(slotStart.getTime() + totalMin * 60_000)
      if (slotEnd > closeUTC) break
      if (slotStart.getTime() < now + MIN_LEAD_MS) continue
      const conflict = occupied.some(b => {
        const s = new Date(b.start_time).getTime()
        const e = new Date(b.end_time).getTime()
        return slotStart.getTime() < e && slotEnd.getTime() > s
      })
      if (!conflict) count++
    }

    if (count === 0) continue
    const greenThreshold = Math.max(1, Math.ceil(maxSlotsPerDay * 0.6))
    const orangeThreshold = Math.max(1, Math.ceil(maxSlotsPerDay * 0.25))
    availability[dateStr] = count >= greenThreshold ? 'green'
      : count >= orangeThreshold ? 'orange'
      : 'red'
  }

  return NextResponse.json({ availability })
}
