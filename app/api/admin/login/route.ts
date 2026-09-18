import { NextRequest, NextResponse } from 'next/server'
import { getSessionToken } from '@/lib/admin-auth'

// Simpele in-memory brute-force rem: max 10 pogingen per IP per 15 min.
// Serverless-instanties delen dit geheugen niet, maar het vertraagt geautomatiseerde
// aanvallen voldoende voor een kleine salon-site.
const attempts = new Map<string, { count: number; resetAt: number }>()

function getClientIp(req: NextRequest): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('x-real-ip') ??
    'unknown'
  )
}

export async function POST(req: NextRequest) {
  const ip = getClientIp(req)
  const now = Date.now()
  const window = 15 * 60 * 1000

  const entry = attempts.get(ip)
  if (entry && now < entry.resetAt) {
    if (entry.count >= 10) {
      await new Promise(r => setTimeout(r, 3000))
      return NextResponse.json({ error: 'Te veel pogingen. Wacht 15 minuten.' }, { status: 429 })
    }
  } else {
    attempts.set(ip, { count: 0, resetAt: now + window })
  }

  let body: unknown
  try { body = await req.json() } catch {
    return NextResponse.json({ error: 'Ongeldige JSON' }, { status: 400 })
  }

  const { password } = body as { password?: string }
  const adminPassword = process.env.ADMIN_PASSWORD

  if (!adminPassword || !password || password !== adminPassword) {
    const rec = attempts.get(ip)!
    rec.count++
    // Kunstmatige vertraging bij fout wachtwoord
    await new Promise(r => setTimeout(r, 1200))
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Succesvol: reset teller
  attempts.delete(ip)

  const res = NextResponse.json({ ok: true })
  res.cookies.set('admin_session', getSessionToken(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7, // 7 dagen
    secure: process.env.NODE_ENV === 'production',
  })
  return res
}
