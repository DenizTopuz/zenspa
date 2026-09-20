import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-auth'

const FEESTDAGEN = [
  { date: '2025-12-25', label: 'Eerste Kerstdag',    type: 'feestdag',    tip: 'Verwacht piek in december voor cadeaubonnen en verwenbehandelingen.' },
  { date: '2025-12-26', label: 'Tweede Kerstdag',    type: 'feestdag',    tip: 'Plan agenda goed: hoge vraag maar personeel heeft ook vrij.' },
  { date: '2025-12-31', label: 'Oud & Nieuw',        type: 'commercieel', tip: 'Klanten willen er piekfijn uitzien voor de jaarwisseling. Drukke dag.' },
  { date: '2026-01-01', label: 'Nieuwjaarsdag',      type: 'feestdag',    tip: '"Nieuw jaar, nieuwe ik" — populair moment. Overweeg een januaripromotie.' },
  { date: '2026-02-14', label: 'Valentijnsdag',      type: 'commercieel', tip: 'Promoot cadeaubonnen en duo-behandelingen. Start campagne 2 weken eerder.' },
  { date: '2026-04-03', label: 'Goede Vrijdag',      type: 'feestdag',    tip: 'Vrije dag voor velen — meer boekingen rondom dit weekend.' },
  { date: '2026-04-05', label: 'Eerste Paasdag',     type: 'feestdag',    tip: 'Paasweekend is populair voor verwennerij.' },
  { date: '2026-04-06', label: 'Tweede Paasdag',     type: 'feestdag',    tip: 'Extra vrije dag — kans op meer boekingen.' },
  { date: '2026-04-27', label: 'Koningsdag',         type: 'feestdag',    tip: 'Mensen zijn vaak buitenshuis. Plan beschikbaarheid zorgvuldig.' },
  { date: '2026-05-10', label: 'Moederdag',          type: 'commercieel', tip: 'Dé dag voor cadeaubonnen. Start promotie minimaal 2 weken van tevoren.' },
  { date: '2026-05-14', label: 'Hemelvaartsdag',     type: 'feestdag',    tip: 'Lang weekend (do–zo) — extra boekingskansen.' },
  { date: '2026-05-24', label: 'Eerste Pinksterdag', type: 'feestdag',    tip: 'Pinksterweekend is een verlengd weekend met hogere vraag.' },
  { date: '2026-05-25', label: 'Tweede Pinksterdag', type: 'feestdag',    tip: 'Extra vrije dag naast Pinksterweekend.' },
  { date: '2026-06-21', label: 'Vaderdag',           type: 'commercieel', tip: 'Cadeaubonnen zijn populair voor vaders. Denk aan een speciale aanbieding.' },
  { date: '2026-12-25', label: 'Eerste Kerstdag',    type: 'feestdag',    tip: 'December is de drukste maand voor cadeaubonnen en last-minute boekingen.' },
  { date: '2026-12-26', label: 'Tweede Kerstdag',    type: 'feestdag',    tip: 'Plan de decemberagenda vroeg om verrassingen te voorkomen.' },
]

function getUpcoming(days = 120) {
  const now = new Date()
  const limit = new Date(now.getTime() + days * 86400_000)
  return FEESTDAGEN.filter(f => {
    const d = new Date(f.date)
    return d >= now && d <= limit
  }).sort((a, b) => a.date.localeCompare(b.date))
}

type Booking = { id: string; treatment_name: string; status: string; start_time: string; created_at: string }

function buildStats(bookings: Booking[]) {
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const pending   = bookings.filter(b => b.status === 'pending')
  const rejected  = bookings.filter(b => b.status === 'rejected')
  return {
    total: bookings.length,
    confirmed: confirmed.length,
    pending: pending.length,
    rejected: rejected.length,
    conversionRate: bookings.length > 0 ? Math.round((confirmed.length / bookings.length) * 100) : 0,
  }
}

function buildTreatmentRanking(bookings: Booking[]) {
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const map: Record<string, number> = {}
  confirmed.forEach(b => { map[b.treatment_name] = (map[b.treatment_name] ?? 0) + 1 })
  return Object.entries(map).sort(([, a], [, b]) => b - a).map(([name, count]) => ({ name, count }))
}

function buildDayRanking(bookings: Booking[]) {
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const dayMap = Array(7).fill(0)
  confirmed.forEach(b => { dayMap[(new Date(b.start_time).getDay() + 6) % 7]++ })
  const labels = ['Ma', 'Di', 'Wo', 'Do', 'Vr', 'Za', 'Zo']
  return labels.map((label, i) => ({ label, count: dayMap[i] }))
}

function buildMonthData(bookings: Booking[]) {
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const monthMap = Array(12).fill(0)
  confirmed.forEach(b => { monthMap[new Date(b.start_time).getMonth()]++ })
  const labels = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
  return labels.map((label, i) => ({ label, count: monthMap[i] }))
}

function buildDayOfMonthData(bookings: Booking[], month: number, year: number | null) {
  const confirmed = bookings.filter(b => b.status === 'confirmed')
  const y = year ?? new Date().getFullYear()
  const daysInMonth = new Date(y, month, 0).getDate()
  const dayMap = Array(daysInMonth).fill(0)
  confirmed.forEach(b => { dayMap[new Date(b.start_time).getDate() - 1]++ })
  return Array.from({ length: daysInMonth }, (_, i) => ({ label: String(i + 1), count: dayMap[i] }))
}

const MONTH_LABELS = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const yearParam         = req.nextUrl.searchParams.get('year')
  const monthParam        = req.nextUrl.searchParams.get('month')
  const compareYearParam  = req.nextUrl.searchParams.get('compareYear')
  const compareMonthParam = req.nextUrl.searchParams.get('compareMonth')

  const selectedYear  = yearParam         ? parseInt(yearParam,         10) : null
  const selectedMonth = monthParam        ? parseInt(monthParam,        10) : null
  const compareYear   = compareYearParam  ? parseInt(compareYearParam,  10) : null
  const compareMonth  = compareMonthParam ? parseInt(compareMonthParam, 10) : null

  const supabase = createServiceClient()
  const { data: rawBookings, error } = await supabase
    .from('bookings')
    .select('id, treatment_name, status, start_time, created_at')
    .order('start_time', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const all: Booking[] = rawBookings ?? []

  const availableYears  = Array.from(new Set(all.map(b => new Date(b.start_time).getFullYear()))).sort()
  const availableMonths = Array.from(new Set(all.map(b => new Date(b.start_time).getMonth() + 1))).sort((a, b) => a - b)

  // Filter primary
  let primary = selectedYear  ? all.filter(b => new Date(b.start_time).getFullYear() === selectedYear) : all
  if (selectedMonth) primary  = primary.filter(b => new Date(b.start_time).getMonth() + 1 === selectedMonth)

  // Filter compare (compareYear defaults to same year as primary when only month differs)
  const effectiveCompareYear = compareYear ?? selectedYear
  let compare: Booking[] | null = null
  if (compareMonth !== null || compareYear !== null) {
    compare = effectiveCompareYear ? all.filter(b => new Date(b.start_time).getFullYear() === effectiveCompareYear) : [...all]
    if (compareMonth) compare = compare.filter(b => new Date(b.start_time).getMonth() + 1 === compareMonth)
  }

  const stats            = buildStats(primary)
  const treatmentRanking = buildTreatmentRanking(primary)
  const dayRanking       = buildDayRanking(primary)
  const monthData        = selectedMonth ? null : buildMonthData(primary)
  const dayOfMonthData   = selectedMonth ? buildDayOfMonthData(primary, selectedMonth, selectedYear) : null

  const compareStats            = compare ? buildStats(compare)            : null
  const compareTreatmentRanking = compare ? buildTreatmentRanking(compare) : null
  const compareDayRanking       = compare ? buildDayRanking(compare)       : null
  const compareMonthData        = (compare && !selectedMonth && !compareMonth) ? buildMonthData(compare)  : null
  const compareDayOfMonthData   = (compare && compareMonth)
    ? buildDayOfMonthData(compare, compareMonth, effectiveCompareYear)
    : (compare && selectedMonth)
    ? buildDayOfMonthData(compare, selectedMonth, effectiveCompareYear)
    : null

  const upcomingHolidays = getUpcoming(120)

  const priLabel = [
    selectedYear  ? String(selectedYear)                      : null,
    selectedMonth ? MONTH_LABELS[selectedMonth - 1]           : null,
  ].filter(Boolean).join(' ') || 'Alles'

  const cmpLabel = [
    (compareYear ?? (compareMonth ? selectedYear : null)) ? String(compareYear ?? selectedYear) : null,
    compareMonth ? MONTH_LABELS[compareMonth - 1] : null,
  ].filter(Boolean).join(' ') || null

  // AI advice — based on primary selection only
  let aiAdvice: string | null = null
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const statsText = [
        `Periode: ${priLabel}`,
        `Totaal boekingen: ${stats.total} (${stats.confirmed} bevestigd, ${stats.pending} wachtend, ${stats.rejected} afgewezen)`,
        `Conversieratio: ${stats.conversionRate}%`,
        `Populairste behandelingen: ${treatmentRanking.slice(0, 5).map(t => `${t.name} (${t.count}x)`).join(', ') || 'nog geen data'}`,
        `Aankomende feestdagen: ${upcomingHolidays.map(h => `${h.label} op ${h.date}`).join(', ') || 'geen'}`,
      ].join('\n')

      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Je bent een zakelijk adviseur voor Zen Spa, een beautysalon in Almere.

Statistieken:
${statsText}

Geef 3 concrete, praktische aanbevelingen in het Nederlands. Elke aanbeveling max 2 zinnen. Nummereer ze 1, 2, 3.`,
        }],
      })
      aiAdvice = (msg.content[0] as { type: string; text: string }).text ?? null
    } catch {
      aiAdvice = null
    }
  }

  return NextResponse.json({
    availableYears,
    availableMonths,
    selectedYear,
    selectedMonth,
    compareYear,
    compareMonth,
    priLabel,
    cmpLabel,
    stats,
    treatmentRanking,
    dayRanking,
    monthData,
    dayOfMonthData,
    compareStats,
    compareTreatmentRanking,
    compareDayRanking,
    compareMonthData,
    compareDayOfMonthData,
    upcomingHolidays,
    aiAdvice,
  })
}
