import type { Metadata } from 'next'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { BookingCTA } from '@/components/booking-cta'
import { Reveal } from '@/components/reveal'
import { BehandelingenHero } from '@/components/behandelingen-hero'
import { ParfumCollection } from '@/components/parfum-collection'
import { headers } from 'next/headers'
import { PARFUMS, image } from '@/lib/parfums-data'

const BASE_META = {
  title: 'Parfums — Yodeyma damesgeuren | Zen Spa Almere Buiten',
  description:
    'Ontdek de Yodeyma-collectie bij Zen Spa: Eau de Parfum geïnspireerd op de grootste geuren. Bekijk topnoten, hartnoten en basisnoten van elke geur.',
}

type Props = { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }

const slugOf = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v)

/** Een gedeelde link (?geur=…) krijgt de titel en foto van die geur, zodat WhatsApp een nette preview toont */
export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const slug = slugOf((await searchParams).geur)
  const p = PARFUMS.find((x) => x.slug === slug)
  if (!p) return BASE_META
  const h = await headers()
  const host = h.get('x-forwarded-host') ?? h.get('host')
  const proto = h.get('x-forwarded-proto') ?? (host?.startsWith('localhost') ? 'http' : 'https')
  const title = `${p.name} — Yodeyma | Zen Spa Almere Buiten`
  const description = `Eau de Parfum geïnspireerd op ${p.inspired} van ${p.house}. Bekijk de geurnoten bij Zen Spa.`
  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      images: host ? [{ url: `${proto}://${host}${image(p)}`, width: 800, height: 800, alt: `Yodeyma ${p.name}` }] : undefined,
    },
  }
}

export default async function ParfumsPage({ searchParams }: Props) {
  const initialSlug = slugOf((await searchParams).geur)
  return (
    <>
      <SiteNav />
      <main id="main-content" tabIndex={-1}>
        <BehandelingenHero
          eyebrow="Yodeyma Paris"
          title="Parfumcollectie"
          subtitle="Luxe geuren, geïnspireerd op de grootste namen. Ontdek jouw handtekeningparfum."
          label="Parfumcollectie"
        />

        <div className="relative z-10 -mt-20 rounded-t-[40px] bg-card md:-mt-28 md:rounded-t-[112px]">
          <section className="pt-8 pb-16 md:pt-12 md:pb-28" aria-labelledby="parfums-heading">
            <div className="mx-auto max-w-[1840px] px-5 md:px-6">
              <Reveal className="mb-7 flex flex-col items-center gap-2 text-center md:mb-9">
                <h2
                  id="parfums-heading"
                  className="font-heading text-[36px] leading-[1.05] tracking-tight md:text-[48px]"
                >
                  {PARFUMS.length} geuren voor haar
                </h2>
                <p className="max-w-[520px] text-[16px] leading-[1.7] text-muted-foreground">
                  Dezelfde geurnoten als de grote namen. Klik op een geur voor de volledige geurpiramide.
                </p>
              </Reveal>

              <ParfumCollection initialSlug={initialSlug} />

              <p className="mx-auto mt-16 max-w-[640px] text-center text-[13px] leading-relaxed text-muted-foreground">
                Yodeyma-parfums zijn eigen geuren die geïnspireerd zijn op bestaande parfums. Genoemde merken en
                parfumnamen zijn eigendom van hun respectievelijke eigenaren; Zen Spa en Yodeyma zijn hier niet aan
                verbonden.
              </p>
            </div>
          </section>
        </div>

        <BookingCTA underFooter />
      </main>
      <SiteFooter overlap />
    </>
  )
}
