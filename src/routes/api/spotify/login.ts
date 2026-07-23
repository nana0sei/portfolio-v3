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
export const Route = createFileRoute("/api/spotify/login")({
  server: {
    handlers: {
      GET: async () => {
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
