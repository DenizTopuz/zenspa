import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Clock, ChevronLeft } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { getTreatmentBySlug, getAllTreatments } from '@/lib/behandelingen-data'

export function generateStaticParams() {
  return getAllTreatments().map((t) => ({ slug: t.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getTreatmentBySlug(slug)
  if (!t) return {}
  return {
    title: `${t.name} — Zen Spa`,
    description: t.description,
  }
}

export default async function TreatmentDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const t = getTreatmentBySlug(slug)
  if (!t) notFound()

  return (
    <>
      <SiteNav />
      <main>

        {/* Hero */}
        <section className="pb-20 pt-32 md:pb-28 md:pt-40 lg:pb-36 lg:pt-52">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">

            {/* Back */}
            <Reveal>
              <a
                href="/#pricing"
                className="mb-10 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Terug naar behandelingen
              </a>
            </Reveal>

            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-24">

              {/* Left — text */}
              <div className="flex flex-col gap-8">
                {t.category && (
                  <Reveal>
                    <span className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                      {t.category}
                    </span>
                  </Reveal>
                )}

                <Reveal delay={60}>
                  <h1 className="font-heading text-[52px] leading-[1.05] tracking-tight md:text-[68px] lg:text-[80px]">
                    {t.name}
                  </h1>
                </Reveal>

                <Reveal delay={120}>
                  <p className="max-w-[480px] text-[17px] leading-[1.85] text-muted-foreground">
                    {t.description}
                  </p>
                </Reveal>

                {/* Meta pills */}
                <Reveal delay={160}>
                  <div className="flex flex-wrap gap-3">
                    {t.duration && (
                      <span className="inline-flex items-center gap-2 rounded-full border border-foreground/18 px-5 py-2.5 text-[14px] text-foreground/60">
                        <Clock className="h-4 w-4" aria-hidden />
                        {t.duration}
                      </span>
                    )}
                    <span className="inline-flex items-center rounded-full border border-foreground/18 px-5 py-2.5 font-heading text-[17px] font-semibold text-foreground">
                      {t.price}
                    </span>
                    {t.tag && (
                      <span className="inline-flex items-center rounded-full border border-accent/40 px-5 py-2.5 text-[14px] font-medium text-accent">
                        {t.tag}
                      </span>
                    )}
                  </div>
                </Reveal>

                <Reveal delay={200}>
                  <a
                    href="/#contact"
                    className="inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-10 py-5 text-[16px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20"
                  >
                    Afspraak maken
                  </a>
                </Reveal>
              </div>

              {/* Right — image */}
              <Reveal delay={80}>
                <div className="relative aspect-[3/4] overflow-hidden rounded-3xl">
                  <Image
                    src={t.image ?? '/hero.jpg'}
                    alt={t.name}
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
