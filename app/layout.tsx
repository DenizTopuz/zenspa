import { Geist, Geist_Mono, Nunito_Sans, EB_Garamond } from "next/font/google"
import type { Viewport } from "next"

import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { SmoothScroll } from "@/components/smooth-scroll"
import { MobileBottomNav } from "@/components/mobile-bottom-nav"
import { cn } from "@/lib/utils"

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
  themeColor: '#ffffff',
}

const ebGaramondHeading = EB_Garamond({subsets:['latin'],variable:'--font-heading'});

const nunitoSans = Nunito_Sans({subsets:['latin'],variable:'--font-sans'})

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const localBusinessSchema = {
  '@context': 'https://schema.org',
  '@type': 'BeautySalon',
  name: 'Zen Spa',
  alternateName: 'Zen Spa Almere Buiten',
  description: 'Gecertificeerde schoonheidssalon en huidtherapiepraktijk in Almere Buiten. Specialisaties: gezichtsbehandelingen, massages, permanente make-up (PMU), microneedling en ontharen.',
  url: 'https://zenspa.nl',
  telephone: '+31653207729',
  email: 'info@zenspa.nl',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'Kretastraat 77',
    addressLocality: 'Almere',
    addressRegion: 'Flevoland',
    postalCode: '1316 VT',
    addressCountry: 'NL',
  },
  openingHoursSpecification: [
    { '@type': 'OpeningHoursSpecification', dayOfWeek: ['Monday', 'Wednesday', 'Friday'], opens: '10:00', closes: '18:00' },
  ],
  priceRange: '€€',
  currenciesAccepted: 'EUR',
  image: 'https://zenspa.nl/hero.jpg',
  founder: {
    '@type': 'Person',
    name: 'Çigdem',
    jobTitle: 'Gecertificeerd huidtherapeut & PMU-specialist',
  },
  sameAs: [
    'https://www.instagram.com/cigdemzenspa',
    'https://www.facebook.com/zenspa.almerebuiten',
  ],
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '5.0',
    reviewCount: '47',
    bestRating: '5',
    worstRating: '1',
  },
  hasMap: 'https://maps.google.com/?q=Kretastraat+77,+1316+VT+Almere',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="nl"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", nunitoSans.variable, ebGaramondHeading.variable)}
    >
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
        />
        <ThemeProvider>
          <SmoothScroll />
          {children}
          <MobileBottomNav />
        </ThemeProvider>
      </body>
    </html>
  )
}
