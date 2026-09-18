'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { ChevronLeft, TrendingUp, Calendar, Sparkles, Award, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

type TreatmentRow = { name: string; count: number }
type DayRow       = { label: string; count: number }
type MonthRow     = { label: string; count: number }
type HolidayRow   = { date: string; label: string; type: string; tip: string }

interface InsightsData {
  stats: { total: number; confirmed: number; pending: number; rejected: number; conversionRate: number }
  treatmentRanking: TreatmentRow[]
  dayRanking: DayRow[]
  monthData: MonthRow[]
  upcomingHolidays: HolidayRow[]
  aiAdvice: string | null
}

const TYPE_COLOR: Record<string, string> = {
  feestdag:    'bg-amber-100 text-amber-700',
  commercieel: 'bg-green-100 text-green-700',
  vakantie:    'bg-blue-100 text-blue-700',
}
const TYPE_LABEL: Record<string, string> = {
  feestdag:    'Feestdag',
  commercieel: 'Kans',
  vakantie:    'Vakantie',
}

function formatDateNL(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', { weekday: 'short', day: 'numeric', month: 'long' })
}

function daysUntil(iso: string) {
  const diff = new Date(iso).getTime() - Date.now()
  return Math.ceil(diff / 86400_000)
}

function BarChart({ data, maxVal }: { data: { label: string; count: number }[]; maxVal: number }) {
  return (
    <div className="space-y-2">
      {data.map((row, i) => (
        <div key={i} className="flex items-center gap-3">
          <span className="w-14 shrink-0 text-right text-[11px] text-foreground/50 tabular-nums">{row.label}</span>
          <div className="flex-1 h-2 rounded-full bg-secondary/30 overflow-hidden">
            <div
              className="h-full rounded-full bg-accent transition-all duration-700"
              style={{ width: maxVal > 0 ? `${(row.count / maxVal) * 100}%` : '0%' }}
            />
          </div>
          <span className="w-6 text-[11px] text-foreground/50 tabular-nums">{row.count}</span>
        </div>
      ))}
    </div>
  )
}

export default function AdminInzichten() {
  const router = useRouter()
  const [data, setData] = useState<InsightsData | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/insights')
    if (res.status === 401) { router.push('/admin'); return }
    const json = await res.json()
    setData(json)
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-foreground/8 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Image src="/logo-green.svg" alt="Zen Spa" width={100} height={27} priority />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:px-8 space-y-8 pb-16">
        {/* Breadcrumb + titel */}
        <div className="space-y-2">
          <a href="/admin/boekingen"
            className="inline-flex items-center gap-1 text-base font-medium text-foreground/50 hover:text-foreground transition-colors">
            <ChevronLeft className="h-4 w-4" aria-hidden />
            Boekingen
          </a>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Inzichten</h1>
            <p className="mt-1 text-sm text-foreground/45">Overzicht, trends en aanbevelingen voor Zen Spa</p>
          </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 rounded-2xl border border-foreground/8 bg-white animate-pulse" />
            ))}
          </div>
        ) : !data ? (
          <p className="text-foreground/40">Kon gegevens niet laden.</p>
        ) : (
          <>
            {/* KPI stats */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                { label: 'Totaal',        value: data.stats.total,          sub: 'boekingen' },
                { label: 'Bevestigd',     value: data.stats.confirmed,      sub: 'afspraken' },
                { label: 'Wachtend',      value: data.stats.pending,        sub: 'aanvragen' },
                { label: 'Conversie',     value: `${data.stats.conversionRate}%`, sub: 'van aanvragen' },
              ].map(({ label, value, sub }) => (
                <div key={label} className="rounded-2xl border border-foreground/8 bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/40">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{value}</p>
                  <p className="text-[11px] text-foreground/40">{sub}</p>
                </div>
              ))}
            </div>

            {/* AI aanbevelingen */}
            {data.aiAdvice && (
              <div className="rounded-2xl border border-accent/20 bg-accent/5 px-5 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                  <h2 className="text-sm font-bold text-foreground">AI-aanbevelingen</h2>
                </div>
                <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">{data.aiAdvice}</p>
              </div>
            )}

            {/* Aankomende feestdagen */}
            {data.upcomingHolidays.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-foreground/50" aria-hidden />
                  <h2 className="text-base font-bold text-foreground">Aankomende feestdagen & kansen</h2>
                </div>
                <div className="space-y-2">
                  {data.upcomingHolidays.map((h, i) => {
                    const days = daysUntil(h.date)
                    return (
                      <div key={i} className="rounded-2xl border border-foreground/8 bg-white px-4 py-3 shadow-sm flex items-start gap-3">
                        <div className="shrink-0 text-center min-w-[44px]">
                          <p className="text-lg font-bold text-foreground/70 leading-none">{new Date(h.date).getDate()}</p>
                          <p className="text-[10px] text-foreground/40 uppercase tracking-wide">
                            {new Date(h.date).toLocaleDateString('nl-NL', { month: 'short' })}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <p className="text-sm font-semibold text-foreground">{h.label}</p>
                            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLOR[h.type] ?? 'bg-gray-100 text-gray-500'}`}>
                              {TYPE_LABEL[h.type] ?? h.type}
                            </span>
                            <span className="text-[10px] text-foreground/35">
                              {days === 0 ? 'Vandaag' : days === 1 ? 'Morgen' : `over ${days} dagen`}
                            </span>
                          </div>
                          <p className="mt-1 text-[12px] text-foreground/55 leading-snug">{h.tip}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Behandeling populariteit */}
            {data.treatmentRanking.length > 0 && (
              <div className="rounded-2xl border border-foreground/8 bg-white px-5 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <Award className="h-4 w-4 text-foreground/50" aria-hidden />
                  <h2 className="text-base font-bold text-foreground">Populairste behandelingen</h2>
                </div>
                <div className="space-y-3">
                  {data.treatmentRanking.slice(0, 8).map((t, i) => {
                    const max = data.treatmentRanking[0].count
                    return (
                      <div key={i} className="flex items-center gap-3">
                        <span className={cn('shrink-0 text-[10px] font-bold w-4',
                          i === 0 ? 'text-amber-500' : i === 1 ? 'text-foreground/50' : i === 2 ? 'text-amber-700/60' : 'text-foreground/25')}>
                          {i + 1}
                        </span>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2 mb-1">
                            <span className="text-sm font-medium text-foreground truncate">{t.name}</span>
                            <span className="text-[11px] text-foreground/50 shrink-0 tabular-nums">{t.count}×</span>
                          </div>
                          <div className="h-1.5 rounded-full bg-secondary/30 overflow-hidden">
                            <div className="h-full rounded-full bg-accent transition-all duration-700"
                              style={{ width: `${(t.count / max) * 100}%` }} />
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
                {data.treatmentRanking.length > 1 && (
                  <div className="mt-4 pt-4 border-t border-foreground/6">
                    <div className="flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-foreground/30" aria-hidden />
                      <p className="text-[12px] text-foreground/40">
                        Minst gevraagd: <span className="font-medium">{data.treatmentRanking[data.treatmentRanking.length - 1].name}</span>
                        {' '}({data.treatmentRanking[data.treatmentRanking.length - 1].count}×)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Drukte per dag */}
            {data.dayRanking.some(d => d.count > 0) && (
              <div className="rounded-2xl border border-foreground/8 bg-white px-5 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-foreground/50" aria-hidden />
                  <h2 className="text-base font-bold text-foreground">Drukte per dag van de week</h2>
                </div>
                <BarChart
                  data={data.dayRanking}
                  maxVal={Math.max(...data.dayRanking.map(d => d.count), 1)}
                />
              </div>
            )}

            {/* Drukte per maand */}
            {data.monthData.some(m => m.count > 0) && (
              <div className="rounded-2xl border border-foreground/8 bg-white px-5 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <TrendingUp className="h-4 w-4 text-foreground/50" aria-hidden />
                  <h2 className="text-base font-bold text-foreground">Drukte per maand</h2>
                </div>
                <BarChart
                  data={data.monthData}
                  maxVal={Math.max(...data.monthData.map(m => m.count), 1)}
                />
              </div>
            )}

            {data.stats.total === 0 && (
              <p className="text-center text-foreground/40 py-8">Nog geen bevestigde boekingen om te analyseren.</p>
            )}
          </>
        )}
      </main>
    </div>
  )
}
