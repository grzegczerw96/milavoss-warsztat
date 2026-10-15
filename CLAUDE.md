# Mila Voss: odtworzenie https://juanmora.co/

Czyta każda sesja w tym folderze. Proces i wiedza: `C:\Projekty\warsztat-nowy\README.md` (nie kopiować tutaj).

## Projekt
- **Oryginał:** https://juanmora.co/; silnik: Webflow IX3 + własny GSAP autora (inline), Lottie, Lenis, Barba.
  Pliki oryginału: `%LOCALAPPDATA%\wir-tools\out\milavoss-warsztat\orig\` (`site-index.html`, `site.css`, `webflow.js`,
  `ix3.txt`, `rules.txt`, `layout.json`, Lottie `*.json`). Stare zrzuty referencji (headless Edge, 14.10):
  `C:\Fable\reference\juanmora\screens*` (tylko do odczytu).
- **Pochodzenie:** kopia `C:\Fable\milavoss` z 15.10.2026, zbudowana 14.10 starym procesem (`C:\Fable\PLAYBOOK.md`),
  zanim powstał warsztat-nowy. **`C:\Fable` nie zmieniamy.** Co zbudowane i jak: `raport-1.md`.
- **Marka i zamienniki:** `brand.md`. Teksty angielskie (jak w oryginale), nasze, o długości oryginału; bez logo,
  zdjęć i tekstów oryginału.
- **Podgląd:** `.claude/launch.json` → `http://localhost:8741/`. Panel podglądu musi być widoczny, inaczej ruch stoi.
  Plansza ładowania gra zawsze (brak `?intro=0`).
- **Repo i Pages:** https://github.com/grzegczerw96/milavoss-warsztat (gałąź `master`), podgląd
  https://grzegczerw96.github.io/milavoss-warsztat/ (sprawdzać z `?v=<commit>`). Commit jako
  `grzegczerw96 <greg.wolwlod@gmail.com>`, opis po polsku. `analiza/` (zrzuty oryginału) tylko lokalnie, w `.gitignore`.

## Technologia
- GSAP 3.14.1 (ScrollTrigger, SplitText, CustomEase) i Lenis 1.3.17 z jsDelivr; font Figtree z Google Fonts.
- **Odstępstwo od szablonu warsztatu:** trzy pliki (`index.html`, `styles.css`, `main.js`) zamiast plików na sekcję.
  Sekcje w `index.html` to kolejne `<section>` w `<main>`; w CSS i JS bloki z komentarzami `SECTION N`.
- Progi szerokości z oryginału: ≤991, ≤767, ≤479 (i ≥1920).
- Krój: Goga → Figtree 600, różnica szerokości ok. 1% (wiersz „I help companies to” 975 vs 972 px).
- Lenis jest w zmiennej `lenis` (nie `window.__lenis`); `projekt.json` → `no_carry` podpina go dla narzędzi.

## Zatwierdzone odstępstwa od oryginału (nie „naprawiać”; dopisywać z datą)
- [brak zatwierdzonych przez Grzegorza; lista odstępstw do decyzji w `raport-1.md`]

## Sekcje
| NN | Sekcja | Zlecenie | Stan | Uwagi |
|---|---|---|---|---|
| 01 | nav, plansza, hero (`#hero`) | brak (kierownik, 14.10) | do sprawdzenia | |
| 02 | „click & scroll” (`#clickScroll`) | brak (kierownik, 14.10) | do sprawdzenia | |
| 03 | usługi | `zlecenia/03-04-uslugi-work.md` | do sprawdzenia | |
| 04 | CTA „Work” z folderem | `zlecenia/03-04-uslugi-work.md` | do sprawdzenia | |
| 05 | benefits | `zlecenia/05-07-benefits-cta-stopka.md` | do sprawdzenia | |
| 06 | CTA z kopiowaniem maila | `zlecenia/05-07-benefits-cta-stopka.md` | do sprawdzenia | |
| 07 | stopka | `zlecenia/05-07-benefits-cta-stopka.md` | do sprawdzenia | |

Raport ostatniej sesji: `raport-1.md`.
