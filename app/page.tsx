import Image from "next/image"
import {
  BadgeCheck, Leaf, Lock, Sparkles, Users,
  Clock, ArrowRight, Check, ChevronDown,
} from "lucide-react"
import { SiteNav } from "@/components/site-nav"
import { SiteFooter } from "@/components/site-footer"
import { Reveal } from "@/components/reveal"
import { ServicesCarousel } from "@/components/services-carousel"
import { ParallaxHeroImage } from "@/components/parallax-hero-image"
import { CountUp } from "@/components/count-up"
import { CtaBand } from "@/components/cta-band"
import { Behandelingen } from "@/components/behandelingen"
import { ReviewsCarousel } from "@/components/reviews-carousel"
import { FaqSection } from "@/components/faq-section"
import { serviceCategories } from "@/lib/services-data"

const marqueeItems = [
  { icon: BadgeCheck, label: "Gecertificeerd" },
  { icon: Leaf,       label: "Natuurlijke producten" },
  { icon: Lock,       label: "Privacy" },
  { icon: Sparkles,   label: "25+ behandelingen" },
  { icon: Clock,      label: "20+ jaar ervaring" },
  { icon: Users,      label: "1000+ tevreden klanten" },
]


const processSteps = [
  { num: "01", title: "Kies jouw behandeling", desc: "Blader door ons menu en kies het ritueel dat het beste bij jou past." },
  { num: "02", title: "Maak een afspraak",     desc: "Boek online of bel ons. Wij zorgen voor een naadloze planning." },
  { num: "03", title: "Beleef het ritueel",    desc: "Geniet van jouw behandeling in onze stille, serene omgeving." },
  { num: "04", title: "Voel het verschil",     desc: "Verlaat ons als een vernieuwde versie van jezelf." },
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
            href="/boeken"
            className="rounded-full bg-accent px-11 py-5 text-[17px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-lg hover:shadow-accent/30"
          >
            Afspraak maken
          </a>
          <a
            href="#services"
            className="flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-11 py-5 text-[17px] font-medium text-white backdrop-blur-sm transition-all duration-300 hover:bg-white/20"
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
    <section aria-label="Onze kernwaarden" className="relative z-10 -mt-32 overflow-hidden rounded-t-[40px] bg-background pb-4 md:-mt-48 md:rounded-t-[112px] md:pb-6">
      <div className="relative overflow-hidden py-6 md:py-16">
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

const statsItems = [
  { target: 1000, suffix: '+', label: 'Klanten verwelkomd' },
  { target: 98,   suffix: '%', label: 'Klanttevredenheid' },
  { target: 100,  suffix: '%', label: 'Gecertificeerd' },
  { target: 20,   suffix: '+', label: 'Jaar ervaring' },
]

function Stats() {
  return (
    <section className="bg-background pt-10 pb-10 md:py-16 lg:py-24">
      <div className="mx-auto max-w-[1840px] px-5 md:px-6">
        <div className="grid grid-cols-2 gap-5 md:gap-10 lg:flex lg:items-start lg:justify-between">
          {statsItems.map((item, i) => (
            <Reveal key={item.label} delay={i * 90}>
              <div className="flex flex-col gap-2 lg:gap-3">
                <div className="flex items-center gap-2 lg:gap-3">
                  <span className="font-heading text-[36px] leading-none tracking-tight md:text-[64px] lg:text-[76px]">
                    <CountUp target={item.target} suffix={item.suffix} />
                  </span>
                  <span className="text-[20px] text-accent md:text-[34px]" aria-hidden>↑</span>
                </div>
                <p className="text-[13px] text-muted-foreground md:text-[18px]">{item.label}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}


function About() {
  return (
    <section id="about" className="relative bg-background -mt-2 pt-2 pb-6 md:mt-0 md:pt-16 md:pb-20 lg:pt-20 lg:pb-40" aria-labelledby="about-heading">
      <div className="mx-auto max-w-[1840px] px-5 md:px-6">
        <div className="grid items-center gap-14 lg:grid-cols-2 lg:gap-10 xl:gap-14">

          {/* Text column */}
          <div className="flex flex-col gap-8">
            <Reveal>
              <span className="text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">Onze filosofie</span>
            </Reveal>
            <Reveal delay={80}>
              <h2
                id="about-heading"
                className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[68px] xl:text-[80px]"
              >
                Een plek gebouwd rondom één ding:{" "}
                <em className="not-italic text-accent">Jij.</em>
              </h2>
            </Reveal>
            <Reveal delay={140}>
              <p className="text-[17px] leading-[1.85] text-muted-foreground md:text-[18px]">
                Sommige plekken zijn ontworpen om indruk te maken. Zen Spa is ontworpen om te herstellen.
                Wij meten succes niet in hoe een bezoek eruitziet, maar in hoe jij je voelt als je vertrekt —
                lichter, helderder en meer verbonden met jezelf.
              </p>
            </Reveal>
            <Reveal delay={190}>
              <ul className="flex flex-col gap-4">
                {[
                  "Gecertificeerde schoonheidsspecialisten",
                  "100% natuurlijke en biologische producten",
                  "Private behandelkamers, rustige sessies",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-[17px]">
                    <span
                      aria-hidden
                      className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/12 text-accent"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
            <Reveal delay={260}>
              <a
                href="#contact"
                className="inline-flex w-fit items-center gap-2.5 rounded-full bg-accent px-10 py-5 text-[17px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:gap-3.5 hover:shadow-md hover:shadow-accent/20"
              >
                Ons verhaal <ArrowRight className="h-4 w-4" aria-hidden />
              </a>
            </Reveal>
          </div>

          {/* Image column */}
          <Reveal>
            <div className="relative">
              <div className="relative aspect-square overflow-hidden rounded-[48px]">
                <Image
                  src="/bg-leaves.jpg"
                  alt="Zen Spa — luxe schoonheidsbehandeling in een serene omgeving"
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Circular stamp badge */}
              <div className="absolute left-4 top-4 md:left-6 md:top-6">
                <div className="relative flex h-[160px] w-[160px] items-center justify-center rounded-full border border-foreground/12 bg-background shadow-xl md:h-[200px] md:w-[200px]">
                  <svg
                    className="absolute inset-0 h-full w-full stamp-rotate"
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
                      style={{ fontSize: "8px", fontWeight: 600, letterSpacing: "0.32em" }}
                    >
                      <textPath href="#stamp-arc" startOffset="0%">
                        20+ JAAR ERVARING   ·
                      </textPath>
                      <textPath href="#stamp-arc" startOffset="50%">
                        20+ JAAR ERVARING   ·
                      </textPath>
                    </text>
                  </svg>
                  <div className="flex items-center justify-center">
                    <span className="font-heading text-[48px] leading-none md:text-[58px]">20</span>
                    <span className="font-heading text-[22px] leading-none md:text-[26px] self-center pb-1">+</span>
                  </div>
                </div>
              </div>

              {/* Frosted caption */}
              <div className="absolute bottom-5 left-5 right-5 flex items-center gap-4 rounded-2xl bg-black/42 px-6 py-5 backdrop-blur-md md:px-8 md:py-6">
                <Sparkles className="h-6 w-6 shrink-0 text-white/70 md:h-7 md:w-7" aria-hidden />
                <p className="text-[15px] font-medium leading-snug text-white md:text-[17px]">
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


function Process() {
  return (
    <section className="section-fade bg-accent py-16 md:py-20 lg:py-48" aria-labelledby="process-heading">
      <div className="mx-auto max-w-[1840px] px-5 md:px-6">
        <Reveal className="mb-10 flex flex-col items-center gap-5 text-center md:mb-20">
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

        <div className="grid gap-10 lg:grid-cols-4 lg:gap-10">
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


function Journal() {
  return (
    <section className="section-fade bg-muted/25 pt-16 pb-36 md:pb-48 lg:py-48" aria-labelledby="journal-heading">
      <div className="mx-auto max-w-[1840px] px-5 md:px-6">
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


// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <Pillars />
        <About />
        <Stats />
        <ServicesCarousel services={serviceCategories} />
        <CtaBand />
        <Behandelingen />
        <Process />
        <ReviewsCarousel />
        <FaqSection />
        <Journal />
      </main>
      <SiteFooter bg="bg-muted/25" />
    </>
  )
}
