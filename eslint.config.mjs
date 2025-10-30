/**
 * ESLint Configuration
 *
 * Minimal ESLint setup for rules not yet supported by oxlint:
 * - Import sorting (simple-import-sort)
 * - React Hooks rules (react-hooks)
 * - React compiler checks (react-compiler)
 * - Use server directive validation (@c-ehrlich/use-server)
 * - Import validation with TypeScript resolution (import plugin)
 *
 * All other rules are handled by oxlint (including i18n and restricted-syntax via JS plugins).
 * Configuration source: lint.config.ts
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";
import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import promisePlugin from "eslint-plugin-promise";
import importPlugin from "eslint-plugin-import";
import useServerPlugin from "@c-ehrlich/eslint-plugin-use-server";
import globals from "globals";

import { eslintConfig as sharedConfig } from "./lint.config.ts";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Clean up browser globals to remove any weird whitespace
function cleanGlobals(globalsObj) {
  return Object.fromEntries(
    Object.entries(globalsObj).map(([key, value]) => [key.trim(), value]),
  );
}

const config = [
  // ============================================================
  // Ignores
  // ============================================================
  {
    ignores: sharedConfig.ignores,
  },

  // ============================================================
  // ESLint Rules
  // ============================================================
  {
    files: sharedConfig.files,
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: [resolve(__dirname, sharedConfig.parserOptions.project)],
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.node,
        ...cleanGlobals(globals.browser),
        ...globals.webextensions,
      },
    },
    settings: {
      "import/parsers": {
        "@typescript-eslint/parser": [".ts", ".tsx"],
      },
      "import/resolver": {
        typescript: {
          project: resolve(__dirname, sharedConfig.parserOptions.project),
          alwaysTryTypes: true,
        },
        node: { extensions: [".ts", ".tsx", ".js", ".jsx"] },
      },
      react: { version: "detect" },
    },
    plugins: {
      "@typescript-eslint": ts,
      "react-compiler": reactCompiler,
      "react-hooks": reactHooks,
      "simple-import-sort": simpleImportSort,
      "unused-imports": unusedImports,
      promise: promisePlugin,
      import: importPlugin,
      "@c-ehrlich/use-server": useServerPlugin,
    },
    rules: {
      ...sharedConfig.eslintOnlyRules,
      ...sharedConfig.ruleOverrides.typescript,
      ...sharedConfig.ruleOverrides.promise,
      ...sharedConfig.ruleOverrides.import,
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
  },
];

export default config;
