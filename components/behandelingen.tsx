'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Clock, Sparkles, User, Pen, Scissors } from 'lucide-react'

type Treatment = {
  name: string
  duration?: string
  price: string
  description: string
  tag?: string
  image?: string
}

type Group = {
  subtitle?: string
  items: Treatment[]
}

type TabData = {
  groups: Group[]
  footerNote?: string
}

type TabKey = 'gezicht' | 'lichaam' | 'pmu' | 'ontharen'

const TABS: { key: TabKey; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
  { key: 'gezicht',  label: 'Gezicht',              icon: Sparkles },
  { key: 'lichaam',  label: 'Lichaam',              icon: User     },
  { key: 'pmu',      label: 'Permanente Make-up',   icon: Pen      },
  { key: 'ontharen', label: 'Ontharen',             icon: Scissors },
]

const A = '/hero.jpg'
const B = '/bg-leaves.jpg'

const DATA: Record<TabKey, TabData> = {
  gezicht: {
    groups: [{
      items: [
        { name: 'Mini Zen Moment',             duration: '30 min',  price: '€30',    image: A, description: 'Een snelle opfrisser met reiniging en gerichte hydratatie voor jouw huid.' },
        { name: 'Basis Gezichtsbehandeling',   duration: '50 min',  price: '€62,50', image: B, description: 'Grondige reiniging, peeling en basishuidverzorging afgestemd op jouw huidtype.' },
        { name: 'Classic Gezichtsbehandeling', duration: '80 min',  price: '€70',    image: A, description: 'Onze meest geliefde behandeling: uitgebreide verzorging voor een stralende huid.' },
        { name: 'Deluxe Gezichtsbehandeling',  duration: '120 min', price: '€85',    image: B, description: 'De ultieme gezichtsverzorging met extra masker, massage en verwennende stappen.' },
        { name: 'Herenbehandeling',            duration: '80 min',  price: '€70',    image: A, description: 'Speciaal voor de mannelijke huid — poriënreiniging, hydratatie en dieptewerking.' },
        { name: '65+ Behandeling',             duration: '50 min',  price: '€55',    image: B, description: 'Zachte, voedende behandeling op maat voor de rijpere huid.' },
        { name: 'Tienerbehandeling',           duration: '50 min',  price: '€45',    image: A, description: 'Milde huidverzorging voor jonge huid met aandacht voor onzuiverheden.' },
        { name: 'Microneedling',               duration: '60 min',  price: '€95',    image: B, description: 'Stimuleert huidvernieuwing en collageenproductie voor verfijnde poriën.', tag: 'Nieuw' },
        { name: 'Galvanic Spa',                duration: '30 min',  price: '€45',    image: A, description: 'Iontoforese voor diepgaande productopname en een direct zichtbare huidgloed.' },
      ]
    }]
  },
  lichaam: {
    groups: [{
      items: [
        { name: 'Rugbehandeling',               duration: '30 min',     price: '€40', image: A, description: 'Grondige reiniging, peeling en verzorging van de rug — ideaal bij vermoeidheid of onzuiverheden.' },
        { name: 'Pedicure incl. voetenscrub',   duration: 'ca. 60 min', price: '€45', image: B, description: 'Volledige voetverzorging met exfoliërende scrub voor zijdezachte voeten en verzorgde nagels.' },
      ]
    }]
  },
  pmu: {
    groups: [
      {
        subtitle: 'Wenkbrauwen',
        items: [
          { name: 'Hairstroke / Microblading',                price: '€200',       image: A, description: 'Haar-voor-haar techniek voor ultranaturlijke, goed gevulde wenkbrauwen.' },
          { name: 'Powder / Ombre Brows',                     price: '€250',       image: B, description: 'Zachte poederkleur die vervaagt van licht naar donker voor een make-up effect.' },
          { name: 'Combi Brows',                              price: '€270',       image: A, description: 'Combinatie van hairstroke en powder voor volle, definitieve wenkbrauwen.' },
          { name: 'Ontbrekende stukjes / littekens opvullen', price: 'Vanaf €100', image: B, description: 'Correctie en camouflage van kale plekken, asymmetrie of littekens.' },
        ]
      },
      {
        subtitle: 'Ogen',
        items: [
          { name: 'Infralash / Deepliner (boven of onder)', price: '€150', image: A, description: 'Subtiele kleurlijn langs de wimperrand voor meer diepte en expressie.' },
          { name: 'Deepliner (boven én onder)',             price: '€220', image: B, description: 'Volledige permanente eyeliner voor een intensere, tijdloze blik.' },
        ]
      },
      {
        subtitle: 'Lippen',
        items: [
          { name: 'Lipliner',  price: '€275', image: A, description: 'Precieze permanente lipomlijning voor een vollere, symmetrische mond.' },
          { name: 'Full Lips', price: '€350', image: B, description: 'Volledige kleurpigmentatie van lip tot lip voor een permanent mooie mond.' },
        ]
      }
    ]
  },
  ontharen: {
    footerNote: 'Mondkapje is verplicht bij alle onthaarbehandelingen.',
    groups: [{
      items: [
        { name: '1 zone',                   price: '€5',  image: A, description: 'Bovenlip, kin, kaaklyn of onderrug.' },
        { name: 'Bovenlip + kin',           price: '€9',  image: B, description: 'Twee zones gecombineerd in één efficiënte behandeling.' },
        { name: 'Bovenlip + kin + kaaklyn', price: '€15', image: A, description: 'Drie zones in één sessie voor volledig gezichtsontharing.' },
        { name: 'Extra zone (toeslag)',     price: '+€5', image: B, description: 'Voeg een extra zone toe aan je bestaande behandeling.' },
      ]
    }]
  },
}

function TreatmentCard({ t }: { t: Treatment }) {
  return (
    <div className="flex gap-5">
      {/* Oval / capsule image */}
      <div className="relative h-[136px] w-[84px] shrink-0 overflow-hidden rounded-full">
        <Image
          src={t.image ?? '/hero.jpg'}
          alt=""
          fill
          aria-hidden
          className="object-cover object-center"
          sizes="84px"
        />
      </div>

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col justify-center gap-1.5">
        <p className="text-[15px] font-semibold leading-snug text-foreground md:text-[16px]">{t.name}</p>
        <div className="h-px bg-foreground/10" aria-hidden />
        <p className="font-heading text-[22px] leading-none text-accent md:text-[24px]">{t.price}</p>
        <p className="text-[13px] leading-[1.6] text-muted-foreground">{t.description}</p>
        {(t.duration || t.tag) && (
          <div className="mt-1 flex flex-wrap gap-1.5">
            {t.duration && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent/8 px-2.5 py-1 text-[11px] font-medium text-accent">
                <Clock className="h-3 w-3" aria-hidden />
                {t.duration}
              </span>
            )}
            {t.tag && (
              <span className="rounded-full bg-accent px-2.5 py-1 text-[11px] font-medium text-white">
                {t.tag}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export function Behandelingen() {
  const [active, setActive] = useState<TabKey>('gezicht')
  const tab = DATA[active]

  return (
    <section id="pricing" aria-labelledby="behandelingen-heading" className="py-24 md:py-36 lg:py-48">
      <div className="mx-auto max-w-[1840px] px-4 md:px-6">

        {/* Header — centered */}
        <div className="mb-14 flex flex-col items-center gap-5 text-center">
          <span className="text-[14px] font-semibold tracking-[0.18em] text-accent uppercase">
            Ons aanbod
          </span>
          <h2
            id="behandelingen-heading"
            className="font-heading text-[40px] leading-[1.05] tracking-tight md:text-[54px] lg:text-[68px] xl:text-[80px]"
          >
            Behandelingen
          </h2>
          <p className="max-w-[600px] text-[17px] leading-[1.85] text-muted-foreground">
            Professionele schoonheidsbehandelingen in Almere Buiten — van gezichtsverzorging en permanente make-up tot ontharing. Meer dan 20 jaar ervaring.
          </p>
        </div>

        {/* Tabs — single unified pill container */}
        <div
          className="mb-12 rounded-[2rem] bg-accent/[0.07] p-2"
          role="tablist"
          aria-label="Behandelcategorieën"
        >
          <div className="grid grid-cols-2 gap-1 sm:grid-cols-4">
            {TABS.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                role="tab"
                aria-selected={active === key}
                aria-controls={`tab-panel-${key}`}
                onClick={() => setActive(key)}
                className={`flex cursor-pointer items-center justify-center gap-2.5 rounded-[1.5rem] px-4 py-4 text-[13px] font-semibold transition-all duration-200 sm:px-5 sm:text-[14px] ${
                  active === key
                    ? 'bg-white text-accent shadow-md shadow-foreground/8'
                    : 'text-foreground/50 hover:text-foreground/75'
                }`}
              >
                <Icon className="h-5 w-5 shrink-0" aria-hidden />
                <span className="whitespace-nowrap">{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Panel */}
        <div
          id={`tab-panel-${active}`}
          role="tabpanel"
          key={active}
        >
          {tab.groups.map((group, gi) => (
            <div key={gi} className={gi > 0 ? 'mt-14' : ''}>
              {group.subtitle && (
                <p className="mb-7 text-[11px] font-semibold tracking-[0.22em] text-foreground/38 uppercase">
                  {group.subtitle}
                </p>
              )}
              <div className="grid gap-8 sm:grid-cols-2 md:gap-10 lg:gap-12">
                {group.items.map((t) => (
                  <TreatmentCard key={t.name} t={t} />
                ))}
              </div>
            </div>
          ))}

          {tab.footerNote && (
            <p className="mt-10 text-[13px] italic text-muted-foreground/60">
              * {tab.footerNote}
            </p>
          )}
        </div>

        {/* CTA */}
        <div className="mt-16 border-t border-foreground/10 pt-10 text-center">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 rounded-full bg-accent px-10 py-5 text-[17px] font-medium text-white transition-all duration-300 hover:bg-accent/88 hover:shadow-md hover:shadow-accent/20"
          >
            Maak een afspraak
          </a>
        </div>
      </div>
    </section>
  )
}
