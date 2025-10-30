/**
 * ESLint Configuration (Wrapper)
 *
 * This file wraps the unified lint.config.ts configuration for ESLint compatibility.
 * ESLint handles only what oxlint doesn't support:
 * - i18n checking (eslint-plugin-i18next)
 * - Custom AST rules (no-restricted-syntax)
 * - Additional TypeScript type-aware rules
 *
 * Main linting is handled by oxlint for performance.
 */

import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import tsParser from "@typescript-eslint/parser";
import ts from "@typescript-eslint/eslint-plugin";
import i18next from "eslint-plugin-i18next";
import reactCompiler from "eslint-plugin-react-compiler";
import promisePlugin from "eslint-plugin-promise";
import importPlugin from "eslint-plugin-import";
import useServerPlugin from "@c-ehrlich/eslint-plugin-use-server";
import globals from "globals";

// Import unified configuration
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
  // Ignores (shared with oxlint)
  // ============================================================
  {
    ignores: sharedConfig.ignores,
  },

  // ============================================================
  // i18n Configuration (only if enabled)
  // ============================================================
  ...(sharedConfig.i18n.enabled
    ? [
        {
          files: sharedConfig.i18n.config.files,
          ignores: sharedConfig.i18n.config.ignores,
          plugins: { i18next },
          languageOptions: {
            parser: tsParser,
            ecmaVersion: 2022,
            sourceType: "module",
            parserOptions: {
              ecmaFeatures: {
                jsx: true,
              },
            },
            globals: {
              ...cleanGlobals(globals.browser),
              ...cleanGlobals(globals.node),
              ...cleanGlobals(globals.es2021),
              JSX: "readonly",
            },
          },
          settings: {
            react: {
              version: "detect",
            },
          },
          rules: sharedConfig.i18n.config.rules,
        },
      ]
    : []),

  // ============================================================
  // TypeScript Configuration (custom rules not in oxlint)
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
      promise: promisePlugin,
      import: importPlugin,
      "@c-ehrlich/use-server": useServerPlugin,
    },
    rules: {
      ...sharedConfig.ruleOverrides.typescript,
      ...sharedConfig.ruleOverrides.promise,
      ...sharedConfig.ruleOverrides.import,
      ...sharedConfig.ruleOverrides.react,
      ...sharedConfig.ruleOverrides.custom,
    },
  },

  // ============================================================
  // Custom AST Rules (no-restricted-syntax)
  // ============================================================
  {
    files: sharedConfig.files,
    ignores: ["**/seeds.ts"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        project: [resolve(__dirname, sharedConfig.parserOptions.project)],
        tsconfigRootDir: __dirname,
        ecmaFeatures: { jsx: true },
      },
    },
    rules: sharedConfig.customRules,
  },
];

export default config;
