/// <reference types="node" />
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

import useServerPlugin from "@c-ehrlich/eslint-plugin-use-server";
import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import type { Linter } from "eslint";
import importPlugin from "eslint-plugin-import";
import jsxA11y from "eslint-plugin-jsx-a11y";
import nodePlugin from "eslint-plugin-node";
import eslintPluginPrettier from "eslint-plugin-prettier";
import promisePlugin from "eslint-plugin-promise";
import reactPlugin from "eslint-plugin-react";
// import reactCompiler from "eslint-plugin-react-compiler";
import reactHooks from "eslint-plugin-react-hooks";
import simpleImportSort from "eslint-plugin-simple-import-sort";
import unusedImports from "eslint-plugin-unused-imports";
import globals from "globals";

// currently AI's don't like that, as it gets removed before they add the actual code
// has to be reevaluated over time as its pretty neat
const autoFixUnusedImports = false;

// Clean up browser globals to remove any weird whitespace:
function cleanGlobals(
  globalsObj: Record<string, boolean | "readonly" | "writable" | "off">,
): Record<string, boolean | "readonly" | "writable" | "off"> {
  return Object.fromEntries(
    Object.entries(globalsObj).map(([key, value]) => [key.trim(), value]),
  );
}

export function createEslintConfig(
  options: {
    projectRoot?: string;
    additionalIgnores?: string[];
    tsConfigPaths?: string[];
    reactVersion?: string;
    enableReactCompiler?: boolean;
    customRules?: Record<string, Linter.RuleEntry>;
    enableNext?: boolean;
    restrictUnknown?: boolean;
    restrictObject?: boolean;
    restrictThrow?: boolean;
  } = {},
): Linter.Config[] {
  const {
    projectRoot,
    additionalIgnores = [],
    tsConfigPaths = ["tsconfig.json"],
    reactVersion = "detect",
    enableReactCompiler = false,
    customRules = {},
    enableNext = false,
    restrictUnknown = true,
    restrictObject = true,
    restrictThrow = true,
  } = options;

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = projectRoot || dirname(__filename);

  // Resolve tsconfig paths relative to the project root
  const resolvedTsConfigPaths = tsConfigPaths.map((p) => resolve(__dirname, p));

  const compat = new FlatCompat({
    baseDirectory: __dirname,
  });

  const config = [
    // 1) Files/Folders to ignore
    {
      ignores: [
        "**/.dist/**",
        "**/.next/**",
        "**/.tmp/**",
        "**/postcss.config.mjs",
        "**/node_modules/**",
        "**/.git/**",
        "**/coverage/**",
        "**/public/**",
        "**/.vscode/**",
        "**/.github/**",
        "**/.claude/**",
        "**/postgres_data_/**",
        "**/bun.lock",
        "**/tsconfig.tsbuildinfo",
        "**/test-results/**",
        "**/playwright-report/**",
        "**/next-env.d.ts",
        ...additionalIgnores,
      ],
    },

    // Next.js specific config - Place this FIRST to avoid plugin conflicts
    ...(enableNext
      ? compat.config({
          extends: ["next/core-web-vitals"],
        })
      : []),

    // 2) Base configuration for TypeScript files
    {
      files: [
        "**/*.ts",
        "**/*.tsx",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
      ],

      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: "module",
          project: resolvedTsConfigPaths,
          tsconfigRootDir: __dirname,
          ecmaFeatures: { jsx: true },
        },
        globals: {
          ...globals.node,
          ...cleanGlobals(globals.browser),
          ...globals.webextensions,
          // Bun runtime globals
          Bun: "readonly",
        },
      },
      settings: {
        "import/parsers": {
          // eslint-disable-next-line i18next/no-literal-string
          "@typescript-eslint/parser": [".ts", ".tsx"],
        },
        "import/resolver": {
          node: {
            // eslint-disable-next-line i18next/no-literal-string
            extensions: [".ts", ".tsx", ".js", ".jsx"],
          },
          typescript: {
            alwaysTryTypes: true,
            project: resolvedTsConfigPaths,
          },
        },
        "react": { version: reactVersion },
      },

      plugins: {
        js,
        "@typescript-eslint": ts,
        "import": importPlugin,
        "prettier": eslintPluginPrettier,
        // "react-compiler": reactCompiler,
        "react-hooks": reactHooks,
        "simple-import-sort": simpleImportSort,
        "unused-imports": unusedImports,
        "node": nodePlugin,
        "react": reactPlugin,
        "jsx-a11y": jsxA11y,
        "promise": promisePlugin,
        "@c-ehrlich/use-server": useServerPlugin,
      },

      rules: {
        // ESLint base recommended rules
        ...js.configs.recommended.rules,
        // TypeScript recommended rules
        ...ts.configs.recommended.rules,
        ...ts.configs["recommended-requiring-type-checking"].rules,

        // TypeScript custom rules
        "@typescript-eslint/no-unused-vars": [
          "error",
          {
            // we don't do shit like that
            // argsIgnorePattern: "^_"
          },
        ],
        "@typescript-eslint/explicit-function-return-type": "error",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/consistent-type-imports": "error",
        "@typescript-eslint/no-unsafe-assignment": "error",
        "@typescript-eslint/restrict-template-expressions": "error",
        "@typescript-eslint/no-empty-function": [
          "error",
          { allow: ["arrowFunctions"] },
        ],
        "@typescript-eslint/ban-ts-comment": [
          "error",
          { "ts-ignore": "allow-with-description" },
        ],
        "@typescript-eslint/consistent-type-definitions": [
          "error",
          "interface",
        ],
        "@typescript-eslint/no-unnecessary-condition": "off",
        "@typescript-eslint/prefer-nullish-coalescing": "off",
        "@typescript-eslint/prefer-optional-chain": "error",
        "@typescript-eslint/strict-boolean-expressions": "off",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/return-await": ["error", "always"],
        "@typescript-eslint/no-floating-promises": [
          "error",
          { ignoreIIFE: true },
        ],
        "@typescript-eslint/no-for-in-array": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-misused-promises": [
          "error",
          { checksVoidReturn: false },
        ],
        "@typescript-eslint/prefer-includes": "error",
        "@typescript-eslint/prefer-string-starts-ends-with": "error",
        "@typescript-eslint/explicit-member-accessibility": [
          "error",
          { accessibility: "no-public" },
        ],

        // Insane Strict rules
        "@typescript-eslint/no-empty-object-type": "error",
        "@typescript-eslint/no-unsafe-function-type": "error",
        "@typescript-eslint/no-wrapper-object-types": "error",

        // Node
        "node/no-process-env": "error",

        // React Hooks
        "react-hooks/rules-of-hooks": "error",
        "react-hooks/exhaustive-deps": "error",

        // React specific rules
        "@c-ehrlich/use-server/no-top-level-use-server": "error",
        "react/jsx-key": "error",
        "react/jsx-no-duplicate-props": "error",
        "react/jsx-no-undef": "error",
        "react/jsx-uses-react": "error",
        "react/jsx-uses-vars": "error",
        "react/no-children-prop": "error",
        "react/no-deprecated": "error",
        "react/no-direct-mutation-state": "error",
        "react/no-unknown-property": "error",
        "react/self-closing-comp": "error",
        "react/react-in-jsx-scope": "off", // Next.js doesn't require React import

        // Accessibility
        "jsx-a11y/alt-text": "error",
        "jsx-a11y/aria-props": "error",
        "jsx-a11y/aria-role": "error",
        "jsx-a11y/anchor-has-content": "error",

        // Promise rules
        "promise/always-return": "error",
        "promise/no-return-wrap": "error",
        "promise/param-names": "error",
        "promise/catch-or-return": "error",
        "promise/no-nesting": "warn",

        // Other plugin rules
        "react-compiler/react-compiler": enableReactCompiler ? "error" : "off",
        "simple-import-sort/imports": "error",
        "simple-import-sort/exports": "error",

        "unused-imports/no-unused-imports": autoFixUnusedImports
          ? "error"
          : "off",
        "import/no-unresolved": "off", // Temporarily disabled due to module resolution issues
        "import/first": "error",
        "import/no-duplicates": "error",
        "import/extensions": ["error", "never", { json: "always" }],
        "import/namespace": "error",
        "import/no-restricted-paths": "error",

        // General code-quality rules
        "curly": "error",
        "eqeqeq": ["error", "always"],
        "import/newline-after-import": "error",
        "prefer-template": "error",
        "no-console": "error",
        "no-debugger": "error",
        "no-template-curly-in-string": "error",
        "no-unsafe-optional-chaining": "error",
        "require-atomic-updates": "warn",
        "array-callback-return": "error",
        "no-constructor-return": "error",
        "no-promise-executor-return": "error",
        "no-self-compare": "error",
        "no-unreachable-loop": "error",
        "no-unused-private-class-members": "error",
        "camelcase": ["error", { properties: "never" }],

        // force relative imports
        "no-restricted-imports": [
          "error",
          {
            patterns: ["^(?!\\./|\\.\\./)"],
          },
        ],

        // Prettier code style integration
        "prettier/prettier": [
          "error",
          {
            plugins: ["prettier-plugin-sort-json"],
            jsonRecursiveSort: true,
            printWidth: 80,
            tabWidth: 2,
            useTabs: false,
            semi: true,
            singleQuote: false,
            trailingComma: "all",
            bracketSpacing: true,
            arrowParens: "always",
            endOfLine: "lf",
            jsxSingleQuote: false,
            proseWrap: "preserve",
            quoteProps: "consistent",
          },
        ],

        // Apply custom rules
        ...customRules,
      },
    },

    // 3) Configuration for plain JavaScript files
    {
      files: ["**/*.js", "**/*.jsx"],
      languageOptions: {
        ecmaVersion: 2021,
        sourceType: "module",
        globals: {
          ...globals.node,
          ...cleanGlobals(globals.browser),
          ...globals.webextensions,
          // Bun runtime globals
          Bun: "readonly",
        },
      },
    },

    // 2.1) Additional config for restricted syntax
    {
      files: [
        "**/*.ts",
        "**/*.tsx",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.test.tsx",
        "**/*.spec.ts",
        "**/*.spec.tsx",
      ],
      ignores: ["**/seeds.ts"],
      languageOptions: {
        parser: tsParser,
        parserOptions: {
          ecmaVersion: 2021,
          sourceType: "module",
          project: resolvedTsConfigPaths,
          tsconfigRootDir: __dirname,
          ecmaFeatures: { jsx: true },
        },
      },
      rules: {
        "no-restricted-syntax": [
          "error",
          ...(restrictUnknown
            ? [
                {
                  // eslint-disable-next-line i18next/no-literal-string
                  selector: "TSUnknownKeyword",
                  message:
                    // eslint-disable-next-line i18next/no-literal-string
                    "Usage of the 'unknown' type isn't allowed. Consider using generics with interface or type alias for explicit structure.",
                },
              ]
            : []),
          ...(restrictObject
            ? [
                {
                  // eslint-disable-next-line i18next/no-literal-string
                  selector: "TSObjectKeyword",
                  message:
                    // eslint-disable-next-line i18next/no-literal-string
                    "Usage of the 'object' type isn't allowed. Consider using generics with interface or type alias for explicit structure.",
                },
              ]
            : []),
          ...(restrictThrow
            ? [
                {
                  // eslint-disable-next-line i18next/no-literal-string
                  selector: "ThrowStatement",
                  message:
                    // eslint-disable-next-line i18next/no-literal-string
                    "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead.",
                },
              ]
            : []),
        ],
      },
    },
  ];

  return config as Linter.Config[];
}

// Export default config with no specific project root
export default createEslintConfig();
