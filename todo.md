# 🚀 AutoOps AI — Roadmap virálnych funkcií

> Filozofia: appka nesmie len *šetriť* čas. Musí ho spraviť **viditeľným, dokázateľným
> a minutým na to, na čom záleží** — deti, partner/ka, zdravie, spánok, seba samého.
> Tri funkcie tvoria jednu virálnu slučku:
>
> **Dvojník robí prácu → Účtenka to dokáže → Deň voľna to minie na život.**

---

## 1. 🏖️ Zarobený deň voľna (Earned Day Off / Autopilot)  — ✅ HOTOVÉ (MVP)

Agent ráta hodiny, ktoré reálne odpracoval za teba. Keď nazbiera na celý pracovný
deň, appka ho **odomkne**: zapne 100 % autonómny režim, cez deň sama vybaví
objednávky, faktúry a zákazníkov, a večer pošle **jednu vetu** so súhrnom.

- **Virálne:** „Moja AI mi dnes riadila celý biznis, aby som mohol vziať dcéru k moru."
- **Nadčasové:** deň voľna bez výčitiek chce úplne každý.
- **Skutočné:** agregácia už existujúceho `timeSavedCount` + „full autonomy" prepínač
  + večerný súhrn.

### Checklist MVP
- [x] Rozšíriť `useStore` o stav autopilota (nazbierané hodiny, zarobené/vyčerpané dni, aktívny režim)
- [x] Komponent `EarnedDayOff` — kruhový progress k ďalšiemu dňu voľna
- [x] Tlačidlo „Aktivovať deň voľna" (aktívne až po zarobení dňa)
- [x] Aktívny stav autopilota + živý feed toho, čo agent vybavuje
- [x] Večerný jednovetový súhrn na konci dňa
- [x] Route `/autopilot` + položka v navigácii (Shell)
- [x] CTA karta na Prehľade (Overview) prepojená na Autopilota
- [x] `npm run lint` (tsc) prechádza bez chýb + `npm run build` prechádza

### Ďalšie kroky (backlog)
- [ ] Napojiť „banku času" na reálne akcie agenta (nie demo tlačidlo)
- [ ] Zápis reálneho súhrnu dňa do inboxu / e-mailu majiteľovi
- [ ] Voliteľné: blok „life time" do kalendára (Google Calendar)

---

## 2. 🧾 Účtenka za čas (The Time Receipt)

Raz týždenne agent vygeneruje krásnu **účtenku za čas** (nie za peniaze): položkovito
čo spravil, koľko minút ušetril, spolu → prepočítané na **skutočné momenty života**
(„= 2 tréningy syna + 1 večera + 1 kniha"). Jedným ťukom zdieľateľné na Instagram.

- **Virálne:** formát účtenky je návykovo screenshotovateľný; čas ako mena = čerstvý meme.
- **Nadčasové:** „čas sú peniaze" + účtenka = večné.
- **Skutočné:** dátová vizualizácia nad logmi, ktoré už máme (analytika + šablóny).

### Checklist MVP
- [ ] Model „time receipt" (položky = typ úlohy × ušetrené minúty)
- [ ] Prepočet minút → životné momenty (konfigurovateľné jednotky)
- [ ] Komponent účtenky v štýle bločku (monospace, perforácia)
- [ ] Export / zdieľanie ako obrázok
- [ ] Týždenné generovanie

---

## 3. 👻 Digitálny dvojník (Ghost Mode)

Agent sa naučí **tvoj presný hlas** z minulých odpovedí a s tvojím požehnaním
komunikuje so zákazníkmi ako ty — 24/7. Má „svedomie odovzdania": eskaluje len
skutočne dôležité 1 %, zvyšok drží od teba preč a chráni tvoje odpojenie.

- **Virálne:** „Klon, čo píše presne ako ja, mi riadi e-shop, kým sedím pri jazere."
- **Nadčasové:** byť prítomný pri rodine + zákazník vždy obslúžený.
- **Skutočné:** už máme Gemini reply-engine + históriu odpovedí; treba hlas + prah eskalácie.

### Checklist MVP
- [ ] Profil hlasu (tón, oslovenie, podpis, typické frázy)
- [ ] Prah eskalácie (čo je „dôležité 1 %")
- [ ] Auto-odpoveď v Ghost Mode s human-handoff logikou
- [ ] Indikátor „Ste offline — dvojník pracuje"

---

_Aktuálny checkpoint: vetva `checkpoint/optimal-2026-08-04` (main @ 68092ad)._
