import { createFileRoute } from "@tanstack/react-router";
import { refreshSpotifyToken } from "@/lib/spotify";

// POST /api/spotify-auth — exchange the Spotify refresh token for an access
// token and store it in an httpOnly cookie. Ported from the legacy Next.js
// route handler of the same path.
export const Route = createFileRoute("/api/spotify-auth")({
  server: {
    handlers: {
      POST: async () => {
        try {
          const access_token = await refreshSpotifyToken();
          return Response.json({ access_token });
        } catch (error) {
          console.error("Error refreshing access token:", error);
          return Response.json(
            { error: "Failed to refresh token" },
            { status: 500 },
          );
        }
      },
    },
  },
});
