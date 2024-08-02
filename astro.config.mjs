import { defineConfig } from "astro/config";
import db from "@astrojs/db";
import tailwind from "@astrojs/tailwind";
import vercel from "@astrojs/vercel/serverless";
import { loadEnv } from "vite";
import mkcert from "vite-plugin-mkcert";
import storyblok from "@storyblok/astro";
import icon from "astro-icon";
const {
  RUNNING_LOCALLY,
  STORYBLOK_ACESS_TOKEN,
  STORYBLOK_IS_PREVIEW
} = loadEnv(process.env.NODE_ENV, process.cwd(), "");
const isLocal = RUNNING_LOCALLY === "yes";
const isPreview = STORYBLOK_IS_PREVIEW === "yes";

// https://astro.build/config
export default defineConfig({
  integrations: [db(), tailwind(), storyblok({
    accessToken: STORYBLOK_ACESS_TOKEN,
    livePreview: isPreview,
    enableFallbackComponent: isPreview,
    bridge: false,
    components: {
      article: "storyblok/Article"
    }
  }), icon()],
  experimental: {
    actions: true
  },
  vite: {
    // optimizeDeps: {
    //   exclude: ["@node-rs/argon2-wasm32-wasi"],
    // },
    server: {
      https: isLocal
    },
    plugins: [...(isLocal ? [mkcert()] : [])]
  },
  output: "server",
  adapter: vercel(),
  security: {
    checkOrigin: true
  }
});