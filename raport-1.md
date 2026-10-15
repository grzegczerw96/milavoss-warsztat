# Raport 1: Mila Voss (odtworzony z rozmowy 14.10.2026, nie z sesji 1 warsztatu)

Strona powstała 14.10 w `C:\Fable` starym procesem: kierownik (Fable 5.1) zbudował sekcje 1–2, dwóch podagentów
(Opus 5.5 high) sekcje 3–4 i 5–7, kierownik recenzował zrzutami. Ten raport zebrano 15.10 z zapisu tamtej rozmowy, żeby
sesja 2 warsztatu miała z czego startować. Pełne raporty podagentów: w zapisie rozmowy; ich zlecenia: `zlecenia/`.

## Co zbudowane
Cała strona główna, 7 sekcji, wysokość 11440 px na 1440×900 (oryginał tyle samo), 5751 px na 375×812.

## Co sprawdzone i jak
- Narzędzie: `C:\Fable\tools\capture.js` (headless Edge): zrzuty na tych samych `scrollY` co oryginał, pomiar pudełek,
  łamanie wierszy (`--lines`). Porównanie par **oczami** (kierownik i podagenci), bez liczbowego zestawienia.
- Sekcje 1–2: zrzuty 1440×900 i 375×812, stany planszy, hovery; konsola pusta.
- Sekcje 3–4: pary na scroll 2400–5000, mobile 1200–3000; pudełka zgodne z `layout.json` oryginału; hover folderu
  porównany wartościami DOM (matrix3d, scaleY 1.8).
- Sekcje 5–7: pary na scroll 5000–10540; łamanie nagłówka CTA identyczne; folder „Work” na scroll 5000 ma górną krawędź
  na y=585 jak w oryginale.

## Czego nie sprawdzono
- Wejście strony klatka po klatce obok oryginału (tylko zrzuty po 300, 800, 1500 ms).
- Przewijanie w górę, prawdziwe kółko (opóźnienie `scrub` i Lenis), zatrzymanie w połowie, skok w dół i z powrotem.
- Pomiar parami w punktach postępu (`para.py`), zasłanianie tekstu (`wierzch.py`), `audit.py`, zmiana szerokości okna,
  rozmiary 768, 1024, ekran Grzegorza (1536×742 przy 1,25), prawdziwy telefon.
- Hovery sekcji 5–6 obok oryginału (na żywej stronie headless pokazywał planszę), zrzuty telefonu oryginału dla 5–7.
- Kolor w trakcie przejścia liczbami (IX3 miesza w HSL, nasz GSAP w RGB).
- `prefers-reduced-motion` dla sekcji 5–7 zrzutem.
- Uwaga z warsztatu, której tu nie sprawdzono: czasy wejścia z danych Webflow różnią się od żywej strony
  (1,2 s w danych, 0,92 s na żywo); plansza wzięła czasy z danych.

## Założenia `[założenie]`
- Litery nazwiska w hero rozciągają się w stronę kursora (kierunku nie dało się potwierdzić z plików).
- Easingi tam, gdzie IX3 ich nie podaje: `power2.inOut` / `power3.out` (sekcje 1–2), domyślny „osmo” (kursor, mail).
- `tt:1` w IX3 = `from`, brak `tt` = `to`.
- Brak `duration` w IX3 = 0,5 s (potwierdzone w `webflow.js`, `DEFAULTS.DURATION`).
- `elastic.out(0.7,0.3)` działa jak (1, 0.3), bo GSAP podnosi amplitudę < 1.
- Wygląd ciemnej i jasnej wersji zdjęcia w benefits dobrany na oko.

## Odstępstwa od oryginału (do decyzji Grzegorza)
1. Krój Figtree 600 zamiast Goga (różnica ok. 1%); waga nagłówka usług 600 zamiast 700.
2. Sekcja 4: `margin-left` przy „Work” −4,8vw zamiast −3,5vw, żeby „o” wypadło pod folderem w Figtree.
3. Sekcja 2: nagłówek ma jawne `<br>` (łamanie na 4 wiersze jak w oryginale).
4. Zdjęcie benefits: portret z profilu, odbity, ciaśniejszy kadr; głowa większa niż u autora.
5. Stopka: scena CSS zamiast filmu, bez postaci przy biurku (najsłabszy wizualnie element).
6. Linia nad „and working…” na scroll 6200: ok. 94% szerokości, w oryginale wygląda na pełną.
7. Fikcyjne marki w kartach niespójne między sekcjami (hero vs usługi).
8. Struktura plików: trzy pliki zamiast plików na sekcję.

## Odtworzone tak jak w oryginale, choć wygląda na błąd
- Telefon: „Learn more about me” niewidoczne (w CSS oryginału `opacity: 0`, animacje benefits wyłączone ≤767).
- Logo w stopce ukryte na każdym progu.
- Sekcja 4 ukryta ≤991.
- Tekst sekcji 2 nie jest przyklejony (`sticky` w rodzicu z `overflow: hidden`).

## Pominięte
Przejścia Barba.js między podstronami, skrypt Unicorn Studio, jeden trigger Lottie bez elementu, `.dot-project.test` i
tagi Webflow w usługach (w oryginale `display:none`).

## Znane błędy
- Brak listy błędów z 14.10. Grzegorz widzi niezgodności z oryginałem (15.10), uwagi przyjdą w sesji 2.

## Gdzie podejrzeć
- Lokalnie: `.claude/launch.json` → http://localhost:8741/
- Artifact z 14.10 (wersja z `C:\Fable`): https://claude.ai/artifact/E43p8xWsqPbsL9E9GdQbnR

## Checklista w praktyce
Nie dotyczy: strona nie była budowana według `checklista.md`. Analiza 15.10 (`analiza-0.md`) to pierwszy przebieg
narzędziami warsztatu.
