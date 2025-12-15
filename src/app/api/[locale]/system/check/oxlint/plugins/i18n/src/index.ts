/**
 * Oxlint JS Plugin: i18n No Literal String
 *
 * Detects untranslated literal strings in JSX and code.
 * Configuration is loaded from check.config.ts via the shared config loader.
 *
 * Supports:
 * - Bun runtime (direct TypeScript)
 * - Node.js runtime (compiled JavaScript)
 * - NPM package installation
 * - Local development
 */

import type { I18nPluginConfig } from "../../../../config/types";
import type {
  JSXAttribute,
  JSXIdentifier,
  JSXLiteral,
  OxlintASTNode,
  OxlintRuleContext,
} from "../../../types";
import type {
  createPluginMessages,
  loadPluginConfig,
} from "../../shared/config-loader";

// ============================================================
// Types
// ============================================================

/** Extended rule context with i18n options */
interface I18nRuleContext extends OxlintRuleContext {
  options?: I18nPluginConfig[];
}

/** Default error messages (can be customized via config) */
interface I18nMessages {
  jsxText: string;
  jsxExpression: string;
  jsxAttribute: string;
}

// ============================================================
// Default Configuration
// ============================================================

const DEFAULT_CONFIG: I18nPluginConfig = {
  words: {
    exclude: [
      // Punctuation and symbols only
      String.raw`^[\[\]{}—<>•+%#@.:_*;,/()\-]+$`,
      // Whitespace only
      String.raw`^\s+$`,
      // Numbers only
      String.raw`^\d+$`,
      // File extensions
      String.raw`^[^\s]+\.[^\s]+$`,
      // URLs and paths
      String.raw`^(?:https?://|/)[^\s]*$`,
    ],
  },
  "jsx-attributes": {
    exclude: [
      "className",
      "href",
      "src",
      "alt",
      "id",
      "name",
      "type",
      "value",
      "key",
      "ref",
      "*ClassName",
      "*Style",
      "*Variant",
      "*Size",
      "*Color",
    ],
  },
  "object-properties": {
    exclude: [],
  },
};

const DEFAULT_MESSAGES: I18nMessages = {
  jsxText: 'Literal string "{value}" should be translated using i18n.',
  jsxExpression:
    'Literal string "{value}" in JSX expression should be translated.',
  jsxAttribute:
    'Literal string "{value}" in JSX attribute should be translated.',
};

// ============================================================
// Dynamic Import for Shared Loader
// ============================================================

// Plugin config loader (lazy loaded to handle various runtime environments)
let configLoader: {
  loadPluginConfig: typeof loadPluginConfig;
  createPluginMessages: typeof createPluginMessages;
} | null = null;

let cachedConfig: I18nPluginConfig | null = null;
let cachedMessages: I18nMessages | null = null;

/**
 * Load the shared config loader module
 * Uses dynamic require to handle different runtime environments
 */
function getConfigLoader(): typeof configLoader {
  if (configLoader) {
    return configLoader;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports -- Plugin context requires sync loading
    configLoader = require("../../shared/config-loader") as typeof configLoader;
    return configLoader;
  } catch {
    // Shared loader not available, will use fallback
    return null;
  }
}

/**
 * Load i18n config using shared loader or fallback
 */
function loadI18nConfig(): I18nPluginConfig {
  if (cachedConfig !== null) {
    return cachedConfig;
  }

  const loader = getConfigLoader();

  if (loader) {
    const result = loader.loadPluginConfig(
      "oxlint-plugin-i18n/no-literal-string",
      DEFAULT_CONFIG,
    );
    cachedConfig = result.config ?? DEFAULT_CONFIG;
  } else {
    // Fallback: try direct require of check.config.ts
    cachedConfig = loadConfigFallback();
  }

  return cachedConfig;
}

/**
 * Fallback config loading when shared loader is not available
 */
function loadConfigFallback(): I18nPluginConfig {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports, @typescript-eslint/no-unsafe-assignment -- Plugin fallback requires dynamic loading
    const config = require(`${process.cwd()}/check.config.ts`);
    const checkConfig = config.default ?? config;
    const exported =
      typeof checkConfig === "function" ? checkConfig() : checkConfig;

    const ruleConfig =
      exported?.oxlint?.rules?.["oxlint-plugin-i18n/no-literal-string"];
    if (Array.isArray(ruleConfig) && ruleConfig[1]) {
      return ruleConfig[1] as I18nPluginConfig;
    }
  } catch {
    // Config not available
  }

  return DEFAULT_CONFIG;
}

/**
 * Get error messages (supports customization via config)
 */
function getMessages(): I18nMessages {
  if (cachedMessages !== null) {
    return cachedMessages;
  }
  cachedMessages = DEFAULT_MESSAGES;
  return cachedMessages;
}

/**
 * Format a message with value substitution
 */
function formatMessage(template: string, value: string): string {
  return template.replaceAll("{value}", value);
}

// ============================================================
// Rule Implementation
// ============================================================

const noLiteralStringRule = {
  meta: {
    type: "problem",
    docs: {
      description: "Disallow literal strings that should be internationalized",
      category: "Best Practices",
      recommended: true,
    },
    schema: [
      {
        type: "object",
        properties: {
          words: {
            type: "object",
            properties: {
              exclude: { type: "array", items: { type: "string" } },
            },
          },
          "jsx-attributes": {
            type: "object",
            properties: {
              exclude: { type: "array", items: { type: "string" } },
            },
          },
          "object-properties": {
            type: "object",
            properties: {
              exclude: { type: "array", items: { type: "string" } },
            },
          },
        },
      },
    ],
  },
  create(
    context: I18nRuleContext,
  ): Record<string, (node: OxlintASTNode) => void> {
    // Load config from check.config.ts (single source of truth)
    // Falls back to rule options if config file not available
    const configFromFile = loadI18nConfig();
    const ruleOptions = context.options?.[0] ?? {};

    // Merge: rule options override file config
    const options: I18nPluginConfig = {
      ...configFromFile,
      ...ruleOptions,
      words: {
        ...configFromFile.words,
        ...ruleOptions.words,
      },
      "jsx-attributes": {
        ...configFromFile["jsx-attributes"],
        ...ruleOptions["jsx-attributes"],
      },
    };

    const messages = getMessages();

    // Convert string patterns to RegExp with Unicode support
    const wordExclusionPatterns = (options.words?.exclude ?? []).map(
      (pattern: string) => new RegExp(pattern, "u"),
    );
    const excludedAttributes = options["jsx-attributes"]?.exclude ?? [];

    // Helper: Check if a string should be excluded
    const shouldExcludeString = (value: string): boolean => {
      if (!value || typeof value !== "string") {
        return true;
      }

      // Check all word exclusion patterns
      for (const pattern of wordExclusionPatterns) {
        if (pattern.test(value)) {
          return true;
        }
      }

      return false;
    };

    // Helper: Check if JSX attribute is excluded
    const isExcludedAttribute = (attrName: string): boolean => {
      return excludedAttributes.some((excluded: string) => {
        if (excluded.startsWith("*")) {
          return attrName.endsWith(excluded.slice(1));
        }
        return attrName === excluded;
      });
    };

    return {
      // JSX Text nodes
      JSXText(node: OxlintASTNode): void {
        // eslint-disable-next-line oxlint-plugin-restricted/restricted-syntax -- AST node parsing: Node values from the parser are unknown until runtime type checking
        const value = (node as { value?: unknown }).value;
        if (typeof value !== "string") {
          return;
        }
        const trimmed = value.trim();

        if (trimmed && !shouldExcludeString(trimmed)) {
          context.report({
            node,
            message: formatMessage(messages.jsxText, trimmed),
          });
        }
      },

      // String literals in JSX expressions
      "JSXExpressionContainer > Literal"(node: OxlintASTNode): void {
        const value = (node as JSXLiteral).value;
        if (typeof value === "string" && !shouldExcludeString(value)) {
          context.report({
            node,
            message: formatMessage(messages.jsxExpression, value),
          });
        }
      },

      // JSX Attribute values
      JSXAttribute(node: OxlintASTNode): void {
        const attrNode = node as JSXAttribute;
        const nameNode = attrNode.name;

        if (!nameNode) {
          return;
        }

        // Get the attribute name string
        const attrName: string =
          (nameNode as JSXIdentifier).name ?? String(nameNode);

        // Skip ALL excluded attributes
        if (isExcludedAttribute(attrName)) {
          return;
        }

        // For non-excluded attributes, check if the value is a literal string
        const valueNode = attrNode.value;
        if (!valueNode) {
          return;
        }

        if (valueNode.type === "Literal") {
          const literalValue = (valueNode as JSXLiteral).value;
          if (
            typeof literalValue === "string" &&
            !shouldExcludeString(literalValue)
          ) {
            context.report({
              node: valueNode,
              message: formatMessage(messages.jsxAttribute, literalValue),
            });
          }
        }
      },
    };
  },
};

// ============================================================
// Plugin Export
// ============================================================

export default {
  meta: {
    name: "oxlint-plugin-i18n",
    version: "1.0.0",
  },
  rules: {
    "no-literal-string": noLiteralStringRule,
  },
};

// Named exports for direct access
export { DEFAULT_CONFIG as defaultConfig };
export { DEFAULT_MESSAGES as defaultMessages };
export type { I18nMessages, I18nPluginConfig };
