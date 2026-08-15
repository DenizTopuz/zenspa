export type Treatment = {
  name: string
  slug: string
  duration?: string
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
        { name: 'Mini Zen Moment',             slug: 'mini-zen-moment',              duration: '30 min',  price: '€30',    image: A, category: 'Gezicht', description: 'Een snelle opfrisser met reiniging en gerichte hydratatie voor jouw huid.' },
        { name: 'Basis Gezichtsbehandeling',   slug: 'basis-gezichtsbehandeling',    duration: '50 min',  price: '€62,50', image: B, category: 'Gezicht', description: 'Grondige reiniging, peeling en basishuidverzorging afgestemd op jouw huidtype.' },
        { name: 'Classic Gezichtsbehandeling', slug: 'classic-gezichtsbehandeling',  duration: '80 min',  price: '€70',    image: A, category: 'Gezicht', description: 'Onze meest geliefde behandeling: uitgebreide verzorging voor een stralende huid.', tag: 'Meest geliefd' },
        { name: 'Deluxe Gezichtsbehandeling',  slug: 'deluxe-gezichtsbehandeling',   duration: '120 min', price: '€85',    image: B, category: 'Gezicht', description: 'De ultieme gezichtsverzorging met extra masker, massage en verwennende stappen.' },
        { name: 'Herenbehandeling',            slug: 'herenbehandeling',             duration: '80 min',  price: '€70',    image: A, category: 'Gezicht', description: 'Speciaal voor de mannelijke huid — poriënreiniging, hydratatie en dieptewerking.' },
        { name: '65+ Behandeling',             slug: '65-plus-behandeling',          duration: '50 min',  price: '€55',    image: B, category: 'Gezicht', description: 'Zachte, voedende behandeling op maat voor de rijpere huid.' },
        { name: 'Tienerbehandeling',           slug: 'tienerbehandeling',            duration: '50 min',  price: '€45',    image: A, category: 'Gezicht', description: 'Milde huidverzorging voor jonge huid met aandacht voor onzuiverheden.' },
        { name: 'Microneedling',               slug: 'microneedling',                duration: '60 min',  price: '€95',    image: B, category: 'Gezicht', description: 'Stimuleert huidvernieuwing en collageenproductie voor verfijnde poriën.', tag: 'Nieuw' },
        { name: 'Galvanic Spa',                slug: 'galvanic-spa',                 duration: '30 min',  price: '€45',    image: A, category: 'Gezicht', description: 'Iontoforese voor diepgaande productopname en een direct zichtbare huidgloed.' },
      ]
    }]
  },
  lichaam: {
    groups: [{
      items: [
        { name: 'Rugbehandeling',             slug: 'rugbehandeling',   duration: '30 min',     price: '€40', image: A, category: 'Lichaam', description: 'Grondige reiniging, peeling en verzorging van de rug — ideaal bij vermoeidheid of onzuiverheden.' },
        { name: 'Pedicure incl. voetenscrub', slug: 'pedicure',         duration: 'ca. 60 min', price: '€45', image: B, category: 'Lichaam', description: 'Volledige voetverzorging met exfoliërende scrub voor zijdezachte voeten en verzorgde nagels.', tag: 'Meest geliefd' },
      ]
    }]
  },
  pmu: {
    groups: [
      {
        subtitle: 'Wenkbrauwen',
        items: [
          { name: 'Hairstroke / Microblading',                slug: 'hairstroke-microblading',  price: '€200',       image: A, category: 'Permanente Make-up', description: 'Haar-voor-haar techniek voor ultranaturlijke, goed gevulde wenkbrauwen.' },
          { name: 'Powder / Ombre Brows',                     slug: 'powder-ombre-brows',       price: '€250',       image: B, category: 'Permanente Make-up', description: 'Zachte poederkleur die vervaagt van licht naar donker voor een make-up effect.' },
          { name: 'Combi Brows',                              slug: 'combi-brows',              price: '€270',       image: A, category: 'Permanente Make-up', description: 'Combinatie van hairstroke en powder voor volle, definitieve wenkbrauwen.', tag: 'Meest geliefd' },
          { name: 'Ontbrekende stukjes / littekens opvullen', slug: 'ontbrekende-stukjes',      price: 'Vanaf €100', image: B, category: 'Permanente Make-up', description: 'Correctie en camouflage van kale plekken, asymmetrie of littekens.' },
        ]
      },
      {
        subtitle: 'Ogen',
        items: [
          { name: 'Infralash / Deepliner (boven of onder)', slug: 'infralash-deepliner',      price: '€150', image: A, category: 'Permanente Make-up', description: 'Subtiele kleurlijn langs de wimperrand voor meer diepte en expressie.' },
          { name: 'Deepliner (boven én onder)',             slug: 'deepliner-boven-en-onder', price: '€220', image: B, category: 'Permanente Make-up', description: 'Volledige permanente eyeliner voor een intensere, tijdloze blik.' },
        ]
      },
      {
        subtitle: 'Lippen',
        items: [
          { name: 'Lipliner',  slug: 'lipliner',  price: '€275', image: A, category: 'Permanente Make-up', description: 'Precieze permanente lipomlijning voor een vollere, symmetrische mond.' },
          { name: 'Full Lips', slug: 'full-lips', price: '€350', image: B, category: 'Permanente Make-up', description: 'Volledige kleurpigmentatie van lip tot lip voor een permanent mooie mond.' },
        ]
      }
    ]
  },
  ontharen: {
    footerNote: 'Mondkapje is verplicht bij alle onthaarbehandelingen.',
    groups: [{
      items: [
        { name: '1 zone',                   slug: 'ontharen-1-zone',       price: '€5',  image: A, category: 'Ontharen', description: 'Bovenlip, kin, kaaklyn of onderrug.' },
        { name: 'Bovenlip + kin',           slug: 'bovenlip-kin',          price: '€9',  image: B, category: 'Ontharen', description: 'Twee zones gecombineerd in één efficiënte behandeling.' },
        { name: 'Bovenlip + kin + kaaklyn', slug: 'bovenlip-kin-kaaklyn',  price: '€15', image: A, category: 'Ontharen', description: 'Drie zones in één sessie voor volledig gezichtsontharing.' },
        { name: 'Extra zone (toeslag)',     slug: 'extra-zone',            price: '+€5', image: B, category: 'Ontharen', description: 'Voeg een extra zone toe aan je bestaande behandeling.' },
      ]
    }]
  },
}

export function getAllTreatments(): Treatment[] {
  return Object.values(DATA).flatMap(tab =>
    tab.groups.flatMap(g => g.items)
  )
}

export function getTreatmentBySlug(slug: string): Treatment | undefined {
  return getAllTreatments().find(t => t.slug === slug)
}
