export type Treatment = {
  name: string
  slug: string
  /** Display string, e.g. "50 min" or "ca. 60 min" */
  duration?: string
  /** Actual treatment time in minutes — used for scheduling */
  durationMinutes: number
  /** Time reserved before the treatment starts (client intake, prep) */
  prepMinutes: number
  /** Cleanup/notes time after the treatment ends */
  bufferMinutes: number
  /** Whether clients can book this online; false for add-ons */
  bookable: boolean
  price: string
  description: string
  tag?: string
  image?: string
  category?: string
}

export type Group = {
  subtitle?: string
  items: Treatment[]
}

export type TabData = {
  groups: Group[]
  footerNote?: string
}

export type TabKey = 'gezicht' | 'lichaam' | 'pmu' | 'ontharen'

const A = '/hero.jpg'
const B = '/bg-leaves.jpg'

export const DATA: Record<TabKey, TabData> = {
  gezicht: {
    groups: [{
      items: [
        { name: 'Mini Zen Moment',             slug: 'mini-zen-moment',             duration: '30 min',  durationMinutes: 30,  prepMinutes: 5,  bufferMinutes: 10, bookable: true, price: '€30',    image: A, category: 'Gezicht', description: 'Een snelle opfrisser met reiniging en gerichte hydratatie voor jouw huid.' },
        { name: 'Basis Gezichtsbehandeling',   slug: 'basis-gezichtsbehandeling',   duration: '50 min',  durationMinutes: 50,  prepMinutes: 10, bufferMinutes: 10, bookable: true, price: '€62,50', image: B, category: 'Gezicht', description: 'Grondige reiniging, peeling en basishuidverzorging afgestemd op jouw huidtype.' },
        { name: 'Classic Gezichtsbehandeling', slug: 'classic-gezichtsbehandeling', duration: '80 min',  durationMinutes: 80,  prepMinutes: 10, bufferMinutes: 10, bookable: true, price: '€70',    image: A, category: 'Gezicht', description: 'Onze meest geliefde behandeling: uitgebreide verzorging voor een stralende huid.', tag: 'Meest geliefd' },
        { name: 'Deluxe Gezichtsbehandeling',  slug: 'deluxe-gezichtsbehandeling',  duration: '120 min', durationMinutes: 120, prepMinutes: 10, bufferMinutes: 15, bookable: true, price: '€85',    image: B, category: 'Gezicht', description: 'De ultieme gezichtsverzorging met extra masker, massage en verwennende stappen.' },
        { name: 'Herenbehandeling',            slug: 'herenbehandeling',            duration: '80 min',  durationMinutes: 80,  prepMinutes: 10, bufferMinutes: 10, bookable: true, price: '€70',    image: A, category: 'Gezicht', description: 'Speciaal voor de mannelijke huid — poriënreiniging, hydratatie en dieptewerking.' },
        { name: '65+ Behandeling',             slug: '65-plus-behandeling',         duration: '50 min',  durationMinutes: 50,  prepMinutes: 10, bufferMinutes: 10, bookable: true, price: '€55',    image: B, category: 'Gezicht', description: 'Zachte, voedende behandeling op maat voor de rijpere huid.' },
        { name: 'Tienerbehandeling',           slug: 'tienerbehandeling',           duration: '50 min',  durationMinutes: 50,  prepMinutes: 10, bufferMinutes: 10, bookable: true, price: '€45',    image: A, category: 'Gezicht', description: 'Milde huidverzorging voor jonge huid met aandacht voor onzuiverheden.' },
        { name: 'Microneedling',               slug: 'microneedling',               duration: '60 min',  durationMinutes: 60,  prepMinutes: 10, bufferMinutes: 15, bookable: true, price: '€95',    image: B, category: 'Gezicht', description: 'Stimuleert huidvernieuwing en collageenproductie voor verfijnde poriën.', tag: 'Nieuw' },
        { name: 'Galvanic Spa',                slug: 'galvanic-spa',                duration: '30 min',  durationMinutes: 30,  prepMinutes: 5,  bufferMinutes: 10, bookable: true, price: '€45',    image: A, category: 'Gezicht', description: 'Iontoforese voor diepgaande productopname en een direct zichtbare huidgloed.' },
      ]
    }]
  },
  lichaam: {
    groups: [{
      items: [
        { name: 'Rugbehandeling',             slug: 'rugbehandeling', duration: '30 min',     durationMinutes: 30, prepMinutes: 5,  bufferMinutes: 10, bookable: true, price: '€40', image: A, category: 'Lichaam', description: 'Grondige reiniging, peeling en verzorging van de rug — ideaal bij vermoeidheid of onzuiverheden.' },
        { name: 'Pedicure incl. voetenscrub', slug: 'pedicure',       duration: 'ca. 60 min', durationMinutes: 60, prepMinutes: 10, bufferMinutes: 10, bookable: true, price: '€45', image: B, category: 'Lichaam', description: 'Volledige voetverzorging met exfoliërende scrub voor zijdezachte voeten en verzorgde nagels.', tag: 'Meest geliefd' },
      ]
    }]
  },
  pmu: {
    groups: [
      {
        subtitle: 'Wenkbrauwen',
        items: [
          { name: 'Hairstroke / Microblading',                slug: 'hairstroke-microblading',  durationMinutes: 180, prepMinutes: 15, bufferMinutes: 20, bookable: true, price: '€200',       image: A, category: 'Permanente Make-up', description: 'Haar-voor-haar techniek voor ultranaturlijke, goed gevulde wenkbrauwen.' },
          { name: 'Powder / Ombre Brows',                     slug: 'powder-ombre-brows',       durationMinutes: 180, prepMinutes: 15, bufferMinutes: 20, bookable: true, price: '€250',       image: B, category: 'Permanente Make-up', description: 'Zachte poederkleur die vervaagt van licht naar donker voor een make-up effect.' },
          { name: 'Combi Brows',                              slug: 'combi-brows',              durationMinutes: 210, prepMinutes: 15, bufferMinutes: 20, bookable: true, price: '€270',       image: A, category: 'Permanente Make-up', description: 'Combinatie van hairstroke en powder voor volle, definitieve wenkbrauwen.', tag: 'Meest geliefd' },
          { name: 'Ontbrekende stukjes / littekens opvullen', slug: 'ontbrekende-stukjes',      durationMinutes: 90,  prepMinutes: 15, bufferMinutes: 15, bookable: true, price: 'Vanaf €100', image: B, category: 'Permanente Make-up', description: 'Correctie en camouflage van kale plekken, asymmetrie of littekens.' },
        ]
      },
      {
        subtitle: 'Ogen',
        items: [
          { name: 'Infralash / Deepliner (boven of onder)', slug: 'infralash-deepliner',      durationMinutes: 120, prepMinutes: 15, bufferMinutes: 15, bookable: true, price: '€150', image: A, category: 'Permanente Make-up', description: 'Subtiele kleurlijn langs de wimperrand voor meer diepte en expressie.' },
          { name: 'Deepliner (boven én onder)',             slug: 'deepliner-boven-en-onder', durationMinutes: 150, prepMinutes: 15, bufferMinutes: 20, bookable: true, price: '€220', image: B, category: 'Permanente Make-up', description: 'Volledige permanente eyeliner voor een intensere, tijdloze blik.' },
        ]
      },
      {
        subtitle: 'Lippen',
        items: [
          { name: 'Lipliner',  slug: 'lipliner',  durationMinutes: 150, prepMinutes: 15, bufferMinutes: 20, bookable: true, price: '€275', image: A, category: 'Permanente Make-up', description: 'Precieze permanente lipomlijning voor een vollere, symmetrische mond.' },
          { name: 'Full Lips', slug: 'full-lips', durationMinutes: 180, prepMinutes: 15, bufferMinutes: 20, bookable: true, price: '€350', image: B, category: 'Permanente Make-up', description: 'Volledige kleurpigmentatie van lip tot lip voor een permanent mooie mond.' },
        ]
      }
    ]
  },
  ontharen: {
    groups: [{
      items: [
        { name: '1 zone',                   slug: 'ontharen-1-zone',      durationMinutes: 10, prepMinutes: 5, bufferMinutes: 5, bookable: true,  price: '€5',  image: A, category: 'Ontharen', description: 'Bovenlip, kin, kaaklyn of onderrug.' },
        { name: 'Bovenlip + kin',           slug: 'bovenlip-kin',         durationMinutes: 15, prepMinutes: 5, bufferMinutes: 5, bookable: true,  price: '€9',  image: B, category: 'Ontharen', description: 'Twee zones gecombineerd in één efficiënte behandeling.' },
        { name: 'Bovenlip + kin + kaaklyn', slug: 'bovenlip-kin-kaaklyn', durationMinutes: 20, prepMinutes: 5, bufferMinutes: 5, bookable: true,  price: '€15', image: A, category: 'Ontharen', description: 'Drie zones in één sessie voor volledig gezichtsontharing.' },
        { name: 'Extra zone (toeslag)',     slug: 'extra-zone',           durationMinutes: 10, prepMinutes: 0, bufferMinutes: 5, bookable: false, price: '+€5', image: B, category: 'Ontharen', description: 'Voeg een extra zone toe aan je bestaande behandeling.' },
      ]
    }]
  },
}

export function getAllTreatments(): Treatment[] {
  return Object.values(DATA).flatMap(tab =>
    tab.groups.flatMap(g => g.items)
  )
}

export function getBookableTreatments(): Treatment[] {
  return getAllTreatments().filter(t => t.bookable)
}

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return getAllTreatments().find(t => t.slug === slug)
}

/** Total slot length in minutes = prep + treatment + buffer */
export function getTotalSlotMinutes(t: Treatment): number {
  return t.prepMinutes + t.durationMinutes + t.bufferMinutes
}

export function getRelatedTreatments(slug: string, limit = 4): Treatment[] {
  const all = getAllTreatments()
  const current = all.find(t => t.slug === slug)
  const sameCategory = all.filter(t => t.slug !== slug && t.category === current?.category)
  return (sameCategory.length >= limit ? sameCategory : all.filter(t => t.slug !== slug)).slice(0, limit)
}
