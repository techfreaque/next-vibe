/**
 * Build Configuration for @next-vibe/checker
 *
 * Produces a standalone `vibe-check` binary + npm package.
 *
 * The `manifest` field tells the builder to automatically:
 *  - Generate a scoped endpoint registry (only check + config create + help)
 *  - Inject package plugins (scoped-generated, widget-stub, native-stub, etc.)
 *  - Set VIBE_PACKAGE_NAME and VIBE_PACKAGE_DEFAULT_ENDPOINT defines
 *
 * Usage:
 *   vibe builder --configPath="src/vibe/tooling/check/build.config.ts"
 */

import { resolve } from "node:path";

import { createCliWidgetPlugin } from "next-vibe/platforms/cli/runtime/cli-widget-plugin-factory";
import type { BuildConfig } from "next-vibe/tooling/builder/definition";
import {
  BunBuildTypeEnum,
  BunTargetEnum,
  OutputFormatEnum,
  SourcemapModeEnum,
} from "next-vibe/tooling/builder/enum";

import manifest from "./package";

const config: BuildConfig = {
  manifest,

  foldersToClean: [".dist/checker/bin", ".dist/checker/oxlint-plugins"],

  filesToCompile: [
    // ── Main binary ──────────────────────────────────────────────────────────
    {
      input: "src/vibe/platforms/cli/package-runtime.ts",
      output: ".dist/checker/bin/vibe-check.js",
      type: BunBuildTypeEnum.EXECUTABLE,
      bunOptions: {
        target: BunTargetEnum.NODE,
        sourcemap: SourcemapModeEnum.EXTERNAL,
        banner: "#!/usr/bin/env node",
        // Apply web/ui → cli/ui redirects at bundle time (replaces runtime plugin import)
        plugins: [
          createCliWidgetPlugin(
            // build.config.ts lives in src/vibe/tooling/check/
            // 5 levels up → src/   (packages/next-vibe-ui lives under src/)
            resolve(import.meta.dir, "../../../../../"),
          ),
        ],
      },
    },

    // ── Oxlint JS plugins ────────────────────────────────────────────────────
    {
      input:
        "src/vibe/tooling/check/oxlint/plugins/restricted-syntax/src/index.ts",
      output: ".dist/checker/oxlint-plugins/restricted-syntax.js",
      type: BunBuildTypeEnum.MODULE,
      bunOptions: {
        target: BunTargetEnum.NODE,
        format: OutputFormatEnum.ESM,
        sourcemap: SourcemapModeEnum.NONE,
      },
    },
    {
      input:
        "src/vibe/tooling/check/oxlint/plugins/jsx-capitalization/src/index.ts",
      output: ".dist/checker/oxlint-plugins/jsx-capitalization.js",
      type: BunBuildTypeEnum.MODULE,
      bunOptions: {
        target: BunTargetEnum.NODE,
        format: OutputFormatEnum.ESM,
        sourcemap: SourcemapModeEnum.NONE,
      },
    },
    {
      input: "src/vibe/tooling/check/oxlint/plugins/i18n/src/index.ts",
      output: ".dist/checker/oxlint-plugins/i18n.js",
      type: BunBuildTypeEnum.MODULE,
      bunOptions: {
        target: BunTargetEnum.NODE,
        format: OutputFormatEnum.ESM,
        sourcemap: SourcemapModeEnum.NONE,
      },
    },
  ],

  filesOrFoldersToCopy: [
    {
      input: "src/vibe/tooling/check/README.md",
      output: ".dist/checker/README.md",
    },
    { input: "src/LICENSE", output: ".dist/checker/LICENSE" },
    { input: "check.config.ts", output: ".dist/checker/check.config.ts" },
    {
      input: "src/vibe/tooling/check/config/types.ts",
      output: ".dist/checker/system/tooling/check/config/types.ts",
    },
    {
      input: "src/vibe/tooling/check/oxlint/types.ts",
      output: ".dist/checker/system/tooling/check/oxlint/types.ts",
    },
    {
      input: "src/vibe/tooling/check/vibe-check/definition.ts",
      output: ".dist/checker/src/vibe-check/definition.ts",
    },
    {
      input: "src/vibe/tooling/check/vibe-check/repository.ts",
      output: ".dist/checker/src/vibe-check/repository.ts",
    },
    {
      input: "src/vibe/tooling/check/config/definition.ts",
      output: ".dist/checker/src/config/definition.ts",
    },
    {
      input: "src/vibe/tooling/check/config/types.ts",
      output: ".dist/checker/src/config/types.ts",
    },
  ],

  npmPackage: {
    outputDir: ".dist/checker",
    name: manifest.name,
    description: manifest.description,
    bin: { [manifest.bin ?? "vibe-check"]: "./bin/vibe-check.js" },
    files: [
      "bin/",
      "generated/",
      "oxlint-plugins/",
      "system/",
      "src/",
      "check.config.ts",
      "README.md",
      "LICENSE",
    ],
    exports: {
      "./system/tooling/check/config/types":
        "./system/tooling/check/config/types.ts",
      "./system/tooling/check/oxlint/types":
        "./system/tooling/check/oxlint/types.ts",
      "./oxlint-plugins/*": "./oxlint-plugins/*",
    },
    keywords: manifest.publish?.keywords,
    license: manifest.publish?.license,
    repository: manifest.publish?.repository,
    peerDependencies: {
      oxlint: ">=1.0.0",
      oxfmt: ">=0.40.0",
      "@typescript/native-preview": ">=7.0.0",
      eslint: ">=9.0.0",
      typescript: ">=5.0.0",
      "eslint-plugin-react-compiler": ">=19.0.0",
      "eslint-plugin-react-hooks": ">=5.0.0",
      "eslint-plugin-simple-import-sort": ">=12.0.0",
      "typescript-eslint": ">=8.0.0",
    },
    peerDependenciesMeta: {
      oxlint: { optional: true },
      oxfmt: { optional: true },
      "@typescript/native-preview": { optional: true },
      eslint: { optional: true },
      typescript: { optional: true },
      "eslint-plugin-react-compiler": { optional: true },
      "eslint-plugin-react-hooks": { optional: true },
      "eslint-plugin-simple-import-sort": { optional: true },
      "typescript-eslint": { optional: true },
    },
  },
};

export default config;
