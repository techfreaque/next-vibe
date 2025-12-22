/**
 * Build Configuration for next-vibe
 *
 * This config is used with `vibe builder` to build the CLI for npm distribution.
 * The root package.json is used for npm publishing (not generated).
 *
 * Usage:
 *   vibe builder                              # Uses default build.config.ts
 *   vibe builder --configPath="build.config.ts"  # Explicit config
 */

import {
  BunBuildTypeEnum,
  BunTargetEnum,
  SourcemapModeEnum,
} from "@/app/api/[locale]/system/builder/enum";
import type { BuildConfig } from "@/app/api/[locale]/system/builder/repository";

const config: BuildConfig = {
  // Folders to clean before building
  foldersToClean: [".dist"],

  // Build the CLI as an executable using Bun
  filesToCompile: [
    {
      input:
        "src/app/api/[locale]/system/unified-interface/cli/vibe-runtime.ts",
      output: ".dist/bin/vibe-runtime.js",
      type: BunBuildTypeEnum.EXECUTABLE,
      modulesToExternalize: [
        // React/Next.js should be peer dependencies
        "react",
        "react-dom",
        "next",
        // React Native / Expo for mobile builds
        "expo",
        "react-native",
        // Build tools that fail when bundled
        "vite",
        "@vitejs/plugin-react",
        "vite-plugin-css-injected-by-js",
        "vite-plugin-dts",
        "@tailwindcss/vite",
        "@tailwindcss/oxide",
        "tailwindcss",
        "rollup",
        "esbuild",
        "lightningcss",
      ],
      bunOptions: {
        target: BunTargetEnum.BUN,
        sourcemap: SourcemapModeEnum.EXTERNAL,
        // Note: Bun automatically adds #!/usr/bin/env bun when target is "bun"
      },
    },
  ],

  // Files or folders to copy after compilation
  filesOrFoldersToCopy: [
    { input: "README.md", output: ".dist/README.md" },
    { input: "src/app/api/[locale]/LICENSE", output: ".dist/LICENSE" },
  ],
};

export default config;
