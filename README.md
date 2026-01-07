# RPG Lite (React + TypeScript) — projekt zakończony

Projekt był krótkim prototypem webowej gry RPG „lite”, budowanej w React + TypeScript. Celem było sprawdzenie pętli: walka → loot → ekwipunek → rozwój postaci, bez rozbudowanego zapisu, backendu i multiplayera.

Status: **projekt przerwany / zamknięty**.

---

## Założenia projektu (cel)
- Prosty prototyp RPG w przeglądarce.
- Turówkowa walka 1v1 z mobem.
- Loot RNG + ekwipunek (weapon/armor/charm).
- Plecak + proste zarządzanie itemami.
- Rozwój postaci przez EXP i level.

---

## Co zostało zrealizowane (działało)
### Core gameplay
- **Turówkowa walka 1v1** (player vs mob) z logiem walki.
- **Moby z poziomami i statami** (HP/ATK + wymagany poziom wejścia / selekcji).
- **Cooldown / blokada po śmierci** (mechanika „kara za zgon” w prototypie).
- **Loot z tabel per mob** (losowanie itemów według rarity i wag).

### Ekwipunek i plecak
- **Sloty ekwipunku**: weapon / armor / charm.
- **Plecak**: lista itemów, zakładanie/ściąganie (double-click).
- **Tooltipy itemów** (podgląd nazwy, rarity, statów, wymagany lvl).
- **Porównywarka itemów pod CTRL** (plecak vs założone).

### Sklep (miasto)
- **Sprzedaż itemów** (koszyk sprzedaży + sprzedaż wszystkiego).
- **Kupno mikstur** (koszyk zakupowy, walidacja golda).
- **Zakup dodatkowego slotu plecaka** (rosnąca cena).

### UI
- Layout 3-kolumnowy: panel gracza po lewej, główny ekran po środku/prawej.
- Zakładki: **Loch / Miasto / Quest** (z blokadą wejścia w inne zakładki podczas lochu).
- Styl „glass / game frame” z tłem i panelami.

---

## Co zostało rozpoczęte, ale nie dopięte
### „Dungeon view” / mapa
- Próby przejścia z klikania „atakuj” na system lochu z mapą i ruchem (strzałki).
- Wiele iteracji UI/układu lochu (mapa, log, scena moba).
- Część problemów pozostała nierozwiązana (m.in. blokady ruchu, responsywność mapy).

### Questy
- Widok „Quest” jako placeholder.
- Plan: quest progresu (zabij X mobów) odblokowujący przejścia — nie wdrożony.

---

## Funkcje i pomysły porzucone (nie wdrożone)
- System energii / many do teleportów.
- Rozbudowany system map: **MAPA / STAGE / PLACE** (5x5 grid, spawn/exit/mob/loot/empty).
- Bossy rozrzucone statycznie po mapach + „endgame farm”.
- Teleporty/portale między mapami i stage’ami z kosztami.
- Aukcja / chat / multiplayer / zapis graczy (backend).
- Pełne miasto jako hub (budynki: alchemik, kowal, charm merchant).
- Zamykanie questów i nagrody automatyczne.

---

## Technologie
- **Frontend:** React + TypeScript
- **Styling:** CSS (custom, bez frameworków)
- **State / logika gry:** custom hook `useGame()` + proste moduły „engine”
- **Build tool:** typowy stack Vite (projekt React TS)

Brak backendu, brak bazy danych, brak autoryzacji i brak persystencji (save/load).

---

## Dlaczego projekt został przerwany
- Zbyt dużo iteracji UI i mechanik naraz w stosunku do założonego czasu.
- Priorytet: nie „przedobrzyć” i nie rozciągać prototypu w nieskończoność.
- Decyzja o zamknięciu prac i wyciągnięciu wniosków do kolejnych projektów.

---

## Co można wykorzystać w kolejnym projekcie
- Szkielet pod: walka turowa + loot + ekwipunek + sklep.
- Tooltipy i porównywarka itemów.
- Podstawy ekonomii (sprzedaż/kupno) i limit plecaka.
- Styl paneli i ogólna rama UI.

---

## Uruchomienie (jeśli projekt nadal jest w repo)
```bash
npm install
npm run dev
