# De VeldVrij-demo bekijken

Start met `npm install` en `npm run dev` en open [de homepage](http://localhost:3000). Een API, database, OAuth-account of Stripe-account is niet nodig.

[Het demo-overzicht](http://localhost:3000/demo) bevat alle 16 pagina’s en de aanvullende situaties. De knop **Demo** naast het logo opent dit overzicht. Hier kies je een rol of pas je de demoklok aan.

| Voorbeeld | Link |
|---|---|
| Begin een boeking | `/sportplekken/multiveld-buiten?scenario=browse` |
| Bevestigde reservering | `/reserveringen/res-buiten-14?scenario=confirmed` |
| Betaling controleren | `/reserveringen/res-buiten-14?scenario=payment-checking` |
| Annuleren met terugbetaling | `/reserveringen/res-buiten-14?scenario=cancel` |
| Annuleren na de terugbetalingsgrens | `/reserveringen/res-buiten-14?scenario=late-cancel` |
| Geboekt tijdslot sluiten | `/beheer/planning?scenario=close-slot` |
| Toegang toegestaan | `/beheer/poortdemo?scenario=gate-allowed` |
| Toegang geweigerd | `/beheer/poortdemo?scenario=gate-denied` |
| Gratis bevestiging | `/reserveringen/res-buiten-12/bevestiging?scenario=free-confirmed` |
| Laden, lege of foutstate | Voeg `view=loading`, `view=empty` of `view=error` toe |
| Inlogvalidatie | `/inloggen?view=invalid` |

De scenario’s zijn verschillende momenten. Het 14:00-slot is in `browse` beschikbaar en in `confirmed`/`admin` geboekt. Navigeren behoudt de actieve snapshot; verversen herstelt deze. De demoklok loopt bewust niet met de echte klok mee. De hold-aanduiding 08:42 is een vaste mockupwaarde, geen echte serverreservering.

Een geldig ingevuld inlog- of registratieformulier meldt je lokaal aan als Sam. De Google-knop doet hetzelfde. De betaalkeuzedialoog schrijft geen geld af. De poortdemo werkt zonder hardware. Boekingen, wijzigingen en wachtwoorden worden niet blijvend opgeslagen.

Frontendafspraken staan in [REACT_FRONTEND_RULES.md](../REACT_FRONTEND_RULES.md). De gebruikte beeldprompts staan in [IMAGE_PROMPTS.md](IMAGE_PROMPTS.md).
