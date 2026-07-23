// Server-only helper. Refreshes a Spotify access token from the long-lived
// refresh token and stores it in an httpOnly cookie, mirroring the legacy
// `POST /api/spotify-auth` behavior. Shared by both Spotify server routes so
// `recently-played` no longer needs to self-fetch over HTTP (the legacy app
// used NEXT_PUBLIC_API_URL for that self-call).
//
// Only imported by server route handlers, so `@tanstack/react-start/server`
// import protection is satisfied. Reads env inside the function (never at
// module scope) per TanStack Start guidance.
import axios from "axios";
import { add } from "date-fns";
import { setCookie } from "@tanstack/react-start/server";

interface Token {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  scope: string;
}

const redirect_uri = process.env.SPOTIFY_REDIRECT_URL || "";
const client_id = process.env.SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
const state = process.env.SPOTIFY_STATE_SECRET || "";
const token = Buffer.from(`${client_id}:${client_secret}`).toString("base64");

export const request_spotify_auth = async () => {
  await axios.post(
    `https://accounts.spotify.com/authorize`,
    new URLSearchParams({
      client_id,
      response_type: "code",
      redirect_uri,
      state,
      scope: "user-read-recently-played",
    }),
  );
};

export const request_spotify_token = async (code: string) => {
  const res = await axios.post<Token>(
    `https://accounts.spotify.com/authorize`,
    {
      code,
      grant_type: "authorization_code",
      redirect_uri,
    },
    {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const access_token_expiry = add(new Date(), { seconds: res.data.expires_in });
  setCookie("access_token", res.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: access_token_expiry,
    path: "/",
  });

  const refresh_token_expiry = add(new Date(), {
    months: 6,
  });
  setCookie("refresh_token", res.data.refresh_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: refresh_token_expiry,
    path: "/",
  });
};

export async function refreshSpotifyToken(): Promise<string> {
  const refresh_token = process.env.SPOTIFY_REFRESH_TOKEN;

  const res = await axios.post<Token>(
    "https://accounts.spotify.com/api/token",
    new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token!,
    }),
    {
      headers: {
        Authorization: `Basic ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
    },
  );

  const expiry_date = add(new Date(), { seconds: res.data.expires_in });

  setCookie("access_token", res.data.access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: expiry_date,
    path: "/",
  });

  return res.data.access_token;
}
