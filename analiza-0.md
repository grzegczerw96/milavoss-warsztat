# Analiza 0: Mila Voss obok oryginału (15.10.2026, narzędzia warsztatu-nowego)

Przebieg: `ref.py` na oryginale i na naszej kopii (te same sekcje, punkty 0 / 0,25 / 0,5 / 0,75 / 1, 1440×900 i
375×812), wejście co 100 ms, `para.py` na hero (`pary/01-hero.json`), `wierzch.py`, `audit.py --devices quick`.
Obrazy (tylko lokalnie, poza repo, bo zawierają zrzuty oryginału): `analiza/` (pary oryginał | nasza, arkusze sekcji, `wejscie_1440.jpg`). Pełne dane:
`%LOCALAPPDATA%\wir-tools\out\milavoss-warsztat\`.

## Zgodne
- Wysokości wszystkich sekcji na 1440 i 375 (różnica poniżej 0,01 ekranu), więc wyzwalacze przewijania są w tych samych
  miejscach.
- Pudełko zdjęcia hero, kolor nawigacji, układ usług, folder „Work”, lista benefits, karta CTA, kolumny stopki.
- Zmiana koloru planszy i zwinięcie kurtyny: ten sam czas (±0,1 s).

## Różnice

| # | Gdzie | Oryginał | U nas | Jak zmierzone |
|---|---|---|---|---|
| 1 | plansza ładowania | „Juan • Mora” obok siebie | „Mila” i „Voss” nachodzą na siebie | klatki wejścia, wycinek środka |
| 2 | wejście: nazwisko i okno projektu | widoczne, gdy kurtyna się zwija (+0,8 s) | pojawiają się po kurtynie (+1,37–1,57 s) | klatki od zmiany koloru |
| 3 | wejście: nawigacja i podpisy hero | +1,2–1,6 s | +0,98–1,17 s (za wcześnie) | jw. |
| 4 | nawigacja 1440 | środek y 4,68 vw | 4,01 vw (ok. 10 px wyżej) | `para.py` |
| 5 | „Brand & Digital / Design Specialist” 1440 | środek y 14,41 vw | 13,36 vw (ok. 15 px wyżej) | `para.py` |
| 6 | nazwisko w spoczynku | lewe słowo wąskie, prawe szerokie; okno ok. 19 vw | oba słowa równe; okno ok. 26 vw | para zrzutów s0 p0 (do potwierdzenia liczbami) |
| 7 | bryły sekcji 2 | szaro‑brzoskwiniowe 3D, wyraźne cienie; kwadrat ze strzałką mocniej obrócony; biała linia przez dużą kulę | jaśniejsze, bardziej przezroczyste i rozmyte; kwadrat mniej obrócony; linia krótsza | para s1 p0,75 |
| 8 | zdjęcie benefits | ciepłe, brązowo‑pomarańczowe; głowa zasłania 2–3 litery „design” | chłodne, szare; głowa zasłania „d design” / „ign” | pary s3 p0,75, s4 p0,25 |
| 9 | stopka | postać przy biurku z monitorem, obrazy na ścianie | pusta scena CSS; na telefonie prawie czarna górna połowa | pary s6 p1, telefon s5 p1 |
| 10 | hero na telefonie | twarz na środku kadru | dłonie i sweter | para 375 s0 p0 |

## Do sprawdzenia (narzędzie coś zgłosiło, nie wiadomo, czy oryginał robi tak samo)
- `audit.py` 360×649: karty usług (`.mask-img-service`, `.sh-track`) wystają w bok do x=370. `audit.py` nie mierzy
  oryginału, więc porównania brak.
- `wierzch.py` 375: napisy w naszych kartach („Clay mug”, „served menu”) częściowo zasłonięte, y 2100–2320.
- Nachodzenie „12 years making…” na „click” przy 0,5–1 ekranu (audit na 360, 768, 1280): na arkuszach oryginał wygląda
  tak samo.

## Nie sprawdzone w tej analizie
Przewijanie w górę i kółkiem, najechania, pomiar parami sekcji 2–7, 768 i ekran Grzegorza, prawdziwy telefon.

## Narzędzia warsztatu w tym przebiegu (do testu metodologii)
| Narzędzie | Co dało | Problem |
|---|---|---|
| `ref.py` | arkusze sekcji obu stron w tych samych punktach: najszybszy obraz różnic | domyślne `--ms=4000` nie łapie wejścia juanmora (w przeglądarce bez okna szara plansza stoi ok. 7 s, bo strona doczytuje pliki); dopiero `--ms=16000`. Pierwsze zrzuty telefonu oryginału łapią jeszcze kurtynę |
| `para.py` | dokładne przesunięcia nawigacji i hero w vw | plik par trzeba napisać ręcznie na sekcję |
| `wierzch.py` | dzieli zasłonięcia na grupy, stałe warstwy osobno | tylko nasza strona w tym przebiegu |
| `audit.py` | wystawanie w bok na 360 | liczy stałą nawigację jako nachodzenie tekstu (dużo szumu); nie przyjmuje adresu oryginału |
