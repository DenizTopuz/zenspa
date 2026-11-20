'use client'

import { useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react'
import Image from 'next/image'
import { ArrowRight, ChevronLeft, ChevronRight, SlidersHorizontal, X } from 'lucide-react'
import { ParfumSearch } from '@/components/parfum-search'
import { ParfumFamilyTabs, ParfumFamilyList } from '@/components/parfum-family-tabs'
import { matchesQuery, suggest } from '@/lib/parfums-search'
import { cn } from '@/lib/utils'
import {
  FAMILIES,
  PARFUMS,
  NOTE_COLORS,
  POPULAR_NOTES,
  image,
  imageAlt,
  matchesNote,
  priceOf,
  noteList,
  type Family,
  type Parfum,
} from '@/lib/parfums-data'

const WHATSAPP = 'https://wa.me/31653207729'

/** Link naar deze geur op de site: WhatsApp toont hiervan zelf een preview met foto en titel */
const shareUrl = (p: Parfum, origin: string) => `${origin}/parfums?geur=${p.slug}`

const waLink = (p: Parfum, origin: string) => {
  const text =
    `Hallo Zen Spa, ik heb interesse in dit geurtje: ${p.name} (geïnspireerd op ${p.inspired} – ${p.house}).` +
    (origin ? `\n${shareUrl(p, origin)}` : '')
  return `${WHATSAPP}?text=${encodeURIComponent(text)}`
}

const noopSubscribe = () => () => {}

const familyLabel = (key: Family) => FAMILIES.find((f) => f.key === key)!.label

function NotePill({
  note,
  active,
  count,
  onClick,
  large,
  tall,
}: {
  note: string
  active?: boolean
  count?: number
  onClick?: () => void
  large?: boolean
  tall?: boolean
}) {
  const empty = !active && count === 0
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      disabled={empty}
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-full whitespace-nowrap transition-colors',
        large ? 'py-3 pr-4 pl-3 text-[15px]' : tall ? 'h-11 pr-4 pl-3 text-[14px]' : 'py-1.5 pr-3.5 pl-2.5 text-[13px]',
        active
          ? 'border border-transparent bg-primary text-primary-foreground'
          : 'border border-foreground/50 bg-white text-foreground hover:border-primary hover:bg-primary/10',
        empty && 'cursor-not-allowed opacity-45 hover:border-foreground/50 hover:bg-white'
      )}
    >
      <span
        aria-hidden
        className="size-3 rounded-full ring-1 ring-black/35"
        style={{ backgroundColor: NOTE_COLORS[note] ?? 'var(--primary)' }}
      />
      {note}
      {count !== undefined && (
        <span className={cn('text-[11px]', active ? 'text-primary-foreground/80' : 'text-foreground/70')}>{count}</span>
      )}
    </button>
  )
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Filter ${label} verwijderen`}
      className="group flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[13px] text-foreground transition-colors hover:bg-secondary/70"
    >
      {label}
      <X className="size-3 text-foreground/70 transition-colors group-hover:text-foreground" strokeWidth={1.4} aria-hidden />
    </button>
  )
}

/** Mobiele lijstweergave: de foto staat links en is leidend, de info ernaast */
function ParfumRow({ p, onOpen }: { p: Parfum; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex w-full cursor-pointer items-center gap-5 overflow-hidden rounded-[22px] border border-foreground/8 bg-white p-3 pr-4 text-left transition-colors active:bg-secondary/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:hidden"
    >
      <span className="relative size-[116px] shrink-0 overflow-hidden rounded-2xl bg-white">
        <Image
          src={image(p)}
          alt={`Yodeyma ${p.name}`}
          fill
          sizes="116px"
          className="scale-[1.2] object-contain"
        />
      </span>

      <span className="flex min-w-0 flex-1 flex-col items-start gap-2">
        <span className="rounded-full bg-background px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-foreground/70 uppercase">
          {p.unisex ? 'Unisex' : familyLabel(p.family)}
        </span>
        <span className="font-heading text-[28px] leading-[1.02] tracking-tight">{p.name}</span>
        <span className="text-[13px] leading-snug text-muted-foreground">
          Geïnspireerd op <span className="font-medium text-foreground">{p.inspired}</span> van {p.house}
        </span>
        {noteList(p).length > 0 && (
          <span className="flex flex-wrap gap-1">
            {noteList(p).map((n) => (
              <span key={n} className="rounded-full border border-foreground/12 bg-white px-2 py-0.5 text-[12px] text-foreground/75">
                {n}
              </span>
            ))}
          </span>
        )}
        <span className="mt-1 flex w-full items-center justify-between gap-2">
          <span className="font-heading text-[26px] leading-none font-semibold text-primary">{priceOf(p)}</span>
          <ChevronRight aria-hidden className="size-5 text-foreground/50" />
        </span>
      </span>
    </button>
  )
}

function ParfumCard({ p, onOpen }: { p: Parfum; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group hidden h-full w-full cursor-pointer flex-col overflow-hidden rounded-[22px] border border-foreground/8 bg-white text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(33,35,27,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:flex"
    >
      <div className="relative aspect-square overflow-hidden bg-white">
        <Image
          src={image(p)}
          alt={`Yodeyma ${p.name}`}
          fill
          sizes="(min-width:1024px) 22vw, (min-width:640px) 30vw, 46vw"
          className={cn(
            'object-contain p-2 transition-all duration-700 group-hover:scale-[1.04]',
            p.hasAlt && 'group-hover:opacity-0'
          )}
        />
        {p.hasAlt && (
          <Image
            src={imageAlt(p)}
            alt=""
            aria-hidden
            fill
            sizes="(min-width:1024px) 22vw, (min-width:640px) 30vw, 46vw"
            className="object-contain p-2 opacity-0 transition-all duration-700 group-hover:scale-[1.04] group-hover:opacity-100"
          />
        )}
        <span className="absolute left-3 top-3 rounded-full bg-background/90 px-2.5 py-1 text-[11px] font-semibold tracking-[0.12em] text-foreground/65 uppercase backdrop-blur">
          {p.unisex ? 'Unisex' : familyLabel(p.family)}
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-3 border-t border-foreground/6 bg-card p-4 sm:p-5">
        <div>
          <div className="flex flex-col gap-1.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-3">
            <h3 className="font-heading text-[26px] leading-none tracking-tight sm:text-[30px]">{p.name}</h3>
            <span className="shrink-0 font-heading text-[26px] leading-none font-semibold text-primary sm:text-[28px]">{priceOf(p)}</span>
          </div>
          <p className="mt-2 text-[13px] leading-snug text-muted-foreground sm:text-[14px]">
            Geïnspireerd op <span className="text-foreground/85">{p.inspired}</span>
            <span className="block">{p.house}</span>
          </p>
        </div>
        <div className="mt-auto flex flex-wrap gap-1.5">
          {noteList(p).map((n) => (
            <span key={n} className="rounded-full bg-secondary/70 px-2.5 py-1 text-[12px] text-foreground/70">
              {n}
            </span>
          ))}
          {noteList(p).length === 0 && (
            <span className="text-[12px] italic text-muted-foreground">Geurnoten volgen</span>
          )}
        </div>
      </div>
    </button>
  )
}

/** Cirkel die zich vult naarmate de tijd verstrijkt: ¼, ¾ en vol */
/** Mini-geurpiramide: de laag die bij deze noot hoort is gevuld (0 = top, 1 = hart, 2 = basis) */
function PyramidMark({ level }: { level: 0 | 1 | 2 }) {
  const top = 3
  const h = 18
  const gap = 1.3
  const hw = (y: number) => ((y - top) / h) * 10
  const bands = [
    [top, top + 6 - gap / 2],
    [top + 6 + gap / 2, top + 12 - gap / 2],
    [top + 12 + gap / 2, top + 18],
  ]
  return (
    <svg viewBox="0 0 24 24" className="size-7 shrink-0 text-primary" aria-hidden>
      {bands.map(([y1, y2], i) => (
        <polygon
          key={i}
          points={`${12 - hw(y1)},${y1} ${12 + hw(y1)},${y1} ${12 + hw(y2)},${y2} ${12 - hw(y2)},${y2}`}
          fill="currentColor"
          fillOpacity={i === level ? 0.7 : 0.2}
        />
      ))}
    </svg>
  )
}

function NoteSteps({ p }: { p: Parfum }) {
  const rows = [
    { label: 'topnoot', when: 'eerste minuten', note: p.top, text: 'Dit ruik je als eerste. Fris en vluchtig.', level: 0 as const },
    { label: 'hartnoot', when: 'na een kwartier', note: p.heart, text: 'Het karakter van de geur.', level: 1 as const },
    { label: 'basisnoot', when: 'uren later', note: p.base, text: 'Blijft het langst op je huid hangen.', level: 2 as const },
  ]
  if (!p.top && !p.heart && !p.base) {
    return <p className="text-[15px] italic text-muted-foreground">De geurnoten van deze geur volgen binnenkort.</p>
  }
  return (
    <ol className="flex flex-col gap-2.5">
      {rows.map((r) => (
        <li key={r.label} className="relative rounded-2xl bg-white/70 px-5 py-4">
          <span className="absolute top-1/2 right-5 -translate-y-1/2">
            <PyramidMark level={r.level} />
          </span>
          <div className="min-w-0">
            <p className="text-[11px] leading-none tracking-[0.14em] text-foreground/70 uppercase">
              <span className="font-semibold text-foreground/80">{r.label}</span>
              <span aria-hidden> · </span>
              {r.when}
            </p>
            <p className="mt-2 font-heading text-[24px] leading-none">{r.note ?? '—'}</p>
            <p className="mt-1.5 text-[14px] leading-snug text-foreground/70">{r.text}</p>
          </div>
        </li>
      ))}
    </ol>
  )
}

function ParfumGallery({ p, shot, setShot }: { p: Parfum; shot: number; setShot: (n: number) => void }) {
  const wrapRef = useRef<HTMLDivElement>(null)
  const down = useRef<{ x: number; y: number } | null>(null)
  const lastWheel = useRef(0)
  const slides = p.hasAlt ? [image(p), imageAlt(p)] : [image(p)]
  const many = slides.length > 1

  const go = (dir: 1 | -1) => setShot((shot + dir + slides.length) % slides.length)

  // Verticaal scrollen met de muis op de afbeelding wisselt de foto (alleen desktop)
  useEffect(() => {
    const el = wrapRef.current
    if (!el || !many) return
    const onWheel = (e: WheelEvent) => {
      if (Math.abs(e.deltaY) < 8) return
      e.preventDefault()
      const now = Date.now()
      if (now - lastWheel.current < 550) return
      lastWheel.current = now
      go(e.deltaY > 0 ? 1 : -1)
    }
    el.addEventListener('wheel', onWheel, { passive: false })
    return () => el.removeEventListener('wheel', onWheel)
  })

  return (
    <div className="relative h-[min(62vw,250px)] shrink-0 overflow-hidden bg-white sm:h-[420px] md:h-auto md:min-h-[600px]">
      <div
        ref={wrapRef}
        className={cn('absolute inset-0 touch-none select-none', many && 'cursor-pointer')}
        onPointerDown={(e) => (down.current = { x: e.clientX, y: e.clientY })}
        onPointerUp={(e) => {
          const d = down.current
          down.current = null
          if (!d || !many) return
          const dx = e.clientX - d.x
          const dy = e.clientY - d.y
          // Veeg (horizontaal of verticaal) wisselt de foto; een tik gaat naar de volgende
          if (Math.max(Math.abs(dx), Math.abs(dy)) > 40) {
            const d2 = Math.abs(dx) > Math.abs(dy) ? dx : dy
            go(d2 < 0 ? 1 : -1)
          } else if (Math.abs(dx) < 8 && Math.abs(dy) < 8) go(1)
        }}
        onPointerCancel={() => (down.current = null)}
      >
        <div
          className="flex h-full w-full transition-transform duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] motion-reduce:transition-none"
          style={{ transform: `translateX(-${shot * 100}%)` }}
        >
          {slides.map((src, i) => (
            <div key={src} className="relative h-full min-w-full">
              <Image
                src={src}
                alt={i === 0 ? `Yodeyma ${p.name}` : `Yodeyma ${p.name} met doosje`}
                fill
                draggable={false}
                sizes="(min-width:768px) 500px, 100vw"
                className="object-contain p-6 md:p-10"
                priority={i === 0}
              />
            </div>
          ))}
        </div>
      </div>

      {many && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Vorige afbeelding"
            className="absolute top-1/2 left-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-foreground/10 bg-white/90 shadow-sm transition-colors hover:bg-white md:grid"
          >
            <ChevronLeft className="size-5" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Volgende afbeelding"
            className="absolute top-1/2 right-3 hidden size-11 -translate-y-1/2 place-items-center rounded-full border border-foreground/10 bg-white/90 shadow-sm transition-colors hover:bg-white md:grid"
          >
            <ChevronRight className="size-5" />
          </button>
          <div className="absolute top-3 left-3 z-10 flex gap-2 md:top-4 md:left-4" role="group" aria-label="Kies afbeelding">
            {slides.map((src, i) => (
              <button
                key={src}
                type="button"
                onClick={() => setShot(i)}
                aria-label={i === 0 ? 'Toon flacon' : 'Toon flacon met doosje'}
                aria-current={shot === i}
                className={cn(
                  'relative size-12 overflow-hidden rounded-xl bg-white transition-all duration-200 md:size-16',
                  shot === i
                    ? 'ring-2 ring-primary ring-offset-2 ring-offset-white'
                    : 'border border-foreground/25 opacity-75 hover:opacity-100'
                )}
              >
                <Image src={src} alt="" fill sizes="64px" draggable={false} className="object-contain p-1" />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

/** Mobiel: de greep bovenaan van een sheet naar beneden slepen sluit hem */
function useSheetDrag(ref: React.RefObject<HTMLDialogElement | null>) {
  const drag = useRef<{ y: number; dy: number } | null>(null)
  return {
    onPointerDown: (e: React.PointerEvent<HTMLDivElement>) => {
      drag.current = { y: e.clientY, dy: 0 }
      e.currentTarget.setPointerCapture(e.pointerId)
      if (ref.current) ref.current.style.transition = 'none'
    },
    onPointerMove: (e: React.PointerEvent<HTMLDivElement>) => {
      const d = drag.current
      if (!d || !ref.current) return
      d.dy = Math.max(0, e.clientY - d.y)
      ref.current.style.transform = `translateY(${d.dy}px)`
    },
    onPointerUp: () => {
      const d = drag.current
      drag.current = null
      const el = ref.current
      if (!d || !el) return
      el.style.transition = 'transform 0.25s ease-out'
      if (d.dy > 110) el.close()
      else el.style.transform = ''
    },
  }
}

function NotesSheet({
  open,
  onClose,
  notes,
  allNotes,
  noteCount,
  toggle,
  clear,
  total,
}: {
  open: boolean
  onClose: () => void
  notes: string[]
  allNotes: string[]
  noteCount: (n: string) => number
  toggle: (n: string) => void
  clear: () => void
  total: number
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const dragProps = useSheetDrag(ref)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (open && !d.open) {
      d.style.transform = ''
      d.style.transition = ''
      d.showModal()
    }
    if (!open && d.open) d.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      aria-label="Kies geurnoten"
      className="parfum-sheet m-0 mt-auto w-full max-w-none overflow-hidden rounded-t-[28px] rounded-b-none border-0 bg-background p-0 text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop:bg-stone-950/55 backdrop:backdrop-blur-sm sm:hidden"
    >
      <div {...dragProps} className="relative touch-none pt-3 pb-2">
        <div aria-hidden className="mx-auto h-1.5 w-11 rounded-full bg-foreground/20" />
      </div>
      <div className="px-5 pb-2">
        <h2 className="font-heading text-[30px] leading-none tracking-tight">Hou je van…</h2>
        <p className="mt-2 text-[14px] text-foreground/70">Kies één of meer noten. Je ziet meteen hoeveel geuren er overblijven.</p>
        <div className="mt-5 flex flex-wrap gap-2.5">
          {allNotes.map((n) => (
            <NotePill key={n} note={n} active={notes.includes(n)} count={noteCount(n)} onClick={() => toggle(n)} large />
          ))}
        </div>
      </div>
      <div className="mt-4 flex items-center gap-3 border-t border-foreground/8 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))]">
        <button
          type="button"
          onClick={clear}
          disabled={notes.length === 0}
          className="shrink-0 px-2 py-3 text-[15px] underline underline-offset-4 disabled:no-underline disabled:opacity-40"
        >
          Wissen
        </button>
        <button
          type="button"
          onClick={() => ref.current?.close()}
          className="flex-1 rounded-full bg-primary py-4 text-[16px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          Toon {total} {total === 1 ? 'geur' : 'geuren'}
        </button>
      </div>
    </dialog>
  )
}

function ParfumDialog({ p, onClose }: { p: Parfum | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
  const origin = useSyncExternalStore(noopSubscribe, () => window.location.origin, () => '')
  const [shot, setShot] = useState(0)

  useEffect(() => {
    const d = ref.current
    if (!d) return
    if (p && !d.open) {
      setShot(0)
      d.style.transform = ''
      d.style.transition = ''
      d.showModal()
      document.documentElement.style.overflow = 'hidden'
    }
    if (!p && d.open) d.close()
    return () => {
      document.documentElement.style.overflow = ''
    }
  }, [p])

  const dragProps = useSheetDrag(ref)

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && ref.current?.close()}
      onKeyDown={(e) => {
        if (!p?.hasAlt) return
        if (['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) setShot((n) => (n + 1) % 2)
      }}
      aria-label={p ? `${p.name} – details` : undefined}
      className="parfum-sheet m-0 mt-auto w-full max-w-none max-h-[92dvh] overflow-hidden rounded-t-[28px] rounded-b-none border-0 bg-background p-0 text-foreground shadow-[0_30px_90px_rgba(0,0,0,0.35)] backdrop:bg-stone-950/55 backdrop:backdrop-blur-sm md:m-auto md:w-[min(1000px,calc(100vw-24px))] md:max-h-[calc(100dvh-24px)] md:rounded-[28px]"
    >
      {p && (
        <div className="grid max-h-[92dvh] auto-rows-min overflow-y-auto overscroll-contain md:max-h-[calc(100dvh-24px)] md:auto-rows-auto md:grid-cols-2" data-lenis-prevent>
          {/* Mobiel: greep om de sheet weg te slepen + sluitknop */}
          <div {...dragProps} className="relative z-20 touch-none bg-white pt-3 pb-3 md:hidden">
            <div aria-hidden className="mx-auto h-1.5 w-11 rounded-full bg-foreground/20" />
            <button
              type="button"
              onClick={() => ref.current?.close()}
              onPointerDown={(e) => e.stopPropagation()}
              aria-label="Sluiten"
              className="absolute top-2 right-3 grid size-10 place-items-center rounded-full border border-foreground/10 bg-card"
            >
              <X className="size-4" />
            </button>
          </div>
          <ParfumGallery p={p} shot={shot} setShot={setShot} />

          <div className="relative flex flex-col gap-6 p-5 pb-0 sm:p-9 sm:pb-0 md:gap-7 md:pb-9">
            <button
              type="button"
              onClick={() => ref.current?.close()}
              aria-label="Sluiten"
              className="absolute right-4 top-4 hidden size-10 place-items-center rounded-full border border-foreground/10 bg-card transition-colors hover:bg-secondary md:grid"
            >
              <X className="size-4" />
            </button>

            <div className="-mt-1 md:mt-0 md:pr-10">
              <span className="text-[12px] font-semibold tracking-[0.2em] text-primary uppercase">
                {p.unisex ? 'Unisex' : 'Dames'} · {familyLabel(p.family)}
              </span>
              <h2 className="mt-2 font-heading text-[40px] leading-none tracking-tight sm:text-[54px]">{p.name}</h2>
              <p className="mt-3 text-[16px] leading-relaxed text-muted-foreground">
                Geïnspireerd op <span className="text-foreground">{p.inspired}</span> van {p.house}
              </p>
            </div>

            <div>
              <h3 className="font-heading text-[28px] leading-none font-normal tracking-tight">Zo ruik je deze geur</h3>
              <p className="mt-2.5 mb-4 hidden text-[16px] leading-snug text-foreground/80 md:block">
                Van de eerste spray tot uren later, in drie stappen.
              </p>
              <div className="mb-4 md:hidden" />
              <NoteSteps p={p} />
            </div>

            {/* Eén ontwerp voor mobiel en desktop; op mobiel blijft het vastgeplakt onderin */}
            <div className="sticky bottom-0 z-10 -mx-5 mt-auto bg-gradient-to-t from-background from-70% to-transparent px-4 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))] sm:-mx-9 sm:px-8 md:static md:mx-0 md:bg-none md:p-0">
              <div className="relative flex flex-col gap-3 overflow-hidden rounded-2xl bg-[linear-gradient(135deg,oklch(0.52_0.054_122),oklch(0.40_0.05_122))] px-5 py-4 text-primary-foreground shadow-[0_18px_40px_-18px_rgba(60,66,45,0.55)] md:flex-row md:items-center md:justify-between md:gap-4 md:py-3.5">
                <span aria-hidden className="pointer-events-none absolute -top-16 -right-12 size-48 rounded-full bg-white/10 blur-2xl" />
                <div className="relative flex min-w-0 items-baseline justify-between gap-3 md:flex-col md:items-start md:justify-start md:gap-1">
                  <span className="font-heading text-[32px] leading-none font-semibold">{priceOf(p)}</span>
                  <span className="text-[13px] leading-tight text-primary-foreground/85">Eau de Parfum · 100 ml</span>
                </div>
                <a
                  href={waLink(p, origin)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative inline-flex w-full shrink-0 items-center justify-center gap-2 rounded-full bg-background px-4 py-3 text-[15px] font-medium md:w-auto md:py-2.5 md:text-[14px] text-foreground shadow-lg shadow-black/20 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
                >
                  Vraag naar deze geur
                  <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

const EXIT_MS = 220

/**
 * Raster met zichtbare filteranimatie: geuren die wegvallen vervagen eerst,
 * de rest schuift soepel naar zijn nieuwe plek (FLIP) en nieuwe geuren komen zacht binnen.
 */
function ParfumGrid({ results, onOpen }: { results: Parfum[]; onOpen: (p: Parfum) => void }) {
  const [shown, setShown] = useState(results)
  const gridRef = useRef<HTMLDivElement>(null)
  const prevPos = useRef(new Map<string, { x: number; y: number }>())

  const resultSlugs = new Set(results.map((p) => p.slug))
  const leaving = new Set(shown.filter((p) => !resultSlugs.has(p.slug)).map((p) => p.slug))

  // Eerst laten vervagen wat wegvalt, daarna pas de nieuwe lijst tonen
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const same = shown.length === results.length && shown.every((p, i) => p.slug === results[i].slug)
    if (same) return
    const t = setTimeout(() => setShown(results), leaving.size && !reduce ? EXIT_MS : 0)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [results])

  // FLIP: vergelijk de posities met de vorige keer en animeer het verschil
  useEffect(() => {
    const grid = gridRef.current
    if (!grid) return
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const next = new Map<string, { x: number; y: number }>()
    let entering = 0
    grid.querySelectorAll<HTMLElement>('[data-slug]').forEach((el) => {
      const slug = el.dataset.slug!
      const pos = { x: el.offsetLeft, y: el.offsetTop }
      next.set(slug, pos)
      if (reduce || el.dataset.leaving === 'true') return
      const before = prevPos.current.get(slug)
      if (before) {
        const dx = before.x - pos.x
        const dy = before.y - pos.y
        if (dx || dy) {
          el.animate(
            [{ transform: `translate(${dx}px, ${dy}px)` }, { transform: 'translate(0, 0)' }],
            { duration: 450, easing: 'cubic-bezier(0.22, 1, 0.36, 1)' }
          )
        }
      } else if (prevPos.current.size > 0) {
        el.animate(
          [
            { opacity: 0, transform: 'translateY(14px) scale(0.96)' },
            { opacity: 1, transform: 'translateY(0) scale(1)' },
          ],
          { duration: 420, delay: Math.min(entering++, 8) * 35, easing: 'cubic-bezier(0.22, 1, 0.36, 1)', fill: 'backwards' }
        )
      }
    })
    prevPos.current = next
  }, [shown])

  return (
    <div ref={gridRef} className="relative grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-2 lg:gap-6 xl:grid-cols-3">
      {shown.map((p) => (
        <div
          key={p.slug}
          data-slug={p.slug}
          data-leaving={leaving.has(p.slug)}
          className={cn(
            'transition-[opacity,transform] ease-out motion-reduce:transition-none',
            leaving.has(p.slug) ? 'pointer-events-none scale-95 opacity-0 duration-200' : 'duration-0'
          )}
        >
          <ParfumRow p={p} onOpen={() => onOpen(p)} />
          <ParfumCard p={p} onOpen={() => onOpen(p)} />
        </div>
      ))}
    </div>
  )
}

// Alle gekozen noten moeten in de geur zitten (en-filter): hoe meer noten, hoe specifieker
const hasNotes = (p: Parfum, list: string[]) => list.every((n) => matchesNote(p, n))

export function ParfumCollection({ initialSlug }: { initialSlug?: string }) {
  const [family, setFamily] = useState<Family | 'alle'>('alle')
  const [notes, setNotes] = useState<string[]>([])
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Parfum | null>(() => PARFUMS.find((x) => x.slug === initialSlug) ?? null)
  const [sheetOpen, setSheetOpen] = useState(false)
  const [quickOpen, setQuickOpen] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const rootRef = useRef<HTMLDivElement>(null)
  const filtersRef = useRef<HTMLDivElement>(null)
  // De balk blijft altijd in de DOM en fade via opacity; positie regelt de browser (sticky), zonder scroll-code
  const [barVisible, setBarVisible] = useState(false)
  const barVisibleRef = useRef(false)
  const endRef = useRef<HTMLDivElement>(null)
  const [barTop, setBarTop] = useState(76)

  const toggleNote = (n: string) => setNotes((cur) => (cur.includes(n) ? cur.filter((x) => x !== n) : [...cur, n]))
  const addNote = (n: string) => setNotes((cur) => (cur.includes(n) ? cur : [...cur, n]))

  const results = useMemo(
    () =>
      PARFUMS.filter(
        (p) => (family === 'alle' || p.family === family) && hasNotes(p, notes) && matchesQuery(p, query)
      ),
    [family, notes, query]
  )

  // Live aantallen: elke tab en noot toont hoeveel geuren er overblijven mét de andere filters
  const familyCounts = useMemo(() => {
    const base = PARFUMS.filter((p) => hasNotes(p, notes) && matchesQuery(p, query))
    const out = { alle: base.length } as Record<Family | 'alle', number>
    for (const f of FAMILIES) out[f.key] = base.filter((p) => p.family === f.key).length
    return out
  }, [notes, query])

  const noteCount = (n: string) =>
    PARFUMS.filter(
      (p) =>
        (family === 'alle' || p.family === family) &&
        matchesQuery(p, query) &&
        hasNotes(p, notes.includes(n) ? notes : [...notes, n])
    ).length

  const noteList2 = [...POPULAR_NOTES, ...notes.filter((n) => !POPULAR_NOTES.includes(n))]

  // Bij 0 resultaten door een typfout: stel de dichtstbijzijnde geur voor
  const didYouMean = useMemo(() => {
    if (results.length > 0 || !query.trim()) return null
    const first = suggest(query, 3).find((x) => x.kind === 'parfum')
    return first && first.kind === 'parfum' ? first.p : null
  }, [results.length, query])

  const reset = () => {
    setFamily('alle')
    setNotes([])
    setQuery('')
  }

  // Compacte balk: zichtbaar zodra de filters boven het scherm uit zijn en tot je het einde van de lijst nadert.
  // Alleen een IntersectionObserver bepaalt de zichtbaarheid; er is geen scroll-listener die iets verplaatst.
  useEffect(() => {
    const filtersEl = filtersRef.current
    const endEl = endRef.current
    if (!filtersEl || !endEl) return
    const top = Math.round(document.querySelector('header')?.getBoundingClientRect().bottom ?? 70)
    let filtersGone = false
    let endNear = false

    const apply = () => {
      const show = filtersGone && !endNear
      if (show === barVisibleRef.current) return
      // De hoogte pas vastleggen vlak voor hij verschijnt, als de navigatie is uitgeklapt
      if (show) setBarTop(Math.round(document.querySelector('header')?.getBoundingClientRect().bottom ?? top) + 8)
      barVisibleRef.current = show
      setBarVisible(show)
      if (!show) setQuickOpen(false)
    }

    const ioFilters = new IntersectionObserver(
      ([e]) => {
        filtersGone = !e.isIntersecting && e.boundingClientRect.bottom < top
        apply()
      },
      { rootMargin: `-${top}px 0px 0px 0px` }
    )
    const ioEnd = new IntersectionObserver(
      ([e]) => {
        endNear = !e.isIntersecting && e.boundingClientRect.top < top + 200
        apply()
      },
      { rootMargin: `-${top + 200}px 0px 0px 0px` }
    )
    ioFilters.observe(filtersEl)
    ioEnd.observe(endEl)
    return () => {
      ioFilters.disconnect()
      ioEnd.disconnect()
    }
  }, [])

  useEffect(() => {
    if (!quickOpen) return
    const onDown = (e: PointerEvent) => {
      if (!barRef.current?.contains(e.target as Node)) setQuickOpen(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setQuickOpen(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [quickOpen])

  const filtersActive = family !== 'alle' || notes.length > 0 || query !== ''
  const countLabel = `${results.length} ${results.length === 1 ? 'geur' : 'geuren'}`
  const chips = (
    <>
      {family !== 'alle' && <ActiveChip label={familyLabel(family)} onClear={() => setFamily('alle')} />}
      {notes.map((n) => (
        <ActiveChip key={n} label={n} onClear={() => toggleNote(n)} />
      ))}
      {query && <ActiveChip label={`“${query}”`} onClear={() => setQuery('')} />}
    </>
  )

  return (
    <div ref={rootRef}>
      {/* Compacte balk — blijft in beeld tijdens het scrollen; Filters klapt een paneel uit op de plek waar je bent */}
      {/* fixed (niet sticky): body heeft overflow-x:hidden op deze site, waardoor sticky niet werkt */}
      <div className="pointer-events-none fixed inset-x-0 z-30 px-3 md:px-6 lg:hidden" style={{ top: barTop }}>
        <div
          ref={barRef}
          className={cn(
            'transition-[opacity,visibility] duration-300 ease-out motion-reduce:transition-none',
            barVisible ? 'pointer-events-auto visible opacity-100' : 'invisible opacity-0'
          )}
        >
          <div className="mx-auto w-full max-w-[640px]">
            <div className="flex items-center gap-3 rounded-full border border-foreground/10 bg-white/92 py-2 pr-2 pl-5 shadow-[0_10px_34px_rgba(33,35,27,0.12)] backdrop-blur-xl">
              <span className="shrink-0 text-[14px] font-medium" aria-live="polite">
                {countLabel}
              </span>
              <div className="flex min-w-0 flex-1 items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                {filtersActive ? chips : <span className="text-[13px] text-foreground/70">Alle geuren</span>}
              </div>
              <button
                type="button"
                onClick={() => setQuickOpen((o) => !o)}
                aria-expanded={quickOpen}
                aria-controls="snelfilters"
                className="flex shrink-0 items-center gap-2 rounded-full bg-foreground px-4 py-2.5 text-[14px] text-background transition-opacity hover:opacity-90"
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {family !== 'alle' || notes.length > 0 ? (
                  <span className="grid size-5 place-items-center rounded-full bg-white text-[12px] font-semibold text-foreground">
                    {(family !== 'alle' ? 1 : 0) + notes.length}
                  </span>
                ) : null}
              </button>
            </div>

            {(
              <div
                id="snelfilters"
                aria-hidden={!quickOpen}
                className={cn(
                  'mt-2 max-h-[min(70vh,560px)] overflow-y-auto rounded-3xl border border-foreground/10 bg-white p-4 shadow-[0_18px_50px_rgba(33,35,27,0.16)] transition-[opacity,transform,visibility] duration-250 ease-out motion-reduce:transition-none md:p-5',
                  quickOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                )}
                data-lenis-prevent
              >
                <input
                  type="search"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Zoek een geur"
                  aria-label="Zoek parfum"
                  className="mb-4 h-11 w-full rounded-full border border-foreground/12 bg-white px-5 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40"
                />

                <p className="mb-2 text-[12px] font-semibold tracking-[0.16em] text-foreground/70 uppercase">Geurfamilie</p>
                <div className="mb-4 flex flex-wrap gap-2">
                  {[{ key: 'alle' as const, label: 'Alle' }, ...FAMILIES].map((f) => {
                    const active = family === f.key
                    const count = familyCounts[f.key]
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFamily(f.key)}
                        aria-pressed={active}
                        disabled={count === 0 && !active}
                        className={cn(
                          'flex items-center gap-2 rounded-full border px-4 py-2 text-[14px] transition-colors disabled:cursor-not-allowed disabled:opacity-40',
                          active
                            ? 'border-foreground bg-foreground text-background'
                            : 'border-foreground/12 bg-white hover:border-foreground/40'
                        )}
                      >
                        {f.label}
                        <span className={cn('text-[12px]', active ? 'text-background/70' : 'text-foreground/70')}>{count}</span>
                      </button>
                    )
                  })}
                </div>

                <p className="mb-2 text-[12px] font-semibold tracking-[0.16em] text-foreground/70 uppercase">Hou je van</p>
                <div className="flex flex-wrap gap-2">
                  {noteList2.map((n) => (
                    <NotePill key={n} note={n} active={notes.includes(n)} count={noteCount(n)} onClick={() => toggleNote(n)} />
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between gap-3">
                  <button
                    type="button"
                    onClick={reset}
                    disabled={!filtersActive}
                    className="px-2 py-2 text-[14px] underline underline-offset-4 disabled:no-underline disabled:opacity-40"
                  >
                    Alles wissen
                  </button>
                  <button
                    type="button"
                    onClick={() => setQuickOpen(false)}
                    className="rounded-full bg-primary px-6 py-3 text-[15px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
                  >
                    Toon {results.length} {results.length === 1 ? 'geur' : 'geuren'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Filters: hoofdcategorie = tabs zoals op de homepage; geurnoot = lichtere kleurstip-pills eronder */}
      <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)] lg:items-start lg:gap-10">
      {/* Zijbalk (desktop): zoeken en filters links, geuren rechts */}
      <aside className="hidden lg:sticky lg:top-36 lg:flex lg:flex-col lg:gap-6" aria-label="Filters">
        <ParfumSearch
          value={query}
          onChange={setQuery}
          onPickParfum={setOpen}
          onPickNote={addNote}
          onPickHouse={() => setFamily('alle')}
        />
        <div>
          <p className="mb-3 px-1 text-[12px] font-semibold tracking-[0.16em] text-foreground/70 uppercase">Geurfamilie</p>
          <ParfumFamilyList value={family} onChange={setFamily} total={familyCounts.alle} counts={familyCounts} />
        </div>
        <div>
          <p className="mb-3 px-1 text-[12px] font-semibold tracking-[0.16em] text-foreground/70 uppercase">Hou je van</p>
          <div className="flex flex-wrap gap-2" role="group" aria-label="Geurnoot">
            {noteList2.map((n) => (
              <NotePill key={n} note={n} active={notes.includes(n)} count={noteCount(n)} onClick={() => toggleNote(n)} />
            ))}
          </div>
        </div>
        <p className="px-1 text-[14px] text-muted-foreground" aria-live="polite">{countLabel}</p>
        {filtersActive && (
          <button type="button" onClick={reset} className="self-start px-1 text-[14px] text-muted-foreground underline underline-offset-4 hover:text-foreground">
            Alles wissen
          </button>
        )}
      </aside>

      <div className="min-w-0">
      <div ref={filtersRef} className="mb-2 flex flex-col items-center gap-4 lg:hidden">
        <ParfumFamilyTabs value={family} onChange={setFamily} total={familyCounts.alle} counts={familyCounts} />

        <div className="flex w-full flex-col items-center gap-2.5 sm:gap-4">
          <div className="flex h-11 w-full items-stretch rounded-full border border-foreground/50 bg-white transition-colors focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/40 sm:hidden">
            <div className="min-w-0 flex-1">
              <ParfumSearch
                embedded
                value={query}
                onChange={setQuery}
                onPickParfum={setOpen}
                onPickNote={addNote}
                onPickHouse={() => setFamily('alle')}
              />
            </div>

            {/* Mobiel: geurnoten-knop als onderdeel van dezelfde balk */}
            <button
              type="button"
              onClick={() => setSheetOpen(true)}
              className={cn(
                'flex shrink-0 items-center gap-2 rounded-r-full border-l px-4 text-[15px] transition-colors',
                notes.length ? 'border-primary bg-primary text-primary-foreground' : 'border-foreground/20 bg-white'
              )}
            >
              <SlidersHorizontal className="size-4" />
              Geurnoot
              {notes.length > 0 && (
                <span className="grid size-5 place-items-center rounded-full bg-white text-[12px] font-semibold text-primary">
                  {notes.length}
                </span>
              )}
            </button>
          </div>

          <div className="hidden w-full flex-col items-center gap-4 sm:flex">
            <div className="w-full max-w-[480px]">
              <ParfumSearch
                value={query}
                onChange={setQuery}
                onPickParfum={setOpen}
                onPickNote={addNote}
                onPickHouse={() => setFamily('alle')}
              />
            </div>
            <div
              role="group"
              aria-label="Geurnoot"
              className="flex max-w-full items-center gap-2 overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            >
              <span className="mr-1 shrink-0 text-[11px] font-semibold tracking-[0.16em] text-foreground/70 uppercase">
                Hou je van
              </span>
              {noteList2.map((n) => (
                <NotePill tall key={n} note={n} active={notes.includes(n)} count={noteCount(n)} onClick={() => toggleNote(n)} />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-1 lg:hidden text-[14px] text-muted-foreground" aria-live="polite">
        <span>{countLabel}</span>
        {filtersActive && (
          <>
            {chips}
            <button type="button" onClick={reset} className="underline underline-offset-4 hover:text-foreground">
              Alles wissen
            </button>
          </>
        )}
      </div>

      <ParfumGrid results={results} onOpen={setOpen} />

      {results.length === 0 && (
        <div
          className="mx-auto max-w-[420px] py-16 text-center"
          style={{ animation: 'sheet-fade 0.3s ease-out 0.25s backwards' }}
        >
          <p className="font-heading text-[30px]">Geen geur gevonden</p>
          <p className="mt-2 text-[16px] text-muted-foreground">Probeer een andere noot of zoekterm.</p>
          {didYouMean && (
            <p className="mt-4 text-[16px]">
              Bedoelde je{' '}
              <button
                type="button"
                onClick={() => setQuery(didYouMean.name)}
                className="font-heading text-[20px] underline underline-offset-4 hover:text-primary"
              >
                {didYouMean.name}
              </button>
              ?
            </p>
          )}
          <button
            type="button"
            onClick={reset}
            className="mt-6 rounded-full border border-foreground/20 px-6 py-3 text-[15px] transition-colors hover:bg-secondary"
          >
            Alle filters wissen
          </button>
        </div>
      )}

      <div ref={endRef} aria-hidden className="h-px" />
      </div>
      </div>

      <ParfumDialog p={open} onClose={() => setOpen(null)} />
      <NotesSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        notes={notes}
        allNotes={noteList2}
        noteCount={noteCount}
        toggle={toggleNote}
        clear={() => setNotes([])}
        total={results.length}
      />
    </div>
  )
}
