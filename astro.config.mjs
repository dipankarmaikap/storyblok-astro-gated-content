import db from "@astrojs/db";
import { defineConfig } from "astro/config";
import vercel from "@astrojs/vercel/serverless";
import tailwind from "@astrojs/tailwind";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), tailwind()],
  vite: {
    optimizeDeps: {
      exclude: ["@node-rs/argon2-wasm32-wasi"],
    },
  },
  output: "server",
  adapter: vercel({
    edgeMiddleware: true,
  }),
  security: {
    checkOrigin: true,
  },
});
