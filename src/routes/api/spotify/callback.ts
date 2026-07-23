import { createFileRoute } from "@tanstack/react-router";
import { deleteCookie, getCookie } from "@tanstack/react-start/server";
import {
  SPOTIFY_AUTH_STATE_COOKIE,
  getSpotifyUserId,
  request_spotify_token,
} from "@/lib/spotify";

// GET /api/spotify/callback — step 2 of the Spotify Authorization Code flow and
// the registered redirect URI. Picks the `code` param off the redirect, trades
// it for tokens, and renders the fresh refresh token so it can be copied into
// SPOTIFY_REFRESH_TOKEN (locally and in the host's env).
//
// Guarded twice: the `state` param must match the one-shot cookie set by
// /api/spotify/login (CSRF), and the account that authorized must be the site
// owner (SPOTIFY_USER_ID) — otherwise a stranger could install their own token
// and the widget would start showing their music.

const escape_html = (value: string) =>
  value.replace(
    /[&<>"']/g,
    (char) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[char]!,
  );

const page = (status: number, title: string, body: string) =>
  new Response(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<meta name="robots" content="noindex" />
<title>${escape_html(title)}</title>
<style>
  :root { color-scheme: light dark; }
  body {
    font-family: ui-sans-serif, system-ui, sans-serif;
    max-width: 44rem; margin: 4rem auto; padding: 0 1.5rem; line-height: 1.6;
  }
  h1 { font-size: 1.25rem; margin-bottom: 0.5rem; }
  code, pre {
    font-family: ui-monospace, monospace; font-size: 0.85rem;
    background: color-mix(in srgb, currentColor 8%, transparent);
    border-radius: 0.375rem;
  }
  code { padding: 0.1rem 0.35rem; }
  pre { padding: 0.75rem; overflow-x: auto; white-space: pre-wrap; word-break: break-all; }
  button {
    font: inherit; padding: 0.4rem 0.9rem; border-radius: 0.375rem; cursor: pointer;
    border: 1px solid color-mix(in srgb, currentColor 30%, transparent); background: transparent;
  }
  ol { padding-left: 1.25rem; }
  .muted { opacity: 0.7; font-size: 0.9rem; }
</style>
</head>
<body>${body}</body>
</html>`,
    { status, headers: { "Content-Type": "text/html; charset=utf-8" } },
  );

const error_page = (status: number, message: string) =>
  page(
    status,
    "Spotify authorization failed",
    `<h1>Spotify authorization failed</h1>
<p>${escape_html(message)}</p>
<p class="muted">Start over at <code>/api/spotify/login</code>.</p>`,
  );

export const Route = createFileRoute("/api/spotify/callback")({
  server: {
    handlers: {
      GET: async ({ request }) => {
        const params = new URL(request.url).searchParams;

        const expected_state = getCookie(SPOTIFY_AUTH_STATE_COOKIE);
        // One-shot: burn it whatever the outcome.
        deleteCookie(SPOTIFY_AUTH_STATE_COOKIE, { path: "/" });

        const denied = params.get("error");
        if (denied) {
          return error_page(400, `Spotify returned "${denied}".`);
        }

        const state = params.get("state");
        if (!expected_state || !state || state !== expected_state) {
          return error_page(
            400,
            "State mismatch — this redirect did not come from /api/spotify/login, or it took longer than 10 minutes.",
          );
        }

        const code = params.get("code");
        if (!code) {
          return error_page(400, "No authorization code on the redirect.");
        }

        let token;
        let user_id;
        try {
          token = await request_spotify_token(code);
          user_id = await getSpotifyUserId(token.access_token);
        } catch (error) {
          console.error("Spotify token exchange failed:", error);
          return error_page(
            502,
            "Could not exchange the authorization code with Spotify. Check SPOTIFY_CLIENT_ID / SPOTIFY_CLIENT_SECRET and that SPOTIFY_REDIRECT_URL exactly matches the URI registered in the Spotify dashboard.",
          );
        }

        const owner_id = process.env.SPOTIFY_USER_ID;
        if (owner_id) {
          if (user_id !== owner_id) {
            return error_page(
              403,
              "That Spotify account is not the owner of this site.",
            );
          }
        } else if (process.env.NODE_ENV === "production") {
          // Fail closed: without SPOTIFY_USER_ID there is nothing to check the
          // authorizing account against.
          return error_page(
            403,
            "SPOTIFY_USER_ID is not set, so ownership cannot be verified. Set it before authorizing in production.",
          );
        }

        if (!token.refresh_token) {
          return error_page(
            502,
            "Spotify did not return a refresh token. Try again with a fresh authorization.",
          );
        }

        const bootstrap = owner_id
          ? ""
          : `<p class="muted">SPOTIFY_USER_ID is unset. The account that just authorized is
<code>${escape_html(user_id)}</code> — set <code>SPOTIFY_USER_ID=${escape_html(user_id)}</code> to lock this route down.</p>`;

        return page(
          200,
          "Spotify authorized",
          `<h1>Spotify authorized</h1>
<p>Copy this into <code>SPOTIFY_REFRESH_TOKEN</code>:</p>
<pre id="token">${escape_html(token.refresh_token)}</pre>
<p><button id="copy" type="button">Copy token</button></p>
<ol>
  <li>Paste it into <code>.env</code> locally.</li>
  <li>Update it in your host's environment variables (Vercel &rarr; Settings &rarr; Environment Variables), then redeploy.</li>
  <li>Restart the dev server so the new value is picked up.</li>
</ol>
${bootstrap}
<p class="muted">Refresh tokens last about 6 months. When the widget goes quiet, run
<code>/api/spotify/login</code> again.</p>
<script>
  document.getElementById("copy").addEventListener("click", async (event) => {
    await navigator.clipboard.writeText(document.getElementById("token").textContent);
    event.target.textContent = "Copied";
  });
</script>`,
        );
      },
    },
  },
});
