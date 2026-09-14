import { BadgeCheck, Leaf, Lock, Sparkles, Clock, Users } from 'lucide-react'

const items = [
  { icon: BadgeCheck, label: 'Gecertificeerd' },
  { icon: Leaf,       label: 'Natuurlijke producten' },
  { icon: Lock,       label: 'Privacy' },
  { icon: Sparkles,   label: '25+ behandelingen' },
  { icon: Clock,      label: '20+ jaar ervaring' },
  { icon: Users,      label: '1000+ tevreden klanten' },
]

export function TrustPillars() {
  return (
    <section
      aria-label="Onze kernwaarden"
      className="relative z-10 -mt-32 overflow-hidden rounded-t-[40px] bg-background pb-4 md:-mt-48 md:rounded-t-[112px] md:pb-6"
    >
      <div className="relative overflow-hidden pt-12 pb-0 md:py-16">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-48 bg-gradient-to-r from-background to-transparent md:w-72" aria-hidden />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-48 bg-gradient-to-l from-background to-transparent md:w-72" aria-hidden />
        <div className="marquee-track">
          {[...items, ...items].map((item, i) => {
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
