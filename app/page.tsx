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
  Flower2,
} from "lucide-react"

// ─── Data ────────────────────────────────────────────────────────────────────

const benefits = [
  {
    icon: Leaf,
    title: "100% Natural",
    description:
      "Every product and treatment uses ethically sourced, organic botanicals free from harsh chemicals.",
  },
  {
    icon: Droplets,
    title: "Deep Hydration",
    description:
      "Our mineral-rich waters and hydrotherapy pools nourish skin from the inside out.",
  },
  {
    icon: Wind,
    title: "Stress Relief",
    description:
      "Science-backed relaxation techniques designed to reset your nervous system completely.",
  },
  {
    icon: Sparkles,
    title: "Radiant Results",
    description:
      "Visible rejuvenation after a single visit, with cumulative benefits that last for weeks.",
  },
]

const treatments = [
  {
    badge: "Signature",
    title: "Zen Renewal Ritual",
    description:
      "A full-body journey combining hot stone massage, aromatic body wrap, and a personalised facial tailored to your skin.",
    duration: "120 min",
    price: "$280",
    tags: ["Stone Therapy", "Aromatherapy", "Facial"],
  },
  {
    badge: "Popular",
    title: "Alpine Mineral Soak",
    description:
      "Immerse yourself in our signature mineral-infused waters sourced from mountain springs, followed by a restorative scalp ritual.",
    duration: "90 min",
    price: "$195",
    tags: ["Hydrotherapy", "Scalp Ritual"],
  },
  {
    badge: "New",
    title: "Bamboo Fusion Massage",
    description:
      "Warm bamboo canes glide across muscles to release deep-seated tension while grounding essential oils calm the mind.",
    duration: "75 min",
    price: "$165",
    tags: ["Deep Tissue", "Bamboo", "Essential Oils"],
  },
  {
    badge: "Classic",
    title: "Luminous Glow Facial",
    description:
      "A triple-enzyme exfoliation paired with vitamin-C infusion and jade-roller lymphatic drainage for a lit-from-within complexion.",
    duration: "60 min",
    price: "$140",
    tags: ["Exfoliation", "Vitamin C", "Lymphatic"],
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

// ─── Components ──────────────────────────────────────────────────────────────

function StarRow({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="text-primary h-3.5 w-3.5 fill-current" />
      ))}
    </div>
  )
}

// ─── Sections ────────────────────────────────────────────────────────────────

function Nav() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between px-6 py-4 backdrop-blur-sm md:px-12">
      <div className="flex items-center gap-2">
        <Flower2 className="text-primary h-5 w-5" />
        <span className="font-heading text-lg tracking-wide">Zen Spa</span>
      </div>
      <nav className="hidden items-center gap-8 text-sm md:flex">
        <a href="#benefits" className="text-muted-foreground hover:text-foreground transition-colors">
          Philosophy
        </a>
        <a href="#treatments" className="text-muted-foreground hover:text-foreground transition-colors">
          Treatments
        </a>
        <a href="#testimonials" className="text-muted-foreground hover:text-foreground transition-colors">
          Stories
        </a>
        <Button size="sm" asChild>
          <a href="#booking">Book a Visit</a>
        </Button>
      </nav>
      <Button size="sm" className="md:hidden" asChild>
        <a href="#booking">Book</a>
      </Button>
    </header>
  )
}

function Hero() {
  return (
    <section className="relative flex min-h-svh flex-col items-center justify-center overflow-hidden px-6 text-center">
      {/* Decorative background rings */}
      <div className="border-primary/10 absolute h-[600px] w-[600px] rounded-full border" />
      <div className="border-primary/7 absolute h-[800px] w-[800px] rounded-full border" />
      <div className="border-primary/4 absolute h-[1000px] w-[1000px] rounded-full border" />

      <div className="relative z-10 flex max-w-3xl flex-col items-center gap-6">
        <Badge variant="secondary" className="rounded-full px-4 py-1 text-xs tracking-widest uppercase">
          Luxury Wellness Retreat
        </Badge>

        <h1 className="font-heading text-5xl leading-[1.1] tracking-tight md:text-7xl">
          Restore.{" "}
          <span className="text-primary italic">Renew.</span>
          <br />
          Rediscover.
        </h1>

        <p className="text-muted-foreground max-w-xl text-base leading-relaxed md:text-lg">
          Step into a sanctuary where ancient healing traditions meet modern
          luxury. Every treatment is a curated ritual — crafted to bring you
          back to yourself.
        </p>

        <div className="mt-2 flex flex-col items-center gap-3 sm:flex-row">
          <Button size="lg" className="gap-2 px-8" asChild>
            <a href="#booking">
              Reserve Your Ritual <ChevronRight className="h-4 w-4" />
            </a>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <a href="#treatments">Explore Treatments</a>
          </Button>
        </div>

        <div className="mt-4 flex items-center gap-6 text-sm">
          <div className="text-center">
            <p className="font-heading text-2xl">12+</p>
            <p className="text-muted-foreground text-xs tracking-wide">Treatments</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="text-center">
            <p className="font-heading text-2xl">4.9</p>
            <p className="text-muted-foreground text-xs tracking-wide">Avg. Rating</p>
          </div>
          <Separator orientation="vertical" className="h-8" />
          <div className="text-center">
            <p className="font-heading text-2xl">8k+</p>
            <p className="text-muted-foreground text-xs tracking-wide">Guests Served</p>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="from-background pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t to-transparent" />
    </section>
  )
}

function Benefits() {
  return (
    <section id="benefits" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
            Our Philosophy
          </Badge>
          <h2 className="font-heading mb-4 text-4xl md:text-5xl">
            Wellness rooted in <span className="text-primary italic">nature</span>
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-base leading-relaxed">
            We believe true well-being starts with what you put on — and into — your body. Everything we offer is guided by that principle.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {benefits.map((b) => {
            const Icon = b.icon
            return (
              <Card key={b.title} className="group border-border/60 relative overflow-hidden transition-shadow hover:shadow-md">
                <CardContent className="flex flex-col gap-4 p-6">
                  <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-heading mb-1 text-lg">{b.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{b.description}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </section>
  )
}

function Treatments() {
  return (
    <section id="treatments" className="bg-muted/40 px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
            The Menu
          </Badge>
          <h2 className="font-heading mb-4 text-4xl md:text-5xl">
            Curated <span className="text-primary italic">rituals</span> for every need
          </h2>
          <p className="text-muted-foreground mx-auto max-w-md text-base leading-relaxed">
            Each treatment is a complete experience — not just a service. Our therapists guide you through every step.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {treatments.map((t) => (
            <Card key={t.title} className="group border-border/60 overflow-hidden transition-shadow hover:shadow-md">
              <CardContent className="flex flex-col gap-4 p-6">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex flex-col gap-1">
                    <Badge variant="secondary" className="w-fit rounded-full text-xs">
                      {t.badge}
                    </Badge>
                    <h3 className="font-heading text-xl">{t.title}</h3>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="font-heading text-2xl text-primary">{t.price}</p>
                    <p className="text-muted-foreground flex items-center justify-end gap-1 text-xs">
                      <Clock className="h-3 w-3" />
                      {t.duration}
                    </p>
                  </div>
                </div>

                <p className="text-muted-foreground text-sm leading-relaxed">{t.description}</p>

                <div className="flex flex-wrap gap-2">
                  {t.tags.map((tag) => (
                    <span
                      key={tag}
                      className="bg-primary/8 text-primary rounded-full px-3 py-0.5 text-xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <Button variant="outline" size="sm" className="mt-1 w-full" asChild>
                  <a href="#booking">Book This Treatment</a>
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
    <section id="testimonials" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-5xl">
        <div className="mb-16 text-center">
          <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
            Guest Stories
          </Badge>
          <h2 className="font-heading mb-4 text-4xl md:text-5xl">
            Words from our <span className="text-primary italic">guests</span>
          </h2>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <Card key={t.name} className="border-border/60 flex flex-col">
              <CardContent className="flex flex-grow flex-col gap-4 p-6">
                <StarRow count={t.stars} />
                <p className="text-muted-foreground flex-grow text-sm leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <Separator />
                <div className="flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarFallback className="bg-primary/15 text-primary text-xs font-medium">
                      {t.initials}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{t.name}</p>
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

function BookingCTA() {
  return (
    <section id="booking" className="px-6 py-24 md:px-12">
      <div className="mx-auto max-w-3xl">
        <Card className="border-primary/20 bg-primary/5 overflow-hidden">
          <CardContent className="flex flex-col items-center gap-8 px-8 py-16 text-center md:px-16">
            <div>
              <Badge variant="outline" className="mb-4 rounded-full px-4 py-1 text-xs tracking-widest uppercase">
                Reserve Your Visit
              </Badge>
              <h2 className="font-heading mb-4 text-4xl md:text-5xl">
                Your moment of<br />
                <span className="text-primary italic">stillness</span> awaits
              </h2>
              <p className="text-muted-foreground mx-auto max-w-sm text-base leading-relaxed">
                Book directly and receive a complimentary botanical welcome drink and access to our thermal pool before your treatment.
              </p>
            </div>

            <div className="flex flex-col items-center gap-3 sm:flex-row">
              <Button size="lg" className="gap-2 px-10">
                <Phone className="h-4 w-4" />
                Call to Book
              </Button>
              <Button size="lg" variant="outline" className="gap-2 px-10">
                Book Online
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col items-center gap-4 text-sm sm:flex-row">
              <span className="text-muted-foreground flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                12 Serenity Lane, Wellness Quarter
              </span>
              <Separator orientation="vertical" className="hidden h-4 sm:block" />
              <span className="text-muted-foreground flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Open daily 9am – 9pm
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="border-border/40 border-t px-6 py-8 md:px-12">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 text-sm sm:flex-row">
        <div className="flex items-center gap-2">
          <Flower2 className="text-primary h-4 w-4" />
          <span className="font-heading">Zen Spa</span>
        </div>
        <p className="text-muted-foreground text-xs">
          © 2025 Zen Spa. All rights reserved.
        </p>
        <div className="text-muted-foreground flex gap-4 text-xs">
          <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
          <a href="#" className="hover:text-foreground transition-colors">Terms</a>
          <a href="#" className="hover:text-foreground transition-colors">Contact</a>
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
        <Benefits />
        <Treatments />
        <Testimonials />
        <BookingCTA />
      </main>
      <Footer />
    </>
  )
}
