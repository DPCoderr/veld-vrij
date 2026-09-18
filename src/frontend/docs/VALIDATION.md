# Verificatie van de frontend

Gecontroleerd op 18 september 2026 met de lokale Vite-server, zonder API of database.

| Controle | Resultaat |
|---|---|
| TypeScript (`npm run typecheck`) | Geslaagd |
| Biome (`npm run check`) | Geslaagd, zonder waarschuwingen |
| Vitest (`npm test`) | 22 tests geslaagd |
| Playwright (`npm run test:e2e`) | 48 tests geslaagd: 10 interactieve flows en 38 mockupvarianten |
| Productiebuild (`npm run build`) | Client en SSR geslaagd |

De unit-tests controleren onder meer onafhankelijke scenariosnapshots, gedeelde beschikbaarheid voor sporten op hetzelfde veld, gratis/ betaalde boekingen, annuleren en heropenen, slotgeneratie met behoud van prijzen, toegangscodes en unieke historie-ID’s. De terugbetalingsgrens is inclusief exact 60 minuten vóór start; toegang is inclusief start en exclusief eindtijd. URL-validatie test ongeldige datums en veilige interne vervolgroutes.

De browserflows controleren zoeken → Google-login → betalen → annuleren, gratis bevestiging, mislukte en controlerende betalingen, registratie met boekingsvervolg, Nederlandse validatie, mobiele navigatie, bewaarde beheerswijzigingen, locaties en velden toevoegen, verversen en poortcontrole. Datumkiezer en dialogen zijn ook met het toetsenbord getest, inclusief focusherstel.

Het demo-overzicht is aanvullend in de browser gecontroleerd: alle 16 paginalinks zijn aanwezig en wisselen naar de gratis bevestiging en geweigerde toegang laadt de juiste snapshot zonder browserfouten.

De 38 geselecteerde afbeeldingen uit het mockupmanifest zijn naast screenshots van de frontend bekeken. Desktop: 1440×1024; mobiel: 390×844; tablet: 1024×768. Elke screenshotcheck bezoekt de route rechtstreeks, wacht op hydration, lettertypen en zichtbare beelden en controleert op horizontale overflow en browserfouten. De vergelijking is visueel; er is geen automatische pixelvergelijking met de gegenereerde mockups.

Maak na de browserchecks de vergelijkingsgalerij opnieuw met:

```sh
node scripts/review-mockups.mjs
```

De galerij staat in `test-results/review/index.html`; screenshots staan per mockup-ID onder `test-results/`. Deze gegenereerde controles worden niet ingecheckt.

Bewuste demo-eigenschappen: Google en betalen zijn gesimuleerd, de klok en hold-aanduiding zijn vast en een refresh herstelt fixtures. Foto’s zijn lokaal gegenereerd. De Google-knop, 44px bediening en één consistente dataset hebben voorrang op afwijkende details in losse mockupafbeeldingen.
