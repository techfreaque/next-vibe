/* eslint-disable i18next/no-literal-string */
import { resolve } from "node:path";

import { defineConfig } from "vite";

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, "index.ts"),
      name: "vibe-guard",
      fileName: "index",
      formats: ["es"],
    },
    outDir: ".dist",
    target: "node18",
    minify: false,
    sourcemap: true,
    rollupOptions: {
      external: ["commander", "chalk", "child_process", "fs", "path", "module"],
      output: {
        format: "es",
        banner: "#!/usr/bin/env node",
      },
    },
    emptyOutDir: true,
  },
  resolve: {
    extensions: [".ts", ".js"],
  },
});
