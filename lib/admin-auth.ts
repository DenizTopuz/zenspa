import { createHmac } from 'crypto'
import { NextRequest } from 'next/server'

// Genereert een sessietoken op basis van het wachtwoord — het wachtwoord zelf
// wordt nooit in de cookie opgeslagen, alleen deze afgeleide hash.
export function getSessionToken(): string {
  const pw = process.env.ADMIN_PASSWORD ?? ''
  return createHmac('sha256', pw).update('zen-spa-admin-v1').digest('hex')
}

export function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get('admin_session')?.value
  return !!cookie && cookie === getSessionToken()
}
