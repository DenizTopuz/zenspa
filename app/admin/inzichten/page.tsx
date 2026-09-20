'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import {
  TrendingUp, Calendar, Sparkles, Award, AlertCircle,
  BarChart, Table2, ChevronUp, ChevronDown, Minus, X, Plus,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const MONTH_NL = ['jan', 'feb', 'mrt', 'apr', 'mei', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'dec']

type DataRow    = { label: string; count: number }
type HolidayRow = { date: string; label: string; type: string; tip: string }

interface InsightsData {
  availableYears: number[]
  availableMonths: number[]
  selectedYear: number | null
  selectedMonth: number | null
  compareYear: number | null
  compareMonth: number | null
  priLabel: string
  cmpLabel: string | null
  stats:        { total: number; confirmed: number; pending: number; rejected: number; conversionRate: number }
  compareStats: { total: number; confirmed: number; pending: number; rejected: number; conversionRate: number } | null
  treatmentRanking:        { name: string; count: number }[]
  compareTreatmentRanking: { name: string; count: number }[] | null
  dayRanking:       DataRow[]
  compareDayRanking: DataRow[] | null
  monthData:            DataRow[] | null
  dayOfMonthData:       DataRow[] | null
  compareMonthData:      DataRow[] | null
  compareDayOfMonthData: DataRow[] | null
  upcomingHolidays: HolidayRow[]
  aiAdvice: string | null
}

const TYPE_COLOR: Record<string, string> = {
  feestdag:    'bg-amber-100 text-amber-700',
  commercieel: 'bg-green-100 text-green-700',
  vakantie:    'bg-blue-100 text-blue-700',
}
const TYPE_LABEL: Record<string, string> = {
  feestdag: 'Feestdag', commercieel: 'Kans', vakantie: 'Vakantie',
}

function daysUntil(iso: string) {
  return Math.ceil((new Date(iso).getTime() - Date.now()) / 86400_000)
}

function humanDuration(days: number): string {
  if (days === 0) return 'Vandaag'
  if (days === 1) return 'Morgen'
  if (days < 7)  return `over ${days} dagen`
  if (days < 30) return `over ${Math.floor(days / 7)} ${Math.floor(days / 7) === 1 ? 'week' : 'weken'}`
  const months = Math.floor(days / 30)
  return `over ${months} ${months === 1 ? 'maand' : 'maanden'}`
}

function Delta({ a, b, unit = '' }: { a: number; b: number; unit?: string }) {
  const diff = a - b
  if (diff === 0) return <span className="text-foreground/35 text-[11px] flex items-center gap-0.5"><Minus className="h-3 w-3" />0{unit}</span>
  const pos = diff > 0
  return (
    <span className={cn('text-[11px] flex items-center gap-0.5 font-semibold', pos ? 'text-green-600' : 'text-red-500')}>
      {pos ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
      {pos ? '+' : ''}{diff}{unit}
    </span>
  )
}

function HBarRows({ rows, compareRows, priLabel, cmpLabel }: {
  rows: DataRow[]; compareRows: DataRow[] | null
  priLabel: string; cmpLabel: string
}) {
  const max = Math.max(...rows.map(r => r.count), ...(compareRows ?? []).map(r => r.count), 1)
  return (
    <div className="space-y-2">
      {rows.map((row, i) => {
        const cmp = compareRows?.[i]
        return (
          <div key={i} className="flex items-center gap-2">
            <span className="w-7 shrink-0 text-right text-[11px] text-foreground/45 tabular-nums">{row.label}</span>
            <div className="flex-1 space-y-0.5">
              <div className="h-2 rounded-full bg-secondary/40 overflow-hidden">
                <div className="h-full rounded-full bg-accent transition-all duration-700"
                  style={{ width: `${(row.count / max) * 100}%` }} />
              </div>
              {cmp !== undefined && (
                <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
                  <div className="h-full rounded-full bg-accent/30 transition-all duration-700"
                    style={{ width: `${(cmp.count / max) * 100}%` }} />
                </div>
              )}
            </div>
            <span className="w-12 text-right text-[11px] text-foreground/45 tabular-nums">
              {row.count}{cmp !== undefined ? <span className="text-foreground/25">/{cmp.count}</span> : ''}
            </span>
          </div>
        )
      })}
      {compareRows && (
        <div className="flex gap-3 mt-3 text-[10px] text-foreground/45">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-3 rounded-sm bg-accent" />{priLabel}</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-3 rounded-sm bg-accent/30" />{cmpLabel}</span>
        </div>
      )}
    </div>
  )
}

function ColumnChart({ rows, compareRows, priLabel, cmpLabel }: {
  rows: DataRow[]; compareRows: DataRow[] | null
  priLabel: string; cmpLabel: string
}) {
  const max = Math.max(...rows.map(r => r.count), ...(compareRows ?? []).map(r => r.count), 1)
  return (
    <div>
      {compareRows && (
        <div className="flex gap-3 mb-3 text-[11px] text-foreground/45">
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-3 rounded-sm bg-accent" />{priLabel}</span>
          <span className="flex items-center gap-1.5"><span className="inline-block h-2 w-3 rounded-sm bg-accent/30" />{cmpLabel}</span>
        </div>
      )}
      <div className="flex items-end gap-1 h-28">
        {rows.map((row, i) => {
          const cmp = compareRows?.[i]
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
              <div className="w-full flex items-end gap-0.5 h-24">
                <div className="flex-1 flex items-end">
                  <div className="w-full rounded-t bg-accent transition-all duration-700 relative"
                    style={{ height: `${(row.count / max) * 100}%`, minHeight: row.count > 0 ? '2px' : '0' }}>
                    {row.count > 0 && !cmp && (
                      <span className="absolute -top-4 left-0 right-0 text-center text-[9px] font-semibold text-foreground/55 leading-none tabular-nums">
                        {row.count}
                      </span>
                    )}
                  </div>
                </div>
                {cmp !== undefined && (
                  <div className="flex-1 flex items-end">
                    <div className="w-full rounded-t bg-accent/30 transition-all duration-700"
                      style={{ height: `${(cmp.count / max) * 100}%`, minHeight: cmp.count > 0 ? '2px' : '0' }} />
                  </div>
                )}
              </div>
              <span className="text-[9px] text-foreground/35 leading-none">{row.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}

function DataTable({ rows, compareRows, priLabel, cmpLabel }: {
  rows: DataRow[]; compareRows: DataRow[] | null
  priLabel: string; cmpLabel: string
}) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-foreground/8">
            <th className="py-2 text-left text-[11px] font-medium text-foreground/40 uppercase tracking-wide">Label</th>
            <th className="py-2 text-right text-[11px] font-medium text-accent uppercase tracking-wide">{priLabel}</th>
            {compareRows && <>
              <th className="py-2 text-right text-[11px] font-medium text-foreground/40 uppercase tracking-wide">{cmpLabel}</th>
              <th className="py-2 text-right text-[11px] font-medium text-foreground/40 uppercase tracking-wide">Δ</th>
            </>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => {
            const cmp = compareRows?.[i]
            return (
              <tr key={i} className="border-b border-foreground/5 hover:bg-secondary/10 transition-colors">
                <td className="py-2 text-foreground/75">{row.label}</td>
                <td className="py-2 text-right font-medium tabular-nums">{row.count}</td>
                {compareRows && <>
                  <td className="py-2 text-right tabular-nums text-foreground/45">{cmp?.count ?? 0}</td>
                  <td className="py-2 text-right"><Delta a={row.count} b={cmp?.count ?? 0} /></td>
                </>}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

// Kleine pill die de actieve periode aangeeft
function PeriodPill({ label, onClear }: { label: string; onClear?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-accent/10 px-2.5 py-1 text-[11px] font-semibold text-accent">
      {label}
      {onClear && (
        <button onClick={onClear} className="rounded-full hover:bg-accent/20 transition-colors p-0.5 -mr-0.5" aria-label="Wis selectie">
          <X className="h-3 w-3" />
        </button>
      )}
    </span>
  )
}

export default function AdminInzichten() {
  const router = useRouter()
  const [data, setData]           = useState<InsightsData | null>(null)
  const [loading, setLoading]     = useState(true)
  const [selectedYear, setSelectedYear]   = useState<number | null>(null)
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null)
  const [compareMonth, setCompareMonth]   = useState<number | null>(null)
  const [compareYear, setCompareYear]     = useState<number | null>(null)
  const [comparing, setComparing]         = useState(false)
  const [chartMode, setChartMode]         = useState<'chart' | 'table'>('chart')

  const load = useCallback(async () => {
    setLoading(true)
    const p = new URLSearchParams()
    if (selectedYear)  p.set('year',         String(selectedYear))
    if (selectedMonth) p.set('month',        String(selectedMonth))
    if (comparing) {
      if (compareYear)  p.set('compareYear',  String(compareYear))
      if (compareMonth) p.set('compareMonth', String(compareMonth))
    }
    const res = await fetch(`/api/admin/insights?${p}`)
    if (res.status === 401) { router.push('/admin'); return }
    setData(await res.json())
    setLoading(false)
  }, [router, selectedYear, selectedMonth, compareYear, compareMonth, comparing])

  useEffect(() => { load() }, [load])

  const priLabel  = data?.priLabel  ?? 'Alles'
  const cmpLabel  = data?.cmpLabel  ?? ''
  const hasCompare = comparing && !!(compareMonth || compareYear)
  const cmpMonthOptions = (data?.availableMonths ?? []).filter(m => m !== selectedMonth)
  const isFiltered = !!(selectedYear || selectedMonth)

  function clearAll() {
    setSelectedYear(null); setSelectedMonth(null)
    setCompareYear(null);  setCompareMonth(null)
    setComparing(false)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  return (
    <>
      <header className="shrink-0 sticky top-0 z-10 border-b border-foreground/8 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Image src="/logo-green.svg" alt="Zen Spa" width={100} height={27} priority />
          <button onClick={logout} className="text-sm text-foreground/40 hover:text-foreground transition-colors">
            Uitloggen
          </button>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto min-h-0 lg:flex-none lg:overflow-visible mx-auto w-full max-w-4xl px-4 py-6 md:px-8 lg:px-0 space-y-5 pb-4">

        {/* Paginakop — losgekoppeld van filters */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-xl font-bold text-foreground">Inzichten</h1>
            <p className="mt-0.5 text-sm text-foreground/45">Trends en aanbevelingen voor Zen Spa</p>
          </div>
          {/* Grafiek / Tabel toggle */}
          <div className="flex items-center gap-0.5 rounded-xl border border-foreground/10 bg-secondary/10 p-1 shrink-0">
            <button onClick={() => setChartMode('chart')}
              className={cn('flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                chartMode === 'chart' ? 'bg-white text-foreground shadow-sm' : 'text-foreground/45 hover:text-foreground')}>
              <BarChart className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Grafiek</span>
            </button>
            <button onClick={() => setChartMode('table')}
              className={cn('flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors',
                chartMode === 'table' ? 'bg-white text-foreground shadow-sm' : 'text-foreground/45 hover:text-foreground')}>
              <Table2 className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Tabel</span>
            </button>
          </div>
        </div>

        {/* Filter card — eigen card, los van de paginakop */}
        <div className="rounded-2xl border border-foreground/8 bg-white shadow-sm px-5 py-4 space-y-3">
            {/* Gecombineerde jaar + maand pills — één rij */}
            <div className="flex items-center gap-2 flex-wrap">
              {/* Jaar */}
              {(data?.availableYears ?? []).length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {(data?.availableYears ?? []).map(yr => (
                    <button key={yr} onClick={() => setSelectedYear(yr === selectedYear ? null : yr)}
                      className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors',
                        selectedYear === yr ? 'bg-foreground/8 text-foreground font-semibold' : 'text-foreground/50 hover:bg-secondary/40')}>
                      {yr}
                    </button>
                  ))}
                </div>
              )}

              {/* Scheidingslijn als we zowel jaren als maanden hebben */}
              {(data?.availableYears ?? []).length > 0 && (data?.availableMonths ?? []).length > 0 && (
                <span className="h-4 w-px bg-foreground/12 shrink-0" />
              )}

              {/* Maanden — horizontaal scrollbaar op smal scherm */}
              {(data?.availableMonths ?? []).length > 0 && (
                <div className="flex items-center gap-1 flex-wrap">
                  {(data?.availableMonths ?? []).map(m => (
                    <button key={m} onClick={() => { setSelectedMonth(m === selectedMonth ? null : m); setCompareMonth(null) }}
                      className={cn('rounded-full px-3 py-1 text-xs font-medium transition-colors capitalize',
                        selectedMonth === m ? 'bg-accent text-white' : 'text-foreground/50 hover:bg-secondary/40')}>
                      {MONTH_NL[m - 1]}
                    </button>
                  ))}
                </div>
              )}

              {/* Actieve selectie tonen + wissen */}
              {isFiltered && (
                <button onClick={clearAll}
                  className="ml-1 text-[11px] text-foreground/35 hover:text-foreground/60 transition-colors flex items-center gap-0.5">
                  <X className="h-3 w-3" /> wis
                </button>
              )}
            </div>

            {/* Vergelijking — min-h zodat de kaart niet springt bij toggle */}
            <div className="min-h-[28px] flex items-center">
            {!comparing ? (
              <button onClick={() => setComparing(true)}
                className="inline-flex items-center gap-1 text-[11px] text-foreground/40 hover:text-accent transition-colors font-medium">
                <Plus className="h-3 w-3" /> vergelijk met andere periode
              </button>
            ) : (
              <div className="flex items-center gap-2 flex-wrap w-full border-t border-foreground/6 pt-2">
                {/* Actieve periode A */}
                <PeriodPill label={priLabel} />
                <span className="text-[11px] text-foreground/35 font-medium">vs</span>

                {/* Kies vergelijkingsmaand */}
                {cmpMonthOptions.length > 0 ? (
                  compareMonth ? (
                    <PeriodPill label={MONTH_NL[compareMonth - 1]} onClear={() => setCompareMonth(null)} />
                  ) : (
                    <div className="flex items-center gap-1 flex-wrap">
                      {cmpMonthOptions.map(m => (
                        <button key={m} onClick={() => setCompareMonth(m)}
                          className="rounded-full px-2.5 py-1 text-xs font-medium text-foreground/50 hover:bg-secondary/40 transition-colors capitalize border border-dashed border-foreground/20">
                          {MONTH_NL[m - 1]}
                        </button>
                      ))}
                    </div>
                  )
                ) : (
                  <span className="text-[11px] text-foreground/35 italic">
                    {selectedMonth ? 'geen andere maanden met data' : 'selecteer eerst een maand'}
                  </span>
                )}

                <button onClick={() => { setComparing(false); setCompareMonth(null); setCompareYear(null) }}
                  className="ml-auto text-foreground/30 hover:text-foreground/60 transition-colors" aria-label="Vergelijking sluiten">
                  <X className="h-4 w-4" />
                </button>
              </div>
            )}
            </div>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-28 rounded-2xl border border-foreground/8 bg-white animate-pulse" />
            ))}
          </div>
        ) : !data ? (
          <p className="text-foreground/40">Kon gegevens niet laden.</p>
        ) : (
          <>
            {/* KPI cards — met subtiele periode-context */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([
                { label: 'Totaal',    a: data.stats.total,          b: data.compareStats?.total,          sub: 'boekingen',     pct: false },
                { label: 'Bevestigd', a: data.stats.confirmed,      b: data.compareStats?.confirmed,      sub: 'afspraken',     pct: false },
                { label: 'Wachtend',  a: data.stats.pending,        b: data.compareStats?.pending,        sub: 'aanvragen',     pct: false },
                { label: 'Conversie', a: data.stats.conversionRate, b: data.compareStats?.conversionRate, sub: 'van aanvragen', pct: true  },
              ]).map(({ label, a, b, sub, pct }) => (
                <div key={label} className="rounded-2xl border border-foreground/8 bg-white px-4 py-4 shadow-sm">
                  <p className="text-[11px] font-medium uppercase tracking-wider text-foreground/35">{label}</p>
                  <p className="mt-1 text-2xl font-bold text-foreground">{a}{pct ? '%' : ''}</p>
                  {b !== undefined && hasCompare ? (
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-[11px] text-foreground/30 tabular-nums">{b}{pct ? '%' : ''}</span>
                      <Delta a={a} b={b} unit={pct ? '%' : ''} />
                    </div>
                  ) : (
                    <p className="text-[11px] text-foreground/35">{sub}</p>
                  )}
                </div>
              ))}
            </div>

            {/* AI aanbevelingen */}
            {data.aiAdvice && (
              <div className="rounded-2xl border border-accent/20 bg-accent/5 px-5 py-5 shadow-sm">
                <div className="flex items-center gap-2 mb-3">
                  <Sparkles className="h-4 w-4 text-accent" aria-hidden />
                  <h2 className="text-sm font-bold text-foreground">AI-aanbevelingen</h2>
                  <PeriodPill label={priLabel} />
                </div>
                <p className="text-sm text-foreground/70 whitespace-pre-line leading-relaxed">{data.aiAdvice}</p>
              </div>
            )}

            {/* Feestdagen */}
            {data.upcomingHolidays.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Calendar className="h-4 w-4 text-foreground/40" aria-hidden />
                  <h2 className="text-sm font-semibold text-foreground">Aankomende feestdagen & kansen</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {data.upcomingHolidays.map((h, i) => {
                    const days = daysUntil(h.date)
                    return (
                      <div key={i} className="rounded-2xl border border-foreground/8 bg-white px-4 py-3 shadow-sm flex items-start gap-3">
                        <div className="shrink-0 text-center min-w-[36px] pt-0.5">
                          <p className="text-sm font-bold text-foreground/60 leading-tight">{new Date(h.date).getDate()}</p>
                          <p className="text-[10px] text-foreground/35 uppercase tracking-wide leading-tight">
                            {new Date(h.date).toLocaleDateString('nl-NL', { month: 'short' })}
                          </p>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <p className="text-sm font-semibold text-foreground leading-tight">{h.label}</p>
                            <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold ${TYPE_COLOR[h.type] ?? 'bg-gray-100 text-gray-500'}`}>
                              {TYPE_LABEL[h.type] ?? h.type}
                            </span>
                          </div>
                          <p className="text-[11px] text-foreground/35 mt-0.5">
                            {humanDuration(days)}
                          </p>
                          <p className="mt-1 text-[12px] text-foreground/50 leading-snug">{h.tip}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}

            {/* Tijdsverloop */}
            {(data.monthData ?? data.dayOfMonthData) && (
              <div className="rounded-2xl border border-foreground/8 bg-white px-5 py-5 shadow-sm">
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-foreground/40" aria-hidden />
                    <h2 className="text-sm font-semibold text-foreground">
                      {data.dayOfMonthData ? `Drukte in ${MONTH_NL[(data.selectedMonth ?? 1) - 1]}` : 'Drukte per maand'}
                    </h2>
                  </div>
                  {hasCompare && cmpLabel && (
                    <div className="flex items-center gap-2 text-[10px] text-foreground/40">
                      <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-accent" />{priLabel}</span>
                      <span className="flex items-center gap-1"><span className="inline-block h-2 w-2 rounded-full bg-accent/30" />{cmpLabel}</span>
                    </div>
                  )}
                </div>
                {chartMode === 'chart' ? (
                  data.dayOfMonthData ? (
                    <HBarRows rows={data.dayOfMonthData}
                      compareRows={hasCompare ? (data.compareDayOfMonthData ?? null) : null}
                      priLabel={priLabel} cmpLabel={cmpLabel} />
                  ) : (
                    <ColumnChart rows={data.monthData!}
                      compareRows={hasCompare ? (data.compareMonthData ?? null) : null}
                      priLabel={priLabel} cmpLabel={cmpLabel} />
                  )
                ) : (
                  <DataTable
                    rows={data.dayOfMonthData ?? data.monthData!}
                    compareRows={hasCompare ? (data.compareDayOfMonthData ?? data.compareMonthData ?? null) : null}
                    priLabel={priLabel} cmpLabel={cmpLabel} />
                )}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Behandeling ranking */}
              {data.treatmentRanking.length > 0 && (
                <div className="rounded-2xl border border-foreground/8 bg-white px-5 py-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <Award className="h-4 w-4 text-foreground/40" aria-hidden />
                    <h2 className="text-sm font-semibold text-foreground">Populairste behandelingen</h2>
                  </div>
                  {chartMode === 'chart' ? (
                    <div className="space-y-3">
                      {data.treatmentRanking.slice(0, 8).map((t, i) => {
                        const max = data.treatmentRanking[0].count
                        const cmpItem = data.compareTreatmentRanking?.find(c => c.name === t.name)
                        const cmpMax  = data.compareTreatmentRanking?.[0]?.count ?? 1
                        return (
                          <div key={i} className="flex items-center gap-3">
                            <span className={cn('shrink-0 text-[10px] font-bold w-4',
                              i === 0 ? 'text-amber-500' : i === 1 ? 'text-foreground/45' : i === 2 ? 'text-amber-700/60' : 'text-foreground/20')}>
                              {i + 1}
                            </span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between gap-2 mb-1">
                                <span className="text-sm font-medium text-foreground truncate">{t.name}</span>
                                <span className="text-[11px] text-foreground/45 shrink-0 tabular-nums flex items-center gap-1">
                                  {t.count}×
                                  {cmpItem && hasCompare && <Delta a={t.count} b={cmpItem.count} />}
                                </span>
                              </div>
                              <div className="space-y-0.5">
                                <div className="h-1.5 rounded-full bg-secondary/40 overflow-hidden">
                                  <div className="h-full rounded-full bg-accent transition-all duration-700"
                                    style={{ width: `${(t.count / max) * 100}%` }} />
                                </div>
                                {cmpItem && hasCompare && (
                                  <div className="h-1 rounded-full bg-secondary/40 overflow-hidden">
                                    <div className="h-full rounded-full bg-accent/30 transition-all duration-700"
                                      style={{ width: `${(cmpItem.count / cmpMax) * 100}%` }} />
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  ) : (
                    <DataTable
                      rows={data.treatmentRanking.slice(0, 8).map(t => ({ label: t.name, count: t.count }))}
                      compareRows={hasCompare && data.compareTreatmentRanking
                        ? data.treatmentRanking.slice(0, 8).map(t => ({
                            label: t.name,
                            count: data.compareTreatmentRanking!.find(c => c.name === t.name)?.count ?? 0,
                          }))
                        : null}
                      priLabel={priLabel} cmpLabel={cmpLabel} />
                  )}
                  {data.treatmentRanking.length > 1 && (
                    <div className="mt-4 pt-3 border-t border-foreground/6 flex items-center gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-foreground/25" aria-hidden />
                      <p className="text-[12px] text-foreground/35">
                        Minst gevraagd: <span className="font-medium">{data.treatmentRanking[data.treatmentRanking.length - 1].name}</span>
                        {' '}({data.treatmentRanking[data.treatmentRanking.length - 1].count}×)
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Dag van de week */}
              {data.dayRanking.some(d => d.count > 0) && (
                <div className="rounded-2xl border border-foreground/8 bg-white px-5 py-5 shadow-sm">
                  <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="h-4 w-4 text-foreground/40" aria-hidden />
                    <h2 className="text-sm font-semibold text-foreground">Drukte per dag</h2>
                  </div>
                  {chartMode === 'chart' ? (
                    <HBarRows rows={data.dayRanking}
                      compareRows={hasCompare ? (data.compareDayRanking ?? null) : null}
                      priLabel={priLabel} cmpLabel={cmpLabel} />
                  ) : (
                    <DataTable rows={data.dayRanking}
                      compareRows={hasCompare ? (data.compareDayRanking ?? null) : null}
                      priLabel={priLabel} cmpLabel={cmpLabel} />
                  )}
                </div>
              )}
            </div>

            {data.stats.total === 0 && (
              <p className="text-center text-foreground/40 py-8">Geen boekingen gevonden voor deze periode.</p>
            )}
          </>
        )}
      </main>

    </>
  )
}
