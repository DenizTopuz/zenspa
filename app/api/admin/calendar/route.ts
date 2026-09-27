import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { createServiceClient } from '@/lib/supabase/server'

function getCalendarToken(): string {
  const pw = process.env.ADMIN_PASSWORD ?? ''
  return createHmac('sha256', pw).update('zen-spa-calendar-v1').digest('hex')
}

function toIcalDate(iso: string): string {
  return new Date(iso).toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
}

function escapeIcal(s: string): string {
  return s
    .replace(/\\/g, '\\\\')
    .replace(/;/g, '\\;')
    .replace(/,/g, '\\,')
    .replace(/\n/g, '\\n')
}

// Fold long lines per RFC 5545 (max 75 octets)
function fold(line: string): string {
  if (line.length <= 75) return line
  const chunks: string[] = []
  chunks.push(line.slice(0, 75))
  let i = 75
  while (i < line.length) {
    chunks.push(' ' + line.slice(i, i + 74))
    i += 74
  }
  return chunks.join('\r\n')
}

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token || token !== getCalendarToken()) {
    return new NextResponse('Unauthorized', { status: 401 })
  }

  const supabase = createServiceClient()
  const { data: bookings } = await supabase
    .from('bookings')
    .select('*')
    .in('status', ['confirmed', 'pending'])
    .order('start_time', { ascending: true })

  const lines: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//ZenSpa//Afspraken//NL',
    'X-WR-CALNAME:ZenSpa Afspraken',
    'X-WR-CALDESC:Bevestigde en wachtende afspraken bij Zen Spa',
    'X-WR-TIMEZONE:Europe/Amsterdam',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'REFRESH-INTERVAL;VALUE=DURATION:PT1H',
    'X-PUBLISHED-TTL:PT1H',
  ]

  for (const b of bookings ?? []) {
    const now = new Date().toISOString().replace(/[-:]/g, '').slice(0, 15) + 'Z'
    const summary = `${b.treatment_name} — ${b.customer_name}`
    const descParts = [b.customer_phone, b.customer_email, b.notes].filter(Boolean)

    lines.push('BEGIN:VEVENT')
    lines.push(`UID:booking-${b.id}@zenspa.nl`)
    lines.push(`DTSTAMP:${now}`)
    lines.push(`DTSTART:${toIcalDate(b.start_time)}`)
    lines.push(`DTEND:${toIcalDate(b.end_time)}`)
    lines.push(fold(`SUMMARY:${escapeIcal(summary)}`))
    if (descParts.length > 0) {
      lines.push(fold(`DESCRIPTION:${escapeIcal(descParts.join('\n'))}`))
    }
    lines.push('END:VEVENT')
  }

  lines.push('END:VCALENDAR')

  return new NextResponse(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'attachment; filename="zenspa-afspraken.ics"',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  })
}
