'use client'

import { useEffect, useId, useMemo, useRef, useState } from 'react'
import Image from 'next/image'
import { Search, Tag, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'
import { image, type Parfum } from '@/lib/parfums-data'
import { suggest, type Suggestion } from '@/lib/parfums-search'

interface Props {
  value: string
  onChange: (v: string) => void
  onPickParfum: (p: Parfum) => void
  onPickNote: (note: string) => void
  onPickHouse: (house: string) => void
  /** Rond zoekicoon dat bij focus uitklapt (desktop) */
  compact?: boolean
  /** Zonder eigen rand: staat in een omhullende pill (mobiel) */
  embedded?: boolean
}

export function ParfumSearch({ value, onChange, onPickParfum, onPickNote, onPickHouse, compact, embedded }: Props) {
  const id = useId()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [focused, setFocused] = useState(false)
  const [active, setActive] = useState(-1)

  const items = useMemo(() => suggest(value), [value])
  const open = focused && value.trim().length > 0 && items.length > 0

  useEffect(() => {
    const close = (e: PointerEvent) => {
      if (!wrapRef.current?.contains(e.target as Node)) setFocused(false)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [])

  const pick = (s: Suggestion) => {
    setFocused(false)
    if (s.kind === 'parfum') {
      onChange(s.p.name)
      onPickParfum(s.p)
    } else if (s.kind === 'note') {
      onChange('')
      onPickNote(s.note)
    } else {
      onChange(s.house)
      onPickHouse(s.house)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') return setFocused(false)
    if (!open) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActive((a) => (a + 1) % items.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActive((a) => (a <= 0 ? items.length - 1 : a - 1))
    } else if (e.key === 'Enter' && active >= 0) {
      e.preventDefault()
      pick(items[active])
    }
  }

  return (
    <div ref={wrapRef} className={cn('relative', compact ? 'size-11 shrink-0' : 'w-full')}>
      <Search className={cn('pointer-events-none absolute top-1/2 z-20 size-4 -translate-y-1/2 text-foreground/70', compact ? 'left-[14px]' : 'left-4')} />
      <input
        type="search"
        role="combobox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-autocomplete="list"
        aria-activedescendant={active >= 0 ? `${id}-${active}` : undefined}
        autoComplete="off"
        value={value}
        onChange={(e) => {
          setActive(-1)
          onChange(e.target.value)
        }}
        onFocus={() => setFocused(true)}
        onKeyDown={onKeyDown}
        placeholder="Zoek een geur"
        aria-label="Zoek parfum"
        className={cn(
          'rounded-full border border-foreground/50 bg-white text-[15px] outline-none transition-[width,colors] duration-300 placeholder:text-muted-foreground focus:border-primary focus-visible:ring-2 focus-visible:ring-primary/40',
          compact
            ? 'absolute left-0 top-0 z-10 h-11 cursor-pointer pl-10 pr-4 focus:w-[280px] focus:cursor-text motion-reduce:transition-none [&:not(:placeholder-shown)]:w-[280px] w-11 placeholder:text-transparent focus:placeholder:text-muted-foreground'
            : embedded
              ? 'h-11 w-full border-transparent bg-transparent pl-11 pr-2 focus:border-transparent focus-visible:ring-0'
              : 'h-11 w-full pl-11 pr-4'
        )}
      />

      {open && (
        <ul
          id={`${id}-list`}
          role="listbox"
          className="absolute left-0 top-[calc(100%+8px)] z-50 w-full min-w-[300px] overflow-hidden rounded-3xl border border-foreground/10 bg-white p-2 shadow-[0_18px_50px_rgba(33,35,27,0.16)]"
        >
          {items.map((s, i) => (
            <li
              key={s.kind + (s.kind === 'parfum' ? s.p.slug : s.kind === 'note' ? s.note : s.house)}
              id={`${id}-${i}`}
              role="option"
              aria-selected={active === i}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => pick(s)}
              onMouseEnter={() => setActive(i)}
              className={cn(
                'flex cursor-pointer items-center gap-3 rounded-2xl px-2.5 py-2 transition-colors',
                active === i ? 'bg-secondary/70' : 'hover:bg-secondary/50'
              )}
            >
              {s.kind === 'parfum' ? (
                <>
                  <span className="relative size-11 shrink-0 overflow-hidden rounded-xl border border-foreground/8 bg-white">
                    <Image src={image(s.p)} alt="" fill sizes="44px" className="object-contain p-0.5" />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate font-heading text-[19px] leading-tight">{s.p.name}</span>
                    <span className="block truncate text-[13px] text-muted-foreground">
                      {s.via || `Geïnspireerd op ${s.p.inspired}`}
                    </span>
                  </span>
                </>
              ) : (
                <>
                  <span className="grid size-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    {s.kind === 'note' ? <Sparkles className="size-[18px]" /> : <Tag className="size-[18px]" />}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[15px]">{s.kind === 'note' ? s.note : s.house}</span>
                    <span className="block text-[13px] text-muted-foreground">
                      {s.kind === 'note' ? 'Geurnoot' : 'Merk'} · {s.count} {s.count === 1 ? 'geur' : 'geuren'}
                    </span>
                  </span>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
