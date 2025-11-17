/* eslint-disable i18next/no-literal-string */
/**
 * Unified Lint Configuration (Oxlint + ESLint + Prettier)
 *
 * This file provides a single source of truth for all linting and formatting configuration.
 * It supports both oxlint (fast Rust linter) and ESLint (for features oxlint doesn't support).
 *
 * Division of Responsibilities:
 * - Oxlint: Handles JS/TS/TSX files for fast linting (core rules, TypeScript, React, i18n, restricted-syntax)
 * - ESLint: Handles import sorting, React hooks, and TypeScript-specific rules that oxlint doesn't support yet
 * - Prettier: Handles code formatting
 */

import type {
  EslintConfig,
  OxlintConfig,
  OxlintPrettierEslintConfig,
  PrettierConfig,
} from "./src/app/api/[locale]/v1/core/system/check/oxlint/types";

// Get project root directory (process is available at runtime via Node.js)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const projectRoot = (globalThis as any).process?.cwd() ?? "";

// ============================================================
// Configuration Switches
// ============================================================

const enableI18n = true;
const enableReactRules = true;
const enableAccessibilityRules = true;
const enableImportRules = false;
const enablePromiseRules = true;
const enableNodeRules = true;
const enablePedanticRules = false;

// ============================================================
// Oxlint Configuration
// ============================================================

export const oxlintConfig: OxlintConfig = {
  $schema: "https://docs.rs/oxc_linter/latest/oxc_linter/schema.json",

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
    "*.min.js",
    "next-env.d.ts",
    "nativewind-env.d.ts",
    // Test and development files
    "**/*test-files/**",
  ],
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

  jsPlugins: [
    `${projectRoot}/src/app/api/[locale]/v1/core/system/check/oxlint/plugins/restricted-syntax/src/index.ts`,
    ...(enableI18n
      ? [
          `${projectRoot}/src/app/api/[locale]/v1/core/system/check/oxlint/plugins/i18n/src/index.ts`,
        ]
      : []),
  ],

  categories: {
    correctness: "error",
    suspicious: "error",
    pedantic: enablePedanticRules ? "error" : "off",
    style: "off",
  },

  rules: {
    // ========================================
    // Core ESLint Rules
    // ========================================
    "no-debugger": "error",
    "no-console": "error",
    curly: "error",
    eqeqeq: "error",
    "no-undef": "off",
    camelcase: "error",
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
    "typescript/prefer-includes": "error",
    "typescript/prefer-string-starts-ends-with": "error",
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
    // We use classes for autocomplete on a domain
    "no-extraneous-class": "off",

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

      // React Hooks (handled by ESLint as oxlint doesn't support these yet)
      // "react/rules-of-hooks": "error", // Moved to ESLint-only
      // "react/exhaustive-deps": "error", // Moved to ESLint-only
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
    ...(enableImportRules
      ? {
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
        }
      : {}),

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
    "oxc/no-optional-chaining": "off",
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
    // Custom JS Plugin Rules
    // ========================================
    "oxlint-plugin-restricted/restricted-syntax": "error",
    "oxlint-plugin-i18n/no-literal-string": [
      "error",
      {
        words: {
          exclude: [
            // single-character punctuation (including parentheses)
            `^[\\[\\]\\{\\}\\—\\<\\>\\•\\+\\%\\#\\@\\.\\:\\-\\_\\*\\;\\,\\/\\(\\)]+$`,
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
            // SVG path data
            `^[MmLlHhVvCcSsQqTtAaZz0-9\\s,.-]+$`,
            // Technical symbols and emoji used as UI elements (not translatable text)
            `^[▶◀▲▼►◄▴▾►◄✅✕✔✓🔧]+$`,
            // CSS-like values with units or technical notation
            `^[\\d\\s]+(?:px|em|rem|%|vh|vw|deg|rad)?(?:\\s+[\\d]+)*$`,
            // url() notation
            `^url\\([^)]+\\)$`,
            // translate/rotate/scale transforms
            `^(?:translate|rotate|scale|matrix|skew)\\([^)]+\\)$`,
            // Keyboard key indicators (technical, not translatable)
            `^(?:Esc|Enter|Tab|Shift|Ctrl|Alt|Cmd|Space|Backspace|Delete|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|F\\d+)$`,
            // Single character technical indicators
            `^[A-Z0-9]{1,2}$`,
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
            // SVG attributes (technical, not translatable)
            "viewBox",
            "d",
            "fill",
            "stroke",
            "transform",
            "gradientTransform",
            "gradientUnits",
            "cn",
            "cx",
            "cy",
            "r",
            "fx",
            "fy",
            "offset",
            "stopColor",
            "stopOpacity",
            "width",
            "height",
            "x",
            "y",
            "x1",
            "x2",
            "y1",
            "y2",
            "strokeWidth",
            "strokeLinecap",
            "strokeLinejoin",
            "fillRule",
            "clipRule",
            "opacity",
            "xmlns",
            "xmlnsXlink",
            // Accessibility attributes that contain technical or context-dependent text
            "aria-label",
            "aria-labelledby",
            "aria-describedby",
            "title",
            "placeholder",
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
      },
    ],

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
    next: {
      rootDir: ["."],
    },
    react: {
      formComponents: [],
      linkComponents: [],
    },
    jsdoc: {
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
};

// ============================================================
// ESLint Configuration
// ============================================================

// export const eslintConfig: EslintConfig = {
//   ignores: [
//     ".dist",
//     ".next",
//     ".tmp",
//     "postcss.config.mjs",
//     "node_modules",
//     ".git",
//     "coverage",
//     "public",
//     "drizzle",
//     ".vscode",
//     ".vibe-guard-instance",
//     ".github",
//     ".claude",
//     "to_migrate",
//     "postgres_data",
//     ".nyc_output",
//     "build",
//     "*.min.js",
//     "**/*.d.ts",
//   ],
//   files: ["**/*.ts", "**/*.tsx", "**/*.d.ts"],
//   eslintOnlyRules: {
//     "simple-import-sort/imports": "error",
//     "simple-import-sort/exports": "error",
//     "unused-imports/no-unused-imports": "off",
//     "import/first": "error",
//     "import/no-duplicates": "error",
//     "import/newline-after-import": "error",
//     "react-hooks/rules-of-hooks": "error",
//     "react-hooks/exhaustive-deps": "error",
//     "react-compiler/react-compiler": "error",
//     "@c-ehrlich/use-server/no-top-level-use-server": "error",
//   },

//   ruleOverrides: {
//     typescript: {},
//     promise: {
//       "promise/no-return-wrap": "error",
//       "promise/no-nesting": "warn",
//     },
//     import: {
//       "import/first": "error",
//       "import/no-duplicates": "error",
//       "import/newline-after-import": "error",
//     },
//   },
//   parserOptions: {
//     project: "./tsconfig.json",
//     tsconfigRootDir: ".",
//   },
// };

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
// I18n Plugin Configuration
// ============================================================

export const i18nPluginConfig = {
  words: {
    exclude: [
      `^[\\[\\]\\{\\}\\—\\<\\>\\•\\+\\%\\#\\@\\.\\:\\-\\_\\*\\;\\,\\/\\(\\)]+$`,
      `^\\s+$`,
      `^\\d+$`,
      `^[^\\s]+\\.[^\\s]+$`,
      `\\.(?:jpe?g|png|svg|webp|gif|csv|json|xml|pdf)$`,
      `^(?:https?://|/)[^\\s]*$`,
      `^[#@]\\w+$`,
      `^[a-z]+$`,
      `^[a-z]+(?:[A-Z][a-zA-Z0-9]*)*$`,
      `^[^\\s]+(?:-[^\\s]+)+$`,
      `^[^\\s]+\\/(?:[^\\s]*)$`,
      `^[A-Z]+(?:_[A-Z]+)*$`,
      `^use (?:client|server|custom)$`,
      `^&[a-z]+;$`,
      // SVG path data
      `^[MmLlHhVvCcSsQqTtAaZz0-9\\s,.-]+$`,
      // Technical symbols and emoji used as UI elements (not translatable text)
      `^[▶◀▲▼►◄▴▾►◄✅✕✔✓🔧]+$`,
      // CSS-like values with units or technical notation
      `^[\\d\\s]+(?:px|em|rem|%|vh|vw|deg|rad)?(?:\\s+[\\d]+)*$`,
      // url() notation
      `^url\\([^)]+\\)$`,
      // translate/rotate/scale transforms
      `^(?:translate|rotate|scale|matrix|skew)\\([^)]+\\)$`,
      // Keyboard key indicators (technical, not translatable)
      `^(?:Esc|Enter|Tab|Shift|Ctrl|Alt|Cmd|Space|Backspace|Delete|ArrowUp|ArrowDown|ArrowLeft|ArrowRight|F\\d+)$`,
      // Single character technical indicators
      `^[A-Z0-9]{1,2}$`,
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
      // SVG attributes (technical, not translatable)
      "viewBox",
      "d",
      "fill",
      "stroke",
      "transform",
      "gradientTransform",
      "gradientUnits",
      "cx",
      "cy",
      "r",
      "fx",
      "fy",
      "offset",
      "stopColor",
      "stopOpacity",
      "width",
      "height",
      "x",
      "y",
      "x1",
      "x2",
      "y1",
      "y2",
      "strokeWidth",
      "strokeLinecap",
      "strokeLinejoin",
      "fillRule",
      "clipRule",
      "opacity",
      "xmlns",
      "xmlnsXlink",
      // Accessibility attributes that contain technical or context-dependent text
      "aria-label",
      "aria-labelledby",
      "aria-describedby",
      "title",
      "placeholder",
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
};

// ============================================================
// Combined Export
// ============================================================

export const config: OxlintPrettierEslintConfig = {
  oxlint: oxlintConfig,
  // eslint: eslintConfig,
  prettier: prettierConfig,
};

export default config;
