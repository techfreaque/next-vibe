import path from "node:path";

import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [tsconfigPaths({ ignoreConfigErrors: true }), ...react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
      "next-vibe": path.resolve(__dirname, "./src/app/api/[locale]/v1/core"),
      "next-vibe-ui": path.resolve(
        __dirname,
        "./src/packages/next-vibe-ui/web",
      ),
    },
  },
  test: {
    environment: "jsdom",
    globals: true,
    setupFiles: ["./src/__tests__/setup.ts"],
    include: ["./src/**/*.{test,spec}.{ts,tsx}"],
    exclude: ["**/node_modules/**", "**/dist/**", "**/to_migrate/**"],
    coverage: {
      reporter: ["text", "json", "html"],
      exclude: ["node_modules/", ".dist/", "to_migrate/"],
    },
  },
});
