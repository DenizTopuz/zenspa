'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, MessageCircle, X } from 'lucide-react'
import { ParfumSearch } from '@/components/parfum-search'
import { ParfumFamilyTabs } from '@/components/parfum-family-tabs'
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

const waLink = (p: Parfum) =>
  `${WHATSAPP}?text=${encodeURIComponent(`Hallo Zen Spa, ik heb interesse in de parfum ${p.name} (gebaseerd op ${p.inspired} – ${p.house}). Kunnen jullie mij hier meer over vertellen?`)}`

const familyLabel = (key: Family) => FAMILIES.find((f) => f.key === key)!.label

function NotePill({ note, active, onClick }: { note: string; active?: boolean; onClick?: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={cn(
        'flex shrink-0 items-center gap-2 rounded-full py-1.5 pr-3.5 pl-2.5 text-[13px] whitespace-nowrap transition-colors',
        active
          ? 'bg-primary text-primary-foreground'
          : 'bg-secondary/60 text-foreground/75 hover:bg-secondary hover:text-foreground'
      )}
    >
      <span
        aria-hidden
        className="size-3 rounded-full ring-1 ring-black/15"
        style={{ backgroundColor: NOTE_COLORS[note] ?? 'var(--primary)' }}
      />
      {note}
    </button>
  )
}

function ActiveChip({ label, onClear }: { label: string; onClear: () => void }) {
  return (
    <button
      type="button"
      onClick={onClear}
      aria-label={`Filter ${label} verwijderen`}
      className="flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[13px] text-foreground transition-colors hover:bg-secondary/70"
    >
      {label}
      <X className="size-3" />
    </button>
  )
}

function ParfumCard({ p, onOpen }: { p: Parfum; onOpen: () => void }) {
  return (
    <button
      type="button"
      onClick={onOpen}
      className="group flex h-full w-full flex-col overflow-hidden rounded-[22px] border border-foreground/8 bg-white text-left transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_18px_44px_rgba(33,35,27,0.10)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
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
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="font-heading text-[26px] leading-none tracking-tight sm:text-[30px]">{p.name}</h3>
            <span className="shrink-0 text-[15px] font-medium text-foreground/80">{priceOf(p)}</span>
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
function PhaseDot({ fill }: { fill: number }) {
  const r = 10
  const angle = fill * Math.PI * 2
  const x = 12 + r * Math.sin(angle)
  const y = 12 - r * Math.cos(angle)
  return (
    <svg viewBox="0 0 24 24" className="size-6 shrink-0 text-primary" aria-hidden>
      <circle cx="12" cy="12" r={r} fill="none" stroke="currentColor" strokeWidth="1.5" />
      {fill >= 1 ? (
        <circle cx="12" cy="12" r={r} fill="currentColor" />
      ) : (
        <path d={`M12 12 L12 ${12 - r} A${r} ${r} 0 ${fill > 0.5 ? 1 : 0} 1 ${x.toFixed(2)} ${y.toFixed(2)} Z`} fill="currentColor" />
      )}
    </svg>
  )
}

function NoteSteps({ p }: { p: Parfum }) {
  const rows = [
    { label: 'topnoot', when: 'eerste minuten', note: p.top, text: 'Dit ruik je als eerste. Fris en vluchtig.', fill: 0.25 },
    { label: 'hartnoot', when: 'na een kwartier', note: p.heart, text: 'Het karakter van de geur.', fill: 0.65 },
    { label: 'basisnoot', when: 'uren later', note: p.base, text: 'Blijft het langst op je huid hangen.', fill: 1 },
  ]
  if (!p.top && !p.heart && !p.base) {
    return <p className="text-[15px] italic text-muted-foreground">De geurnoten van deze geur volgen binnenkort.</p>
  }
  return (
    <ol className="divide-y divide-foreground/12 border-y border-foreground/12">
      {rows.map((r) => (
        <li
          key={r.label}
          className="grid grid-cols-[auto_1fr_auto] grid-rows-[auto_auto] items-baseline gap-x-4 gap-y-1.5 py-4"
        >
          <span className="row-span-2 self-center">
            <PhaseDot fill={r.fill} />
          </span>
          <span className="font-heading text-[28px] leading-none">{r.note ?? '—'}</span>
          <span className="text-right font-heading text-[22px] leading-none text-primary italic">{r.label}</span>
          <p className="text-[14px] leading-snug text-foreground/70">{r.text}</p>
          <span className="text-right text-[13px] font-medium text-foreground/75">{r.when}</span>
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
          <div className="absolute inset-x-0 bottom-3 flex justify-center">
            {slides.map((_, i) => (
              <button
                key={i}
                type="button"
                onClick={() => setShot(i)}
                aria-label={i === 0 ? 'Toon flacon' : 'Toon flacon met doosje'}
                className="grid h-8 w-8 place-items-center"
              >
                <span className={cn('h-2 rounded-full transition-all', shot === i ? 'w-6 bg-primary' : 'w-2 bg-foreground/25')} />
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function ParfumDialog({ p, onClose }: { p: Parfum | null; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null)
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

  // Mobiel: de greep bovenaan naar beneden slepen sluit de sheet
  const drag = useRef<{ y: number; dy: number } | null>(null)
  const dragProps = {
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
              <div className="flex items-center gap-4">
                <h3 className="font-heading text-[26px] leading-none tracking-tight md:text-[28px]">Zo ruik je deze geur</h3>
                <span aria-hidden className="h-px flex-1 translate-y-[4px] bg-foreground/15" />
              </div>
              <p className="mt-2 mb-4 hidden text-[15px] leading-snug text-foreground/65 md:block">
                Van de eerste spray tot uren later, in drie stappen.
              </p>
              <div className="mb-4 md:hidden" />
              <NoteSteps p={p} />
            </div>

            <div className="sticky bottom-0 z-10 -mx-5 mt-auto flex flex-col gap-3 border-t border-foreground/8 bg-background/95 px-5 pt-3 pb-[max(1.25rem,env(safe-area-inset-bottom))] backdrop-blur sm:-mx-9 sm:px-9 md:static md:mx-0 md:border-0 md:bg-transparent md:p-0 md:backdrop-blur-none">
              <div className="flex items-center justify-between rounded-2xl border border-foreground/10 bg-card px-5 py-3.5 max-md:border-0 max-md:bg-transparent max-md:px-1 max-md:py-0">
                <div className="flex items-center gap-3">
                  <span className="font-heading text-[30px] leading-none">{priceOf(p)}</span>
                </div>
                <span className="text-[13px] text-muted-foreground">Eau de Parfum · 100 ml</span>
              </div>

              <a
                href={waLink(p)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2.5 rounded-full bg-primary px-7 py-4 text-[16px] font-medium text-primary-foreground transition-opacity hover:opacity-90"
              >
                <MessageCircle className="size-5" />
                Vraag naar deze geur
              </a>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}

export function ParfumCollection() {
  const [family, setFamily] = useState<Family | 'alle'>('alle')
  const [note, setNote] = useState<string | null>(null)
  const [query, setQuery] = useState('')
  const [open, setOpen] = useState<Parfum | null>(null)

  const counts = useMemo(
    () => Object.fromEntries(FAMILIES.map((f) => [f.key, PARFUMS.filter((p) => p.family === f.key).length])) as Record<Family, number>,
    []
  )

  const results = useMemo(() => {
    return PARFUMS.filter((p) => {
      if (family !== 'alle' && p.family !== family) return false
      if (note && !matchesNote(p, note)) return false
      return matchesQuery(p, query)
    })
  }, [family, note, query])

  // Bij 0 resultaten door een typfout: stel de dichtstbijzijnde geur voor
  const didYouMean = useMemo(() => {
    if (results.length > 0 || !query.trim()) return null
    const first = suggest(query, 3).find((x) => x.kind === 'parfum')
    return first && first.kind === 'parfum' ? first.p : null
  }, [results.length, query])

  const reset = () => {
    setFamily('alle')
    setNote(null)
    setQuery('')
  }

  return (
    <>
      {/* Filters: hoofdcategorie = tabs zoals op de homepage; geurnoot = lichtere kleurstip-pills eronder */}
      <div className="mb-2 flex flex-col items-center gap-4 lg:gap-5">
        <ParfumFamilyTabs value={family} onChange={setFamily} total={PARFUMS.length} counts={counts} />

        <div className="flex w-full flex-col gap-2.5 lg:flex-row lg:items-center lg:justify-center lg:gap-4">
          <ParfumSearch
            value={query}
            onChange={setQuery}
            onPickParfum={setOpen}
            onPickNote={setNote}
            onPickHouse={() => setFamily('alle')}
          />

          <div
            role="group"
            aria-label="Geurnoot"
            className="-mx-5 flex items-center gap-2 overflow-x-auto px-5 [scrollbar-width:none] md:-mx-6 md:px-6 lg:mx-0 lg:px-0 [&::-webkit-scrollbar]:hidden"
          >
            <span className="mr-1 shrink-0 text-[11px] font-semibold tracking-[0.16em] text-foreground/70 uppercase">
              Hou je van
            </span>
            {POPULAR_NOTES.map((n) => (
              <NotePill key={n} note={n} active={note === n} onClick={() => setNote(note === n ? null : n)} />
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 mb-5 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-1 text-[14px] text-muted-foreground" aria-live="polite">
        <span>
          {results.length} {results.length === 1 ? 'geur' : 'geuren'}
        </span>
        {(family !== 'alle' || note || query) && (
          <>
            {family !== 'alle' && <ActiveChip label={familyLabel(family)} onClear={() => setFamily('alle')} />}
            {note && <ActiveChip label={note} onClear={() => setNote(null)} />}
            {query && <ActiveChip label={`“${query}”`} onClear={() => setQuery('')} />}
            <button type="button" onClick={reset} className="underline underline-offset-4 hover:text-foreground">
              Alles wissen
            </button>
          </>
        )}
      </div>

      {results.length > 0 ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-5 lg:grid-cols-4 lg:gap-6">
          {results.map((p) => (
            <ParfumCard key={p.slug} p={p} onOpen={() => setOpen(p)} />
          ))}
        </div>
      ) : (
        <div className="mx-auto max-w-[420px] py-16 text-center">
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

      <ParfumDialog p={open} onClose={() => setOpen(null)} />
    </>
  )
}
