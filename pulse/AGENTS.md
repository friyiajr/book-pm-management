# AGENTS.md

This file provides guidance to AI coding agents working with code in this repository.

## What this is

This is an **educational repository** for the textbook *Practical Product Management in the Age of AI* by Guinevere Orvis. It is **not a commercial product**. The running case study is **Pulse**, a deliberately minimal personal health tracker that students clone, study, and extend as they work through the book.

Readers and students fork this repo to their own GitHub account and work there. 

## Repository layout

This is a single repo with an example app alongside book materials. Folder structure:

| Folder | Contents |
|--------|----------|
| `pulse/` | **The Pulse web app** (React + Vite). All app development happens here. |
| `artifacts/` | Product-file templates & examples (the book's deliverables) |
| `artifacts/examples/` | Completed reference examples (PRDs, labs, diagrams) |
| `artifacts/labs/` | Blank lab templates, one per chapter |
| `artifacts/data/` | Sample datasets (e.g. `1week.md`, `2week.md`) for lab prototyping, standing in for real backend data |
| `prompts/` | Versioned prompt files used in the book |



## Commands

All app commands run from the `pulse/` directory:

```bash
cd pulse
npm install        # install dependencies
npm run dev        # Vite dev server — http://localhost:5173/pulse/
npm run build      # production build to pulse/dist/
npm run preview    # serve the production build locally

npm run dev:yorku    # dev server, York U Fitness class branding (red)
npm run build:yorku  # production build, York U Fitness branding
```

The plain `dev`/`build` scripts render **Pulse** (the default, standard look for the book). The `:yorku` scripts render the **York U Fitness** class variant. See the Branding section below.

There is currently **no test runner and no linter configured**. Don't claim tests pass — there are none to run.

## Deployment

`pulse/` is built and deployed to GitHub Pages automatically by `.github/workflows/deploy.yml` on every push to `main`. The workflow runs `npm ci` + `npm run build` inside `pulse/` and publishes `pulse/dist`. It then also runs `npm run build:yorku`, which (via the mode-aware `vite.config.js`) outputs the York U Fitness class variant into `dist/pulse/yorku`, so it deploys alongside Pulse. Result: Pulse serves at `…/pulse/` and York U Fitness at `…/pulse/yorku/`. Build order matters — Pulse first, then York, since the York output nests inside the Pulse `outDir`.

Because the app is served from a subpath, `vite.config.js` sets `base: '/pulse/'`. Keep this in mind for any asset paths or links — the dev server and the deployed site both live under `/pulse/`.

## Architecture

The app is a small client-only SPA. There is **no backend, no database, and no accounts** — everything lives in the browser.

- **Entry point** — `src/main.jsx` mounts `<App>` inside MUI's `ThemeProvider` + `CssBaseline`, and loads the Space Grotesk / Inter web fonts.
- **`src/App.jsx`** is the root. There is **no router**: navigation is plain view-index state (`0=Dashboard`, `1=Log`, `2=History`) so the app works on GitHub Pages without server-side routing. App also owns the Settings dialog and edit/quick-add flows.
- **`src/hooks/useEntries.js`** is the single source of truth for data. It exposes `{ entries, add, update, remove, clearAll, loadSampleData }`, backed by `localStorage` under the key `pulse.entries`. On first run (or corrupted storage) it auto-loads generated sample data. **Route all entry mutations through this hook** — don't touch `localStorage` directly elsewhere.
- **`src/data/seed.js`** generates ~14 days of realistic sample entries with timestamps relative to today, so charts always look populated.
- **`src/components/`** — presentational/feature components: `Nav` (responsive Tabs on desktop, `BottomNavigation` on mobile via `useMediaQuery('(max-width:600px)')`), `Dashboard`, `LogForm`, `History`, `MetricCard`, `TrendChart`, `PulseLine`.
- **`src/brand.js`** — brand configuration (product name + accent colors). Exports the active `brand`, chosen by `import.meta.env.VITE_BRAND`, defaulting to `pulse`. `theme.js` derives its accent/palette tokens from it, so all UI color flows from the selected brand.

### Branding (Pulse vs York U Fitness)

One codebase serves two brands. **Pulse is the default and must stay so** — it's the standard look for the book and the deployed GitHub Pages site. **York U Fitness** is an opt-in red-branded variant for the York University course, selected with Vite mode `yorku` (`npm run dev:yorku` / `build:yorku`; `.env.yorku` sets `VITE_BRAND=yorku`). Only branding differs — colors and the product name — there are no feature or data differences, and the `localStorage` key (`pulse.entries`) is intentionally shared. When adding UI color, pull from the theme tokens / `brand.js` rather than hardcoding hex values, so both variants stay consistent. Never change the default (unset `VITE_BRAND`) away from Pulse.

### Entry data model

Every record (sample or user-created) has this structure:

```js
{
  id,          // uuid (from the `uuid` package)
  type,        // 'food' | 'steps' | 'water' | 'sleep'
  value,       // number
  unit,        // 'kcal' | 'steps' | 'ml' | 'hours'
  note,        // string (free text, e.g. meal name)
  timestamp,   // ISO 8601 string
}
```

The four `type` values (food, steps, water, sleep) are the core domain. Any feature touching entries should handle all four consistently.

## UI / styling conventions

- Use **React** and **Material UI (MUI v6)** for all UI. Build with MUI components rather than hand-rolled HTML/CSS, and use MUI's `sx` prop / theme for styling.
- Charts use **Recharts**. Pull colors from the design tokens exported by `src/theme.js` (`import { tokens } from '../theme'`) so charts match the theme.
- The look is a **dark, mono-violet theme** ("a quiet control panel at night") defined centrally in `src/theme.js`. Headings use **Space Grotesk** (uppercase, letter-spaced); body uses **Inter**. Add or change visual styling through the theme, not scattered inline overrides, so the aesthetic stays consistent.
- Respect accessibility cues already in place — e.g. `prefers-reduced-motion` gates the logo animation, and interactive elements carry `aria-label`s and stable `id`s.

## Contributing conventions

- Work happens off `main`; the GitHub Pages deploy triggers on merge to `main`.
- **Do not add AI/assistant attribution** to commits, PR descriptions, or code comments (no "Generated with…" / "Co-Authored-By" assistant lines).
