import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServiceClient } from '@/lib/supabase/server'

const TEST_OVERRIDE_EMAIL = process.env.EMAIL_TEST_OVERRIDE ?? null
const FROM_DOMAIN = TEST_OVERRIDE_EMAIL ? 'onboarding@resend.dev' : 'noreply@zenspa.nl'

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

export async function GET(req: NextRequest) {
  // Vercel Cron stuurt automatisch Authorization: Bearer <CRON_SECRET>
  const authHeader = req.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (!process.env.RESEND_API_KEY) {
    return NextResponse.json({ skipped: 'geen RESEND_API_KEY' })
  }

  // Bepaal "morgen" in Amsterdam-tijd
  const todayAms = new Date().toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam' })
  const [y, m, d] = todayAms.split('-').map(Number)
  const next = new Date(y, m - 1, d + 1)
  const pad = (n: number) => String(n).padStart(2, '0')
  const tomorrowStr = `${next.getFullYear()}-${pad(next.getMonth() + 1)}-${pad(next.getDate())}`

  // Ruim zoekvenster rondom "morgen" (3h buffer voor DST)
  const windowStart = new Date(`${tomorrowStr}T00:00:00Z`)
  windowStart.setUTCHours(windowStart.getUTCHours() - 3)
  const windowEnd = new Date(`${tomorrowStr}T23:59:59Z`)
  windowEnd.setUTCHours(windowEnd.getUTCHours() + 3)

  const supabase = createServiceClient()
  const { data: bookings, error } = await supabase
    .from('bookings')
    .select('id, treatment_name, customer_name, customer_email, start_time')
    .eq('status', 'confirmed')
    .gte('start_time', windowStart.toISOString())
    .lte('start_time', windowEnd.toISOString())

  if (error) {
    console.error('Reminder cron DB error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  // Filter op echte "morgen" in Amsterdam (buffer kan rand-gevallen toevoegen)
  const tomorrow = (bookings ?? []).filter(b =>
    new Date(b.start_time).toLocaleDateString('en-CA', { timeZone: 'Europe/Amsterdam' }) === tomorrowStr
  )

  if (!tomorrow.length) return NextResponse.json({ sent: 0 })

  const resend = new Resend(process.env.RESEND_API_KEY)
  let sent = 0

  for (const b of tomorrow) {
    try {
      await resend.emails.send({
        from: `Zen Spa <${FROM_DOMAIN}>`,
        to: [TEST_OVERRIDE_EMAIL ?? b.customer_email],
        subject: 'Herinnering: morgen jouw afspraak bij Zen Spa',
        html: `
          <p>Hoi ${esc(b.customer_name)},</p>
          <p>Een vriendelijke herinnering: morgen heb je een afspraak bij Zen Spa!</p>
          <ul>
            <li><strong>Behandeling:</strong> ${esc(b.treatment_name)}</li>
            <li><strong>Datum:</strong> ${formatDateNL(b.start_time)}</li>
            <li><strong>Tijd:</strong> ${formatTimeNL(b.start_time)}</li>
          </ul>
          <p><strong>Adres:</strong> Kretastraat 77, 1316 VT Almere</p>
          <p>Tot morgen!<br/>Zen Spa · House of Beauty</p>
        `,
      })
      sent++
    } catch (e) {
      console.error(`Herinnering mislukt voor boeking ${b.id}:`, e)
    }
  }

  return NextResponse.json({ sent })
}
