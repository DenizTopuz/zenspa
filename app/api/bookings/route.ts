import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'
import { getTreatmentBySlug, getTotalSlotMinutes } from '@/lib/behandelingen-data'
import type { BookingInsert } from '@/lib/supabase/types'

export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ongeldige JSON' }, { status: 400 })
  }

  const {
    treatment_slug,
    customer_name,
    customer_email,
    customer_phone,
    start_time,
    notes,
  } = body as Record<string, string>

  // Basic validation
  if (!treatment_slug || !customer_name || !customer_email || !customer_phone || !start_time) {
    return NextResponse.json({ error: 'Verplichte velden ontbreken' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
  }

  const treatment = getTreatmentBySlug(treatment_slug)
  if (!treatment?.bookable) {
    return NextResponse.json({ error: 'Behandeling niet gevonden' }, { status: 404 })
  }

  const startDate = new Date(start_time)
  if (isNaN(startDate.getTime())) {
    return NextResponse.json({ error: 'Ongeldige start_time' }, { status: 400 })
  }

  const totalMin = getTotalSlotMinutes(treatment)
  const endDate = new Date(startDate.getTime() + totalMin * 60_000)

  const supabase = createServiceClient()

  // Race-condition check: verify slot is still free
  const { data: conflicts } = await supabase
    .from('bookings')
    .select('id')
    .lt('start_time', endDate.toISOString())
    .gt('end_time', startDate.toISOString())
    .in('status', ['pending', 'confirmed'])
    .limit(1)

  if (conflicts && conflicts.length > 0) {
    return NextResponse.json(
      { error: 'Dit tijdstip is helaas niet meer beschikbaar. Kies een ander tijdstip.' },
      { status: 409 },
    )
  }

  const row: BookingInsert = {
    treatment_slug,
    treatment_name: treatment.name,
    customer_name:  customer_name.trim(),
    customer_email: customer_email.trim().toLowerCase(),
    customer_phone: customer_phone.trim(),
    start_time: startDate.toISOString(),
    end_time:   endDate.toISOString(),
    status: 'pending',
    notes: notes?.trim() || null,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { data, error } = await (supabase as any).from('bookings').insert(row).select('id').single()

  if (error) {
    console.error('Supabase insert error:', error)
    return NextResponse.json({ error: 'Kon de boeking niet opslaan' }, { status: 500 })
  }

  return NextResponse.json({ id: (data as { id: string }).id }, { status: 201 })
}
