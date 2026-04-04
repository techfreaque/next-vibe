/**
 * @next-vibe/checker - Package Manifest
 *
 * Standalone code quality checker package built from the next-vibe monorepo.
 * Exposes `vibe-check` CLI command and MCP tool with the same UX as
 * `vibe check` in the full platform.
 *
 * Public surface:
 *   CLI:  vibe-check [paths...] [--fix] [--timeout=N]
 *         vibe-check config    (create check.config.ts)
 *         vibe-check --help
 *         vibe-check --interactive
 *   MCP:  system_check_vibe-check_POST
 *         system_check_config_create_POST
 *
 * Library exports:
 *   import { VibeCheckRepository } from "@next-vibe/checker"
 *   import { OxlintRepository }    from "@next-vibe/checker/oxlint"
 *   import { EslintRepository }    from "@next-vibe/checker/lint"
 *   import { TypecheckRepository } from "@next-vibe/checker/typecheck"
 */

import type { PackageManifest } from "../packages/types";
import { CHECK_CONFIG_CREATE_ALIAS } from "./config/create/constants";
import { VIBE_CHECK_ALIAS } from "./vibe-check/constants";

const manifest: PackageManifest = {
  name: "@next-vibe/checker",
  description:
    "Fast parallel code quality: oxlint + oxfmt + tsgo + ESLint in one command. MCP server enforces correct agent usage.",
  version: "source",

  endpoints: [VIBE_CHECK_ALIAS, CHECK_CONFIG_CREATE_ALIAS],

  defaultEndpoint: VIBE_CHECK_ALIAS,

  exports: {
    // Library exports - importable from the package
    ".": "src/app/api/[locale]/system/check/vibe-check/repository.ts",
    "./oxlint": "src/app/api/[locale]/system/check/oxlint/repository.ts",
    "./lint": "src/app/api/[locale]/system/check/lint/repository.ts",
    "./typecheck": "src/app/api/[locale]/system/check/typecheck/repository.ts",
    // Types used by check.config.ts (imported as @next-vibe/checker/system/check/config/types)
    "./system/check/config/types":
      "src/app/api/[locale]/system/check/config/types.ts",
    // Custom oxlint JS plugins - referenced in check.config.ts jsPlugins array
    "./oxlint-plugins/restricted-syntax":
      "src/app/api/[locale]/system/check/oxlint/plugins/restricted-syntax/src/index.ts",
    "./oxlint-plugins/jsx-capitalization":
      "src/app/api/[locale]/system/check/oxlint/plugins/jsx-capitalization/src/index.ts",
    "./oxlint-plugins/i18n":
      "src/app/api/[locale]/system/check/oxlint/plugins/i18n/src/index.ts",
  },

  platforms: ["cli", "mcp"],

  bin: "vibe-check",

  publish: {
    access: "public",
    keywords: [
      "next-vibe",
      "code-quality",
      "linting",
      "oxlint",
      "eslint",
      "typescript",
      "vibe-check",
    ],
    repository: {
      type: "git",
      url: "https://github.com/techfreaque/next-vibe",
    },
    license: "MIT",
  },
};

export default manifest;
