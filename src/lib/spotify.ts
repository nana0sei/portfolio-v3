// Server-only Spotify helpers implementing the Authorization Code flow:
// https://developer.spotify.com/documentation/web-api/tutorials/code-flow
//
// Spotify refresh tokens now expire after ~6 months, so `SPOTIFY_REFRESH_TOKEN`
// has to be regenerated periodically. `request_spotify_auth` +
// `request_spotify_token` back the /api/spotify/login → /api/spotify/callback
// routes that do that in-app; `getSpotifyAccessToken` is what the
// recently-played route calls on every request.
//
// The access token is cached in module scope rather than in a cookie: this is a
// single-account widget whose tracks are shown to every visitor, so the token
// must stay on the server. (A cookie would also hand the owner's token to every
// visitor — httpOnly hides it from JS, not from devtools.)
//
// Env is read inside functions, never at module scope, per the project
// convention — edge runtimes inject env per-request.
import axios from "axios";

const AUTHORIZE_URL = "https://accounts.spotify.com/authorize";
const TOKEN_URL = "https://accounts.spotify.com/api/token";
const ME_URL = "https://api.spotify.com/v1/me";

const SCOPE = "user-read-recently-played";

// Short-lived, one-shot CSRF nonce for the login → callback round trip.
export const SPOTIFY_AUTH_STATE_COOKIE = "spotify_auth_state";

// Refresh this far before the token actually lapses.
const EXPIRY_SKEW_MS = 60_000;

interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

interface SpotifyConfig {
  client_id: string;
  redirect_uri: string;
  basic_auth: string;
}

function getSpotifyConfig(): SpotifyConfig {
  const client_id = process.env.SPOTIFY_CLIENT_ID;
  const client_secret = process.env.SPOTIFY_CLIENT_SECRET;
  const redirect_uri = process.env.SPOTIFY_REDIRECT_URL;

  const missing = Object.entries({
    SPOTIFY_CLIENT_ID: client_id,
    SPOTIFY_CLIENT_SECRET: client_secret,
    SPOTIFY_REDIRECT_URL: redirect_uri,
  })
    .filter(([, value]) => !value)
    .map(([name]) => name);

  if (missing.length) {
    throw new Error(`Missing Spotify env vars: ${missing.join(", ")}`);
  }

  return {
    client_id: client_id!,
    redirect_uri: redirect_uri!,
    basic_auth: Buffer.from(`${client_id}:${client_secret}`).toString("base64"),
  };
}

// Step 1 of the code flow. Returns the URL the *browser* must be redirected to
// so the account owner can approve — it is a navigation target, not a
// server-to-server call.
export const request_spotify_auth = (state: string): string => {
  const { client_id, redirect_uri } = getSpotifyConfig();

  const params = new URLSearchParams({
    client_id,
    response_type: "code",
    redirect_uri,
    state,
    scope: SCOPE,
  });

  return `${AUTHORIZE_URL}?${params.toString()}`;
};

// Step 2 of the code flow: trade the `code` param Spotify put on the redirect
// for an access token + a fresh 6-month refresh token.
export const request_spotify_token = async (code: string): Promise<Token> => {
  const { redirect_uri, basic_auth } = getSpotifyConfig();

  const res = await axios.post<Token>(
    TOKEN_URL,
    new URLSearchParams({
      code,
      grant_type: "authorization_code",
      redirect_uri,
    }),
    {
      headers: {
        Authorization: `Basic ${basic_auth}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  return res.data;
};

// Used by the callback to confirm the account that just authorized is the site
// owner. `id` comes back without `user-read-private` — that scope only gates
// country/product/email.
export async function getSpotifyUserId(access_token: string): Promise<string> {
  const res = await axios.get<{ id: string }>(ME_URL, {
    headers: { Authorization: `Bearer ${access_token}` },
  });

  return res.data.id;
}

let cached: { token: string; expires_at: number } | null = null;
let inflight: Promise<string> | null = null;
// Set only if Spotify hands back a rotated refresh token; env stays the source
// of truth, so this survives just for the life of the server instance.
let rotated_refresh_token: string | null = null;

// The accessor server routes should use. Serves the cached token when it is
// still good, otherwise refreshes — deduping concurrent refreshes so a burst of
// requests after a cold start only hits Spotify once. Pass `force` to discard a
// token Spotify rejected before its nominal expiry.
export async function getSpotifyAccessToken(force = false): Promise<string> {
  if (force) {
    cached = null;
    inflight = null;
  } else if (cached && cached.expires_at - Date.now() > EXPIRY_SKEW_MS) {
    return cached.token;
  }

  inflight ??= refreshSpotifyToken().finally(() => {
    inflight = null;
  });

  return inflight;
}

export async function refreshSpotifyToken(): Promise<string> {
  const { basic_auth } = getSpotifyConfig();
  const refresh_token =
    rotated_refresh_token ?? process.env.SPOTIFY_REFRESH_TOKEN;

  if (!refresh_token) {
    throw new Error(
      "SPOTIFY_REFRESH_TOKEN is not set — authorize at /api/spotify/login to generate one.",
    );
  }

  let res;
  try {
    res = await axios.post<Token>(
      TOKEN_URL,
      new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token,
      }),
      {
        headers: {
          Authorization: `Basic ${basic_auth}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      },
    );
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 400) {
      cached = null;
      rotated_refresh_token = null;
      throw new Error(
        "Spotify rejected the refresh token — it is expired (they last ~6 months now) or revoked. Re-authorize at /api/spotify/login and update SPOTIFY_REFRESH_TOKEN.",
      );
    }
    throw error;
  }

  // Spotify may rotate the refresh token on refresh. Env is the source of
  // truth and we cannot write to it, so keep the new one in memory and shout —
  // otherwise the stale env value silently breaks on the next cold start.
  if (res.data.refresh_token && res.data.refresh_token !== refresh_token) {
    rotated_refresh_token = res.data.refresh_token;
    console.warn(
      `[spotify] refresh token rotated — update SPOTIFY_REFRESH_TOKEN to: ${res.data.refresh_token}`,
    );
  }

  cached = {
    token: res.data.access_token,
    expires_at: Date.now() + res.data.expires_in * 1000,
  };

  return cached.token;
}
