# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build
npm run lint     # run ESLint
```

No test suite is configured.

## Architecture

This is a **Next.js 16** portfolio site using the App Router. Key version note: Next.js 16 has breaking changes — check `node_modules/next/dist/docs/` before writing any Next.js-specific code.

**Pages:**
- `/` — home with two navigation cards (dev, art)
- `/dev` — project showcase, data from `lib/data/projects.ts`
- `/art` — masonry grid of artwork fetched from Cloudinary

**API Routes (`app/api/`):**
- `GET /api/media` — fetches images from Cloudinary `portfolio` folder using Basic auth
- `GET /api/recently-played` — fetches last played Spotify track; auto-refreshes token via `/api/spotify-auth` if cookie expired
- `POST /api/spotify-auth` — exchanges Spotify refresh token for access token, stores it in an `httpOnly` cookie

**Data fetching:** TanStack Query v5 (`useCloudinaryImages`, `useRecentlyPlayed` hooks in `app/hooks/`). All client-side fetches go through internal API routes, not external services directly.

**Providers (`app/providers/`):** `Provider` wraps the app in `ThemeProvider` (next-themes, dark default) and `QueryClientProvider`.

**Components:**
- `components/custom/` — domain components (Navbar, Footer, DevCard, ArtCard, MasonryGrid, RecentlyPlayedCard, LoopingText)
- `components/ui/` — shadcn/ui primitives (Button, Card, Switch, Dialog, Skeleton, AlertDialog)

**Styling:** Tailwind CSS v4 with `tw-animate-css`. Path alias `@/*` maps to the repo root.

## Environment Variables

| Variable | Used by |
|---|---|
| `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` | `/api/media` |
| `NEXT_CLOUDINARY_API_KEY` | `/api/media` |
| `NEXT_CLOUDINARY_API_SECRET` | `/api/media` |
| `NEXT_PUBLIC_API_URL` | `/api/recently-played` (self-referencing POST) |
| `SPOTIFY_CLIENT_ID` | `/api/spotify-auth` |
| `SPOTIFY_CLIENT_SECRET` | `/api/spotify-auth` |
| `SPOTIFY_REFRESH_TOKEN` | `/api/spotify-auth` |

## Adding Projects

Edit `lib/data/projects.ts`. Each entry follows the `Project` interface in `lib/entities.ts` — `link`, `name`, `description`, `image` (static import from `app/assets/`), optional `git`, and `tools` string array.
