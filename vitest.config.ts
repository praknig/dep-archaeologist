import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { conditions: ["dep-archaeologist-source"] },
  test: {
    projects: [
      { extends: true, test: { name: "core", root: "./packages/core" } },
      { extends: true, test: { name: "cli", root: "./packages/cli" } },
    ],
    environment: "node",
    include: ["**/*.{test,spec}.ts"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/fixtures/**"],
    testTimeout: 10000,
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["packages/*/src/**"],
      exclude: ["**/*.d.ts", "**/dist/**"],
    },
  },
});
