# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `pnpm dev` — start dev server (port 5173, configured for Docker with host 0.0.0.0)
- `pnpm build` — type-check with tsc then build with Vite
- `pnpm lint` — run ESLint
- `pnpm preview` — preview production build

## Architecture

This is a React SPA for submitting and managing catch applications. It uses Feature-Sliced Design (FSD) architecture with these layers:

- `src/app` — app entry, router, providers (ThemeProvider)
- `src/pages` — page components (Home, SignIn, Application, Dashboard, OrderLog, Profile, Admin)
- `src/widgets` — layout components (Layout, Navbar, Footer)
- `src/features` — business logic slices (auth, request, dashboard, ordersLog, profile)
- `src/shared` — reusable utilities, UI components, API layer, config

## Key Technical Decisions

**State management:** MobX with `mobx-react-lite`. The auth store (`@features/auth/store/authStore.ts`) is a singleton class instance exported directly.

**Routing:** react-router-dom v7 with `BrowserRouter`. Route constants live in `@shared/config/routes.ts`. Protected routes use a `ProtectedRoute` wrapper component. Admin route is conditionally rendered based on hardcoded username check.

**API layer:** Axios instance at `@shared/api/axios.ts` with base URL from `VITE_API_URL` env var (falls back to hardcoded IP). Request interceptor attaches Bearer token; response interceptor handles 401 by clearing tokens.

**UI components:** shadcn/ui (new-york style) installed into `@shared/ui` with Radix primitives. Styling via Tailwind CSS v4 with the `@tailwindcss/vite` plugin.

**Path aliases:** `@app`, `@pages`, `@widgets`, `@features`, `@entities`, `@shared`, `@/` — configured in both `vite.config.ts` and `tsconfig.json`.

## Environment Variables

- `VITE_API_URL` — backend API base URL (default: `http://77.222.46.213:8091/api`)

## Conventions

- Each feature/page follows the pattern: `featureName/hooks/`, `featureName/api/`, `featureName/store/`, `featureName/ui/`
- Pages export from a `ui/index.tsx` file
- Features export via barrel `index.ts` at feature root
- shadcn components go in `@shared/ui`, utilities in `@shared/lib`
