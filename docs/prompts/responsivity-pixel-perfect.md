# 🎯 Prompt: 100 % responzivita — každá stránka + každá sekcia (AutoOps AI)

> Skopíruj celý tento prompt AI kódovaciemu asistentovi (alebo vývojárovi).
> Je napísaný priamo pre tento repozitár — pozná stack, obrazovky aj konkrétne sekcie.

---

## Rola a cieľ

Si senior frontend inžinier + product dizajnér. Doveď appku **AutoOps AI** k **100 % responzivite naprieč každou stránkou a každou jej sekciou**, so **špeciálnym dôrazom na iPhone 17**. Nič nesmie preteká, nič nesmie byť odrezané, nič sa nesmie prekrývať s fixnými prvkami (spodná nav, header, floating orb). Zachovaj dark glassmorphism vizuál a slovenské texty.

## Stack a kontext (rešpektuj)

- **React 19 + TypeScript**, **Vite**, **Tailwind CSS 4** (`@theme` tokeny v `src/index.css`)
- Animácie **motion** (`motion/react`) — vždy rešpektuj `prefers-reduced-motion`
- Layout: `src/components/layout/Shell.tsx` — desktop **sidebar** (`aside.hidden md:flex`, 80/260 px), **mobilná spodná nav** (`nav.md:hidden`, fixed bottom h-20), floating **AgentOrb** (fixed bottom-right)
- Grafy: **Recharts** — vždy cez `ResponsiveContainer`
- Zdroj pravdy pre obrazovky: `e2e/screens.ts`
- Brand tokeny: `--color-brand-cyan (#00f5ff)`, `--color-brand-purple (#a855f7)`, `--color-bg-dark (#050507)`

## Breakpointy (Tailwind + reálne zariadenia)

`sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`

Testuj: **320 · 375 · 402 (iPhone 17) · 430 · 768 · 1024 · 1280 · 1536**.

---

## ⭐ iPhone 17 — špeciálne pravidlá (platia globálne)

- **Logický viewport 402 × 874 px @ 3× DPR**, iOS 26 Safari
- **Safe-area** cez `env(safe-area-inset-*)`. V `index.html` `<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">`
- Odsaď spodnú navigáciu, floating orb aj hlavičku o safe-area (`pb-[env(safe-area-inset-bottom)]`, `pt-[env(safe-area-inset-top)]`)
- Obsah nad spodnou nav: `pb-[calc(6rem+env(safe-area-inset-bottom))]` (aktuálne len `pb-24`)
- **Tap-targety ≥ 44 × 44 px** (Apple HIG) — ikonky spodnej nav, chipy, close tlačidlá
- **Žiadny horizontálny scroll** pri 402 px na žiadnej obrazovke
- Modaly full-width s okrajmi, nesmú byť odrezané
- Na 3× DPR: žiadne rozmazané 1 px bordery, vektorové ikony, jemné tiene

---

## 🌐 Globálne pravidlá (každá obrazovka + každá sekcia)

1. **Nulový horizontálny preteok** — `documentElement.scrollWidth ≤ clientWidth`. Široký obsah (tabuľky, dlhé filter chip rady, uzly workflow, dlhé texty) daj do wrapperu `overflow-x-auto`.
2. **Grid → stack** na mobile (`grid-cols-1 md:grid-cols-2 lg:grid-cols-3/4`); nikdy nenechaj 3–4 stĺpce pod 768 px.
3. **Fluidná typografia**: `text-xs md:text-sm · text-lg md:text-xl lg:text-2xl` — žiadne fixné veľké fonty pre mobil.
4. **Fluidný padding**: `p-4 md:p-6 lg:p-8` a `gap-4 md:gap-6`. Zjednoť na 4/8 px mriežku.
5. **Fixné/sticky prvky** (header, spodná nav, AgentOrb) nesmú prekrývať tlačidlá ani obsah — obsah má vždy dostatočný `pb-*` a `pt-*` odsad.
6. **Master–detail** obrazovky (Inbox) — mobil = jeden stĺpec s prepnutím zoznam ↔ detail (routovo alebo stavom), nie dva vedľa seba.
7. **Long-form texty** (predmety, mail bodies): `break-words` / `min-w-0` na flex/grid detičkách, nie `whitespace-nowrap` bez `truncate`.
8. **Obrázky a ikony**: `max-w-full`, žiadne fixné veľkosti, čo pretekajú.
9. **Formuláre**: input `w-full`, `min-w-0`, labely nad inputmi na mobile, nie vedľa.
10. **Focus + prístupnosť**: zachovaj `focus-visible:ring-*`, `aria-*`, `prefers-reduced-motion`.

---

# 📋 Per obrazovka + per sekcia

## 1. `/` Prehľad — `src/components/dashboard/Overview.tsx`

**Sekcie a čo skontrolovať:**

- **Autopilot CTA banner** (link na `/autopilot`)
  - Chipy „Autopilot / séria / deň voľna pripravený" na mobile **wrapujú** (aktuálne `flex-wrap` ✅), nesmú pretekať
  - ArrowUpRight ikona vždy viditeľná (nie odrezaná)
- **Bento grid header cards** (Dnes ušetrený čas, Vyriešené požiadavky, Chránený obrat)
  - `md:grid-cols-12` layout — na mobile 1 stĺpec, na `md` 2, na `lg` 3 rovnaké
  - Číselné hodnoty (`text-4xl` / `text-5xl`) sa nesmú lámať; ak áno, zmenši na mobil
  - Progress bar (Dnes ušetrený čas) šírkovo v poriadku
- **Výkon systému** (AreaChart Recharts, `h-[280px] md:h-[340px]`)
  - `ResponsiveContainer` OK; over, že tooltip a osy nezvinuli layout
  - Legenda „Hodiny optimalizácie" (`hidden sm:flex`) sa nezobrazuje pod < 640 px
- **Denník live udalostí** (activity feed)
  - Ikony šrky (`w-2 h-2 bg-*`) vertikálna čiara — na mobile plná šírka pod grafom
  - Časy vpravo (`text-[10px]`) sa nesmú lámať s dlhými titulmi

## 2. `/autopilot` — `src/components/autopilot/EarnedDayOff.tsx`

- **Header + chipy** (Séria, Zarobené, Vyčerpané)
  - `flex-wrap` už je ✅; over, že 3 chipy na 320–375 px sa krajne rozložia, nie prelepia
- **Idle progress karta** (kruhový SVG ring 190×190)
  - Fixná veľkosť je OK aj na iPhone 17; ale zmenši padding karty ak treba
  - Banner „Zatiaľ nazbierané: …" a „X dní po sebe · rekord Y" — `flex-wrap`, ikony nepretekajú
- **Karta „Ako to funguje" + CTA**
  - Tlačidlo „Aktivovať deň voľna" `w-full` ✅ — over, že text sa nezalomí škaredo pod 340 px
- **Aktívny stav — kľudový panel + živý feed**
  - Grid `lg:grid-cols-12` (5/7) — na mobile stack ✅
  - Live feed položky: `flex-1` na text, čas vpravo `shrink-0`; text `break-words` pre dlhé mená zákazníkov
- **Modal „Večerný súhrn"**
  - `max-w-md w-full` s `p-4` okrajmi ✅
  - Fokus vracia na close tlačidlo ✅ — over že na iPhone 17 nie je odrezaný Dynamic Islandom (safe-area padding na modal container)

## 3. `/comms` — `src/components/comms/EmailComposer.tsx`

- **Formulár (odosielateľ, predmet, tón, telo)** — inputy/textareas `w-full`, `min-w-0`
- **AI Smart Reply panel** — 3 návrhy odpovedí:
  - Pod `md` **1 stĺpec pod sebou**; na desktope grid 3
  - Dlhé subject/body **zalomiť** (`break-words`); tlačidlá „Použiť" nepretekajú
- **Sticky spodná lišta akcií** (ak existuje) — musí byť nad mobilnou nav (`bottom-24 md:bottom-0`)
- **Info bar „Aktualizuje vlákna v E-shope a Instagrame"** — `text-[10px]`, na mobile nezalamovať do 3 riadkov

## 4. `/inbox` — `src/components/inbox/UnifiedInbox.tsx` ⚠️ **kritická obrazovka**

- **Layout master-detail**:
  - Desktop: dva stĺpce (zoznam vlákien vľavo, detail vpravo)
  - **Mobile MUSÍ byť single-column s prepínaním** — zoznam → klik → detail (späť buttonom); nikdy nie oba naraz
- **Zoznam vlákien**
  - Karta vlákna: ikona kanála · odosielateľ · predmet · preview · čas · badge kategórie
  - Predmet a preview `truncate` na 1 riadok, alebo `line-clamp-2` — vždy s `min-w-0` v rodičovi
  - Badge kategórie `shrink-0`, farebné rozlíšenie zostáva
- **Detail vlákna**
  - Hlavička detailu (odosielateľ, ikony akcií) — akcie sa nezaraďujú pod hlavičku
  - Správy s dlhými telami: `break-words`, obrázky/prílohy `max-w-full`
  - Timestamp vpravo `shrink-0`
- **Toolbar / filtre** — chip rada s `overflow-x-auto` a scroll snap; nie wrap do 3 riadkov

## 5. `/workflows` — `src/components/workflows/FlowBuilder.tsx` + `TemplateLibrary.tsx`

- **Reťazce uzlov** (trigger → logic → action) sú **horizontálne**
  - Kontajner s `overflow-x-auto` + `snap-x snap-mandatory` na mobile; pointer-hint gradient na okrajoch
  - Uzol karta min. 220 px šírka
- **Šablóny (TemplateLibrary)**
  - Grid `1 / md:2 / lg:3` kariet
  - Ikony templatov `shrink-0`, popis `line-clamp-3`
- **Toolbar** (uložiť, klonovať, spustiť) — na mobile sa zbalí do menu alebo `flex-wrap`

## 6. `/integrations` — `src/components/integrations/IntegrationsGrid.tsx`

- **Header**
  - Nadpis + „Všetky prepojenia aktívne" (`hidden lg:flex`) + tlačidlo „Synchronizovať"
  - Tlačidlo `flex-1 md:flex-none` ✅ — over že na 320 px sa nezalomí do 2 riadkov
- **Grid kariet** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-4`
  - `min-h-[260px]` môže na malých viewportoch spôsobiť príliš veľké karty — zvážiť `md:min-h-[260px]`
  - Ikona 14×14 s neónovým glow — správa nesmie pretekať za kartu
  - Tlačidlo v spodku karty `w-full` ✅

## 7. `/analytics` — `src/components/dashboard/EmailPerformanceDashboard.tsx` ⚠️ **hustá obrazovka**

- **KPI stat tiles** (Total Sent, Open Rate, CTR, Response Time, Bounces)
  - Grid `2 sm:cols · 3 md:cols · 5 lg:cols` (5 kariet pekne padne na 5 stĺpcov len na `lg+`); mimo `lg` obalí do 2/3
  - Veľké čísla `text-3xl md:text-4xl`, nie `text-5xl` na mobile
- **Filter bar** (search, source dropdown, timeframe, simulate button)
  - `flex-wrap` s `gap-3`; každý prvok `min-w-0`; search `flex-1 min-w-[180px]`
  - Dropdowny natívne — na iPhone Safari sa OK renderujú
- **Trend chart** (LineChart + osi + tooltip)
  - `ResponsiveContainer` fixed height `h-[300px] md:h-[400px]`
  - Legenda pod chartom na mobile, vpravo na desktope
- **Channel split (Pie chart)**
  - Menšia výška na mobile; label + hodnota vedľa seba, nie nad sebou
- **Log tabuľka poslaných komunikácií**
  - **Nemôže pretekať** — buď full-width `overflow-x-auto` wrapper s zachovanými stĺpcami, alebo na mobile **transformuj riadky na karty** (label + hodnota v dvojstĺpcovom mini-gride vnútri karty)
  - Akcie riadku (napr. „Detaily") vždy dosiahnuteľné, nie odrezané
- **Detail modal** (`detailedCommId`)
  - `max-w-lg w-full` s `p-4` okrajmi; scrollable telo `max-h-[80vh] overflow-y-auto`
- **SLA target adjustery** (`kpiTargetOpenRate`, `kpiTargetCTR`) — inputy `w-full`

## 8. `/components` — `src/components/design-system/ComponentsPage.tsx`

- **Layout**: `<aside aria-label="Filtre">` (kategórie/filtre) + hlavný obsah
  - Desktop: sidebar naľavo `w-56`, obsah napravo
  - **Mobile**: filtre buď hore ako `overflow-x-auto` chip rada, alebo do vysúvacieho drawera
- **Grid komponentových kariet** `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
- Náhľad komponentu **full-screen preview** (`/components/:name/preview/:idx`) — mimo Shellu; over že nezobrazuje spodnú nav a nemá safe-area kolízie

---

## 🧪 Overenie (musí platiť pre každú obrazovku)

1. **Lint + build**: `npm run lint`, `npm run build` — zelené
2. **E2E**:
   - `npm run test:e2e` — obidva projekty **desktop + iphone-17** zelené
   - `screens.spec.ts` už asertuje **žiadny horizontálny preteok** a **0 JS chýb** na všetkých 8 obrazovkách
   - `iphone17.spec.ts` už asertuje **skrytý sidebar** a **viditeľnú spodnú nav** na iPhone 17
3. **Screenshoty**: v `playwright-report/` sú per-screen artefakty (`iphone-17__*`, `desktop-chromium__*`) — vizuálne prejdi každý, žiadny odrezaný text/prvok
4. **Manuálne**: DevTools device toolbar → **iPhone 15/17, iPad, 320 px** — každá obrazovka bez pretekov a kolízií s Dynamic Islandom / home indikátorom

## ✅ Definícia hotova (Definition of Done)

- Všetkých **8 obrazoviek × 8 breakpointov** vizuálne bez chýb (nič odrezané, nič nezalomené škaredo, žiadne kolízie s fixnými prvkami)
- CI (`.github/workflows/ci.yml`) zelené na PR
- Pridané per-sekcia doladenia neprelamujú existujúce E2E; ak treba, rozšír asertie, **neoslabuj**
- Zdokumentované do `todo.md` (odškrtnutý bod „Responzivita + pixel-perfect")

## Čoho sa NEdotýkať

- Brand farby, dizajnový jazyk, slovenské texty (netreba prekladať)
- Nemeň API endpointy ani store schému (`useStore.ts`)
- Nepridávaj ťažké závislosti (žiadne UI kity ako MUI/Chakra) — drž sa Tailwindu + existujúcich komponentov

---

## 💡 Tip na overenie iPhone 17 lokálne

```bash
PW_CHROMIUM=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run test:e2e:iphone
# → screenshoty všetkých obrazoviek: playwright-report/data/
```
