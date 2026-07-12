import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import { getCookie } from "@tanstack/react-start/server";
import type { Tracks } from "@/lib/entities";
import { refreshSpotifyToken } from "@/lib/spotify";

// GET /api/recently-played — return the last 5 tracks played on Spotify.
// Uses the httpOnly access_token cookie if present; otherwise refreshes it
// directly via the shared helper (the legacy version self-fetched
// POST /api/spotify-auth using NEXT_PUBLIC_API_URL).
export const Route = createFileRoute("/api/recently-played")({
  server: {
    handlers: {
      GET: async () => {
        let access_token = getCookie("access_token");

        if (!access_token) {
          try {
            access_token = await refreshSpotifyToken();
          } catch (error) {
            console.error(error);
            return Response.json(
              { error: "Failed to refresh token" },
              { status: 401 },
            );
          }
        }

        try {
          const res = await axios.get<Tracks>(
            "https://api.spotify.com/v1/me/player/recently-played",
            {
              headers: { Authorization: `Bearer ${access_token}` },
              params: {
                limit: 5,
                before: new Date().getTime(),
              },
            },
          );

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
