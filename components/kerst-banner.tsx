import Link from 'next/link'
import { Gift, Snowflake, TreePine, Sparkles, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/reveal'
import { ParallaxLayer } from '@/components/parallax-layer'
import { KerstCountdown } from '@/components/kerst-countdown'
import { ZenSpaIcon } from '@/components/logo'

// Vaste waarden (geen random) zodat server en browser hetzelfde tonen
const FLAKES = [
  { left: 4, size: 14, dur: 11, delay: 0, drift: 20 },
  { left: 11, size: 22, dur: 15, delay: 3, drift: -26 },
  { left: 19, size: 12, dur: 10, delay: 6, drift: 18 },
  { left: 27, size: 18, dur: 13, delay: 1.5, drift: -20 },
  { left: 35, size: 12, dur: 12, delay: 8, drift: 24 },
  { left: 43, size: 24, dur: 16, delay: 4, drift: -30 },
  { left: 52, size: 14, dur: 11, delay: 9, drift: 16 },
  { left: 60, size: 20, dur: 14, delay: 2, drift: -22 },
  { left: 68, size: 12, dur: 10, delay: 7, drift: 20 },
  { left: 76, size: 18, dur: 13, delay: 5, drift: -18 },
  { left: 84, size: 14, dur: 12, delay: 10, drift: 26 },
  { left: 91, size: 22, dur: 15, delay: 2.5, drift: -24 },
  { left: 97, size: 12, dur: 11, delay: 6.5, drift: 14 },
]
const LIGHTS = Array.from({ length: 26 }, (_, i) => i)
const TREES = [
  { left: 2, size: 64 }, { left: 9, size: 92 }, { left: 17, size: 56 },
  { left: 76, size: 60 }, { left: 84, size: 96 }, { left: 93, size: 66 },
]

/** Noorse truienrand: zigzag, sterren, dennenboompjes en ruitjes in een herhalend patroon */
function NordicBand({ id, className }: { id: string; className?: string }) {
  return (
    <svg aria-hidden className={className} width="100%" height="48" preserveAspectRatio="none">
      <defs>
        <pattern id={id} width="96" height="48" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="#F4EFE4" strokeOpacity="0.4" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M0 8 L8 2 L16 8 L24 2 L32 8 L40 2 L48 8 L56 2 L64 8 L72 2 L80 8 L88 2 L96 8" />
            <path d="M0 46 L8 40 L16 46 L24 40 L32 46 L40 40 L48 46 L56 40 L64 46 L72 40 L80 46 L88 40 L96 46" />
          </g>
          <g fill="#F4EFE4" fillOpacity="0.4">
            <path d="M24 14 L26 22 L34 24 L26 26 L24 34 L22 26 L14 24 L22 22 Z" />
            <path d="M48 20 L52 24 L48 28 L44 24 Z" />
            <path d="M72 12 L79 21 L75 21 L81 29 L63 29 L69 21 L65 21 Z" />
            <rect x="70.5" y="29" width="3" height="4" />
            <circle cx="12" cy="24" r="1.6" />
            <circle cx="36" cy="24" r="1.6" />
            <circle cx="60" cy="24" r="1.6" />
            <circle cx="84" cy="24" r="1.6" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="48" fill={`url(#${id})`} />
    </svg>
  )
}

type GiftProps = {
  ribbon: string
  body?: string
  lid?: string
  variant?: 'wide' | 'tall'
  /** Plaatsing (absolute, offsets, z-index) van het omhullende vlak */
  pos?: string
  /** Parallaxsnelheid in pixels; weglaten = geen parallax */
  speed?: number
  className?: string
  /** Staat stil (geen zweven), voor cadeautjes die onder de boom liggen */
  still?: boolean
  /** rotatie in graden en vertraging van het zweven */
  rot?: number
  delay?: number
}

/** Een cadeautje met strik */
function GiftArt({ ribbon, body = '#F4EFE4', lid = '#E8DFCC', variant = 'wide', pos, speed, still, className, rot = 0, delay = 0 }: GiftProps) {
  const tall = variant === 'tall'
  const art = (
    <svg
      aria-hidden
      viewBox={tall ? '0 0 100 150' : '0 0 120 124'}
      className={`kerst-gift ${className ?? ''}`}
      style={{ '--rot': `${rot}deg`, transform: `rotate(${rot}deg)`, animation: still ? undefined : `kerst-bob ${5 + (delay % 3)}s ease-in-out ${delay}s infinite` } as React.CSSProperties}
    >
      {tall ? (
        <>
          <rect x="18" y="62" width="64" height="80" rx="7" fill={body} />
          <rect x="12" y="46" width="76" height="22" rx="6" fill={lid} />
          <rect x="44" y="46" width="12" height="96" fill={ribbon} />
          <path d="M50 46 C32 14 10 26 28 46 Z" fill={ribbon} />
          <path d="M50 46 C68 14 90 26 72 46 Z" fill={ribbon} />
          <circle cx="50" cy="46" r="7" fill={ribbon} stroke="#00000022" />
        </>
      ) : (
        <>
          <rect x="20" y="58" width="80" height="58" rx="7" fill={body} />
          <rect x="13" y="42" width="94" height="22" rx="6" fill={lid} />
          <rect x="54" y="42" width="12" height="74" fill={ribbon} />
          <path d="M60 42 C38 8 14 22 34 42 Z" fill={ribbon} />
          <path d="M60 42 C82 8 106 22 86 42 Z" fill={ribbon} />
          <circle cx="60" cy="42" r="8" fill={ribbon} stroke="#00000022" />
          <path d="M20 108 h80" stroke="#00000012" strokeWidth="6" strokeLinecap="round" />
        </>
      )}
    </svg>
  )
  if (!pos) return art
  return (
    <ParallaxLayer speed={speed ?? 0} className={`pointer-events-none ${pos}`}>
      {art}
    </ParallaxLayer>
  )
}

/** Een kerstbal aan een draadje, hangend aan het lichtsnoer */
function Bauble({ color, length, size, delay, className }: { color: string; length: number; size: number; delay: number; className?: string }) {
  return (
    <div
      aria-hidden
      className={`kerst-bauble pointer-events-none absolute top-1 origin-top ${className ?? ''}`}
      style={{ animation: `kerst-sway ${4 + (delay % 2)}s ease-in-out ${delay}s infinite` }}
    >
      <span className="mx-auto block w-px bg-white/45" style={{ height: length }} />
      <svg viewBox="0 0 40 48" width={size} height={size * 1.2} className="-mt-px drop-shadow-[0_6px_6px_rgba(0,0,0,0.3)]">
        <rect x="16" y="0" width="8" height="7" rx="2" fill="#E6CF95" />
        <circle cx="20" cy="28" r="18" fill={color} />
        <path d="M6 24 C10 12 24 8 34 18" stroke="#ffffff" strokeOpacity="0.35" strokeWidth="3" fill="none" strokeLinecap="round" />
        <path d="M4 30 h32" stroke="#E6CF95" strokeOpacity="0.8" strokeWidth="2.5" />
      </svg>
    </div>
  )
}


/** Een tak hulst met bessen voor in de hoeken */
function Holly({ className, flip }: { className?: string; flip?: boolean }) {
  const leaf = 'M0 0 C10 -11 30 -11 42 0 C30 11 10 11 0 0 Z'
  return (
    <svg aria-hidden viewBox="0 0 190 130" className={className} style={flip ? { transform: 'scaleX(-1)' } : undefined}>
      <path d="M4 6 C50 18 90 40 140 70" stroke="#4E5A39" strokeWidth="3" fill="none" strokeLinecap="round" />
      {[
        { x: 28, y: 14, r: 28 }, { x: 52, y: 26, r: 62 }, { x: 78, y: 36, r: 20 },
        { x: 96, y: 48, r: 66 }, { x: 118, y: 58, r: 28 },
      ].map((l, i) => (
        <g key={i} transform={`translate(${l.x} ${l.y}) rotate(${l.r})`}>
          <path d={leaf} fill={i % 2 ? '#7E8A63' : '#8E9A72'} />
          <path d="M2 0 H38" stroke="#4E5A39" strokeOpacity="0.5" strokeWidth="1.2" />
        </g>
      ))}
      {[{ x: 66, y: 52 }, { x: 78, y: 62 }, { x: 60, y: 66 }].map((b, i) => (
        <g key={i}>
          <circle cx={b.x} cy={b.y} r="6.5" fill="#C14A5E" />
          <circle cx={b.x - 2} cy={b.y - 2} r="1.8" fill="#ffffff" fillOpacity="0.55" />
        </g>
      ))}
    </svg>
  )
}

/** Besneeuwde heuvels onderin: loopt over in de achtergrond van de volgende sectie */
function SnowDrift() {
  return (
    <svg aria-hidden viewBox="0 0 1440 70" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-12 w-full md:h-[68px]">
      <path
        d="M0 70 V34 C110 6 230 8 350 30 S590 58 720 34 S970 4 1100 26 S1340 56 1440 30 V70 Z"
        fill="#ffffff"
        fillOpacity="0.4"
      />
      <path
        d="M0 70 V46 C90 26 200 24 320 44 S560 64 690 46 S950 22 1090 42 S1330 64 1440 44 V70 Z"
        style={{ fill: 'var(--background)' }}
      />
    </svg>
  )
}

/** Het bonnetje zelf: laat zien wat je cadeau geeft */
function VoucherCard({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={`kerst-gift relative h-[170px] w-[270px] overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#F9F4EA,#EADFC8)] text-foreground shadow-[0_24px_40px_-12px_rgba(0,0,0,0.45)] ${className ?? ''}`}
      style={{ '--rot': '6deg', transform: 'rotate(6deg)', animation: 'kerst-bob 6s ease-in-out 0.5s infinite' } as React.CSSProperties}
    >
      <div className="absolute inset-2.5 rounded-xl border border-dashed border-primary/45" />
      {/* Lint */}
      <div className="absolute inset-y-0 right-[26%] w-5 bg-[linear-gradient(90deg,#D7BC78,#E6CF95,#D7BC78)]" />
      <div className="absolute inset-x-0 top-[44%] h-5 bg-[linear-gradient(180deg,#D7BC78,#E6CF95,#D7BC78)]" />
      <div className="absolute top-[44%] right-[26%] size-9 -translate-x-[8px] -translate-y-[8px] rounded-full bg-[#E6CF95] shadow-md" />
      <div className="relative flex h-full flex-col justify-between p-5">
        <ZenSpaIcon className="h-7 w-auto text-primary" />
        <div>
          <p className="font-heading text-[30px] leading-none tracking-tight">Cadeaubon</p>
          <p className="mt-1.5 text-[10px] font-semibold tracking-[0.18em] text-foreground/60 uppercase">Zen Spa · House of Beauty</p>
        </div>
      </div>
    </div>
  )
}


type Look = { ribbon: string; body: string; lid: string }
const PINK: Look = { body: '#E5A8B4', lid: '#D68C9D', ribbon: '#F4EFE4' }
const GOLD: Look = { body: '#E6CF95', lid: '#D2B66F', ribbon: '#B5485B' }
const OLIVE: Look = { body: '#657350', lid: '#53603F', ribbon: '#E6CF95' }
const RED: Look = { body: '#B5485B', lid: '#9B3A4C', ribbon: '#E6CF95' }
const CREAM: Look = { body: '#F4EFE4', lid: '#E8DFCC', ribbon: '#E5A8B4' }

type PileItem = { x: number; y: number; w: number; rot: number; look: Look; variant?: 'wide' | 'tall' }

/**
 * Cadeautjes in rijen met diepte, zoals onder een boom op de grond: achteraan groot en hoger in beeld,
 * voorin klein en lager, zodat de kleine pakjes goed zichtbaar blijven. Alleen voor/achter elkaar, nooit op elkaar.
 * x = vanaf links, y = hoogte van de onderkant (px), w = breedte.
 */
const ITEMS_LEFT: PileItem[] = [
  // achterste rij (groot)
  { x: 20, y: 24, w: 112, rot: -3, look: OLIVE },
  { x: 96, y: 26, w: 86, variant: 'tall', rot: 3, look: GOLD },
  { x: 160, y: 24, w: 122, rot: -2, look: RED },
  { x: 250, y: 26, w: 78, variant: 'tall', rot: 4, look: PINK },
  // middelste rij
  { x: 40, y: 10, w: 80, rot: 3, look: PINK },
  { x: 104, y: 8, w: 62, variant: 'tall', rot: -4, look: CREAM },
  { x: 150, y: 10, w: 82, rot: 3, look: GOLD },
  { x: 214, y: 8, w: 64, variant: 'tall', rot: -3, look: OLIVE },
  // voorste rij (klein)
  { x: 26, y: 0, w: 54, variant: 'tall', rot: -5, look: RED },
  { x: 66, y: 0, w: 58, rot: 4, look: GOLD },
  { x: 112, y: 0, w: 46, variant: 'tall', rot: -3, look: PINK },
  { x: 146, y: 0, w: 62, rot: 3, look: CREAM },
  { x: 196, y: 0, w: 48, variant: 'tall', rot: 5, look: OLIVE },
  { x: 232, y: 0, w: 58, rot: -4, look: RED },
]
const ITEMS_RIGHT: PileItem[] = [
  // achterste rij (groot)
  { x: 16, y: 24, w: 96, variant: 'tall', rot: -3, look: PINK },
  { x: 84, y: 24, w: 124, rot: 3, look: GOLD },
  { x: 188, y: 26, w: 90, variant: 'tall', rot: -2, look: RED },
  { x: 250, y: 24, w: 80, rot: 4, look: OLIVE },
  // middelste rij
  { x: 36, y: 10, w: 76, rot: 4, look: CREAM },
  { x: 98, y: 8, w: 84, rot: -3, look: OLIVE },
  { x: 168, y: 10, w: 60, variant: 'tall', rot: 4, look: PINK },
  { x: 212, y: 8, w: 70, rot: -3, look: GOLD },
  // voorste rij (klein)
  { x: 24, y: 0, w: 58, rot: -4, look: GOLD },
  { x: 70, y: 0, w: 48, variant: 'tall', rot: 4, look: RED },
  { x: 108, y: 0, w: 62, rot: -3, look: PINK },
  { x: 158, y: 0, w: 50, variant: 'tall', rot: -5, look: GOLD },
  { x: 196, y: 0, w: 58, rot: 5, look: CREAM },
  { x: 240, y: 0, w: 46, variant: 'tall', rot: -4, look: OLIVE },
]

/** Een versierde kerstboom met lichtjes en een ster */
function XmasTree({ className }: { className?: string }) {
  return (
    <svg aria-hidden viewBox="0 0 200 270" className={className}>
      <rect x="91" y="222" width="18" height="32" rx="2" fill="#4A3B2C" />
      <polygon points="100,98 186,224 14,224" fill="#2C3822" />
      <polygon points="100,52 166,156 34,156" fill="#33422A" />
      <polygon points="100,12 148,92 52,92" fill="#3B4B31" />
      <g fill="none" stroke="#E6CF95" strokeOpacity="0.75" strokeWidth="2" strokeLinecap="round">
        <path d="M58 80 C 80 92, 120 92, 142 80" />
        <path d="M44 138 C 76 154, 124 154, 156 138" />
        <path d="M26 206 C 68 226, 132 226, 174 206" />
      </g>
      {[
        [86, 70, '#C14A5E'], [116, 78, '#E6CF95'], [70, 124, '#E6CF95'], [102, 142, '#C14A5E'], [138, 126, '#F4EFE4'],
        [48, 192, '#C14A5E'], [88, 204, '#F4EFE4'], [126, 206, '#E6CF95'], [160, 192, '#C14A5E'],
      ].map(([x, y, c], i) => (
        <g key={i}>
          <circle cx={x as number} cy={y as number} r="6" fill={c as string} />
          <circle cx={(x as number) - 2} cy={(y as number) - 2} r="1.6" fill="#fff" fillOpacity="0.6" />
        </g>
      ))}
      {[[100, 40], [74, 108], [128, 112], [58, 168], [150, 170], [30, 214], [170, 214]].map(([x, y], i) => (
        <circle key={i} className="kerst-light" cx={x} cy={y} r="2.6" fill="#FBF3D5" style={{ animation: `kerst-twinkle ${2.6 + (i % 3) * 0.6}s ease-in-out ${i * 0.35}s infinite` }} />
      ))}
      <path d="M100 -2 L104.5 8 L115 9.5 L107.5 17 L109.5 27.5 L100 22.5 L90.5 27.5 L92.5 17 L85 9.5 L95.5 8 Z" fill="#E6CF95" />
    </svg>
  )
}

/** Boom met cadeautjes eronder; staat op de sneeuw en beweegt als geheel */
function TreeScene({ items, treeClassName, className }: { items: PileItem[]; treeClassName: string; className?: string }) {
  return (
    <div aria-hidden className={`relative h-[330px] w-[340px] ${className ?? ''}`}>
      <XmasTree className={`absolute bottom-[34px] hidden md:block ${treeClassName}`} />
      {/* Voorste rijen liggen over de achterste: sorteer op hoogte, laagste (voorste) bovenop */}
      {[...items].sort((a, b) => b.y - a.y).map((g, i) => (
        <div key={i} className="absolute" style={{ left: g.x, bottom: g.y, width: g.w, zIndex: i + 1 }}>
          <span
            aria-hidden
            className="absolute -bottom-1 left-[8%] h-2.5 w-[84%] rounded-full bg-black/35 blur-[3px]"
            style={{ zIndex: -1 }}
          />
          <GiftArt ribbon={g.look.ribbon} body={g.look.body} lid={g.look.lid} variant={g.variant} rot={g.rot} still className="w-full drop-shadow-[0_6px_8px_rgba(0,0,0,0.35)]" />
        </div>
      ))}
    </div>
  )
}

/**
 * Teaser voor de cadeaubon (en kerstactie). Bewust zonder bedragen of kortingen:
 * zet die in de tekst zodra de actie vaststaat.
 */
export function KerstBanner() {
  return (
    <section
      aria-labelledby="kerst-heading"
      className="relative z-20 -mt-3 overflow-x-clip text-primary-foreground md:mt-24"
    >
      {/* Twee kerstbomen met cadeautjes eronder, staand op de sneeuw. Elk tafereel beweegt als geheel met de scroll. */}
      <ParallaxLayer speed={26} className="pointer-events-none absolute bottom-3 left-1.5 z-30 md:bottom-4 md:left-[2%]">
        <TreeScene items={ITEMS_LEFT} treeClassName="left-[70px] w-[200px]" className="origin-bottom-left scale-[0.55] md:scale-[0.68] xl:scale-[0.9]" />
      </ParallaxLayer>
      <ParallaxLayer speed={36} className="pointer-events-none absolute right-1.5 bottom-3 z-30 md:right-[2%] md:bottom-4">
        <TreeScene items={ITEMS_RIGHT} treeClassName="left-[80px] w-[170px]" className="origin-bottom-right scale-[0.55] md:scale-[0.62] xl:scale-[0.82]" />
      </ParallaxLayer>

      {/* Het bonnetje, zwevend rechts (brede schermen) */}
      <ParallaxLayer speed={-25} className="pointer-events-none absolute top-[24%] right-[4%] z-20 hidden xl:block">
        <VoucherCard />
      </ParallaxLayer>

      {/* Achtergrond en versiering, afgesneden op het kader */}
      <div className="absolute inset-0 overflow-hidden bg-[linear-gradient(160deg,oklch(0.50_0.054_122),oklch(0.36_0.05_122))]" aria-hidden>
        {/* Lichtsnoer */}
        <div className="pointer-events-none absolute inset-x-0 top-0 h-6">
          <div className="absolute inset-x-0 top-2 h-px bg-white/25" />
          <div className="absolute inset-x-3 top-1.5 flex justify-between md:inset-x-8">
            {LIGHTS.map((i) => (
              <span
                key={i}
                className="kerst-light size-2 rounded-full md:size-2.5"
                style={{
                  background: i % 3 === 0 ? '#E6CF95' : i % 3 === 1 ? '#F4EFE4' : '#E5A8B4',
                  boxShadow: '0 0 10px 2px rgba(244, 239, 228, 0.55)',
                  animation: `kerst-twinkle ${2.4 + (i % 4) * 0.5}s ease-in-out ${(i % 7) * 0.3}s infinite`,
                }}
              />
            ))}
          </div>
        </div>

        {/* Kerstballen aan het lichtsnoer */}
        <div className="pointer-events-none absolute inset-x-0 top-0">
          <Bauble color="#B5485B" length={34} size={22} delay={0} className="left-[6%]" />
          <Bauble color="#E6CF95" length={58} size={26} delay={1.1} className="left-[15%] hidden md:block" />
          <Bauble color="#F4EFE4" length={30} size={20} delay={0.5} className="left-[31%] hidden md:block" />
          <Bauble color="#E5A8B4" length={46} size={24} delay={1.6} className="right-[24%] hidden md:block" />
          <Bauble color="#B5485B" length={32} size={22} delay={0.8} className="right-[8%]" />
        </div>

        {/* Hulst in de bovenhoeken */}
        <Holly className="pointer-events-none absolute top-5 -left-3 w-32 md:top-7 md:w-60" />
        <Holly flip className="pointer-events-none absolute top-5 -right-3 w-32 md:top-7 md:w-60" />

        {/* Noorse truienranden */}
        <NordicBand id="nordic-top" className="absolute inset-x-0 top-8 opacity-90" />
        <NordicBand id="nordic-bottom" className="absolute inset-x-0 bottom-9 opacity-90 md:bottom-14" />

        {/* Vallende sneeuw */}
        <div className="pointer-events-none absolute inset-0">
          {FLAKES.map((f, i) => (
            <Snowflake
              key={i}
              className="kerst-flake absolute top-0 text-white/40"
              strokeWidth={1.25}
              style={
                {
                  left: `${f.left}%`,
                  width: f.size,
                  height: f.size,
                  '--drift': `${f.drift}px`,
                  animation: `kerst-fall ${f.dur}s linear ${f.delay}s infinite`,
                } as React.CSSProperties
              }
            />
          ))}
        </div>

        {/* Dennenbomen */}
        <div className="pointer-events-none absolute inset-x-0 bottom-24 hidden h-28 md:block">
          {TREES.map((t, i) => (
            <TreePine
              key={i}
              className="absolute bottom-0 text-white/[0.1]"
              strokeWidth={1.25}
              style={{ left: `${t.left}%`, width: t.size, height: t.size * 1.4 }}
            />
          ))}
        </div>
        <SnowDrift />
      </div>
      {/* Sluit de onderrand af in de achtergrondkleur: geen haarlijn of gat tussen banner en volgende sectie */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -bottom-px z-10 h-[3px] bg-background" />

      <Reveal>
        <div className="relative mx-auto flex max-w-[760px] flex-col items-center gap-5 px-6 pt-24 pb-28 text-center md:pt-36 md:pb-40">
          <p className="flex items-center gap-2 text-[12px] font-semibold tracking-[0.2em] text-[#E6CF95] uppercase">
            <Sparkles aria-hidden className="size-4" />
            Kerst bij Zen Spa
            <Sparkles aria-hidden className="size-4" />
          </p>
          <h2 id="kerst-heading" className="font-heading text-[38px] leading-[1.08] tracking-tight md:text-[64px]">
            Geef een cadeaubon cadeau
          </h2>
          <p className="max-w-[560px] text-[16px] leading-[1.75] text-primary-foreground/90 md:text-[18px]">
            Een moment van rust voor iemand die je dierbaar is. Mooi voor de feestdagen, en altijd gewenst.
          </p>
          <Link
            href="/cadeaubon"
            className="group mt-2 inline-flex items-center justify-center gap-2.5 rounded-full bg-background px-7 py-4 text-[16px] font-medium text-foreground shadow-lg shadow-black/25 transition-transform hover:-translate-y-0.5 motion-reduce:hover:translate-y-0"
          >
            <Gift aria-hidden className="size-5 text-primary" />
            Bekijk de cadeaubon
            <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1 motion-reduce:group-hover:translate-x-0" />
          </Link>
          <div className="mt-5">
            <KerstCountdown />
          </div>
        </div>
      </Reveal>
    </section>
  )
}
