import Image from "next/image"
import {
  Leaf, Droplets, Wind, Sparkles, Star,
  Clock, Phone, MapPin, ArrowRight, Check, ChevronDown,
} from "lucide-react"
import { ZenSpaLogo } from "@/components/logo"
import { SiteNav } from "@/components/site-nav"
import { Reveal } from "@/components/reveal"

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  {
    icon: Sparkles,
    title: "Gezichtsbehandelingen",
    desc: "Op maat gemaakte rituelen voor een stralende, gezonde huid.",
    dark: true,
    pos: "object-top",
  },
  {
    icon: Wind,
    title: "Massage & Ontspanning",
    desc: "Wetenschappelijk onderbouwde ontspanningstechnieken voor lichaam en geest.",
    dark: false,
    pos: "",
  },
  {
    icon: Droplets,
    title: "Lichaamsbehandelingen",
    desc: "Verzorgende wraps en scrubs met organische botanische ingrediënten.",
    dark: true,
    pos: "object-center",
  },
  {
    icon: Leaf,
    title: "Hydrotherapie",
    desc: "Mineraalrijke watertherapie die van binnenuit nourishment verschaft.",
    dark: false,
    pos: "",
  },
  {
    icon: Sparkles,
    title: "Hand- & Nagelzorg",
    desc: "Luxueuze handbehandelingen als aanvulling op jouw wellnessritueel.",
    dark: true,
    pos: "object-bottom",
  },
  {
    icon: Droplets,
    title: "Aromatherapie",
    desc: "Geurreizen met essentiële oliën die kalmeren en verjongen.",
    dark: false,
    pos: "",
  },
]

const pillars = [
  { icon: Leaf,     title: "100% Natuurlijk",          desc: "Ethisch ingekochte organische ingrediënten" },
  { icon: Sparkles, title: "Gecertificeerde therapeuten", desc: "Voortdurend bijgeschoold en gecertificeerd" },
  { icon: Droplets, title: "Duurzaam & bewust",          desc: "Milieuvriendelijke praktijken en verpakkingen" },
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
      {/* Background image */}
      <Image
        src="/hero.jpg"
        alt="Zen Spa — luxe wellnessbehandelingen"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Depth overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/42 to-black/68" />

      {/* Center content */}
      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center gap-7 px-5 text-center">
        <div
          className="hero-animate"
          style={{ animationDelay: "0ms" }}
        >
          <span className="inline-flex rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-semibold tracking-[0.18em] uppercase text-white backdrop-blur-sm">
            House of Beauty
          </span>
        </div>

        <h1
          className="hero-animate font-heading text-[52px] leading-[1.04] tracking-tight text-white md:text-[70px] lg:text-[86px]"
          style={{ animationDelay: "110ms" }}
        >
          Luxury spa treatments<br />
          for your{" "}
          <em className="not-italic text-white/80">well-being</em>
        </h1>

        <p
          className="hero-animate max-w-[480px] text-[15px] leading-[1.8] text-white/68"
          style={{ animationDelay: "210ms" }}
        >
          Stap binnen in een sanctuary waar eeuwenoude helende tradities
          samenkomen met moderne luxe. Elk ritueel, zorgvuldig samengesteld
          voor jou.
        </p>

        <div
          className="hero-animate flex flex-col items-center gap-3 sm:flex-row"
          style={{ animationDelay: "310ms" }}
        >
          <a
            href="#contact"
            className="rounded-full bg-accent px-9 py-[14px] text-[14px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-lg hover:shadow-accent/30"
          >
            Afspraak maken
          </a>
          <a
            href="#services"
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-9 py-[14px] text-[14px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
          >
            Ontdek behandelingen <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </div>
      </div>

      {/* Stats pill */}
      <div
        className="hero-animate absolute bottom-10 left-1/2 z-10 -translate-x-1/2 hidden sm:block"
        style={{ animationDelay: "440ms" }}
      >
        <div className="flex items-center gap-8 rounded-full border border-white/15 bg-white/10 px-8 py-4 backdrop-blur-md">
          {[
            { n: "12+", l: "Behandelingen" },
            { n: "4.9", l: "Gemiddeld review" },
            { n: "8k+", l: "Tevreden gasten" },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-8">
              {i > 0 && <div className="h-5 w-px bg-white/20" aria-hidden />}
              <div className="text-center">
                <p className="font-heading text-xl font-semibold text-white">{s.n}</p>
                <p className="text-[11px] text-white/55">{s.l}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 right-8 z-10 hidden flex-col items-center gap-1.5 md:flex" aria-hidden>
        <ChevronDown className="h-4 w-4 animate-bounce text-white/35" />
      </div>

      {/* Bottom fade to page bg */}
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t to-transparent" aria-hidden />
    </section>
  )
}

function Pillars() {
  return (
    <section aria-label="Onze kernwaarden" className="border-b border-border/30">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">
        <div className="grid divide-y divide-border/30 md:grid-cols-3 md:divide-x md:divide-y-0">
          {pillars.map((p, i) => {
            const Icon = p.icon
            return (
              <Reveal key={p.title} delay={i * 90}>
                <div className="flex items-center gap-5 py-9 md:px-10 lg:px-14">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/10" aria-hidden>
                    <Icon className="h-5 w-5 text-accent" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">{p.title}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{p.desc}</p>
                  </div>
                </div>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="py-28 md:py-36 lg:py-48" aria-labelledby="services-heading">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">
        {/* Header row */}
        <Reveal className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <SectionLabel>Onze behandelingen</SectionLabel>
            <h2
              id="services-heading"
              className="font-heading text-[40px] leading-[1.08] tracking-tight md:text-[52px]"
            >
              Zorgvuldige rituelen<br />
              voor elk{" "}
              <em className="not-italic text-accent">verlangen</em>
            </h2>
          </div>
          <a
            href="#pricing"
            className="flex shrink-0 items-center gap-2 text-[13px] font-medium text-accent transition-all duration-200 hover:gap-3"
          >
            Alle behandelingen <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
        </Reveal>

        {/* 3-col grid */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 md:gap-5">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <Reveal key={s.title} delay={i * 65}>
                <a
                  href="#pricing"
                  className="group relative flex aspect-[3/4] flex-col justify-end overflow-hidden rounded-2xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
                  aria-label={s.title}
                >
                  {s.dark ? (
                    <>
                      <Image
                        src="/bg-leaves.jpg"
                        alt=""
                        fill
                        aria-hidden
                        className={`object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04] ${s.pos}`}
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent" />
                      <div className="relative p-7">
                        <p className="font-heading text-[22px] leading-snug text-white">{s.title}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-white/60">{s.desc}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-white/50 transition-all group-hover:gap-2.5 group-hover:text-white">
                          Meer info <ArrowRight className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="absolute inset-0 flex flex-col bg-secondary p-7">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/12" aria-hidden>
                        <Icon className="h-5 w-5 text-accent" />
                      </div>
                      <div className="mt-auto">
                        <p className="font-heading text-[22px] leading-snug text-foreground">{s.title}</p>
                        <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">{s.desc}</p>
                        <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent transition-all group-hover:gap-2.5">
                          Meer info <ArrowRight className="h-3 w-3" aria-hidden />
                        </span>
                      </div>
                    </div>
                  )}
                </a>
              </Reveal>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="bg-muted/25 py-28 md:py-36 lg:py-48" aria-labelledby="about-heading">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">
        <div className="grid items-center gap-16 lg:grid-cols-2 lg:gap-28">

          {/* Image column */}
          <Reveal>
            <div className="relative">
              <div className="relative aspect-[4/5] overflow-hidden rounded-3xl">
                <Image
                  src="/hero.jpg"
                  alt="Serene behandelruimte van Zen Spa"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
              {/* Floating stat card */}
              <div className="absolute -bottom-6 -right-3 rounded-2xl bg-card px-6 py-5 shadow-xl shadow-black/8 md:-right-10">
                <p className="font-heading text-4xl">8k+</p>
                <p className="mt-0.5 text-[13px] text-muted-foreground">Tevreden gasten</p>
                <div className="mt-3 flex -space-x-2">
                  {["SR", "MT", "LM", "KV"].map((init) => (
                    <div
                      key={init}
                      aria-hidden
                      className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-card bg-accent/20 text-[9px] font-semibold text-accent"
                    >
                      {init}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Text column */}
          <div className="flex flex-col gap-8">
            <Reveal>
              <SectionLabel>Onze filosofie</SectionLabel>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="about-heading"
                className="font-heading text-[38px] leading-[1.1] tracking-tight md:text-[50px]"
              >
                Wellness geworteld<br />
                <em className="not-italic text-accent">in de natuur</em>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[15px] leading-[1.85] text-muted-foreground">
                Bij Zen Spa geloven we dat echt welzijn begint met wat je op — en in — je
                lichaam aanbrengt. Elk product dat we gebruiken is ethisch ingekocht, elk
                ritueel doordacht ontworpen, en elk bezoek een stap naar blijvende vernieuwing.
              </p>
            </Reveal>
            <Reveal delay={190}>
              <p className="text-[15px] leading-[1.85] text-muted-foreground">
                Opgericht op de principes van slow beauty en bewuste herstel, is ons House
                of Beauty een sanctuary ontworpen om je te helpen reconnecten met de beste
                versie van jezelf.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <div className="grid grid-cols-2 gap-6 border-t border-border/40 pt-8">
                {[
                  { n: "100%", l: "Natuurlijke producten" },
                  { n: "7+",   l: "Jaar ervaring" },
                  { n: "12+",  l: "Unieke behandelingen" },
                  { n: "4.9",  l: "Gemiddelde beoordeling" },
                ].map((s) => (
                  <div key={s.l}>
                    <p className="font-heading text-3xl">{s.n}</p>
                    <p className="mt-0.5 text-[13px] text-muted-foreground">{s.l}</p>
                  </div>
                ))}
              </div>
            </Reveal>
            <Reveal delay={300}>
              <a
                href="#pricing"
                className="inline-flex items-center gap-2 rounded-full bg-accent px-8 py-[14px] text-[14px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:gap-3 hover:shadow-md hover:shadow-accent/20"
              >
                Ontdek onze rituelen <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="py-28 md:py-36 lg:py-48" aria-labelledby="pricing-heading">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">
        <Reveal className="mb-14 flex flex-col items-center gap-4 text-center">
          <SectionLabel>Tarieven</SectionLabel>
          <h2
            id="pricing-heading"
            className="font-heading text-[40px] leading-[1.08] tracking-tight md:text-[52px]"
          >
            Kies jouw <em className="not-italic text-accent">ritueel</em>
          </h2>
          <p className="max-w-lg text-[15px] leading-relaxed text-muted-foreground">
            Elk arrangement biedt toegang tot onze thermische faciliteiten. Directe
            booking is altijd inclusief een gratis botanische welkomstdrank.
          </p>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {pricingPlans.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 85}>
              <div
                className={`relative flex h-full flex-col rounded-3xl border p-8 transition-shadow duration-300 hover:shadow-lg ${
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
                <div className="mb-6">
                  <p className="mb-1 text-[11px] font-semibold tracking-widest text-muted-foreground uppercase">
                    {plan.tagline}
                  </p>
                  <h3 className="font-heading text-2xl">{plan.name}</h3>
                </div>

                {/* Price */}
                <div className="mb-6 flex items-end gap-1.5 border-b border-border/40 pb-6">
                  <span className="font-heading text-5xl">{plan.price}</span>
                  <span className="mb-1.5 text-[13px] text-muted-foreground">
                    / {plan.duration}
                  </span>
                </div>

                {/* Features */}
                <ul className="mb-8 flex flex-1 flex-col gap-3.5">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-[14px]">
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
                  className={`rounded-full py-3.5 text-center text-[14px] font-medium transition-all duration-300 ${
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
    <section className="bg-accent py-28 md:py-36" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">
        <Reveal className="mb-16 flex flex-col items-center gap-4 text-center">
          <span className="text-[11px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Hoe het werkt
          </span>
          <h2
            id="process-heading"
            className="font-heading text-[40px] leading-[1.08] tracking-tight text-white md:text-[52px]"
          >
            Jouw weg naar{" "}
            <em className="not-italic text-white/65">wellness</em>
          </h2>
        </Reveal>

        <div className="grid gap-10 md:grid-cols-4 md:gap-8">
          {processSteps.map((s, i) => (
            <Reveal key={s.num} delay={i * 85}>
              <div className="flex flex-col gap-4">
                <span className="font-heading text-5xl text-white/18">{s.num}</span>
                <div className="h-px bg-white/15" aria-hidden />
                <h3 className="font-heading text-[20px] text-white">{s.title}</h3>
                <p className="text-[14px] leading-[1.75] text-white/58">{s.desc}</p>
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
    <section id="stories" className="py-28 md:py-36 lg:py-48" aria-labelledby="testimonials-heading">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">
        <Reveal className="mb-14 flex flex-col items-center gap-4 text-center">
          <SectionLabel>Gastervaringen</SectionLabel>
          <h2
            id="testimonials-heading"
            className="font-heading text-[40px] leading-[1.08] tracking-tight md:text-[52px]"
          >
            Woorden van onze{" "}
            <em className="not-italic text-accent">gasten</em>
          </h2>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <Reveal key={t.name} delay={i * 85}>
              <div className="flex h-full flex-col gap-6 rounded-3xl border border-border/50 bg-card p-8">
                <StarRow count={t.stars} />
                <p className="flex-1 text-[15px] leading-[1.85] text-muted-foreground">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <div className="flex items-center gap-4 border-t border-border/40 pt-5">
                  <div
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-accent/15 text-[12px] font-semibold text-accent"
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
    <section className="bg-muted/25 py-28 md:py-36" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-[1400px] px-5 md:px-10 lg:px-16">
        <Reveal className="mb-14 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div className="flex flex-col gap-3">
            <SectionLabel>Wellness journal</SectionLabel>
            <h2
              id="journal-heading"
              className="font-heading text-[40px] leading-[1.08] tracking-tight md:text-[52px]"
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
                  <h3 className="font-heading text-[22px] leading-snug transition-colors duration-200 group-hover:text-accent">
                    {post.title}
                  </h3>
                  <p className="text-[14px] leading-[1.75] text-muted-foreground">{post.excerpt}</p>
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
          <span className="text-[11px] font-semibold tracking-[0.18em] text-white/45 uppercase">
            Reserveer je bezoek
          </span>
          <h2
            id="cta-heading"
            className="font-heading text-[44px] leading-[1.06] tracking-tight text-white md:text-[58px]"
          >
            Jouw moment van<br />
            <em className="not-italic text-white/72">stilte</em> wacht
          </h2>
        </div>
        <p className="max-w-[440px] text-[15px] leading-[1.8] text-white/65">
          Boek direct en ontvang een gratis botanische welkomstdrank en toegang tot
          ons thermische bad voor je behandeling.
        </p>
        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <a
            href="#"
            className="flex items-center gap-2 rounded-full bg-white px-10 py-[14px] text-[14px] font-medium text-accent transition-all duration-300 hover:bg-white/92 hover:gap-3 hover:shadow-xl hover:shadow-black/15"
          >
            Online boeken <ArrowRight className="h-4 w-4" aria-hidden />
          </a>
          <a
            href="tel:+31201234567"
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-10 py-[14px] text-[14px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
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

function Footer() {
  return (
    <footer className="bg-foreground px-5 py-16 text-white md:px-10 lg:px-16">
      <div className="mx-auto max-w-[1400px]">
        <div className="grid gap-12 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-5">
            <ZenSpaLogo className="h-7 w-auto text-white" />
            <p className="text-[13px] leading-[1.75] text-white/42">
              Een sanctuary voor de zintuigen.<br />House of Beauty since 2018.
            </p>
            <a
              href="#"
              aria-label="Instagram"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-white/15 text-[11px] font-medium text-white/42 transition-colors hover:border-white/35 hover:text-white/70"
            >
              IG
            </a>
          </div>

          {/* Treatments */}
          <nav aria-label="Behandelingen" className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Behandelingen
            </p>
            {["Gezichtsbehandelingen", "Massage", "Lichaamsbehandelingen", "Hydrotherapie", "Hand & Nagels"].map(
              (s) => (
                <a
                  key={s}
                  href="#services"
                  className="text-[13px] text-white/50 transition-colors hover:text-white"
                >
                  {s}
                </a>
              )
            )}
          </nav>

          {/* Company */}
          <nav aria-label="Bedrijf" className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Bedrijf
            </p>
            {["Over ons", "Onze filosofie", "Cadeaubonnen", "Vacatures", "Pers"].map((s) => (
              <a
                key={s}
                href="#about"
                className="text-[13px] text-white/50 transition-colors hover:text-white"
              >
                {s}
              </a>
            ))}
          </nav>

          {/* Visit */}
          <div className="flex flex-col gap-4">
            <p className="text-[10px] font-semibold tracking-widest text-white/30 uppercase">
              Bezoek ons
            </p>
            <address className="not-italic">
              <p className="text-[13px] text-white/50">Serenity Lane 12</p>
              <p className="text-[13px] text-white/50">Amsterdam</p>
              <p className="mt-3 text-[13px] text-white/50">Ma–zo: 9:00 – 21:00</p>
              <a
                href="tel:+31201234567"
                className="mt-1 block text-[13px] text-white/50 transition-colors hover:text-white"
              >
                +31 (0)20 123 4567
              </a>
            </address>
          </div>
        </div>

        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-[11px] text-white/22 sm:flex-row">
          <p>© 2025 Zen Spa. Alle rechten voorbehouden.</p>
          <nav aria-label="Juridisch" className="flex gap-6">
            <a href="#" className="transition-colors hover:text-white/50">Privacybeleid</a>
            <a href="#" className="transition-colors hover:text-white/50">Algemene voorwaarden</a>
            <a href="#" className="transition-colors hover:text-white/50">Cookiebeleid</a>
          </nav>
        </div>
      </div>
    </footer>
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
      <Footer />
    </>
  )
}
