'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronLeft, ChevronRight, CheckCircle2, Clock, CalendarDays, Leaf, Sparkles, Scissors, Zap, Euro, Timer, X } from 'lucide-react'
import { ZenSpaIcon } from '@/components/logo'
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
    <div className="mb-10 flex items-center gap-0">
      {steps.map((label, i) => {
        const num = i + 1
        const done = num < step
        const active = num === step
        return (
          <div key={label} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full items-center">
              {i > 0 && <div className={cn('h-px flex-1 transition-colors duration-500', done || active ? 'bg-accent' : 'bg-foreground/12')} />}
              <div className={cn(
                'flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold transition-all duration-300',
                done ? 'bg-accent text-white' : active ? 'border-2 border-accent text-accent' : 'border-2 border-foreground/15 text-foreground/30'
              )}>
                {done ? '✓' : num}
              </div>
              {i < steps.length - 1 && <div className={cn('h-px flex-1 transition-colors duration-500', done ? 'bg-accent' : 'bg-foreground/12')} />}
            </div>
            <span className={cn('hidden text-[11px] font-medium sm:block', active ? 'text-accent' : 'text-foreground/35')}>{label}</span>
          </div>
        )
      })}
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
          <div key={gi}>
            {group.subtitle && (
              <p className="mb-2 mt-4 text-[11px] font-semibold uppercase tracking-[0.12em] text-foreground/40">{group.subtitle}</p>
            )}
            {group.items.filter(t => t.bookable).map(t => (
              <button
                key={t.slug}
                onClick={() => onSelect(t)}
                className={cn(
                  'mb-2 flex w-full items-center justify-between rounded-2xl border p-4 text-left transition-all duration-200',
                  selected?.slug === t.slug
                    ? 'border-accent bg-accent/6 shadow-sm'
                    : 'border-foreground/8 bg-secondary/20 hover:border-accent/40 hover:bg-accent/4'
                )}
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className={cn('text-[15px] font-semibold', selected?.slug === t.slug ? 'text-accent' : 'text-foreground')}>{t.name}</span>
                    {t.tag && <span className="rounded-full bg-accent/12 px-2 py-0.5 text-[10px] font-semibold text-accent">{t.tag}</span>}
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

  useEffect(() => {
    if (selectedDate) fetchSlots(selectedDate)
  }, [selectedDate, fetchSlots])

  const days = getCalendarDays(calYear, calMonth)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-[28px] leading-tight tracking-tight md:text-[36px]">Kies een datum</h2>
        <p className="mt-1 text-[15px] text-foreground/55">We zijn open op <strong>maandag, woensdag en vrijdag</strong> van 10:00–18:00.</p>
      </div>

      {/* Calendar */}
      <div className="rounded-2xl border border-foreground/8 bg-secondary/10 p-4 md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <button onClick={prevMonth} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-foreground/6 transition-colors">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-[15px] font-semibold">{NL_MONTHS[calMonth]} {calYear}</span>
          <button onClick={nextMonth} className="flex h-8 w-8 items-center justify-center rounded-full hover:bg-foreground/6 transition-colors">
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center">
          {NL_DAY_HEADERS.map(d => (
            <div key={d} className="py-1 text-[11px] font-semibold text-foreground/35">{d}</div>
          ))}
          {days.map((dateStr, i) => {
            if (!dateStr) return <div key={`e-${i}`} />
            const disabled = dateStr < today || dateStr > maxDate || !isBusinessDay(dateStr)
            const isSelected = dateStr === selectedDate
            return (
              <button
                key={dateStr}
                disabled={disabled}
                onClick={() => { onDateSelect(dateStr); onSlotSelect('') }}
                className={cn(
                  'aspect-square w-full rounded-full text-[13px] font-medium transition-all duration-150',
                  isSelected ? 'bg-accent text-white shadow-sm' :
                  disabled ? 'cursor-not-allowed text-foreground/18' :
                  'hover:bg-accent/10 text-foreground/70'
                )}
              >
                {dateStr.slice(8)}
              </button>
            )
          })}
        </div>
      </div>

      {/* Time slots */}
      {selectedDate && (
        <div>
          <p className="mb-3 text-[14px] font-semibold text-foreground/60">{formatDateLong(selectedDate)}</p>
          {loadingSlots ? (
            <div className="flex items-center gap-2 text-[14px] text-foreground/40">
              <Clock className="h-4 w-4 animate-spin" /> Beschikbaarheid laden…
            </div>
          ) : slots.length === 0 ? (
            <p className="text-[14px] text-foreground/40">Geen beschikbare tijden op deze dag. Kies een andere datum.</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {slots.map(iso => (
                <button
                  key={iso}
                  onClick={() => onSlotSelect(iso)}
                  className={cn(
                    'rounded-full border px-4 py-2 text-[14px] font-medium transition-all duration-150',
                    selectedSlot === iso
                      ? 'border-accent bg-accent text-white shadow-sm'
                      : 'border-foreground/15 hover:border-accent/50 hover:bg-accent/5 text-foreground/70'
                  )}
                >
                  {formatTime(iso)}
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── Step 3: Contactgegevens ───────────────────────────────────────────────────
function ContactStep({ treatment, slotStart, onSubmit, submitting, error }: {
  treatment: Treatment
  slotStart: string
  onSubmit: (data: { name: string; email: string; phone: string; notes: string }) => void
  submitting: boolean
  error: string | null
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

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 w-full rounded-full bg-accent py-4 text-[16px] font-semibold text-white transition-all duration-200 hover:bg-accent/88 disabled:opacity-60"
        >
          {submitting ? 'Aanvraag versturen…' : 'Aanvraag indienen'}
        </button>
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
    <div className="flex min-h-svh flex-col bg-background">
      {/* ── Mini header ── */}
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center justify-between border-b border-foreground/8 bg-background/95 px-4 backdrop-blur-sm md:px-6">
        <a href="/" className="flex items-center gap-2.5 text-foreground" aria-label="Zen Spa – terug naar home">
          <ZenSpaIcon className="h-7 w-auto" />
          <span className="font-heading text-[20px] leading-none tracking-wide">zen spa</span>
        </a>

        {/* Progress dots — mobile only */}
        {step < 4 && (
          <div className="flex items-center gap-1.5 sm:hidden">
            {[1, 2, 3].map(n => (
              <span
                key={n}
                className={cn(
                  'h-1.5 rounded-full transition-all duration-300',
                  n === step ? 'w-5 bg-accent' : n < step ? 'w-1.5 bg-accent/50' : 'w-1.5 bg-foreground/15'
                )}
              />
            ))}
          </div>
        )}

        <a
          href="/"
          aria-label="Sluiten"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-foreground/12 text-foreground/50 transition-colors hover:bg-foreground/5 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </a>
      </header>

      {/* ── Content ── */}
      <main className="flex-1 py-8 pb-20">
        <div className="mx-auto max-w-2xl px-5">
          {/* Step bar — hidden on mobile (using dots in header instead) */}
          {step < 4 && (
            <div className="hidden sm:block">
              <StepBar step={step} />
            </div>
          )}

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
              />
            )}
            {step === 4 && treatment && slotStart && (
              <ConfirmStep treatment={treatment} slotStart={slotStart} />
            )}
          </div>

          {/* Navigation buttons */}
          {step < 4 && (
            <div className={cn('mt-8 flex', step > 1 ? 'justify-between' : 'justify-end')}>
              {step > 1 && (
                <button
                  onClick={() => setStep(s => (s - 1) as 1 | 2 | 3)}
                  className="flex items-center gap-1.5 rounded-full border border-foreground/15 px-6 py-3 text-[14px] font-medium text-foreground/60 hover:bg-foreground/4 transition-colors"
                >
                  <ChevronLeft className="h-4 w-4" /> Terug
                </button>
              )}
              {step < 3 && (
                <button
                  disabled={!canGoNext[step]}
                  onClick={() => setStep(s => (s + 1) as 2 | 3)}
                  className="flex items-center gap-1.5 rounded-full bg-accent px-8 py-3 text-[15px] font-semibold text-white transition-all duration-200 hover:bg-accent/88 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Volgende stap <ChevronRight className="h-4 w-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </main>
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
