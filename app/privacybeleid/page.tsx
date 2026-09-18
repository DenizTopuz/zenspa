import Image from 'next/image'
import { SiteNav } from '@/components/site-nav'
import { SiteFooter } from '@/components/site-footer'

export const metadata = {
  title: 'Privacybeleid — Zen Spa',
  description: 'Lees hoe Zen Spa omgaat met jouw persoonsgegevens en welke rechten jij hebt.',
}

export default function PrivacybeleidPage() {
  return (
    <>
      <SiteNav />
      <main>

        {/* ── Hero ── */}
        <section className="relative flex min-h-[72vh] items-center overflow-hidden" aria-label="Privacybeleid">
          <div className="absolute inset-x-0 -bottom-[15%] -top-[15%]">
            <Image
              src="/hero.jpg"
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
            <h1 className="font-heading text-[52px] leading-[1.04] tracking-tight md:text-[72px] lg:text-[88px]">
              Privacybeleid
            </h1>
            <p className="mx-auto mt-5 max-w-[480px] text-[17px] leading-[1.85] text-white/68">
              Hoe wij omgaan met jouw persoonsgegevens en welke rechten jij hebt.
            </p>
          </div>
        </section>

        {/* ── Content ── */}
        <section className="relative z-10 -mt-32 overflow-hidden rounded-t-[40px] bg-background md:-mt-48 md:rounded-t-[112px]">
          <div className="mx-auto max-w-[760px] px-5 py-20 md:px-6 md:py-32">
            <div className="prose prose-stone max-w-none text-[16px] leading-[1.85] text-foreground/80
              [&_h2]:font-heading [&_h2]:text-[28px] [&_h2]:font-semibold [&_h2]:leading-snug [&_h2]:tracking-tight [&_h2]:text-foreground [&_h2]:mt-7 [&_h2]:mb-3 [&_h2:first-child]:mt-0
              [&_h3]:font-heading [&_h3]:text-[20px] [&_h3]:font-semibold [&_h3]:text-foreground [&_h3]:mt-8 [&_h3]:mb-3
              [&_p]:mb-4 [&_ul]:mb-4 [&_ul]:pl-0 [&_ul]:list-none [&_li]:mb-1.5">

              <p className="text-[14px] text-foreground/45">Laatst bijgewerkt: 18 september 2026</p>

              <h2>1. Wie zijn wij?</h2>
              <p>
                Zen Spa is een schoonheidssalon gevestigd aan de Kretastraat 77, 1316 VT Almere. Wij zijn verantwoordelijk
                voor de verwerking van persoonsgegevens zoals beschreven in dit privacybeleid.
              </p>
              <p>
                Vragen? Neem contact op via <a href="mailto:info@zenspa.nl" className="text-accent underline underline-offset-2">info@zenspa.nl</a> of bel ons op <a href="tel:0653207729" className="text-accent underline underline-offset-2">06 53 20 77 29</a>.
              </p>

              <h2>2. Welke gegevens verzamelen wij?</h2>
              <p>Wij verzamelen alleen gegevens die noodzakelijk zijn voor het leveren van onze diensten:</p>
              <ul>
                <li>Naam en contactgegevens (e-mailadres, telefoonnummer)</li>
                <li>Afspraakgegevens (datum, tijd, gekozen behandeling)</li>
                <li>Betalingsinformatie (verwerkt via derden — wij slaan geen betaalgegevens op)</li>
                <li>Communicatie die je met ons deelt via e-mail of het contactformulier</li>
              </ul>

              <h2>3. Waarom verwerken wij jouw gegevens?</h2>
              <p>Wij gebruiken jouw persoonsgegevens uitsluitend voor de volgende doeleinden:</p>
              <ul>
                <li>Het plannen, bevestigen en beheren van afspraken</li>
                <li>Het beantwoorden van vragen en het verlenen van klantenservice</li>
                <li>Het versturen van afspraakherinneringen (alleen als je daarvoor toestemming geeft)</li>
                <li>Het voldoen aan wettelijke verplichtingen</li>
              </ul>

              <h2>4. Hoe lang bewaren wij jouw gegevens?</h2>
              <p>
                Wij bewaren jouw persoonsgegevens niet langer dan noodzakelijk voor de doeleinden waarvoor ze zijn
                verzameld. Afspraakgegevens worden maximaal twee jaar bewaard tenzij een langere bewaartermijn wettelijk
                verplicht is. Je kunt altijd vragen om verwijdering van jouw gegevens.
              </p>

              <h2>5. Delen wij gegevens met derden?</h2>
              <p>
                Wij verkopen jouw gegevens nooit aan derden. Wij kunnen gebruik maken van verwerkers (zoals
                onlineboekingssoftware of e-maildiensten) die namens ons handelen. Met deze partijen sluiten wij een
                verwerkersovereenkomst om een gelijk niveau van beveiliging en vertrouwelijkheid te waarborgen.
              </p>

              <h2>6. Jouw rechten</h2>
              <p>Op grond van de Algemene Verordening Gegevensbescherming (AVG) heb jij de volgende rechten:</p>
              <ul>
                <li><strong>Inzage</strong> — Je mag opvragen welke gegevens wij van jou verwerken.</li>
                <li><strong>Correctie</strong> — Je kunt onjuiste gegevens laten corrigeren.</li>
                <li><strong>Verwijdering</strong> — Je kunt ons vragen jouw gegevens te verwijderen.</li>
                <li><strong>Beperking</strong> — Je kunt de verwerking (tijdelijk) laten beperken.</li>
                <li><strong>Bezwaar</strong> — Je kunt bezwaar maken tegen de verwerking van jouw gegevens.</li>
                <li><strong>Dataportabiliteit</strong> — Je kunt jouw gegevens in een leesbaar formaat ontvangen.</li>
              </ul>
              <p>
                Om een van deze rechten uit te oefenen, stuur een e-mail naar{' '}
                <a href="mailto:info@zenspa.nl" className="text-accent underline underline-offset-2">info@zenspa.nl</a>.
                Wij reageren binnen 30 dagen.
              </p>

              <h2>7. Beveiliging</h2>
              <p>
                Wij nemen passende technische en organisatorische maatregelen om jouw persoonsgegevens te beschermen
                tegen verlies, misbruik of ongeautoriseerde toegang.
              </p>

              <h2>8. Cookies</h2>
              <p>
                Onze website maakt gebruik van functionele cookies die noodzakelijk zijn voor het correct functioneren
                van de site. Wij plaatsen geen tracking- of advertentiecookies zonder jouw toestemming.
              </p>

              <h2>9. Klachten</h2>
              <p>
                Heb je een klacht over de verwerking van jouw gegevens? Neem dan eerst contact met ons op. Je hebt ook
                het recht een klacht in te dienen bij de Autoriteit Persoonsgegevens via{' '}
                <a href="https://www.autoriteitpersoonsgegevens.nl" target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2">autoriteitpersoonsgegevens.nl</a>.
              </p>

              <h2>10. Wijzigingen</h2>
              <p>
                Wij behouden het recht dit privacybeleid aan te passen. Bij wezenlijke wijzigingen informeren wij je via
                e-mail of een duidelijke melding op onze website.
              </p>

            </div>
          </div>
        </section>

      </main>
      <SiteFooter />
    </>
  )
}
