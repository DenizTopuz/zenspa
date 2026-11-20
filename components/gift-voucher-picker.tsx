'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import { ArrowRight, Check, ChevronDown, Clock, Gift } from 'lucide-react'
import { cn } from '@/lib/utils'
import { getBookableTreatments } from '@/lib/behandelingen-data'

const WHATSAPP = 'https://wa.me/31653207729'
const QUICK_AMOUNTS = [25, 50, 75, 100]

type Mode = 'behandeling' | 'bedrag'

const treatments = getBookableTreatments().filter((t) => t.slug !== 'extra-zone')
const categories = Array.from(new Set(treatments.map((t) => t.category ?? 'Overig')))

// Eén stijl voor alle velden: zelfde hoogte, afronding, rand en label
const FIELD =
  'h-12 w-full rounded-xl border border-foreground/50 bg-white px-4 text-[16px] outline-none transition-colors placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40'
// Blokkoppen: echte titels in het kopfont
const LABEL = 'font-heading text-[22px] leading-none tracking-tight'


/** Eigen keuzelijst in de stijl van de site (de standaard dropdown van de browser is niet te stylen) */
function TreatmentSelect({ value, onChange, disabled }: { value: string; onChange: (slug: string) => void; disabled?: boolean }) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const wrapRef = useRef<HTMLDivElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const current = treatments.find((t) => t.slug === value) ?? treatments[0]

  useEffect(() => {
    if (!open) return
    const close = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [open])

  useEffect(() => {
    if (open) listRef.current?.querySelector<HTMLElement>(`[data-i="${active}"]`)?.scrollIntoView({ block: 'nearest' })
  }, [open, active])

  const toggle = () => {
    if (disabled) return
    if (!open) setActive(Math.max(0, treatments.findIndex((t) => t.slug === value)))
    setOpen((o) => !o)
  }
  const pick = (slug: string) => {
    onChange(slug)
    setOpen(false)
  }
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return setOpen(false)
    if (!open && (e.key === 'ArrowDown' || e.key === 'ArrowUp')) {
      e.preventDefault()
      return toggle()
    }
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => Math.min(treatments.length - 1, a + 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => Math.max(0, a - 1))
    } else if (e.key === 'Home') {
      e.preventDefault()
      setActive(0)
    } else if (e.key === 'End') {
      e.preventDefault()
      setActive(treatments.length - 1)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      pick(treatments[active].slug)
    }
  }

  let index = -1
  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls="behandeling-lijst"
        disabled={disabled}
        onClick={toggle}
        onKeyDown={onKeyDown}
        className={cn(FIELD, 'flex cursor-pointer items-center justify-between gap-3 text-left')}
      >
        <span className="truncate">
          {current.name} <span className="text-foreground/70">— {current.price}</span>
        </span>
        <ChevronDown aria-hidden className={cn('size-5 shrink-0 text-foreground/70 transition-transform duration-200', open && 'rotate-180')} />
      </button>

      {open && (
        <ul
          ref={listRef}
          id="behandeling-lijst"
          role="listbox"
          data-lenis-prevent
          className="absolute top-[calc(100%+8px)] left-0 z-40 max-h-[320px] w-full overflow-y-auto overscroll-contain rounded-2xl border border-foreground/10 bg-white p-2 shadow-[0_18px_50px_rgba(33,35,27,0.16)]"
        >
          {categories.map((c) => (
            <li key={c} role="presentation" className="not-first:mt-1">
              <p className="px-3 pt-2 pb-1.5 text-[11px] font-semibold tracking-[0.16em] text-foreground/70 uppercase">{c}</p>
              <ul role="group" aria-label={c}>
                {treatments
                  .filter((t) => (t.category ?? 'Overig') === c)
                  .map((t) => {
                    index += 1
                    const i = index
                    const selected = t.slug === value
                    return (
                      <li
                        key={t.slug}
                        role="option"
                        data-i={i}
                        aria-selected={selected}
                        onMouseDown={(e) => e.preventDefault()}
                        onMouseEnter={() => setActive(i)}
                        onClick={() => pick(t.slug)}
                        className={cn(
                          'flex cursor-pointer items-center justify-between gap-3 rounded-xl px-3 py-2.5 transition-colors',
                          selected ? 'text-accent' : 'text-foreground',
                          active === i ? 'bg-accent/10' : 'hover:bg-accent/[0.06]'
                        )}
                      >
                        <span className="flex min-w-0 items-center gap-3">
                          <span className="relative size-10 shrink-0 overflow-hidden rounded-lg bg-secondary">
                            {t.image && <Image src={t.image} alt="" fill sizes="40px" className="object-cover" style={{ objectPosition: t.objectPosition }} />}
                          </span>
                          <span className={cn('truncate text-[15px]', selected && 'font-semibold')}>{t.name}</span>
                          <Check aria-hidden className={cn('size-4 shrink-0', selected ? 'opacity-100' : 'opacity-0')} />
                        </span>
                        <span className="shrink-0 font-heading text-[18px] font-semibold">{t.price}</span>
                      </li>
                    )
                  })}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export function GiftVoucherPicker() {
  const [mode, setMode] = useState<Mode>('behandeling')
  const [slug, setSlug] = useState(treatments[0].slug)
  const [amount, setAmount] = useState('50')
  const [name, setName] = useState('')

  const treatment = treatments.find((t) => t.slug === slug) ?? treatments[0]
  const amountNum = Number(amount.replace(',', '.'))
  const amountOk = Number.isFinite(amountNum) && amountNum > 0
  const ready = mode === 'behandeling' || amountOk

  const what =
    mode === 'behandeling'
      ? `een cadeaubon voor ${treatment.name} (${treatment.price})`
      : `een cadeaubon ter waarde van € ${amountNum.toLocaleString('nl-NL', { minimumFractionDigits: amountNum % 1 ? 2 : 0 })}`
  const message =
    `Hallo Zen Spa, ik wil graag ${what} bestellen.` + (name.trim() ? ` De bon is voor ${name.trim()}.` : '')

  return (
    <div className="flex flex-col gap-5 rounded-3xl border border-foreground/10 bg-white p-6 md:p-8">
      {/* Zelfde tabstijl als elders op de site */}
      <div className="flex w-full rounded-full bg-accent/10 p-1.5" role="group" aria-label="Soort cadeaubon">
        {(
          [
            ['behandeling', 'Een behandeling'],
            ['bedrag', 'Een bedrag'],
          ] as const
        ).map(([key, label]) => (
          <button
            key={key}
            type="button"
            aria-pressed={mode === key}
            onClick={() => setMode(key)}
            className={cn(
              'flex flex-1 cursor-pointer items-center justify-center rounded-full py-3 text-[15px] font-semibold transition-all duration-200',
              mode === key ? 'bg-accent text-white shadow-sm' : 'text-foreground/70 hover:text-foreground'
            )}
          >
            {label}
          </button>
        ))}
      </div>


      {/* Voorbeeld van de bon, met de foto van de gekozen behandeling */}
      <div className="relative isolate h-44 overflow-hidden rounded-2xl bg-primary text-white md:h-48">
        <Image
          key={mode === 'behandeling' ? treatment.slug : 'hero'}
          src={mode === 'behandeling' ? (treatment.image ?? '/hero.jpg') : '/hero.jpg'}
          alt=""
          fill
          sizes="(min-width: 1024px) 480px, 100vw"
          className="-z-20 object-cover"
          style={{ objectPosition: mode === 'behandeling' ? treatment.objectPosition : '50% 40%' }}
        />
        <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black/70 via-black/25 to-black/10" />
        <span className="absolute top-4 right-4 grid size-10 place-items-center rounded-full bg-white/90 text-primary shadow-sm">
          <Gift aria-hidden className="size-5" />
        </span>
        <div className="absolute inset-x-5 bottom-4">
          <p className="text-[11px] font-semibold tracking-[0.18em] text-white/90 uppercase">Cadeaubon · Zen Spa</p>
          <p className="mt-1 font-heading text-[28px] leading-tight md:text-[32px]">
            {mode === 'behandeling'
              ? treatment.name
              : amountOk
                ? `€ ${amountNum.toLocaleString('nl-NL', { minimumFractionDigits: amountNum % 1 ? 2 : 0 })}`
                : 'Kies een bedrag'}
          </p>
          {mode === 'behandeling' && (
            <p className="mt-0.5 flex items-center gap-1.5 text-[13px] text-white/90">
              <Clock aria-hidden className="size-3.5" />
              {treatment.duration ?? ''} · {treatment.price}
            </p>
          )}
        </div>
      </div>

      {/* Beide varianten staan op dezelfde plek: de hoogte blijft gelijk, er verspringt niets */}
      <div className="grid">
        <div
          className={cn('col-start-1 row-start-1 flex flex-col gap-3', mode !== 'behandeling' && 'invisible')}
          aria-hidden={mode !== 'behandeling'}
        >
          <div className="flex flex-col gap-3">
            <span className={LABEL}>Kies een behandeling</span>
            <TreatmentSelect value={slug} onChange={setSlug} disabled={mode !== 'behandeling'} />
          </div>
          <p className="line-clamp-2 text-[14px] leading-snug text-foreground/75">{treatment.description}</p>
        </div>

        <div
          className={cn('col-start-1 row-start-1 flex flex-col gap-3', mode !== 'bedrag' && 'invisible')}
          aria-hidden={mode !== 'bedrag'}
        >
          <span className={LABEL}>Kies een bedrag</span>
          <div role="group" aria-label="Snelle bedragen" className="grid grid-cols-4 gap-2.5">
            {QUICK_AMOUNTS.map((a) => {
              const on = amount === String(a)
              return (
                <button
                  key={a}
                  type="button"
                  aria-pressed={on}
                  disabled={mode !== 'bedrag'}
                  onClick={() => setAmount(String(a))}
                  className={cn(
                    'h-12 cursor-pointer rounded-xl border text-[16px] font-semibold transition-all duration-200',
                    on
                      ? 'border-primary bg-primary text-primary-foreground shadow-sm'
                      : 'border-foreground/50 bg-white hover:border-primary hover:bg-primary/10'
                  )}
                >
                  € {a}
                </button>
              )
            })}
          </div>
          <div className="relative">
            <span aria-hidden className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-foreground/70">€</span>
            <input
              inputMode="decimal"
              value={amount}
              disabled={mode !== 'bedrag'}
              onChange={(e) => setAmount(e.target.value.replace(/[^0-9,.]/g, ''))}
              placeholder="Of typ een ander bedrag"
              aria-label="Ander bedrag in euro"
              className={cn(FIELD, 'pl-9')}
            />
          </div>
        </div>
      </div>

      <label className="flex flex-col gap-3">
        <span className={LABEL}>
          Voor wie is de bon? <span className="font-sans text-[14px] tracking-normal text-foreground/70">(optioneel)</span>
        </span>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Naam van de ontvanger"
          className={FIELD}
        />
      </label>

      <div className="flex flex-col gap-3">
        <a
          href={ready ? `${WHATSAPP}?text=${encodeURIComponent(message)}` : undefined}
          aria-disabled={!ready}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(
            'group inline-flex h-14 items-center justify-center gap-2.5 rounded-full bg-primary px-7 text-[16px] font-medium text-primary-foreground transition-opacity',
            ready ? 'hover:opacity-90' : 'pointer-events-none opacity-50'
          )}
        >
          <Gift aria-hidden className="size-5" />
          Bestel via WhatsApp
          <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
        </a>
        <p className="text-left text-[13px] leading-relaxed text-foreground/70">
          Je opent WhatsApp met een ingevuld bericht. Je hoeft alleen nog op verzenden te drukken.
        </p>
      </div>
    </div>
  )
}
