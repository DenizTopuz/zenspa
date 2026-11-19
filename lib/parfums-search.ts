import { PARFUMS, noteList, type Parfum } from '@/lib/parfums-data'

export type Suggestion =
  | { kind: 'parfum'; p: Parfum; via: string }
  | { kind: 'note'; note: string; count: number }
  | { kind: 'house'; house: string; count: number }

/** Kleine letters, zonder accenten en leestekens — "Seducción" == "seduccion" */
export const norm = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, '')
    .trim()

function lev(a: string, b: string) {
  const prev = Array.from({ length: b.length + 1 }, (_, i) => i)
  for (let i = 1; i <= a.length; i++) {
    let diag = prev[0]
    prev[0] = i
    for (let j = 1; j <= b.length; j++) {
      const tmp = prev[j]
      prev[j] = Math.min(prev[j] + 1, prev[j - 1] + 1, diag + (a[i - 1] === b[j - 1] ? 0 : 1))
      diag = tmp
    }
  }
  return prev[b.length]
}

/** Lager = beter; null = geen match. Vangt ook kleine typfouten ("vanile", "chanell") op. */
function closeness(term: string, q: string): number | null {
  const t = norm(term)
  if (t.startsWith(q)) return 0
  const words = t.split(' ')
  if (words.some((w) => w.startsWith(q))) return 1
  if (t.includes(q)) return 2
  if (q.length < 4) return null
  const max = q.length <= 5 ? 1 : 2
  let best: number | null = null
  for (const w of words) {
    const d = Math.min(lev(q, w), lev(q, w.slice(0, q.length)))
    if (d <= max && (best === null || d < best)) best = d
  }
  return best === null ? null : 3 + best
}

export const matchesQuery = (p: Parfum, query: string) => {
  const q = norm(query)
  if (!q) return true
  return [p.name, p.inspired, p.house, ...noteList(p)].some((s) => norm(s).includes(q))
}

export function suggest(query: string, limit = 7): Suggestion[] {
  const q = norm(query)
  if (!q) return []

  const scored = PARFUMS.map((p) => {
    const cands: Array<{ score: number; via: string }> = []
    const push = (term: string | undefined, bonus: number, via: string) => {
      if (!term) return
      const s = closeness(term, q)
      if (s !== null) cands.push({ score: s + bonus, via })
    }
    push(p.name, 0, '')
    push(p.inspired, 0.5, `Geïnspireerd op ${p.inspired}`)
    push(p.house, 0.5, `${p.house}`)
    noteList(p).forEach((n) => push(n, 1, `Bevat ${n.toLowerCase()}`))
    if (!cands.length) return null
    const best = cands.reduce((a, b) => (b.score < a.score ? b : a))
    return { p, score: best.score, via: best.via }
  })
    .filter((x): x is { p: Parfum; score: number; via: string } => x !== null)
  // Zijn er echte treffers, dan laten we de typfout-gokjes weg (voorkomt ruis zoals "dior" → "Giorgio")
  const hasExact = scored.some((x) => x.score < 3)
  const ranked = scored
    .filter((x) => !hasExact || x.score < 3)
    .sort((a, b) => a.score - b.score || a.p.name.localeCompare(b.p.name))
    .slice(0, 5)
    .map((x) => ({ s: { kind: 'parfum', p: x.p, via: x.via } as Suggestion, byName: x.via === '' }))

  const noteCounts = new Map<string, number>()
  const houseCounts = new Map<string, number>()
  for (const p of PARFUMS) {
    noteList(p).forEach((n) => noteCounts.set(n, (noteCounts.get(n) ?? 0) + 1))
    houseCounts.set(p.house, (houseCounts.get(p.house) ?? 0) + 1)
  }

  const rank = (m: Map<string, number>) =>
    [...m.entries()]
      .map(([label, count]) => ({ label, count, s: closeness(label, q) }))
      .filter((x): x is { label: string; count: number; s: number } => x.s !== null && x.s <= 4)
      .sort((a, b) => a.s - b.s || b.count - a.count)

  const notes = rank(noteCounts).slice(0, 2).map((x): Suggestion => ({ kind: 'note', note: x.label, count: x.count }))
  const houses = rank(houseCounts).slice(0, 1).map((x): Suggestion => ({ kind: 'house', house: x.label, count: x.count }))

  // Eerst geuren op naam, dan noot/merk (met aantal), dan de overige treffers
  return [
    ...ranked.filter((x) => x.byName).map((x) => x.s),
    ...notes,
    ...houses,
    ...ranked.filter((x) => !x.byName).map((x) => x.s),
  ].slice(0, limit)
}
