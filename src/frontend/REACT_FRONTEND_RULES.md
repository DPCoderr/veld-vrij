# React frontend rules — VeldVrij

Deze afspraken gelden voor de hele frontend. Het project gebruikt React 19, TypeScript, TanStack Start/Router/Form, Tailwind CSS 4 en shadcn/ui. UI-teksten zijn Nederlands.

## Bestanden en verantwoordelijkheden

- `src/routes/`: dunne TanStack-routes. Lees parameters, kies de paginacomponent en geef een stabiele key wanneer een entiteit wisselt. Schrijf geen complete schermen in routes. `routeTree.gen.ts` wordt gegenereerd met `npm run generate-routes`.
- `src/features/<feature>/`: paginacomponenten, formulieren en onderdelen van één feature. Eén zelfstandig component per bestand; gebruik kleine lokale renderhelpers alleen voor eenvoudige herhaling, niet als verborgen componentdefinities.
- `src/components/ui/`: gedeelde shadcn-primitives. Voeg ontbrekende componenten met de shadcn-CLI toe; maak geen tweede implementatie van dezelfde primitive.
- `src/components/layout/` en `src/components/shared/`: herbruikbare layouts en domeinonafhankelijke UI. Navigatie gebruikt `AppLink`/TanStack Router, acties gebruiken knoppen.
- `src/features/demo/data/pages/`: één JSON-bestand per mockuppagina. Gedeelde entiteiten staan in `catalog.json`, bijzondere snapshots in `scenarios/`. Kopieer geen veldprijzen, namen of reserveringsstatussen tussen pagina’s.
- `src/features/demo/types.ts`, `model.ts`, `demo-provider.tsx`: domeintypes, pure transities/selectors en de React-provider. Presentatiecode voert geen eigen concurrerende boekingslogica uit.
- `src/lib/`: kleine pure helpers, waaronder geld/tijd en de enige `cn`-implementatie. Imports gebruiken `#/`.

## React en state

- Components zijn pure functies van props, state en context. Geen I/O, mutaties, willekeurige waarden of huidige tijd tijdens renderen. Gebruik JSX; roep componentfuncties niet direct aan. Definieer componenten buiten andere componenten.
- Hooks staan onvoorwaardelijk op het hoogste niveau van een component of custom hook. Geen hooks in lussen, eventhandlers, callbacks of na conditionele returns.
- Props, JSON-fixtures, reducerstate en hookresultaten zijn onveranderlijk. Maak bij een wijziging nieuwe objecten/arrays. Gebruik functionele state-updates wanneer de volgende waarde afhangt van de vorige.
- Afgeleide waarden — gefilterde lijsten, totalen, beschikbaarheid — worden berekend. Sla ze niet nogmaals op via een effect. Voeg `useMemo`/`useCallback` alleen toe wanneer daar een concrete reden voor is.
- Lokale invoer, geopende dialogen en tabs horen bij hun component. Boekingen, velden, locaties, rol en demotijd zitten in één provider. Voeg geen tweede store of querycache voor diezelfde demodata toe.
- `useEffect` is alleen voor synchronisatie met iets buiten React, zoals een browser-eventlistener. Neem alle reactieve dependencies op en ruim listeners/timers op. Eventacties horen in eventhandlers.
- Gebruik stabiele domein-ID’s als React-key. Een array-index is alleen toegestaan voor werkelijk vaste posities, met een gerichte uitleg bij een lintuitzondering.
- Browser-API’s zoals clipboard horen in events/effects. Providers worden per renderboom aangemaakt, nooit als veranderlijke singleton op de SSR-server. Server en eerste clientrender gebruiken dezelfde fixture en vaste klok.
- Nieuwe props, actions, varianten en JSON-contracten krijgen expliciete types. Geen `any` om fouten te verbergen. Valideer externe input met Zod.

Bronnen: [Rules of React](https://react.dev/reference/rules), [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect).

## Formulieren en toegankelijkheid

- Gebruik TanStack Form met Zod voor invoerformulieren en shadcn Field/Input/Select/Checkbox/Switch. Verbind labels, invoervelden en foutteksten; gebruik `aria-invalid` waar nodig.
- Een formulier submit via Enter. Niet-submitknoppen in formulieren krijgen `type="button"`. Geef icon-onlyknoppen een toegankelijke naam. Gebruik geen `href="#"` als actie.
- Dialogen gebruiken de shadcn/Radix-focusafhandeling, een titel en omschrijving. Destructieve acties vragen een duidelijke bevestiging met gevolgen.
- Toon status met tekst en eventueel icoon, niet alleen kleur. Maak asynchrone meldingen toegankelijk met live regions.
- Wachtwoorden blijven alleen in het formuliergeheugen, worden niet gelogd, niet opgeslagen en niet in de URL gezet. Codes komen niet in de pogingenhistorie.

## Styling en responsive gedrag

- Centrale tokens staan in `styles.css`. Gebruik semantische Tailwindkleuren zoals `bg-primary`; verspreid geen nieuwe hexkleuren over pagina’s.
- Inter is lokaal gebundeld. De applicatie heeft een lichte stijl, met witte formulieren, subtiele borders en minimaal 44px hoge bediening.
- Gebruik mobile-first layouts. Tot en met 1024px vervangt een menu de desktopnavigatie; beheertabellen worden onder 768px kaarten. Een vaste onderbalk krijgt voldoende contentpadding en safe-area-ruimte.
- Gebruik de lokale beelden in `public/images/`, met alt-tekst, expliciete afmetingen en passende uitsnede. Laad de hero direct en secundaire beelden lui.
- Houd de interface inhoudelijk bij de mockups. Technische scenariobediening hoort op `/demo`; echte betaal- of authenticatieclaims passen niet bij de simulatie.

## Demo en toekomstige backend

- `/demo` opent snapshots via `scenario`, optioneel `role`, en UI-toestanden via `view=loading|empty|error|invalid`. Ongeldige enumwaarden vallen terug op de normale weergave.
- Navigatie binnen dezelfde snapshot behoudt wijzigingen. Verversen en resetten herstellen de fixture. Er worden geen boekingen of wijzigingen in localStorage, cookies of een backend opgeslagen.
- De demoklok staat vast. De datum/tijd op `/demo` maakt grensgevallen reproduceerbaar. Bij productie-integratie worden prijs, status, rechten, beschikbaarheid en codes serverbepaald; de demo is geen beveiligingslaag.
- Eén fysiek veld heeft één gedeelde kalender voor alle sporten. Slots duren 60 minuten. Gratis boekingen omzeilen betaling. Volledige terugbetaling geldt tot en met 60 minuten vóór start. Toegang geldt vanaf start tot exclusief eindtijd.
- Controleer bij een nieuwe actie alle betrokken entiteiten: een geboekt slot sluiten annuleert de reservering, maakt de code ongeldig en start zo nodig terugbetaling. Heropenen herstelt geen geannuleerde reservering.

## Controles

Voer uit vanuit `src/frontend`:

```sh
npm run generate-routes
npm run typecheck
npm run check
npm test
npm run test:e2e
npm run build
```

Test domeinregels met Vitest en gebruikersflows met Playwright. Test gedrag en grensgevallen, geen implementatiedetails. Bekijk veranderingen op desktop, tablet en mobiel. Controleer directe links, verversen, toetsenbord, foutstates, lege states, screenshots en consolefouten. Wijzig een test alleen wanneer de bedoeling verandert of de test zelf aantoonbaar fout is.
