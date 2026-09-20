import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Afspraak maken — Zen Spa',
  description: 'Maak eenvoudig online een afspraak bij Zen Spa in Almere Buiten.',
}

export default function BoekenLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
