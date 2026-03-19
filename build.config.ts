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
  ViteBuildTypeEnum,
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

    // ── TanStack Start (SSR) ─────────────────────────────────────────────────
    // Full-stack SSR build using @tanstack/react-start + nitro.
    // `input` = srcDirectory for tanstackStart plugin (src/app-tanstack).
    // `output` = .output (Nitro outputs .output/server/index.mjs).
    {
      disabled: true,
      input: "src/app-tanstack",
      output: ".output",
      type: ViteBuildTypeEnum.TANSTACK_START,
      viteOptions: {
        // Map Next.js imports → TanStack equivalents.
        // Applied as resolve.alias so they work in both client and SSR module runner.
        moduleAliases: {
          "next/navigation":
            "src/packages/next-vibe-ui/tanstack/hooks/use-navigation.tsx",
          "next/link": "src/packages/next-vibe-ui/tanstack/ui/link.tsx",
          "next/image": "src/packages/next-vibe-ui/tanstack/ui/image.tsx",
          "next/script": "src/packages/next-vibe-ui/tanstack/ui/script.tsx",
          // server-only throws in Vite SSR (no Next.js boundaries) — stub it out
          "server-only":
            "src/packages/next-vibe-ui/tanstack/lib/server-only.ts",
          // next/headers — cookies()/headers() backed by TanStack getWebRequest()
          "next/headers": "src/packages/next-vibe-ui/tanstack/lib/headers.ts",
        },
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
