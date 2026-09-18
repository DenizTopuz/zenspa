'use client'

import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import type { BlockedTimeRow } from '@/lib/supabase/types'

function formatDT(iso: string) {
  return new Date(iso).toLocaleString('nl-NL', {
    weekday: 'short', day: 'numeric', month: 'short',
    hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Amsterdam',
  })
}

// Convert local datetime-local input (YYYY-MM-DDTHH:mm) to Amsterdam ISO
function toAmsterdamISO(local: string) {
  // datetime-local gives us the user's local time; we treat it as Amsterdam
  const [date, time] = local.split('T')
  const [h, m] = time.split(':').map(Number)
  // Build a Date in Amsterdam timezone
  const probe = new Date(`${date}T${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:00`)
  return probe.toISOString()
}

export default function AdminBlokkeren() {
  const router = useRouter()
  const [blocked, setBlocked] = useState<BlockedTimeRow[]>([])
  const [loading, setLoading] = useState(true)
  const [start, setStart] = useState('')
  const [end, setEnd] = useState('')
  const [reason, setReason] = useState('')
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  const load = useCallback(async () => {
    const res = await fetch('/api/admin/blocked')
    if (res.status === 401) { router.push('/admin'); return }
    const { blocked } = await res.json()
    setBlocked(blocked ?? [])
    setLoading(false)
  }, [router])

  useEffect(() => { load() }, [load])

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault()
    if (!start || !end) return
    setSaving(true)
    await fetch('/api/admin/blocked', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        start_time: toAmsterdamISO(start),
        end_time: toAmsterdamISO(end),
        reason: reason || null,
      }),
    })
    setStart(''); setEnd(''); setReason('')
    await load()
    setSaving(false)
  }

  async function handleDelete(id: string) {
    setDeleting(id)
    await fetch('/api/admin/blocked', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await load()
    setDeleting(null)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 border-b border-foreground/8 bg-white px-4 py-4 md:px-8">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <h1 className="text-lg font-bold text-foreground">Tijdsloten blokkeren</h1>
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 md:px-8 space-y-6">
        {/* Breadcrumb */}
        <a href="/admin/boekingen" className="inline-flex items-center gap-1 text-base font-medium text-foreground/50 hover:text-foreground transition-colors">
          <ChevronLeft className="h-4 w-4" aria-hidden />
          Boekingen
        </a>

        {/* Formulier */}
        <div className="rounded-2xl border border-foreground/8 bg-white p-5 shadow-sm">
          <h2 className="mb-4 font-semibold text-foreground">Periode blokkeren</h2>
          <form onSubmit={handleAdd} className="space-y-3">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground/60">Van</label>
                <input
                  type="datetime-local"
                  value={start}
                  onChange={e => setStart(e.target.value)}
                  required
                  className="w-full rounded-xl border border-foreground/12 bg-secondary/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-foreground/60">Tot</label>
                <input
                  type="datetime-local"
                  value={end}
                  onChange={e => setEnd(e.target.value)}
                  required
                  className="w-full rounded-xl border border-foreground/12 bg-secondary/10 px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30"
                />
              </div>
            </div>
            <input
              type="text"
              value={reason}
              onChange={e => setReason(e.target.value)}
              placeholder="Reden (optioneel) — bijv. vakantie, cursus"
              className="w-full rounded-xl border border-foreground/12 bg-secondary/10 px-3 py-2 text-sm text-foreground placeholder:text-foreground/35 focus:outline-none focus:ring-2 focus:ring-accent/30"
            />
            <button
              type="submit"
              disabled={saving || !start || !end}
              className="rounded-full bg-accent px-6 py-2 text-sm font-medium text-white hover:bg-accent/85 disabled:opacity-50"
            >
              {saving ? 'Opslaan…' : 'Blokkeren'}
            </button>
          </form>
        </div>

        {/* Lijst geblokkeerde periodes */}
        <div>
          <h2 className="mb-3 font-semibold text-foreground">Geblokkeerde periodes</h2>
          {loading ? (
            <p className="text-sm text-foreground/40">Laden…</p>
          ) : blocked.length === 0 ? (
            <p className="text-sm text-foreground/40">Geen geblokkeerde periodes.</p>
          ) : (
            <div className="space-y-2">
              {blocked.map(b => (
                <div key={b.id} className="flex items-center justify-between rounded-xl border border-foreground/8 bg-white px-4 py-3 shadow-sm">
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      {formatDT(b.start_time)} — {formatDT(b.end_time)}
                    </p>
                    {b.reason && <p className="text-xs text-foreground/50">{b.reason}</p>}
                  </div>
                  <button
                    onClick={() => handleDelete(b.id)}
                    disabled={deleting === b.id}
                    className="ml-4 shrink-0 rounded-full border border-red-200 px-3 py-1 text-xs text-red-500 hover:bg-red-50 disabled:opacity-50"
                  >
                    {deleting === b.id ? '…' : 'Verwijderen'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
