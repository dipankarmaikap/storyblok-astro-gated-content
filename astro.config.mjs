import db from "@astrojs/db";
import { defineConfig } from "astro/config";

import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
  integrations: [db()],
  output: "server",
  adapter: vercel(),
});
