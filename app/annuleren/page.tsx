'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { CalendarDays, Clock } from 'lucide-react'
import { ZenSpaLogo } from '@/components/logo'

function formatDateNL(iso: string) {
  return new Date(iso).toLocaleDateString('nl-NL', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
    timeZone: 'Europe/Amsterdam',
  })
}

function formatTimeNL(iso: string) {
  return new Date(iso).toLocaleTimeString('nl-NL', {
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam',
  })
}

type BookingInfo = {
  id: string
  treatment_name: string
  customer_name: string
  start_time: string
  status: string
}

function CancelContent() {
  const searchParams = useSearchParams()
  const id = searchParams.get('id')

  const [booking, setBooking]     = useState<BookingInfo | null>(null)
  const [loading, setLoading]     = useState(true)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [cancelled, setCancelled] = useState(false)
  const [cancelling, setCancelling] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) { setFetchError('Geen boeking-ID gevonden in de link.'); setLoading(false); return }
    fetch(`/api/bookings/cancel?id=${id}`)
      .then(r => r.json())
      .then(json => {
        if (json.error) setFetchError(json.error)
        else {
          if (json.booking.status === 'cancelled') setFetchError('Deze afspraak is al geannuleerd.')
          else if (json.booking.status === 'rejected') setFetchError('Deze afspraak is niet bevestigd en kan niet worden geannuleerd.')
          else setBooking(json.booking)
        }
      })
      .catch(() => setFetchError('Kon de boeking niet laden. Probeer het later opnieuw.'))
      .finally(() => setLoading(false))
  }, [id])

  async function handleCancel() {
    if (!id) return
    setCancelling(true)
    setCancelError(null)
    try {
      const res = await fetch('/api/bookings/cancel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      })
      const json = await res.json()
      if (!res.ok) setCancelError(json.error ?? 'Er is iets misgegaan.')
      else setCancelled(true)
    } catch {
      setCancelError('Geen verbinding. Probeer het opnieuw.')
    } finally {
      setCancelling(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col bg-background">
      <header className="sticky top-0 z-50 flex h-14 shrink-0 items-center border-b border-foreground/8 bg-background/95 px-5 backdrop-blur-sm">
        <a href="/" aria-label="Zen Spa – terug naar home">
          <ZenSpaLogo className="h-7 w-auto" />
        </a>
      </header>

      <main className="flex flex-1 items-start justify-center px-5 pt-12 pb-24">
        <div className="w-full max-w-md">

          {loading && (
            <p className="text-[15px] text-foreground/45">Boeking ophalen…</p>
          )}

          {!loading && cancelled && (
            <div className="space-y-4">
              <h1 className="font-heading text-[32px] tracking-tight">Afspraak geannuleerd</h1>
              <p className="text-[15px] text-foreground/55">
                Je afspraak is succesvol geannuleerd. Je ontvangt een bevestiging per e-mail.
              </p>
              <a
                href="/boeken"
                className="mt-2 inline-block rounded-full bg-accent px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-accent/88"
              >
                Nieuwe afspraak maken
              </a>
            </div>
          )}

          {!loading && !cancelled && fetchError && (
            <div className="space-y-4">
              <h1 className="font-heading text-[32px] tracking-tight">Annuleren niet mogelijk</h1>
              <p className="text-[15px] text-foreground/55">{fetchError}</p>
              <a href="/" className="inline-block text-[14px] text-accent underline underline-offset-4">
                Terug naar home
              </a>
            </div>
          )}

          {!loading && !cancelled && !fetchError && booking && (
            <div className="space-y-6">
              <div>
                <h1 className="font-heading text-[32px] tracking-tight">Afspraak annuleren</h1>
                <p className="mt-2 text-[15px] text-foreground/55">
                  Weet je zeker dat je de volgende afspraak wilt annuleren?
                </p>
              </div>

              <div className="rounded-2xl border border-foreground/8 bg-secondary/15 p-5 space-y-3">
                <p className="font-semibold text-foreground text-[16px]">{booking.treatment_name}</p>
                <div className="flex flex-col gap-y-1.5 text-[13px] text-foreground/60">
                  <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
                    <CalendarDays className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{formatDateNL(booking.start_time)}</span>
                  </span>
                  <span className="grid grid-cols-[16px_1fr] items-center gap-x-2">
                    <Clock className="h-3.5 w-3.5 shrink-0" aria-hidden />
                    <span>{formatTimeNL(booking.start_time)}</span>
                  </span>
                </div>
                <p className="text-[13px] text-foreground/40">voor {booking.customer_name}</p>
              </div>

              {cancelError && (
                <p className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-[13px] text-red-600">
                  {cancelError}
                </p>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={handleCancel}
                  disabled={cancelling}
                  className="flex-1 rounded-full bg-foreground py-3.5 text-[14px] font-semibold text-background transition-colors hover:bg-foreground/85 disabled:opacity-40"
                >
                  {cancelling ? 'Annuleren…' : 'Ja, annuleer mijn afspraak'}
                </button>
                <a
                  href="/"
                  className="flex-1 rounded-full border border-foreground/15 py-3.5 text-center text-[14px] font-medium text-foreground/60 transition-colors hover:bg-foreground/4"
                >
                  Nee, terug
                </a>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  )
}

export default function CancelPage() {
  return (
    <Suspense>
      <CancelContent />
    </Suspense>
  )
}
