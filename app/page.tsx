import Image from "next/image"
import {
  Star, BadgeCheck, Leaf, Lock, Sparkles, Users,
  Clock, Phone, MapPin, ArrowRight, Check, ChevronDown,
} from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Reveal } from "@/components/reveal"
import { StackCards } from "@/components/stack-cards"
import { ParallaxHeroImage } from "@/components/parallax-hero-image"
import { serviceCategories } from "@/lib/services-data"

const marqueeItems = [
  { icon: BadgeCheck, label: "Gecertificeerd" },
  { icon: Leaf,       label: "Natuurlijke producten" },
  { icon: Lock,       label: "Privacy" },
  { icon: Sparkles,   label: "25+ behandelingen" },
  { icon: Clock,      label: "20+ jaar ervaring" },
  { icon: Users,      label: "1000+ tevreden klanten" },
]

const pricingPlans = [
  {
    name: "Essentials",
    tagline: "Jouw eerste ritueel",
    price: "$125",
    duration: "60 min",
    features: [
      "Signature facial of ontspanningsmassage",
      "Botanische welkomstdrank",
      "Lockers & badjas inbegrepen",
      "Thermisch bad (30 min)",
    ],
    highlight: false,
  },
  {
    name: "Signature",
    tagline: "Onze meest geliefde",
    price: "$225",
    duration: "90 min",
    features: [
      "Full-body ritueel naar keuze",
      "Botanische welkomstdrank",
      "Verwarmde badjas",
      "Thermisch bad (1 uur)",
      "Persoonlijk take-home blend",
    ],
    highlight: true,
  },
  {
    name: "Prestige",
    tagline: "De complete ervaring",
    price: "$325",
    duration: "120 min",
    features: [
      "Dubbele behandeling (lichaam + gezicht)",
      "Botanische welkomstdrank",
      "Premium badjas & slippers",
      "Onbeperkt thermisch bad",
      "Persoonlijk take-home blend",
      "Persoonlijk therapeutenconsultatie",
    ],
    highlight: false,
  },
]

const processSteps = [
  { num: "01", title: "Kies jouw behandeling", desc: "Blader door ons menu en kies het ritueel dat het beste bij jou past." },
  { num: "02", title: "Maak een afspraak",     desc: "Boek online of bel ons. Wij zorgen voor een naadloze planning." },
  { num: "03", title: "Beleef het ritueel",    desc: "Geniet van jouw behandeling in onze stille, serene omgeving." },
  { num: "04", title: "Voel het verschil",     desc: "Verlaat ons als een vernieuwde versie van jezelf." },
]

const testimonials = [
  {
    name: "Sophia R.",
    role: "Bezocht maart 2025",
    initials: "SR",
    quote:
      "Zen Spa voelde als een andere wereld. Het Zen Renewal Ritual liet mijn huid stralen en mijn geest volledig tot rust komen. Ik heb jaren niet zo goed geslapen.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    role: "Maandelijks lid",
    initials: "MT",
    quote:
      "De Alpine Mineral Soak heeft mijn benadering van zelfzorg fundamenteel veranderd. De therapeuten zijn van wereldklasse en de ambiance is ongeëvenaard.",
    stars: 5,
  },
  {
    name: "Lena M.",
    role: "Bezocht januari 2025",
    initials: "LM",
    quote:
      "Elk detail is doordacht — van de warme botanische welkomstdrank tot de verwarmde badjassen. De meest luxueuze twee uur die ik ooit aan mezelf heb besteed.",
    stars: 5,
  },
]

const blogPosts = [
  {
    tag: "Wellness",
    date: "12 april 2025",
    title: "De eeuwenoude kunst van botanisch baden",
    excerpt:
      "Hoe mineraalrijke kruidenbaden al eeuwenlang door culturen over de hele wereld worden gebruikt om lichaam en geest te herstellen.",
    image: "/hero.jpg",
  },
  {
    tag: "Huidverzorging",
    date: "28 maart 2025",
    title: "5 rituelen die onze therapeuten elke ochtend doen",
    excerpt:
      "De eenvoudige dagelijkse gewoonten die onze huid lumineus houden, onze energie kalm en onze mindset gecentreerd.",
    image: "/bg-leaves.jpg",
  },
]

// ─── Shared micro-components ──────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span className="text-[11px] font-semibold tracking-[0.18em] text-accent uppercase">
      {children}
    </span>
  )
}

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-1" aria-label={`${count} van 5 sterren`}>
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="h-4 w-4 fill-accent text-accent" aria-hidden />
      ))}
    </div>
  )
}

// ─── Sections ─────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden" aria-label="Introductie">
      {/* Background image — parallax */}
      <ParallaxHeroImage />
      {/* Depth overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/42 to-black/68" />

      {/* Center content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 px-5 text-center">
        <div
          className="hero-animate"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-6 py-2.5 text-[12px] font-semibold tracking-[0.18em] uppercase text-white backdrop-blur-sm">
            Zen Spa · Almere Buiten
          </span>
        </div>

        <h1
          className="hero-animate font-heading text-[36px] leading-[1.06] tracking-tight text-white sm:text-[52px] md:text-[72px] lg:text-[88px]"
          style={{ animationDelay: "110ms" }}
        >
          Schoonheidssalon in Almere Buiten
        </h1>

        <p
          className="hero-animate max-w-[540px] text-[17px] leading-[1.85] text-white/68"
          style={{ animationDelay: "210ms" }}
        >
          Persoonlijke schoonheidsbehandelingen voor verzorging, uitstraling en ontspanning.
        </p>

        <div
          className="hero-animate flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: "310ms" }}
        >
          <a
            href="#contact"
            className="rounded-full bg-accent px-11 py-5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-lg hover:shadow-accent/30"
          >
            Afspraak maken
          </a>
          <a
            href="#services"
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-11 py-5 text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            Ontdek behandelingen <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

{/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 hidden flex-col items-center gap-1.5 md:flex" aria-hidden>
        <ChevronDown className="h-4 w-4 animate-bounce text-white/35" />
      </div>

    </section>
  )
}

function Pillars() {
  return (
    <section aria-label="Onze kernwaarden" className="relative z-10 -mt-32 overflow-hidden rounded-t-[80px] bg-background pb-16 md:-mt-48 md:rounded-t-[112px] md:pb-24">
      <div className="relative overflow-hidden py-12 md:py-16">
        {/* Fade left */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-background to-transparent md:w-72" aria-hidden />
        {/* Fade right */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-background to-transparent md:w-72" aria-hidden />
        <div className="marquee-track">
          {[...marqueeItems, ...marqueeItems].map((item, i) => {
            const Icon = item.icon
            return (
              <span key={i} className="inline-flex shrink-0 items-center gap-5 px-10 font-heading text-[22px] text-foreground/65 md:px-16 md:text-[28px]">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-accent/15 md:h-16 md:w-16">
                  <Icon className="h-7 w-7 text-accent md:h-8 md:w-8" aria-hidden />
                </span>
                {item.label}
              </span>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="pt-36 pb-20 md:pt-48 md:pb-28 lg:pt-64 lg:pb-36" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1600px] px-8 md:px-14 lg:px-24">
        <div className="flex flex-col gap-16 lg:flex-row lg:gap-24 xl:gap-32">

          {/* ── Left sticky sidebar ── */}
          <Reveal className="lg:sticky lg:top-28 lg:w-[340px] lg:shrink-0 lg:self-start">
            <div className="flex flex-col gap-8">
              <div className="flex items-center gap-2.5">
                <span className="h-2 w-2 rounded-full bg-accent" aria-hidden />
                <SectionLabel>Wat we aanbieden</SectionLabel>
              </div>

              <h2
                id="services-heading"
                className="font-heading text-[46px] leading-[1.06] tracking-tight md:text-[58px]"
              >
                Zorgvuldige<br />rituelen voor{" "}
                <em className="not-italic text-accent">elk verlangen.</em>
              </h2>

              <p className="text-[15px] leading-[1.8] text-muted-foreground">
                Van gezichtsbehandelingen tot ontspanningsmassages — elk ritueel is
                zorgvuldig samengesteld met de reinste botanische ingrediënten en
                uitgevoerd door gecertificeerde therapeuten.
              </p>

              <a
                href="#pricing"
                className="inline-flex w-fit items-center gap-2.5 rounded-full border border-foreground/20 px-8 py-4 text-[14px] font-medium text-foreground transition-all duration-300 hover:border-accent hover:text-accent"
              >
                Volledig behandelingsoverzicht <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </div>
          </Reveal>

          {/* ── Right: stacking cards ── */}
          <StackCards services={serviceCategories} />

        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="py-36 md:py-48 lg:py-64" aria-labelledby="about-heading">
      <div className="mx-auto max-w-[1600px] px-8 md:px-14 lg:px-24">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-28 xl:gap-36">

          {/* Text column */}
          <div className="flex flex-col gap-7">
            <Reveal>
              <SectionLabel>Onze filosofie</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="about-heading"
                className="font-heading text-[46px] leading-[1.07] tracking-tight md:text-[58px] lg:text-[68px]"
              >
                Een plek gebouwd<br />rondom één ding:{" "}
                <em className="not-italic text-accent">Jij.</em>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="max-w-[480px] text-[16px] leading-[1.85] text-muted-foreground">
                Sommige plekken zijn ontworpen om indruk te maken. Zen Spa is ontworpen om te herstellen.
                Wij meten succes niet in hoe een bezoek eruitziet, maar in hoe jij je voelt als je vertrekt —
                lichter, helderder en meer verbonden met jezelf.
              </p>
            </Reveal>
            <Reveal delay={190}>
              <ul className="flex flex-col gap-3.5">
                {[
                  "Gecertificeerde schoonheidsspecialisten",
                  "100% natuurlijke en biologische producten",
                  "Private behandelkamers, rustige sessies",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3.5 text-[15px]">
                    <span
                      aria-hidden
                      className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent"
                    >
                      <Check className="h-3 w-3" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={260}>
              <a
                href="#contact"
                className="inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-10 py-5 text-[15px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:gap-3.5 hover:shadow-md hover:shadow-accent/20"
              >
                Ons verhaal <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>
          </div>

          {/* Image column */}
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src="/bg-leaves.jpg"
                  alt="Zen Spa — luxe schoonheidsbehandeling in een serene omgeving"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Circular stamp badge */}
              <div className="absolute -left-5 top-10 md:-left-8">
                <div className="relative flex h-[108px] w-[108px] items-center justify-center rounded-full border border-foreground/12 bg-background shadow-xl md:h-[128px] md:w-[128px]">
                  <svg
                    className="absolute inset-0 h-full w-full"
                    viewBox="0 0 128 128"
                    aria-hidden
                  >
                    <defs>
                      <path
                        id="stamp-arc"
                        d="M 64,64 m -46,0 a 46,46 0 1,1 92,0 a 46,46 0 1,1 -92,0"
                      />
                    </defs>
                    <text
                      fill="currentColor"
                      className="text-foreground/40"
                      style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "0.22em" }}
                    >
                      <textPath href="#stamp-arc" startOffset="4%">
                        SCHOONHEIDSSALON · ALMERE BUITEN ·
                      </textPath>
                    </text>
                  </svg>
                  <div className="text-center">
                    <p className="font-heading text-[28px] leading-none md:text-[34px]">20+</p>
                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                      Jaar<br />ervaring
                    </p>
                  </div>
                </div>
              </div>

              {/* Frosted caption */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3 rounded-2xl bg-black/42 px-5 py-4 backdrop-blur-md">
                <Sparkles className="h-4 w-4 shrink-0 text-white/70" aria-hidden />
                <p className="text-[13px] font-medium leading-snug text-white">
                  Wij doen niet aan snelle oplossingen. Wij doen aan diepe rust.
                </p>
              </div>
            </div>
          </Reveal>

        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-36 md:py-48 lg:py-64" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-[1600px] px-8 md:px-14 lg:px-24">
        <Reveal className="mb-20 flex flex-col items-center gap-5 text-center">
          <SectionLabel>Tarieven</SectionLabel>
          <h2
            id="pricing-heading"
            className="font-heading text-[52px] leading-[1.06] tracking-tight md:text-[68px]"
          >
            Kies jouw <em className="not-italic text-accent">ritueel</em>
          </h2>
          <p className="max-w-lg text-[16px] leading-relaxed text-muted-foreground">
            Elk arrangement biedt toegang tot onze thermische faciliteiten. Directe
            booking is altijd inclusief een gratis botanische welkomstdrank.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 85}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-10 transition-shadow duration-300 hover:shadow-xl ${
                  plan.highlight
                    ? "border-accent/35 bg-accent/5 shadow-md ring-1 ring-accent/20"
                    : "border-border/50 bg-card"
                }`}
              >
                {plan.highlight && (
                  <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-5 py-1.5 text-[11px] font-semibold tracking-widest text-white uppercase">
                    Meest populair
                  </span>
                )}

                {/* Plan header */}
                <div className="mb-8">
                  <p className="mb-1.5 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                    {plan.tagline}
                  </p>
                  <h3 className="font-heading text-3xl">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-8 flex items-end gap-2 border-b border-border/40 pb-8">
                  <span className="font-heading text-7xl leading-none">{plan.price}</span>
                  <span className="mb-2 text-[14px] text-muted-foreground">
                    / {plan.duration}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-10 flex flex-1 flex-col gap-4">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3.5 text-[15px]">
                      <span
                        aria-hidden
                        className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent"
                      >
                        <Check className="h-3 w-3" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="#contact"
                  className={`rounded-full py-4 text-center text-[15px] font-medium transition-all duration-300 ${
                    plan.highlight
                      ? "bg-accent text-white hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20"
                      : "border border-border text-foreground hover:border-accent/50 hover:text-accent"
                  }`}
                >
                  Reserveer nu
                </a>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Process() {
  return (
    <section className="bg-accent py-36 md:py-48" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[1600px] px-8 md:px-14 lg:px-24">
        <Reveal className="mb-20 flex flex-col items-center gap-5 text-center">
          <span className="text-[12px] font-semibold tracking-[0.2em] text-white/45 uppercase">
            Hoe het werkt
          </span>
          <h2
            id="process-heading"
            className="font-heading text-[52px] leading-[1.06] tracking-tight text-white md:text-[68px]"
          >
            Jouw weg naar{" "}
            <em className="not-italic text-white/65">wellness</em>
          </h2>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-4 md:gap-10">
          {processSteps.map((s, i) => (
            <Reveal key={s.num} delay={i * 85}>
              <div className="flex flex-col gap-5">
                <span className="font-heading text-7xl leading-none text-white/18">{s.num}</span>
                <div className="h-px bg-white/15" aria-hidden />
                <h3 className="font-heading text-[22px] text-white">{s.title}</h3>
                <p className="text-[15px] leading-[1.78] text-white/58">{s.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="stories" className="py-36 md:py-48 lg:py-64" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-[1600px] px-8 md:px-14 lg:px-24">
        <Reveal className="mb-20 flex flex-col items-center gap-5 text-center">
          <SectionLabel>Gastervaringen</SectionLabel>
          <h2
            id="testimonials-heading"
            className="font-heading text-[52px] leading-[1.06] tracking-tight md:text-[68px]"
          >
            Woorden van onze{" "}
            <em className="not-italic text-accent">gasten</em>
          </h2>
        </Reveal>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 85}>
              <div className="flex h-full flex-col gap-7 rounded-3xl border border-border/50 bg-card p-10">
                <StarRow count={t.stars} />
                <p className="flex-1 text-[17px] leading-[1.85] text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4 border-t border-border/40 pt-6">
                  <div
                    aria-hidden
                    className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[13px] font-semibold text-accent"
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-[14px] font-medium">{t.name}</p>
                    <p className="text-[12px] text-muted-foreground">{t.role}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function Journal() {
  return (
    <section className="bg-muted/25 py-36 md:py-48" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-[1600px] px-8 md:px-14 lg:px-24">
        <Reveal className="mb-20 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-4">
            <SectionLabel>Wellness journal</SectionLabel>
            <h2
              id="journal-heading"
              className="font-heading text-[52px] leading-[1.06] tracking-tight md:text-[68px]"
            >
              Inzichten &{" "}
              <em className="not-italic text-accent">inspiratie</em>
            </h2>
          </div>
          <a
            href="#"
            className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-accent transition-all duration-200 hover:gap-3"
          >
            Alle artikelen <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>

        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post, i) => (
            <Reveal key={post.title} delay={i * 100}>
              <a href="#" className="group flex flex-col gap-5">
                <div className="relative aspect-[16/10] overflow-hidden rounded-2xl">
                  <Image
                    src={post.image}
                    alt={post.title}
                    fill
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-black/8 transition-colors group-hover:bg-black/18" />
                </div>
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-3">
                    <span className="rounded-full bg-accent/10 px-3.5 py-1 text-[11px] font-semibold text-accent">
                      {post.tag}
                    </span>
                    <span className="text-[12px] text-muted-foreground">{post.date}</span>
                  </div>
                  <h3 className="font-heading text-[28px] leading-snug transition-colors duration-200 group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="text-[15px] leading-[1.78] text-muted-foreground">{post.excerpt}</p>
                </div>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function CtaBand() {
  return (
    <section id="contact" className="relative overflow-hidden py-32 md:py-44" aria-labelledby="cta-heading">
      <Image
        src="/hero.jpg"
        alt=""
        fill
        aria-hidden
        className="object-cover object-center"
        sizes="100vw"
      />
      <div className="absolute inset-0 bg-accent/82" />

      <Reveal className="relative z-10 mx-auto flex max-w-2xl flex-col items-center gap-8 px-5 text-center">
        <div className="flex flex-col gap-4">
          <span className="text-[12px] font-semibold tracking-[0.2em] text-white/45 uppercase">
            Reserveer je bezoek
          </span>
          <h2
            id="cta-heading"
            className="font-heading text-[52px] leading-[1.05] tracking-tight text-white md:text-[72px]"
          >
            Jouw moment van<br />
            <em className="not-italic text-white/72">stilte</em> wacht
          </h2>
        </div>
        <p className="max-w-[480px] text-[16px] leading-[1.8] text-white/65">
          Boek direct en ontvang een gratis botanische welkomstdrank en toegang tot
          ons thermische bad voor je behandeling.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#"
            className="flex items-center gap-2.5 rounded-full bg-white px-12 py-5 text-[15px] font-medium text-accent transition-all duration-300 hover:bg-white/92 hover:gap-3.5 hover:shadow-xl hover:shadow-black/15"
          >
            Online boeken <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="tel:+31201234567"
            className="flex items-center gap-2.5 rounded-full border border-white/30 bg-white/10 px-12 py-5 text-[15px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            <Phone className="h-4 w-4" aria-hidden /> Bel ons
          </a>
        </div>
        <div className="flex flex-col items-center gap-4 text-[13px] text-white/50 sm:flex-row sm:gap-6">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" aria-hidden /> Serenity Lane 12, Amsterdam
          </span>
          <span className="hidden h-4 w-px bg-white/20 sm:block" aria-hidden />
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" aria-hidden /> Dagelijks 9:00 – 21:00
          </span>
        </div>
      </Reveal>
    </section>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Pillars />
        <Services />
        <About />
        <Pricing />
        <Process />
        <Testimonials />
        <Journal />
        <CtaBand />
      </main>
      <SiteFooter />
    </>
  )
}
