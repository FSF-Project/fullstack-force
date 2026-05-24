# Księgarnia — FullStack-Force

Internetowa księgarnia zbudowana w React + TypeScript + Vite.

## Wymagania

Przed uruchomieniem upewnij się, że masz zainstalowane:

- **Node.js** w wersji 18 lub wyższej — [nodejs.org](https://nodejs.org)
- **pnpm** — menedżer pakietów

Instalacja pnpm (po zainstalowaniu Node.js):

```bash
npm install -g pnpm
```

Sprawdzenie wersji:

```bash
node -v   # powinno pokazać v18.x.x lub wyżej
pnpm -v
```

## Uruchomienie

```bash
cd frontend
pnpm install
pnpm dev
```

Aplikacja dostępna pod adresem: [http://localhost:8080](http://localhost:8080)

## Build produkcyjny

```bash
pnpm build
```

Wynik trafia do katalogu `dist/`.

## Technologie

| Technologia | Zastosowanie |
|---|---|
| React 18 + TypeScript | Główna biblioteka UI |
| Vite | Bundler i serwer deweloperski |
| Tailwind CSS + shadcn/ui | Stylowanie i komponenty |
| TanStack Query | Zarządzanie stanem serwera |
| React Router | Routing po stronie klienta |

## Struktura projektu

```
src/
├── pages/        # Widoki aplikacji
├── components/   # Komponenty wielokrotnego użytku
│   └── ui/       # Bazowe komponenty UI (shadcn)
├── services/     # Warstwa komunikacji z API
├── hooks/        # Własne hooki React
└── lib/          # Narzędzia pomocnicze
```

## Dostępne widoki

| Ścieżka | Opis |
|---|---|
| `/` | Strona główna |
| `/katalog` | Katalog książek z wyszukiwarką |
| `/zamowienie` | Koszyk i podsumowanie zamówienia |
| `/logowanie` | Logowanie i rejestracja |
| `/admin` | Panel zarządzania książkami (wymaga zalogowania) |
