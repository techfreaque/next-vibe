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

import { GITHUB_REPO_URL } from "@/env/constants";

import type { PackageManifest } from "../builder/repository/vibe-package/types";
import { CHECK_CONFIG_CREATE_ALIAS } from "./config/constants";
import { VIBE_CHECK_ALIAS } from "./constants";

const manifest: PackageManifest = {
  name: "@next-vibe/checker",
  description:
    "Fast parallel code quality: oxlint + oxfmt + tsgo + ESLint in one command. MCP server enforces correct agent usage.",
  version: "source",

  endpoints: [VIBE_CHECK_ALIAS, CHECK_CONFIG_CREATE_ALIAS],

  defaultEndpoint: VIBE_CHECK_ALIAS,

  exports: {
    // Library exports - importable from the package
    ".": "src/vibe/tooling/check/vibe-check/repository.ts",
    "./oxlint": "src/vibe/tooling/check/oxlint/repository.ts",
    "./lint": "src/vibe/tooling/check/lint/repository.ts",
    "./typecheck": "src/vibe/tooling/check/typecheck/repository.ts",
    // Types used by check.config.ts (imported as @next-vibe/checker/tooling/check/config/types)
    "./tooling/check/config/types": "src/vibe/tooling/check/config/types.ts",
    // Custom oxlint JS plugins - referenced in check.config.ts jsPlugins array
    "./oxlint-plugins/restricted-syntax":
      "src/vibe/tooling/check/oxlint/plugins/restricted-syntax/src/index.ts",
    "./oxlint-plugins/jsx-capitalization":
      "src/vibe/tooling/check/oxlint/plugins/jsx-capitalization/src/index.ts",
    "./oxlint-plugins/i18n":
      "src/vibe/tooling/check/oxlint/plugins/i18n/src/index.ts",
    "./oxlint-plugins/boilerplate":
      "src/vibe/tooling/check/oxlint/plugins/boilerplate/src/index.ts",
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
      url: GITHUB_REPO_URL,
    },
    license: "MIT",
  },
};

export default manifest;
