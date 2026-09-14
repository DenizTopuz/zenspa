'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import type { BookingRow, BookingStatus } from '@/lib/supabase/types'

const STATUS_LABEL: Record<BookingStatus, string> = {
  pending: 'In afwachting',
  confirmed: 'Goedgekeurd',
  rejected: 'Afgewezen',
  cancelled: 'Geannuleerd',
}
const STATUS_COLOR: Record<BookingStatus, string> = {
  pending: 'bg-amber-100 text-amber-800',
  confirmed: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-700',
  cancelled: 'bg-gray-100 text-gray-600',
}

function formatDT(iso: string) {
  return new Date(iso).toLocaleString('nl-NL', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam',
  })
}

export default function AdminBoekingen() {
  const router = useRouter()
  const [bookings, setBookings] = useState<BookingRow[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<BookingStatus | 'all'>('pending')
  const [updating, setUpdating] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/bookings')
    if (res.status === 401) { router.push('/admin'); return }
    const { bookings } = await res.json()
    setBookings(bookings ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  async function updateStatus(id: string, status: BookingStatus) {
    setUpdating(id)
    await fetch('/api/admin/bookings', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, status }),
    })
    await load()
    setUpdating(null)
  }

  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin')
  }

  const shown = filter === 'all' ? bookings : bookings.filter(b => b.status === filter)
  const counts = {
    all: bookings.length,
    pending: bookings.filter(b => b.status === 'pending').length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    rejected: bookings.filter(b => b.status === 'rejected').length,
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-foreground/8 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <div>
            <h1 className="text-lg font-bold text-foreground">Boekingen</h1>
            <p className="text-xs text-foreground/40">Zen Spa Beheer</p>
          </div>
          <div className="flex items-center gap-3">
            <a href="/admin/blokkeren" className="rounded-full border border-foreground/15 px-4 py-1.5 text-sm text-foreground/70 hover:bg-secondary/30">
              Blokkeren
            </a>
            <button onClick={logout} className="text-sm text-foreground/40 hover:text-foreground">
              Uitloggen
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:px-8">
        {/* Filter tabs */}
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {(['pending', 'confirmed', 'rejected', 'all'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                filter === f
                  ? 'bg-accent text-white'
                  : 'border border-foreground/12 text-foreground/60 hover:bg-secondary/30'
              }`}
            >
              {f === 'all' ? 'Alles' : STATUS_LABEL[f]} ({counts[f]})
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-center text-foreground/40 py-16">Laden…</p>
        ) : shown.length === 0 ? (
          <p className="text-center text-foreground/40 py-16">Geen boekingen gevonden.</p>
        ) : (
          <div className="space-y-3">
            {shown.map(b => (
              <div key={b.id} className="rounded-2xl border border-foreground/8 bg-white p-4 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <p className="font-semibold text-foreground">{b.treatment_name}</p>
                    <p className="mt-0.5 text-sm text-foreground/55">{formatDT(b.start_time)}</p>
                  </div>
                  <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLOR[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-1 gap-1 text-sm text-foreground/70 sm:grid-cols-3">
                  <span><strong>Naam:</strong> {b.customer_name}</span>
                  <span><strong>E-mail:</strong> {b.customer_email}</span>
                  <span><strong>Tel:</strong> {b.customer_phone}</span>
                </div>
                {b.notes && (
                  <p className="mt-2 text-sm text-foreground/55 italic">{b.notes}</p>
                )}
                {b.status === 'pending' && (
                  <div className="mt-3 flex gap-2">
                    <button
                      onClick={() => updateStatus(b.id, 'confirmed')}
                      disabled={updating === b.id}
                      className="rounded-full bg-green-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-green-700 disabled:opacity-50"
                    >
                      Goedkeuren
                    </button>
                    <button
                      onClick={() => updateStatus(b.id, 'rejected')}
                      disabled={updating === b.id}
                      className="rounded-full border border-red-200 px-4 py-1.5 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
                    >
                      Afwijzen
                    </button>
                  </div>
                )}
                {b.status === 'confirmed' && (
                  <div className="mt-3">
                    <button
                      onClick={() => updateStatus(b.id, 'cancelled')}
                      disabled={updating === b.id}
                      className="rounded-full border border-foreground/15 px-4 py-1.5 text-sm text-foreground/55 hover:bg-secondary/30 disabled:opacity-50"
                    >
                      Annuleren
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
