# Zen Spa — Huisstijl & Design System

Zen Spa · House of Beauty · Almere Buiten. Schoonheidssalon van Çigdem (huidverzorging, permanente make-up, pedicure).
Dit document beschrijft de huisstijl zoals die op de website (zenspa.nl-ontwerp) is toegepast, inclusief de nieuwste kerst-uitbreidingen.
Gebruik het voor alles wat bij Zen Spa hoort: drukwerk, social, cadeaubon, presentaties.

> Toon: rustig, warm, verzorgd, luxe zonder opsmuk. Veel ruimte, zachte ronde vormen, serif-koppen, olijfgroen op crème.
> Niet doen: felle kleuren, harde zwarte vlakken, drukke patronen, veel verschillende lettertypen, scherpe hoeken.

---

## 1. Kleuren

De waarden hieronder komen uit de code (oklch) en zijn omgerekend naar sRGB-hex. Voor print: converteer naar CMYK en controleer op papier.

| Rol | Hex | Gebruik |
|---|---|---|
| Achtergrond (linnen wit) | `#F8F2E8` | pagina, basisvlak |
| Kaart (gebroken wit) | `#FCF8F3` | kaarten, vlakken boven de achtergrond |
| Wit | `#FFFFFF` | invoervelden, keuzekaartjes, productkaarten |
| Tekst (zwartgroen) | `#0A0C04` | alle lopende tekst en titels. Nooit puur zwart |
| Olijfgroen (primair/accent) | `#5F6947` | knoppen, actieve staten, iconen, accenten |
| Tekst op olijf | `#F3EEE6` | tekst op olijfgroen |
| Gedempte tekst | `#5A6049` | hulpteksten (of tekst op 70% dekking) |
| Zacht crème (secundair) | `#E1D9CD` | subtiele vlakken, pills |
| Muted crème | `#E3DBD1` | sectieachtergronden |
| Rand | `#D9CFC1` | haarlijnen op crème |
| Olijf-verloop (groen blok) | `#636E4B` → `#434C2D` | 135°, prijsblok en banners |

**Contrast (WCAG AA is vereist)**
- Tekst op achtergrond: ruim AA. Kleine hulpteksten minimaal 70% van de tekstkleur.
- Randen van invoervelden en knoppen: tekstkleur op 50% dekking (≈ 3,6 : 1 tegen de achtergrond) zodat ze zichtbaar zijn.
- Crème tekst op olijfverloop: AA voor grote tekst; kleine tekst minimaal 85% dekking.

**Donkere modus** bestaat op de site (achtergrond `oklch(0.148 0.020 120)`, tekst `oklch(0.950 0.012 77)`, olijf `oklch(0.620 0.056 122)`), maar print en cadeaubon gebruiken altijd de lichte variant.

### Kerst-uitbreiding (seizoen, alleen in de kerstperiode gebruiken)
| Rol | Hex |
|---|---|
| Kerstgroen-verloop (banner) | `#5E6846` → `#394123` (160°) |
| Goud | `#E6CF95` (donkerder rand `#D7BC78`) |
| Zacht roze | `#E5A8B4` (donker `#D68C9D`) |
| Bessenrood | `#B5485B` en `#C14A5E` |
| Crème cadeau | `#F4EFE4` (deksel `#E8DFCC`) |
| Olijf-cadeau | `#657350` (deksel `#53603F`) |
| Boom-groen | `#2C3822`, `#33422A`, `#3B4B31`; stam `#4A3B2C` |

---

## 2. Typografie

- **Koppen:** EB Garamond (Google Fonts), gewicht 400, soms 600 voor prijzen en cijfers. Strak aansluitende regelafstand (≈ 1,05–1,2), licht negatieve letterspatiëring.
- **Lopende tekst en labels:** Nunito Sans, gewicht 400/500/600.
- Alleen deze twee lettertypen. Geen schreeflettertypen of handschriften erbij.

| Gebruik | Lettertype | Grootte (web) |
|---|---|---|
| Hero-titel | EB Garamond 400 | 64 px |
| Sectietitel | EB Garamond 400 | 36–48 px |
| Blokkop (bijv. "Kies een bedrag") | EB Garamond 400 | 22–28 px |
| Kaarttitel / productnaam | EB Garamond 400 | 24–30 px |
| Prijs | EB Garamond 600 | 26–48 px, in olijfgroen of crème op groen |
| Lopende tekst | Nunito Sans 400 | 16–18 px, regelafstand 1,7 |
| Hulptekst | Nunito Sans 400 | 13–14 px, 70% dekking |
| Label / eyebrow | Nunito Sans 600, HOOFDLETTERS | 11–12 px, letterspatiëring 0,16–0,2 em |

Vuistregel voor hiërarchie: één groot serif-element per blok (de titel), daaronder een klein hoofdletterlabel of hulptekst. Niet drie elementen van gelijke zwaarte naast elkaar.

---

## 3. Logo

- **Merkteken:** de lotus (negen vormen), twee vormen van het logo: het teken alleen, en het teken met "zen spa" en daaronder "HOUSE OF BEAUTY".
- Kleuren: olijfgroen op lichte achtergrond, crème/wit op olijf of foto.
- Vrije ruimte rondom: minimaal de hoogte van de middelste lotusblad.
- Nooit uitrekken, kantelen of voorzien van schaduw.

Lotusteken als SVG (viewBox `0 0 165 89.22`, vul met huisstijlkleur):

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 165 89.22" fill="#5F6947">
  <path d="M91.49,35.28c.31-2.41.33-5.21-.37-8.08-3.4-14.02-14.47-24.79-16.6-26.76-.2-.19-.51-.19-.71,0-2.13,1.97-13.2,12.74-16.6,26.76-.7,2.88-.68,5.67-.37,8.08.42,3.23,1.5,6.34,3.06,9.2,2.94,5.38,11.56,21.63,13.75,30.93.13.54.9.54,1.02,0,2.19-9.29,10.82-25.55,13.75-30.93,1.56-2.86,2.64-5.96,3.06-9.2Z"/>
  <path d="M18.39,30.8c-.39-.02-.7.3-.7.68.11,17.17,4.15,21.27,5.06,21.98.11.08.24.13.37.13,24.79,1.14,38.86,17.47,43.6,24.14.42.6,1.36.18,1.21-.54C59.08,34.29,23.82,31.05,18.39,30.8Z"/>
  <path d="M125.58,53.6c.14,0,.27-.05.37-.13.91-.71,4.95-4.81,5.06-21.98,0-.39-.32-.7-.7-.68-5.43.24-40.69,3.48-49.54,46.4-.15.72.78,1.13,1.21.54,4.74-6.67,18.81-23,43.6-24.14Z"/>
  <path d="M50.28,85.88c-22.7-7.56-28.85-24.31-29.76-27.22-.08-.26-.32-.45-.59-.47-8.89-.72-16.58.77-19,1.32-.41.09-.64.54-.47.93,12.02,27.99,40.31,27.68,49.68,26.75.72-.07.83-1.08.15-1.31Z"/>
  <path d="M148.18,59.51c-2.42-.54-10.11-2.03-19-1.32-.28.02-.51.21-.59.47-.91,2.91-7.06,19.66-29.76,27.22-.69.23-.57,1.24.15,1.31,9.37.93,37.66,1.23,49.68-26.75.17-.39-.06-.84-.47-.93Z"/>
  <path d="M26.94,58.9c-.5-.04-.87.47-.67.94,1.94,4.6,11.56,23.57,38.42,24.12.53.01.87-.58.58-1.03-2.81-4.54-15.25-22.37-38.33-24.02Z"/>
  <path d="M122.83,59.84c.19-.46-.17-.97-.67-.94-23.09,1.65-35.53,19.48-38.33,24.02-.28.45.05,1.04.58,1.03,26.86-.55,36.48-19.51,38.42-24.12Z"/>
  <path d="M44.32,34.25c3.48,2.25,6.44,3.22,7.91,3.59.46.12.9-.26.84-.73-.42-3.27-.31-6.45-1.48-8.84-2.52-5.16-8.42-7.13-10.47-7.68-.39-.1-.78.15-.84.55-.91,6.35,1.07,11.19,4.04,13.12Z"/>
  <path d="M96.11,37.84c1.46-.37,4.43-1.34,7.91-3.59,2.97-1.93,4.95-6.77,4.04-13.12-.06-.4-.45-.65-.84-.55-2.05.55-7.95,2.52-10.47,7.68-1.17,2.39-1.06,5.57-1.48,8.84-.06.47.38.85.84.73Z"/>
</svg>
```

Het volledige logo met tekst staat in de repository: `public/logo-green.svg` en `public/logo-variant.svg`.

---

## 4. Vormtaal

- **Alles rond.** Knoppen en pills: volledig afgerond (`rounded-full`). Kaarten: 22–24 px radius. Grote banners en secties: 32–44 px, bovenkanten van secties soms 112 px.
- **Invoervelden en keuzelijsten:** hoogte 48 px, radius 12 px, wit, rand 1 px in tekstkleur op 50%, bij focus olijfgroene rand + zachte ring.
- **Schaduwen:** zacht en breed (`0 18px 50px rgba(33,35,27,0.16)`), nooit hard of zwart. Gekleurde vlakken krijgen een schaduw in hun eigen tint.
- **Lijnen:** haarlijnen (1 px) op crème. Geen dikke zwarte lijnen. Liever een lichte tint-achtergrond dan een scheidingslijn.
- **Afbeeldingen:** warme, zachte fotografie van de salon en behandelingen. Afgeronde hoeken.
- **Beweging:** rustig. Overgangen 200–500 ms, zachte easing. Respecteer "minder beweging".

---

## 5. Componenten en patronen

**Knoppen**
- Primair: olijfgroen gevuld, tekst crème, volledig afgerond, hoogte 48–56 px, pijltje rechts dat bij hover meebeweegt.
- Op donker: crème/witte knop met donkere tekst.
- Secundair: witte pill met rand.

**Tabs / keuzeschakelaar** (huisstijlpatroon)
- Container: olijf op 10% dekking, volledig afgerond, 6 px padding.
- Actief: olijfgroen gevuld, witte tekst, lichte schaduw. Niet-actief: gedempte tekst.
- Op desktop: wit schuivend vlak met olijfkleurige tekst.

**Keuzekaartjes** (bijv. formaten 30/50/100 ml, bedragen)
- Wit, afgerond (12–16 px), rand 50%. Actief: olijfgroen gevuld met crème tekst, of olijfgroene rand met ring. Het actieve kaartje moet in één oogopslag zichtbaar zijn.

**Titels in formulieren:** EB Garamond 22 px, daaronder het veld, daaronder hulptekst (13–14 px). Alle velden dezelfde hoogte.

**Prijsblok:** olijfverloop (135°), crèmekleurige prijs in EB Garamond 600, kleine crèmekleurige knop. Zachte lichtcirkel rechtsboven voor diepte.

**Navigatie (mobiel, onderaan):** zes gelijke items — Home, Zen Spa, Diensten, Parfums, Contact, Afspraak. Icoon in dunne lijn (1,7 px), label 10 px, actief item olijfgroen met licht olijfvlak en een lijntje bovenin. Alle items hebben dezelfde stijl.

**Filters (parfums):** zoeken, geurfamilies als verticale lijst (olijf-tinten container), geurnoten als witte pills met gekleurd stipje. Op desktop zijn de filters links en blijven ze meescrollen.

**Productkaart (parfum):** wit, afgerond, foto bovenaan, naam in serif, "vanaf €…" in olijfgroene serif, geurnoten als kleine pills.

---

## 6. Kerst-uitbreiding (seizoen 2026)

Alleen gebruiken tussen ongeveer 20 november en 1 januari.

- **Achtergrond:** olijf-verloop `#5E6846 → #394123`, volle breedte.
- **Noorse truienrand:** herhalend patroon in crème (40% dekking) met zigzaglijn, vierpuntssterren, ruitjes, dennenboompjes en puntjes. Boven en onder de banner.
- **Lichtsnoer:** dunne lijn met kleine lichtjes in crème, goud en zacht roze die zacht twinkelen.
- **Kerstballen** aan draadjes (rood, goud, crème, roze) die zacht slingeren.
- **Sneeuw:** dunne sneeuwvlokken die langzaam vallen; golvende sneeuwrand (twee lagen) onderaan die overloopt in de volgende sectie.
- **Hulst** in de bovenhoeken: olijfgroene bladeren met drie rode bessen.
- **Kerstbomen met cadeautjes:** versierde boom (ster in goud, ballen, lichtjes) met cadeautjes eronder in rijen met diepte: achteraan groot en hoger, voorin klein en lager. Cadeautjes staan op de sneeuw met een zachte schaduw; ze liggen nooit op elkaar.
- **Cadeautjes (illustratie):** afgeronde doos met deksel, lint verticaal en horizontaal, strik met twee lussen. Kleurcombinaties: roze met crème lint, goud met rood lint, olijf met goud lint, rood met goud lint, crème met roze lint.
- **Aftelklok** tot 25 december: drie kaartjes (dagen, uren, minuten), doorschijnend wit op groen, cijfers in EB Garamond.
- **Cadeaubon-kaartje (illustratie):** liggend kaartje in crème-verloop (`#F9F4EA → #EADFC8`), gestippelde olijfgroene binnenrand, gouden lint kruislings met knoop, lotusteken, "Cadeaubon" in EB Garamond en "ZEN SPA · HOUSE OF BEAUTY" in klein hoofdletterlabel.

---

## 7. Gegevens van Zen Spa (controleer voor gebruik)

- Zen Spa · House of Beauty
- Kretastraat 77, 1339 VT Almere
- Telefoon en WhatsApp: 06 53 20 77 29
- E-mail: info@zenspa.nl
- Instagram: @cigdemzenspa
- Werkdagen: maandag, dinsdag en vrijdag
- Behandelingen: gezichtsbehandelingen (Mini Zen Moment, Basis, Classic, Deluxe, Tiener, Microneedling, Galvanic Spa), Spa pedicure, rugbehandeling, permanente make-up (wenkbrauwen, ogen, lippen), ontharen, parfums (Yodeyma, 30/50/100 ml)

---

## 8. Opdracht: offline cadeaubon (print, vector)

**Doel:** een afdrukbare cadeaubon in de huisstijl van Zen Spa. Dit staat los van de website.

**Formaat en bestand**
- Artboard **603,78 × 277,8 pt** (ongeveer 213 × 98 mm), liggend.
- Alles als **vector** (paden, vormen, tekst omgezet naar contouren). Geen foto's of rasterafbeeldingen.
- Opleveren als **Adobe Illustrator (.ai)**, plus **SVG** en **PDF** (vector). Kleuren in RGB én een CMYK-versie voor drukwerk.
- Voeg 3 mm afloop (bleed) toe als variant voor de drukker.

**Verplichte velden** (invulbaar met pen, met lijntje):
- **Voor:** ______
- **Behandeling:** ______
- **Datum:** ______
- Tekst: "**Deze cadeaubon is 1 jaar geldig.**"

**Inhoud en sfeer**
- Titel "**Cadeaubon**" in EB Garamond (grote serif, olijfgroen), ondertitel bijvoorbeeld "Een moment van rust voor jou".
- Lotusteken en/of logo met "zen spa · house of beauty".
- Onderaan klein: adres, telefoon, e-mail en @cigdemzenspa.
- Optioneel een lint met strik in goud (`#E6CF95`) als verwijzing naar "cadeau"; houd het sober.
- Twee uitvoeringen graag: (1) neutraal het hele jaar, (2) kerst-variant met subtiel Noors truienpatroon en een klein cadeautje met strik.

**Presentatie:** laat het ontwerp zien als voorbeeld, in een aparte weergave, naast de opleverbestanden.

**Niet doen:** foto's, harde zwarte vlakken, drukke achtergronden, schreefloze koppen, meer dan twee lettertypen, tekst die te dicht bij de rand staat (houd 5 mm veilige marge).
