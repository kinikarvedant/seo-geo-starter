import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    // Unit tests only. scripts/smoke.test.ts is an integration test: it needs a
    // production build for the same CLIENT_ID and boots a server, so it runs from
    // vitest.smoke.mts via `npm run smoke`, not here.
    include: ["src/**/*.test.ts"],
    coverage: {
      include: ["src/lib/**", "src/config/**"],
      thresholds: { lines: 85, functions: 85, branches: 80 },
    },
  },
});
