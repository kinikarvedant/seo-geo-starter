import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    alias: { "@": fileURLToPath(new URL("./src", import.meta.url)) },
  },
  test: {
    environment: "node",
    include: ["src/**/*.test.ts", "scripts/**/*.test.ts"],
    coverage: {
      include: ["src/lib/**", "src/config/**"],
      thresholds: { lines: 85, functions: 85, branches: 80 },
    },
  },
});
