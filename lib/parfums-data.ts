export type Family = 'bloemig' | 'fris' | 'zoet' | 'oriental'

export interface Parfum {
  slug: string
  name: string
  family: Family
  unisex?: boolean
  /** Geur waarop deze Yodeyma-geur gebaseerd is */
  inspired: string
  house: string
  top?: string
  heart?: string
  base?: string
  /** Tweede afbeelding (flacon met doosje) */
  hasAlt: boolean
}

export const FAMILIES: Array<{ key: Family; label: string; short: string; desc: string }> = [
  { key: 'bloemig', short: 'Bloemig', label: 'Bloemig',            desc: 'Roos, jasmijn, iris en lelietje-van-dalen' },
  { key: 'fris', short: 'Fris', label: 'Fris & Fruitig',     desc: 'Citrus, appel, peer en waterige tonen' },
  { key: 'zoet', short: 'Zoet', label: 'Zoet & Gourmand',    desc: 'Vanille, koffie, amandel en bessen' },
  { key: 'oriental', short: 'Houtig', label: 'Houtig & Oriëntaals', desc: 'Patchouli, oud, sandelhout en amber' },
]

export const PARFUMS: Parfum[] = [
  { slug: 'nicolas-for-her', name: 'Nicolas For Her', family: 'bloemig', inspired: 'For Her', house: 'Narciso Rodriguez', top: 'Oranjebloesem', heart: 'Jasmijn', base: 'Witte muskus', hasAlt: true },
  { slug: 'celebrity-women', name: 'Celebrity Women', family: 'zoet', inspired: 'La vie est belle', house: 'Lancôme', top: 'Zwarte bes', heart: 'Iris', base: 'Patchouli', hasAlt: true },
  { slug: 'prime', name: 'Prime', family: 'bloemig', inspired: 'Idôle', house: 'Lancôme', top: 'Bergamot', heart: 'Roos', base: 'Vanille', hasAlt: true },
  { slug: 'seduccion', name: 'Seducción', family: 'bloemig', inspired: 'Chloé', house: 'Chloé', top: 'Pioenroos', heart: 'Lelietje-van-dalen', base: 'Witte muskus', hasAlt: true },
  { slug: 'temis', name: 'Temis', family: 'zoet', inspired: 'Olympéa', house: 'Paco Rabanne', top: 'Gemberbloem', heart: 'Waterjasmijn', base: 'Vanille', hasAlt: true },
  { slug: 'suerte', name: 'Suerte', family: 'zoet', inspired: 'XS Pure', house: 'Paco Rabanne', top: 'Ylang-ylang', heart: 'Vanille', base: 'Witte muskus', hasAlt: true },
  { slug: 'sophisticate', name: 'Sophisticate', family: 'bloemig', inspired: 'The One', house: 'Dolce & Gabbana', top: 'Lychee', heart: 'Jasmijn', base: 'Vanille', hasAlt: true },
  { slug: 'kara', name: 'Kara', family: 'fris', inspired: 'Light Blue', house: 'Dolce & Gabbana', top: 'Appel', heart: 'Bamboe', base: 'Witte cederhout', hasAlt: true },
  { slug: 'cheante', name: 'Cheante', family: 'oriental', inspired: 'Coco Mademoiselle', house: 'Chanel', top: 'Mandarijn', heart: 'Roos', base: 'Patchouli', hasAlt: true },
  { slug: 'for-you', name: 'For You', family: 'fris', inspired: 'Chance Eau Tendre', house: 'Chanel', top: 'Bergamot', heart: 'Jasmijn', base: 'Tonkaboon', hasAlt: true },
  { slug: 'leau-berlue', name: 'L’eau Berlue', family: 'bloemig', inspired: 'N°5', house: 'Chanel', top: 'Citroen', heart: 'Ylang-ylang', base: 'Iris', hasAlt: true },
  { slug: 'rinascere', name: 'Rinascere', family: 'fris', inspired: 'Gabrielle', house: 'Chanel', top: 'Grapefruit', heart: 'Ylang-ylang', base: 'Witte muskus', hasAlt: true },
  { slug: 'adriana', name: 'Adriana', family: 'zoet', inspired: 'Sì', house: 'Giorgio Armani', top: 'Zwarte bes', heart: 'Perzik', base: 'Vanille', hasAlt: true },
  { slug: 'lis', name: 'Lis', family: 'bloemig', inspired: 'My Way', house: 'Giorgio Armani', top: 'Oranjebloesem', heart: 'Tuberoos', base: 'Vanille', hasAlt: true },
  { slug: 'iris', name: 'Iris', family: 'oriental', inspired: 'Alien', house: 'Mugler', top: 'Oranjebloesem', heart: 'Jasmijn', base: 'Witte amber', hasAlt: true },
  { slug: 'very-special', name: 'Very Special', family: 'zoet', inspired: 'Good Girl', house: 'Carolina Herrera', top: 'Amandel', heart: 'Jasmijn', base: 'Tonkaboon', hasAlt: true },
  { slug: 'black-elixer', name: 'Black Elixer', family: 'zoet', inspired: 'Black Opium', house: 'Yves Saint Laurent', top: 'Koffie', heart: 'Likeur', base: 'Vanille', hasAlt: true },
  { slug: 'luxor', name: 'Luxor', family: 'bloemig', inspired: 'Libre', house: 'Yves Saint Laurent', top: 'Mandarijn', heart: 'Jasmijn', base: 'Vanille', hasAlt: true },
  { slug: 'harpina', name: 'Harpina', family: 'bloemig', inspired: 'J’adore', house: 'Dior', top: 'Violet', heart: 'Orchidee', base: 'Vanille', hasAlt: true },
  { slug: 'mia', name: 'Mia', family: 'zoet', inspired: 'Dior Addict', house: 'Dior', top: 'Framboos', heart: 'Jasmijn', base: 'Vanille', hasAlt: true },
  { slug: 'red', name: 'Red', family: 'zoet', inspired: 'Hypnotic Poison', house: 'Dior', top: 'Amandel', heart: 'Vanille', base: 'Witte muskus', hasAlt: true },
  { slug: 'yode', name: 'Yode', family: 'bloemig', inspired: 'Bloom', house: 'Gucci', top: 'Sinaasappel', heart: 'Tuberoos', base: 'Sandelhout', hasAlt: true },
  { slug: 'tendenze', name: 'Tendenze', family: 'bloemig', inspired: 'L’Interdit', house: 'Givenchy', top: 'Bergamot', heart: 'Tuberoos', base: 'Patchouli', hasAlt: true },
  { slug: 'dinara', name: 'Dinara', family: 'bloemig', inspired: 'Teint Neige', house: 'Lorenzo Villoresi', top: 'Jasmijn', heart: 'Tuberoos', base: 'Witte muskus', hasAlt: true },
  { slug: 'linet', name: 'Linet', family: 'fris', inspired: 'Delina', house: 'Parfums de Marly', top: 'Citroen', heart: 'Vanille', base: 'Muskus', hasAlt: true },
  { slug: 'valia', name: 'Valia', family: 'oriental', inspired: 'Valaya', house: 'Parfums de Marly', top: 'Sinaasappel', heart: 'Mandarijn', base: 'Akigalahout', hasAlt: true },
  { slug: 'amira', name: 'Amira', family: 'zoet', inspired: 'Guidance', house: 'Amouage', top: 'Peer', heart: 'Hazelnoot', base: 'Vanille', hasAlt: false },
  { slug: 'boreal', name: 'Boreal', family: 'oriental', inspired: 'Baccarat Rouge 540', house: 'Maison Francis Kurkdjian', hasAlt: true },
  { slug: 'silk-elixer', name: 'Silk Elixer', family: 'oriental', unisex: true, inspired: 'Oud Satin Mood', house: 'Maison Francis Kurkdjian', top: 'Violet', heart: 'Oud', base: 'Roos', hasAlt: true },
  { slug: 'oude', name: 'Oude', family: 'oriental', inspired: 'Black Orchid', house: 'Tom Ford', top: 'Zwarte orchidee', heart: 'Zwarte truffel', base: 'Patchouli', hasAlt: true },
  { slug: 'poetic', name: 'Poetic', family: 'bloemig', inspired: 'Perchè Chat', house: 'Annick Goutal', top: 'Citroenbloesem', heart: 'Zoete erwt', base: 'Witte muskus', hasAlt: true },
]

export const image = (p: Parfum) => `/parfums/${p.slug}.jpg`
export const imageAlt = (p: Parfum) => `/parfums/${p.slug}-2.jpg`
export const noteList = (p: Parfum) =>
  [p.top, p.heart, p.base].filter((n): n is string => Boolean(n))

/** Meest voorkomende noten — gebruikt voor de snelle geurwijzer */
export const POPULAR_NOTES = ['Vanille', 'Jasmijn', 'Witte muskus', 'Roos', 'Patchouli', 'Tuberoos', 'Citrus']

export const matchesNote = (p: Parfum, note: string) => {
  if (note === 'Citrus') {
    return noteList(p).some((n) => /citroen|bergamot|mandarijn|sinaasappel|grapefruit/i.test(n))
  }
  return noteList(p).some((n) => n.toLowerCase() === note.toLowerCase())
}

/** Kleurstip bij de populaire noten — alleen voor de visuele herkenning in de filters */
export const NOTE_COLORS: Record<string, string> = {
  Vanille: '#E6CF95',
  Jasmijn: '#F1E6A8',
  'Witte muskus': '#D8D3CB',
  Roos: '#E5A8B4',
  Patchouli: '#8C6D4B',
  Tuberoos: '#EADFCB',
  Citrus: '#E9C74A',
}

/** Beschikbare formaten in ml */
export const SIZES = [30, 50, 100] as const
export type Size = (typeof SIZES)[number]

/** Nichemerken zijn iets duurder — pas de lijst aan als een merk er (niet) bij hoort */
const NICHE_HOUSES = [
  'Parfums de Marly',
  'Amouage',
  'Maison Francis Kurkdjian',
  'Lorenzo Villoresi',
  'Annick Goutal',
  'Tom Ford',
]
export const isNiche = (p: Parfum) => NICHE_HOUSES.includes(p.house)

/**
 * VOORLOPIGE prijzen in euro per formaat — vul hier de echte prijzen in.
 * 'standaard' geldt voor de meeste geuren, 'niche' voor de iets duurdere nichegeuren.
 */
export const PRICES: Record<'standaard' | 'niche', Record<Size, number>> = {
  standaard: { 30: 14.95, 50: 19.95, 100: 29.95 },
  niche: { 30: 19.95, 50: 24.95, 100: 34.95 },
}

const eur = new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR' })
export const priceFor = (p: Parfum, size: Size) => eur.format(PRICES[isNiche(p) ? 'niche' : 'standaard'][size])
/** Laagste prijs (kleinste formaat) voor "vanaf" op de kaarten */
export const fromPrice = (p: Parfum) => priceFor(p, SIZES[0])
