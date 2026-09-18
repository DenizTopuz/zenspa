import Image from 'next/image'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'

export const metadata = {
  title: 'Algemene voorwaarden — Zen Spa',
  description: 'Lees de algemene voorwaarden van Zen Spa voor het boeken van behandelingen en het gebruik van onze diensten.',
}

export default function AlgemeneVoorwaardenPage() {
  return (
    <>
      <SiteNav />
      <main>

        {/* ── Hero ── */}
        <section className="relative flex min-h-[55vh] items-center overflow-hidden" aria-label="Algemene voorwaarden">
          <div className="absolute inset-x-0 -bottom-[15%] -top-[15%]">
            <Image
              src="/bg-leaves.jpg"
              alt=""
              fill
              aria-hidden
              priority
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/52 to-black/80" />
          <div className="relative z-10 w-full px-6 pt-20 pb-40 text-center text-white md:px-8 md:pt-28 md:pb-52">
            <h1 className="font-heading text-[44px] leading-[1.04] tracking-tight md:text-[72px] lg:text-[88px]">
              Algemene voorwaarden
            </h1>
            <p className="mx-auto mt-5 max-w-[480px] text-[17px] leading-[1.85] text-white/68">
              De afspraken die gelden voor het gebruik van onze diensten en het boeken van behandelingen.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="relative z-10 -mt-32 overflow-hidden rounded-t-[40px] bg-background md:-mt-48 md:rounded-t-[112px]">
          <div className="mx-auto max-w-[760px] px-5 py-20 md:px-6 md:py-32">
            <div className="prose prose-stone max-w-none text-[16px] leading-[1.85] text-foreground/80
              [&_h2]:font-heading [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-12 [&_h2]:mb-4 [&_h2:first-child]:mt-0
              [&_h3]:font-heading [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-5 [&_li]:mb-1.5">

              <p className="text-[14px] text-foreground/45">Laatst bijgewerkt: september 2025</p>

              <h2>1. Toepasselijkheid</h2>
              <p>
                Deze algemene voorwaarden zijn van toepassing op alle diensten van Zen Spa, gevestigd aan de
                Kretastraat 77, 1316 VT Almere. Door een afspraak te maken of gebruik te maken van onze diensten,
                ga je akkoord met deze voorwaarden.
              </p>

              <h2>2. Afspraken maken</h2>
              <p>
                Afspraken kunnen worden gemaakt via onze website, telefonisch of per e-mail. Een afspraak is definitief
                na ontvangst van onze bevestiging. Wij adviseren minimaal 48 uur van tevoren te boeken om jouw
                voorkeurstijd en behandelaar zeker te stellen.
              </p>

              <h2>3. Annulering en no-show</h2>
              <p>
                Wij vragen je afspraken tijdig te annuleren zodat anderen gebruik kunnen maken van de vrijgekomen tijd:
              </p>
              <ul>
                <li><strong>Meer dan 24 uur van tevoren:</strong> kosteloos annuleren.</li>
                <li><strong>Minder dan 24 uur van tevoren:</strong> 50% van het behandelingsbed­rag wordt in rekening gebracht.</li>
                <li><strong>Niet verschijnen zonder bericht (no-show):</strong> 100% van het behandelingsbedrag wordt in rekening gebracht.</li>
              </ul>
              <p>
                Annuleren kan via <a href="mailto:info@zenspa.nl" className="text-accent underline underline-offset-2">info@zenspa.nl</a> of telefonisch op <a href="tel:0653207729" className="text-accent underline underline-offset-2">06 53 20 77 29</a>.
              </p>

              <h2>4. Te laat komen</h2>
              <p>
                Als je te laat bent, wordt de behandeling ingekort zodat de volgende afspraak niet wordt vertraagd.
                Het volledige behandelingsbedrag blijft verschuldigd. Verzoek ons altijd van tevoren te informeren als
                je vertraging verwacht.
              </p>

              <h2>5. Prijzen en betaling</h2>
              <p>
                Alle prijzen zijn inclusief BTW. Betaling vindt plaats direct na de behandeling, tenzij anders
                overeengekomen. Wij accepteren contante betaling en de meest gangbare betaalmethoden.
                Wijzigingen in de prijzen worden minimaal 30 dagen van tevoren aangekondigd.
              </p>

              <h2>6. Gezondheid en veiligheid</h2>
              <p>
                Informeer ons vóór de behandeling over relevante gezondheidsomstandigheden, allergieën,
                zwangerschap of het gebruik van medicijnen. Bij twijfel over de geschiktheid van een behandeling
                behouden wij ons het recht voor deze te weigeren of aan te passen, in jouw belang.
              </p>
              <p>
                Sommige behandelingen zijn niet geschikt tijdens zwangerschap of bij bepaalde aandoeningen.
                Neem bij twijfel vooraf contact met ons op.
              </p>

              <h2>7. Aansprakelijkheid</h2>
              <p>
                Zen Spa spant zich in om behandelingen op zorgvuldige en professionele wijze uit te voeren.
                Onze aansprakelijkheid is beperkt tot het bedrag dat voor de desbetreffende behandeling is betaald,
                tenzij er sprake is van opzet of grove nalatigheid.
              </p>
              <p>
                Zen Spa is niet aansprakelijk voor verlies of diefstal van persoonlijke eigendommen tijdens
                het bezoek.
              </p>

              <h2>8. Cadeaubonnen</h2>
              <p>
                Cadeaubonnen zijn 12 maanden geldig vanaf de aankoopdatum en niet inwisselbaar voor contant geld.
                Vermeld bij het inplannen van een afspraak altijd de code op de cadeaubon.
              </p>

              <h2>9. Privacy</h2>
              <p>
                Wij verwerken jouw persoonsgegevens conform ons{' '}
                <a href="/privacybeleid" className="text-accent underline underline-offset-2">privacybeleid</a>.
              </p>

              <h2>10. Klachten</h2>
              <p>
                Ben je niet tevreden? Neem dan zo snel mogelijk contact met ons op, bij voorkeur via{' '}
                <a href="mailto:info@zenspa.nl" className="text-accent underline underline-offset-2">info@zenspa.nl</a>.
                Wij nemen iedere klacht serieus en streven ernaar deze binnen vijf werkdagen op te lossen.
              </p>

              <h2>11. Toepasselijk recht</h2>
              <p>
                Op deze voorwaarden is Nederlands recht van toepassing. Geschillen worden in eerste instantie
                voorgelegd aan de bevoegde rechter in het arrondissement Midden-Nederland.
              </p>

            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
