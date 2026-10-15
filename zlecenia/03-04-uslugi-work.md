# Sekcje 3–4: usługi i CTA "Work" (zlecenie historyczne)

> Przeniesione 15.10.2026 z rozmowy w `C:\Fable` (14.10). Zbudowane starym procesem (PLAYBOOK.md, narzędzia Node). Ścieżki `C:\Fable\...` nadal istnieją i są tylko do odczytu; pracujemy w `C:\Projekty\milavoss-warsztat`.

Jesteś front-end developerem. Kontynuujesz odwzorowanie 1:1 strony głównej https://juanmora.co/ pod fikcyjną marką **Mila Voss** w projekcie `C:\Fable\milavoss` (HTML + CSS + GSAP). Sekcje 1–2 (nav, loader, hero, „click & scroll”) są gotowe. Twoje zadanie: **sekcja 3 (usługi: „I help companies to succeed on projects like:”) i sekcja 4 (CTA „Work” z folderem)**. Nie ruszaj sekcji 5–7 (benefits, CTA końcowe, footer) — zrobi je inny agent po Tobie.

## Zacznij od przeczytania
1. `C:\Fable\PLAYBOOK.md` — CAŁY. To metoda pracy; sekcje 9 i 10 opisują decyzje i triki, których masz się trzymać. Sekcja 8 podaje ID timeline’ów IX3 dla Twoich sekcji.
2. `C:\Fable\milavoss\index.html`, `styles.css`, `main.js` — konwencje, tokeny kolorów, font Figtree, sposób inicjalizacji GSAP/ScrollTrigger/Lenis, stos z-index.
3. `C:\Fable\reference\juanmora\site-index.html` (body referencji — Twoje sekcje to `<section class="section">` z `.service-headline-wrapper` + `.main-wrapper-services` oraz `<section data-nav="grey">` z `.work-cta-wrapper`), `site.css`, `webflow.js` (IX3), `screens/s_scroll_2400.png` (nagłówek sekcji 3 w referencji).

## Narzędzia (Node, w `C:\Fable\tools`, `ws` zainstalowany; Python nie istnieje)
- `node tools/extract-webflow.js css reference/juanmora/site.css ".service-headline-wrapper,.tag-text,.service-headline,.main-wrapper-services,.service-wrapper,.cont-text-service,.cont-title-service,.dot-project,.service-h2,.body-copy,.cont-imgs-service,.mask-img-service,.video-cont-p2,.code-video,.img-service,.webflow-frame,.framer-frame,.tag-webflow,.tag-framer,.work-cta-wrapper,.work-cta-content-wrapper,.folder-wrapper,.front-folder,.projects-folder,.back-folder,.work-big-text,.text-span-2"` — reguły CSS (z breakpointami) do przepisania 1:1.
- `node tools/extract-webflow.js ix3 reference/juanmora/webflow.js t-6d9588ef,t-cda553ee,t-63aaf3ca,t-1f21872a,t-6db6fef5,t-fe1c6370,t-9c935436,t-9ea9222f,t-b98265b6,t-e2221d1b` — timeline’y Twoich sekcji; triggery (start/end/scrub/hover) znajdziesz przez `node tools/extract-webflow.js ix3 reference/juanmora/webflow.js` (szukaj klas powyżej). Legenda easingów jest w nagłówku skryptu.
- `node tools/capture.js <url|file> <outdir> [opcje]` — zrzuty i pomiary w headless Edge (nagłówek pliku opisuje opcje). **Referencję zrób sama/sam**: `cd C:\Fable\tools && node capture.js https://juanmora.co/ ../reference/juanmora/screens-s34 --scrolls 2400,2700,3000,3400,3800,4200,4600,5000,5400,5800 --hover ".folder-wrapper" --measure ".service-headline,.service-h2,.body-copy.home-work,.main-wrapper-services,.service-wrapper,.cont-imgs-service,.mask-img-service,.work-cta-wrapper,.work-big-text,.folder-wrapper" --lines ".service-headline"`. Dodatkowo zrzut z hoverem na kontenerze usługi, jeśli coś się dzieje na hover (sprawdź IX3). Pobieranie z juanmora.co wymaga UA przeglądarki (curl `-A`), bo Mod_Security zwraca 406.
- Obejrzyj zrzuty narzędziem Read i zanotuj pozycje, kolory w stanach, co jest sticky itd. Pamiętaj z playbooka: odtwarzaj to, co widać, nie to, co sugeruje CSS.

## Wymagania
- Layout, typografia (Figtree, te same vw/rem co w oryginale), timing, easing, stagger, scrub — 1:1 z danych IX3 i CSS. ScrollTrigger ze `start/end` w `clamp()`, `scrub` jak w IX3, SplitText tam, gdzie IX3 ma `splitText`.
- Treść własna dla marki Mila Voss, o podobnej liczbie znaków: np. tag „Design Expert” → własny; nagłówek „I help companies to succeed on projects like:” → własne zdanie o tej samej długości i łamaniu (2 wiersze, sprawdź `--lines`); 4 usługi (odpowiedniki: strony i landingi / branding / product design / Webflow & Framer) z własnymi opisami; „Curious?... Check out my” / „Work” / „Or keep scrolling” → własne.
- Media: w referencji są zdjęcia autora i filmy mp4 — **nie używaj ich**. Zastąp własnymi: dla każdej maski obrazka własna „karta projektu” (CSS/SVG: gradienty, typografia, kształty — jak `.proj-*` w hero) albo zdjęcie z Unsplash pobrane lokalnie do `C:\Fable\milavoss\img\` (`https://images.unsplash.com/photo-<ID>?auto=format&fit=crop&w=1200&q=72`, sprawdź ID curl-em, obejrzyj miniaturę przed użyciem). Tam gdzie oryginał ma `<video autoplay loop muted>`, zrób animowaną kartę w CSS/GSAP (np. przesuwający się gradient, pulsujące elementy) o tym samym rozmiarze/aspekcie, żeby zachować wrażenie ruchu. Logo Webflow/Framer: zamiast ich znaków użyj własnych, neutralnych „tagów” (np. nazwy narzędzi tekstem w pigułkach), bez cudzych logotypów. Folder z sekcji 4 (3 PNG: przód, kartki, tył) → własny folder w SVG z trzema warstwami, żeby hover (rotationX przodu, scaleY kartek, stagger liter „Work”) działał identycznie.
- Nav: sekcje mają `data-nav` jak w oryginale (sekcja 3 bez atrybutu, sekcja 4 `data-nav="grey"`), istniejący IntersectionObserver to obsłuży.
- Kod dopisuj: HTML między końcem sekcji 2 a `</main>`; CSS na końcu `styles.css` w nowych blokach z komentarzami `SECTION 3`, `SECTION 4` (breakpointy 991/767/479 jak w oryginale); JS jako nowe funkcje w `main.js` wywołane w istniejącym handlerze `load` (po `initScrollScenes()`, przed `ScrollTrigger.refresh()`). Nie zmieniaj istniejącego kodu sekcji 1–2 poza dodaniem wywołań.
- `prefers-reduced-motion`: stany końcowe bez animacji.

## Weryfikacja (obowiązkowa, zanim zgłosisz koniec)
```
cd C:\Fable\tools
node capture.js file:///C:/Fable/milavoss/index.html ../review/batch1/mine --scrolls 2400,2700,3000,3400,3800,4200,4600,5000,5400,5800 --hover ".folder-wrapper" --measure ".service-headline,.service-h2,.main-wrapper-services,.work-big-text" --lines ".service-headline"
node capture.js file:///C:/Fable/milavoss/index.html ../review/batch1/mobile --w 375 --h 812 --scrolls 1200,1800,2400,3000
```
(jeśli Twoje klasy nazywają się inaczej, podstaw swoje). Porównaj parami ze zrzutami referencji na tych samych `scrollY` (uwaga: wysokość Twoich sekcji 1–2 może różnić się o kilka px od referencji — jeśli tak, dobierz scrollY tak, by te same elementy były na ekranie, i napisz o tym). Konsola ma być pusta. Popraw rozjazdy i powtórz zrzuty.

## Raport końcowy (to jedyne, co zobaczę)
1. Lista zmienionych/dodanych plików.
2. Tabela: element → wartości z referencji (CSS/IX3) → Twoja implementacja; osobno wszystkie **założenia**, których nie dało się potwierdzić z danych (np. brak ease w akcji IX3).
3. Ścieżki zrzutów referencja vs. własne (po parach, z tym samym scrollY) oraz co na nich sprawdziłeś/aś.
4. Co pominięto i dlaczego.
Nie publikuj Artifactów, nie commituj, nie ruszaj `PLAYBOOK.md` (możesz zaproponować dopiski w raporcie).