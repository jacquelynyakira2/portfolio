# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm install      # Install dependencies
pnpm dev          # Start dev server with hot reloading (exposed on network via --host)
pnpm build        # Build for production to dist/
pnpm serve        # Preview production build
pnpm lint         # Run ESLint
```

The package manager is **pnpm** (v9). Do not use npm or yarn.

## Architecture

This is a macOS desktop simulator built as a personal portfolio site. It uses React 18 + Zustand + UnoCSS + TypeScript + Vite.

### App Lifecycle (`src/index.tsx`)

The root `App` component controls three top-level states: `booting`, `login`, and `Desktop`. The app starts directly on the Desktop (login is skipped by default). The `Boot` and `Login` pages handle sleep/restart/shutdown transitions.

### Desktop & Window Management (`src/pages/Desktop.tsx`)

`Desktop` is the core of the UI. It manages:
- Which apps are open (`showApps`), their z-indices (`appsZ`), and minimized/maximized state
- App windows rendered via `AppWindow` (draggable/resizable via `react-rnd`)
- AIM chat windows rendered separately alongside regular app windows
- Launchpad, Spotlight, TopBar, and Dock overlaid on the wallpaper

On mobile (`winWidth < 640`), only the focused app window is rendered at a time.

### Adding/Modifying Apps (`src/configs/apps.tsx`)

Apps are defined as an array of `AppsData` objects. Each entry controls:
- `id`: used for DOM targeting (`#window-{id}`, `#dock-{id}`)
- `desktop: true` — renders as an in-window app; `false` — opens an external link
- `dockHidden: true` — hides from Dock (e.g. Preview, Typora, DesktopFolder)
- `show: true` — opens on startup
- `content`: the React component rendered inside the window
- `link`: URL for non-desktop apps

### Content Configs (`src/configs/`)

Personal content (what visitors actually read) lives in config files — not in components:
- `terminal.tsx` — Terminal app filesystem tree (folders/files with JSX content)
- `user.ts` — Name and avatar
- `aim.ts` — AIM buddy list and away messages
- `bear.tsx` — Notes app content
- `websites.ts` — Safari bookmarks/sites
- `maps.ts` — Maps app configuration
- `music.ts` — Music player tracks
- `wallpapers.ts` — Day/night wallpaper paths
- `launchpad.ts` — Launchpad grid apps

All configs are re-exported from `src/configs/index.ts`.

### State Management (`src/stores/`)

A single Zustand store (`useStore`) is composed from slices:
- `system` — dark mode, brightness
- `user` — user session state
- `dock` — dock behavior
- `aim` — AIM chat windows, buddy groups, away messages
- `preview` — controls programmatic opening of Preview app (`shouldOpenPreview`)

### Path Aliases & Auto-Imports

- `~/` resolves to `src/` (configured in `vite.config.ts`)
- React hooks (`useState`, `useEffect`, etc.) are auto-imported via `unplugin-auto-import` — no need to import them manually in components
- Hooks in `src/hooks/`, stores in `src/stores/`, and components in `src/components/**` are also auto-imported

### Styling

UnoCSS (Tailwind-compatible utility classes) is used for styling. Custom CSS lives in `src/styles/`. The font is Avenir Next LT Pro (woff files in `src/styles/fonts/`).
