/* eslint-disable i18next/no-literal-string */
/**
 * Unified Check Configuration
 *
 * Single source of truth for all code quality tools:
 * - Oxlint (fast Rust linter)
 * - ESLint (import sorting, react hooks)
 * - Prettier (code formatting)
 * - TypeScript (type checking)
 * - Testing (vitest)
 * - VSCode integration
 *
 * Usage: This config is automatically loaded by the check modules.
 * Run `vibe lint --create-config` to regenerate from template.
 */

import reactCompilerPlugin from "eslint-plugin-react-compiler";
import reactHooksPlugin from "eslint-plugin-react-hooks";
import simpleImportSortPlugin from "eslint-plugin-simple-import-sort";
import type {
  CheckConfig,
  EslintFlatConfigItem,
} from "next-vibe/system/check/config/types";
import tseslint from "typescript-eslint";

// ============================================================
// Stub plugins for oxlint rules (so ESLint doesn't error on disable comments)
// ============================================================

// No-op rule factory - returns a rule that does nothing
const noopRule: {
  create: () => Record<string, never>;
  meta: { docs: { description: string } };
} = {
  create: (): Record<string, never> => ({}),
  meta: { docs: { description: "Stub rule - handled by oxlint" } },
};

// Stub plugin for i18next rules (handled by oxlint)
const i18nextStubPlugin = {
  rules: {
    "no-literal-string": noopRule,
  },
};

// Stub plugin for oxlint custom rules
const oxlintPluginRestrictedStub = {
  rules: {
    "restricted-syntax": noopRule,
  },
};

// Stub plugin for oxlint jsx-capitalization
const oxlintPluginJsxCapitalizationStub = {
  rules: {
    "jsx-capitalization": noopRule,
  },
};

// Stub plugin for oxlint i18n
const oxlintPluginI18nStub = {
  rules: {
    "no-literal-string": noopRule,
  },
};

// Stub plugin for @typescript-eslint rules (handled by oxlint)
const typescriptEslintStub = {
  rules: {
    "no-explicit-any": noopRule,
    "no-unused-vars": noopRule,
    "no-empty-function": noopRule,
    "no-empty-object-type": noopRule,
    "no-floating-promises": noopRule,
    "require-await": noopRule,
    "only-throw-error": noopRule,
    "no-unsafe-assignment": noopRule,
    "triple-slash-reference": noopRule,
    "consistent-type-definitions": noopRule,
    "no-require-imports": noopRule,
    "no-unsafe-function-type": noopRule,
    "explicit-function-return-type": noopRule,
    "no-namespace": noopRule,
    "no-unsafe-enum-comparison": noopRule,
    "consistent-type-imports": noopRule,
    "no-unnecessary-condition": noopRule,
    "no-base-to-string": noopRule,
    "no-unsafe-member-access": noopRule,
  },
};

// Stub plugin for eslint-plugin-unicorn rules (handled by oxlint)
const unicornStubPlugin = {
  rules: {
    "require-module-specifiers": noopRule,
  },
};

// Stub plugin for prettier (not used in check, only for eslint-disable comments)
const prettierStubPlugin = {
  rules: {
    prettier: noopRule,
  },
};

// Stub plugin for promise (some rules handled by oxlint)
const promiseStubPlugin = {
  rules: {
    "no-multiple-resolved": noopRule,
  },
};

// Stub plugin for eslint-plugin-next rules
const eslintPluginNextStub = {
  rules: {
    "no-html-link-for-pages": noopRule,
    "no-img-element": noopRule,
    "no-assign-module-variable": noopRule,
  },
};

// Stub plugin for @next/next rules
const nextNextStub = {
  rules: {
    "no-img-element": noopRule,
  },
};

// Stub plugin for eslint core rules (when prefixed)
const eslintCoreStub = {
  rules: {
    "no-template-curly-in-string": noopRule,
  },
};

// Stub plugin for jsx-a11y rules
const jsxA11yStub = {
  rules: {
    "prefer-tag-over-role": noopRule,
  },
};

// Stub plugin for oxc rules
const oxcStub = {
  rules: {
    "only-used-in-recursion": noopRule,
  },
};

// Stub plugin for eslint-plugin-import rules
const eslintPluginImportStub = {
  rules: {
    "no-named-as-default": noopRule,
  },
};

// Stub plugin for i18n rules (separate from i18next)
const i18nStub = {
  rules: {
    "no-literal-string": noopRule,
  },
};

// ============================================================
// Feature Switches
// ============================================================

const features = {
  i18n: true,
  react: true,
  accessibility: true,
  import: false,
  promise: true,
  node: true,
  pedantic: false,
} as const;

// ============================================================
// Shared Ignore Patterns (Single Source of Truth)
// ============================================================

// Base directories to ignore - used by all tools
const baseIgnoredDirectories = [
  "dist",
  ".dist",
  ".next",
  ".tmp",
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
  "test-files",
  "test-project",
] as const;

// Additional files to ignore
const baseIgnoredFiles = [
  ".DS_Store",
  "thumbs.db",
  "postcss.config.mjs",
  ".gitignore",
  ".env",
  ".env.local",
  ".env.development",
  ".env.production",
  "*.min.js",
  "next-env.d.ts",
  "nativewind-env.d.ts",
] as const;

// Glob-style patterns for tools that support them (oxlint, eslint)
const ignorePatterns = [
  ...baseIgnoredDirectories,
  ...baseIgnoredFiles.filter((f) => !f.startsWith(".")), // Non-hidden files
  // Glob patterns for nested directories
  "**/test-files/**",
  "**/test-project/**",
  "**/plugins/**/dist/**",
] as const;

// ============================================================
// ESLint Flat Config (directly used by .tmp/eslint.config.mjs)
// ============================================================

const eslintRules = {
  "simple-import-sort/imports": "error",
  "simple-import-sort/exports": "error",
  "react-hooks/rules-of-hooks": "error",
  "react-hooks/exhaustive-deps": "error",
  "react-compiler/react-compiler": "error",
  // Disable rules that oxlint handles
  "no-unused-vars": "off", // oxlint typescript/no-unused-vars handles this
  "no-console": "off", // oxlint handles this
  "no-template-curly-in-string": "off", // oxlint handles this
  "no-control-regex": "off", // some patterns are intentional
  "prefer-template": "off", // oxlint handles this
} as const;

const eslintIgnores = ignorePatterns.map((pattern) => {
  if (pattern.startsWith("**/")) {
    return pattern;
  }
  if (pattern.includes("/")) {
    return `**/${pattern}/**`;
  }
  return `**/${pattern}/**`;
});

const eslintFlatConfig: EslintFlatConfigItem[] = [
  // Global ignores
  { ignores: eslintIgnores },

  // TypeScript files
  {
    files: ["**/*.ts", "**/*.tsx", "**/*.mts", "**/*.cts"],
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
        ecmaFeatures: { jsx: true },
      },
    },
    linterOptions: {
      // Don't report errors for eslint-disable comments referencing unknown rules
      // (oxlint rules like i18next/no-literal-string are handled separately)
      reportUnusedDisableDirectives: "off",
    },
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
      "react-hooks": reactHooksPlugin,
      "react-compiler": reactCompilerPlugin,
      // Stub plugins for oxlint rules (so ESLint ignores disable comments for them)
      i18next: i18nextStubPlugin,
      "oxlint-plugin-restricted": oxlintPluginRestrictedStub,
      "oxlint-plugin-jsx-capitalization": oxlintPluginJsxCapitalizationStub,
      "oxlint-plugin-i18n": oxlintPluginI18nStub,
      "@typescript-eslint": typescriptEslintStub,
      "typescript-eslint": typescriptEslintStub,
      "eslint-plugin-unicorn": unicornStubPlugin,
      prettier: prettierStubPlugin,
      "eslint-plugin-promise": promiseStubPlugin,
      // Additional stub plugins for rules handled by oxlint
      "eslint-plugin-next": eslintPluginNextStub,
      "@next/next": nextNextStub,
      eslint: eslintCoreStub,
      "jsx-a11y": jsxA11yStub,
      oxc: oxcStub,
      "eslint-plugin-import": eslintPluginImportStub,
      i18n: i18nStub,
    },
    rules: eslintRules,
  },

  // JavaScript files
  {
    files: ["**/*.js", "**/*.jsx", "**/*.mjs", "**/*.cjs"],
    linterOptions: {
      reportUnusedDisableDirectives: "off",
    },
    plugins: {
      "simple-import-sort": simpleImportSortPlugin,
      "react-hooks": reactHooksPlugin,
      // Stub plugins for oxlint rules
      i18next: i18nextStubPlugin,
      "oxlint-plugin-restricted": oxlintPluginRestrictedStub,
      "@typescript-eslint": typescriptEslintStub,
      "eslint-plugin-unicorn": unicornStubPlugin,
      prettier: prettierStubPlugin,
      "eslint-plugin-promise": promiseStubPlugin,
      // Additional stub plugins
      "eslint-plugin-next": eslintPluginNextStub,
      "@next/next": nextNextStub,
      eslint: eslintCoreStub,
      "jsx-a11y": jsxA11yStub,
      oxc: oxcStub,
      "eslint-plugin-import": eslintPluginImportStub,
      i18n: i18nStub,
    },
    rules: {
      "simple-import-sort/imports": "error",
      "simple-import-sort/exports": "error",
      "react-hooks/rules-of-hooks": "error",
      "react-hooks/exhaustive-deps": "error",
      // Disable rules that oxlint handles
      "no-unused-vars": "off",
      "no-console": "off",
      "no-template-curly-in-string": "off",
      "no-control-regex": "off",
      "prefer-template": "off",
    },
  },
];

// ============================================================
// Restricted Syntax Configuration (for oxlint JS plugin)
// ============================================================

const restrictedSyntaxConfig = {
  // Properties that commonly accept JSX/React nodes as values
  // These are allowed to have JSX in object literals
  jsxAllowedProperties: [
    "icon",
    "content",
    "title",
    "description",
    "children",
    "header",
    "footer",
    "element",
    "component",
    "label",
    "placeholder",
    "tooltip",
    "badge",
    "prefix",
    "suffix",
    "startAdornment",
    "endAdornment",
    "emptyState",
    "fallback",
  ],
} as const;

// ============================================================
// JSX Capitalization Configuration (for oxlint JS plugin)
// ============================================================

const jsxCapitalizationConfig = {
  // Paths to exclude from jsx-capitalization rule
  excludedPaths: [
    "/src/packages/next-vibe-ui/web/",
  ],
  // File patterns to exclude (email templates, test files)
  excludedFilePatterns: [
    "/email.tsx",
    ".email.tsx",
    "/test.tsx",
    ".test.tsx",
    ".spec.tsx",
    "/__tests__/",
  ],
  // Typography elements that should import from typography module
  typographyElements: ["h1", "h2", "h3", "h4", "p", "blockquote", "code"],
  // Elements with dedicated component files
  standaloneElements: ["span", "pre"],
  // SVG elements that need platform-independent handling
  svgElements: [
    "svg", "path", "circle", "rect", "line", "polyline", "polygon",
    "ellipse", "g", "text", "tspan", "defs", "linearGradient",
    "radialGradient", "stop", "clipPath", "mask", "pattern", "use",
    "symbol", "marker", "foreignObject",
  ],
  // Image-related elements
  imageElements: ["img", "picture"],
  // Common UI elements that should have wrapper components
  commonUiElements: [
    "div", "section", "article", "aside", "header", "footer", "main", "nav",
    "button", "input", "textarea", "select", "option", "label", "form",
    "fieldset", "legend", "ul", "ol", "li", "dl", "dt", "dd", "table",
    "thead", "tbody", "tfoot", "tr", "th", "td", "caption", "video", "audio",
    "source", "track", "canvas", "hr", "br", "iframe", "embed", "object",
    "details", "summary", "dialog", "menu", "figure", "figcaption", "time",
    "progress", "meter", "output", "strong", "em", "b", "i", "u", "s",
  ],
} as const;

// ============================================================
// I18n Configuration (shared between oxlint and standalone)
// ============================================================

const i18nConfig = {
  words: {
    exclude: [
      // single-character punctuation (including parentheses)
      // Note: —•<> and most punctuation don't need escaping inside character classes
      `^[\\[\\]{}—<>•+%#@.:_*;,/()\\-]+$`,
      // whitespace only
      `^\\s+$`,
      // numbers
      `^\\d+$`,
      // dotted keys
      `^[^\\s]+\\.[^\\s]+$`,
      // image/file extensions
      `\\.(?:jpe?g|png|svg|webp|gif|csv|json|xml|pdf)$`,
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
      // HTML entities
      `^&[a-z]+;$`,
      // SVG path data
      `^[MmLlHhVvCcSsQqTtAaZz0-9\\s,.-]+$`,
      // Technical symbols and emoji used as UI elements
      `^[▶◀▲▼►◄▴▾►◄✅✕✔✓🔧]+$`,
      // CSS-like values with units or technical notation
      `^[\\d\\s]+(?:px|em|rem|%|vh|vw|deg|rad)?(?:\\s+[\\d]+)*$`,
      // url() notation
      `^url\\([^)]+\\)$`,
      // translate/rotate/scale transforms
      `^(?:translate|rotate|scale|matrix|skew)\\([^)]+\\)$`,
      // Keyboard key indicators
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
      // SVG attributes
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
      // Accessibility attributes
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
} as const;

// ============================================================
// Plugin Configuration Exports
// (Used by oxlint JS plugins that need direct access)
// ============================================================

export const i18nPluginConfig = i18nConfig;
export const restrictedSyntaxPluginConfig = restrictedSyntaxConfig;
export const jsxCapitalizationPluginConfig = jsxCapitalizationConfig;

// ============================================================
// Unified Configuration Export
// ============================================================

const config: CheckConfig = {
  // --------------------------------------------------------
  // Feature Switches
  // --------------------------------------------------------
  features,

  // --------------------------------------------------------
  // Shared Ignore Patterns
  // --------------------------------------------------------
  ignorePatterns: [...ignorePatterns],

  // --------------------------------------------------------
  // Plugin Configurations
  // --------------------------------------------------------
  i18n: i18nConfig,
  restrictedSyntax: restrictedSyntaxConfig,
  jsxCapitalization: jsxCapitalizationConfig,

  // --------------------------------------------------------
  // Oxlint Configuration
  // --------------------------------------------------------
  oxlint: {
    $schema: "https://docs.rs/oxc_linter/latest/oxc_linter/schema.json",

    ignorePatterns: [...ignorePatterns],

    plugins: [
      "typescript",
      "oxc",
      "unicorn",
      ...(features.import ? ["import"] : []),
      ...(features.react ? ["react"] : []),
      ...(features.accessibility ? ["jsx-a11y"] : []),
      ...(features.promise ? ["promise"] : []),
      ...(features.node ? ["node"] : []),
      "nextjs",
    ],

    jsPlugins: [
      `next-vibe/src/app/api/[locale]/system/check/oxlint/plugins/restricted-syntax/src/index.ts`,
      `next-vibe/src/app/api/[locale]/system/check/oxlint/plugins/jsx-capitalization/src/index.ts`,
      ...(features.i18n
        ? [
            `next-vibe/src/app/api/[locale]/system/check/oxlint/plugins/i18n/src/index.ts`,
          ]
        : []),
    ],

    categories: {
      correctness: "error",
      suspicious: "error",
      pedantic: features.pedantic ? "error" : "off",
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
      "typescript/no-unused-vars": [
        "error",
        {
          vars: "all",
          args: "all",
          caughtErrors: "none",
          ignoreRestSiblings: false,
          argsIgnorePattern: "^$",
          varsIgnorePattern: "^$",
        },
      ],
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
      "no-extraneous-class": "off",

      // ========================================
      // React Rules
      // ========================================
      ...(features.react && {
        "react/jsx-key": "error",
        "react/jsx-no-duplicate-props": "error",
        "react/jsx-no-undef": "error",
        "react/jsx-uses-react": "off",
        "react/jsx-uses-vars": "error",
        "react/no-children-prop": "error",
        "react/no-deprecated": "error",
        "react/no-direct-mutation-state": "error",
        "react/no-unknown-property": "error",
        "react/self-closing-comp": "error",
        "react/react-in-jsx-scope": "off",
      }),

      // ========================================
      // Accessibility Rules (jsx-a11y)
      // ========================================
      ...(features.accessibility && {
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
      ...(features.import
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
      ...(features.promise && {
        "promise/param-names": "error",
        "promise/always-return": "error",
        "promise/catch-or-return": "error",
      }),

      // ========================================
      // Node Rules
      // ========================================
      ...(features.node && {
        "node/no-missing-import": "off",
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
      "oxlint-plugin-restricted/restricted-syntax": ["error", restrictedSyntaxConfig],
      "oxlint-plugin-jsx-capitalization/jsx-capitalization": ["error", jsxCapitalizationConfig],
      "oxlint-plugin-i18n/no-literal-string": ["error", i18nConfig],

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
  },

  // --------------------------------------------------------
  // Prettier Configuration
  // --------------------------------------------------------
  prettier: {
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
  },

  // --------------------------------------------------------
  // ESLint Configuration (for rules oxlint doesn't support)
  // --------------------------------------------------------
  eslint: {
    enabled: true,
    // Flat config array - directly imported by .tmp/eslint.config.mjs
    flatConfig: eslintFlatConfig,
    // Reference values for other tooling
    rules: eslintRules,
    ignores: eslintIgnores,
    timeout: 600_000, // 10 minutes
  },

  // --------------------------------------------------------
  // TypeCheck Configuration
  // --------------------------------------------------------
  typecheck: {
    command: "bunx tsgo ",
    alternativeCommand:
      'NODE_OPTIONS="--max-old-space-size=32768 --max-semi-space-size=1024" bunx tsc ',
    timeout: 900_000, // 15 minutes
    errorPatternTsc: String.raw`^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s*(.+)$`,
    errorPatternTsgo: String.raw`^(.+?):(\d+):(\d+)\s+-\s+(error|warning)\s+(TS\d+):\s*(.+)$`,
    flags: ["--noEmit", "--incremental", "--skipLibCheck"],
    skipLibCheck: true,
    incremental: true,
    nodeMemoryLimit: 32768,
  },

  // --------------------------------------------------------
  // Testing Configuration
  // --------------------------------------------------------
  testing: {
    command: "bunx vitest",
    timeout: 300_000, // 5 minutes
    include: ["**/*.test.ts", "**/*.test.tsx", "**/*.spec.ts", "**/*.spec.tsx"],
    exclude: [...ignorePatterns],
    coverage: {
      enabled: false,
      provider: "v8",
      thresholds: {
        lines: 80,
        branches: 80,
        functions: 80,
        statements: 80,
      },
    },
  },

  // --------------------------------------------------------
  // VSCode Integration
  // --------------------------------------------------------
  vscode: {
    autoGenerateSettings: true,
    settingsPath: "./.vscode/settings.json",
    settings: {
      oxc: {
        enable: true,
        lintRun: "onSave",
        configPath: ".tmp/.oxlintrc.json",
        fmtConfigPath: ".tmp/.oxfmtrc.json",
        fmtExperimental: true,
        typeAware: true,
        traceServer: "verbose",
      },
      editor: {
        formatOnSave: true,
        defaultFormatter: "oxc.oxc-vscode",
        codeActionsOnSave: {
          "source.fixAll.eslint": "explicit",
          "source.organizeImports": "explicit",
        },
      },
      typescript: {
        validateEnable: true,
        suggestAutoImports: true,
        preferTypeOnlyAutoImports: true,
        experimentalUseTsgo: true,
      },
      files: {
        eol: "\n",
      },
      search: {
        exclude: {
          "**/node_modules": true,
          "**/tsconfig.tsbuildinfo": true,
          "**/*.tmp": true,
          "**/*.next": true,
        },
      },
    },
  },

  // --------------------------------------------------------
  // File Extensions and Directories (use shared base arrays)
  // --------------------------------------------------------
  lintableExtensions: [".ts", ".tsx", ".d.ts", ".js", ".jsx", ".mjs", ".cjs"],

  ignoredDirectories: [...baseIgnoredDirectories],

  ignoredFiles: baseIgnoredFiles.filter((f) => !f.includes("*")),
};

export default config;
