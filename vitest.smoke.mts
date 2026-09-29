import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

/**
 * Integration config: boots the built server and fetches real URLs, so it needs a
 * production build to exist and takes seconds rather than milliseconds. Kept out of
 * `npm test` for that reason — unit tests stay fast enough to run on every save.
 */
export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["scripts/smoke.test.ts"],
    testTimeout: 60_000,
    hookTimeout: 60_000,
    fileParallelism: false,
  },
});
