import { createHmac } from 'crypto'
import { NextRequest, NextResponse } from 'next/server'
import { isAdmin } from '@/lib/admin-auth'

function getCalendarToken(): string {
  const pw = process.env.ADMIN_PASSWORD ?? ''
  return createHmac('sha256', pw).update('zen-spa-calendar-v1').digest('hex')
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const token  = getCalendarToken()
  // Use the request's own origin so it works on every deployment (local, staging, prod)
  const origin  = req.nextUrl.origin
  const path    = `/api/admin/calendar?token=${token}`
  const webcal  = `webcal://${origin.replace(/^https?:\/\//, '')}${path}`
  const https   = `${origin}${path}`

  return NextResponse.json({ webcal, https })
}
