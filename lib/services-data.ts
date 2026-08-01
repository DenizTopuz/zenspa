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
    slug: 'gezichtsbehandelingen',
    title: 'Gezichtsbehandelingen',
    tagline: 'Op maat gemaakte rituelen voor een stralende, gezonde huid',
    description:
      'Van diepe reiniging tot vitamine-C infusie — elk gezichtsritueel wordt zorgvuldig afgestemd op jouw huidtype en doelen. We werken uitsluitend met biologische, ethisch ingekochte ingrediënten.',
    image: '/hero.jpg',
    imgPos: 'object-center',
    popular: true,
    treatments: [
      {
        name: 'Signature Facial – 60 min',
        price: '€95',
        duration: '60 min',
        results:
          'Direct zichtbare hydratatie en een stralende glow. Optimale resultaten na 3–4 sessies.',
        downtime: 'Geen downtime. Lichte roodheid mogelijk voor 1–2 uur na behandeling.',
      },
      {
        name: 'Deep Cleansing Facial – 75 min',
        price: '€115',
        duration: '75 min',
        results:
          'Verstopte poriën worden grondig gereinigd. Merkbaar gladdere huidtextuur na 1 sessie.',
        downtime: 'Minimale roodheid direct na behandeling. Verdwijnt binnen enkele uren.',
      },
      {
        name: 'Vitamine-C Infusie – 90 min',
        price: '€145',
        duration: '90 min',
        results:
          'Lumineuze huid na 1 sessie. Gelijkmatige pigmentatie na 4–6 behandelingen.',
        downtime: 'Geen downtime. Huid kan licht gevoelig zijn voor zon de eerste 24 uur.',
      },
      {
        name: 'Anti-Age Ritual – 120 min',
        price: '€185',
        duration: '120 min',
        results:
          'Zichtbaar verminderde fijne lijntjes. Opgetild en gevulder gelaatstekening.',
        downtime: 'Lichte roodheid voor 2–4 uur. Zonnebescherming wordt aanbevolen.',
      },
    ],
  },
  {
    slug: 'massage-ontspanning',
    title: 'Massage & Ontspanning',
    tagline: 'Wetenschappelijk onderbouwde ontspanningstechnieken',
    description:
      'Van Swedish tot deep tissue — onze gecertificeerde therapeuten combineren eeuwenoude massagetechnieken met moderne kennis van het zenuwstelsel. Elke sessie reset je lichaam en geest volledig.',
    image: '/bg-leaves.jpg',
    imgPos: 'object-center',
    popular: true,
    treatments: [
      {
        name: 'Swedish Relaxatiemassage – 60 min',
        price: '€85',
        duration: '60 min',
        results:
          'Directe ontspanning van spieren en zenuwstelsel. Verbeterde bloedcirculatie.',
        downtime: 'Geen downtime. Drink extra water na de behandeling.',
      },
      {
        name: 'Deep Tissue Massage – 75 min',
        price: '€110',
        duration: '75 min',
        results:
          'Verlichten van diepe spierspanning en chronische pijn. Resultaat na 2–3 sessies.',
        downtime: 'Spieren kunnen 24–48 uur licht pijnlijk voelen — dit is normaal.',
      },
      {
        name: 'Hot Stone Ritual – 90 min',
        price: '€135',
        duration: '90 min',
        results:
          'Diepe spierontspanning door warmtegeleiding. Rustgevend en herstellend effect.',
        downtime: 'Geen downtime. Vermijd intensieve sport 24 uur na behandeling.',
      },
      {
        name: 'Signature Full-Body – 120 min',
        price: '€165',
        duration: '120 min',
        results:
          'Complete lichamelijke en mentale reset. Aanhoudend gevoel van rust en lichtheid.',
        downtime: 'Geen downtime. Rust en hydratatie worden aanbevolen.',
      },
    ],
  },
  {
    slug: 'lichaamsbehandelingen',
    title: 'Lichaamsbehandelingen',
    tagline: 'Organische wraps en scrubs met botanische ingrediënten',
    description:
      'Verzorgende lichaamsrituelen met de reinste organische ingrediënten. Van zeezout scrubs die de huid vernieuwen tot kruidenwraps die diep ontgiften — volledig vrij van schadelijke stoffen.',
    image: '/bg-leaves.jpg',
    imgPos: 'object-top',
    popular: false,
    treatments: [
      {
        name: 'Zeezout Bodyscrub – 45 min',
        price: '€75',
        duration: '45 min',
        results:
          'Directe verwijdering van dode huidcellen. Zijdezachte, stralende huid na 1 sessie.',
        downtime:
          'Geen downtime. Vermijd directe blootstelling aan zon direct na behandeling.',
      },
      {
        name: 'Kruidenwrap – 75 min',
        price: '€115',
        duration: '75 min',
        results:
          'Gehydrateerde en ontgiftigde huid. Zichtbaar gladder en strakker na 2–3 sessies.',
        downtime: 'Geen downtime. Huid kan warm aanvoelen voor 1 uur.',
      },
      {
        name: 'Botanisch Lichaamspakket – 90 min',
        price: '€145',
        duration: '90 min',
        results:
          'Intensieve hydratatie en voeding. Stralende teint en verbeterde huidkwaliteit.',
        downtime: 'Geen downtime. Huid is gevoeliger voor zon na behandeling.',
      },
    ],
  },
  {
    slug: 'hydrotherapie',
    title: 'Hydrotherapie',
    tagline: 'Mineraalrijke watertherapie voor huid en welzijn',
    description:
      'Thermische behandelingen gebaseerd op de helende kracht van water en mineralen. Vichy showers, Kneipp-methodes en mineraalbaden die van binnenuit nourishment verschaft en de huid hernieuwt.',
    image: '/hero.jpg',
    imgPos: 'object-top',
    popular: false,
    treatments: [
      {
        name: 'Thermisch Mineraalbad – 30 min',
        price: '€55',
        duration: '30 min',
        results:
          'Verbeterde doorbloeding en ontspanning van gewrichten. Direct merkbaar welzijnseffect.',
        downtime: 'Geen downtime. Drink voldoende water na de behandeling.',
      },
      {
        name: 'Vichy Shower Ritual – 45 min',
        price: '€75',
        duration: '45 min',
        results:
          'Diepe reiniging en stimulatie van de huid. Verbeterde bloedcirculatie.',
        downtime: 'Geen downtime. Huid voelt fris en verfrist aan.',
      },
      {
        name: 'Kneipp Hydrotherapie – 60 min',
        price: '€95',
        duration: '60 min',
        results:
          'Versterkt immuunsysteem en bloedsomloop. Aanhoudende energieboost na regelmatige sessies.',
        downtime:
          'Geen downtime. Warmte en rust worden aanbevolen na de behandeling.',
      },
    ],
  },
  {
    slug: 'hand-nagelzorg',
    title: 'Hand- & Nagelzorg',
    tagline: 'Luxueuze handbehandelingen voor elk detail',
    description:
      'Verwennerij voor de kleinste details. Van klassieke manicures tot diepvoedende botanische handmaskers — de perfecte aanvulling op jouw wellnessritueel.',
    image: '/bg-leaves.jpg',
    imgPos: 'object-bottom',
    popular: false,
    treatments: [
      {
        name: 'Signature Manicure – 45 min',
        price: '€55',
        duration: '45 min',
        results: 'Verzorgde, gehydrateerde nagels en handen. Langdurig en zichtbaar resultaat.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Botanisch Handmasker – 30 min',
        price: '€40',
        duration: '30 min',
        results: 'Directe hydratatie en verzachting van de handen. Zijdezachte huid.',
        downtime: 'Geen downtime.',
      },
      {
        name: 'Luxe Hand & Nagel Ritueel – 60 min',
        price: '€80',
        duration: '60 min',
        results:
          'Complete hand- en nagelbehandeling. Stralende handen en perfecte nagels.',
        downtime: 'Geen downtime.',
      },
    ],
  },
  {
    slug: 'aromatherapie',
    title: 'Aromatherapie',
    tagline: 'Geurreizen met zuivere essentiële oliën',
    description:
      'Therapeutische aromatherapiebehandelingen die kalmeren, verjongen en de geest in balans brengen. Samengesteld uit de zuiverste botanische essentiële oliën, afgestemd op jouw behoeften.',
    image: '/bg-leaves.jpg',
    imgPos: 'object-center',
    popular: false,
    treatments: [
      {
        name: 'Aromamassage – 60 min',
        price: '€90',
        duration: '60 min',
        results:
          'Verminderde stress en angst. Verbeterde slaapkwaliteit na regelmatige sessies.',
        downtime: 'Geen downtime. Vermijd alcohol de eerste 24 uur na behandeling.',
      },
      {
        name: 'Aroma Gezichtsbehandeling – 60 min',
        price: '€100',
        duration: '60 min',
        results:
          'Kalme, stralende huid. Mentale ontspanning en verbeterde focus.',
        downtime: 'Geen downtime. Huid kan licht gevoelig zijn voor zon.',
      },
      {
        name: 'Volledig Aroma Ritueel – 90 min',
        price: '€140',
        duration: '90 min',
        results:
          'Complete geest-lichaam balans. Aanhoudend gevoel van rust en welzijn.',
        downtime:
          'Geen downtime. Rust en ontspanning aanbevolen na de behandeling.',
      },
    ],
  },
]

export function getServiceBySlug(slug: string): ServiceCategory | undefined {
  return serviceCategories.find((s) => s.slug === slug)
}
