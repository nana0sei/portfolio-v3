import { defineConfig } from "vite";
import { devtools } from "@tanstack/devtools-vite";

import { tanstackStart } from "@tanstack/react-start/plugin/vite";

import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { nitro } from "nitro/vite";

const config = defineConfig({
  // Bind the IPv4 loopback. Vite otherwise listens on [::1] only, and Spotify
  // rejects `localhost` as a redirect host — the OAuth callback has to come back
  // to http://127.0.0.1:3000 (see SPOTIFY_REDIRECT_URL). `localhost` in a
  // browser still reaches this.
  server: { host: "127.0.0.1" },
  resolve: { tsconfigPaths: true },
  plugins: [devtools(), tailwindcss(), tanstackStart(), viteReact(), nitro()],
});

export default config;
