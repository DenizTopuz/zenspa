'use client'

import { useState, useEffect, useCallback, useRef, Suspense, Fragment } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, CalendarDays, Leaf, Sparkles, Scissors, Zap, Euro, Timer, X } from 'lucide-react'
import Image from 'next/image'
import { ZenSpaLogo } from '@/components/logo'
import { DATA, getTreatmentBySlug, type Treatment, type TabKey } from '@/lib/behandelingen-data'
import { cn } from '@/lib/utils'

// ── Constants ─────────────────────────────────────────────────────────────────
const TZ = 'Europe/Amsterdam'
const NL_MONTHS = ['Januari','Februari','Maart','April','Mei','Juni','Juli','Augustus','September','Oktober','November','December']
const NL_DAY_HEADERS = ['Ma','Di','Wo','Do','Vr','Za','Zo']
const TABS: { key: TabKey; label: string }[] = [
  { key: 'gezicht',  label: 'Gezicht' },
  { key: 'lichaam',  label: 'Lichaam' },
  { key: 'pmu',      label: 'PMU' },
  { key: 'ontharen', label: 'Ontharen' },
]

// ── Helpers ───────────────────────────────────────────────────────────────────
function todayAms(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ })
}

function maxDateAms(): string {
  return new Date(Date.now() + 60 * 86_400_000).toLocaleDateString('en-CA', { timeZone: TZ })
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString('nl-NL', { timeZone: TZ, hour: '2-digit', minute: '2-digit' })
}

function slotHour(iso: string): number {
  return +new Intl.DateTimeFormat('en-US', { timeZone: TZ, hour: 'numeric', hour12: false }).format(new Date(iso))
}

function formatDateLong(dateStr: string) {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  const dow = ['zondag','maandag','dinsdag','woensdag','donderdag','vrijdag','zaterdag'][date.getDay()]
  return `${dow.charAt(0).toUpperCase() + dow.slice(1)} ${d} ${NL_MONTHS[m - 1].toLowerCase()}`
}

function isBusinessDay(dateStr: string): boolean {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dow = new Date(y, m - 1, d).getDay() // 0=Sun
  return dow === 1 || dow === 3 || dow === 5 // Mon Wed Fri
}

function getCalendarDays(year: number, month: number): (string | null)[] {
  const pad = (n: number) => String(n).padStart(2, '0')
  const firstDow = (new Date(year, month, 1).getDay() + 6) % 7 // 0=Mon
  const total = new Date(year, month + 1, 0).getDate()
  const cells: (string | null)[] = Array(firstDow).fill(null)
  for (let d = 1; d <= total; d++) {
    cells.push(`${year}-${pad(month + 1)}-${pad(d)}`)
  }
  return cells
}

// ── Step indicator ─────────────────────────────────────────────────────────────
function StepBar({ step }: { step: number }) {
  const steps = ['Behandeling', 'Datum & tijd', 'Gegevens', 'Bevestiging']
  return (
    <div className="mb-5">
      <div className="flex items-start">
        {steps.map((label, i) => {
          const num = i + 1
          const done = num < step
          const active = num === step
          return (
            <Fragment key={i}>
              {i > 0 && (
                <div className={cn('mt-4 h-px flex-1 transition-colors duration-500', done || active ? 'bg-accent' : 'bg-foreground/12')} />
              )}
              <div className="flex flex-col items-center gap-1.5">
                <div className={cn(
                  'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300',
                  done ? 'bg-accent text-white' : active ? 'border-2 border-accent text-accent' : 'border-2 border-foreground/15 text-foreground/30'
                )}>
                  {done ? '✓' : num}
                </div>
                <span className={cn(
                  'text-[10px] font-medium sm:text-[11px] whitespace-nowrap',
                  active ? 'text-accent' : 'text-foreground/35'
                )}>{label}</span>
              </div>
            </Fragment>
          )
        })}
      </div>
    </div>
  )
}

// ── Step 1: Behandeling kiezen ────────────────────────────────────────────────
function TreatmentStep({ selected, onSelect }: {
  selected: Treatment | null
  onSelect: (t: Treatment) => void
}) {
  const [tab, setTab] = useState<TabKey>('gezicht')

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-[28px] leading-tight tracking-tight md:text-[36px]">Kies een behandeling</h2>
        <p className="mt-1 text-[15px] text-foreground/55">Selecteer de behandeling waarvoor je een afspraak wilt maken.</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 rounded-full bg-secondary/50 p-1">
        {TABS.map(t => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={cn(
              'flex-1 rounded-full py-2 text-[13px] font-medium transition-all duration-200',
              tab === t.key ? 'bg-background text-foreground shadow-sm' : 'text-foreground/50 hover:text-foreground/70'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Treatment cards */}
      <div className="grid gap-2">
        {DATA[tab].groups.map((group, gi) => (
          <div key={gi} className="min-w-0">
            {group.subtitle && (
              <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/40">{group.subtitle}</p>
            )}
            {group.items.filter(t => t.bookable).map(t => (
              <button
                key={t.slug}
                onClick={() => onSelect(t)}
                className={cn(
                  'mb-2 flex w-full items-center overflow-hidden rounded-2xl border text-left transition-all duration-200',
                  selected?.slug === t.slug
                    ? 'border-accent bg-accent/6 shadow-sm'
                    : 'border-foreground/8 bg-secondary/20 hover:border-accent/40 hover:bg-accent/4'
                )}
              >
                {t.image && (
                  <div className="relative m-[4px] h-[72px] w-[72px] shrink-0 overflow-hidden rounded-xl">
                    <Image src={t.image} alt="" fill className="object-cover" sizes="72px" />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 items-center justify-between gap-3 p-3.5">
                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <p className={cn('min-w-0 truncate text-[15px] font-semibold', selected?.slug === t.slug ? 'text-accent' : 'text-foreground')}>{t.name}</p>
                      {t.tag && <span className="shrink-0 rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-semibold text-accent">{t.tag}</span>}
                    </div>
                    <div className="mt-0.5 flex items-center gap-3 text-[13px] text-foreground/45">
                      {t.duration && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{t.duration}</span>}
                      <span>{t.price}</span>
                    </div>
                  </div>
                  <div className={cn(
                    'flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all',
                    selected?.slug === t.slug ? 'border-accent bg-accent' : 'border-foreground/20'
                  )}>
                    {selected?.slug === t.slug && <span className="h-2 w-2 rounded-full bg-white" />}
                  </div>
                </div>
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Step 2: Datum & Tijd kiezen ───────────────────────────────────────────────
function DateTimeStep({ treatment, selectedDate, selectedSlot, onDateSelect, onSlotSelect }: {
  treatment: Treatment
  selectedDate: string | null
  selectedSlot: string | null
  onDateSelect: (d: string) => void
  onSlotSelect: (iso: string) => void
}) {
  const now = new Date()
  const [calYear, setCalYear] = useState(now.getFullYear())
  const [calMonth, setCalMonth] = useState(now.getMonth())
  const [slots, setSlots] = useState<string[]>([])
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [calOpen, setCalOpen] = useState(!selectedDate)
  const [monthAvail, setMonthAvail] = useState<Record<string, 'green' | 'orange' | 'red'>>({})
  const slotsRef = useRef<HTMLDivElement>(null)

  const today = todayAms()
  const maxDate = maxDateAms()

  const prevMonth = () => {
    if (calMonth === 0) { setCalYear(y => y - 1); setCalMonth(11) }
    else setCalMonth(m => m - 1)
  }
  const nextMonth = () => {
    if (calMonth === 11) { setCalYear(y => y + 1); setCalMonth(0) }
    else setCalMonth(m => m + 1)
  }

  const fetchSlots = useCallback(async (date: string) => {
    setLoadingSlots(true)
    setSlots([])
    try {
      const res = await fetch(`/api/availability?slug=${treatment.slug}&date=${date}`)
      const json = await res.json()
      setSlots(json.slots ?? [])
    } finally {
      setLoadingSlots(false)
    }
  }, [treatment.slug])

  const fetchMonthAvail = useCallback(async (year: number, month: number) => {
    const pad = (n: number) => String(n).padStart(2, '0')
    const monthStr = `${year}-${pad(month + 1)}`
    try {
      const res = await fetch(`/api/availability/month?slug=${treatment.slug}&month=${monthStr}`)
      const json = await res.json()
      setMonthAvail(json.availability ?? {})
    } catch { /* ignore */ }
  }, [treatment.slug])

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate)
  }, [selectedDate, fetchSlots])

  useEffect(() => {
    fetchMonthAvail(calYear, calMonth)
  }, [calYear, calMonth, fetchMonthAvail])

  const handleDatePick = (dateStr: string) => {
    onDateSelect(dateStr)
    onSlotSelect('')
    setCalOpen(false)
    setTimeout(() => slotsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }), 120)
  }

  const days = getCalendarDays(calYear, calMonth)

  // Slot groups (inline — no separate React component to avoid hoisting issues)
  const ochtend = slots.filter(s => slotHour(s) < 12)
  const middag  = slots.filter(s => slotHour(s) >= 12 && slotHour(s) < 17)
  const avond   = slots.filter(s => slotHour(s) >= 17)

  const slotBtn = (iso: string) => (
    <button
      key={iso}
      onClick={() => onSlotSelect(iso)}
      className={cn(
        'rounded-xl border py-3 text-center text-[14px] font-medium transition-all duration-150',
        selectedSlot === iso
          ? 'border-accent bg-accent text-white shadow-sm'
          : 'border-foreground/15 text-foreground/70 hover:border-accent/50 hover:bg-accent/5'
      )}
    >
      {formatTime(iso)}
    </button>
  )

  return (
    <div className="space-y-5">
      <div>
        <h2 className="font-heading text-[28px] leading-tight tracking-tight md:text-[36px]">Kies een datum & tijd</h2>
        <p className="mt-1 text-[15px] text-foreground/55">We zijn open op <strong>maandag, woensdag en vrijdag</strong> van 10:00–18:00.</p>
      </div>

      {/* Date chip — collapsed calendar state */}
      {selectedDate && !calOpen ? (
        <button
          onClick={() => setCalOpen(true)}
          className="group flex w-full items-center justify-between rounded-2xl border border-accent/25 bg-accent/5 px-4 py-3.5 transition-colors hover:border-accent/50 hover:bg-accent/10 active:bg-accent/14"
        >
          <div className="flex items-center gap-2.5">
            <CalendarDays className="h-4 w-4 shrink-0 text-accent" />
            <span className="text-[15px] font-semibold">{formatDateLong(selectedDate)}</span>
          </div>
          <div className="flex items-center gap-1 text-accent">
            <span className="text-[13px] font-medium">Wijzigen</span>
            <ChevronRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
          </div>
        </button>
      ) : (
        /* Full calendar */
        <div className="rounded-2xl border border-foreground/8 bg-secondary/10 p-4 md:p-6">
          <div className="mb-4 flex items-center justify-between">
            <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-foreground/6">
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="text-[15px] font-semibold">{NL_MONTHS[calMonth]} {calYear}</span>
            <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full transition-colors hover:bg-foreground/6">
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
          <div className="grid grid-cols-7 gap-y-1 gap-x-1 text-center">
            {NL_DAY_HEADERS.map(d => (
              <div key={d} className="py-1 text-[11px] font-semibold text-foreground/35">{d}</div>
            ))}
            {days.map((dateStr, i) => {
              if (!dateStr) return <div key={`e-${i}`} />
              const disabled = dateStr < today || dateStr > maxDate || !isBusinessDay(dateStr)
              const isSelected = dateStr === selectedDate
              const avail = monthAvail[dateStr]
              return (
                <div key={dateStr} className="flex flex-col items-center gap-[3px]">
                  <button
                    disabled={disabled}
                    onClick={() => handleDatePick(dateStr)}
                    className={cn(
                      'h-9 w-9 rounded-full text-[13px] transition-all duration-150',
                      isSelected
                        ? 'bg-accent font-semibold text-white shadow-sm'
                        : disabled
                        ? 'cursor-not-allowed text-foreground/22'
                        : 'font-semibold text-foreground hover:bg-accent/12 hover:text-accent'
                    )}
                  >
                    {dateStr.slice(8)}
                  </button>
                  <div className={cn(
                    'h-1.5 w-1.5 rounded-full transition-colors',
                    avail === 'green'  ? 'bg-emerald-400' :
                    avail === 'orange' ? 'bg-amber-400'   :
                    avail === 'red'    ? 'bg-rose-400'    : 'invisible'
                  )} />
                </div>
              )
            })}
          </div>
          {/* Legend */}
          <div className="mt-5 border-t border-foreground/8 pt-4 flex items-center justify-center gap-4 text-[11px] text-foreground/40">
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-emerald-400" />Veel plek</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-amber-400" />Bijna vol</span>
            <span className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-rose-400" />Laatste plekjes</span>
          </div>
          {selectedDate && (
            <button
              onClick={() => setCalOpen(false)}
              className="mt-3 w-full rounded-xl bg-foreground/5 py-2.5 text-[13px] font-medium text-foreground/50 transition-colors hover:bg-foreground/8"
            >
              Sluiten
            </button>
          )}
        </div>
      )}

      {/* Time slots */}
      {selectedDate && (
        <div ref={slotsRef}>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-[14px] text-foreground/40">
              <Clock className="h-4 w-4 animate-spin" /> Beschikbaarheid laden…
            </div>
          ) : slots.length === 0 ? (
            <div className="rounded-xl border border-foreground/8 bg-secondary/10 p-4 text-center text-[14px] text-foreground/40">
              Geen beschikbare tijden op deze dag. Kies een andere datum.
            </div>
          ) : (
            <div className="space-y-4">
              {ochtend.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground/35">Ochtend</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{ochtend.map(slotBtn)}</div>
                </div>
              )}
              {middag.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground/35">Middag</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{middag.map(slotBtn)}</div>
                </div>
              )}
              {avond.length > 0 && (
                <div>
                  <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.1em] text-foreground/35">Avond</p>
                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">{avond.map(slotBtn)}</div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 3: Contactgegevens ───────────────────────────────────────────────────
function ContactStep({ treatment, slotStart, onSubmit, submitting, error, formRef }: {
  treatment: Treatment
  slotStart: string
  onSubmit: (data: { name: string; email: string; phone: string; notes: string }) => void
  submitting: boolean
  error: string | null
  formRef: React.RefObject<HTMLFormElement | null>
}) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [notes, setNotes] = useState('')

  const inputCls = 'w-full rounded-xl border border-foreground/12 bg-secondary/20 px-4 py-3 text-[15px] text-foreground placeholder:text-foreground/35 focus:border-accent/60 focus:bg-background focus:outline-none transition-colors'

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-[28px] leading-tight tracking-tight md:text-[36px]">Jouw gegevens</h2>
        <p className="mt-1 text-[15px] text-foreground/55">Vul je contactgegevens in om de aanvraag te voltooien.</p>
      </div>

      {/* Booking summary */}
      <div className="rounded-2xl border border-foreground/8 bg-accent/4 p-4">
        <p className="text-[13px] font-semibold text-accent/80 mb-2">Jouw keuze</p>
        <p className="font-semibold text-foreground">{treatment.name}</p>
        <div className="mt-2 flex flex-col gap-y-1.5 text-[13px] text-foreground/60">
          <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{formatDateLong(slotStart.slice(0, 10))}</span>
          </span>
          <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{formatTime(slotStart)}</span>
          </span>
          {treatment.duration && (
            <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
              <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{treatment.duration}</span>
            </span>
          )}
          {treatment.price && (
            <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
              <Euro className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{treatment.price}</span>
            </span>
          )}
        </div>
      </div>

      <form
        ref={formRef}
        onSubmit={e => { e.preventDefault(); onSubmit({ name, email, phone, notes }) }}
        className="space-y-3"
      >
        <div>
          <label className="mb-1 block text-[13px] font-medium text-foreground/60">Naam <span className="text-accent">*</span></label>
          <input value={name} onChange={e => setName(e.target.value)} required placeholder="Voor- en achternaam" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-foreground/60">E-mailadres <span className="text-accent">*</span></label>
          <input type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="jouw@email.nl" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-foreground/60">Telefoonnummer <span className="text-accent">*</span></label>
          <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} required placeholder="06 12 34 56 78" className={inputCls} />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-foreground/60">Opmerking <span className="text-foreground/35 font-normal">(optioneel)</span></label>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} placeholder="Bijzonderheden, wensen of vragen…" className={`${inputCls} resize-none`} />
        </div>

        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-[13px] text-red-600 border border-red-200">{error}</p>
        )}

        <p className="text-[12px] text-foreground/40">Je aanvraag wordt beoordeeld. Je ontvangt een bevestiging via e-mail.</p>
      </form>
    </div>
  )
}

// ── Step 4: Bevestiging ───────────────────────────────────────────────────────
function ConfirmStep({ treatment, slotStart }: { treatment: Treatment; slotStart: string }) {
  return (
    <div className="py-8 space-y-5">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-accent/10">
        <CheckCircle2 className="h-10 w-10 text-accent" />
      </div>
      <div>
        <h2 className="font-heading text-[32px] tracking-tight md:text-[40px]">Aanvraag ontvangen!</h2>
        <p className="mt-2 text-[16px] text-foreground/55">
          We nemen zo snel mogelijk contact met je op om de afspraak te bevestigen.
        </p>
      </div>

      <div className="rounded-2xl border border-foreground/8 bg-secondary/15 p-5 space-y-2">
        <p className="text-[13px] font-semibold text-foreground/40 uppercase tracking-wide">Samenvatting</p>
        <p className="font-semibold text-foreground text-[16px]">{treatment.name}</p>
        <div className="mt-2 flex flex-col gap-y-1.5 text-[13px] text-foreground/60">
          <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
            <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{formatDateLong(slotStart.slice(0, 10))}</span>
          </span>
          <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
            <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
            <span>{formatTime(slotStart)}</span>
          </span>
          {treatment.duration && (
            <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
              <Timer className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{treatment.duration}</span>
            </span>
          )}
          {treatment.price && (
            <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
              <Euro className="h-3.5 w-3.5 shrink-0" aria-hidden />
              <span>{treatment.price}</span>
            </span>
          )}
        </div>
      </div>

      <a href="/" className="inline-block mt-4 rounded-full border border-foreground/15 px-8 py-3 text-[14px] font-medium text-foreground/60 hover:bg-foreground/4 transition-colors">
        Terug naar de homepage
      </a>
    </div>
  )
}

// ── Main wizard ───────────────────────────────────────────────────────────────
const NEXT_STEP_LABEL: Record<number, string> = {
  1: 'Datum & tijd',
  2: 'Gegevens',
  3: 'Afspraak aanvragen',
}

function BookingWizard() {
  const searchParams = useSearchParams()
  const preSlug = searchParams.get('behandeling')

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1)
  const [treatment, setTreatment] = useState<Treatment | null>(
    preSlug ? (getTreatmentBySlug(preSlug) ?? null) : null
  )
  const [date, setDate] = useState<string | null>(null)
  const [slotStart, setSlotStart] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const contactFormRef = useRef<HTMLFormElement>(null)

  const canGoNext: Record<number, boolean> = {
    1: !!treatment,
    2: !!date && !!slotStart,
    3: true,
  }

  async function handleSubmit(data: { name: string; email: string; phone: string; notes: string }) {
    if (!treatment || !slotStart) return
    setSubmitting(true)
    setSubmitError(null)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          treatment_slug: treatment.slug,
          customer_name: data.name,
          customer_email: data.email,
          customer_phone: data.phone,
          start_time: slotStart,
          notes: data.notes,
        }),
      })
      const json = await res.json()
      if (!res.ok) {
        setSubmitError(json.error ?? 'Er is iets misgegaan. Probeer het opnieuw.')
      } else {
        setStep(4)
      }
    } catch {
      setSubmitError('Geen verbinding. Controleer je internet en probeer opnieuw.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background overflow-x-clip">
      {/* ── Mini header ── */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-foreground/8 bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <a href="/" className="flex items-center text-foreground" aria-label="Zen Spa – terug naar home">
          <ZenSpaLogo className="h-7 w-auto" />
        </a>

        <a
          href="/"
          aria-label="Sluiten"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/12 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </a>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 pt-5 pb-32">
        <div className="mx-auto max-w-2xl w-full px-5 overflow-hidden">
          {step < 4 && <StepBar step={step} />}

          <div className="relative">
            {step === 1 && (
              <TreatmentStep selected={treatment} onSelect={t => setTreatment(t)} />
            )}
            {step === 2 && treatment && (
              <DateTimeStep
                treatment={treatment}
                selectedDate={date}
                selectedSlot={slotStart}
                onDateSelect={setDate}
                onSlotSelect={setSlotStart}
              />
            )}
            {step === 3 && treatment && slotStart && (
              <ContactStep
                treatment={treatment}
                slotStart={slotStart}
                onSubmit={handleSubmit}
                submitting={submitting}
                error={submitError}
                formRef={contactFormRef}
              />
            )}
            {step === 4 && treatment && slotStart && (
              <ConfirmStep treatment={treatment} slotStart={slotStart} />
            )}
          </div>
        </div>
      </main>

      {/* ── Sticky bottom bar ── */}
      {step < 4 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-foreground/8 bg-background/96 px-4 py-3 backdrop-blur-sm md:px-6">
          <div className="mx-auto flex max-w-2xl items-center gap-3">
            {step > 1 ? (
              <button
                onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                className="flex shrink-0 items-center gap-1 rounded-full border border-foreground/15 px-5 py-3 text-[14px] font-medium text-foreground/55 transition-colors hover:bg-foreground/4"
              >
                <ChevronLeft className="h-4 w-4" /> Terug
              </button>
            ) : (
              <div className="shrink-0" />
            )}

            <button
              disabled={!canGoNext[step] || (step === 3 && submitting)}
              onClick={() => {
                if (step === 3) {
                  contactFormRef.current?.requestSubmit()
                } else {
                  setStep(s => (s + 1) as 2 | 3)
                }
              }}
              className="flex flex-1 items-center justify-center gap-2 rounded-full bg-accent py-3.5 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent/88 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {step === 3
                ? (submitting ? 'Aanvraag versturen…' : 'Afspraak aanvragen')
                : (<><span>Volgende: {NEXT_STEP_LABEL[step]}</span><ChevronRight className="h-4 w-4" /></>)
              }
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

export default function BookingPage() {
  return (
    <Suspense>
      <BookingWizard />
    </Suspense>
  )
}
