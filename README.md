# Samarbetskalender – delad vårdnad

En mobilanpassad kalender- och samarbetsapplikation med PWA-känsla (Progressive Web App) för separerade vårdnadshavare med gemensamma barn. Syftet med appen är att underlätta och förtydliga vardagskommunikationen, minska behovet av diskussioner och förebygga missförstånd – med lugn, trygghet och barnets bästa i fokus.

Applikationen är byggd som en interaktiv frontend-prototyp utan backend eller extern databas. All data hanteras lokalt i webbläsaren.

## Funktioner

- **Automatiskt umgängesschema & bytesdagar:** Rullande schema för *Varannan vecka* (14-dagarscykel med fredagsbyte) och *Varannan helg*, inklusive diagonalt tvåfärgade bytesdagar och stöd för delad vårdnad per barn.
- **Tre kalendervyer:** Växla mellan *Månadsvy* (rutnät med veckonummer och färgkodning), *Veckovy* (måndag–fredag) och *Listvy* (kronologisk månadsöversikt).
- **Aktivitetshantering & packlistor:** Skapa, redigera och ta bort aktiviteter med kategori, tid, plats, packlistor/checklistor samt avvikande överlämningar.
- **Godkännandeflöde & kommentarer:** Förslag på nya aktiviteter eller ändrade bytesdagar markeras med streckad ram tills den andra vårdnadshavaren godkänner eller avböjer dem. Varje aktivitet har även en trådad kommentarsfunktion och notisvy.
- **Perspektivväxling & filtrering:** Växla vy mellan Mamma och Pappa i toppen av gränssnittet samt filtrera schemat per barn i botten.
- **Sök & profiler:** Realtidssökning över aktiviteter, platser och packlistor samt möjlighet att anpassa namn och färgteman för vårdnadshavare och barn.
- **Lokal lagring (`localStorage`) & PWA:** Alla ändringar sparas automatiskt i webbläsaren och finns kvar vid omladdning. Under *Inställningar* går det att återställa ursprunglig demodata. Appen har PWA-stöd för installation på mobilens hemskärm.
- **Tillgänglighet (WCAG 2.2 AA):** Minst 44×44 px touchytor, fokusfälla i modaler, tydliga `:focus-visible`-markeringar, semantiska formulär och valideringsmeddelanden.

## Kom igång

Projektet är byggt med React och Vite och körs lokalt utan backend eller API-nycklar:

1. Klona repot till din dator och öppna projektmappen i din editor.
2. Installera paket och beroenden i terminalen:
   ```bash
   npm install
   ```
3. Starta utvecklingsservern:
   ```bash
   npm run dev
   ```
4. Öppna den lokala adressen som visas i terminalen (vanligtvis `http://localhost:5173`) i din webbläsare (gärna i mobilläge via webbläsarens utvecklarverktyg).

## Filer

| Mapp eller fil | Innehåll |
|---|---|
| `index.html` | Applikationens grundsida och laddning av teckensnitt (DM Sans & Plus Jakarta Sans) |
| `src/App.jsx` | Huvudkomponent, tillståndshantering, användarväxling och lagring i `localStorage` |
| `src/App.css` | Ren CSS med samtliga färger, typsnitt, rundade hörn och skuggor definierade i `:root` |
| `src/data/mockData.js` | Ursprunglig testdata (föräldrar, barn, aktiviteter) samt schemaberäkningar |
| `src/components/` | Uppdelade vyer och modaler (`MonthView`, `WeekView`, `ListView`, `SearchView`, `ProfilesView`, `SecondaryViews`, `EventForm`, `DayDetailModal`, `EventDetailModal`, `SideDrawer`) |
| `src/hooks/` | Egna hooks: `useFocusTrap.js` (tillgänglig modalfokus) och `usePWAInstall.js` (installation på hemskärm) |
| `vite.config.ts` | Konfiguration för Vite och `vite-plugin-pwa` (manifest och service worker) |
| `package.json` | Projektets beroenden (`react`, `lucide-react`, `vite`, `vite-plugin-pwa`) |


## Teknik & Licens

Grundstrukturen genererades i Google AI Studio, licensierad under **Apache-2.0** och vidareutvecklades sedan i Cursor med Antigravity CLI 1.5.10


Byggd utifrån en UX- och frontend-brief med fokus på tydliga användarflöden, tillgänglighet och ren, variabelstyrd CSS.
