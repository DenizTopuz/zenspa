import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'
import { isAdmin } from '@/lib/admin-auth'

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

const VALID_STATUSES = ['pending', 'confirmed', 'rejected', 'cancelled'] as const
type BookingStatus = typeof VALID_STATUSES[number]

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabase = createServiceClient()
  const { data, error } = await supabase
    .from('bookings')
    .select('*')
    .order('start_time', { ascending: true })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ bookings: data })
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ongeldige JSON' }, { status: 400 })
  }

  const { id, status, admin_note } = body as Record<string, string>

  if (!id || !status) {
    return NextResponse.json({ error: 'id en status zijn verplicht' }, { status: 400 })
  }

  if (!VALID_STATUSES.includes(status as BookingStatus)) {
    return NextResponse.json({ error: 'Ongeldige status' }, { status: 400 })
  }

  const supabase = createServiceClient()

  // Haal boeking op vóór de update, zodat we de klantgegevens hebben voor de e-mail
  const { data: booking, error: fetchErr } = await supabase
    .from('bookings')
    .select('id, treatment_name, customer_name, customer_email, start_time, status')
    .eq('id', id)
    .single()

  if (fetchErr || !booking) {
    return NextResponse.json({ error: 'Boeking niet gevonden' }, { status: 404 })
  }

  // Voorkom onnodige statuswijzigingen
  if (booking.status === status) {
    return NextResponse.json({ ok: true })
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: updateErr } = await (supabase as any)
    .from('bookings')
    .update({ status, admin_note: admin_note?.trim() ?? null })
    .eq('id', id)

  if (updateErr) {
    return NextResponse.json({ error: updateErr.message }, { status: 500 })
  }

  // Stuur e-mail naar klant bij bevestiging of afwijzing
  if (process.env.RESEND_API_KEY && (status === 'confirmed' || status === 'rejected')) {
    const resend = new Resend(process.env.RESEND_API_KEY)
    const to = TEST_OVERRIDE_EMAIL ?? booking.customer_email
    const date = formatDateNL(booking.start_time)
    const time = formatTimeNL(booking.start_time)
    const cancelLink = `${BASE_URL}/annuleren?id=${booking.id}`

    if (status === 'confirmed') {
      resend.emails.send({
        from: `Zen Spa <${FROM_DOMAIN}>`,
        to: [to],
        subject: 'Je afspraak is bevestigd – Zen Spa',
        html: `
          <p>Hoi ${esc(booking.customer_name)},</p>
          <p>Goed nieuws! Je afspraak bij Zen Spa is bevestigd:</p>
          <ul>
            <li><strong>Behandeling:</strong> ${esc(booking.treatment_name)}</li>
            <li><strong>Datum:</strong> ${date}</li>
            <li><strong>Tijd:</strong> ${time}</li>
            <li><strong>Adres:</strong> Kretastraat 77, 1316 VT Almere</li>
          </ul>
          <p>Wij zien je graag! Mocht je de afspraak toch willen annuleren, dan kan dat via <a href="${cancelLink}">deze link</a>.</p>
          <p>Met vriendelijke groet,<br/>Zen Spa · House of Beauty</p>
        `,
      }).catch((e: unknown) => console.error('Bevestigingsmail mislukt:', e))
    }

    if (status === 'rejected') {
      resend.emails.send({
        from: `Zen Spa <${FROM_DOMAIN}>`,
        to: [to],
        subject: 'Update over je aanvraag – Zen Spa',
        html: `
          <p>Hoi ${esc(booking.customer_name)},</p>
          <p>Helaas kunnen we je aanvraag voor de onderstaande afspraak op dit moment niet bevestigen:</p>
          <ul>
            <li><strong>Behandeling:</strong> ${esc(booking.treatment_name)}</li>
            <li><strong>Datum:</strong> ${date}</li>
            <li><strong>Tijd:</strong> ${time}</li>
          </ul>
          ${admin_note ? `<p><strong>Toelichting:</strong> ${esc(admin_note)}</p>` : ''}
          <p>Wil je toch een afspraak maken? Kies een ander moment via <a href="${BASE_URL}/boeken">zenspa.nl/boeken</a> of neem contact op via <a href="tel:0653207729">06 53 20 77 29</a>.</p>
          <p>Met vriendelijke groet,<br/>Zen Spa · House of Beauty</p>
        `,
      }).catch((e: unknown) => console.error('Afwijzingsmail mislukt:', e))
    }
  }

  return NextResponse.json({ ok: true })
}
