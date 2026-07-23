import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import type { Tracks } from "@/lib/entities";
import { getSpotifyAccessToken } from "@/lib/spotify";

// GET /api/recently-played — return the last 5 tracks played on Spotify.
// The access token is held server-side by `getSpotifyAccessToken` (cached in
// memory, refreshed from SPOTIFY_REFRESH_TOKEN), so the widget renders the same
// for every visitor and no Spotify credential reaches the browser.
const fetchRecentlyPlayed = (access_token: string) =>
  axios.get<Tracks>("https://api.spotify.com/v1/me/player/recently-played", {
    headers: { Authorization: `Bearer ${access_token}` },
    params: {
      limit: 5,
      before: new Date().getTime(),
    },
  });

export const Route = createFileRoute("/api/recently-played")({
  server: {
    handlers: {
      GET: async () => {
        let access_token: string;
        try {
          access_token = await getSpotifyAccessToken();
        } catch (error) {
          console.error(error);
          return Response.json(
            {
              error:
                error instanceof Error
                  ? error.message
                  : "Failed to obtain a Spotify access token",
            },
            { status: 401 },
          );
        }

        try {
          let res;
          try {
            res = await fetchRecentlyPlayed(access_token);
          } catch (error) {
            // A cached token can be revoked before its nominal expiry — refresh
            // once and retry before giving up.
            if (!axios.isAxiosError(error) || error.response?.status !== 401) {
              throw error;
            }
            res = await fetchRecentlyPlayed(await getSpotifyAccessToken(true));
          }

          return Response.json(res.data);
        } catch (error) {
          console.error(error);
          return Response.json(
            { error: "Failed to fetch recently played" },
            { status: 500 },
          );
        }
      },
    },
  },
});
