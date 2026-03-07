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
  OutputFormatEnum,
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
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/restricted-syntax/src/index.ts",
      output: ".dist/oxlint-plugins/restricted-syntax.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: [],
      bunOptions: {
        target: BunTargetEnum.NODE,
        sourcemap: SourcemapModeEnum.NONE,
        format: OutputFormatEnum.ESM,
        minify: false,
        external: [],
      },
    },
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/jsx-capitalization/src/index.ts",
      output: ".dist/oxlint-plugins/jsx-capitalization.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: [],
      bunOptions: {
        target: BunTargetEnum.NODE,
        sourcemap: SourcemapModeEnum.NONE,
        format: OutputFormatEnum.ESM,
        minify: false,
      },
    },
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/i18n/src/index.ts",
      output: ".dist/oxlint-plugins/i18n.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: [],
      bunOptions: {
        target: BunTargetEnum.NODE,
        sourcemap: SourcemapModeEnum.NONE,
        format: OutputFormatEnum.ESM,
        minify: false,
      },
    },
    // ── Vibe Frame: browser IIFE (script tag) ───────────────────────────────
    // Exposes window.VibeFrame for <script src="/vibe-frame/vibe-frame.js"> usage.
    {
      input:
        "src/app/api/[locale]/system/unified-interface/vibe-frame/embed.ts",
      output: "public/vibe-frame/vibe-frame.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: [],
      bunOptions: {
        target: BunTargetEnum.BROWSER,
        sourcemap: SourcemapModeEnum.EXTERNAL,
        format: OutputFormatEnum.IIFE,
        minify: true,
      },
    },
    // ── Vibe Frame: ESM package (npm / bundler import) ───────────────────────
    // Library entry — no auto-init, no window exposure, full type exports.
    {
      input:
        "src/app/api/[locale]/system/unified-interface/vibe-frame/embed-package.ts",
      output: "public/vibe-frame/vibe-frame.esm.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: [],
      bunOptions: {
        target: BunTargetEnum.BROWSER,
        sourcemap: SourcemapModeEnum.EXTERNAL,
        format: OutputFormatEnum.ESM,
        minify: false,
      },
    },
    // ── Vibe Frame: inside-bridge (loaded inside iframes) ───────────────────
    // Provides window.bridgeCall for widget code to call privileged parent APIs.
    {
      input:
        "src/app/api/[locale]/system/unified-interface/vibe-frame/inside-bridge.ts",
      output: "public/vibe-frame/vibe-frame-inside-bridge.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: [],
      bunOptions: {
        target: BunTargetEnum.BROWSER,
        sourcemap: SourcemapModeEnum.EXTERNAL,
        format: OutputFormatEnum.IIFE,
        minify: true,
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
