import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-auth'

// Dutch public holidays + commercial dates 2025–2026
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

function getUpcoming(days = 60) {
  const now = new Date()
  const limit = new Date(now.getTime() + days * 86400_000)
  return FEESTDAGEN.filter(f => {
    const d = new Date(f.date)
    return d >= now && d <= limit
  }).sort((a, b) => a.date.localeCompare(b.date))
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const supabase = createServiceClient()
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, treatment_name, status, start_time, created_at')
    .order('start_time', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  const all = bookings ?? []
  const confirmed = all.filter(b => b.status === 'confirmed')
  const pending   = all.filter(b => b.status === 'pending')
  const rejected  = all.filter(b => b.status === 'rejected')

  // Behandeling populariteit
  const treatmentMap: Record<string, number> = {}
  confirmed.forEach(b => {
    treatmentMap[b.treatment_name] = (treatmentMap[b.treatment_name] ?? 0) + 1
  })
  const treatmentRanking = Object.entries(treatmentMap)
    .sort(([, a], [, b]) => b - a)
    .map(([name, count]) => ({ name, count }))

  // Dag van de week populariteit (0=ma, 6=zo)
  const dayMap: number[] = Array(7).fill(0)
  confirmed.forEach(b => {
    const d = new Date(b.start_time)
    const dow = (d.getDay() + 6) % 7
    dayMap[dow]++
  })
  const dayLabels = ['Maandag', 'Dinsdag', 'Woensdag', 'Donderdag', 'Vrijdag', 'Zaterdag', 'Zondag']
  const dayRanking = dayLabels.map((label, i) => ({ label, count: dayMap[i] })).sort((a, b) => b.count - a.count)

  // Maand populariteit
  const monthMap: number[] = Array(12).fill(0)
  confirmed.forEach(b => { monthMap[new Date(b.start_time).getMonth()]++ })
  const monthLabels = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']
  const monthData = monthLabels.map((label, i) => ({ label, count: monthMap[i] }))

  // Conversieratio
  const conversionRate = all.length > 0
    ? Math.round((confirmed.length / all.length) * 100)
    : 0

  // Aankomende feestdagen (120 dagen vooruit)
  const upcomingHolidays = getUpcoming(120)

  // AI-aanbevelingen
  let aiAdvice: string | null = null
  if (process.env.ANTHROPIC_API_KEY) {
    try {
      const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })
      const statsText = [
        `Totaal boekingen: ${all.length} (${confirmed.length} bevestigd, ${pending.length} wachtend, ${rejected.length} afgewezen)`,
        `Conversieratio: ${conversionRate}%`,
        `Populairste behandelingen: ${treatmentRanking.slice(0, 5).map(t => `${t.name} (${t.count}x)`).join(', ') || 'nog geen data'}`,
        `Populairste dag: ${dayRanking[0]?.label ?? 'onbekend'} (${dayRanking[0]?.count ?? 0} boekingen)`,
        `Aankomende feestdagen: ${upcomingHolidays.map(h => `${h.label} op ${h.date}`).join(', ') || 'geen'}`,
      ].join('\n')

      const msg = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 400,
        messages: [{
          role: 'user',
          content: `Je bent een zakelijk adviseur voor Zen Spa, een beautysalon in Almere (schoonheidsbehandelingen, nagels, massage).

Hier zijn de actuele boekingsstatistieken:
${statsText}

Geef 3 concrete, praktische aanbevelingen in het Nederlands. Elke aanbeveling max 2 zinnen. Nummereer ze 1, 2, 3. Wees specifiek en direct bruikbaar voor de eigenaar.`,
        }],
      })
      aiAdvice = (msg.content[0] as { type: string; text: string }).text ?? null
    } catch {
      aiAdvice = null
    }
  }

  return NextResponse.json({
    stats: { total: all.length, confirmed: confirmed.length, pending: pending.length, rejected: rejected.length, conversionRate },
    treatmentRanking,
    dayRanking,
    monthData,
    upcomingHolidays,
    aiAdvice,
  })
}
