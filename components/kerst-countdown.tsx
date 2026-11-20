'use client'

import { useSyncExternalStore } from 'react'

const MINUTE = 60_000

/** Tikt één keer per minuut; op de server is de waarde 0 zodat er geen verschil in HTML ontstaat */
function subscribe(cb: () => void) {
  const id = setInterval(cb, 15_000)
  return () => clearInterval(id)
}
const getSnapshot = () => Math.floor(Date.now() / MINUTE)
const getServerSnapshot = () => 0

/** Eerste kerstdag, 00:00 lokale tijd */
function christmas(now: Date) {
  return new Date(now.getFullYear(), 11, 25, 0, 0, 0)
}

export function KerstCountdown() {
  const minuteStamp = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
  const ready = minuteStamp > 0
  const now = new Date(minuteStamp * MINUTE)
  const left = ready ? christmas(now).getTime() - now.getTime() : 0

  // Na de kerstdagen of vóór de eerste meting tonen we niets (blok houdt wel zijn hoogte vast)
  if (ready && left <= 0) return null

  const days = Math.floor(left / (24 * 60 * MINUTE))
  const hours = Math.floor((left / (60 * MINUTE)) % 24)
  const minutes = Math.floor((left / MINUTE) % 60)

  const units = [
    { value: days, label: days === 1 ? 'dag' : 'dagen' },
    { value: hours, label: 'uur' },
    { value: minutes, label: minutes === 1 ? 'minuut' : 'minuten' },
  ]

  return (
    <div className="flex flex-col items-center gap-3" role="timer" aria-label={ready ? `Nog ${days} dagen tot kerst` : 'Aftellen tot kerst'}>
      <p className="text-[12px] font-semibold tracking-[0.2em] text-primary-foreground/85 uppercase">Nog tot kerst</p>
      <div className="flex items-stretch gap-2.5 md:gap-3">
        {units.map((u) => (
          <div
            key={u.label}
            className="flex min-w-[76px] flex-col items-center gap-1 rounded-2xl border border-white/20 bg-white/10 px-4 py-3 backdrop-blur-sm md:min-w-[92px] md:py-3.5"
          >
            <span className="font-heading text-[34px] leading-none font-semibold tabular-nums md:text-[40px]">
              {ready ? String(u.value).padStart(2, '0') : '––'}
            </span>
            <span className="text-[11px] tracking-[0.14em] text-primary-foreground/85 uppercase">{u.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
