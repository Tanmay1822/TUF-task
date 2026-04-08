# Wall Calendar — Frontend Engineering Challenge

An interactive wall calendar component built with React, inspired by the physical wall calendar design brief.

## Features

| Feature | Details |
|---|---|
| **Wall calendar aesthetic** | Hero image per month with diagonal blue banner, Cormorant Garamond typography |
| **Day range selector** | Click start → click end; hover preview; clear visual states for start, end, and in-between days |
| **Notes section** | Per-month notes with lined paper aesthetic; persists across navigation via `useState` (swap for `localStorage` if needed) |
| **Holiday markers** | Red dot indicators with tooltip for Indian + international holidays |
| **Month navigation** | Prev/next arrows on the hero image; image cross-fades on transition |
| **Responsive design** | Desktop: side-by-side panel layout · Mobile: stacked vertically |

## Tech Stack

- **React 18** (hooks only — no class components)
- **No external UI library** — all styling done with inline styles + one injected `<style>` tag for media queries
- **Google Fonts** — Cormorant Garamond (month name) + DM Sans (body)
- **Unsplash** — royalty-free hero images (one per month, loaded by URL)

## Getting Started

```bash
# 1. Create a new Vite + React project
npm create vite@latest my-calendar -- --template react
cd my-calendar

# 2. Copy WallCalendar.jsx into src/

# 3. Add fonts to index.html <head>
#    <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@600;700&family=DM+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

# 4. Use in App.jsx
#    import WallCalendar from './WallCalendar'
#    export default function App() { return <WallCalendar /> }

# 5. Run
npm install && npm run dev
```

## Architecture Decisions

### State management (client-only)
All state lives in `useState` hooks inside the `WallCalendar` component. Notes are keyed by `"YYYY-M"` so each month keeps its own memo. To persist across page reloads, initialise state from `localStorage` and add a `useEffect` to sync on change — no backend needed.

### Range selection logic
- First click → `startDate`
- Second click → `endDate` (auto-swapped if user clicks an earlier date)
- Click same date → clears selection
- Hovering while only `startDate` is set → live preview via `hoveredDate`

### Calendar grid
The grid is always 6 rows × 7 columns (42 cells). Overflow days from the adjacent months are shown dimmed, matching standard physical calendar behaviour. The grid starts on **Monday** (ISO week standard).

### Responsive layout
`grid-template-columns: clamp(160px, 25%, 220px) 1fr` on desktop naturally collapses via a single `@media (max-width: 600px)` rule that overrides to `1fr`.

## Extending

- **localStorage persistence**: wrap `useState({})` with a custom `useLocalStorage` hook
- **Theme switching**: pass a `theme` prop and swap the `#1B8FE8` accent colour via CSS variable
- **Page-flip animation**: wrap the card in a CSS 3D-transform on month change (`rotateY`)
- **Custom image upload**: add a file `<input>` and store the object URL in state indexed by month

## License
MIT
