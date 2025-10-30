/* eslint-disable i18next/no-literal-string */
/**
 * Unified Lint Configuration (Oxlint + ESLint + Prettier)
 *
 * This file provides a single source of truth for all linting and formatting configuration.
 * It supports both oxlint (fast Rust linter) and ESLint (for features oxlint doesn't support).
 *
 * Division of Responsibilities:
 * - Oxlint: Handles JS/TS/TSX files for fast linting (core rules, TypeScript, React, etc.)
 * - ESLint: Handles i18n checking and custom AST rules that oxlint doesn't support
 * - Prettier: Handles code formatting
 */

import type {
  EslintConfig,
  OxlintConfig,
  OxlintPrettierEslintConfig,
  PrettierConfig,
} from "./src/app/api/[locale]/v1/core/system/check/oxlint/types";

// ============================================================
// Configuration Switches
// ============================================================

const enableI18n = true;
const enableReactRules = true;
const enableAccessibilityRules = true;
const enableImportRules = false; // Disabled in oxlint due to bugs with export * re-exports, ESLint handles import checking
const enablePromiseRules = true;
const enableNodeRules = true;
const enablePedanticRules = false; // Set to false to reduce noise

// ============================================================
// Oxlint Configuration (Fast Rust Linter)
// Handles: JS/TS/TSX files for core linting
// ============================================================

export const oxlintConfig: OxlintConfig = {
  $schema: "https://docs.rs/oxc_linter/latest/oxc_linter/schema.json",

  plugins: [
    "typescript",
    "oxc",
    "unicorn",
    ...(enableImportRules ? ["import"] : []),
    ...(enableReactRules ? ["react"] : []),
    ...(enableAccessibilityRules ? ["jsx-a11y"] : []),
    ...(enablePromiseRules ? ["promise"] : []),
    ...(enableNodeRules ? ["node"] : []),
    "nextjs",
  ],

  categories: {
    correctness: "error",
    suspicious: "error",
    pedantic: enablePedanticRules ? "error" : "off",
    style: "off", // Disabled for prettier compatibility
  },

  rules: {
    // ========================================
    // Core ESLint Rules
    // ========================================
    "no-debugger": "error",
    "no-console": "error",
    "curly": "error",
    "eqeqeq": "error",
    "no-undef": "off", // TypeScript handles this
    "camelcase": "error",
    "no-template-curly-in-string": "error",
    "no-unsafe-optional-chaining": "error",
    "array-callback-return": "error",
    "no-constructor-return": "error",
    "no-self-compare": "error",
    "no-unreachable-loop": "error",
    "no-unused-private-class-members": "error",
    "prefer-template": "error",
    "require-atomic-updates": "warn",
    "no-promise-executor-return": "error",

    // ========================================
    // TypeScript Rules
    // ========================================
    "typescript/no-explicit-any": "error",
    "typescript/no-unused-vars": "error",
    "typescript/no-inferrable-types": "error",
    "typescript/consistent-type-imports": "error",
    "typescript/no-empty-function": "error",
    "typescript/ban-ts-comment": "error",
    "typescript/consistent-type-definitions": "error",
    "typescript/no-empty-object-type": "error",
    "typescript/no-unsafe-function-type": "error",
    "typescript/no-wrapper-object-types": "error",
    "typescript/no-duplicate-enum-values": "error",
    "typescript/no-extra-non-null-assertion": "error",

    // Type-aware rules
    "typescript/await-thenable": "error",
    "typescript/no-floating-promises": "error",
    "typescript/no-for-in-array": "error",
    "typescript/no-misused-promises": "error",
    "typescript/no-unsafe-assignment": "error",
    "typescript/no-unnecessary-type-assertion": "error",
    "typescript/explicit-function-return-type": "error",
    "typescript/restrict-template-expressions": "error",

    // ========================================
    // React Rules
    // ========================================
    ...(enableReactRules && {
      "react/jsx-key": "error",
      "react/jsx-no-duplicate-props": "error",
      "react/jsx-no-undef": "error",
      "react/jsx-uses-react": "off", // Next.js doesn't need React import
      "react/jsx-uses-vars": "error",
      "react/no-children-prop": "error",
      "react/no-deprecated": "error",
      "react/no-direct-mutation-state": "error",
      "react/no-unknown-property": "error",
      "react/self-closing-comp": "error",
      "react/react-in-jsx-scope": "off", // Next.js auto-imports React

      // React Hooks
      "react/rules-of-hooks": "error",
      "react/exhaustive-deps": "error",
    }),

    // ========================================
    // Accessibility Rules (jsx-a11y)
    // ========================================
    ...(enableAccessibilityRules && {
      "jsx-a11y/alt-text": "error",
      "jsx-a11y/aria-props": "error",
      "jsx-a11y/aria-role": "error",
      "jsx-a11y/anchor-has-content": "error",
      "jsx-a11y/aria-proptypes": "error",
      "jsx-a11y/aria-unsupported-elements": "error",
      "jsx-a11y/click-events-have-key-events": "error",
      "jsx-a11y/heading-has-content": "error",
      "jsx-a11y/html-has-lang": "error",
      "jsx-a11y/iframe-has-title": "error",
      "jsx-a11y/img-redundant-alt": "error",
      "jsx-a11y/no-access-key": "error",
      "jsx-a11y/no-autofocus": "error",
      "jsx-a11y/no-distracting-elements": "error",
      "jsx-a11y/no-redundant-roles": "error",
      "jsx-a11y/role-has-required-aria-props": "error",
      "jsx-a11y/role-supports-aria-props": "error",
      "jsx-a11y/scope": "error",
      "jsx-a11y/tabindex-no-positive": "error",
    }),

    // ========================================
    // Import Rules
    // ========================================
    ...(enableImportRules ? {
      "import/no-duplicates": "error",
      "import/first": "error",
      "import/newline-after-import": "error",
      "import/namespace": "error",
      "import/no-unresolved": "error",
      "import/no-restricted-paths": "error",
      "import/no-default-export": "off",
      "import/extensions": "off",
      "import/no-unassigned-import": [
        "error",
        {
          allow: ["server-only", "**/*.css", "**/*.scss"],
        },
      ],
    }: {}),

    // ========================================
    // Promise Rules
    // ========================================
    ...(enablePromiseRules && {
      "promise/param-names": "error",
      "promise/always-return": "error",
      "promise/catch-or-return": "error",
    }),

    // ========================================
    // Node Rules
    // ========================================
    ...(enableNodeRules && {
      "node/no-missing-import": "off", // TypeScript handles this
      "node/no-unsupported-features/es-syntax": "off",
    }),

    // ========================================
    // Unicorn Rules
    // ========================================
    "unicorn/prefer-string-starts-ends-with": "error",
    "unicorn/no-empty-file": "error",
    "unicorn/no-unnecessary-await": "error",
    "unicorn/no-useless-spread": "error",
    "unicorn/prefer-set-size": "error",
    "unicorn/no-await-in-promise-methods": "error",
    "unicorn/no-invalid-fetch-options": "error",
    "unicorn/no-invalid-remove-event-listener": "error",
    "unicorn/no-new-array": "error",
    "unicorn/no-single-promise-in-promise-methods": "error",
    "unicorn/no-thenable": "error",
    "unicorn/no-useless-fallback-in-spread": "off",
    "unicorn/no-useless-length-check": "error",
    "unicorn/prefer-array-flat": "error",
    "unicorn/prefer-array-flat-map": "error",
    "unicorn/prefer-includes": "error",
    "unicorn/prefer-modern-dom-apis": "error",
    "unicorn/prefer-node-protocol": "error",
    "unicorn/prefer-spread": "error",

    // ========================================
    // OXC Unique Rules
    // ========================================
    "oxc/no-optional-chaining": "off", // We use optional chaining
    "oxc/missing-throw": "error",
    "oxc/number-arg-out-of-range": "error",
    "oxc/only-used-in-recursion": "error",
    "oxc/bad-array-method-on-arguments": "error",
    "oxc/bad-comparison-sequence": "error",
    "oxc/const-comparisons": "error",
    "oxc/double-comparisons": "error",
    "oxc/erasing-op": "error",
    "oxc/bad-char-at-comparison": "error",
    "oxc/bad-min-max-func": "error",
    "oxc/bad-object-literal-comparison": "error",
    "oxc/bad-replace-all-arg": "error",
    "oxc/uninvoked-array-callback": "error",

    // ========================================
    // Next.js Rules
    // ========================================
    "nextjs/google-font-display": "error",
    "nextjs/google-font-preconnect": "error",
    "nextjs/inline-script-id": "error",
    "nextjs/next-script-for-ga": "error",
    "nextjs/no-assign-module-variable": "error",
    "nextjs/no-before-interactive-script-outside-document": "error",
    "nextjs/no-css-tags": "error",
    "nextjs/no-document-import-in-page": "error",
    "nextjs/no-duplicate-head": "error",
    "nextjs/no-head-element": "error",
    "nextjs/no-head-import-in-document": "error",
    "nextjs/no-html-link-for-pages": "error",
    "nextjs/no-img-element": "warn",
    "nextjs/no-page-custom-font": "error",
    "nextjs/no-script-component-in-head": "error",
    "nextjs/no-styled-jsx-in-document": "error",
    "nextjs/no-sync-scripts": "error",
    "nextjs/no-title-in-document-head": "error",
    "nextjs/no-typos": "error",
    "nextjs/no-unwanted-polyfillio": "error",
  },

  settings: {
    "jsx-a11y": {
      polymorphicPropName: null,
      components: {},
      attributes: {},
    },
    "next": {
      rootDir: ["."],
    },
    "react": {
      formComponents: [],
      linkComponents: [],
    },
    "jsdoc": {
      ignorePrivate: false,
      ignoreInternal: false,
      ignoreReplacesDocs: true,
      overrideReplacesDocs: true,
      augmentsExtendsReplacesDocs: false,
      implementsReplacesDocs: false,
      exemptDestructuredRootsFromChecks: false,
      tagNamePreference: {},
    },
  },

  env: {
    builtin: true,
  },

  globals: {
    React: "readonly",
    JSX: "readonly",
    NodeJS: "readonly",
    __dirname: "readonly",
    __filename: "readonly",
    process: "readonly",
    global: "readonly",
  },

  ignorePatterns: [
    ".dist",
    ".next",
    ".tmp",
    "postcss.config.mjs",
    "node_modules",
    ".git",
    "coverage",
    "public",
    "drizzle",
    ".vscode",
    ".vibe-guard-instance",
    ".github",
    ".claude",
    "to_migrate",
    "postgres_data",
    ".nyc_output",
    "build",
    "*.min.js",
  ],
};

// ============================================================
// ESLint Configuration (i18n and custom AST rules)
// Handles: TypeScript files for i18n checking and custom syntax rules
// ============================================================

export const eslintConfig: EslintConfig = {
  ignores: [
    ".dist",
    ".next",
    ".tmp",
    "postcss.config.mjs",
    "node_modules",
    ".git",
    "coverage",
    "public",
    "drizzle",
    ".vscode",
    ".vibe-guard-instance",
    ".github",
    ".claude",
    "to_migrate",
    "postgres_data",
    ".nyc_output",
    "build",
    "*.min.js",
    "**/*.d.ts",
  ],
  files: ["**/*.ts", "**/*.tsx", "**/*.d.ts"],
  i18n: {
    enabled: enableI18n,
    config: {
      files: ["**/*.{ts,tsx}"],
      ignores: [
        ".tmp",
        "src/i18n/**",
        "**/i18n/**",
        "**/*.db.ts",
        "**/db.ts",
        "**/*.seed.ts",
        "**/seed.ts",
        "**/*.seeds.ts",
        "**/seeds.ts",
        "**/*.test.ts",
        "**/*.cron.ts",
        "**/cron.ts",
        "**/env.ts",
        "**/env-client.ts",
        "next.config.ts",
        "drizzle.config.ts",
        "**/*schema.ts",
        "to_migrate",
      ],
      rules: {
        "i18next/no-literal-string": [
          "error",
          {
            framework: "react",
            mode: "all",
            validateTemplate: true,
            "should-validate-template": true,
            callees: {
              exclude: [
                "createEndpoint",
                "createFormEndpoint",
                "router.push",
                "middlewareInfoLogger",
                "middlewareErrorLogger",
                "middlewareDebugLogger",
                "cookiesStore.delete",
                "new URL",
                "cookiesStore.set",
                "pgEnum",
                "cva",
                "cn",
                "logTranslationError",
                "logger.info",
                "setNestedPath",
                "logger.warn",
                "logger.error",
                "logger.debug",
                "logger.vibe",
                "sql",
              ],
            },
            "object-properties": {
              exclude: [
                "id",
                "key",
                "type",
                "className",
                "*ClassName",
                "imageUrl",
                "style",
                "path",
                "href",
                "to",
                "data",
                "alg",
                "backgroundColor",
                "borderRadius",
                "color",
                "fontSize",
                "lineHeight",
                "padding",
                "textDecoration",
                "marginTop",
                "marginBottom",
                "margin",
                "value",
                "email",
                "displayName",
              ],
            },
            "jsx-attributes": {
              exclude: [
                "className",
                "*ClassName",
                "id",
                "data-testid",
                "to",
                "href",
                "style",
                "target",
                "rel",
                "type",
                "src",
              ],
            },
            "jsx-components": { exclude: ["Trans"] },
            words: {
              exclude: [
                // single-character punctuation
                `^[\\[\\]\\{\\}\\—\\<\\>\\•\\+\\%\\#\\@\\.\\:\\-\\_\\*\\;\\,\\/]$`,
                // numbers
                `^\\d+$`,
                // dotted keys
                `^[^\\s]+\\.[^\\s]+$`,
                // image/file extensions
                `\\.(?:jpe?g|png|svg|webp|gif)$`,
                // URLs and paths
                `^(?:https?://|/)[^\\s]*$`,
                // @mentions or #tags
                `^[#@]\\w+$`,
                // all-lowercase words
                `^[a-z]+$`,
                // camelCase
                `^[a-z]+(?:[A-Z][a-zA-Z0-9]*)*$`,
                // hyphen-separated
                `^[^\\s]+(?:-[^\\s]+)+$`,
                // slash paths
                `^[^\\s]+\\/(?:[^\\s]*)$`,
                // ALL-CAPS
                `^[A-Z]+(?:_[A-Z]+)*$`,
                // use client/server/custom directives
                `^use (?:client|server|custom)$`,
              ],
            },
            validComponents: ["Trans"],
            ignoreAttribute: [
              "aria-labelledby",
              "aria-describedby",
            ],
          },
        ],
      },
    },
  },
  customRules: {
    "no-restricted-syntax": [
      "error",
      {
        selector: "TSUnknownKeyword",
        message:
          "Usage of the 'unknown' type isn't allowed. Consider using generics with interface or type alias for explicit structure.",
      },
      {
        selector: "TSObjectKeyword",
        message:
          "Usage of the 'object' type isn't allowed. Consider using generics with interface or type alias for explicit structure.",
      },
      {
        selector: "ThrowStatement",
        message:
          "Usage of 'throw' statements is not allowed. Use proper ResponseType<T> patterns instead.",
      },
      {
        selector: "Property[value.type='JSXElement']:not([key.name='icon'])",
        message:
          "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
      },
      {
        selector: "Property[value.type='JSXFragment']:not([key.name='icon'])",
        message:
          "JSX fragments inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
      },
      {
        selector:
          "Property[value.type='ParenthesizedExpression']:not([key.name='icon']) > ParenthesizedExpression > JSXElement",
        message:
          "JSX elements inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
      },
      {
        selector:
          "Property[value.type='ParenthesizedExpression']:not([key.name='icon']) > ParenthesizedExpression > JSXFragment",
        message:
          "JSX fragments inside object literals are not allowed. Extract JSX to a separate function to ensure i18n rules work properly.",
      },
    ],
  },
  ruleOverrides: {
    typescript: {
      "@typescript-eslint/return-await": ["error", "always"],
      "@typescript-eslint/explicit-member-accessibility": [
        "error",
        { accessibility: "no-public" },
      ],
      "@typescript-eslint/prefer-optional-chain": "error",
      "@typescript-eslint/no-unnecessary-condition": "off",
      "@typescript-eslint/prefer-nullish-coalescing": "off",
      "@typescript-eslint/strict-boolean-expressions": "off",
    },
    promise: {
      "promise/no-return-wrap": "error",
      "promise/no-nesting": "warn",
    },
    import: {
      // ESLint handles these with proper TypeScript module resolution
      "import/namespace": "error",
      "import/no-unresolved": "error",
      "import/no-unassigned-import": [
        "error",
        {
          allow: ["server-only", "**/*.css", "**/*.scss"],
        },
      ],
      "import/extensions": [
        "error",
        "ignorePackages",
        {
          ts: "never",
          tsx: "never",
          js: "never",
          jsx: "never",
          json: "always",
        },
      ],
    },
    react: {
      "react-compiler/react-compiler": "error",
    },
    custom: {
      "@c-ehrlich/use-server/no-top-level-use-server": "error",
    },
  },
  parserOptions: {
    project: "./tsconfig.json",
    tsconfigRootDir: ".",
  },
};

// ============================================================
// Prettier Configuration
// ============================================================

export const prettierConfig: PrettierConfig = {
  semi: true,
  singleQuote: false,
  trailingComma: "all",
  tabWidth: 2,
  useTabs: false,
  printWidth: 80,
  arrowParens: "always",
  endOfLine: "lf",
  bracketSpacing: true,
  jsxSingleQuote: false,
  jsxBracketSameLine: false,
  proseWrap: "preserve",
};

// ============================================================
// Combined Export
// ============================================================

export const config: OxlintPrettierEslintConfig = {
  oxlint: oxlintConfig,
  eslint: eslintConfig,
  prettier: prettierConfig,
};

// Export as default for easier imports
export default config;
