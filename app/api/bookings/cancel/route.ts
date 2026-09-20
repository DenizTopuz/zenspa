import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'

const TEST_OVERRIDE_EMAIL = process.env.EMAIL_TEST_OVERRIDE ?? null
const FROM_DOMAIN = TEST_OVERRIDE_EMAIL ? 'onboarding@resend.dev' : 'info@zenspa.nl'
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

function esc(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
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

// GET — geeft boekingsinfo terug voor de annuleringspagina
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Ongeldig boeking-ID' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('id, treatment_name, customer_name, start_time, status')
    .eq('id', id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Boeking niet gevonden' }, { status: 404 })
  }

  return NextResponse.json({ booking: data })
}

// POST — annuleert de boeking
export async function POST(req: NextRequest) {
  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ongeldige JSON' }, { status: 400 })
  }

  const { id } = body as { id?: string }
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Ongeldig boeking-ID' }, { status: 400 })
  }

  const supabase = createServiceClient()
  const { data: booking, error: fetchErr } = await supabase
    .from('bookings')
    .select('id, treatment_name, customer_name, customer_email, start_time, status')
    .eq('id', id)
    .single()

  if (fetchErr || !booking) {
    return NextResponse.json({ error: 'Boeking niet gevonden' }, { status: 404 })
  }

  if (!['pending', 'confirmed'].includes(booking.status)) {
    return NextResponse.json({ error: 'Deze boeking kan niet meer worden geannuleerd' }, { status: 409 })
  }

  if (new Date(booking.start_time) < new Date()) {
    return NextResponse.json({ error: 'Een afspraak in het verleden kan niet worden geannuleerd' }, { status: 409 })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateErr } = await (supabase as any)
    .from('bookings')
    .update({ status: 'cancelled' })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: 'Kon de boeking niet annuleren' }, { status: 500 })
  }

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const date = formatDateNL(booking.start_time)
    const time = formatTimeNL(booking.start_time)
    const to = (email: string) => TEST_OVERRIDE_EMAIL ?? email

    await Promise.all([
      resend.emails.send({
        from: `Zen Spa <${FROM_DOMAIN}>`,
        to: [to(booking.customer_email)],
        subject: 'Afspraak geannuleerd – Zen Spa',
        html: `
          <p>Hoi ${esc(booking.customer_name)},</p>
          <p>Je afspraak is geannuleerd:</p>
          <ul>
            <li><strong>Behandeling:</strong> ${esc(booking.treatment_name)}</li>
            <li><strong>Datum:</strong> ${date}</li>
            <li><strong>Tijd:</strong> ${time}</li>
          </ul>
          <p>Wil je toch een afspraak maken? Ga naar <a href="https://zenspa.nl/boeken">zenspa.nl/boeken</a>.</p>
          <p>Met vriendelijke groet,<br/>Zen Spa · House of Beauty</p>
        `,
      }).catch((e: unknown) => console.error('Email error:', e)),
      resend.emails.send({
        from: `Zen Spa Boekingen <${FROM_DOMAIN}>`,
        to: [to('info@zenspa.nl')],
        subject: `Afspraak geannuleerd: ${esc(booking.treatment_name)} – ${esc(booking.customer_name)}`,
        html: `
          <p>De volgende afspraak is door de klant geannuleerd:</p>
          <ul>
            <li><strong>Behandeling:</strong> ${esc(booking.treatment_name)}</li>
            <li><strong>Datum:</strong> ${date}</li>
            <li><strong>Tijd:</strong> ${time}</li>
            <li><strong>Naam:</strong> ${esc(booking.customer_name)}</li>
          </ul>
          <p>Boeking ID: ${id}</p>
        `,
      }).catch((e: unknown) => console.error('Email error:', e)),
    ])
  }

  return NextResponse.json({ ok: true })
}
