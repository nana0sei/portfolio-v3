<!-- intent-skills:start -->
## Skill Loading

Before editing files for a substantial task:
- Run `npx @tanstack/intent@latest list` from the workspace root to see available local skills.
- If a listed skill matches the task, run `npx @tanstack/intent@latest load <package>#<skill>` before changing files.
- Use the loaded `SKILL.md` guidance while making the change.
- Monorepos: when working across packages, run the skill check from the workspace root and prefer the local skill for the package being changed.
- Multiple matches: prefer the most specific local skill for the package or concern you are changing; load additional skills only when the task spans multiple packages or concerns.
<!-- intent-skills:end -->

# Nana Osei Portfolio — TanStack Start

Personal portfolio (home / dev projects / art gallery) with a Spotify
"recently played" widget. This app is a migration of the legacy Next.js 16
App Router app (`portfolio-v3`) to **TanStack Start**, done route-by-route and
feature-by-feature while preserving the original UX, routing, auth/cookie
behavior, and data-fetching.

## How this project was scaffolded

Fresh app created with the TanStack CLI (the host directory was an empty parent
folder, not a template, so the CLI output **is** the project — no separate
scratch merge was needed):

```bash
npx @tanstack/cli@latest create my-tanstack-app --agent --package-manager npm --tailwind --add-ons tanstack-query
```

Notes:
- `--tailwind` is deprecated/ignored (Tailwind is always on in Start scaffolds).
- Add-on `tanstack-query` wired React Query into the router via
  `@tanstack/react-router-ssr-query` (see `src/router.tsx` +
  `src/integrations/tanstack-query/`). `useQuery` works app-wide with SSR
  dehydration — no manual `<QueryClientProvider>` needed.

Follow-up TanStack Intent commands (run once, after scaffolding):

```bash
npx @tanstack/intent@latest install   # writes the skill-loading block above
npx @tanstack/intent@latest list      # enumerate available local skills
npx @tanstack/intent@latest load "<package>#<skill>"   # load a skill before related edits
```

Skills consulted during the migration (load them before touching the matching
area): `@tanstack/react-start#lifecycle/migrate-from-nextjs`,
`@tanstack/start-client-core#start-core/server-routes`,
`@tanstack/start-server-core#start-server-core` (cookies),
`@tanstack/start-client-core#start-core/execution-model` (env vars).

## Stack & integrations

- **TanStack Start** (Vite 8 + `@tanstack/react-start`) — SSR + server routes
- **TanStack Router** (file-based routing, `src/routes/`)
- **TanStack Query v5** (SSR-integrated via the router)
- **React 19**, **TypeScript** (strict, `verbatimModuleSyntax` — use `import type`)
- **Tailwind CSS v4** (`@tailwindcss/vite`) + **shadcn/ui** (base-ui `base-nova`
  style, `@base-ui/react`), `tw-animate-css`
- **next-themes** (light default, class strategy) for dark mode
- **motion** (Framer Motion successor) for the looping tagline
- **axios** (data fetching), **date-fns** (token expiry), **react-icons**,
  **react-masonry-css**, **lucide-react**
- Self-hosted **Raleway** via `@fontsource-variable/raleway`
- **Cloudinary** (art gallery) and **Spotify** (recently played) integrations

## Commands

```bash
npm run dev              # dev server at http://localhost:3000
npm run build            # production build (client + SSR) — does NOT type-check
npm run generate-routes  # regenerate src/routeTree.gen.ts (tsr generate)
npm run preview          # preview the production build
npx tsc --noEmit         # standalone type-check
```

No test suite is configured.

## Architecture

**Routes (`src/routes/`)**
- `index.tsx` — home: `LoopingText` tagline + two nav cards (`/dev`, `/art`)
- `dev.tsx` — project showcase from `src/lib/data/projects.ts`
- `art.tsx` — masonry grid of Cloudinary artwork
- `__root.tsx` — document shell: `<head>`, `next-themes` provider, `Navbar`,
  `<Outlet>`, `Footer`, devtools. Also hosts `notFoundComponent` (404) and
  `errorComponent` (500), replacing the legacy `not-found.tsx` / `error.tsx`.

**Server routes (`src/routes/api/`)** — `server.handlers` on `createFileRoute`:
- `GET /api/media` — Cloudinary `portfolio` folder (Basic auth)
- `GET /api/recently-played` — last 5 Spotify tracks; reads the `access_token`
  httpOnly cookie, else refreshes it directly via `src/lib/spotify.ts`
- `POST /api/spotify-auth` — refresh Spotify token → set httpOnly cookie

**Data fetching** — React Query hooks (`src/hooks/useCloudinary.ts`,
`useRecentlyPlayed.ts`) call the internal API routes with axios. Same pattern as
legacy: the browser never talks to Cloudinary/Spotify directly; secrets stay
server-side.

**Components** — `src/components/custom/` (domain: Navbar, Footer, DevCard,
ArtCard, MasonryGrid, RecentlyPlayedCard, LoopingText); `src/components/ui/`
(shadcn primitives: button, card, badge, dialog, popover, skeleton).

**Path aliases** — both `@/*` and `#/*` map to `./src/*` (see `tsconfig.json`).
Legacy `@/*` pointed at the repo root, so imports were rewritten
(`@/app/assets/x` → `@/assets/x`, `@/app/hooks/x` → `@/hooks/x`).

## Environment variables

Copy `.env.example` → `.env`. Server secrets are read via `process.env` **inside
handlers** (never at module scope — edge runtimes inject env per-request). Only
`VITE_`-prefixed vars reach the client bundle.

| Variable | Scope | Used by |
|---|---|---|
| `VITE_CLOUDINARY_CLOUD_NAME` | client | `src/lib/cloudinary.ts` (art image URLs) |
| `CLOUDINARY_CLOUD_NAME` | server | `GET /api/media` |
| `CLOUDINARY_API_KEY` | server | `GET /api/media` |
| `CLOUDINARY_API_SECRET` | server | `GET /api/media` |
| `SPOTIFY_CLIENT_ID` | server | `POST /api/spotify-auth` |
| `SPOTIFY_CLIENT_SECRET` | server | `POST /api/spotify-auth` |
| `SPOTIFY_REFRESH_TOKEN` | server | `POST /api/spotify-auth` |

## Key migration decisions (Next.js → TanStack Start)

| Next.js | TanStack Start replacement |
|---|---|
| `app/**/page.tsx` | `src/routes/*.tsx` file routes (`createFileRoute`) |
| `app/api/**/route.ts` | `server.handlers` on a file route in `src/routes/api/` |
| `next/headers` `cookies()` | `getCookie`/`setCookie` from `@tanstack/react-start/server` |
| self-fetch via `NEXT_PUBLIC_API_URL` | `recently-played` calls `refreshSpotifyToken()` in-process (env var removed) |
| `next/image` + `StaticImageData` | plain `<img>`; Vite image imports are URL **strings** (`Project.image: string`) |
| `next/font` (Raleway) | `@fontsource-variable/raleway`, `--font-open-sans` in `styles.css` |
| `next/link` | router `<Link to=... />` for internal; plain `<a>` for external/mailto |
| `next-cloudinary` `<CldImage>` | `cldImage()` helper (`src/lib/cloudinary.ts`) → `<AdvancedImage>` (`@cloudinary/react`) |
| `import { motion } from "framer-motion"` | `import { motion } from "motion/react"` |
| `"use client"` directives | removed (Start is isomorphic by default) |
| Next public env inlining | `import.meta.env.VITE_*` (client) / `process.env.*` (server) |

## Known gotchas

- **`server` route typing**: the `server` option on `createFileRoute` comes from
  a TanStack Start module augmentation. `vite build` (esbuild) doesn't
  type-check so runtime is fine, but standalone `tsc` needs the augmentation
  loaded — `src/start-types.d.ts` re-exports a Start type to force this. Don't
  delete it or `tsc` will error on `server` not existing.
- **`verbatimModuleSyntax`** is on — type-only imports must use `import type`.
- **`next-themes` + SSR**: `Navbar` uses a `mounted` guard so the server and
  first client render show the light-mode logo/icon, avoiding a hydration
  mismatch. Keep that guard if editing the navbar.
- **`react-masonry-css` code-splitting**: legacy lazy-loaded `ArtCard`; here it
  is imported directly to avoid needing a Suspense boundary during SSR.

## Deployment notes

- `npm run build` emits `dist/client` and `dist/server` (Node server:
  `dist/server/server.js`). Default target is Node; for Vercel/Netlify/Cloudflare
  see the `@tanstack/start-client-core#start-core/deployment` skill and add the
  matching Vite/Nitro preset.
- Set all env vars from the table above in the host. `NODE_ENV=production` makes
  the Spotify cookie `Secure` — serve over HTTPS.
- `next/image` optimization is gone; images are served unoptimized. If image
  weight matters, add a Vite image plugin or use Cloudinary transforms for the
  local assets too.

## `legacy-source/`

A **reference-only** clone of https://github.com/nana0sei/portfolio-v3 lives in
`legacy-source/` (its `.git` was removed; it is gitignored and excluded from
`tsconfig`). Consult it when migrating remaining behavior; never build from it
or copy files in wholesale.

## Next steps / not yet migrated

- Legacy `components/ui/` primitives not currently used were **not** ported
  (`carousel`, `alert-dialog`, `switch`) to avoid unused deps (e.g. embla). Add
  them back via shadcn if a feature needs them.
- Unused legacy assets were copied into `src/assets/` for parity but aren't all
  referenced (`error.png`, `lseza.png`, `skillset.png`, `spotify.png`,
  `square.jpg`, `react.svg`). Prune if undesired.
- Consider route loaders + `queryClient.ensureQueryData` to fetch Cloudinary/
  Spotify during SSR (currently client-fetched, matching legacy behavior).
- No automated tests exist; add Vitest coverage for the server routes/helpers.
