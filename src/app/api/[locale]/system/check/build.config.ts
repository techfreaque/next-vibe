/**
 * Build Configuration for @next-vibe/checker
 *
 * Produces a standalone `vibe-check` binary + npm package.
 *
 * The `manifest` field tells the builder to automatically:
 *  - Generate a scoped endpoint registry (only check + config/create + help)
 *  - Inject package plugins (scoped-generated, widget-stub, native-stub, etc.)
 *  - Set VIBE_PACKAGE_NAME and VIBE_PACKAGE_DEFAULT_ENDPOINT defines
 *
 * Usage:
 *   vibe builder --configPath="src/app/api/[locale]/system/check/build.config.ts"
 */

import {
  BunBuildTypeEnum,
  BunTargetEnum,
  OutputFormatEnum,
  SourcemapModeEnum,
} from "@/app/api/[locale]/system/builder/enum";
import type { BuildConfig } from "@/app/api/[locale]/system/builder/repository";

import manifest from "./package";

const config: BuildConfig = {
  manifest,

  foldersToClean: [".dist/checker/bin", ".dist/checker/oxlint-plugins"],

  filesToCompile: [
    // ── Main binary ──────────────────────────────────────────────────────────
    {
      input:
        "src/app/api/[locale]/system/unified-interface/cli/package-runtime.ts",
      output: ".dist/checker/bin/vibe-check.js",
      type: BunBuildTypeEnum.EXECUTABLE,
      bunOptions: {
        target: BunTargetEnum.BUN,
        sourcemap: SourcemapModeEnum.EXTERNAL,
      },
    },

    // ── Oxlint JS plugins ────────────────────────────────────────────────────
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/restricted-syntax/src/index.ts",
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
        "src/app/api/[locale]/system/check/oxlint/plugins/jsx-capitalization/src/index.ts",
      output: ".dist/checker/oxlint-plugins/jsx-capitalization.js",
      type: BunBuildTypeEnum.MODULE,
      bunOptions: {
        target: BunTargetEnum.NODE,
        format: OutputFormatEnum.ESM,
        sourcemap: SourcemapModeEnum.NONE,
      },
    },
    {
      input:
        "src/app/api/[locale]/system/check/oxlint/plugins/i18n/src/index.ts",
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
      input: "src/app/api/[locale]/system/check/README.md",
      output: ".dist/checker/README.md",
    },
    { input: "src/app/api/[locale]/LICENSE", output: ".dist/checker/LICENSE" },
    { input: "check.config.ts", output: ".dist/checker/check.config.ts" },
    {
      input: "src/app/api/[locale]/system/check/config/types.ts",
      output: ".dist/checker/system/check/config/types.ts",
    },
    {
      input: "src/app/api/[locale]/system/check/oxlint/types.ts",
      output: ".dist/checker/system/check/oxlint/types.ts",
    },
    {
      input: "src/app/api/[locale]/system/check/vibe-check/definition.ts",
      output: ".dist/checker/src/vibe-check/definition.ts",
    },
    {
      input: "src/app/api/[locale]/system/check/vibe-check/repository.ts",
      output: ".dist/checker/src/vibe-check/repository.ts",
    },
    {
      input: "src/app/api/[locale]/system/check/config/create/definition.ts",
      output: ".dist/checker/src/config/create/definition.ts",
    },
    {
      input: "src/app/api/[locale]/system/check/config/types.ts",
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
      "./system/check/config/types": "./system/check/config/types.ts",
      "./system/check/oxlint/types": "./system/check/oxlint/types.ts",
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
  },
};

export default config;
