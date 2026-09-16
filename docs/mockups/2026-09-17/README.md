# VeldVrij — beeldmockups

Gegenereerd op 17 september 2026 met de **ingebouwde ImageGen-tool**, zonder API/CLI-fallback. De tool maakt het gebruikte backendmodel niet zichtbaar; daarom is niet geverifieerd dat dit GPT Image 2.5 is.

[Open de visuele galerij](index.html).

## Resultaat

38 geselecteerde PNG-beelden: 16 pagina’s met desktop- en mobiele variant, plus 6 statusvarianten. De eerdere onderbreking is hervat: de 3 ontbrekende beelden zijn toegevoegd en de 5 genoteerde verbeterpunten zijn verwerkt. Oudere concepten blijven behouden; de galerij en het manifest kiezen de nieuwste geselecteerde versies.

| Pagina | Desktop | Mobiel |
|---|---|---|
| Homepage | [PNG](01-homepage-desktop.png) | [PNG](01-homepage-mobile.png) |
| Sportplekken | [PNG](02-sportplekken-desktop-v2.png) | [PNG](02-sportplekken-mobile.png) |
| Velddetail | [PNG](03-velddetail-desktop-v2.png) | [PNG](03-velddetail-mobile-v2.png) |
| Inloggen | [PNG](04-inloggen-desktop-v2.png) | [PNG](04-inloggen-mobile.png) |
| Registreren | [PNG](05-registreren-desktop.png) | [PNG](05-registreren-mobile-v2.png) |
| Reservering afronden | [PNG](06-afronden-desktop.png) | [PNG](06-afronden-mobile-v2.png) |
| Mijn reserveringen | [PNG](07-mijn-reserveringen-desktop.png) | [PNG](07-mijn-reserveringen-mobile.png) |
| Reserveringsdetail en toegangscode | [PNG](08-reserveringsdetail-desktop-v2.png) | [PNG](08-reserveringsdetail-mobile.png) |
| Zo werkt het | [PNG](09-zo-werkt-het-desktop.png) | [PNG](09-zo-werkt-het-mobile.png) |
| Beheeroverzicht | [PNG](10-beheer-overzicht-desktop.png) | [PNG](10-beheer-overzicht-mobile.png) |
| Veld bewerken | [PNG](11-veldbeheer-desktop.png) | [PNG](11-veldbeheer-mobile.png) |
| Dagplanning | [PNG](12-planning-desktop.png) | [PNG](12-planning-mobile-v2.png) |
| Poortsimulatie — toegestaan | [PNG](13-poortdemo-desktop.png) | [PNG](13-poortdemo-mobile.png) |
| Velden beheren | [PNG](14-velden-desktop.png) | [PNG](14-velden-mobile.png) |
| Locaties beheren | [PNG](15-locaties-desktop.png) | [PNG](15-locaties-mobile.png) |
| Reserveringen beheren | [PNG](16-beheer-reserveringen-desktop.png) | [PNG](16-beheer-reserveringen-mobile.png) |

## Aanvullende statussen

- [Betaling wordt gecontroleerd — desktop](17-betaling-controleren-desktop.png)
- [Annuleren — terugbetaling — desktop](18-annuleren-desktop.png)
- [Geboekt tijdslot sluiten — desktop](19-slot-sluiten-desktop.png)
- [Poortsimulatie — geweigerd — tablet](20-poort-geweigerd-tablet.png)
- [Gratis boeking bevestigd — desktop](21-gratis-bevestigd-desktop-v2.png)
- [Gratis boeking bevestigd — mobiel](21-gratis-bevestigd-mobile.png)

## Visuele review

De beelden zijn tijdens het genereren visueel geïnspecteerd op hoofdteksten, demo-aanduiding, prijzen, tijdsloten, status, toegangscode en afwezigheid van QR-codes. De volgende eerder genoteerde verbeteringen zijn uitgevoerd:

- Mobiele velddetail: de totaalprijs en ‘Verder’ staan in een vaste onderbalk.
- Mobiel registreren: de grote sfeerfoto is verwijderd; het formulier staat direct onder de header.
- Mobiel afronden: compacte menunavigatie, grotere tekst en een kleinere foto.
- Desktop reserveringsdetail: toegangstekst verwijst naar het gereserveerde veld.
- Mobiele planning: afzonderlijke tijdslotkaarten in plaats van een verkleinde tabel.
- Gratis bevestiging: de vervolginstructie verwijst naar het veld en claimt geen verstuurde bevestiging.

Dit zijn visuele concepten, geen pixelmaatvaste implementatiescreenshots. De generator kan kleinere tekst-, beeld- en maatverschillen introduceren. De exacte specificaties blijven leidend bij implementatie, inclusief menulabels, aanraakdoelen, foto’s, responsief gedrag en toegankelijkheid.

De varianten beelden verschillende momenten/statussen uit, geen gelijktijdige databasesnapshot. Functionele uitgangspunten: één gedeelde kalender per fysiek veld, toegang tot het gereserveerde veld, serverbepaalde prijs/status, precies 60 minuten per slot en volledige terugbetaling tot en met 60 minuten vóór de start. Gratis boekingen slaan de betaalroute over.

## Prompts en bestanden

De basisprompt van de homepage staat in [homepage-desktop-prompt.txt](homepage-desktop-prompt.txt). Elk ander scherm heeft een gelijknamig `-prompt.txt` bestand. Uitgevoerde edits staan in `-correction-prompt.txt` en `-edit-prompt.txt`; de galerij linkt deze naast het geselecteerde beeld. De exacte extra mobiele instructies staan in [PROMPT-ADDITIONS.md](PROMPT-ADDITIONS.md).

De oude bestanden met `-pending-correction.txt` zijn historisch; deze correcties zijn inmiddels uitgevoerd. De definitieve correctieprompts staan hieronder:

- [03-velddetail-mobile](03-velddetail-mobile-correction-prompt.txt)
- [05-registreren-mobile](05-registreren-mobile-correction-prompt.txt)
- [06-afronden-mobile](06-afronden-mobile-correction-prompt.txt)
- [08-reserveringsdetail-desktop](08-reserveringsdetail-desktop-correction-prompt.txt)
- [12-planning-mobile](12-planning-mobile-correction-prompt.txt)

[manifest.json](manifest.json) registreert geselecteerde bestanden, oorspronkelijke generatorbestanden, gebruikte prompts en uitgevoerde correcties. Voor een vervolg kun je het geselecteerde PNG-bestand als visuele referentie gebruiken met de bijbehorende prompt.

De ZIP bevat alleen de 38 geselecteerde beelden, de galerij, het manifest en de relevante prompts/documentatie. Eerdere beeldversies blijven los in deze map bewaard.

Bronnen: de twee door de gebruiker aangeleverde VeldVrij-design- en MVP-plannen. Er is geen applicatiecode aangepast.
