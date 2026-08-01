import { notFound } from 'next/navigation'
import Image from 'next/image'
import { ArrowRight, Clock, BedDouble, ChevronLeft } from 'lucide-react'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'
import { Reveal } from '@/components/reveal'
import { getServiceBySlug, serviceCategories } from '@/lib/services-data'

export function generateStaticParams() {
  return serviceCategories.map((s) => ({ slug: s.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) return {}
  return {
    title: `${service.title} — Zen Spa`,
    description: service.description,
  }
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = getServiceBySlug(slug)
  if (!service) notFound()

  return (
    <>
      <SiteNav />
      <main>

        {/* ── Hero ───────────────────────────────────────────────── */}
        <section className="pt-32 pb-20 md:pt-40 md:pb-28 lg:pt-48 lg:pb-36">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">

            {/* Back link */}
            <Reveal>
              <a
                href="/#services"
                className="mb-10 inline-flex items-center gap-2 text-[13px] text-muted-foreground transition-colors hover:text-foreground"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden />
                Terug naar behandelingen
              </a>
            </Reveal>

            <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">

              {/* Left — heading + description + CTAs */}
              <div className="flex flex-col gap-8">
                <Reveal>
                  <span className="text-[11px] font-semibold tracking-[0.2em] text-accent uppercase">
                    Zen Spa behandeling
                  </span>
                </Reveal>

                <Reveal delay={60}>
                  <h1 className="font-heading text-[52px] leading-[1.05] tracking-tight md:text-[68px] lg:text-[80px]">
                    {service.title}
                  </h1>
                </Reveal>

                <Reveal delay={120}>
                  <p className="max-w-[480px] text-[16px] leading-[1.85] text-muted-foreground">
                    {service.description}
                  </p>
                </Reveal>

                <Reveal delay={180}>
                  <div className="flex flex-wrap items-center gap-3">
                    <a
                      href="/#contact"
                      className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-[14px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20"
                    >
                      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white/20 text-[10px]">
                        ↗
                      </span>
                      Afspraak maken
                    </a>
                    <a
                      href="/#pricing"
                      className="inline-flex items-center gap-2 text-[14px] font-medium text-foreground underline underline-offset-4 decoration-border transition-colors hover:text-accent hover:decoration-accent"
                    >
                      Alle prijzen ↗
                    </a>
                  </div>
                </Reveal>
              </div>

              {/* Right — image */}
              <Reveal delay={80}>
                <div className="relative aspect-[4/3] overflow-hidden rounded-3xl lg:aspect-[3/2]">
                  <Image
                    src={service.image}
                    alt={service.title}
                    fill
                    priority
                    className={`object-cover ${service.imgPos}`}
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </Reveal>
            </div>
          </div>
        </section>

        {/* ── Treatment list ──────────────────────────────────────── */}
        <section className="pb-32 md:pb-44 lg:pb-56">
          <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">

            <Reveal className="mb-10 border-b border-border/40 pb-6">
              <p className="text-[12px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
                {service.treatments.length} behandelingen beschikbaar
              </p>
            </Reveal>

            <div className="flex flex-col gap-4">
              {service.treatments.map((t, i) => (
                <Reveal key={t.name} delay={i * 70}>
                  <div className="overflow-hidden rounded-2xl border border-border/40 bg-card">

                    {/* Top row: name + price */}
                    <div className="flex flex-col gap-2 p-7 sm:flex-row sm:items-start sm:justify-between md:p-8">
                      <div className="flex flex-col gap-1">
                        <h2 className="font-heading text-[26px] leading-snug tracking-tight md:text-[30px]">
                          {t.name}
                        </h2>
                      </div>
                      <div className="shrink-0 text-right">
                        <p className="font-heading text-[32px] leading-none tracking-tight">
                          {t.price}
                          <span className="ml-1.5 text-[14px] font-normal text-muted-foreground">
                            per sessie
                          </span>
                        </p>
                        <p className="mt-1 text-[13px] text-muted-foreground">{t.duration}</p>
                      </div>
                    </div>

                    {/* Divider */}
                    <div className="border-t border-border/40" aria-hidden />

                    {/* Bottom row: results + downtime */}
                    <div className="grid gap-6 p-7 sm:grid-cols-2 md:p-8">
                      <div className="flex gap-3.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50">
                          <Clock className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                        </span>
                        <div>
                          <p className="mb-1.5 text-[13px] font-semibold text-foreground">
                            Resultaten
                          </p>
                          <p className="text-[14px] leading-[1.7] text-muted-foreground">
                            {t.results}
                          </p>
                        </div>
                      </div>
                      <div className="flex gap-3.5">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border/50">
                          <BedDouble className="h-3.5 w-3.5 text-muted-foreground" aria-hidden />
                        </span>
                        <div>
                          <p className="mb-1.5 text-[13px] font-semibold text-foreground">
                            Herstelperiode
                          </p>
                          <p className="text-[14px] leading-[1.7] text-muted-foreground">
                            {t.downtime}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* CTA link */}
                    <div className="flex justify-end border-t border-border/40 px-7 py-4 md:px-8">
                      <a
                        href="/#contact"
                        className="inline-flex items-center gap-1.5 text-[13px] font-medium text-foreground underline underline-offset-4 decoration-border/60 transition-all hover:gap-2.5 hover:text-accent hover:decoration-accent"
                      >
                        Gratis consult <ArrowRight className="h-3.5 w-3.5" aria-hidden />
                      </a>
                    </div>
                  </div>
                </Reveal>
              ))}
            </div>

            {/* Bottom CTA */}
            <Reveal className="mt-16 flex flex-col items-center gap-4 text-center">
              <p className="text-[15px] text-muted-foreground">
                Twijfel je over welke behandeling het beste bij jou past?
              </p>
              <a
                href="/#contact"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-10 py-5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20 hover:gap-3"
              >
                Plan een gratis consult <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>

          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
