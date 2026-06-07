import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Leaf,
  Droplets,
  Wind,
  Sparkles,
  Star,
  Clock,
  Phone,
  MapPin,
  ChevronRight,
  Check,
  ArrowRight,
} from "lucide-react"
import { ZenSpaLogo } from "@/components/logo"

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  { icon: Sparkles, title: "Facials",            subtitle: "Glow & Renewal" },
  { icon: Wind,     title: "Massage",            subtitle: "Deep Relaxation" },
  { icon: Droplets, title: "Body Wraps",         subtitle: "Nourish & Detox" },
  { icon: Leaf,     title: "Hydrotherapy",       subtitle: "Mineral Soaks" },
  { icon: Sparkles, title: "Manicures",          subtitle: "Hand Rituals" },
  { icon: Droplets, title: "Aromatherapy",       subtitle: "Scent Journeys" },
]

const pricingPlans = [
  {
    name: "Essentials",
    tagline: "Your first ritual",
    price: "$125",
    duration: "60 min",
    features: [
      "Signature facial or body massage",
      "Botanical welcome drink",
      "Locker & robe included",
      "Thermal pool access (30 min)",
    ],
    cta: "Reserve Now",
    highlight: false,
  },
  {
    name: "Signature",
    tagline: "Our most loved",
    price: "$225",
    duration: "90 min",
    features: [
      "Full-body ritual of your choice",
      "Botanical welcome drink",
      "Locker & heated robe",
      "Thermal pool access (1 hr)",
      "Personalised take-home blend",
    ],
    cta: "Reserve Now",
    highlight: true,
  },
  {
    name: "Prestige",
    tagline: "The complete escape",
    price: "$325",
    duration: "120 min",
    features: [
      "Dual treatment (body + facial)",
      "Botanical welcome drink",
      "Premium robe & slippers",
      "Unlimited thermal pool access",
      "Personalised take-home blend",
      "Dedicated therapist consultation",
    ],
    cta: "Reserve Now",
    highlight: false,
  },
]

const testimonials = [
  {
    name: "Sophia R.",
    role: "Visited March 2025",
    initials: "SR",
    quote:
      "Walking into Zen Spa felt like stepping into another world. The Zen Renewal Ritual left my skin glowing and my mind completely at peace. I haven't slept that well in years.",
    stars: 5,
  },
  {
    name: "Marcus T.",
    role: "Monthly Member",
    initials: "MT",
    quote:
      "I was sceptical about the hype, but the Alpine Mineral Soak genuinely changed how I approach self-care. The therapists are world-class and the ambiance is unmatched.",
    stars: 5,
  },
  {
    name: "Lena M.",
    role: "Visited January 2025",
    initials: "LM",
    quote:
      "Every detail is considered — from the warm botanical welcome drink to the heated robes. It's the most luxurious two hours I've ever spent on myself.",
    stars: 5,
  },
]

const blogPosts = [
  {
    tag: "Wellness",
    date: "April 12, 2025",
    title: "The ancient art of botanical bathing — and why it works",
    excerpt: "Discover how mineral-rich herbal baths have been used across cultures for centuries to restore body and mind.",
  },
  {
    tag: "Skincare",
    date: "March 28, 2025",
    title: "5 rituals our therapists do every morning before 8am",
    excerpt: "The simple daily habits that keep our team's skin luminous, their energy calm, and their mindset centred.",
  },
]

// ─── Components ──────────────────────────────────────────────────────────────

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="text-accent h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-5 md:px-14">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/30 to-transparent" />
      <div className="relative flex w-full items-center justify-between">
        <a href="#" aria-label="Zen Spa home">
          <ZenSpaLogo className="h-7 w-auto text-white" />
        </a>
        <nav className="hidden items-center gap-8 text-sm md:flex">
          <a href="#services" className="text-white/80 hover:text-white transition-colors">
            Services
          </a>
          <a href="#about" className="text-white/80 hover:text-white transition-colors">
            About
          </a>
          <a href="#pricing" className="text-white/80 hover:text-white transition-colors">
            Pricing
          </a>
          <a href="#stories" className="text-white/80 hover:text-white transition-colors">
            Stories
          </a>
          <Button size="sm" className="bg-white text-foreground hover:bg-white/90" asChild>
            <a href="#booking">Book a Visit</a>
          </Button>
        </nav>
        <Button size="sm" className="md:hidden bg-white text-foreground hover:bg-white/90" asChild>
          <a href="#booking">Book</a>
        </Button>
      </div>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-svh items-center justify-center overflow-hidden">
      {/* Background image */}
      <Image
        src="/hero.jpg"
        alt="Zen Spa — luxury wellness treatments"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />
      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/45" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center gap-8 px-6 text-center text-white">
        <Badge className="bg-white/15 text-white border-white/30 rounded-full px-5 py-1.5 text-xs tracking-widest uppercase backdrop-blur-sm">
          House of Beauty
        </Badge>

        <h1 className="font-heading max-w-3xl text-5xl leading-[1.05] tracking-tight md:text-6xl lg:text-7xl xl:text-8xl">
          Luxury spa treatments for your{" "}
          <span className="italic">well-being</span>
        </h1>

        <p className="max-w-lg text-base leading-relaxed text-white/80">
          Step into a sanctuary where ancient healing traditions meet modern luxury.
          Every treatment is a curated ritual — crafted to bring you back to yourself.
        </p>

        <div className="flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" className="bg-accent hover:bg-accent/90 gap-2 px-10 text-white" asChild>
            <a href="#booking">
              Reserve Your Ritual <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="outline" className="border-white/50 text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm px-10" asChild>
            <a href="#services">All Services</a>
          </Button>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex items-center gap-8 text-sm text-white/70">
          <div className="text-center">
            <p className="font-heading text-2xl text-white">12+</p>
            <p className="text-xs tracking-wide">Treatments</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <p className="font-heading text-2xl text-white">4.9</p>
            <p className="text-xs tracking-wide">Avg. Rating</p>
          </div>
          <div className="h-8 w-px bg-white/20" />
          <div className="text-center">
            <p className="font-heading text-2xl text-white">8k+</p>
            <p className="text-xs tracking-wide">Guests Served</p>
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />
    </section>
  )
}

function Services() {
  return (
    <section id="services" className="px-6 py-24 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="outline" className="mb-3 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
              What We Offer
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl">
              Our <span className="text-accent italic">treatments</span>
            </h2>
          </div>
          <a href="#pricing" className="text-accent flex items-center gap-1.5 text-sm font-medium hover:gap-3 transition-all">
            View all services <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 lg:gap-6">
          {services.map((s, i) => {
            const Icon = s.icon
            return (
              <div
                key={s.title}
                className="group relative overflow-hidden rounded-2xl aspect-[4/5] cursor-pointer"
              >
                {/* Background: alternating olive/linen gradient tiles */}
                <div
                  className={`absolute inset-0 transition-transform duration-500 group-hover:scale-105 ${
                    i % 3 === 0
                      ? "bg-gradient-to-br from-accent/80 to-accent"
                      : i % 3 === 1
                      ? "bg-gradient-to-br from-secondary to-muted"
                      : "bg-gradient-to-br from-accent/60 to-accent/90"
                  }`}
                />
                {/* Leaf texture overlay on even cards */}
                {i % 2 === 0 && (
                  <Image
                    src="/bg-leaves.jpg"
                    alt=""
                    fill
                    className="object-cover mix-blend-overlay opacity-20"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-7">
                  <div
                    className={`mb-3 flex h-10 w-10 items-center justify-center rounded-full ${
                      i % 3 === 1 ? "bg-accent/15 text-accent" : "bg-white/20 text-white"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <p
                    className={`font-heading text-xl ${
                      i % 3 === 1 ? "text-foreground" : "text-white"
                    }`}
                  >
                    {s.title}
                  </p>
                  <p
                    className={`text-xs mt-0.5 ${
                      i % 3 === 1 ? "text-muted-foreground" : "text-white/70"
                    }`}
                  >
                    {s.subtitle}
                  </p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function About() {
  return (
    <section id="about" className="px-6 pb-24 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-center gap-12 md:grid-cols-2 md:gap-20">
          {/* Text */}
          <div className="flex flex-col gap-7">
            <div>
              <Badge variant="outline" className="mb-3 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
                Our Philosophy
              </Badge>
              <h2 className="font-heading text-4xl leading-[1.1] md:text-5xl">
                Wellness rooted{" "}
                <span className="text-accent italic">in nature</span>
              </h2>
            </div>
            <p className="text-muted-foreground leading-relaxed">
              At Zen Spa, we believe true well-being starts with what you put on —
              and into — your body. Every product we use is ethically sourced, every
              ritual thoughtfully designed, and every visit a step toward lasting
              renewal.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Founded on the principles of slow beauty and mindful restoration,
              our House of Beauty is a sanctuary designed to help you reconnect
              with the very best version of yourself.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-2">
              {[
                { label: "100% Natural", sub: "All products" },
                { label: "Certified", sub: "Therapists" },
                { label: "Award-winning", sub: "Since 2018" },
                { label: "Eco-certified", sub: "Sustainable" },
              ].map((item) => (
                <div key={item.label} className="flex flex-col gap-0.5">
                  <p className="font-heading text-lg">{item.label}</p>
                  <p className="text-muted-foreground text-sm">{item.sub}</p>
                </div>
              ))}
            </div>
            <div>
              <Button variant="outline" className="gap-2" asChild>
                <a href="#pricing">
                  Explore our rituals <ArrowRight className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative h-[480px] overflow-hidden rounded-2xl md:h-[600px]">
              <Image
                src="/hero.jpg"
                alt="Zen Spa — serene treatment environment"
                fill
                className="object-cover object-center"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            {/* Floating stat card */}
            <div className="bg-card border-border/60 absolute -bottom-6 -left-6 rounded-2xl border p-5 shadow-lg md:-left-10">
              <p className="font-heading text-3xl">8k+</p>
              <p className="text-muted-foreground text-sm">Happy guests</p>
              <div className="mt-2 flex -space-x-2">
                {["SR", "MT", "LM", "KV"].map((init) => (
                  <div
                    key={init}
                    className="bg-accent/20 text-accent flex h-7 w-7 items-center justify-center rounded-full border-2 border-white text-[9px] font-medium"
                  >
                    {init}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Pricing() {
  return (
    <section id="pricing" className="bg-muted/30 px-6 py-24 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Badge variant="outline" className="mb-3 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
            Investment in Yourself
          </Badge>
          <h2 className="font-heading mb-4 text-4xl md:text-5xl">
            Choose your <span className="text-accent italic">ritual</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-base leading-relaxed">
            Every plan includes access to our thermal facilities. Direct booking
            always includes a complimentary botanical welcome drink.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <Card
              key={plan.name}
              className={`relative overflow-hidden ${
                plan.highlight
                  ? "border-accent/50 shadow-lg ring-1 ring-accent/20"
                  : "border-border/60"
              }`}
            >
              {plan.highlight && (
                <div className="bg-accent absolute inset-x-0 top-0 py-1.5 text-center text-xs font-medium tracking-widest text-white uppercase">
                  Most Popular
                </div>
              )}
              <CardContent className={`flex flex-col gap-6 p-7 ${plan.highlight ? "pt-11" : ""}`}>
                <div>
                  <p className="text-muted-foreground mb-1 text-xs tracking-widest uppercase">{plan.tagline}</p>
                  <h3 className="font-heading text-2xl">{plan.name}</h3>
                </div>
                <div className="flex items-end gap-1">
                  <p className="font-heading text-4xl">{plan.price}</p>
                  <p className="text-muted-foreground mb-1 text-sm">/ session</p>
                </div>
                <Separator />
                <ul className="flex flex-col gap-3">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2.5 text-sm">
                      <span className="bg-accent/10 text-accent mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full">
                        <Check className="h-2.5 w-2.5" />
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button
                  className={`mt-auto w-full ${plan.highlight ? "" : "variant-outline"}`}
                  variant={plan.highlight ? "default" : "outline"}
                  asChild
                >
                  <a href="#booking">{plan.cta}</a>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Testimonials() {
  return (
    <section id="stories" className="px-6 py-24 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 text-center">
          <Badge variant="outline" className="mb-3 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
            Guest Stories
          </Badge>
          <h2 className="font-heading text-4xl md:text-5xl">
            Words from our <span className="text-accent italic">guests</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/60 flex flex-col">
              <CardContent className="flex flex-grow flex-col gap-5 p-7">
                <StarRow count={t.stars} />
                <p className="text-muted-foreground flex-grow text-base leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <Separator />
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-accent/15 text-accent text-xs font-medium">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{t.name}</p>
                    <p className="text-muted-foreground text-xs">{t.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

function Blog() {
  return (
    <section className="bg-muted/30 px-6 py-24 md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
          <div>
            <Badge variant="outline" className="mb-3 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
              Journal
            </Badge>
            <h2 className="font-heading text-4xl md:text-5xl">
              Wellness <span className="text-accent italic">insights</span>
            </h2>
          </div>
          <a href="#" className="text-accent flex items-center gap-1.5 text-sm font-medium hover:gap-3 transition-all">
            All articles <ArrowRight className="h-4 w-4" />
          </a>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          {blogPosts.map((post, i) => (
            <a key={post.title} href="#" className="group flex flex-col gap-5 cursor-pointer">
              <div className="relative h-56 overflow-hidden rounded-2xl">
                <Image
                  src={i === 0 ? "/hero.jpg" : "/bg-leaves.jpg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors" />
              </div>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <span className="bg-accent/10 text-accent rounded-full px-3 py-0.5">{post.tag}</span>
                  <span>{post.date}</span>
                </div>
                <h3 className="font-heading text-xl leading-snug group-hover:text-accent transition-colors">
                  {post.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{post.excerpt}</p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}

function Newsletter() {
  return (
    <section id="booking" className="bg-accent px-6 py-24 md:px-14">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-8 text-center text-white">
        <div>
          <p className="mb-3 text-xs tracking-widest uppercase text-white/60">Reserve Your Visit</p>
          <h2 className="font-heading text-4xl leading-tight md:text-5xl">
            Your moment of{" "}
            <span className="italic">stillness</span> awaits
          </h2>
        </div>
        <p className="max-w-md text-base leading-relaxed text-white/75">
          Book directly and receive a complimentary botanical welcome drink and
          access to our thermal pool before your treatment.
        </p>

        {/* Email signup */}
        <div className="flex w-full max-w-md gap-2">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 rounded-full bg-white/15 px-5 py-3 text-sm text-white placeholder:text-white/50 outline-none focus:bg-white/20 border border-white/20"
          />
          <Button className="rounded-full bg-white text-accent hover:bg-white/90 px-6 font-medium shrink-0">
            Subscribe
          </Button>
        </div>

        <Separator className="bg-white/20 w-full" />

        <div className="flex flex-col items-center gap-4 text-sm text-white/70 sm:flex-row">
          <span className="flex items-center gap-2">
            <Phone className="h-4 w-4" />
            +31 (0)20 123 4567
          </span>
          <div className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4" />
            12 Serenity Lane, Amsterdam
          </span>
          <div className="hidden h-4 w-px bg-white/20 sm:block" />
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Open daily 9am – 9pm
          </span>
        </div>

        <div className="flex gap-6">
          <Button size="lg" className="bg-white text-accent hover:bg-white/90 gap-2 px-10">
            Book Online <ArrowRight className="h-4 w-4" />
          </Button>
          <Button size="lg" variant="outline" className="border-white/40 text-white bg-white/10 hover:bg-white/20 gap-2 px-8">
            <Phone className="h-4 w-4" /> Call Us
          </Button>
        </div>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="bg-foreground px-6 py-14 text-white md:px-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-4">
          {/* Brand */}
          <div className="flex flex-col gap-4 md:col-span-1">
            <ZenSpaLogo className="h-6 w-auto text-white" />
            <p className="text-white/50 text-sm leading-relaxed">
              A sanctuary for the senses. House of Beauty since 2018.
            </p>
            <div className="flex gap-3">
              <div className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 text-white/50 hover:text-white hover:border-white/50 cursor-pointer transition-colors">
                <span className="text-xs">IG</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-white/40">Services</p>
            {["Facials", "Massage", "Body Wraps", "Hydrotherapy", "Manicures"].map((s) => (
              <a key={s} href="#services" className="text-sm text-white/60 hover:text-white transition-colors">{s}</a>
            ))}
          </div>

          {/* Company */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-white/40">Company</p>
            {["About Us", "Our Philosophy", "Gift Cards", "Careers", "Press"].map((s) => (
              <a key={s} href="#about" className="text-sm text-white/60 hover:text-white transition-colors">{s}</a>
            ))}
          </div>

          {/* Hours */}
          <div className="flex flex-col gap-3">
            <p className="text-xs tracking-widest uppercase text-white/40">Visit Us</p>
            <p className="text-sm text-white/60">12 Serenity Lane</p>
            <p className="text-sm text-white/60">Amsterdam</p>
            <p className="text-sm text-white/60 mt-2">Mon–Sun: 9am – 9pm</p>
            <a href="tel:+31201234567" className="text-sm text-white/60 hover:text-white transition-colors">+31 (0)20 123 4567</a>
          </div>
        </div>

        <Separator className="my-10 bg-white/10" />

        <div className="flex flex-col items-center justify-between gap-4 text-xs text-white/30 sm:flex-row">
          <p>© 2025 Zen Spa. All rights reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-white/60 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white/60 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-white/60 transition-colors">Cookie Settings</a>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Page() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Services />
        <About />
        <Pricing />
        <Testimonials />
        <Blog />
        <Newsletter />
      </main>
      <Footer />
    </>
  )
}
