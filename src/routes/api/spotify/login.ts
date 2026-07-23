import { createFileRoute } from "@tanstack/react-router";
import { setCookie } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { SPOTIFY_AUTH_STATE_COOKIE, request_spotify_auth } from "@/lib/spotify";

// GET /api/spotify/login — step 1 of the Spotify Authorization Code flow.
// Mints a one-shot `state` nonce, stashes it in a short-lived cookie, and sends
// the browser to Spotify's consent screen. Spotify then redirects back to
// /api/spotify/callback with `?code=...&state=...`.
//
// Only the account owner can actually complete the flow — the callback checks
// the authorizing account against SPOTIFY_USER_ID.

// `localhost` and `127.0.0.1` are the same machine but *different cookie
// origins*, so starting the flow on one and returning to the other silently
// loses the state cookie. Normalize onto whichever the redirect URI uses.
const LOOPBACK_HOSTNAMES = new Set(["localhost", "127.0.0.1", "[::1]", "::1"]);

export const Route = createFileRoute("/api/spotify/login")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        // Only ever act on requests that arrive over loopback, so this can
        // never interfere with a proxied production host.
        const current = new URL(request.url);
        if (LOOPBACK_HOSTNAMES.has(current.hostname)) {
          const canonical = new URL(process.env.SPOTIFY_REDIRECT_URL!);

          if (!LOOPBACK_HOSTNAMES.has(canonical.hostname)) {
            return new Response(
              `SPOTIFY_REDIRECT_URL points at ${canonical.origin}, but you started the flow on ${current.origin}.\n` +
                `The state cookie is origin-bound, so the callback would reject it.\n` +
                `Start at ${canonical.origin}/api/spotify/login instead.`,
              { status: 400, headers: { "Content-Type": "text/plain" } },
            );
          }

          if (current.host !== canonical.host) {
            return new Response(null, {
              status: 302,
              headers: { Location: `${canonical.origin}/api/spotify/login` },
            });
          }
        }

        const state = randomBytes(32).toString("base64url");

        setCookie(SPOTIFY_AUTH_STATE_COOKIE, state, {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          // `lax`, not `strict` — the cookie has to survive Spotify's
          // cross-site redirect back to the callback.
          sameSite: "lax",
          maxAge: 600,
          path: "/",
        });

        return new Response(null, {
          status: 302,
          headers: { Location: request_spotify_auth(state) },
        });
      },
    },
  },
});
