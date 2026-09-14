import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { getTreatmentBySlug, getTotalSlotMinutes } from '@/lib/behandelingen-data'
import type { BookingInsert } from '@/lib/supabase/types'

const TEST_OVERRIDE_EMAIL = process.env.EMAIL_TEST_OVERRIDE ?? null

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

async function sendEmails(booking: {
  id: string
  treatment_name: string
  customer_name: string
  customer_email: string
  customer_phone: string
  start_time: string
  notes: string | null
}) {
  if (!process.env.RESEND_API_KEY) return
  const resend = new Resend(process.env.RESEND_API_KEY)
  const date = formatDateNL(booking.start_time)
  const time = formatTimeNL(booking.start_time)
  const to = (email: string) => TEST_OVERRIDE_EMAIL ?? email

  await Promise.all([
    // Bevestiging aan klant
    resend.emails.send({
      from: 'Zen Spa <noreply@zenspa.nl>',
      to: [to(booking.customer_email)],
      subject: 'Je aanvraag is ontvangen – Zen Spa',
      html: `
        <p>Hoi ${booking.customer_name},</p>
        <p>We hebben je aanvraag ontvangen voor:</p>
        <ul>
          <li><strong>Behandeling:</strong> ${booking.treatment_name}</li>
          <li><strong>Datum:</strong> ${date}</li>
          <li><strong>Tijd:</strong> ${time}</li>
        </ul>
        ${booking.notes ? `<p><strong>Opmerking:</strong> ${booking.notes}</p>` : ''}
        <p>Je ontvangt een bevestiging zodra we je aanvraag hebben goedgekeurd.</p>
        <p>Met vriendelijke groet,<br/>Zen Spa · House of Beauty</p>
      `,
    }),
    // Melding aan admin
    resend.emails.send({
      from: 'Zen Spa Boekingen <noreply@zenspa.nl>',
      to: [to('info@zenspa.nl')],
      subject: `Nieuwe aanvraag: ${booking.treatment_name} – ${booking.customer_name}`,
      html: `
        <p><strong>Nieuwe boekingsaanvraag</strong></p>
        <ul>
          <li><strong>Behandeling:</strong> ${booking.treatment_name}</li>
          <li><strong>Datum:</strong> ${date}</li>
          <li><strong>Tijd:</strong> ${time}</li>
          <li><strong>Naam:</strong> ${booking.customer_name}</li>
          <li><strong>E-mail:</strong> ${booking.customer_email}</li>
          <li><strong>Telefoon:</strong> ${booking.customer_phone}</li>
          ${booking.notes ? `<li><strong>Opmerking:</strong> ${booking.notes}</li>` : ''}
        </ul>
        <p>Boeking ID: ${booking.id}</p>
      `,
    }),
  ])
}

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

  const id = (data as { id: string }).id

  // Stuur e-mails (fire-and-forget, fouten loggen maar niet blokkeren)
  sendEmails({
    id,
    treatment_name: treatment.name,
    customer_name: customer_name.trim(),
    customer_email: customer_email.trim().toLowerCase(),
    customer_phone: customer_phone.trim(),
    start_time: startDate.toISOString(),
    notes: notes?.trim() || null,
  }).catch((e) => console.error('Email error:', e))

  return NextResponse.json({ id }, { status: 201 })
}
