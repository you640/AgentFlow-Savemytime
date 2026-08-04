# 🎯 Prompt: 100 % responzivita + pixel-perfect naprieč celou appkou (AutoOps AI)

> Skopíruj celý tento prompt do AI kódovacieho asistenta (alebo daj dizajnérovi/vývojárovi).
> Je napísaný priamo pre tento repozitár a jeho stack.

---

## Rola a cieľ

Si senior frontend inžinier + product dizajnér. Tvojou úlohou je dotiahnuť appku **AutoOps AI**
k **100 % responzivite a pixel-perfect** kvalite naprieč **všetkými obrazovkami a všetkými
breakpointmi**, so **špeciálnym dôrazom na iPhone 17**. Nič nesmie preteká, nič nesmie byť
odrezané, každý pixel musí sedieť — v light aj dark, na 1× aj 3× DPR.

## Stack a kontext (rešpektuj ho)

- **React 19 + TypeScript**, **Vite**, **Tailwind CSS 4** (`@theme` tokeny v `src/index.css`).
- Animácie: **motion** (`motion/react`), rešpektuj `prefers-reduced-motion`.
- Dizajn: tmavý **glassmorphism** (`.glass`, `.glass-card`), akcenty `--color-brand-cyan (#00f5ff)`
  a `--color-brand-purple (#a855f7)`. **Zachovaj tento vizuálny jazyk** — nemeň brand, len dolaď.
- Layout: `src/components/layout/Shell.tsx` — desktop **bočný panel** (`hidden md:flex`, 80/260 px)
  a **mobilná spodná navigácia** (`md:hidden`, fixed bottom, výška 20 = 5rem).
- Všetky texty sú **po slovensky** — neprekladaj ich.
- Grafy: **Recharts** — vždy cez `ResponsiveContainer`.

## Obrazovky (všetky musia byť perfektné)

| Route | Komponent | Poznámka k responzivite |
|-------|-----------|--------------------------|
| `/` | `dashboard/Overview` | bento grid 12 stĺpcov + Autopilot CTA banner |
| `/autopilot` | `autopilot/EarnedDayOff` | kruhový progress, chipy série, modal súhrnu |
| `/comms` | `comms/EmailComposer` | formulár + AI náhľady, dlhé texty |
| `/inbox` | `inbox/UnifiedInbox` | zoznam vlákien + detail (master–detail) |
| `/workflows` | `workflows/FlowBuilder` | uzly toku, horizontálne reťazce |
| `/integrations` | `integrations/IntegrationsGrid` | grid kariet 1→2→4 stĺpce |
| `/analytics` | `dashboard/EmailPerformanceDashboard` | grafy, tabuľky, filtre, modaly |
| `/components` | `design-system/ComponentsPage` | prehliadač + `<aside>` filtre |

## Breakpointy a cieľové zariadenia

Testuj a dolaď na: **320 px** (malé), **375 px** (iPhone SE), **390–402 px** (iPhone 15–17),
**768 px** (tablet, hranica `md`), **1024 px** (`lg`), **1280 px+** (desktop), **1536 px+** (`2xl`).

Tailwind breakpointy: `sm 640 · md 768 · lg 1024 · xl 1280 · 2xl 1536`.

## ⭐ iPhone 17 — špeciálne požiadavky (všetky obrazovky)

- **Logický viewport 402 × 874 px @ 3× DPR** (iOS 26, Safari).
- **Safe-area / Dynamic Island:** používaj `env(safe-area-inset-top/bottom/left/right)`.
  Nastav `viewport-fit=cover` a odsaď fixné prvky (spodná navigácia, floating agent orb,
  hlavička) o safe-area, nech nič nekolíduje s Dynamic Islandom ani home indikátorom.
- **Spodná navigácia** nesmie prekrývať obsah — obsah nad ňou musí mať spodný padding
  (aktuálne `pb-24`), skontroluj ho pre safe-area (`pb-[calc(6rem+env(safe-area-inset-bottom))]`).
- **Tap-targety ≥ 44 × 44 px** (Apple HIG) — ikony v spodnej nav, tlačidlá, chipy.
- **Žiadny horizontálny scroll** pri 402 px (ani tabuľky/grafy — daj im `overflow-x-auto` wrapper).
- **Modaly** (napr. večerný súhrn Autopilota) full-width s okrajmi, nie odrezané.
- **Crisp na 3×:** žiadne rozmazané 1px borders; ikony vektorové; tiene jemné.

## Univerzálne pravidlá (každá obrazovka)

1. **Nulový horizontálny preteok** — `document.scrollWidth <= clientWidth` na každej šírke.
   Široký obsah (tabuľky, grafy, reťazce uzlov) daj do `overflow-x-auto` kontajnera, nikdy
   nenechaj pretekať `body`.
2. **Fluidná typografia a rozstupy** — používaj Tailwind škálu konzistentne; žiadne „skoky".
   Nadpisy `text-xl md:text-2xl lg:text-3xl` atď., nie fixné veľké fonty na mobile.
3. **Grid → stack** — viacstĺpcové gridy sa na mobile skladajú do 1 stĺpca (`grid-cols-1 md:grid-cols-…`).
4. **Master–detail (Inbox)** — na mobile jeden stĺpec s prepnutím zoznam ↔ detail, nie dva vedľa seba.
5. **Konzistentné tokeny** — rovnaké `rounded-*`, `gap-*`, `p-*` naprieč podobnými kartami;
   zarovnania na 4/8px mriežku (pixel-perfect).
6. **Light aj dark** — appka je dark-first; over kontrast (WCAG AA) a čitateľnosť.
7. **Obrázky/ikony** `max-w-full`, žiadne fixné šírky, ktoré pretekajú.
8. **Sticky/fixed prvky** (hlavička, spodná nav, agent orb) nesmú prekrývať interaktívny obsah.
9. **Prístupnosť** — zachovaj `aria-*`, focus-visible ringy, `prefers-reduced-motion`.

## Postup práce

1. Prejdi **každú obrazovku** na každom breakpointe (DevTools device toolbar + reálny iPhone 17 profil).
2. Oprav preteky, odrezania, kolízie fixných prvkov a nekonzistentné rozstupy.
3. Pridaj safe-area insety a `viewport-fit=cover` (`index.html` meta + CSS `env()`).
4. Zjednoť spacing/typografiu na tokeny.
5. Po každej oprave spusti E2E (viď nižšie) a vizuálne skontroluj screenshoty z `iphone-17` projektu.

## ✅ Akceptačné kritériá (musí platiť)

- `npm run lint` (tsc) a `npm run build` prechádzajú.
- `npm run test:e2e` prechádza **oba projekty** (`desktop-chromium` aj `iphone-17`) —
  vrátane assertu **bez horizontálneho preteku** na všetkých 8 obrazovkách.
- `npm run test:e2e:iphone` je zelený; screenshoty všetkých obrazoviek na iPhone 17
  (v `playwright-report/`) sú vizuálne bez chýb (nič odrezané, nič cez Dynamic Island).
- Žiadne nové JS chyby v konzole (E2E to kontroluje).
- Vizuálne: identické rozstupy/zarovnania medzi podobnými prvkami; ostré na 3× DPR.

## Čoho sa NEdotýkať

- Nemeň brand farby, dizajnový jazyk ani slovenské texty.
- Nerozbi existujúce E2E testy (`e2e/*.spec.ts`) — ak treba, rozšír ich, neoslabuj.
- Nepridávaj ťažké závislosti; drž sa Tailwindu a existujúcich utilit.

---

**Tip na overenie iPhone 17 lokálne:**
`PW_CHROMIUM=/opt/pw-browsers/chromium-1194/chrome-linux/chrome npm run test:e2e:iphone`
a otvor `playwright-report/` so screenshotmi všetkých obrazoviek.
