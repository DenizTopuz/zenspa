import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { getTreatmentBySlug, getTotalSlotMinutes } from '@/lib/behandelingen-data'
import type { BookingInsert } from '@/lib/supabase/types'

const TEST_OVERRIDE_EMAIL = process.env.EMAIL_TEST_OVERRIDE ?? null
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL ?? 'https://zenspa.nl'
const FROM_DOMAIN = TEST_OVERRIDE_EMAIL ? 'onboarding@resend.dev' : 'noreply@zenspa.nl'

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

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
  const cancelLink = `${BASE_URL}/annuleren?id=${booking.id}`
  const to = (email: string) => TEST_OVERRIDE_EMAIL ?? email

  await Promise.all([
    resend.emails.send({
      from: `Zen Spa <${FROM_DOMAIN}>`,
      to: [to(booking.customer_email)],
      subject: 'Je aanvraag is ontvangen – Zen Spa',
      html: `
        <p>Hoi ${esc(booking.customer_name)},</p>
        <p>We hebben je aanvraag ontvangen voor:</p>
        <ul>
          <li><strong>Behandeling:</strong> ${esc(booking.treatment_name)}</li>
          <li><strong>Datum:</strong> ${date}</li>
          <li><strong>Tijd:</strong> ${time}</li>
        </ul>
        ${booking.notes ? `<p><strong>Opmerking:</strong> ${esc(booking.notes)}</p>` : ''}
        <p>Je ontvangt een bevestiging zodra we je aanvraag hebben goedgekeurd.</p>
        <p>Wil je de afspraak annuleren? Dat kan via <a href="${cancelLink}">deze link</a>.</p>
        <p>Met vriendelijke groet,<br/>Zen Spa · House of Beauty</p>
      `,
    }),
    resend.emails.send({
      from: `Zen Spa Boekingen <${FROM_DOMAIN}>`,
      to: [to('info@zenspa.nl')],
      subject: `Nieuwe aanvraag: ${esc(booking.treatment_name)} – ${esc(booking.customer_name)}`,
      html: `
        <p><strong>Nieuwe boekingsaanvraag</strong></p>
        <ul>
          <li><strong>Behandeling:</strong> ${esc(booking.treatment_name)}</li>
          <li><strong>Datum:</strong> ${date}</li>
          <li><strong>Tijd:</strong> ${time}</li>
          <li><strong>Naam:</strong> ${esc(booking.customer_name)}</li>
          <li><strong>E-mail:</strong> ${esc(booking.customer_email)}</li>
          <li><strong>Telefoon:</strong> ${esc(booking.customer_phone)}</li>
          ${booking.notes ? `<li><strong>Opmerking:</strong> ${esc(booking.notes)}</li>` : ''}
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

  if (customer_name.length > 100) {
    return NextResponse.json({ error: 'Naam mag maximaal 100 tekens bevatten' }, { status: 400 })
  }
  if (customer_phone.length > 30) {
    return NextResponse.json({ error: 'Telefoonnummer is te lang' }, { status: 400 })
  }
  if (typeof notes === 'string' && notes.length > 500) {
    return NextResponse.json({ error: 'Opmerking mag maximaal 500 tekens bevatten' }, { status: 400 })
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(customer_email)) {
    return NextResponse.json({ error: 'Ongeldig e-mailadres' }, { status: 400 })
  }

  if (customer_phone.replace(/\D/g, '').length < 9) {
    return NextResponse.json({ error: 'Ongeldig telefoonnummer (minimaal 9 cijfers)' }, { status: 400 })
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
  const normalizedEmail = customer_email.trim().toLowerCase()

  // Rate limit: max 3 boekingen per e-mailadres per 24 uur (elke status)
  const since24h = new Date(Date.now() - 24 * 60 * 60_000).toISOString()
  const { count: recentCount } = await supabase
    .from('bookings')
    .select('id', { count: 'exact', head: true })
    .eq('customer_email', normalizedEmail)
    .gte('created_at', since24h)

  if ((recentCount ?? 0) >= 3) {
    return NextResponse.json(
      { error: 'Te veel aanvragen. Probeer het morgen opnieuw of neem contact met ons op.' },
      { status: 429 },
    )
  }

  // Dubbele boeking voorkomen: zelfde e-mail met openstaande aanvraag
  const { data: existing } = await supabase
    .from('bookings')
    .select('id')
    .eq('customer_email', normalizedEmail)
    .in('status', ['pending', 'confirmed'])
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json(
      { error: 'Je hebt al een openstaande aanvraag. Neem contact op als je iets wilt wijzigen.' },
      { status: 409 },
    )
  }

  // Slot-conflictcheck: tijdstip nog beschikbaar?
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
    customer_email: normalizedEmail,
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

  sendEmails({
    id,
    treatment_name: treatment.name,
    customer_name: customer_name.trim(),
    customer_email: normalizedEmail,
    customer_phone: customer_phone.trim(),
    start_time: startDate.toISOString(),
    notes: notes?.trim() || null,
  }).catch((e) => console.error('Email error:', e))

  return NextResponse.json({ id }, { status: 201 })
}
