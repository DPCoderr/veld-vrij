# VeldVrij frontend

Klikbare React-frontend voor alle 16 VeldVrij-mockuppagina’s en de aanvullende statusvarianten. Gebouwd met TanStack Start, Tailwind CSS en shadcn/ui.

## Starten

Voer vanuit deze map uit:

```sh
npm install
npm run dev
```

Open [VeldVrij](http://localhost:3000). Een API, database, Google OAuth of Stripe is niet nodig. Alle data komt uit lokale JSON-bestanden. Wijzigingen blijven tijdens navigatie behouden en verdwijnen bij verversen.

[Het demo-overzicht](http://localhost:3000/demo) geeft links naar alle pagina’s en states, met rolkeuze, een instelbare demoklok en resetknop. De standaarddatum is 19 september 2026. De Google-knop en betaalstappen zijn lokale simulaties.

## Indeling

- `src/routes/`: dunne TanStack-routebestanden; `routeTree.gen.ts` wordt gegenereerd.
- `src/features/`: pagina’s en onderdelen per functiegebied.
- `src/features/demo/data/`: één gedeelde catalogus, 16 pagina-JSON-bestanden en vijf scenario-JSON-bestanden.
- `src/components/`: layouts, gedeelde bediening en shadcn/ui.
- `src/lib/`: centrale opmaak- en classhelpers.
- `public/images/`: drie lokaal gegenereerde sportfoto’s. Inter wordt lokaal gebundeld.
- `tests/`: browserflows en screenshots voor de 38 geselecteerde mockupbeelden.

## Controleren

```sh
npm run typecheck
npm run check
npm run test
npm run test:e2e
npm run build
```

De browserchecks gebruiken Microsoft Edge via Playwright. Installeer op een machine zonder Edge eerst `npx playwright install msedge`. Playwright start zo nodig de ontwikkelserver; screenshots komen in `test-results/`.

De bestaande TanStack Start SSR- en Cloudflare-buildopzet blijft behouden. De demo heeft geen externe diensten nodig.

## Afspraken en uitleg

- [React-frontendregels](REACT_FRONTEND_RULES.md): componentgrenzen, hooks, state, SSR, toegankelijkheid en validatie.
- [Demo en scenario’s](docs/DEMO.md): deelbare links, demoklok en gesimuleerde interacties.
- [Beeldprompts](docs/IMAGE_PROMPTS.md): herkomst en prompts van de drie sportfoto’s.
- [Verificatie](docs/VALIDATION.md): controles, schermformaten en het maken van de vergelijkingsgalerij.
- [Mockups en specificaties](../../docs/mockups/2026-09-17/README.md).
