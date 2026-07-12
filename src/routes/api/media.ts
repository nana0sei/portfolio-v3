import { createFileRoute } from "@tanstack/react-router";
import axios from "axios";
import type { CloudinaryImages } from "@/lib/entities";

// GET /api/media — fetch images in the Cloudinary `portfolio` folder using
// Basic auth. Ported from the legacy Next.js route handler. Env is read inside
// the handler (per-request), never at module scope.
export const Route = createFileRoute("/api/media")({
  server: {
    handlers: {
      GET: async () => {
        const cloud_name =
          process.env.CLOUDINARY_CLOUD_NAME ??
          process.env.VITE_CLOUDINARY_CLOUD_NAME;
        const api_key = process.env.CLOUDINARY_API_KEY;
        const api_secret = process.env.CLOUDINARY_API_SECRET;

        try {
          const token = Buffer.from(`${api_key}:${api_secret}`).toString(
            "base64",
          );

          const res = await axios.get<CloudinaryImages>(
            `https://api.cloudinary.com/v1_1/${cloud_name}/resources/search`,
            {
              headers: { Authorization: "Basic " + token },
              params: {
                max_results: 100,
                expression: "folder:portfolio",
              },
            },
          );

          return Response.json(res.data);
        } catch (error) {
          console.error(error);
          return Response.json(
            { error: "Failed to fetch images" },
            { status: 500 },
          );
        }
      },
    },
  },
});
