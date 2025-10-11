import tsParser from "@typescript-eslint/parser";
import i18next from "eslint-plugin-i18next";
import globals from "globals";


// Clean up browser globals to remove any weird whitespace:
function cleanGlobals(globalsObj) {
  return Object.fromEntries(
    Object.entries(globalsObj).map(([key, value]) => [key.trim(), value])
  );
}

export const i18nConfig = [
  {
    // target all code files…
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
      "src/packages/next-vibe/testing/**",
      "src/packages/next-vibe/cli/**",
      "**/*schema.ts",
      "to_migrate",
    ],

    plugins: { i18next },
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
            ]
          },
          "object-properties": {
            exclude: [
              "id",
              "key",
              "type",
              "className",
              ".*ClassName$",
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
            ]
          },
          "jsx-attributes": {
            exclude: [
              "className",
              "id",
              "data-testid",
              "to",
              "href",
              "style",
              "target",
              "rel",
              "type",
              "src",
            ]
          },
          "jsx-components": { exclude: ["Trans"] },
          words: {
            exclude: [
              // single-character punctuation
              `^[\\[\\]\\{\\}\\—\\<\\>\\•\\+\\%\\#\\@\\.\\:\\-\\_\\*\\;\\,\\/]$`,

              // numbers
              `^\\d+$`,

              // dotted keys (e.g. errorTypes.validation_error)
              `^[^\\s]+\\.[^\\s]+$`,

              // image/file extensions
              `\\.(?:jpe?g|png|svg|webp|gif)$`,

              // URLs and absolute/relative paths
              `^(?:https?://|/)[^\\s]*$`,

              // @mentions or #tags
              `^[#@]\\w+$`,

              // all-lowercase words
              `^[a-z]+$`,

              // single camelCase word
              `^[a-z]+(?:[A-Z][a-zA-Z0-9]*)*$`,

              // hyphen-separated identifiers (e.g. react-dom or foo-bar-baz)
              `^[^\\s]+(?:-[^\\s]+)+$`,

              // slash-containing paths or globs (allow zero chars after slash)
              `^[^\\s]+\\/(?:[^\\s]*)$`,

              // ALL-CAPS with optional underscores
              `^[A-Z]+(?:_[A-Z]+)*$`,

              // exclude "use client" and "use server"
              `^use (?:client|server)$`
            ]
          },
          validComponents: [
            "Trans",
          ],
          ignoreAttribute: [
            "data-testid",
            "data-test",
            "data-cy",
            "dataTestId",
            "aria-labelledby",
            "aria-describedby"
          ],

        }
      ]
    }
  }
];

const config = [  
  ...i18nConfig,

  // Settings
  {
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
    plugins: {
      i18next,
    },
  },
]

export default config; 