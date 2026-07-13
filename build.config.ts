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
} from "next-vibe/tooling/builder/enum";
import type { BuildConfig } from "next-vibe/tooling/builder/repository";

// ssh2's native cpu-features.node binding can never be bundled into JS output -
// same reason next.config.ts's serverExternalPackages excludes it for webpack.
// Any Bun.build() target that transitively reaches ssh2 (vibe-runtime.ts for
// real; the oxlint plugins via their check.config.ts dynamic require, which
// pulls in a large swath of the codebase) must externalize it too, or the
// build fails trying to resolve the .node file as a JS module.
const NATIVE_BINDING_EXTERNALS = ["ssh2", "cpu-features"];

const config: BuildConfig = {
  // Sequential, not parallel. Evidence: two separate Docker (Linux) builds, same
  // config, same ssh2/cpu-features externals fix applied - one run failed on
  // .dist/oxlint-plugins/i18n.js, the next on jsx-capitalization.js instead, with
  // no error text surviving to the log either time. Different file each run
  // despite identical inputs is the signature of a genuine race in concurrent
  // in-process Bun.build() calls, not a per-file config gap - each file builds
  // reliably alone or as a separate OS process. Sequential compilation removes
  // the race entirely; the cost is a few extra seconds across 7 small/medium files.
  parallel: false,

  // Folders to clean before building
  foldersToClean: [".dist"],

  // Build the CLI as an executable using Bun
  filesToCompile: [
    {
      input: "src/vibe/platforms/cli/vibe-runtime.ts",
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
        ...NATIVE_BINDING_EXTERNALS,
      ],
      bunOptions: {
        target: BunTargetEnum.BUN,
        sourcemap: SourcemapModeEnum.EXTERNAL,
        // Note: Bun automatically adds #!/usr/bin/env bun when target is "bun"
      },
    },
    {
      input:
        "src/vibe/tooling/check/oxlint/plugins/restricted-syntax/src/index.ts",
      output: ".dist/oxlint-plugins/restricted-syntax.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: NATIVE_BINDING_EXTERNALS,
      bunOptions: {
        target: BunTargetEnum.NODE,
        sourcemap: SourcemapModeEnum.NONE,
        format: OutputFormatEnum.ESM,
        minify: false,
        external: NATIVE_BINDING_EXTERNALS,
      },
    },
    {
      input:
        "src/vibe/tooling/check/oxlint/plugins/jsx-capitalization/src/index.ts",
      output: ".dist/oxlint-plugins/jsx-capitalization.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: NATIVE_BINDING_EXTERNALS,
      bunOptions: {
        target: BunTargetEnum.NODE,
        sourcemap: SourcemapModeEnum.NONE,
        format: OutputFormatEnum.ESM,
        minify: false,
      },
    },
    {
      input: "src/vibe/tooling/check/oxlint/plugins/i18n/src/index.ts",
      output: ".dist/oxlint-plugins/i18n.js",
      type: BunBuildTypeEnum.MODULE,
      modulesToExternalize: NATIVE_BINDING_EXTERNALS,
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
      input: "src/vibe/platforms/vibe-frame/embed.ts",
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
    // Library entry - no auto-init, no window exposure, full type exports.
    {
      input: "src/vibe/platforms/vibe-frame/embed-package.ts",
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
      input: "src/vibe/platforms/vibe-frame/inside-bridge.ts",
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
    // `input` = srcDirectory for tanstackStart plugin (src/generated/app-tanstack).
    // `output` = .dist-tanstack (Nitro outputs .dist-tanstack/server/index.mjs).
    {
      disabled: true,
      input: "src/generated/app-tanstack",
      output: ".dist-tanstack",
      type: ViteBuildTypeEnum.TANSTACK_START,
      viteOptions: {
        // Map Next.js imports → TanStack equivalents.
        // Applied as resolve.alias so they work in both client and SSR module runner.
        moduleAliases: {
          // server-only throws in Vite SSR (no Next.js boundaries) - stub it out
          "server-only": "src/vibe/ui/tanstack/lib/server-only.ts",
        },
      },
    },
  ],

  // Files or folders to copy after compilation
  filesOrFoldersToCopy: [
    { input: "README.md", output: ".dist/README.md" },
    { input: "src/LICENSE", output: ".dist/LICENSE" },
  ],
};

export default config;
