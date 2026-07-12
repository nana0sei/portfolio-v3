// Loads TanStack Start's module augmentation of `@tanstack/router-core`, which
// adds the `server` option (server routes) to file-route definitions. The
// re-export forces `tsc` to include start-client-core's `serverRoute.d.ts` in
// the program so `createFileRoute(...)({ server: { handlers } })` type-checks.
//
// `vite build` uses esbuild and does not type-check, so this only affects the
// standalone `tsc --noEmit` typecheck. Type-only; no runtime effect.
export type { RouteServerOptions } from "@tanstack/react-start";
