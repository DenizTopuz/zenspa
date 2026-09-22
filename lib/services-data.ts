export type Treatment = {
  name: string
  price: string
  duration: string
  results: string
  downtime: string
}

export type ServiceCategory = {
  slug: string
  title: string
  tagline: string
  description: string
  image: string
  imgPos: string
  popular: boolean
  treatments: Treatment[]
}

export const serviceCategories: ServiceCategory[] = [
  {
    slug: 'gezicht',
    title: 'Gezichtsbehandelingen',
    tagline: 'Op maat afgestemd op jouw huid en doelen',
    description:
      'Van een snelle opfrisser tot een uitgebreid huidverzorgingsritueel — elke behandeling wordt afgestemd op jouw huidtype. Wij werken met hoogwaardige producten voor een resultaat dat je écht ziet.',
    image: '/svc-gezicht.jpg',
    imgPos: '60% 35%',
    popular: true,
    treatments: [
      {
        name: 'Mini Zen Moment',
        price: '€30',
        duration: '30 min',
        results: 'Directe hydratatie en opfrissing voor een stralende huid.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Basis Gezichtsbehandeling',
        price: '€62,50',
        duration: '50 min',
        results: 'Grondige reiniging en basishuidverzorging afgestemd op jouw huidtype.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Classic Gezichtsbehandeling',
        price: '€70',
        duration: '80 min',
        results: 'Stralende huid na 1 sessie. Onze meest geliefde behandeling.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Deluxe Gezichtsbehandeling',
        price: '€85',
        duration: '120 min',
        results: 'De ultieme verwenning met extra masker, massage en verwennende stappen.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Microneedling',
        price: '€95',
        duration: '60 min',
        results: 'Verbeterde huidtextuur en verfijnde poriën. Optimaal na 3 sessies.',
        downtime: 'Lichte roodheid 24–48 uur na behandeling.',
      },
    ],
  },
  {
    slug: 'lichaam',
    title: 'Lichaam & Bad',
    tagline: 'Verzorging van top tot teen',
    description:
      'Gerichte lichaamsbehandelingen die jouw huid reinigen, verzachten en verwennen. Perfect als aanvulling op jouw gezichtsritueel of als losstaand moment voor jezelf.',
    image: '/svc-lichaam.jpg',
    imgPos: 'center',
    popular: false,
    treatments: [
      {
        name: 'Rugbehandeling',
        price: '€40',
        duration: '30 min',
        results: 'Gereinigde en verzorgde rugshuid, ideaal bij onzuiverheden.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Pedicure incl. voetenscrub',
        price: '€45',
        duration: 'ca. 60 min',
        results: 'Zijdezachte voeten en verzorgde nagels na 1 sessie.',
        downtime: 'Geen downtime.',
      },
    ],
  },
  {
    slug: 'pmu',
    title: 'Permanente Make-up',
    tagline: 'Tijdloos mooi, elke dag — zonder moeite',
    description:
      'Professionele pigmentatie voor wenkbrauwen, ogen en lippen. Çigdem werkt met precisie en gevoel voor jouw gezichtsvorm, zodat het resultaat er altijd natuurlijk uitziet.',
    image: '/pmu.jpg',
    imgPos: '40% 35%',
    popular: true,
    treatments: [
      {
        name: 'Hairstroke / Microblading',
        price: '€200',
        duration: '180 min',
        results: 'Ultranaturlijke wenkbrauwen haar-voor-haar.',
        downtime: 'Licht rood en gezwollen 1–3 dagen. Volledig herstel na 4–6 weken.',
      },
      {
        name: 'Powder / Ombre Brows',
        price: '€250',
        duration: '180 min',
        results: 'Zachte poederkleur voor een make-up effect dat vervloeit.',
        downtime: 'Lichte roodheid 1–2 dagen. Volledig herstel na 4–6 weken.',
      },
      {
        name: 'Combi Brows',
        price: '€270',
        duration: '210 min',
        results: 'Volle, definitieve wenkbrauwen — combinatie van hairstroke en powder.',
        downtime: 'Lichte roodheid 1–3 dagen. Volledig herstel na 4–6 weken.',
      },
      {
        name: 'Lipliner',
        price: '€275',
        duration: '150 min',
        results: 'Precieze permanente lipomlijning voor een vollere mond.',
        downtime: 'Zwelling 1–3 dagen. Volledig herstel na 4–6 weken.',
      },
      {
        name: 'Full Lips',
        price: '€350',
        duration: '180 min',
        results: 'Volledige kleurpigmentatie voor een permanent mooie mond.',
        downtime: 'Zwelling 2–4 dagen. Volledig herstel na 4–6 weken.',
      },
    ],
  },
  {
    slug: 'ontharen',
    title: 'Ontharen',
    tagline: 'Snel, effectief en zijdezacht',
    description:
      'Professionele ontharing van gezichtszones — snel, hygiënisch en zonder gedoe. Ideaal als aanvulling op een gezichtsbehandeling of als losse sessie.',
    image: '/ontharen.jpg',
    imgPos: '55% 45%',
    popular: false,
    treatments: [
      {
        name: '1 zone',
        price: '€5',
        duration: '10 min',
        results: 'Directe ontharing van bovenlip, kin, kaaklijn of onderrug.',
        downtime: 'Lichte roodheid mogelijk. Verdwijnt binnen enkele uren.',
      },
      {
        name: 'Bovenlip + kin',
        price: '€9',
        duration: '15 min',
        results: 'Twee zones gecombineerd in één efficiënte behandeling.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Bovenlip + kin + kaaklijn',
        price: '€15',
        duration: '20 min',
        results: 'Volledige gezichtsontharing in drie zones.',
        downtime: 'Geen downtime.',
      },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((s) => s.slug === slug)
}
